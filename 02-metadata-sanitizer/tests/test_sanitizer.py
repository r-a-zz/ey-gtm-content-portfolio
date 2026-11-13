import csv
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import sanitizer


class MetadataValidationTests(unittest.TestCase):
    def test_valid_metadata_and_cleaned_text(self):
        raw = (
            "<title>  Partner&nbsp; Brief </title>\n"
            '<meta name="date" content="2025-02-28">\n'
            '<meta name="author" content="Riley Okafor">\n'
            '<meta name="asset-id" content="ASSET-01">\n'
            "<p>Useful   content.</p>"
        )
        metadata = sanitizer.extract_metadata(raw, "partner.html")
        self.assertEqual(metadata.title, "Partner Brief")
        self.assertEqual(metadata.date, "2025-02-28")
        self.assertEqual(metadata.author, "Riley Okafor")
        self.assertEqual(metadata.asset_id, "ASSET-01")
        self.assertTrue(metadata.title_valid)
        self.assertTrue(metadata.date_valid)
        self.assertTrue(metadata.author_valid)

        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "partner.html"
            destination = Path(temp_dir) / "partner.clean.txt"
            source.write_text(raw, encoding="utf-8")
            sanitizer.sanitize_file(source, destination)
            cleaned = destination.read_text(encoding="utf-8")
            self.assertIn("Title: Partner Brief", cleaned)
            self.assertIn("Useful content.", cleaned)
            self.assertNotIn("<p>", cleaned)

    def test_missing_required_metadata_is_flagged(self):
        metadata = sanitizer.extract_metadata("<p>Body only</p>", "missing-fields.html")
        self.assertEqual(metadata.title, "missing fields")
        self.assertEqual(metadata.date, "Unknown")
        self.assertEqual(metadata.author, "Unknown")
        self.assertFalse(metadata.title_valid)
        self.assertFalse(metadata.date_valid)
        self.assertFalse(metadata.author_valid)
        self.assertEqual(len(sanitizer.validation_issues(metadata)), 3)

    def test_malformed_calendar_date_is_rejected(self):
        raw = "Title: Brief\nDate: 2025-02-30\nAuthor: Editor\n"
        metadata = sanitizer.extract_metadata(raw, "brief.txt")
        self.assertTrue(metadata.title_valid)
        self.assertFalse(metadata.date_valid)
        self.assertTrue(metadata.author_valid)
        self.assertIn("Date is missing or is not a valid YYYY-MM-DD date", sanitizer.validation_issues(metadata))


class BatchProcessingTests(unittest.TestCase):
    def test_duplicate_stems_and_asset_ids_are_reported_without_overwrite(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            input_dir = root / "input"
            output_dir = root / "output"
            input_dir.mkdir()
            (input_dir / "brief.html").write_text(
                '<title>Brief</title><meta name="date" content="2025-01-02">'
                '<meta name="author" content="Editor"><meta name="asset-id" content="A-1">',
                encoding="utf-8",
            )
            (input_dir / "brief.txt").write_text(
                "Title: Brief copy\nDate: 2025-01-03\nAuthor: Editor\nAsset ID: A-1\n",
                encoding="utf-8",
            )

            report = sanitizer.process_folder(input_dir, output_dir)
            results = report["results"]
            self.assertEqual(report["files_processed_successfully"], 2)
            self.assertEqual(report["files_with_warnings"], 2)
            self.assertEqual(len({row["cleaned_file"] for row in results}), 2)
            self.assertTrue(all(row["duplicate_detection"]["filename_stem"] for row in results))
            self.assertTrue(results[1]["duplicate_detection"]["asset_id"])
            self.assertTrue((output_dir / "audit.csv").is_file())
            self.assertTrue((output_dir / "cms-ready.json").is_file())
            with (output_dir / "audit.csv").open(encoding="utf-8", newline="") as csv_file:
                self.assertEqual(len(list(csv.DictReader(csv_file))), 2)
            export = json.loads((output_dir / "cms-ready.json").read_text(encoding="utf-8"))
            self.assertEqual(len(export["assets"]), 2)
            self.assertIn("no CMS upload is performed", export["description"])

    def test_one_file_error_does_not_stop_the_batch(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            input_dir = root / "input"
            output_dir = root / "output"
            input_dir.mkdir()
            for name in ("bad.txt", "good.txt"):
                (input_dir / name).write_text("Title: Item\nDate: 2025-01-02\nAuthor: Editor", encoding="utf-8")

            original = sanitizer.sanitize_file

            def fail_one(source, destination):
                if source.name == "bad.txt":
                    raise OSError("simulated unreadable input")
                return original(source, destination)

            with patch("sanitizer.sanitize_file", side_effect=fail_one):
                report = sanitizer.process_folder(input_dir, output_dir)

            self.assertEqual(report["files_processed_successfully"], 1)
            self.assertEqual(report["files_failed"], 1)
            statuses = {row["file"]: row["status"] for row in report["results"]}
            self.assertEqual(statuses, {"bad.txt": "failed", "good.txt": "processed"})


if __name__ == "__main__":
    unittest.main()
