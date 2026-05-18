---
name: kendo-react-getting-started
description: Creates a new KendoReact project from scratch or adds KendoReact to an existing project. Use when the user wants to set up, scaffold, bootstrap, or get started with a React application using KendoReact. Trigger on "create new React project", "set up KendoReact", "add KendoReact to my app", "scaffold React with Kendo", "getting started with KendoReact", "bootstrap React project", "install kendo-react".
allowed-tools: Bash
---

# KendoReact — Getting Started

## Arguments

Usage: `/kendo-react-getting-started [mode] [project-name] [--theme=<theme>]`

- `[mode]`: `new` (default) — create a brand-new project with the Kendo CLI, or `existing` — add KendoReact to an existing project
- `[project-name]`: The name for your project (default: `kendo-react-app`). Only used in `new` mode.
- `[--theme=<theme>]`: One of `default` (default), `bootstrap`, `material`, `fluent`

## Instructions

1. Determine the mode from `$ARGUMENTS`:
   - If `$ARGUMENTS` contains `existing`, `add`, `existing-project`, or `add-to-existing` (case-insensitive) → read and follow [existing-project.md](existing-project.md)
   - Otherwise → read and follow [new-project.md](new-project.md) (this is the default)

2. Extract the project name from `$ARGUMENTS`. If no name is provided, use `kendo-react-app`.

3. Extract the theme from `$ARGUMENTS` (e.g., `--theme=bootstrap`). If no theme is provided, use `default`.

4. Replace every placeholder in the loaded setup file:
   - `<project-name>` → the actual project name
   - `<theme>` → the chosen theme (`default`, `bootstrap`, `material`, or `fluent`)
   - `<theme-package>` → the npm package for the theme:
     - `default` → `@progress/kendo-theme-default`
     - `bootstrap` → `@progress/kendo-theme-bootstrap`
     - `material` → `@progress/kendo-theme-material`
     - `fluent` → `@progress/kendo-theme-fluent`
   - `<theme-display>` → the human-readable name:
     - `default` → `Default`
     - `bootstrap` → `Bootstrap`
     - `material` → `Material Design`
     - `fluent` → `Fluent UI`

5. Run all commands sequentially. **Do not skip any step.**

6. After completing all steps, run the application and keep it running.
