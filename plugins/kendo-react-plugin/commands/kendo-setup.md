---
name: kendo-setup
description: Bootstrap KendoReact in an existing React project. Installs the necessary KendoReact packages, configures a theme, sets up licensing, and optionally configures the Progress Design System utilities. Run this when starting a new KendoReact integration or when KendoReact is not yet configured in the project.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap, classic"
allowed-tools: "*"
---

Bootstrap KendoReact in the current React project. Set up all required configuration so the developer can immediately start using KendoReact components.

## Step 1: Assess the project

Read `package.json` to understand:
- What React version is in use
- What build tooling is present (Vite, CRA, Next.js, Webpack)
- Which (if any) `@progress/kendo-react-*` packages are already installed
- Whether a KendoReact theme is already imported

If KendoReact is already configured, report what's installed and ask whether to add more packages or fix the existing setup.

## Step 2: Call kendo_getting_started_assistant for authoritative setup guidance

Call `kendo_getting_started_assistant` to get authoritative, version-accurate setup instructions for the detected environment:

```
// Existing project
kendo_getting_started_assistant(
  createNewProject: false,
  theme: "default" // or "bootstrap", "material", "fluent"
)
```

For a new project with no `package.json`:

```
// New project
kendo_getting_started_assistant(
  createNewProject: true,
  projectName: "<app-name>",
  theme: "default" // or "bootstrap", "material", "fluent"
)
```

> Note: `theme` accepts only `"default"`, `"bootstrap"`, `"material"`, or `"fluent"`.
> The `classic` theme is not supported by this tool — set to `"default"` and swap the
> package to `@progress/kendo-theme-classic` manually in Step 4 if needed.

Follow the returned instructions as the primary guide for Steps 3–9 below.

## Step 3: Determine the theme

If the user provided a theme argument, use it. Valid themes:
- `default` → `@progress/kendo-theme-default`
- `fluent` → `@progress/kendo-theme-fluent`
- `material` → `@progress/kendo-theme-material`
- `bootstrap` → `@progress/kendo-theme-bootstrap`
- `classic` → `@progress/kendo-theme-classic`

If no argument was provided, ask the user: "Which KendoReact theme would you like to use? Options: **default**, fluent, material, bootstrap, classic. (default is recommended for most projects)"

## Step 4: Install packages

Install the essential packages using the project's package manager (detect from lock file: `package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, `bun.lockb` → bun):

```bash
# Core packages (always install)
<package-manager> install @progress/kendo-react-common @progress/kendo-licensing

# Selected theme
<package-manager> install <selected-theme-package>

# Progress Design System utilities
<package-manager> install kendo-theme-utils

# Recommended starter components (ask user if they want these or let them pick)
# @progress/kendo-react-buttons
# @progress/kendo-react-inputs
# @progress/kendo-react-dropdowns
# @progress/kendo-react-grid
# @progress/kendo-react-layout
# @progress/kendo-react-dateinputs
```

Ask the user which component packages to install, or offer a "starter set" with the most common ones.

## Step 5: Configure the theme import

Find the application entry point (typically `src/main.tsx`, `src/index.tsx`, `src/App.tsx`, or `pages/_app.tsx` for Next.js).

Add the theme CSS import at the top of the entry file, before any other styles:

```typescript
import '@progress/kendo-theme-<selected>/dist/all.css';
// Or for the Progress Design System token integration:
import '@progress/kendo-theme-<selected>/dist/all.css';
import 'kendo-theme-utils/dist/all.css';
```

## Step 6: Configure KendoReact licensing

Check if `@progress/kendo-licensing` was already configured. If not, add the license setup to the entry point:

```typescript
import { registerForKendo } from '@progress/kendo-licensing';
// registerForKendo('your-license-key'); // User should add their key
```

Add a comment instructing the user to add their license key from https://www.telerik.com/account/your-licenses.

## Step 7: Verify TypeScript configuration

If the project uses TypeScript, check `tsconfig.json` and ensure:
- `moduleResolution` is `bundler` or `node16` (for modern package resolution)
- `jsx` is set to `react-jsx` or `react`

## Step 8: Create a usage example

Create a simple example component to verify the setup works. Place it at `src/components/KendoSetupTest.tsx`:

```typescript
import { Button } from '@progress/kendo-react-buttons';

export const KendoSetupTest = () => (
  <div style={{ padding: 'var(--kendo-spacing-4)' }}>
    <Button themeColor="primary">KendoReact is ready!</Button>
  </div>
);
```

Show the user how to import and render this component temporarily to verify the setup.

## Step 9: Report the setup

Summarize what was installed and configured:
```
## KendoReact Setup Complete

**Theme**: @progress/kendo-theme-<name>
**Packages installed**: [list]
**Entry file updated**: [path]
**Next steps**:
- Add your license key in [entry file]
- Ask the **kendo-developer** agent to start building components
- Ask the **kendo-reviewer** agent to verify compliance at any time
```
