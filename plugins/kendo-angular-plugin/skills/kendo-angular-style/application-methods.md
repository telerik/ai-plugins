# Applying CSS Variables in Kendo UI for Angular

Apply generated CSS variables in your Angular application using one of these methods:

## Method 1: Global Styles (Recommended)

Add to `src/styles.css` or via the `angular.json` styles array:

```css
:root {
  /* Add the CSS variables here */
}
```

## Method 2: Component-Level Styles

```typescript
@Component({
  selector: 'app-my-component',
  template: `<div class="themed-container">Content</div>`,
  styles: [`
    :host {
      /* Add the CSS variables here for component scope */
    }

    .themed-container {
      color: var(--your-color-variable);
      background: var(--your-background-variable);
    }
  `]
})
export class MyComponent { }
```

## Method 3: SCSS Variables Integration

```scss
// _variables.scss
:root {
  /* Add the CSS variables here */
}

// In your component SCSS
.my-element {
  color: var(--your-color-variable);
  background: var(--your-background-variable);
}
```

## Method 4: Dynamic Theme Switching

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  setTheme(theme: 'light' | 'dark') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--your-color-variable', '#ffffff');
      root.style.setProperty('--your-background-variable', '#1a1a1a');
    } else {
      root.style.setProperty('--your-color-variable', '#000000');
      root.style.setProperty('--your-background-variable', '#ffffff');
    }
  }
}
```

---

## Design Standards for Kendo UI for Angular Theming

### One Theme Per Application

Never import more than one Kendo theme package in the same application. Mixing themes (e.g., Default + Bootstrap) causes cascade conflicts and doubles the CSS bundle weight.

### Semantic Colors via CSS Variables

Always reference semantic colors through Kendo CSS variables rather than hardcoded hex values:
- `var(--kendo-color-success)` not `#28a745`
- `var(--kendo-color-error)` not `#dc3545`

Hardcoded hex values do not adapt to theme switches, swatches, or dark mode.

### Custom Template Color Safety

Custom content inside Grid cell templates and custom component templates must use CSS variables for colors — never hardcoded light colors:

```css
/* CORRECT */
color: var(--kendo-body-text);
background: var(--kendo-component-bg);

/* WRONG */
color: #333;
background: #ffffff;
```

This is the most common source of dark mode breakage in custom UI.
