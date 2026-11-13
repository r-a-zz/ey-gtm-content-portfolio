# Content Operations Dashboard

A React, TypeScript, and Vite prototype for internal content request, metadata, review, and editorial QA workflows.

## Features

- Create a content draft with title, author, publish date, type, audience, description, image alt text, destination URL, and tags.
- Validate required metadata and URL/date formats before submitting for review.
- Raise requests for new pages, content changes, file replacements, metadata fixes, and migrations.
- Move review items through Draft, In Review, Changes Requested, Approved, and Published states.
- Keep a reviewer checklist and a timestamped activity history for each review item.
- Generate a structured prompt for a separately selected GenAI tool and record suggestions, accepted changes, and open issues.
- Persist drafts and prototype records in the current browser's local storage.

## Prototype limits

The sample review queue is simulated. Request, approval, and publish actions update local browser data only; they do not connect to Workfront, Adobe CMS, or another enterprise system. The GenAI reviewer creates a prompt and has no model or API integration. Review suggestions still need human verification.

## Run locally

Requires Node.js 18 or newer.

```bash
npm ci
npm run dev
```

Open the local address shown by Vite, usually `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```
