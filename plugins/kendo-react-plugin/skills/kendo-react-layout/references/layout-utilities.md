# KendoReact — Layout & CSS Utilities

## Kendo Design System CSS Utilities

**Package:** `@progress/kendo-theme-utils`

### Installation Methods

**NPM:**
```bash
npm install --save @progress/kendo-theme-utils
```
Precompiled CSS: `node_modules/@progress/kendo-theme-utils/dist/all.css`
SCSS: `@use '@progress/kendo-theme-utils/scss/all.scss' as *;`

**CDN:**
```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

### Key Rules
- Include `kendo-theme-utils` **only once** in the project
- Use the same import mechanism as the rest of the Kendo themes
- Prioritize built-in KendoReact layout components over building from scratch with CSS utilities

### Available Utility Classes
- Flexbox: `k-d-flex`, `k-flex-col`, `k-align-items-center`
- Grid: `k-d-grid`, `k-grid-cols-3`
- Spacing: `k-gap-3`, `k-gap-4`, `k-gap-5`, `k-p-4`, `k-p-6`, `k-py-2`, `k-py-4`, `k-mb-0`, `k-mb-3`, `k-mb-4`, `k-mt-4`
- Width: `k-max-w-3xl`, `k-max-w-screen-xl`
- Margin: `k-mx-auto`
- Typography: `k-h2`, `k-h5`, `k-font-size-lg`, `k-font-weight-bold`, `k-font-weight-normal`, `k-font-family-monospace`, `k-text-base`, `k-text-center`
- Color: `k-color-subtle`
- Container: `k-container`
- Border radius: `k-rounded-md`
- Sizing: `k-m-0`

### Card Component Convention
- Generally use 100% width: `<Card style={{ width: '100%' }}>`
- Use specific width only when layout requires it: `<Card style={{ width: '150px' }}>`
