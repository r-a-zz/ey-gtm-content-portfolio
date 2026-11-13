# Content & Metadata Sanitizer

This small command-line tool prepares raw HTML and text assets for web publishing workflows. It:

- removes HTML-like and incomplete tags;
- collapses repeated whitespace and normalizes Unicode to clean UTF-8;
- extracts `Title`, `Date`, and `Author` metadata;
- falls back to the file name for a missing title and reports missing date/author values as `Unknown`;
- writes one cleaned `.txt` file per input asset and a machine-readable `summary.json` report.

## Run the sample

From this directory:

```powershell
python sanitizer.py
```

The default folders are:

- `sample_input/` — three intentionally messy sample assets.
- `cleaned_output/` — generated sanitized files and `summary.json`.

To use other folders:

```powershell
python sanitizer.py --input path\to\raw-assets --output path\to\cleaned-assets
```

No third-party packages are required. `requirements.txt` is included to document that the tool relies on Python's standard library only.
