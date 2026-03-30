---
name: kendo-setup
description: Bootstrap KendoReact in an existing React project. Assesses the project, retrieves authoritative setup guidance, installs packages, configures theme and licensing, and verifies the setup works.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap, classic"
allowed-tools: "*"
---

Bootstrap KendoReact in the current React project. You are the orchestrator — you assess, retrieve context, execute setup steps, and verify. **Follow this workflow for EVERY setup request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and browser verification to the appropriate subagent. You never load skills directly — skills are loaded by the agents you delegate to. For setup steps (package installation, file edits, configuration), you execute them directly since they are orchestration-level operations, not component implementation.

**Never assume.** At each phase and step, reason explicitly about whether it is necessary for the current project state before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Explore & Assess the Project

Read `package.json` and scan the project to understand:
- React version in use
- Build tooling (Vite, CRA, Next.js, Webpack — detect from config files and dependencies)
- Package manager (detect from lock file: `package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, `bun.lockb` → bun)
- Which (if any) `@progress/kendo-react-*` packages are already installed
- Whether a KendoReact theme is already imported
- Application entry point location (`src/main.tsx`, `src/index.tsx`, `src/App.tsx`, `pages/_app.tsx`, etc.)
- TypeScript configuration (if present)

If KendoReact is already configured, report what's installed and ask whether to add more packages or fix the existing setup.

> **Always required** on the first setup.
> **When to reduce on follow-ups:**
> - The user asks to add specific packages to an already-assessed project → re-read only `package.json` to check current state, skip full project scan
> - The user asks to change the theme → re-read only the entry file and `package.json`, skip everything else

---

## Phase 2: Retrieve Authoritative Setup Guidance

Delegate to the **kr-context-retriever** subagent to fetch version-accurate setup instructions. Provide:
- Whether this is an existing project or a new project
- The desired theme: `$ARGUMENTS` if provided, otherwise ask: "Which KendoReact theme? Options: **default**, fluent, material, bootstrap, classic. (default is recommended)"
- The detected build tooling and React version

> Note: The MCP tool accepts only `"default"`, `"bootstrap"`, `"material"`, or `"fluent"`.
> For `classic`, set to `"default"` and swap the package to `@progress/kendo-theme-classic` manually in Step 4.

Follow the returned instructions as the primary guide for Steps 3–8 below.

> **When to skip:**
> - The user is only adding specific component packages to an already-working setup → no setup guidance needed, just install the packages
> - Setup guidance was already retrieved in this session and nothing has changed → reuse prior guidance

---

## Phase 3: Execute Setup Steps

### Step 3: Determine the theme

Map the user's selection to the correct package:
- `default` → `@progress/kendo-theme-default`
- `fluent` → `@progress/kendo-theme-fluent`
- `material` → `@progress/kendo-theme-material`
- `bootstrap` → `@progress/kendo-theme-bootstrap`
- `classic` → `@progress/kendo-theme-classic`

> **Skip if** a theme is already installed and the user didn't request a change.

### Step 4: Install packages

Install using the detected package manager:

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

> **Skip core packages if** they are already installed (detected in Phase 1). Only install what's missing.

### Step 5: Configure the theme import

Add the theme CSS import at the top of the entry file, before any other styles:

```typescript
import '@progress/kendo-theme-<selected>/dist/all.css';
import 'kendo-theme-utils/dist/all.css';
```

> **Skip if** the theme import already exists in the entry file. **Replace if** the user requested a different theme than what's currently imported.

### Step 6: Configure KendoReact licensing

If `@progress/kendo-licensing` is not already configured, add to the entry point:

```typescript
import { registerForKendo } from '@progress/kendo-licensing';
// registerForKendo('your-license-key'); // Add your key from https://www.telerik.com/account/your-licenses
```

> **Skip if** licensing is already configured (detected in Phase 1).

### Step 7: Verify TypeScript configuration

If the project uses TypeScript, check `tsconfig.json` and ensure:
- `moduleResolution` is `bundler` or `node16`
- `jsx` is set to `react-jsx` or `react`

> **Skip if** the project doesn't use TypeScript or the config is already correct.

### Step 8: Create a usage example

Create `src/components/KendoSetupTest.tsx`:

```typescript
import { Button } from '@progress/kendo-react-buttons';

export const KendoSetupTest = () => (
  <div style={{ padding: 'var(--kendo-spacing-4)' }}>
    <Button themeColor="primary">KendoReact is ready!</Button>
  </div>
);
```

Show the user how to import and render this component to verify the setup.

> **Skip if** the user is adding packages to an existing working setup — the setup is already verified. Only create the example for initial setup.

---

## Phase 4: Verify & Report

1. **Build check** — Run the project build to verify no errors from the new packages or imports.
2. **Browser verification** — Delegate to the **kr-tester** subagent in **browser verification** mode. Provide:
   - The example component file (`KendoSetupTest.tsx`)
   - The page/route where the example renders (start the dev server if needed)
   - Verification criteria:
     - The KendoReact Button renders with the selected theme's styling (correct colors, typography, spacing)
     - No console errors related to missing CSS, theme imports, or licensing
   - If kr-tester reports theme rendering issues, diagnose (missing import, wrong entry point, CSS load order) and fix before reporting

> **Build check is always required** when packages or imports were changed.
> **Browser verification skip criteria:**
> - The user only added component packages (no theme, import, or config changes) → skip browser verification
> - The example component from Step 8 was skipped → skip browser verification (nothing new to render)
> **Browser verification always required when:**
> - A new theme was installed or changed
> - This is the initial KendoReact setup

3. **Report:**

```
## KendoReact Setup Complete

**Theme**: @progress/kendo-theme-<name>
**Packages installed**: [list]
**Entry file updated**: [path]
**Build**: [PASS/FAIL]

**Next steps**:
- Add your license key in [entry file]
- Use the **kr-developer** agent to start building components
- Use the **kr-reviewer** agent to verify compliance at any time
- Run `/kendo-ui [requirement]` to build a feature end-to-end
```

---

## Persistent Workflow

**This workflow applies to subsequent setup requests.** When the user asks to add more packages, change the theme, or fix setup issues:
1. Return to **Phase 1** to re-assess only the relevant aspects of the current state
2. Skip already-completed steps (don't reinstall what's present)
3. Focus only on the requested changes
4. **Reason at every step** — apply the skip criteria. Never run a step out of habit when the criteria say it's unnecessary. Never skip a step without stating why.
