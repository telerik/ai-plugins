# Applying CSS Variables in Telerik UI for Blazor

Apply generated CSS variables in the Blazor application using one of these methods:

## Method 1: Global CSS (Recommended)

Add to `wwwroot/css/app.css` or `wwwroot/css/site.css`:

```css
:root {
  /* Add the CSS variables here */
}
```

## Method 2: Component-Scoped CSS

Create a CSS file alongside your component (e.g., `MyComponent.razor.css`):

```css
.themed-container {
  color: var(--your-color-variable);
  background: var(--your-background-variable);
}
```

```razor
@* MyComponent.razor *@
<div class="themed-container">
  Content here
</div>
```

## Method 3: Dynamic Theme Switching with JavaScript Interop

```razor
@inject IJSRuntime JSRuntime

@code {
    private async Task SetTheme(string theme)
    {
        await JSRuntime.InvokeVoidAsync("setTheme", theme);
    }
}
```

```javascript
// In wwwroot/js/theme.js
window.setTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.style.setProperty('--your-color-variable', '#ffffff');
        root.style.setProperty('--your-background-variable', '#1a1a1a');
    } else {
        root.style.setProperty('--your-color-variable', '#000000');
        root.style.setProperty('--your-background-variable', '#ffffff');
    }
};
```

## Method 4: Using CSS Isolation with Variables

```css
/* MyComponent.razor.css */
::deep .telerik-component {
  color: var(--your-color-variable);
  background: var(--your-background-variable);
}
```

## Best Practices

- Use CSS isolation for component-specific theming
- Leverage `::deep` selectors for Telerik UI for Blazor component styling
- Consider using CSS custom properties for responsive design
- Test variables across different Telerik UI for Blazor components
