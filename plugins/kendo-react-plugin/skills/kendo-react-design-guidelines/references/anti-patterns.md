# Kendo UI Anti-Patterns

What NOT to do. Read this file during UI audits, code reviews, or pre-delivery checks.
Each pattern describes the problem, why it's wrong, and the correct approach.

---

## Theming Anti-Patterns

### ❌ Fighting the cascade with `!important`

```scss
/* WRONG */
.my-grid .k-grid-header {
  background-color: #003366 !important;
}
```

**Why it's wrong:** Breaks on any Kendo version update that changes the HTML structure.
Prevents Kendo's own state classes (hover, focus, selected) from working.

**Correct approach:** Override at the variable/token level — never with `!important`.

---

### ❌ Importing multiple Kendo theme packages

**Why it's wrong:** Produces cascading conflicts that are nearly impossible to debug.
Produces 2× the CSS weight.

**Correct approach:** Choose one theme per application. Do not mix themes.

---

### ❌ Hardcoding colors that exist as theme variables

```scss
/* WRONG */
.status-badge { background: #28a745; color: #ffffff; }
```

**Correct approach:**
```scss
.status-badge {
  background: var(--kendo-color-success);
  color: var(--kendo-color-success-contrast);
}
```

---

### ❌ Applying a custom font without testing component layouts

**Why it's wrong:** Many Kendo components have pixel-precise column widths and popup
sizes that assume the default font. A wider font will overflow column headers, truncate
dropdown options, and break calendar cell layouts.

**Correct approach:** After changing the font family, test the Grid with long headers,
DatePicker calendar at all viewport widths, DropDownList with long option text, and
Chart axis labels.

---

## Grid Anti-Patterns

### ❌ No column widths set

**Why it's wrong:** Causes layout jank when data loads. Sorting triggers a complete re-layout.

**Correct approach:** Set explicit `width` on every column.

---

### ❌ Rendering large datasets without pagination or virtualization

**Why it's wrong:** Blocks the main thread during render. At 5,000+ rows causes multi-second freezes.

**Correct approach:** Use pagination (`pageable`) or row virtualization (`scrollable="virtual"`).

---

### ❌ Enabling every Grid feature by default

**Why it's wrong:** Clutters the UI. Users see filter rows, group panels, selection checkboxes,
resize handles, and column menus simultaneously. The actual data gets lost. Each feature adds
event listeners and DOM nodes.

**Correct approach:** Enable only what users genuinely need for their workflow.

---

### ❌ Interactive elements in Grid cells without the focusable directive

**Why it's wrong:** Buttons and inputs inside cell templates are not reachable via keyboard
navigation in the Grid and are not announced correctly by screen readers.

**Correct approach:** Apply the Grid's focusable directive/prop to any interactive element
inside a cell template.

---

### ❌ Numeric columns left-aligned or center-aligned

**Why it's wrong:** Decimal points do not align across rows, making numbers harder to compare.

**Correct approach:** Right-align all numeric, currency, and percentage columns.
Use `font-variant-numeric: tabular-nums`.

---

### ❌ Displaying raw ISO dates in Grid cells

**Why it's wrong:** ISO strings are developer output, not user content.

**Correct approach:** Use the Grid's `format` prop to apply a human-readable date format.

---

## Accessibility Anti-Patterns

### ❌ Removing the default focus outline

```css
/* WRONG — breaks keyboard navigation for ALL Kendo components */
* { outline: none; }
:focus { outline: none; }
```

**Why it's wrong:** Fails WCAG 2.4.7 (Focus Visible) — a AA-level requirement.

