---
name: kendo-react-design-guidelines
description: >
  Use this skill when the user wants to apply design system standards, follow UX best
  practices, or enforce accessibility guidelines during React development. Trigger when
  the user mentions design tokens, spacing conventions, typography rules, color usage,
  component selection rationale, WCAG compliance, keyboard interaction patterns, or
  asks phrases like "follow the design system", "match the design spec", "apply design
  guidelines", "implement from Figma", "is this accessible", "does this match our
  design language", "audit my design implementation", "implement design tokens",
  "check UX patterns", "review the design", "does this meet accessibility standards",
  "design review", "apply visual hierarchy", or "enforce design consistency".
  Also trigger when starting a new feature, page, or component from scratch where
  design alignment must be established before coding begins.
---

# Design Guidelines for React Development

## Reference Files

This skill ships authoritative reference files. They encode the definitive knowledge
base — the SKILL.md body defines the process and structure; the reference files supply the
detailed domain content to apply during each phase.

### `references/ux-principles.md` — UX Principles

**Load for Phase A (Pre-Implementation).** Contains:
- Enterprise type hierarchy: page title → section header → body → label → caption, with Kendo class mappings
- Font selection guidance: recommended enterprise and data-heavy typefaces, numeric alignment with `tabular-nums`, line length constraints
- Semantic color system: the 5 Kendo semantic color slots and when to use each; color blindness considerations; surface hierarchy (page bg → component bg → header → selected)
- Spatial design and density tiers: `size="small"` / default / `size="large"` with when to apply each; whitespace minimums for sections, cards, forms, and page margins
- Page grid geometry: max-width pattern, CSS Grid for layout (never Splitter)
- Motion rules: Kendo's `--kendo-duration-global`, custom transition patterns, `prefers-reduced-motion` handling, duration limits
- Interaction patterns: focus states, loading patterns, error recovery, tooltip rules, hover states
- Responsive breakpoints (Mobile < 640px / Tablet 640–1024px / Desktop 1024–1440px / Wide > 1440px) and how Kendo components behave at each
- UX writing standards: label vs placeholder usage, button verb rules, error message quality, Grid column header conventions, empty state structure

### `references/anti-patterns.md` — Anti-Patterns

**Load for Phase B (Design Review).** Contains the definitive list of what NOT to do, organized into 7 categories:
- **Theming**: `!important` overrides, mixing theme packages, hardcoded colors, custom font risks
- **Grid**: missing column widths, no pagination/virtualization, feature overload, missing focusable on cell interactives, misaligned numeric columns, raw ISO dates
- **Accessibility**: outline removal, color-only status, icon-only buttons without labels, `<div>` for interactive cell content
- **UX Writing**: generic button labels, technical error messages, placeholder-as-label
- **Layout**: Splitter as page layout, mixed `size` variants, infinite-width containers
- **Performance**: inline object literals bound to Chart inputs, unbounced incell edit saves
- **Visual Layout**: components without layout containers, dark theme without page background, flex child without `min-width: 0`, Grid/Chart without explicit height, DropDownList/DatePicker width collapse, hardcoded colors in dark-themed templates

Cross-check every audit finding against this list. Findings that match a known anti-pattern
must reference it by name in the report.

### `references/nng-content-scanning.md` — NNG: Content Scanning & Hierarchy

**Load for Phase A (Pre-Implementation) when structuring content-heavy pages.** Contains:
- F-pattern and layer-cake scanning behavior — where user attention falls on screen
- Left-side priority: placement rules for CTAs, key data, and headings
- Content structure for scannability: descriptive headings, bullet points, short paragraphs, selective bolding
- Heading hierarchy as a navigation device with Kendo class mappings (`k-h1` → `k-h4`)

### `references/nng-navigation-wayfinding.md` — NNG: Navigation & Wayfinding

**Load for Phase A (Pre-Implementation) when designing navigation, search, or empty states.** Contains:
- Search placement rules: top-right, minimum 200px width, keyboard/click behavior
- Breadcrumb usage: when to add, placement relative to page title, correct Kendo component
- Navigation structure limits: maximum 7 top-level items, label conventions, vertical vs horizontal nav
- Mobile vs desktop: when hamburger is acceptable and when it is not
- "No results" state design: required content (explanation + context + corrective action)

### `references/nng-navigation-anti-patterns.md` — NNG: Navigation Anti-Patterns

**Load for Phase B (Design Review) when auditing navigation.** Contains:
- Hamburger as sole desktop navigation
- Missing breadcrumbs on deep content pages
- Empty "no results" dead ends
- Inconsistent link and navigation styling
- More than 7 top-level navigation items

### `references/nng-forms-anti-patterns.md` — NNG: Forms Anti-Patterns

**Load for Phase B (Design Review) when auditing forms.** Contains:
- Missing required field indicators
- Reset / Clear form buttons
- Error messages positioned far from the offending input
- Overloading forms with excessive fields

