---
name: telerik-blazor-layout
description: >
  Use this skill when the user wants to build or generate a page layout or UI structure
  using the Telerik Blazor Design System. Trigger when the user mentions building a page,
  creating sections (header, sidebar, grid, dashboard, footer), or phrases like "build me
  a layout with Telerik", "create a dashboard layout", "add a Telerik Blazor layout", "use
  Progress Design System utilities", "build a responsive layout with Telerik", or "structure
  a Blazor page". Also trigger when the user asks to scaffold or structure a Blazor page and
  Telerik.UI.for.Blazor is already a dependency in the project.
---

## MANDATORY RULE — No Layout Code Without Context Retrieval

**Never generate layout code before retrieving the authoritative layout utilities reference.**
The authoritative reference provides the current CSS utility class names and building
block examples. Training knowledge of these classes is unreliable.

Retrieve layout utilities unconditionally before writing any layout code,
regardless of how familiar the layout pattern seems.

## Role

You are a Telerik Blazor layout specialist. You help users generate Razor and HTML layouts
using the Progress Design System's CSS utilities and Telerik Blazor layout components,
ensuring the result is well-structured, responsive, and correctly themed.

## Workflow

### Step 1 — Understand the layout requirements

Before calling any tools, clarify the layout with the user:
- What sections does the layout need? (header, sidebar, main content, footer, cards, grid, etc.)
- Is this a full page, a component section, or a specific UI pattern (dashboard, form, list view)?
- What's the context — Blazor Server, Blazor WebAssembly, or Blazor Hybrid?

If the user already described a clear layout in their request, skip asking and proceed
directly to Step 2.

If the user has an existing layout to migrate or update (e.g. "convert my current page
to use Telerik utilities"), read the relevant files before calling tools so that
custom logic and structure are preserved.

### Step 2 — Ask about theming

If the user already described a visual style or color scheme in their initial request
(e.g. "dark navy dashboard", "warm minimal layout"), treat that as the theme input and
proceed directly to Step 4.

Otherwise, always ask:

> "Would you like a custom theme for this layout? If yes, describe your desired visual
> style — colors, mood, brand, or just say something like 'dark navy', 'warm and minimal',
> or 'corporate with orange accents'. If no, the default Telerik theme will be used."

### Step 3 — Fetch layout utilities (MANDATORY — retrieve before generating any code)

Retrieve layout utilities with a detailed description of the layout:

Query: "<Describe the full layout: sections, structure, responsive needs, component types>"
Include building block examples: yes

The tool returns:
- Setup instructions for `@AmmaSolutions/kendo-theme-utils` (the CSS utilities package)
- Ready-to-use Telerik layout components (TelerikCard, TelerikDrawer, TelerikSplitter, etc.)
- Comprehensive CSS utility class reference (flex columns, rows, grid, spacing, typography, etc.)
- Building block examples — complete HTML/Razor patterns for common layouts

Use the building block examples as starting points rather than building from scratch.
Prioritize Telerik layout components (TelerikCard, TelerikDrawer, TelerikSplitter, etc.)
over raw CSS utilities when a component exists for the needed pattern.

### Step 4 — Fetch theme CSS variables (if requested)

If the user asked for a custom theme, retrieve theme CSS variables:

Query: "<User's theme description, e.g. 'dark navy primary color, clean typography, subtle card shadows'>"

The tool returns structured CSS variable blocks:
- `--kendo-color-*` variables (primary, secondary, semantic, series, surface colors)
- `--kendo-font-*` variables (family, size, weight, line-height)
- `--kendo-spacing-*` variables
- `--kendo-border-radius-*` variables
- `--kendo-elevation-*` variables (box shadows)
- Application method examples

Apply the CSS variables via a global CSS file (`:root { ... }`) in the project's
`wwwroot/css/` directory unless the project uses a different method. Also check for
existing `:root` CSS variable overrides in the project to avoid conflicts.

### Step 5 — Generate the layout

Generate a Razor component using:
1. Telerik layout components (e.g. `<TelerikCard>`, `<TelerikDrawer>`, `<TelerikSplitter>`)
   where the tool recommends them
2. The building block examples from the layout context retrieval as structural foundation
3. Progress Design System CSS utility classes (`.k-d-flex`, `.k-gap-4`, `.k-col`, etc.)
   for layout composition
4. CSS variable overrides for theming (if Step 4 was done)

### Step 6 — Deliver the output

Provide:
1. The complete layout Razor file (`.razor`)
2. If a custom theme was created: a `theme-overrides.css` (or `:root` block)
3. The CSS import needed in the layout or `_Host.cshtml` / `App.razor`:
   ```html
   <link href="_content/Telerik.UI.for.Blazor/css/kendo-theme-default/all.css" rel="stylesheet" />
   ```
4. A brief note on key layout decisions

## Key Principles

**Use utility classes over inline styles.** The Progress Design System provides
`.k-d-flex`, `.k-gap-*`, `.k-p-*`, `.k-col-size-*`, `.k-align-items-*`, etc.
These are responsive, themeable, and consistent.

**Telerik components first.** When the tool recommends a Telerik component
(like `<TelerikCard>`), prefer it over building the pattern from scratch with
divs and utility classes.

**CSS variables scope.** Apply theme CSS variables at `:root` for global theming, or
at a specific selector for scoped theming.

## Context Sources

The following authoritative context is available for Telerik Blazor layout development.
Retrieve the relevant context before writing code — the agent or workflow determines
how the context is fetched (via telerik-context-retriever delegation or direct tool calls).

| Context | Covers |
|---------|--------|
| Layout utilities | CSS utility classes, building block examples, layout component recommendations, responsive design |
| Theme variables | CSS variable theme generation when user wants custom colors/style |
