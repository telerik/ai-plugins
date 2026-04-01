# UX Principles for Kendo UI Applications

Design vocabulary and principles adapted for enterprise interfaces built with Kendo UI.
These principles apply across all Kendo components and should inform every UI decision.

---

## Table of Contents

1. [Typography](#1-typography)
2. [Color & Contrast](#2-color--contrast)
3. [Spatial Design & Density](#3-spatial-design--density)
4. [Motion & Transitions](#4-motion--transitions)
5. [Interaction Design](#5-interaction-design)
6. [Responsive Design](#6-responsive-design)
7. [UX Writing](#7-ux-writing)

---

## 1. Typography

### The enterprise type hierarchy

Enterprise applications need a clear 3-level hierarchy. With Kendo's typography system active:

| Level | Use | Kendo class or variable |
|---|---|---|
| Page title | One per page, identifies the view | `k-h1` or `k-h2` |
| Section / card header | Groups related content | `k-h3` or `k-h4` |
| Component header | Grid header, panel title | Handled by component styles |
| Body | Primary readable content | Default (inherits `k-body`) |
| Label | Form labels, column headers | `k-label`, `k-text-sm` |
| Caption / hint | Helper text, validation hints | `k-form-hint`, `k-text-xs` |

### Font selection principles

- **Do not use Inter, Roboto, or Arial** without strong reason. They are ubiquitous and unmemorable.
- For enterprise: Nunito Sans, Source Sans 3, IBM Plex Sans, or DM Sans offer character with legibility.
- For technical / data-heavy apps: Figtree, Outfit, or Geist Sans balance clarity with personality.
- Pair a slightly humanist body font with a monospaced font for code, IDs, and numeric data.

### Numeric alignment

In Grid columns and any table-like structure, right-align numeric values. Left-align text. Never center either.
Use tabular figures (`font-variant-numeric: tabular-nums`) for columns of numbers so decimal points align:

```css
.k-grid td.numeric-column {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

### Line length

Keep readable text content to 60–80 characters per line (roughly 600–700px at 14px body size).
Do not stretch body text to fill a 1400px wide container. Use `max-width` on content areas.

---

## 2. Color & Contrast

### The minimum rule

- Body text on background: ≥ 4.5:1 contrast ratio
- Large text (18px+ or 14px+ bold) on background: ≥ 3:1
- UI components and graphical elements: ≥ 3:1
- Decorative elements (no information content): no requirement

Test every custom color combination with a contrast checker before shipping.

### Semantic color usage

Use color semantically and consistently across the entire application:

| Meaning | Kendo variable | Example use |
|---|---|---|
| Primary action / brand | `$kendo-color-primary` | Save button, active tab, selected row |
| Success / positive | `$kendo-color-success` | Confirmed status, positive delta |
| Warning / caution | `$kendo-color-warning` | Pending status, approaching limit |
| Error / destructive | `$kendo-color-error` | Validation error, Delete action, failed status |
| Info / neutral | `$kendo-color-info` | Informational badges, help text |

**Never invent new semantic colors.** If a design calls for 6 status colors, map them to the 5 semantic slots + neutral, or reconsider the information architecture.

### Color blindness considerations

- Never use red/green alone to distinguish two states — add text, icon, or pattern
- Avoid green/brown and blue/purple combinations for adjacent items
- Chart series: test your color sequence with a deuteranopia simulator

### Backgrounds and surfaces

Enterprise applications have a surface hierarchy — do not collapse it:

1. **Page background** (`$kendo-body-bg`) — the lowest surface
2. **Component background** (`$kendo-component-bg`) — cards, panels, Grid body
3. **Header / hover surface** (`$kendo-grid-header-bg`) — Grid headers, highlighted rows
4. **Active / selected surface** — Kendo handles this via `$kendo-selected-bg`

Avoid introducing custom surfaces outside this system — they create visual inconsistency.

---

## 3. Spatial Design & Density

### Density tiers

Kendo uses a `size` property across most components. Use it consistently within a view:

| Tier | `size` value | Base unit | Best for |
|---|---|---|---|
| Compact | `"small"` | 24px row height | Data-dense grids, control panels |
| Default | `"medium"` (omit) | 32px row height | Standard enterprise UI |
| Comfortable | `"large"` | 40px row height | Forms, onboarding, public-facing |

**Do not mix sizes within the same form or toolbar.** A small input next to a medium button creates misaligned baselines.

### Whitespace and breathing room

Enterprise UI often errs toward zero whitespace. Fight this.

- Section separators: minimum 24px vertical gap between distinct content areas
- Card padding: 16–24px internal padding. Never 8px — it feels cramped.
- Form field gap: 16px between fields minimum. 24px for multi-column forms.
- Grid header to first row: no gap needed — the Grid manages this internally
- Page-level left/right margin: 24–32px minimum, even at desktop widths

### Grid and layout geometry

Kendo applications are almost always fixed-width layouts inside a shell.
Use a consistent page grid:

```css
.page-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
}

.content-area {
  display: grid;
  grid-template-columns: 280px 1fr;  /* sidebar + main */
  gap: 24px;
}
```

Do not use Kendo Splitter as a page layout tool. Use CSS Grid for page structure.

---

## 4. Motion & Transitions

### Kendo's built-in animation system

All animations are controlled by `--kendo-duration-global`, which is automatically set to `0.01ms`
when `prefers-reduced-motion` is active. Do not override this variable.

Default Kendo animation timings:
- Popups, dropdowns: 200ms ease-in-out
- Dialog open: 200ms ease-out
- Notification: 300ms ease

### Adding custom motion

If adding transitions to custom elements or wrappers:

```css
.custom-panel {
  transition: opacity 200ms ease-in-out, transform 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .custom-panel {
    transition: none;
  }
}
```

### Motion principles for enterprise UI

- **Transitions should communicate state change**, not decorate it.
- **Never animate layout** (width/height changes of containers that contain other content). It causes reflow and looks broken.
- **Keep durations short**: 150–250ms for micro-interactions, 300–400ms for panel open/close. Beyond 400ms feels sluggish for professional users.
- **No looping animations** except loading spinners (which Kendo handles via its own loading overlay).

---

## 5. Interaction Design

### Focus states

Every interactive element must have a visible focus indicator. Kendo provides these — do not suppress them.

```css
/* Never do this */
:focus { outline: none; }

/* If you must customize focus, keep it visible */
:focus-visible {
  outline: 2px solid var(--kendo-color-primary);
  outline-offset: 2px;
}
```

### Loading patterns

| Pattern | Use when |
|---|---|
| Kendo Grid loading overlay (`loading`) | Grid data is refreshing |
| Kendo ProgressBar (indeterminate) | Long background process without progress info |
| Kendo Skeleton loader (custom) | Initial page load of structured content |
| Button `disabled` + spinner icon | Form submission in progress |

Never leave the user without feedback for any operation > 300ms. If an action takes > 3 seconds, provide progress information.

### Error recovery patterns

- **Form validation errors**: show inline, below the field, after blur
- **API errors**: use notification (bottom-right) for transient errors; inline error banners for blocking errors
- **Empty Grid after filtering**: show clear empty state with a "Clear filters" action
- **Network failure**: always provide a retry action; never just show a static error state

### Tooltips

Use tooltips for icon-only buttons and UI elements that require explanation.
Do not use tooltips for primary content — if it needs a tooltip to be understood, it needs a label.

Tooltip rules:
- Delay before show: 600ms (prevents tooltip flash on rapid mouse movement)
- Content: label only, not repeated body text
- Never use tooltips on disabled elements — users cannot hover over them reliably
- Mobile: tooltips do not work on touch — any icon-only button must have an accessible label

### Hover states

Kendo provides hover states on all interactive components. For custom elements:
- Background shift: typically 5–10% darker or lighter than the base surface
- Transition: 150ms ease — fast enough to feel responsive, slow enough to register
- Never change text color alone on hover — background must change too

---

## 6. Responsive Design

### Kendo UI and mobile

Kendo UI is primarily designed for desktop and tablet. For mobile:

- The Grid does not work well at < 480px. Consider `dataLayoutMode: 'stacked'` for mobile card view.
- Scheduler is unusable on small screens — provide a fallback list view
- TreeView is difficult on touch — prefer cascading DropDownLists on mobile
- Dialogs and Windows should be full-screen on mobile

### Breakpoints

| Name | Width | Typical Kendo consideration |
|---|---|---|
| Mobile | < 640px | Hide non-essential columns, stack forms |
| Tablet | 640–1024px | Collapse sidebar, reduce Grid columns |
| Desktop | 1024–1440px | Full layout |
| Wide | > 1440px | Cap container width, do not stretch infinitely |

---

## 7. UX Writing

### Labels and placeholders

- Labels describe the field: "Start date", "Customer name", "Status"
- Placeholders give format hints, not instructions: "MM/DD/YYYY", "e.g. Acme Corp"
- Do not use placeholder text as a substitute for labels — it disappears on input and fails accessibility

### Button labels

- Use verbs: "Save", "Delete", "Export", "Filter", "Apply"
- Be specific: "Save changes" not "Submit", "Delete record" not "Confirm"
- Destructive actions: use the action verb, not "OK" ("Delete", "Remove", "Archive")
- Loading state: "Saving…", "Exporting…" — progressive suffix on the verb

### Error messages

Write error messages that are:
1. Specific about what went wrong
2. Clear about what the user should do
3. Free of jargon or error codes visible to users

| Bad | Better |
|---|---|
| "Invalid input" | "Enter a date in MM/DD/YYYY format" |
| "Error 422" | "That email address is already in use" |
| "Required field" | "Customer name is required" |
| "Operation failed" | "Couldn't save changes. Check your connection and try again." |

### Column headers in Grid

- Use title case: "Order Date", "Customer Name", "Total Amount"
- Keep headers short — the column content provides context
- Abbreviate only widely known terms: "ID", "Qty", "Ref." — never custom abbreviations

### Empty states

Every empty state needs:
1. An explanation of why it's empty
2. An action to fill it (when applicable)

```
No orders found
Try adjusting your filters or date range.
[Clear filters]
```