**Load both `anti-patterns.md` and the relevant `nng-*` files** when performing a full end-to-end design review.

---

## Purpose

This skill provides design system best practices, UX standards, and accessibility
guidelines to apply at two specific points in the React development lifecycle:

1. **Before implementation begins** — establish constraints, token decisions, and
   component selection rationale from a design spec or description.
2. **During design review** — audit an existing implementation against those standards
   and produce a structured findings report.

---

## Phase A: Initial Design Guidelines (Pre-Implementation)

Apply these guidelines when starting a new feature, page, or component.

> **Load `references/ux-principles.md`** before executing this phase.

### 1. Establish the Design Contract

Before writing any code, capture the following from the spec or design file:

- **Layout intent**: grid vs flex, breakpoints, responsive behavior
- **Spacing scale**: identify the base unit (4px, 8px) and derive all margins, paddings,
  and gaps from it — never use arbitrary pixel values
- **Typography scale**: heading levels (H1–H6), body, caption — map to design tokens or
  CSS custom properties
- **Color palette**: primary, secondary, neutral, semantic (success/error/warning/info) —
  reference token names, not raw hex values
- **Elevation**: shadow levels for cards, modals, tooltips — use design system utilities
- **Motion**: transition durations and easing curves — reference system tokens
  (e.g. `--kd-animation-duration-fast`)
- **Component selection**: for each UI element in the spec, identify the correct
  KendoReact component and confirm its accessibility support before choosing it

Document this contract as a short comment block at the top of the feature's entry
file or in the PR description before implementation starts.

### 2. Design Token Mapping

Map every visual property to a design token rather than a raw value:

| Visual Property | Correct Approach | Avoid |
|----------------|-----------------|-------|
| Brand color | `var(--kd-color-primary)` | `#ff6358` |
| Spacing sm | `var(--kd-spacing-2)` | `8px` |
| Font size body | `var(--kd-font-size-md)` | `14px` |
| Border radius | `var(--kd-border-radius-md)` | `4px` |
| Shadow card | `var(--kd-elevation-2)` | `0 2px 4px rgba(0,0,0,0.1)` |

When KendoReact theme tokens do not fully cover a custom need, define component-scoped
CSS custom properties in a `.module.css` file and derive them from the global tokens.

### 3. Accessibility Pre-Checks

Before implementing any interactive component, confirm:

- **Focus order**: follows natural DOM reading order or is explicitly managed
- **Color contrast**: text on background ≥ 4.5:1 (AA); large text ≥ 3:1
- **Keyboard entry points**: every interactive widget reachable via Tab
- **Non-color conveyance**: errors, states (selected, disabled), and notifications
  must be indicated by more than color alone (icon, text, pattern)
- **Heading hierarchy**: one `<h1>` per page/view; headings nest sequentially
  (no skipping from H1 to H4)
- **Form labeling**: every input, select, and checkbox has a visible `<label>` or
  an `aria-label`/`aria-labelledby` fallback

Document any deliberate accessibility trade-offs as inline `// a11y:` comments so
they are auditable during review.

### 4. Component Selection Rationale

Choose the simplest KendoReact component that satisfies the requirement:

- Prefer native HTML elements (`<button>`, `<input>`) over KendoReact wrappers when
  no design system styling or interactive enhancement is needed
- Choose `DropDownList` over `ComboBox` unless free-form text entry is required
- Choose `Grid` over `ListView` only when sorting, filtering, or column resizing
  is required — `ListView` has lower overhead for display-only lists
- Choose `DatePicker` over `DateTimePicker` unless time selection is explicitly
  specified in the design
- Choose `PanelBar` or `ExpansionPanel` (accordion pattern) for content-heavy pages
  where progressive disclosure reduces visual noise — prefer it over showing all sections
  expanded by default
- Choose `SplitButton` when an action has one default variant and one or more secondary
  variants (e.g., "Save" with "Save and close" / "Save as draft") — do not use separate
  buttons for default and secondary variants of the same action
- Document every non-obvious component choice with a one-line rationale comment

---

## Phase B: Design Review (During Implementation)

Apply this phase when auditing an existing component or feature against design standards.

> **Load `references/anti-patterns.md`** before executing this phase. Cross-check every finding against the anti-patterns list — findings that match a known anti-pattern should reference it by name in the report.

### 1. Design Conformance Audit

For each component under review, check:

**Layout & Spacing**
- [ ] Spacing values reference design tokens, not hardcoded pixels
- [ ] Grid/flex layout matches the design spec breakpoints
- [ ] Minimum touch target: 44×44px for interactive elements on mobile

**Typography**
- [ ] Font sizes reference the type scale tokens
- [ ] Line heights are set via token or unitless multiplier (not pixels)
- [ ] No `font-weight: bold` — use specific numeric weights (400, 600, 700)

