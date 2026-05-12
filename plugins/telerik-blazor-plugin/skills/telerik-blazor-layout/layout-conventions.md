# Kendo Design System Layout — Conventions for Telerik UI for Blazor

## Setting up Styles/CSS

In order to use any of the utility classes from the Kendo Design System, make sure to include a reference to the kendo-theme-utils CSS package.

### Using CDN

You can consume the utilities directly from the Unpkg CDN. Add this to your `<head>`:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

> **Note:** In Razor files, escape the `@` in the CDN URL with `@@`:
> ```razor
> <link rel="stylesheet" href="https://unpkg.com/@@progress/kendo-theme-utils/dist/all.css" />
> ```

## Ready-to-use Layout Components

Telerik UI for Blazor includes layout components. **Prioritize using these over building custom layouts from scratch using CSS utilities.**

For any layout component, call the `telerik_component_assistant` tool to get specific API reference and docs.

### TelerikCard

- Generally, it is recommended to use 100% width: `<TelerikCard Width="100%">`
- If needed, use specific width based on the layout requirements: `<TelerikCard Width="150px">`

### Layout Component Styling Restrictions

Avoid applying additional styling properties such as `display`, `flex`, `grid`, or other layout-specific CSS to layout components such as **GridLayout**, **Splitter**, **StackLayout**, and **TileLayout**. Use the component's built-in parameters and the Kendo CSS utility classes instead.
