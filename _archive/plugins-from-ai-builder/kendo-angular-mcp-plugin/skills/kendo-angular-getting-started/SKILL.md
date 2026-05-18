---
name: kendo-angular-getting-started
description: Creates a new Kendo UI for Angular project from scratch or adds Kendo UI for Angular to an existing project. Use when the user wants to set up, scaffold, bootstrap, or get started with an Angular application using Kendo UI for Angular. Trigger on "create new Angular project", "set up Kendo Angular", "add Kendo Angular to my app", "scaffold Angular with Kendo", "getting started with Kendo Angular", "bootstrap Angular project", "install kendo-angular".
allowed-tools: Bash
---

# Kendo UI for Angular — Getting Started

## Arguments

Usage: `/kendo-angular-getting-started [mode] [project-name] [--theme=<theme>]`

- `[mode]`: `new` (default) — create a brand-new Angular project with the Angular CLI, or `existing` — add Kendo UI for Angular to an existing project
- `[project-name]`: The name for your project (default: `kendo-angular-app`). Only used in `new` mode.
- `[--theme=<theme>]`: One of `default` (default), `bootstrap`, `material`, `fluent`

## Instructions

1. Determine the mode from `$ARGUMENTS`:
   - If `$ARGUMENTS` contains `existing`, `add`, `existing-project`, or `add-to-existing` (case-insensitive) → read and follow [existing-project.md](existing-project.md)
   - Otherwise → read and follow [new-project.md](new-project.md) (this is the default)

2. Extract the project name from `$ARGUMENTS`. If no name is provided, use `kendo-angular-app`.

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
