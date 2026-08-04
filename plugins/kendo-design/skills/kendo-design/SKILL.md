---
name: kendo-design
description: Apply the Kendo Design System when building, styling, or reviewing any user interface. Provides design tokens, color, typography, spacing, and accessibility guardrails.
user-invocable: true
---

# Kendo Design System

Applies the Kendo Design System to UI work.

## The spec: `DESIGN.md`

A full `DESIGN.md` — tokens, typography, spacing, color, elevation, accessibility — ships for every theme under `themes/<theme>/DESIGN.md`.

| Theme     | Path                         | Notes                                               |
| --------- | ---------------------------- | --------------------------------------------------- |
| Meridian  | `themes/meridian/DESIGN.md`  | Modern, balanced identity. **Recommended default.** |
| Default   | `themes/default/DESIGN.md`   | Original Kendo language.                            |
| Bootstrap | `themes/bootstrap/DESIGN.md` | Bootstrap's design language.                        |
| Material  | `themes/material/DESIGN.md`  | Material Design.                                    |
| Fluent    | `themes/fluent/DESIGN.md`    | Microsoft Fluent.                                   |
| Classic   | `themes/classic/DESIGN.md`   | Classic Kendo look.                                 |

Use it however the task calls for: read it for a one-off consultation, copy it into the project as a persistent source of truth, copy and adapt it to the project's own needs, or skip it. Persisting a `DESIGN.md` at the project root is what keeps design consistent across future sessions.

If a project already has its own `DESIGN.md`, treat it as the final say.

**IMPORTANT: Read the entire `DESIGN.md` file!**

When persisting, copy the full `DESIGN.md` content into the project — never a stub referencing this plugin's path.

## Relationship to Kendo Themes

This design system stands alone. The `@progress/kendo-theme-*` npm packages are an optional CSS implementation of these tokens, not a requirement.
