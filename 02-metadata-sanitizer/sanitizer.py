"""Prepare and audit raw content files for a downstream publishing workflow."""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import date
from html import unescape
from pathlib import Path


SUPPORTED_EXTENSIONS = {".html", ".htm", ".txt"}
TAG_RE = re.compile(r"<[^>]*>", re.DOTALL)
BROKEN_TAG_RE = re.compile(r"<[^>\r\n]*$", re.MULTILINE)
TITLE_RE = re.compile(
    r"(?:<title[^>]*>|^\s*title\s*:\s*|^\s*#\s*)"
    r"(?P<value>.*?)(?:</title>|$)",
    re.IGNORECASE | re.MULTILINE,
)
DATE_RE = re.compile(
    r"(?:<meta[^>]+name\s*=\s*['\"]date['\"][^>]+content\s*=\s*['\"]|"
    r"^\s*date\s*:\s*)(?P<value>[^<'\"\r\n]+)",
    re.IGNORECASE | re.MULTILINE,
)
AUTHOR_RE = re.compile(
    r"(?:<meta[^>]+name\s*=\s*['\"]author['\"][^>]+content\s*=\s*['\"]|"
    r"^\s*author\s*:\s*)(?P<value>[^<'\"\r\n]+)",
    re.IGNORECASE | re.MULTILINE,
)
ASSET_ID_RE = re.compile(
    r"(?:<meta[^>]+name\s*=\s*['\"]asset[-_ ]?id['\"][^>]+content\s*=\s*['\"]|"
    r"^\s*asset[_ -]?id\s*:\s*)(?P<value>[^<'\"\r\n]+)",
    re.IGNORECASE | re.MULTILINE,
)


@dataclass
class Metadata:
    title: str
    date: str
    author: str
    asset_id: str
    title_valid: bool
    date_valid: bool
    author_valid: bool


def clean_value(value: str) -> str:
    """Normalize Unicode and collapse whitespace in one metadata value."""
    normalized = unicodedata.normalize("NFKC", unescape(value))
    return re.sub(r"\s+", " ", normalized).strip()


def extract_value(pattern: re.Pattern[str], raw_text: str) -> str:
    match = pattern.search(raw_text)
    return clean_value(match.group("value")) if match else ""


def is_iso_date(value: str) -> bool:
    """Return true only for a real calendar date written as YYYY-MM-DD."""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return False
    try:
        return date.fromisoformat(value).isoformat() == value
    except ValueError:
        return False


def extract_metadata(raw_text: str, source_name: str) -> Metadata:
    source_title = extract_value(TITLE_RE, raw_text)
    source_date = extract_value(DATE_RE, raw_text)
    source_author = extract_value(AUTHOR_RE, raw_text)
    asset_id = extract_value(ASSET_ID_RE, raw_text)
    fallback_title = clean_value(Path(source_name).stem.replace("_", " ").replace("-", " "))

    return Metadata(
        title=source_title or fallback_title,
        date=source_date or "Unknown",
        author=source_author or "Unknown",
        asset_id=asset_id,
        title_valid=bool(source_title),
        date_valid=is_iso_date(source_date),
        author_valid=bool(source_author),
    )


def sanitize_body(raw_text: str) -> str:
    """Remove HTML-like tags, decode entities, and normalize line whitespace."""
    text_without_tags = TAG_RE.sub(" ", raw_text)
    text_without_tags = BROKEN_TAG_RE.sub(" ", text_without_tags)
    return clean_value(text_without_tags)


def sanitize_file(source: Path, destination: Path) -> Metadata:
    """Write one cleaned text file and return its extracted metadata."""
    raw_text = source.read_text(encoding="utf-8", errors="replace")
    metadata = extract_metadata(raw_text, source.name)
    body = sanitize_body(raw_text)
    output = (
        f"Title: {metadata.title}\n"
        f"Date: {metadata.date}\n"
        f"Author: {metadata.author}\n\n"
        f"{body}\n"
    )
    destination.write_text(output, encoding="utf-8", newline="\n")
    return metadata


def validation_issues(metadata: Metadata) -> list[str]:
    issues = []
    if not metadata.title_valid:
        issues.append("Missing required metadata: Title")
    if not metadata.date_valid:
        issues.append("Date is missing or is not a valid YYYY-MM-DD date")
    if not metadata.author_valid:
        issues.append("Missing required metadata: Author")
    return issues