**Correct approach:** If the default focus ring clashes with the design, customize its
appearance rather than removing it:
```css
:focus-visible {
  outline: 2px solid var(--kendo-color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

### ❌ Using color alone to convey status

**Why it's wrong:** Fails for color-blind users (~8% of men). Fails WCAG 1.4.1 (Use of Color).

**Correct approach:** Always pair color with a text label or icon to convey state.

---

### ❌ Icon-only buttons without accessible labels

**Why it's wrong:** Screen readers announce "button" with no context.

**Correct approach:** Add `aria-label` to every icon-only button. Also add a visible
tooltip so mouse users get the same context.

---

### ❌ Using non-semantic elements for interactive content in Grid cells

**Why it's wrong:** `<div>` elements are not keyboard-reachable and are not announced
correctly by screen readers.

**Correct approach:** Use `<button>` for actions inside cell templates.

---

## UX Writing Anti-Patterns

### ❌ Generic button labels

| Wrong | Correct |
|---|---|
| "Submit" | "Save changes" / "Place order" |
| "OK" | The specific action verb ("Delete", "Confirm", "Apply") |
| "Yes" on a confirmation | The action: "Delete record" |

---

### ❌ Technical error messages exposed to users

| Wrong | Correct |
|---|---|
| "HTTP 422 Unprocessable Entity" | "That email address is already registered" |
| "Null reference exception" | "Something went wrong. Please try again." |
| "Invalid field: createdAt must be ISO 8601" | "Enter a valid date" |
| "Request timeout (30000ms)" | "This is taking longer than expected. Check your connection." |

---

### ❌ Placeholder text as a substitute for labels

**Why it's wrong:** When the user starts typing, the placeholder disappears and they
forget what the field is for. Fails accessibility — placeholders are not announced as
labels by screen readers.

**Correct approach:** Always use a visible label. Use placeholder only for format hints.

---

## Layout Anti-Patterns

### ❌ Using Kendo Splitter for page layout

**Why it's wrong:** Adds unnecessary DOM complexity and JS weight to a problem that CSS
Grid solves statically with zero JS.

**Correct approach:** Use CSS Grid or Flexbox for page structure. Reserve Splitter for
content areas where user-resizing is a genuine feature requirement.

---

### ❌ Mixing `size` variants in the same form or toolbar

**Why it's wrong:** Creates misaligned baselines and visual inconsistency.

**Correct approach:** Choose one `size` for the entire form or toolbar and apply it
consistently to every component within it.

---

### ❌ Infinite-width content on wide screens

**Why it's wrong:** Layout stretches to fill 2560px screens; last Grid column becomes
1200px wide.

**Correct approach:** Cap the page container at a max-width (typically 1440px) and
center it.

---

## Performance Anti-Patterns

### ❌ Binding Charts to inline object literals

```html
<!-- WRONG — creates a new object reference on every change detection cycle -->
<kendo-chart [categoryAxis]="{ categories: ['Jan', 'Feb'] }">
```

**Why it's wrong:** Charts re-render when input references change. An inline object
literal is a new reference every cycle → constant re-renders → CPU spike.

**Correct approach:** Define all Chart configuration objects as class properties.

---

### ❌ Inline Grid editing without debouncing change events

**Why it's wrong:** `cellClose` / `dataStateChange` events can fire rapidly on every
keystroke. Hitting the API on every keystroke causes request floods.

**Correct approach:** Debounce save calls by at least 500ms, or save explicitly on
row navigation/blur.

---

## Visual Layout Anti-Patterns

### ❌ Placing multiple Kendo components without a layout container

**Why it's wrong:** Kendo components are `display: block`. They stack vertically with
100% width regardless of intent. A Grid will take full width and push Charts below it.

**Correct approach:** Wrap Kendo components in a CSS Grid or Flexbox layout container.

---

### ❌ Dark theme without page-level background

**Why it's wrong:** Kendo themes scope styles to component selectors. They do not set
`background-color` on `<html>` or `<body>`. The result is dark Kendo components on a
white page.

**Correct approach:** Always follow the theme import with explicit `background-color`
and `color` on `html, body` using the Kendo CSS variables.

---

### ❌ Flex child without `min-width: 0`

**Why it's wrong:** By default, flex items have `min-width: auto`. A Grid with many
columns will be wider than the container and overflow horizontally.

**Correct approach:** Add `min-width: 0` to any flex child that contains a Grid.

---

### ❌ Grid without explicit height

**Why it's wrong:** Grid expands indefinitely to show all rows. At 1,000+ rows this
freezes the browser.

**Correct approach:** Always set an explicit `height` on the Grid, or use
`flex: 1; min-height: 0` inside a flex column container.

---

### ❌ Chart without explicit height

**Why it's wrong:** Chart renders at 0px height and is invisible.

**Correct approach:** Always set an explicit height and `width: 100%` on the Chart.

---

### ❌ DropDownList / DatePicker left at default width inside forms

**Why it's wrong:** Inline Kendo inputs are `display: inline-block` with an internal
minimum width. They will not stretch to fill their container unless told to.

**Correct approach:** Set `width: 100%` on the component, or use `kendo-formfield` /
the KendoReact `FormField` wrapper which handles width automatically.

---

### ❌ Hardcoded colors in custom templates inside dark-themed pages

**Why it's wrong:** Fixed hex colors do not adapt to the active theme, creating
light-colored elements on dark backgrounds.

**Correct approach:** Always reference Kendo CSS variables (`var(--kendo-color-*)`)
in custom cell templates and wrappers.

---

## Navigation Anti-Patterns

### ❌ Using a hamburger menu as the only navigation on desktop

**Why it's wrong:** Hides navigation behind an extra click on a device where screen
space is not limited. Desktop users expect navigation to be visible without interaction.
Hidden navigation reduces content discovery significantly compared to visible navigation.

**Correct approach:** On desktop (≥ 1024px), show navigation items directly — sidebar,
top nav, or tab bar. Reserve collapsed/hamburger patterns for mobile viewports (< 640px) only.

---

### ❌ No breadcrumbs on deep content pages

**Why it's wrong:** Users lose context of where they are in the application hierarchy.
The browser back button is an unreliable substitute — it navigates to the previous URL,
which may have been an external page or a filtered state the user does not want to return to.

**Correct approach:** Add a Kendo `<Breadcrumb>` component to any page that is more than
2 levels deep in the navigation hierarchy. Place it above the page title.

---

### ❌ "No results" pages that are empty dead ends

**Why it's wrong:** Users have no recovery path. A blank list with no message or action
leaves users unsure whether the application failed or their search was genuinely empty.

**Correct approach:** Always show an explanation, the context of what was searched, and
a corrective action:

```
No results for "invoice 2024"
Try adjusting your search or clear the date filter.
[Clear filters]   [Browse all invoices]
```

---

### ❌ Inconsistent link and navigation styling

**Why it's wrong:** Users learn to recognize interactive elements by their visual pattern.
Changing link colors, underlines, or navigation item styles across sections forces users
to re-learn the interface in every new area, increasing cognitive load and reducing trust.

**Correct approach:** Establish a single link style across the application and apply it
consistently. Use Kendo's semantic color tokens for interactive text
(`var(--kendo-color-primary)`).

---

### ❌ More than 7 top-level navigation items

**Why it's wrong:** Exceeds working memory limits. Users cannot hold more than ~7 items
in short-term memory, so excess navigation entries compete for attention and effectively
become invisible.

**Correct approach:** Group related items under a parent label. A maximum of 7 top-level
navigation entries is the practical upper limit for effective wayfinding.

---

## Forms Anti-Patterns

### ❌ No required field indicators

**Why it's wrong:** Users cannot tell which fields must be filled before submission.
They attempt to submit incomplete forms and only discover validation errors after the
round-trip, increasing frustration and abandonment.

**Correct approach:** Mark required fields visibly — an asterisk (*) next to the label
is the universally understood convention. Add a legend near the form: "* Required field".

---

### ❌ Including a Reset / Clear form button

**Why it's wrong:** A single accidental click destroys all entered data with no undo.
Users almost never intentionally reset an entire form, but they frequently mis-click
buttons that are adjacent to "Submit" or "Save".

**Correct approach:** Remove reset buttons from all forms. If clearing is a genuine
workflow requirement, require explicit confirmation:

```
Clear form? This will remove all entered data.
[Clear form]   [Cancel]
```

---

### ❌ Error messages positioned far from the offending input

**Why it's wrong:** When an error is surfaced only at the top of a long form after
submission, users must scroll and cross-reference to identify which field is wrong.
This significantly increases the perceived cost of correcting mistakes.

**Correct approach:** Show inline validation errors directly below the offending field
(within 8px), in error-state color paired with an error icon. Use `aria-describedby`
to programmatically associate the error message with the input for screen readers.

---

### ❌ Overloading forms with excessive fields

**Why it's wrong:** Each additional field reduces completion rates. Users abandon forms
that appear long or complex, especially on mobile. Fields that are not immediately
necessary undermine the perceived simplicity of the task.

**Correct approach:** Show only the fields required for the current step. Use progressive
disclosure — reveal optional or contextually relevant fields only when needed. Split very
long forms into clearly labelled multi-step flows with a step indicator.

