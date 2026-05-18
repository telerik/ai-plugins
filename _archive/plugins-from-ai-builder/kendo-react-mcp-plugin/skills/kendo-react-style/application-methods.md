# Applying CSS Variables in KendoReact

Apply generated CSS variables in your React application using one of these methods:

## Method 1: Global CSS (Recommended)

Add to `src/index.css` or `src/App.css`:

```css
:root {
  /* Add the CSS variables here */
}
```

## Method 2: CSS-in-JS (styled-components, emotion)

```tsx
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Add the CSS variables here */
  }
`;

const ThemedContainer = styled.div`
  color: var(--your-color-variable);
  background: var(--your-background-variable);
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <ThemedContainer>Content</ThemedContainer>
    </>
  );
}
```

## Method 3: CSS Modules

```css
/* MyComponent.module.css */
.themedContainer {
  color: var(--your-color-variable);
  background: var(--your-background-variable);
}
```

```tsx
import styles from './MyComponent.module.css';

function MyComponent() {
  return <div className={styles.themedContainer}>Content</div>;
}
```

## Method 4: Dynamic Theme Switching

```tsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--your-color-variable', '#ffffff');
      root.style.setProperty('--your-background-variable', '#1a1a1a');
    } else {
      root.style.setProperty('--your-color-variable', '#000000');
      root.style.setProperty('--your-background-variable', '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## Best Practices

- **One theme import only** — never import more than one Kendo theme package in the same application. Mixing themes (e.g., Default + Bootstrap) causes cascade conflicts and doubles CSS bundle weight.
- Always reference semantic colors through Kendo CSS variables rather than hardcoded hex values:
  - ✅ `var(--kendo-color-success)` not `#28a745`
  - ✅ `var(--kendo-color-error)` not `#dc3545`
- Custom content inside Grid cell renderers must use CSS variables — never hardcoded light colors:
  - ✅ `color: var(--kendo-body-text); background: var(--kendo-component-bg)`
  - ❌ `color: #333; background: #ffffff`
