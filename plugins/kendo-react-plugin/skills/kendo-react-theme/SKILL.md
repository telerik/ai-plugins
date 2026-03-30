---
name: kendo-react-theme
description: >
  Use this skill when the user wants to theme, restyle, or visually customize a
  KendoReact application. Trigger when the user mentions changing colors, updating the
  visual style, applying brand guidelines, enabling dark mode, customizing typography
  or spacing, or phrases like "theme my KendoReact app", "change the colors", "apply
  our brand to Kendo", "make a dark theme", "customize the Kendo theme", "update the
  CSS variables", "style the KendoReact components", "make the UI match our brand",
  "change the primary color", or "create a light/dark mode". Also trigger when the user
  asks to update or override KendoReact's visual appearance without building new
  components.
---

## Role

This skill teaches an agent how to theme, restyle, and visually customize KendoReact
applications using CSS custom properties that control colors, typography, spacing,
shape, and elevation.

---

## Reference Loading

Before applying any theme changes, read the relevant reference files from `references/`:

- **Always** → Read `references/suite-identity.md` for available themes and theme package names
- **When applying CSS variables** → Read `references/styling-theming.md` for the 4 CSS variable application methods
- **When using icons** → Read `references/icons.md` for SVG/font icon packages and common icon reference

## What theme context retrieval returns

The tool generates five categories of CSS variables:

| Category | Variables | Controls |
|----------|-----------|----------|
| **Colors** | `--kendo-color-primary`, `--kendo-color-app-surface`, `--kendo-color-surface`, `--kendo-color-border`, semantic colors (`-info`, `-success`, `-warning`, `-error`), chart series (`-series-a` through `-series-f`), plus `-hover`, `-active`, `-subtle`, `-on-*` variants | All component colors, backgrounds, borders, states |
| **Typography** | `--kendo-font-family-sans`, `--kendo-font-size-sm/md/lg/xl`, `--kendo-line-height-*`, `--kendo-font-weight-*`, `--kendo-letter-spacing-*` | All text rendering across components |
| **Spacing** | `--kendo-spacing-0` through `--kendo-spacing-30` (2px increments) | Padding, margin, gap in all components |
| **Radii** | `--kendo-border-radius-none/xs/sm/md/lg/xl/xxl/xxxl/full` | Corner rounding on all components |
| **Elevation** | `--kendo-elevation-1` through `--kendo-elevation-9` | Box shadows for cards, dropdowns, dialogs |

## Workflow

### Step 1 — Understand the theming goal

Ask about or extract from the user's request:
- **Scope**: Full app theme, a single component section, or dark/light mode toggle?
- **Colors**: Brand hex values, mood description, or reference to an existing design?
- **Typography**: Custom font family, or just size/weight adjustments?
- **Depth**: Colors only, or also typography, spacing, shape, and elevation?

A precise prompt produces more accurate variables. If the user gives only a vague
direction (e.g. "make it darker"), ask one focused follow-up before calling the tool.

### Step 2 — Retrieve theme CSS variables (MANDATORY — do not skip)

Craft a query that captures the full visual intent — not just colors, but mood,
component feel, and any typography or elevation preferences:

Query: "<Describe the target theme: primary brand color, surface/background tone,
         typography preferences, corner radius feel, shadow depth, dark/light mode>"

**Effective prompt patterns:**

- Brand-driven: `"Primary color #1B4F9A (navy), white surfaces, Inter font, subtle
  shadows, rounded corners (8px), professional and clean"`
- Dark mode: `"Dark theme: near-black surfaces (#0f1117), high-contrast text, blue
  primary (#3b82f6), minimal shadows, sharp corners"`
- Mood-driven: `"Warm and minimal: cream backgrounds, terracotta primary, generous
  spacing, large border radius, soft elevation"`
- Partial override: `"Keep the default theme but change primary to #e84040 (red) and
  use a heavier font weight for headings"`

If the first call's output doesn't match expectations, refine the prompt and call again.

### Step 3 — Determine application scope and method

**Scope:**
- **Global** (entire app): add to `:root {}` in `src/index.css` or `src/App.css`
- **Scoped** (one section/page): wrap variables in a selector, e.g.
  `.admin-panel { --kendo-color-primary: #...; }`

Check the project for existing `:root` CSS variable overrides before adding new ones
to avoid duplicates or conflicts.

**Method** — pick based on the project's existing styling approach:

| Project setup | Recommended method |
|---------------|--------------------|
| Plain CSS / CSS file | `:root {}` in `index.css` (simplest) |
| CSS Modules | `:root {}` block in a global CSS file, not a module file |
| styled-components / emotion | `createGlobalStyle` with `:root {}` block |
| Next.js | `:root {}` in `styles/globals.css` or `_app.tsx` global style |
| Dynamic light/dark toggle | `ThemeProvider` with `document.documentElement.style.setProperty` |

### Step 4 — Deliver the theme

Provide:
1. The CSS variable block, ready to paste — organized into the 5 categories with
   comments separating them for readability:
   ```css
   :root {
     /* Colors */
     --kendo-color-primary: #...;
     ...

     /* Typography */
     --kendo-font-family-sans: ...;
     ...

     /* Spacing */
     /* (only include if overriding defaults) */

     /* Radii */
     --kendo-border-radius-md: ...;
     ...

     /* Elevation */
     --kendo-elevation-2: ...;
     ...
   }
   ```
2. Where to add it — exact file and selector
3. For dynamic light/dark: the `ThemeProvider` TypeScript component (see pattern below)
4. A brief summary of the key visual decisions made

## Dynamic Light/Dark Theme Pattern

When the user wants a toggleable light/dark mode, deliver this TypeScript pattern
populated with the generated variable values:

```tsx
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

const themeVars: Record<Theme, Record<string, string>> = {
  light: {
    '--kendo-color-app-surface': '#ffffff',
    '--kendo-color-primary': '<light primary>',
    // ... other light mode variables
  },
  dark: {
    '--kendo-color-app-surface': '<dark surface>',
    '--kendo-color-primary': '<dark primary>',
    // ... other dark mode variables
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars[theme]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

Retrieve theme CSS variables twice — once for light, once for dark — and populate
`themeVars` with both sets.

## Key Principles

**Only override what changes.** The base KendoReact theme provides sensible defaults
for all variables. Include only the variables that differ from defaults to keep the
override file minimal and maintainable.

**Primary color drives most of the theme.** `--kendo-color-primary` and its variants
(`-hover`, `-active`, `-subtle`, `-on-primary`) control buttons, selections, focus
rings, and interactive states. Getting these right is more impactful than overriding
every individual variable.

**Don't set inline styles.** CSS variables must be defined in CSS files or via
`document.documentElement.style.setProperty`. Never set them as inline `style={{}}`
props on React components.

**Spacing and radii are rarely overridden.** Focus theming effort on colors and
typography unless the user explicitly wants to adjust density or corner shape.

## Context Sources

The authoritative context for KendoReact theming is available in the `references/` folder.
Read the relevant reference files before writing any CSS variables or theme overrides.
