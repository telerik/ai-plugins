---
name: kendo-react-layout
description: >
  Use this skill when the user wants to build or generate a page layout or UI structure
  using the KendoReact Design System. Trigger when the user mentions building a page,
  creating sections (header, sidebar, grid, dashboard, footer), or phrases like "build me
  a layout with Kendo", "create a dashboard layout", "add a KendoReact layout", "use
  Progress Design System utilities", "build a responsive layout with Kendo", or "structure
  a React page". Also trigger when the user asks to scaffold or structure a React page and
  KendoReact is already a dependency in the project.
---

## Role

This skill teaches an agent how to generate HTML and React layouts using the Progress
Design System's CSS utilities and KendoReact layout components, ensuring the result
is well-structured, responsive, and correctly themed.

---

## Reference Loading

Before generating any layout, read the relevant reference files from `references/`:

- **Always** → Read `references/layout-utilities.md` for CSS utility classes, installation methods, and Card component conventions

## Workflow

### Step 1 — Understand the layout requirements

Before calling any tools, clarify the layout with the user:
- What sections does the layout need? (header, sidebar, main content, footer, cards, grid, etc.)
- Is this a full page, a component section, or a specific UI pattern (dashboard, form, list view)?
- What's the context — React/TSX component, plain HTML, or both?

If the user already described a clear layout in their request, skip asking and proceed
directly to Step 2.

If the user has an existing layout to migrate or update (e.g. "convert my current page
to use KendoReact utilities"), read the relevant files before calling tools so that
custom logic and structure are preserved.

### Step 2 — Ask about theming

If the user already described a visual style or color scheme in their initial request
(e.g. "dark navy dashboard", "warm minimal layout"), treat that as the theme input and
proceed directly to Step 4.

Otherwise, always ask:

> "Would you like a custom theme for this layout? If yes, describe your desired visual
> style — colors, mood, brand, or just say something like 'dark navy', 'warm and minimal',
> or 'corporate with orange accents'. If no, the default KendoReact theme will be used."

This ensures layout and theme are agreed on from the start rather than retrofitted later.

### Step 3 — Fetch layout utilities (MANDATORY — retrieve before generating any code)

Retrieve layout utilities with a detailed description of the layout, including
building block examples to get ready-to-use JSX/HTML patterns alongside the utility
class reference:

Query: "<Describe the full layout: sections, structure, responsive needs, component types>"
Include building block examples: yes

The tool returns:
- Setup instructions for `@progress/kendo-theme-utils` (the CSS utilities package)
- Ready-to-use KendoReact layout components (Card, etc.) with recommendations
- Comprehensive CSS utility class reference (flex columns, rows, grid, spacing, typography, etc.)
- Building block examples — complete HTML/JSX patterns for common layouts

Use the building block examples as starting points rather than building from scratch.
Prioritize KendoReact layout components (Card, etc.) over raw CSS utilities when a
component exists for the needed pattern.

If the tool returns no building block examples or insufficient guidance, fall back to
constructing the layout manually using the CSS utility class reference it provides.

### Step 4 — Fetch theme CSS variables (if requested)

If the user asked for a custom theme, retrieve theme CSS variables:

Query: "<User's theme description, e.g. 'dark navy primary color, clean typography, subtle card shadows'>"

The tool returns structured CSS variable blocks:
- `--kendo-color-*` variables (primary, secondary, semantic, series, surface colors)
- `--kendo-font-*` variables (family, size, weight, line-height)
- `--kendo-spacing-*` variables
- `--kendo-border-radius-*` variables
- `--kendo-elevation-*` variables (box shadows)
- Application method examples (global CSS, CSS-in-JS, CSS Modules, dynamic theme switching)

Apply the CSS variables via a global CSS file (`:root { ... }`) unless the project
uses a different method — check for existing theming patterns before choosing. Also
check for existing `:root` CSS variable overrides in the project to avoid conflicts
with variables already defined.

### Step 5 — Generate the layout

Determine the output format from the project context:
- **React/TSX project** (has `@progress/kendo-react-*` in package.json or existing `.tsx` files):
  produce a `.tsx` component using KendoReact layout components + utility classes
- **Plain HTML** (no React context): produce a standalone HTML file with CDN imports
- **Uncertain**: ask the user which they prefer

Generate the output using:
1. KendoReact layout components (e.g. `<Card>`) where the tool recommends them
2. The building block examples from the layout context retrieval as structural foundation
3. Progress Design System CSS utility classes (`.k-d-flex`, `.k-gap-4`, `.k-col`, etc.)
   for layout composition
4. CSS variable overrides for theming (if Step 4 was done)

### Step 6 — Deliver the output

Provide:
1. The complete layout file (`.tsx` or `.html`)
2. If a custom theme was created: a `theme-overrides.css` (or `:root` block to add to
   existing CSS) with the CSS variable definitions
3. npm install command for `@progress/kendo-theme-utils` if not already in the project:
   ```bash
   npm install @progress/kendo-theme-utils
   ```
4. The CSS import needed (add once per project, to `index.tsx` or `App.tsx`; for
   Next.js, add to `_app.tsx` or a global layout component):
   ```tsx
   import '@progress/kendo-theme-utils/dist/all.css';
   ```
5. A brief note on key layout decisions (which utility classes handle which sections,
   how to extend or modify the layout)

## Key Principles

**Use utility classes over inline styles.** The Progress Design System provides
`.k-d-flex`, `.k-gap-*`, `.k-p-*`, `.k-col-size-*`, `.k-align-items-*`, etc.
These are responsive, themeable, and consistent. Avoid `style={{ padding: '20px' }}`
on layout wrappers — reach for utility classes instead.

**KendoReact components first.** When the tool recommends a KendoReact component
(like `<Card>`), prefer it over building the pattern from scratch with divs and
utility classes.

**One theme import per project.** Ensure `@progress/kendo-theme-utils/dist/all.css`
is imported only once (typically in `index.tsx` or `App.tsx`). Check whether it
already exists before adding it.

**CSS variables scope.** Apply theme CSS variables at `:root` for global theming, or
at a specific selector (e.g., `.my-page-layout`) for scoped theming that doesn't
affect the rest of the app.

## Context Sources

The authoritative context for KendoReact layout development is available in the `references/` folder.
Read the relevant reference files before writing any layout code.
