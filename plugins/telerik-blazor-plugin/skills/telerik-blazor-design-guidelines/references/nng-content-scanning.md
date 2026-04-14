# Content Scanning & Information Hierarchy

> Source: Nielsen Norman Group research on F-pattern scanning, visual hierarchy, and content structure.
> Apply during Phase A (Pre-Implementation) to structure content and headings correctly.

---

## How Users Scan Interfaces

Users scan rather than read. Eye-tracking research shows an F-pattern or layer-cake pattern:
users read the first line fully, then scan down the left edge, occasionally moving right when
something catches their attention.

Design implications:
- Place the most important information at the **top left** of each content area
- Lead headings and list items with the keyword — users read the first 1–2 words and decide
  whether to continue
- Never bury the primary call to action or key data point in a right-aligned or lower position
- A 1400px-wide layout does not mean 1400px-wide content — use `max-width` on content areas
  for readable text columns (see line length rule in `ux-principles.md` §1)

---

## Structuring Content for Scannability

- **Use descriptive headings** at every logical break — "Order History" not "Information"
- **Use bullet points** for lists of 3+ items rather than inline prose
- **Keep paragraphs short**: 3–4 lines maximum; split longer explanations into separate paragraphs
- **Bold the key term** in a sentence rather than bolding entire sentences
- Use consistent **visual weight** — do not bold things that are not genuinely important

---

## Heading Hierarchy as Navigation

Sighted users scan headings as a navigation device before reading body content:

- One `<h1>` per page/view for the page title
- `<h2>` for major sections within the page
- `<h3>` for subsections — never skip levels (no jumping from H2 to H4)
- Do not use heading elements for visual styling — use `k-font-size-*` utilities instead

This maps directly to the Kendo class hierarchy: `k-h1` → `k-h2` → `k-h3` → `k-h4`.
