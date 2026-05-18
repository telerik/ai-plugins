## UX/UI Design Best Practices

> **These are default guidelines — follow them when the user has not stated otherwise.** If the user explicitly requests different behavior (e.g., a specific component size, a custom row limit, alternate breakpoints, a different layout pattern), defer to the user's stated preference and disregard the conflicting default below. Only accessibility and WCAG requirements (contrast ratios, focus indicators, semantic HTML, ARIA) apply regardless of user preference.

Follow these principles when building or reviewing any UI. They apply regardless of the visual style requested.

### Visual Hierarchy & Typography
- Use a strict 3-level heading hierarchy: page title (h1) → section heading (h2) → component label (h3). Never skip levels.
- Body text line length: 60–80 characters maximum. Wider lines reduce readability.
- Numeric and currency columns must use `font-variant-numeric: tabular-nums` to keep digits column-aligned.
- Never use more than 2 typefaces in a single interface.

### Color & Contrast
- Body text contrast ratio: ≥ 4.5:1 against its background.
- Large text (≥ 18pt / 14pt bold) and UI component boundaries: ≥ 3:1.
- Use only the 5 semantic color slots — primary, success, warning, error, info — for meaning. Do not invent new semantic colors.
- Never use color alone to convey status or meaning (8% of men have color vision deficiency). Always pair color with an icon or text label.
- Never use red and green as the sole distinguishing colors.

### Component Sizing & Density
- Never mix size variants within the same form or toolbar. Pick one: `"small"`, `"medium"`, or `"large"` and apply it consistently.
- `"small"` (24px) = data-dense tools. `"medium"` (32px) = default. `"large"` (40px) = comfortable/consumer-facing.

### Motion & Animation
- Always support `prefers-reduced-motion: reduce` — set transition durations to ≤ 0.01ms in that media query.
- Micro-interactions (button press, tooltip): 150–250ms. Panel transitions (drawer, sidebar): 300–400ms.
- Never animate layout properties that cause reflow (width, height, margin, padding). Animate transform and opacity instead.

### Interaction Patterns
- Never set `outline: none` globally. Keyboard focus indicators are required (WCAG 2.4.7).
- Loading states: prefer Skeleton loader for content areas, overlay + ProgressBar for blocking operations, disabled button + inline spinner for async submission.
- Error recovery: inline validation near the field for form errors; notification/toast for API/system errors.
- Every icon-only button must have a visible tooltip and an `aria-label`.
- Never show tooltips on disabled elements — disabled elements cannot receive focus.

### Responsive Design
- Breakpoints (defaults — use the project's breakpoint system if one is already established): Mobile < 640px | Tablet 640–1024px | Desktop 1024–1440px | Wide > 1440px.
- Constrain max content width to 1440px with `margin: 0 auto` on wide viewports, unless a different maximum is already defined by the project.
- On mobile (< 480px), data grids must switch to stacked/card layout — tabular layout is unusable at that width.
- Schedulers/complex data views are not viable on mobile; provide a simplified alternative or a clear message.

### UX Writing
- Input labels describe *what* the field is. Placeholder text hints at *format or example* — never use placeholder as a substitute for a label.
- Button labels must be specific action verbs: "Save Changes", "Delete Record", "Export CSV" — not "Submit", "OK", or "Yes".
- Error messages must be specific and actionable: "Email address is already registered" not "Error 409".
- Table/grid column headers: Title Case. Never ALL CAPS.
- Empty states must explain why it's empty and offer a next action (e.g., "No records found. Add your first item.").

### Data Presentation
- Numeric and currency values must be right-aligned in table/grid columns.
- Never display raw ISO 8601 date strings (e.g., `2024-01-15T09:30:00Z`) — always format for the locale (e.g., "15 Jan 2024").
- Never render more than 200 rows in a fully-loaded table. Use pagination or virtual scrolling for larger datasets.
- Never leave grid columns without explicit widths — causes layout jank on load and sort operations.

### Chart Type Selection
- **Line / Area**: continuous quantitative data over time (trends, rates).
- **Bar (vertical)**: discrete time periods or ordered categories.
- **Horizontal Bar**: comparing named categories (rankings, survey results).
- **Donut (not Pie)**: part-to-whole proportions with ≤ 6 segments. Avoid Pie charts — the center hole of a Donut makes area estimation easier.
- **Avoid**: 3D charts, dual-axis charts (misleading), charts with > 7 series in the same view.