def process_folder(input_dir: Path, output_dir: Path) -> dict[str, object]:
    """Process each supported file, continuing after a per-file error."""
    output_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(
        (path for path in input_dir.iterdir() if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS),
        key=lambda path: path.name.casefold(),
    )
    stem_counts = Counter(path.stem.casefold() for path in files)
    seen_asset_ids: dict[str, str] = {}
    results: list[dict[str, object]] = []
    cms_assets: list[dict[str, object]] = []
    successful = 0
    warnings_count = 0

    for file_index, source in enumerate(files, start=1):
        duplicate_filename = stem_counts[source.stem.casefold()] > 1
        if duplicate_filename:
            destination_name = f"{source.name}.{file_index}.clean.txt"
        else:
            destination_name = f"{source.stem}.clean.txt"
        destination = output_dir / destination_name

        try:
            metadata = sanitize_file(source, destination)
            raw_text = source.read_text(encoding="utf-8", errors="replace")
            body = sanitize_body(raw_text)
            asset_key = metadata.asset_id.casefold()
            duplicate_asset_id = bool(asset_key and asset_key in seen_asset_ids)
            duplicate_of = seen_asset_ids.get(asset_key, "") if duplicate_asset_id else ""
            if asset_key and not duplicate_asset_id:
                seen_asset_ids[asset_key] = source.name

            issues = validation_issues(metadata)
            if duplicate_filename:
                issues.append("Duplicate filename stem; retained source name and sequence in cleaned filename")
            if duplicate_asset_id:
                issues.append(f"Duplicate asset ID also used by {duplicate_of}")
            status = "processed_with_warnings" if issues else "processed"
            successful += 1
            warnings_count += bool(issues)

            result: dict[str, object] = {
                "file": source.name,
                "cleaned_file": destination.name,
                "status": status,
                "metadata": asdict(metadata),
                "validation": {
                    "valid": not validation_issues(metadata),
                    "issues": validation_issues(metadata),
                },
                "duplicate_detection": {
                    "filename_stem": duplicate_filename,
                    "asset_id": duplicate_asset_id,
                    "duplicate_of": duplicate_of or None,
                },
                "warnings": issues,
            }
            results.append(result)
            cms_assets.append({
                "source_filename": source.name,
                "cleaned_filename": destination.name,
                "asset_id": metadata.asset_id or None,
                "title": metadata.title,
                "date": metadata.date if metadata.date_valid else None,
                "author": metadata.author if metadata.author_valid else None,
                "content_type": source.suffix.lower().lstrip("."),
                "body": body,
                "metadata_validation": {
                    "title": metadata.title_valid,
                    "date": metadata.date_valid,
                    "author": metadata.author_valid,
                    "valid": not validation_issues(metadata),
                    "issues": validation_issues(metadata),
                },
                "duplicate_detection": result["duplicate_detection"],
            })
        except Exception as error:  # A bad input should not stop the batch.
            results.append({
                "file": source.name,
                "cleaned_file": None,
                "status": "failed",
                "error": f"{type(error).__name__}: {error}",
            })

    report: dict[str, object] = {
        "input_folder": input_dir.name,
        "output_folder": output_dir.name,
        "files_found": len(files),
        "files_processed_successfully": successful,
        "files_with_warnings": warnings_count,
        "files_failed": len(files) - successful,
        "date_format": "YYYY-MM-DD (ISO 8601 calendar date)",
        "results": results,
    }
    (output_dir / "summary.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (output_dir / "cms-ready.json").write_text(
        json.dumps({
            "format_version": "1.0",
            "description": "Prepared content and metadata for a subsequent publishing workflow; no CMS upload is performed.",
            "assets": cms_assets,
        }, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    csv_fields = [
        "file", "cleaned_file", "status", "title", "date", "author", "asset_id",
        "title_valid", "date_valid", "author_valid", "duplicate_filename_stem",
        "duplicate_asset_id", "duplicate_of", "issues", "error",
    ]
    with (output_dir / "audit.csv").open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=csv_fields)
        writer.writeheader()
        for result in results:
            metadata = result.get("metadata", {})
            validation = result.get("validation", {})
            duplicates = result.get("duplicate_detection", {})
            writer.writerow({
                "file": result.get("file", ""),
                "cleaned_file": result.get("cleaned_file", "") or "",
                "status": result.get("status", ""),
                "title": metadata.get("title", ""),
                "date": metadata.get("date", ""),
                "author": metadata.get("author", ""),
                "asset_id": metadata.get("asset_id", ""),
                "title_valid": metadata.get("title_valid", ""),
                "date_valid": metadata.get("date_valid", ""),
                "author_valid": metadata.get("author_valid", ""),
                "duplicate_filename_stem": duplicates.get("filename_stem", ""),
                "duplicate_asset_id": duplicates.get("asset_id", ""),
                "duplicate_of": duplicates.get("duplicate_of", "") or "",
                "issues": "; ".join(result.get("warnings", validation.get("issues", []))),
                "error": result.get("error", ""),
            })
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).parent / "sample_input",
        help="Folder containing raw .html, .htm, or .txt files.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).parent / "cleaned_output",
        help="Folder where cleaned files and JSON/CSV reports are written.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input.is_dir():
        raise SystemExit(f"Input folder does not exist: {args.input}")

    report = process_folder(args.input, args.output)
    print(
        f"Processed {report['files_processed_successfully']} of {report['files_found']} "
        f"file(s); {report['files_with_warnings']} with metadata or duplicate warnings; "
        f"{report['files_failed']} failed."
    )
    print(f"JSON summary: {args.output / 'summary.json'}")
    print(f"CSV audit: {args.output / 'audit.csv'}")
    print(f"Structured export: {args.output / 'cms-ready.json'}")


if __name__ == "__main__":
    main()
