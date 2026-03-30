---
name: kendo-react-getting-started
description: >
  Use this skill when the user wants to scaffold a new React project with KendoReact
  pre-configured, set up KendoReact in an existing project, or needs project
  bootstrapping guidance. Trigger when the user mentions "create a new React project
  with KendoReact", "scaffold a KendoReact app", "start a new KendoReact project",
  "bootstrap KendoReact", "set up a new React app with KendoReact", "getting started
  with KendoReact", "initialize KendoReact project", "new project with Progress
  KendoReact", or "add KendoReact to my project". Also trigger when kendo-developer or
  kendo-setup needs to scaffold or configure KendoReact before building components.
---

## Purpose

This skill teaches how to scaffold new React projects with KendoReact
pre-configured and how to add KendoReact to existing projects.

## Setup Context

The authoritative getting-started context provides:
- **Project scaffolding**: Commands and configuration to create a new React project with KendoReact
- **Setup guidance**: Step-by-step instructions for adding KendoReact to an existing project
- **Configuration reference**: Correct package installation, theme import, licensing setup,
  and TypeScript configuration for any React build tooling (Vite, Next.js, CRA, Webpack)

**Context parameters:**
- `createNewProject` (bool) — `true` for scaffolding a new project, `false` for existing project setup
- `projectName` (string) — project folder/app name (used when scaffolding)
- `theme` (enum) — `"default"` | `"bootstrap"` | `"material"` | `"fluent"` (default: `"default"`)

> ⚠️ The `classic` theme is **not** supported. Use `default` as a fallback, then
> swap the theme package manually if needed.

## Workflow

### Step 1 — Determine whether to scaffold or configure

**New project** (no `package.json` exists, or user explicitly asks for a new project):
- Retrieve scaffolding context for a new project
- Proceed to Step 2

**Existing project** (`package.json` exists):
- Retrieve configuration context for an existing project
- Proceed to Step 3

### Step 2 — Scaffold a new project (MANDATORY — retrieve context before writing any setup code)

Retrieve authoritative scaffolding instructions with `createNewProject: true` and the
desired project name and theme.

The context returns:
- Project creation commands (`npm create vite@latest`, `npx create-next-app`, etc.)
- KendoReact package installation commands
- Theme CSS import placement
- `@progress/kendo-licensing` setup
- TypeScript configuration (`tsconfig.json` updates)
- A working example component to verify the setup

Follow the returned instructions exactly. Do not substitute or omit steps.

### Step 3 — Configure KendoReact in an existing project

Retrieve configuration context with `createNewProject: false` and the desired theme.

Cross-reference the returned steps against the existing project:
1. Check if `@progress/kendo-react-common` is in `package.json`
2. Check if a KendoReact theme is imported in the app entry point
3. Check if `@progress/kendo-licensing` is configured
4. Check if TypeScript targets are set correctly for KendoReact
5. Report what's already configured and what needs to be added

### Step 4 — Verify the setup

After scaffolding or configuration:
1. Install packages with the project's package manager
2. Create a test component to verify KendoReact works:
   ```tsx
   import { Button } from '@progress/kendo-react-buttons';

   export const KendoSetupTest = () => (
     <div style={{ padding: 'var(--kendo-spacing-4)' }}>
       <Button themeColor="primary">KendoReact is ready!</Button>
     </div>
   );
   ```
3. Guide the user to render this component temporarily to confirm the setup

### Step 5 — Configure KendoReact licensing (if needed)

If the user has a commercial license, retrieve licensing setup guidance with
`createNewProject: false`.

Remind the user to retrieve their license key from
https://www.telerik.com/account/your-licenses and to store it securely — never commit
license keys to source control. Recommend storing it in an environment variable.

## Build Tool Reference

| Build Tool | Project creation command | Entry point |
|-----------|--------------------------|-------------|
| **Vite + React** | `npm create vite@latest` | `src/main.tsx` or `src/main.jsx` |
| **Next.js** | `npx create-next-app@latest` | `pages/_app.tsx` or `app/layout.tsx` |
| **Create React App** | `npx create-react-app --template typescript` | `src/index.tsx` |
| **Webpack (custom)** | (existing project) | Entry file configured in `webpack.config.js` |

Always retrieve authoritative context for build-tool-specific instructions
rather than relying on the reference table above.

## Context Sources

| Context | Covers |
|---------|--------|
| Getting started | Project scaffolding, setup instructions, licensing, build-tool-specific guidance |
