# GTM Content Hub visual style guide

This guide documents the visual rules used by the landing page concept. The content is a portfolio prototype and does not represent a live company brand.

## Typography

- **Display and section headings:** Space Grotesk, with a sans-serif fallback. Use sentence case and short, audience-focused lines.
- **Body, labels, and controls:** DM Sans, with Arial and sans-serif fallbacks.
- **Reading text:** 14–16 px on desktop with a line height near 1.55. Keep longer paragraphs to a comfortable, narrow measure.
- **Labels and metadata:** 9–12 px. Keep text readable and use weight or spacing before reducing size further.

## Color

| Role | Token | Value |
| --- | --- | --- |
| Primary navy | `--navy` | `#09263a` |
| Deep navy | `--navy-deep` | `#061b2b` |
| Main text | `--ink` | `#122f42` |
| Muted text | `--muted` | `#647988` |
| Borders | `--line` | `#dce5e9` |
| Page surface | `--surface` | `#f5f8f8` |
| Mint accent | `--mint` | `#d5f3e8` |
| Aqua accent | `--aqua` | `#9cddff` |
| Lilac accent | `--lilac` | `#dfdcff` |
| Sand accent | `--sand` | `#f4e3b8` |
| Yellow accent | `--yellow` | `#f4cb50` |

Use navy for primary actions and headings, muted colors for supporting details, and the brighter accents sparingly. Check text contrast whenever a token is used for small text or controls.

## Spacing and layout

- Use an 8 px base rhythm: common gaps are 8, 16, 24, 32, and 48 px.
- Keep the landing page content within the 1120 px container and align section edges to it.
- Use generous section spacing on desktop, then reduce it at tablet and mobile widths.
- Cards use consistent internal padding, fine borders, and restrained shadows. Avoid using decoration to separate every line of content.
- At narrow widths, stack columns, preserve comfortable side padding, and keep controls full-width when needed.

## Images and illustration

- Prefer meaningful, high-quality imagery that supports the nearby content. Use a concise alt description for informative images and empty alt text for purely decorative images.
- Crop consistently within a card or hero slot; do not stretch images to fit.
- Use the landing page's abstract CSS and SVG artwork as illustration, not as evidence of real performance.
- Dashboard figures and activity are labeled as illustrative sample data. Never present prototype metrics or invented company marks as client results.

## Interaction and accessibility

- Keep links and buttons keyboard reachable with a visible focus ring.
- Use semantic headings, descriptive control labels, and meaningful link text.
- Provide a skip link on the landing page and preserve native keyboard behavior for the FAQ and theme controls.
- Verify the layout at desktop, tablet, and mobile widths before publishing changes.
