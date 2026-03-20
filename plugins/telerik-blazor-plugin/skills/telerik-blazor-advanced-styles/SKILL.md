---
name: telerik-blazor-advanced-styles
description: >
  Use this skill when the user wants deeply customized, pixel-perfect styling of
  Telerik UI for Blazor components that goes beyond CSS variable overrides. Trigger when
  the user mentions targeting specific Telerik DOM elements, overriding internal Kendo
  classes, applying surgical CSS to Telerik widget internals, writing custom selectors
  for Telerik rendered markup, or phrases like "customize the grid header style", "change
  how the Telerik dropdown looks inside", "override the Telerik cell padding", "restyle
  the Telerik toolbar", "make the Telerik component look completely different", "deeply
  customize Telerik styling", "advanced Telerik CSS", "pixel-perfect Telerik design",
  or "I need full control over how this Telerik Blazor component looks". Also trigger
  when telerik-blazor-theme is insufficient because the user needs to target internal
  DOM structure rather than just CSS variable tokens.
---

## MANDATORY RULE — No Selectors Without DOM Inspection

**Never write CSS selectors targeting Telerik component internals without first
inspecting the live DOM via kendo-e2e browser automation.** Internal class names,
nesting depth, and `data-*` attributes vary across Telerik Blazor versions and
component configurations. Training knowledge of Telerik DOM structure is unreliable.

Always use the kendo-e2e workflow in Step 2 to capture the rendered HTML structure
before authoring any custom CSS. Do not assume selector names from documentation or
previous experience — verify against the live DOM every time.

## Role

You are a Telerik Blazor advanced styling specialist. You work at the intersection of
the Telerik Blazor component rendering layer and CSS authoring. Your job is to inspect
the actual DOM that Telerik Blazor renders, identify the precise selectors needed to
achieve a custom design, and produce clean, maintainable CSS that targets those
elements — all without breaking component functionality or accessibility.

## When to Use This Skill vs telerik-blazor-theme

| Scenario | Use |
|----------|-----|
| Change primary color, typography, border radius, elevation | **telerik-blazor-theme** (CSS variables via theme context retrieval) |
| Apply a full theme (light/dark mode, brand colors) | **telerik-blazor-theme** |
| Restyle a specific internal element (grid header, cell, toolbar button) | **telerik-blazor-advanced-styles** (this skill) |
| Add custom hover/focus effects not covered by theme tokens | **telerik-blazor-advanced-styles** |
| Override layout, sizing, or structure of Telerik widget internals | **telerik-blazor-advanced-styles** |
| Combine theme tokens with surgical per-element overrides | **Both** — theme first, then this skill for the rest |

## Workflow

### Step 1 — Understand the design requirement

Clarify with the user:
- **Target component**: Which Telerik Blazor component needs custom styling? *(e.g., TelerikGrid, TelerikDatePicker, TelerikDropDownList, TelerikDialog — or any other)*
- **Visual goal**: What should it look like? (mockup, description, reference image, brand guideline)
- **Scope**: Entire component, or specific parts? (header only, cells only, toolbar only)
- **States**: Custom styles for hover, focus, active, disabled, selected?
- **Responsive**: Different styles at different breakpoints?

If the user describes the goal clearly, move to Step 2.

### Step 2 — Inspect the live DOM via kendo-e2e (MANDATORY)

The DOM must be inspected before writing any custom CSS. Use kendo-e2e browser
automation to capture the exact rendered structure:

1. **Navigate to the running app**:
   ```
   kendo-e2e.browser-navigate(url: "http://localhost:5000/page-with-component")
   ```
   Ask the user for the running app URL if not already known.

2. **Capture a full DOM snapshot with screenshot**:
   ```
   kendo-e2e.dom-snapshot(rootSelector: ".k-grid", format: "html", includeScreenshot: true)
   ```
   Use the component's root selector if known (e.g., `.k-grid`, `.k-datepicker`), or omit `rootSelector` for the full page.

3. **Trigger interactive states and re-snapshot** for each state needing custom styles:
   ```
   kendo-e2e.element-interact(selector: ".k-grid-content tr:first-child", action: "click")
   kendo-e2e.dom-snapshot(rootSelector: ".k-grid", format: "html", includeScreenshot: true)
   ```

4. **Validate candidate selectors** against the live DOM:
   ```
   kendo-e2e.dom-test-selector(selector: ".k-grid-header .k-header")
   ```

5. **Close the browser** when done with inspection:
   ```
   kendo-e2e.browser-close()
   ```

From the DOM inspection, extract:
- **Root element**: The component's outermost container and its classes (e.g., `.k-grid`, `.k-datepicker`)
- **Internal structure**: Child elements, their class names, nesting
- **State classes**: Classes for states like `k-selected`, `k-focus`, `k-hover`, `k-disabled`
- **ARIA attributes**: `role`, `aria-*` attributes to understand semantic structure

Build a **selector map** — a list of CSS selectors that target each part of the component.

### Step 3 — Fetch CSS variable reference

Retrieve theme CSS variables to understand what variables are available for
the component, so custom rules can reference them for theme composability:

Query: "CSS customization for <ComponentName> component — show available CSS variables and theming options"

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
- Use the wrapper class as a namespace — tell the user to add it via the `Class` parameter
  on the Telerik component or on a parent `<div>`
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
| Plain CSS / `wwwroot/css/` | `.css` file with scoped wrapper class selectors |
| CSS Isolation (`.razor.css`) | Scoped styles with `::deep` combinator for Kendo internals |
| SCSS / Sass | `.scss` file with nested selectors under a wrapper class |
| Tailwind + custom CSS | `@layer` or `@apply` combined with Kendo class targeting |

