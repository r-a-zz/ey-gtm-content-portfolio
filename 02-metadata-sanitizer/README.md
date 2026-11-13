# Content and Metadata Sanitizer

A Python command-line tool that prepares HTML and text assets for a subsequent publishing workflow. It does not upload or migrate content into Adobe CMS.

## What it does

- Processes `.html`, `.htm`, and `.txt` inputs in batches.
- Removes HTML-like tags, decodes entities, and normalizes Unicode and whitespace.
- Extracts Title, Date, Author, and optional Asset ID fields.
- Validates that Title, Date, and Author are present and that dates are real `YYYY-MM-DD` calendar dates.
- Flags duplicate filename stems and repeated asset IDs while retaining each cleaned output.
- Records per-file errors and continues processing the rest of the batch.
- Writes cleaned text files, `summary.json`, spreadsheet-friendly `audit.csv`, and a structured `cms-ready.json` export.

Metadata gaps and duplicate identifiers are reported as warnings; a file can still be cleaned so that an editor can resolve the issue. Date values in the structured export are left empty when invalid. The CMS-ready export is a handoff format, not a live CMS integration.

## Run the sample

Requires Python 3.9 or newer and no third-party packages.

```powershell
python sanitizer.py
```

By default, the tool reads `sample_input/` and writes to `cleaned_output/`. Choose other folders with:

```powershell
python sanitizer.py --input path\to\raw-assets --output path\to\prepared-assets
```

## Unit tests

```powershell
python -m unittest discover -s tests -v
```
