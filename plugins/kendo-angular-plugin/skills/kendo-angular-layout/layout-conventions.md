# Kendo Design System Layout — Conventions for Kendo UI for Angular

## Setting up Styles/CSS

In order to use any of the utility classes from the Kendo Design System, include a reference to the `kendo-theme-utils` CSS package.

### Using NPM (Recommended when using a bundler)

The CSS Utilities are available as an NPM module:

```bash
npm install --save @progress/kendo-theme-utils
```

The precompiled CSS is available at `node_modules/@progress/kendo-theme-utils/dist/all.css`.

Include via `angular.json` styles array:
```json
"styles": [
  "node_modules/@progress/kendo-theme-utils/dist/all.css"
]
```

Or as SCSS in `styles.scss`:
```scss
@use '@progress/kendo-theme-utils/scss/all.scss' as *;
```

> **Important:** Use the same import mechanism as the rest of your Kendo theme imports (angular.json or styles file). Include `kendo-theme-utils` only **once** in your project. Check whether a reference already exists before adding a new one.

### Using CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

## Dark Theme Completeness

Kendo themes style `.k-*` component selectors only. Always add these two lines to `styles.scss` or the global CSS file after any theme import:

```scss
html, body {
  background-color: var(--kendo-body-bg);
  color: var(--kendo-body-text);
}
```

Without this, dark-themed components render on a white page.

## Ready-to-use Layout Components

Kendo UI for Angular includes layout components. **Prioritize using these over building custom layouts from scratch using CSS utilities.**

For any layout component, call `kendo_component_assistant` to get specific API reference and docs.

- **Card:** Generally use `width="100%"`. If needed, use a specific width based on layout requirements (e.g., `width="150px"`).
- Avoid applying additional styling properties such as `display`, `flex`, `grid`, or other layout-specific CSS to layout components such as `kendo-splitter`, `kendo-tilelayout`, and `kendo-stacklayout`. Use the component's built-in parameters and Kendo CSS utility classes instead.

## Page Shell Patterns

**Pattern A — Sidebar + Main Content:**
```css
.app-shell { display: flex; height: 100vh; }
.sidebar { width: 240px; flex-shrink: 0; }
.main-content { flex: 1; min-width: 0; /* Critical: prevents flex children from overflowing */ overflow: auto; }
```

**Pattern B — Centered Single-Column (forms, detail pages):**
```css
.page-container { max-width: 960px; margin: 0 auto; padding: 0 1rem; }
```

**Pattern C — Master-Detail Split:**
```css
.split-container { display: grid; grid-template-columns: 420px 1fr; height: 100%; }
```

## Dashboard Layout Patterns

**KPI metric row** (auto-responsive, min 180px per card):
```css
.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
```

**Side-by-side charts** (equal width, no overflow):
```css
.chart-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; }
```

## Critical Angular Sizing Rules

- **`min-width: 0`** on every flex/grid child that contains a Kendo component — the single most common cause of layout overflow.
- **Grid component** always requires an explicit height (e.g., `[height]="'500px'"` or `flex: 1; min-height: 0` inside a flex column). Without a height, Grid renders all rows and expands the page indefinitely.
- **Chart component** always requires an explicit height (e.g., `style="height: 300px"`).
- Never leave Grid column widths unset.
- Constrain page content to `max-width: 1440px` with `margin: 0 auto` to prevent unbounded wide-screen stretching.

## Surface Hierarchy

Kendo themes define four surface levels — do not introduce custom surfaces outside this system:
1. **Page background** (`var(--kendo-body-bg)`) — lowest surface, applied to `html, body`
2. **Component background** (`var(--kendo-component-bg)`) — cards, panels, Grid body
3. **Header / hover surface** (`var(--kendo-grid-header-bg)`) — Grid headers, highlighted rows
4. **Active / selected surface** — managed by the theme automatically

Custom cards and containers must use `var(--kendo-component-bg)` for their background — never `#fff` or other hardcoded values. Hardcoded light colors in custom templates (Grid cell templates, custom component content) break dark mode.

## Splitter Usage Boundary

Use `kendo-splitter` only for **user-resizable** content areas (e.g., master-detail panels, side-by-side editors). Do **not** use it for static page layout — CSS Grid and Flexbox handle that with zero JavaScript overhead.

## Inline Input Width

`kendo-dropdownlist`, `kendo-datepicker`, `kendo-textbox`, and similar inline inputs are `display: inline-block` by default and will **not** fill their container automatically. Apply `style="width: 100%"` or wrap in a layout container to ensure consistent sizing in forms.

## Popup Z-Index Trap

CSS `transform` (including `translate3d(0,0,0)` GPU-compositing tricks) on any ancestor element creates a new stacking context. This clips Kendo popups (which use `z-index ~10000`), causing DropDownList, DatePicker, and ComboBox popups to appear behind other elements. Avoid `transform` on layout ancestors that contain Kendo overlay components.
