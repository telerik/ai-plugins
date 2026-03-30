# KendoReact — Layout & CSS Utilities

## Setting up Styles/CSS

In order to use any of the utility classes from the Kendo Design System, make sure to include a reference to the kendo-theme-utils CSS package.

**Important**: To include the kendo-theme-utils always use the same theme import mechanism as the rest of the Kendo themes in your project.
**Important**: Include the kendo-theme-utils only once in your project.

### Using NPM

The CSS Utilities are available as an NPM module — `@progress/kendo-theme-utils`

To install: `npm install --save @progress/kendo-theme-utils`

Precompiled CSS: `node_modules/@progress/kendo-theme-utils/dist/all.css`

SCSS: `@use '@progress/kendo-theme-utils/scss/all.scss' as *;`

### Using CDN

Alternatively, you can consume them directly from the Unpkg CDN.

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

## Ready-to-use Layout Components

Kendo UI for React provides layout components to create layout. Prioritize using them instead of building from scratch with CSS utilities.

- Kendo UI for React Card component.
    - Generally, it is recommended to use 100% width (e.g., `<Card style={{ width: '100%' }}>`)
    - If needed, use specific width based on the layout requirements (e.g., `<Card style={{ width: '150px' }}>`)

