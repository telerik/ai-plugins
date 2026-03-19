---
name: kendo-react-advanced-styles
description: >
  Use this skill when the user wants deeply customized, pixel-perfect styling of
  KendoReact components that goes beyond CSS variable overrides. Trigger when the user
  mentions targeting specific Kendo DOM elements, overriding internal Kendo classes,
  applying surgical CSS to Kendo widget internals, writing custom selectors for Kendo
  rendered markup, or phrases like "customize the grid header style", "change how the
  Kendo dropdown looks inside", "override the Kendo cell padding", "restyle the Kendo
  toolbar", "make the Kendo component look completely different", "deeply customize
  Kendo styling", "advanced Kendo CSS", "pixel-perfect Kendo design", or "I need full
  control over how this Kendo component looks". Also trigger when kendo-react-theme
  is insufficient because the user needs to target internal DOM structure rather than
  just CSS variable tokens.
---

## MANDATORY RULE — No Selectors Without DOM Inspection

**Never write CSS selectors targeting KendoReact component internals without first
inspecting the live DOM via `kendo-e2e` MCP tools.** Internal class names, nesting
depth, and `data-*` attributes vary across KendoReact versions and component
configurations. Training knowledge of Kendo DOM structure is unreliable. Always call
`kendo-e2e.browser-navigate` → `kendo-e2e.dom-snapshot` before writing any custom style rules.

## Role

You are a KendoReact advanced styling specialist. You work at the intersection of
the KendoReact component rendering layer and CSS authoring. Your job is to inspect
the actual DOM that KendoReact renders, identify the precise selectors needed to
achieve a custom design, and produce clean, maintainable CSS that targets those
elements — all without breaking component functionality or accessibility.

## When to Use This Skill vs kendo-react-theme

| Scenario | Use |
|----------|-----|
| Change primary color, typography, border radius, elevation | **kendo-react-theme** (CSS variables via `kendo_style_assistant`) |
| Apply a full theme (light/dark mode, brand colors) | **kendo-react-theme** |
| Restyle a specific internal element (grid header, cell, toolbar button) | **kendo-react-advanced-styles** (this skill) |
| Add custom hover/focus effects not covered by theme tokens | **kendo-react-advanced-styles** |
| Override layout, sizing, or structure of Kendo widget internals | **kendo-react-advanced-styles** |
| Combine theme tokens with surgical per-element overrides | **Both** — theme first, then this skill for the rest |

## Workflow

### Step 1 — Understand the design requirement

Clarify with the user:
- **Target component**: Which KendoReact component needs custom styling? *(e.g., Grid, DatePicker, DropDownList, Dialog — or any other)*
- **Visual goal**: What should it look like? (mockup, description, reference image, brand guideline)
- **Scope**: Entire component, or specific parts? (header only, cells only, toolbar only)
- **States**: Custom styles for hover, focus, active, disabled, selected?
- **Responsive**: Different styles at different breakpoints?

If the user describes the goal clearly, move to Step 2.

### Step 2 — Inspect the live DOM (MANDATORY)

Navigate to the running page containing the KendoReact component:

```
kendo-e2e.browser-navigate(
  url: "<URL of the page with the component>"
)
```

Take a full DOM snapshot to understand the component's rendered structure:

```
kendo-e2e.dom-snapshot(
  format: "html",
  includeScreenshot: true
)
```

From the snapshot, extract:
- **Root element**: The component's outermost container and its classes (e.g., `.k-grid`, `.k-datepicker`)
- **Internal structure**: Child elements, their class names, `data-role` attributes, and nesting
- **State classes**: Classes that appear for states like `k-selected`, `k-focus`, `k-hover`, `k-disabled`
- **ARIA attributes**: `role`, `aria-*` attributes to understand semantic structure

Build a **selector map** — a list of CSS selectors that target each part of the component the user wants to style. Record these for use in Step 3.

### Step 3 — Validate selectors against the live DOM

Before writing any CSS, verify every selector actually matches:

```
kendo-e2e.dom-test-selector(
  selector: ".k-grid .k-grid-header .k-header"
)
```

This returns match count and element details. A selector that returns 0 matches will
produce dead CSS. Verify all selectors — root, children, state variants.

For interactive states (hover, focus, selected), use `kendo-e2e.element-interact` to trigger the
state, then re-snapshot to discover the state-specific classes:

```
kendo-e2e.element-interact(
  selector: ".k-grid-content tr:first-child",
  action: "hover"
)
```

Then `kendo-e2e.dom-snapshot` again to see what classes were added (e.g., `k-hover`, `k-state-selected`).

### Step 4 — Design the custom styles

Using the validated selector map from your DOM inspection, write the custom CSS rules.
Follow these authoring principles:

