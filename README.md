# GTM Content Delivery Toolkit

A lightweight portfolio of tools for planning, preparing, reviewing, and publishing go-to-market content.

The three projects work together as a simple content delivery workflow:

1. **Landing page** attracts and informs GTM stakeholders.
2. **Metadata sanitizer** prepares raw content assets for reliable publishing.
3. **Content review dashboard** gives internal teams a structured place to preview and submit content for QA.

Together, they connect the external content experience with the internal processes that keep GTM content clear, consistent, and ready to ship.

## Projects

### 1. GTM Content Hub Landing Page

Location: [`01-Landing-page/`](./01-Landing-page/)

A responsive corporate landing page for a B2B GTM Content Hub. It provides:

- a polished entry point for GTM resources;
- strategy, playbook, and content-library sections;
- responsive layouts for desktop and mobile;
- light/dark mode support;
- an interactive FAQ accordion.

Open [`index.html`](./01-Landing-page/index.html) directly in a browser to view it.

### 2. Content & Metadata Sanitizer

Location: [`02-metadata-sanitizer/`](./02-metadata-sanitizer/)

A Python command-line utility for preparing raw HTML and text assets before they enter the publishing workflow. It:

- removes broken HTML-like tags and extra whitespace;
- normalizes text to clean UTF-8;
- extracts and validates Title, Date, and Author metadata;
- writes cleaned files and a JSON processing summary.

Run it from the project directory:

```powershell
cd 02-metadata-sanitizer
python sanitizer.py
```

By default, it processes the files in [`sample_input/`](./02-metadata-sanitizer/sample_input/) and writes results to `cleaned_output/`.

### 3. Internal GTM Content Review Dashboard

Location: [`03-content-previewer/`](./03-content-previewer/)

A Vite and React application for internal content creation and QA workflows. It enables content teams to:

- enter a headline and select a content format;
- assign target tags;
- see a live preview card while editing;
- submit content to a simulated review queue.

Run it locally:

```bash
cd 03-content-previewer
npm install
npm run dev
```

The production build can be checked with:

```bash
npm run build
```

## How the tools relate

```text
GTM audience
     │
     ▼
01 · Content Hub landing page
     │  Discover resources, playbooks, and insights
     ▼
03 · Internal review dashboard
     │  Draft, preview, tag, and submit content for QA
     ▼
02 · Metadata sanitizer
     │  Clean and validate assets before publishing
     ▼
Published GTM content
```

In a typical workflow:

1. A GTM team uses the **Content Hub landing page** as the front door to its resources and messaging.
2. A content creator prepares a new asset in the **review dashboard**, checks the live preview, adds audience tags, and submits it for QA.
3. The **metadata sanitizer** cleans the approved source files and confirms that required publishing metadata is present.
4. The resulting assets are ready for distribution through the Content Hub or other publishing channels.

## Repository structure

```text
ey-gtm-portfolio/
├── 01-Landing-page/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 02-metadata-sanitizer/
│   ├── sanitizer.py
│   ├── sample_input/
│   ├── README.md
│   └── requirements.txt
├── 03-content-previewer/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
└── README.md
```

## Intended outcome

These tools demonstrate a practical GTM content operating model:

- **Discoverable:** stakeholders can find the right content quickly.
- **Consistent:** content is reviewed against a shared structure and presentation.
- **Clean:** publishing assets have normalized text and dependable metadata.
- **Connected:** strategy, creation, QA, and distribution work as one repeatable flow.