**Color & Theming**
- [ ] All colors reference `var(--kd-color-*)` tokens
- [ ] No hardcoded hex, RGB, or RGBA values in component styles
- [ ] States (hover, focus, active, disabled) use semantic token variants

**Iconography**
- [ ] Icons use the KendoReact icon set or SVG sprites — no unicode icon characters
- [ ] All decorative icons have `aria-hidden="true"`
- [ ] All meaningful icons have an accompanying label or `title`

**Navigation & Content Structure**
- [ ] Breadcrumbs present on pages more than 2 levels deep in the hierarchy
- [ ] Top-level navigation items ≤ 7
- [ ] Search input visible on every page (not hidden behind a menu)
- [ ] "No results" states include an explanation and a corrective action
- [ ] Content headings follow a sequential hierarchy — no skipped levels (H1 → H2 → H3)
- [ ] Long content sections use bullet points or short paragraphs, not dense prose blocks

**Elevation & Depth**
- [ ] Shadow depth matches the intended design elevation level
- [ ] Modal/overlay z-index values come from design system scale

### 2. Accessibility Conformance Audit

**Keyboard Navigation**
- [ ] Tab order is logical and complete
- [ ] Focus indicator is visible and meets 3:1 contrast ratio against adjacent colors
  (WCAG 2.1 SC 1.4.11)
- [ ] No keyboard traps — Escape always closes modals/overlays
- [ ] Arrow key navigation provided within composite widgets (menus, grids, tabs)

**Screen Reader Compatibility**
- [ ] Interactive elements have text alternatives (aria-label, aria-labelledby, or
  visible label)
- [ ] Dynamic updates use `aria-live` regions where appropriate (status, errors)
- [ ] Form validation errors are programmatically associated via `aria-describedby`
- [ ] Status messages do not steal focus (use `role="status"` or `aria-live`)

**WCAG 2.1 AA Checklist**
- 1.1.1 Non-text content has alt text
- 1.3.1 Information conveyed by format is also in text
- 1.4.1 Color is not the sole means of conveying information
- 1.4.3 Text contrast ≥ 4.5:1 (3:1 for large text)
- 2.1.1 All functionality operable by keyboard
- 2.4.3 Focus order is logical
- 2.4.7 Focus visible
- 3.3.1 Errors are identified in text
- 3.3.2 Labels or instructions provided for inputs
- 4.1.2 Name, Role, Value — all UI components expose proper ARIA

### 3. Design Review Report Format

```
## Design Review: [Component / Feature Name]

### Summary
| Category          | Status  | Issues |
|-------------------|---------|--------|
| Spacing & Layout  | ✅ / ⚠️ / ❌ | N     |
| Typography        | ✅ / ⚠️ / ❌ | N     |
| Color & Theming   | ✅ / ⚠️ / ❌ | N     |
| Keyboard Nav      | ✅ / ⚠️ / ❌ | N     |
| Screen Reader     | ✅ / ⚠️ / ❌ | N     |
| WCAG 2.1 AA       | ✅ / ⚠️ / ❌ | N     |

### Findings

#### [SEVERITY] Short title
**Category**: Spacing | Typography | Color | Accessibility | Iconography
**Location**: `src/path/to/Component.tsx:line`
**Issue**: Clear description of the violation.
**Expected**: What the design system requires.
**Fix**:
```tsx
// before
style={{ margin: '8px' }}
// after
className="k-m-2"
```
```

Severity levels: `CRITICAL` (breaks accessibility) | `HIGH` (design spec violation) |
`MEDIUM` (token misuse) | `LOW` (cosmetic / suggestion)

---

## Quick Reference: KendoReact Design System Utilities

### Spacing Utility Classes

KendoReact ships Progress Design System utility classes. Use these instead of inline
styles for spacing:

```
k-m-{n}   → margin all sides         k-p-{n}   → padding all sides
k-mt-{n}  → margin-top               k-pt-{n}  → padding-top
k-mb-{n}  → margin-bottom            k-pb-{n}  → padding-bottom
k-ml-{n}  → margin-left              k-pl-{n}  → padding-left
k-mr-{n}  → margin-right             k-pr-{n}  → padding-right
k-mx-{n}  → margin horizontal        k-px-{n}  → padding horizontal
k-my-{n}  → margin vertical          k-py-{n}  → padding vertical
```

Where `{n}` is 0–12 on a 4px base scale (k-m-2 = 8px, k-m-4 = 16px).

### Typography Utility Classes

```
k-font-size-xs | sm | md | lg | xl | 2xl
k-font-weight-light | normal | medium | semibold | bold
k-line-height-xs | sm | md | lg | xl
k-text-left | center | right | justify
```

### Color Utility Classes

```
k-color-primary        k-bg-primary
k-color-secondary      k-bg-secondary
k-color-success        k-bg-success
k-color-error          k-bg-error
k-color-warning        k-bg-warning
k-color-info           k-bg-info
```
