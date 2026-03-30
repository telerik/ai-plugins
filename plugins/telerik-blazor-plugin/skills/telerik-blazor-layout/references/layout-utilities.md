# Telerik UI for Blazor — Layout & CSS Utilities

## Setting up Styles/CSS

In order to use any of the utility classes from the Kendo Design System, make sure to include a reference to the kendo-theme-utils CSS package.

### Using CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@@progress/kendo-theme-utils/dist/all.css" />
```

## Ready-to-use Layout Components

Telerik UI for Blazor provides layout components to create layout. Prioritize using them instead of building from scratch with CSS utilities.

- Telerik UI for Blazor Card component.
    - Generally, it is recommended to use 100% width (e.g., `<TelerikCard Width="100%">`)
    - If needed, use specific width based on the layout requirements (e.g., `<TelerikCard Width="150px">`)

- Avoid applying additional styling properties such as `display`, `flex`, `grid`, or other layout-specific CSS to layout components such as GridLayout, Splitter, StackLayout and TileLayout. Use the component's built-in parameters and the Kendo CSS utility classes instead.

