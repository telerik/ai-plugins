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

## Purpose

This skill teaches advanced CSS styling techniques for Telerik Blazor component
internals — targeting rendered DOM elements, state classes, and internal structure
to produce clean, maintainable CSS without breaking component functionality or
accessibility.

## When to Use This Skill vs telerik-blazor-theme

| Scenario | Use |
|----------|-----|
| Change primary color, typography, border radius, elevation | **telerik-blazor-theme** (CSS variables) |
| Apply a full theme (light/dark mode, brand colors) | **telerik-blazor-theme** |
| Restyle a specific internal element (grid header, cell, toolbar button) | **telerik-blazor-advanced-styles** (this skill) |
| Add custom hover/focus effects not covered by theme tokens | **telerik-blazor-advanced-styles** |
| Override layout, sizing, or structure of Telerik widget internals | **telerik-blazor-advanced-styles** |
| Combine theme tokens with surgical per-element overrides | **Both** — theme first, then this skill for the rest |

## Selector Map Methodology

A **selector map** is the foundation of every advanced styling task. Before writing
any CSS, build a map of CSS selectors for each element to style. The selector map
must come from live DOM inspection (via the kendo-e2e skill), never from memory.

For each target element, record:
- **Root element**: The component's outermost container and its classes (e.g., `.k-grid`, `.k-datepicker`)
- **Internal structure**: Child elements, their class names, `data-*` attributes, and nesting
- **State classes**: Classes that appear for states like `k-selected`, `k-focus`, `k-hover`, `k-disabled`
- **ARIA attributes**: `role`, `aria-*` attributes to understand semantic structure

## CSS Authoring Principles

> **Note**: The CSS selectors in examples below (e.g., `.k-grid-header`) are
> illustrations only. Always replace with selectors from your DOM inspection.

### Scoping — Prevent style bleed

Always scope custom styles under a wrapper class:
```css
.my-custom-grid .k-grid-header { ... }
```

Add the wrapper class via the `Class` parameter on the Telerik component or on a
parent `<div>`. Never write bare `.k-grid-header { ... }` in a global stylesheet —
it will affect every Grid in the app.

### State class targeting

Target state classes directly:
- `.k-selected` — selected state
- `.k-focus` — focused state
- `.k-hover` — hovered state
- `.k-disabled` — disabled state
- Compound states: `.k-grid-content .k-selected.k-focus { ... }`

### Specificity strategy

- Use the wrapper class as a namespace for specificity
- Prefer single-level class selectors over deep nesting
- Use `k-*` class selectors rather than tag-based or positional selectors
- Use `!important` only as a last resort — prefer increasing specificity via the
  wrapper class

### CSS variable composability

Reference existing `--kendo-*` CSS variables in custom rules so styles adapt to
theme changes:
```css
.my-custom-grid .k-grid-header {
  background: var(--kendo-color-primary);
  color: var(--kendo-color-on-primary);
  border-bottom: 2px solid var(--kendo-color-primary-active);
}
```

## Output Format Patterns

Choose based on the project's styling setup:

| Project setup | Output format |
|---------------|---------------|
| Plain CSS / `wwwroot/css/` | `.css` file with scoped wrapper class selectors |
| CSS Isolation (`.razor.css`) | Scoped styles with `::deep` combinator for Kendo internals |
| SCSS / Sass | `.scss` file with nested selectors under a wrapper class |
| Tailwind + custom CSS | `@layer` or `@apply` combined with Kendo class targeting |

### Blazor CSS Isolation pattern (`.razor.css`)
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

### Plain CSS pattern with wrapper class
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

## Selector Reference for Common Telerik Blazor Components

These are **starting points only** — always verify via DOM inspection before using.

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

**Compose with theme variables.** Even in custom CSS rules, reference `--kendo-*`
variables so the custom styles adapt when the theme changes.

**Verify visually.** Always take a snapshot after applying styles. DOM-based CSS
authoring is precise but brittle — visual confirmation catches issues that code review
cannot.

**Iterate until correct.** Use the inspect → style → snapshot → adjust loop until
the visual output matches the design requirement exactly.
