"""Sanitize raw content files for digital publishing workflows."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from dataclasses import asdict, dataclass
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


@dataclass
class Metadata:
    title: str
    date: str
    author: str
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


def extract_metadata(raw_text: str, source_name: str) -> Metadata:
    title = extract_value(TITLE_RE, raw_text)
    date = extract_value(DATE_RE, raw_text)
    author = extract_value(AUTHOR_RE, raw_text)

    if not title:
        title = clean_value(Path(source_name).stem.replace("_", " ").replace("-", " "))

    return Metadata(
        title=title,
        date=date or "Unknown",
        author=author or "Unknown",
        title_valid=bool(title),
        date_valid=bool(date),
        author_valid=bool(author),
    )


def sanitize_body(raw_text: str) -> str:
    """Remove HTML-like tags, decode entities, and normalize line whitespace."""
    text_without_tags = TAG_RE.sub(" ", raw_text)
    text_without_tags = BROKEN_TAG_RE.sub(" ", text_without_tags)
    text = clean_value(text_without_tags)
    return text


def sanitize_file(source: Path, destination: Path) -> Metadata:
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


def process_folder(input_dir: Path, output_dir: Path) -> dict[str, object]:
    output_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(
        path for path in input_dir.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )
    results: list[dict[str, object]] = []
    successful = 0

    for source in files:
        try:
            metadata = sanitize_file(source, output_dir / f"{source.stem}.clean.txt")
            results.append({
                "file": source.name,
                "status": "processed",
                "metadata": asdict(metadata),
            })
            successful += 1
        except (OSError, UnicodeError) as error:
            results.append({
                "file": source.name,
                "status": "failed",
                "error": str(error),
            })

    report = {
        "input_folder": str(input_dir),
        "output_folder": str(output_dir),
        "files_found": len(files),
        "files_processed_successfully": successful,
        "files_failed": len(files) - successful,
        "results": results,
    }
    (output_dir / "summary.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
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
        help="Folder where cleaned files and summary.json are written.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.input.is_dir():
        raise SystemExit(f"Input folder does not exist: {args.input}")

    report = process_folder(args.input, args.output)
    print(
        f"Processed {report['files_processed_successfully']} of "
        f"{report['files_found']} file(s) successfully."
    )
    print(f"Summary report: {args.output / 'summary.json'}")


if __name__ == "__main__":
    main()
