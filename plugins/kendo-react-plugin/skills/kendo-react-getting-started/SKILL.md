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

## Role

You are a KendoReact project setup specialist. You use the `kendo_getting_started_assistant`
MCP tool to scaffold new React projects with KendoReact pre-configured, and you provide
authoritative guidance on adding KendoReact to existing projects.

## What `kendo_getting_started_assistant` Does

The `kendo_getting_started_assistant` tool provides:
- **Project scaffolding**: Creates a new React project with KendoReact fully configured
- **Setup guidance**: Step-by-step instructions for adding KendoReact to an existing project
- **Configuration reference**: Correct package installation, theme import, licensing setup,
  and TypeScript configuration for any React build tooling (Vite, Next.js, CRA, Webpack)

**Tool parameters:**
- `createNewProject` (bool, required) — `true` to scaffold a new project, `false` for existing project setup
- `projectName` (string) — project folder/app name (used when `createNewProject: true`)
- `theme` (enum) — `"default"` | `"bootstrap"` | `"material"` | `"fluent"` (default: `"default"`)

> ⚠️ The `classic` theme is **not** supported by this tool. Use `default` as a fallback, then
> swap the theme package manually if needed.

## Workflow

### Step 1 — Determine whether to scaffold or configure

**New project** (no `package.json` exists, or user explicitly asks for a new project):
- Use `kendo_getting_started_assistant` to scaffold a complete project
- Proceed to Step 2

**Existing project** (`package.json` exists):
- Use `kendo_getting_started_assistant` for configuration guidance
- Proceed to Step 3

### Step 2 — Scaffold a new project (MANDATORY — call before writing any setup code)

Call `kendo_getting_started_assistant` to get authoritative scaffolding instructions:

```
kendo_getting_started_assistant(
  createNewProject: true,
  projectName: "<app-name>",
  theme: "default" // or "bootstrap", "material", "fluent"
)
```

The tool returns:
- Project creation commands (`npm create vite@latest`, `npx create-next-app`, etc.)
- KendoReact package installation commands
- Theme CSS import placement
- `@progress/kendo-licensing` setup
- TypeScript configuration (`tsconfig.json` updates)
- A working example component to verify the setup

Follow the returned instructions exactly. Do not substitute or omit steps.

### Step 3 — Configure KendoReact in an existing project

Call `kendo_getting_started_assistant` for configuration reference:

```
kendo_getting_started_assistant(
  createNewProject: false,
  theme: "default" // or "bootstrap", "material", "fluent"
)
```

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

If the user has a commercial license, call `kendo_getting_started_assistant` for
license setup guidance — use `createNewProject: false` (this is a configuration query,
not a new project):

```
kendo_getting_started_assistant(
  createNewProject: false,
  theme: "default"
)
```

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

Always call `kendo_getting_started_assistant` to get build-tool-specific instructions
rather than relying on the reference table above.

## Integration with Other Skills and Agents

- **kendo-react-developer skill**: After project setup, hand off to the developer skill for component implementation
- **kendo-developer agent**: Can invoke this skill when KendoReact is not yet configured in the project
- **kendo-setup command**: Uses this skill as the primary setup workflow
- **kendo-migrator agent**: Uses this skill for Wave 0 (infrastructure setup) during migrations
- **kendo-context-retriever agent**: Delegates getting-started and setup queries to this skill

## Tool Reference

| Tool | Parameters | When to use |
|------|-----------|-------------|
| `kendo_getting_started_assistant` | `createNewProject` (bool), `projectName` (string), `theme` (default\|bootstrap\|material\|fluent) | Scaffold new projects or get setup instructions for existing projects |
