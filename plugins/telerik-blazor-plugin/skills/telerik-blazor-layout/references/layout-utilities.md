# Telerik UI for Blazor — Layout & CSS Utilities

## Kendo Design System CSS Utilities

### Using CDN

Include a reference to the kendo-theme-utils CSS package:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

This should be added to `App.razor` or `_Host.cshtml` alongside the Telerik theme CSS.

## Ready-to-use Layout Components

Telerik UI for Blazor provides layout components — prioritize using them instead of building from scratch with CSS utilities.

- **TelerikCard** — Generally, use 100% width (e.g., `<TelerikCard Width="100%">`). If needed, use specific width based on layout requirements (e.g., `<TelerikCard Width="150px">`).
- **TelerikGridLayout** — CSS Grid-based layout component.
- **TelerikStackLayout** — Flexbox-based stack layout.
- **TelerikSplitter** — Resizable pane layout.
- **TelerikTileLayout** — Draggable tile-based layout.
- **TelerikDrawer** — Collapsible side navigation.

**Important**: Avoid applying additional styling properties such as `display`, `flex`, `grid`, or other layout-specific CSS to layout components such as GridLayout, Splitter, StackLayout, and TileLayout. Use the component's built-in parameters and the Kendo CSS utility classes instead.

## Available Utility Classes

- **Flexbox**: `k-d-flex`, `k-flex-col`, `k-align-items-center`, `k-justify-content-center`
- **Grid**: `k-d-grid`, `k-grid-cols-3`
- **Spacing**: `k-gap-3`, `k-gap-4`, `k-gap-5`, `k-p-4`, `k-p-6`, `k-py-2`, `k-py-4`, `k-mb-0`, `k-mb-3`, `k-mb-4`, `k-mt-4`
- **Width**: `k-max-w-3xl`, `k-max-w-screen-xl`
- **Margin auto**: `k-mx-auto`
- **Typography**: `k-h2`, `k-h5`, `k-text-center`, `k-font-size-lg`, `k-font-weight-bold`, `k-font-weight-normal`, `k-font-family-monospace`, `k-color-subtle`
- **Border radius**: `k-rounded-md`
- **Text**: `k-text-base`, `k-m-0`