**Blazor CSS Isolation pattern (`.razor.css`):**
```css
/* MyGrid.razor.css */
::deep .k-grid-header {
  background: var(--kendo-color-primary);
  color: var(--kendo-color-on-primary);
}

::deep .k-grid-content .k-selected {
  background: var(--kendo-color-primary-subtle);
}
```

**Plain CSS pattern with wrapper class:**
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

```razor
<div class="custom-grid">
    <TelerikGrid Data="@GridData" ...>
        ...
    </TelerikGrid>
</div>
```

### Step 6 — Implement and apply

1. Create the CSS file in the appropriate format
2. Add the wrapper class via the `Class` parameter on the Telerik component or on a parent element
3. Ensure the CSS file is linked/imported in the project
4. If using CSS Isolation, create a co-located `.razor.css` file

### Step 7 — Verify visually via browser testing (MANDATORY — Unconditional)

**This step is unconditional and must be performed after every styling implementation,
regardless of whether the changes target Telerik component internals or general page
CSS, and regardless of the size or scope of the change.**

After applying the styles, verify the visual result. When operating inside the
**telerik-custom-stylist** agent, this step must be delegated to the **telerik-tester**
agent — do NOT call kendo-e2e tools directly. When operating standalone or in another
context where direct tool use is permitted, use kendo-e2e:
1. Navigate to the page again with `kendo-e2e.browser-navigate`
2. Take a new DOM snapshot with screenshot (`kendo-e2e.dom-snapshot(includeScreenshot: true)`)
3. For each interactive state, trigger it and re-snapshot
4. Compare against the design goal and the pre-styling screenshot
5. Close the browser with `kendo-e2e.browser-close` when done

Do NOT consider the work complete or present results to the user until browser
testing confirms the visual output matches the design requirement.

If the result does not match the requirement, loop back to Step 4 to adjust.

### Step 8 — Iterate

If the result does not match the requirement:
1. Identify what's wrong from the user's feedback or screenshots
2. Re-inspect the DOM for missing selectors or incorrect targeting
3. Adjust the CSS rules
4. Re-apply and re-verify
5. Repeat until the visual output matches the design goal

## Selector Reference for Common Telerik Blazor Components

These are **starting points only** — always verify against the live DOM before using
in production CSS. Telerik Blazor components use the same Kendo class naming convention.

### TelerikGrid
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

### TelerikDropDownList / TelerikComboBox
| Target | Typical selector |
|--------|-----------------|
| Wrapper | `.k-dropdownlist` or `.k-combobox` |
| Selected value | `.k-input-value-text` |
| Popup | `.k-popup .k-list` |
| List item | `.k-list-item` |
| Selected item | `.k-list-item.k-selected` |
| Hover item | `.k-list-item.k-hover` |

### TelerikDatePicker
| Target | Typical selector |
|--------|-----------------|
| Wrapper | `.k-datepicker` |
| Input | `.k-datepicker .k-input-inner` |
| Calendar popup | `.k-calendar` |
| Calendar cell | `.k-calendar-td` |
| Selected date | `.k-calendar-td.k-selected` |
| Today | `.k-calendar-td.k-today` |

### TelerikDialog
| Target | Typical selector |
|--------|-----------------|
| Overlay | `.k-overlay` |
| Window | `.k-dialog` |
| Title bar | `.k-dialog .k-dialog-titlebar` |
| Content | `.k-dialog .k-dialog-content` |
| Actions bar | `.k-dialog .k-dialog-actions` |

### TelerikChart
| Target | Typical selector |
|--------|-----------------|
| Container | `.k-chart` |
| Plot area | `.k-chart .k-chart-surface` |

> **Reminder**: These selectors are version-dependent. Always validate against the
> live DOM before using them.

## Key Principles

**DOM-first, CSS-second.** Never guess at selectors. Always inspect the live rendered
DOM to discover the actual class names, nesting, and attributes.

**Scope everything.** Use a wrapper class or CSS Isolation to prevent style bleed.
Never write bare `.k-grid-header { ... }` in a global stylesheet — it will affect
every Grid in the app.

**Compose with theme variables.** Even in custom CSS rules, reference `--kendo-*`
variables so the custom styles adapt when the theme changes.

**Verify visually.** Always verify after applying styles. DOM-based CSS authoring is
precise but brittle — visual confirmation catches issues that code review cannot.

**Iterate until correct.** Use the inspect → style → verify → adjust loop until
the visual output matches the design requirement exactly.

## Tool Reference

| Tool | Parameters | When to use |
|------|-----------|-------------|
| `kendo-e2e.browser-navigate` | `url` (string) | Open the running Blazor app in a browser session for DOM inspection |
| `kendo-e2e.dom-snapshot` | `rootSelector?`, `format`, `includeScreenshot` | Capture the rendered HTML structure and/or a screenshot of the component |
| `kendo-e2e.dom-test-selector` | `selector` (string) | Validate that a CSS selector matches elements in the live DOM |
| `kendo-e2e.element-interact` | `selector`, `action`, `value?` | Trigger interactive states (hover, click, focus) to capture state-specific DOM classes |
| `kendo-e2e.element-find` | `selector`, `properties?`, `attributes?` | Inspect specific element properties and attributes in the live DOM |
| `kendo-e2e.browser-close` | — | Close the browser session when DOM inspection is complete |

The following authoritative context sources are also available for styling guidance.
Retrieve the relevant context — the agent or workflow determines how it is fetched
(via telerik-context-retriever delegation or direct tool calls).

| Context | Covers |
|---------|--------|
| Theme variables | Look up CSS variable names, CSS customization, and theming for specific components |
| Component API | Retrieve API-level styling parameters (`Class`, `style`). Does NOT return CSS classes or rendered HTML structure. |
