# KendoReact — Styling & Theming

## CSS Variable Application Methods

### Method 1: Global CSS (Recommended)
```css
:root {
  /* CSS variables here */
}
```
Add to `src/index.css` or `src/App.css`.

### Method 2: CSS-in-JS (styled-components, emotion)
```tsx
import styled, { createGlobalStyle } from 'styled-components';
const GlobalStyles = createGlobalStyle`
  :root { /* CSS variables here */ }
`;
```

### Method 3: CSS Modules
```css
/* MyComponent.module.css */
.themedContainer {
  color: var(--your-color-variable);
}
```

### Method 4: Dynamic Theme Switching
Use React Context + `document.documentElement.style.setProperty()` for runtime theme switching between light/dark modes.