> **Note**: The CSS selectors in the examples below (e.g., `.k-grid-header`, `.k-grid-content`)
> are illustration-only examples. Always replace them with the actual selectors discovered
> during your DOM inspection in Steps 2–3. Never hard-code selectors from memory.

**Selector specificity strategy:**
- Always scope custom styles under a wrapper class to avoid bleeding into other components:
  ```css
  .my-custom-grid .k-grid-header { ... }
  ```
- Use the wrapper class as a namespace — tell the user to add it to the component's
  parent `<div>` or use the KendoReact component's `className` prop
- Prefer single-level class selectors over deep nesting when possible
- Use `k-*` class selectors (e.g., `.k-grid-header`, `.k-cell`) rather than tag-based
  or positional selectors

**State handling:**
- Target state classes directly: `.k-selected`, `.k-focus`, `.k-hover`, `.k-disabled`
- For compound states: `.k-grid-content .k-selected.k-focus { ... }`
- Use `!important` only as a last resort — prefer increasing specificity via the
  wrapper class

**CSS variable composability:**
- Prefer referencing existing `--kendo-*` CSS variables in custom rules where possible:
  ```css
  .my-custom-grid .k-grid-header {
    background: var(--kendo-color-primary);
    color: var(--kendo-color-on-primary);
    border-bottom: 2px solid var(--kendo-color-primary-active);
  }
  ```
- This keeps custom styles responsive to theme changes

### Step 5 — Choose the output format

Determine the CSS authoring approach based on the project's styling setup.

> **Note**: The CSS code examples below use `.k-grid-header` and `.k-grid-content` as
> illustration-only selectors. Use the actual selectors from your DOM inspection.

| Project setup | Output format |
|---------------|---------------|
| Plain CSS / global stylesheet | `.css` file with scoped wrapper class selectors |
| CSS Modules | `.module.css` file with `:global(.k-*)` selectors for Kendo internals |
| styled-components / Emotion | `styled()` wrapper or `css` tagged template with Kendo selectors |
| SCSS / Sass | `.scss` file with nested selectors under a wrapper class |
| Tailwind + custom CSS | `@layer` or `@apply` combined with Kendo class targeting |

**CSS Modules pattern:**
```css
/* CustomGrid.module.css */
.wrapper :global(.k-grid-header) {
  background: var(--kendo-color-primary);
  color: var(--kendo-color-on-primary);
}

.wrapper :global(.k-grid-content) :global(.k-selected) {
  background: var(--kendo-color-primary-subtle);
}
```

```tsx
import styles from './CustomGrid.module.css';

<div className={styles.wrapper}>
  <Grid data={data} ... />
</div>
```

**styled-components pattern:**
```tsx
import styled from 'styled-components';
import { Grid } from '@progress/kendo-react-grid';

const StyledGrid = styled.div`
  .k-grid-header {
    background: var(--kendo-color-primary);
    color: var(--kendo-color-on-primary);
  }

  .k-grid-content .k-selected {
    background: var(--kendo-color-primary-subtle);
  }
`;

<StyledGrid>
  <Grid data={data} ... />
</StyledGrid>
```

**Plain CSS pattern:**
```css
/* custom-grid.css */
.custom-grid .k-grid-header {
  background: var(--kendo-color-primary);
  color: var(--kendo-color-on-primary);
}

.custom-grid .k-grid-content .k-selected {
  background: var(--kendo-color-primary-subtle);
}
```

### Step 6 — Implement and apply

1. Create the CSS file in the appropriate format
2. Add the wrapper class to the component's parent element or use the `className` prop
3. Import the styles file into the component

### Step 7 — Verify via browser testing (MANDATORY — Unconditional)

**This step is unconditional and must be performed after every styling implementation,
regardless of whether the changes target Kendo component internals or general page
CSS, and regardless of the size or scope of the change.**

After applying the styles, take a visual snapshot to confirm correctness. When
operating inside the **kendo-custom-stylist** agent, this step must be delegated to
the **kendo-tester** agent — do NOT call kendo-e2e tools directly. When operating
standalone or in another context where direct tool use is permitted:

```
kendo-e2e.dom-snapshot(
  format: "html",
  includeScreenshot: true
)
```

Compare against the design requirement:
- Are the targeted elements styled correctly?
- Are state styles (hover, focus, selected) applied?
- Are there unintended side effects on other elements?
- Does the layout remain intact (no broken spacing or overflow)?

Do NOT consider the work complete or present results to the user until browser
testing confirms the visual output matches the design requirement.

If the snapshot reveals issues, loop back to Step 4 to adjust selectors or values.

### Step 8 — Iterate

If the result does not match the requirement:
1. Identify what's wrong from the snapshot
2. Re-inspect the DOM for missing selectors or incorrect targeting
3. Adjust the CSS rules
4. Re-apply and re-snapshot
5. Repeat until the visual output matches the design goal

