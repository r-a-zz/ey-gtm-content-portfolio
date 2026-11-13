# GTM Content Delivery Toolkit

A portfolio prototype demonstrating go-to-market content operations across a responsive content hub, an interactive editorial review workspace, and a Python asset preparation tool. It covers request intake, metadata checks, content QA, approval tracking, and structured exports. Sample content and performance figures are illustrative; the tools do not connect to a production CMS or enterprise workflow platform.

## Projects

### 1. GTM Content Hub landing page

Location: [`01-Landing-page/`](./01-Landing-page/)

A responsive B2B content hub concept with resource cards, playbook content, a FAQ, and light/dark theme controls. Illustrative dashboard metrics are labeled as sample data, and no client logos or business results are claimed.

### 2. Content and metadata sanitizer

Location: [`02-metadata-sanitizer/`](./02-metadata-sanitizer/)

A Python command-line utility for preparing HTML and text assets for a subsequent publishing workflow. It normalizes text, validates required Title, Date, and Author metadata, checks ISO dates, flags duplicate names and asset IDs, and writes cleaned text, JSON and CSV audit reports, and a CMS-ready structured JSON export. It prepares assets for a publishing workflow; it does not upload or migrate content into Adobe CMS.

### 3. Content operations dashboard

Location: [`03-content-previewer/`](./03-content-previewer/)

A React and TypeScript prototype for content operations. It includes:

- content request intake with request type, priority, requester, due date, asset, and changes;
- metadata validation before review submission;
- an interactive Draft, In Review, Changes Requested, Approved, and Published workflow;
- review history with demo identities and timestamps;
- an editorial QA checklist and a live content preview;
- a prompt generator and manually recorded GenAI QA report;
- local browser storage for requests, drafts, review records, and QA notes.

All review actions are simulated and stay in the current browser. The GenAI toolkit generates a prompt for use in a separately selected tool; it has no AI API integration.

## Run locally

### Landing page

Open [`01-Landing-page/index.html`](./01-Landing-page/index.html) in a browser. Alternatively, run a local static server from the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/01-Landing-page/`.

### Metadata sanitizer

Requires Python 3.9 or newer and uses only the standard library.

```powershell
cd 02-metadata-sanitizer
python sanitizer.py
```

By default, it reads `sample_input/` and writes cleaned assets plus `summary.json`, `audit.csv`, and `cms-ready.json` into `cleaned_output/`. To choose folders:

```powershell
python sanitizer.py --input path\to\raw-assets --output path\to\prepared-assets
```

Run the unit tests from the sanitizer directory:

```powershell
python -m unittest discover -s tests -v
```

### Content operations dashboard

Requires Node.js 18 or newer.

```bash
cd 03-content-previewer
npm ci
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`). To create a production build:

```bash
npm run build
```

## Repository structure

```text
ey-gtm-portfolio/
├── 01-Landing-page/          # Responsive HTML, CSS, and JavaScript concept
├── 02-metadata-sanitizer/    # Python utility, sample assets, and unit tests
├── 03-content-previewer/     # React and TypeScript content operations prototype
├── STYLE-GUIDE.md            # Landing page typography, color, spacing, and imagery
└── README.md
```

## Workflow overview

```text
Content request → Draft and metadata check → Editorial QA → Sanitized asset and audit export → Subsequent publishing workflow
```

The dashboard and sanitizer are independent local prototypes. The diagram describes a sample operating model; no live integrations or publishing actions are configured.

## Visual guidance

See [`STYLE-GUIDE.md`](./STYLE-GUIDE.md) for typography, color tokens, spacing, image treatment, and accessibility notes.
