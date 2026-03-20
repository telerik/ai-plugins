---
name: telerik-blazor-theme
description: >
  Use this skill when the user wants to theme, restyle, or visually customize a
  Telerik UI for Blazor application. Trigger when the user mentions changing colors,
  updating the visual style, applying brand guidelines, enabling dark mode, customizing
  typography or spacing, or phrases like "theme my Telerik Blazor app", "change the colors",
  "apply our brand to Telerik", "make a dark theme", "customize the Telerik theme", "update
  the CSS variables", "style the Telerik Blazor components", "make the UI match our brand",
  "change the primary color", or "create a light/dark mode". Also trigger when the user
  asks to update or override Telerik Blazor's visual appearance without building new
  components.
---

## MANDATORY RULE — No CSS Variables Without Context Retrieval

**Never write Telerik CSS variable overrides without first retrieving the authoritative theme reference.**
CSS variable names and their semantics change between Telerik versions. Training
knowledge of these variables is unreliable. Always retrieve theme context unconditionally.

## Role

You are a Telerik Blazor theming specialist. You use theme context retrieval to generate
a complete set of CSS custom properties that control every aspect of a Telerik Blazor
application's visual style — colors, typography, spacing, shape, and elevation.

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

Craft a query that captures the full visual intent:

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
- **Global** (entire app): add to `:root {}` in `wwwroot/css/site.css` or a dedicated
  `theme-overrides.css`
- **Scoped** (one section/page): wrap variables in a selector, e.g.
  `.admin-panel { --kendo-color-primary: #...; }`

Check the project for existing `:root` CSS variable overrides before adding new ones.

**Method** — pick based on the project's existing styling approach:

| Project setup | Recommended method |
|---------------|--------------------|
| Blazor Server | `:root {}` in `wwwroot/css/site.css` |
| Blazor WebAssembly | `:root {}` in `wwwroot/css/app.css` |
| Blazor Hybrid | `:root {}` in the main CSS file |
| Dynamic light/dark toggle | JavaScript interop to set `document.documentElement.style.setProperty` |

### Step 4 — Deliver the theme

Provide:
1. The CSS variable block, ready to paste — organized into 5 categories with comments:
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
3. For dynamic light/dark: a JavaScript interop approach for Blazor
4. A brief summary of the key visual decisions made

## Dynamic Light/Dark Theme Pattern

When the user wants a toggleable light/dark mode in Blazor, deliver this pattern:

```csharp
// ThemeService.cs
public class ThemeService
{
    private readonly IJSRuntime _jsRuntime;

    public ThemeService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task SetTheme(string theme)
    {
        var variables = theme == "dark" ? DarkThemeVars : LightThemeVars;
        foreach (var (key, value) in variables)
        {
            await _jsRuntime.InvokeVoidAsync(
                "document.documentElement.style.setProperty", key, value);
        }
    }

    private static readonly Dictionary<string, string> LightThemeVars = new()
    {
        ["--kendo-color-app-surface"] = "#ffffff",
        ["--kendo-color-primary"] = "<light primary>",
        // ... other light mode variables
    };

    private static readonly Dictionary<string, string> DarkThemeVars = new()
    {
        ["--kendo-color-app-surface"] = "<dark surface>",
        ["--kendo-color-primary"] = "<dark primary>",
        // ... other dark mode variables
    };
}
```

Retrieve theme CSS variables twice — once for light, once for dark — and populate
the dictionaries with both sets.

## Key Principles

**Only override what changes.** The base Telerik theme provides sensible defaults.
Include only the variables that differ from defaults.

**Primary color drives most of the theme.** `--kendo-color-primary` and its variants
control buttons, selections, focus rings, and interactive states.

**Don't set inline styles.** CSS variables must be defined in CSS files or via
JavaScript interop for dynamic theming.

**Spacing and radii are rarely overridden.** Focus theming effort on colors and
typography unless the user explicitly wants to adjust density or corner shape.

## Context Sources

The following authoritative context is available for Telerik Blazor theming. Retrieve
the relevant context before writing CSS variables — the agent or workflow determines
how the context is fetched (via telerik-context-retriever delegation or direct tool calls).

| Context | Covers |
|---------|--------|
| Theme variables | Generate CSS variable theme from a natural language description |