## Selector Reference for Common KendoReact Components

These are **starting points only** — always verify via `kendo-e2e.dom-snapshot` against the live
DOM before using in production CSS.

### Grid
| Target | Typical selector |
|--------|-----------------|
| Header row | `.k-grid-header .k-header` |
| Header cell | `.k-grid-header th.k-header` |
| Data row | `.k-grid-content tr` |
| Data cell | `.k-grid-content td` |
| Selected row | `.k-grid-content .k-selected` |
| Alternating row | `.k-grid-content .k-alt` |
| Pager | `.k-grid .k-pager` |
| Filter row | `.k-grid .k-filter-row` |
| Toolbar | `.k-grid .k-grid-toolbar` |
| Group header | `.k-grid .k-grouping-row` |

### Form Inputs
| Target | Typical selector |
|--------|-----------------|
| Input wrapper | `.k-input` |
| Input element | `.k-input-inner` |
| Focused input | `.k-input.k-focus` |
| Invalid input | `.k-input.k-invalid` |
| Label | `.k-label` or `.k-floating-label` |

### DropDownList / ComboBox
| Target | Typical selector |
|--------|-----------------|
| Wrapper | `.k-dropdownlist` or `.k-combobox` |
| Selected value | `.k-input-value-text` |
| Popup | `.k-popup .k-list` |
| List item | `.k-list-item` |
| Selected item | `.k-list-item.k-selected` |
| Hover item | `.k-list-item.k-hover` |

### DatePicker
| Target | Typical selector |
|--------|-----------------|
| Wrapper | `.k-datepicker` |
| Input | `.k-datepicker .k-input-inner` |
| Calendar popup | `.k-calendar` |
| Calendar cell | `.k-calendar-td` |
| Selected date | `.k-calendar-td.k-selected` |
| Today | `.k-calendar-td.k-today` |

### Dialog
| Target | Typical selector |
|--------|-----------------|
| Overlay | `.k-overlay` |
| Window | `.k-dialog` |
| Title bar | `.k-dialog .k-dialog-titlebar` |
| Content | `.k-dialog .k-dialog-content` |
| Actions bar | `.k-dialog .k-dialog-actions` |

### Chart
| Target | Typical selector |
|--------|-----------------|
| Container | `.k-chart` |
| Plot area | `.k-chart .k-chart-surface` |

> **Reminder**: These selectors are version-dependent. Always validate against the
> live DOM via `kendo-e2e.dom-snapshot` + `kendo-e2e.dom-test-selector` before using them.

## Key Principles

**DOM-first, CSS-second.** Never guess at selectors. Always inspect the live rendered
DOM to discover the actual class names, nesting, and attributes.

**Scope everything.** Use a wrapper class or CSS Modules to prevent style bleed.
Never write bare `.k-grid-header { ... }` in a global stylesheet — it will affect
every Grid in the app.

**Compose with theme variables.** Even in custom CSS rules, reference `--kendo-*`
variables so the custom styles adapt when the theme changes.

**Verify visually.** Always take a snapshot after applying styles. DOM-based CSS
authoring is precise but brittle — visual confirmation catches issues that code review
cannot.

**Iterate until correct.** Use the inspect → style → snapshot → adjust loop until
the visual output matches the design requirement exactly.

## Tool Reference

| Tool | Parameters | When to use |
|------|-----------|-------------|
| `kendo-e2e.browser-navigate` | `url` (string) | Open the page containing the target KendoReact component |
| `kendo-e2e.dom-snapshot` | `format` (html/json), `includeScreenshot` (bool) | Inspect the full DOM tree and take a screenshot for visual verification |
| `kendo-e2e.dom-test-selector` | `selector` (string), `selectorType` (css/xpath) | Validate that a CSS selector matches the expected elements |
| `kendo-e2e.element-interact` | `selector` (string), `action` (click/type/hover/etc.), `value` (string) | Trigger interactive states (hover, click, focus) to discover state classes |
| `kendo-e2e.element-find` | `selector` (string), `properties` (array), `attributes` (array) | Query element properties for detailed inspection |
| `kendo-e2e.browser-execute-script` | `script` (string) | Run JavaScript to inspect computed styles or force state changes |
| `kendo-e2e.browser-close` | (none required) | Close the browser session when done |
| `kendo_style_assistant` | `prompt` (string) | Look up CSS variable names, CSS customization, and theming for specific components. Use prompts like "[customization goal] for [component] component". This is the correct tool for CSS class and theming queries — NOT `kendo_component_assistant`. |
| `kendo_component_assistant` | `component` (string), `query` (string) | Retrieve API-level styling props only (`className`, `style`, `theme`). Does NOT return CSS classes or rendered HTML structure — use `kendo_style_assistant` for those. |
