---
name: kendo-setup
description: Bootstrap KendoReact in an existing React project. Assesses the project, retrieves authoritative setup guidance, installs packages, configures theme and licensing, and verifies the setup works.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap, classic"
allowed-tools: "*"
---

Bootstrap KendoReact in the current React project. You are the orchestrator — you assess, retrieve context, execute setup steps, and verify. **Follow this workflow for EVERY setup request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and browser verification to the appropriate subagent. You never load skills directly — skills are loaded by the agents you delegate to. For setup steps (package installation, file edits, configuration), you execute them directly since they are orchestration-level operations, not component implementation.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding.

---

## Prohibited Actions

The following actions are **forbidden** even for a setup orchestrator:

- **NEVER** write React component code beyond the minimal setup verification example (Phase 8). You do not build application features.
- **NEVER** treat your own built-in knowledge of KendoReact setup procedures as "retrieved context." Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts as authoritative setup guidance.
- **NEVER** skip Phase 2 (Retrieve Setup Guidance) for initial setup. The MCP tools provide version-accurate instructions that may differ from your training data.

---

## Phase Gates

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Project assessment summary | You (orchestrator) |
| Phase 2 | **Context Retrieval Report** (setup guidance) | `kr-context-retriever` subagent |
| Phase 9 | **Test Report** (browser verification) | `kr-tester` subagent |

---

## Phase 1: Explore & Assess the Project

Read `package.json` and scan the project to understand:
- React version, build tooling (Vite, CRA, Next.js, Webpack)
- Package manager (detect from lock file)
- Existing `@progress/kendo-react-*` packages
- Whether a KendoReact theme is already imported
- Application entry point location
- TypeScript configuration (if present)

If KendoReact is already configured, report what's installed and ask whether to add more packages or fix the existing setup.

**On follow-ups:** re-read only `package.json` when adding packages, or only the entry file when changing themes.

---

## Phase 2: Retrieve Setup Guidance

Delegate to the **kr-context-retriever** subagent for version-accurate setup instructions. Provide:
- Whether this is an existing or new project
- The desired theme (`$ARGUMENTS` if provided, otherwise ask the user)
- The detected build tooling and React version

Map themes: `default` → `@progress/kendo-theme-default`, `fluent` → `@progress/kendo-theme-fluent`, `material` → `@progress/kendo-theme-material`, `bootstrap` → `@progress/kendo-theme-bootstrap`, `classic` → `@progress/kendo-theme-classic`. Note: MCP tool accepts only `"default"`, `"bootstrap"`, `"material"`, or `"fluent"`. For `classic`, query `"default"` and swap the package manually.

Read the retriever's completion report. Follow the returned instructions for subsequent phases.

**Your own built-in knowledge of KendoReact setup procedures is NOT retrieved context.** Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts. The MCP tools provide version-accurate instructions that may differ from your training data.

**Skip ONLY if** the user is only adding component packages to an already-working setup (no theme/config changes), or if a Context Retrieval Report with setup guidance was already retrieved this session.

---

## Phase 3: Determine the Theme

Map the user's selection to the correct theme package.

**Skip if** a theme is already installed and the user didn't request a change.

---

## Phase 4: Install Packages

Install using the detected package manager:
- Core: `@progress/kendo-react-common`, `@progress/kendo-licensing`
- Selected theme package
- Design system utilities: `kendo-theme-utils`
- Ask the user which component packages to install, or offer a starter set (buttons, inputs, dropdowns, grid, layout, dateinputs)

**Skip core packages if** already installed. Only install what's missing.

---

## Phase 5: Configure Theme Import

Add the theme CSS import at the top of the entry file, before any other styles:
```typescript
import '@progress/kendo-theme-<selected>/dist/all.css';
import 'kendo-theme-utils/dist/all.css';
```

**Skip if** the import already exists. **Replace if** the user requested a different theme.

---

## Phase 6: Configure Licensing

If `@progress/kendo-licensing` is not already configured, add to the entry point:
```typescript
import { registerForKendo } from '@progress/kendo-licensing';
// registerForKendo('your-license-key');
```

**Skip if** licensing is already configured.

---

## Phase 7: Verify TypeScript Configuration

If the project uses TypeScript, check `tsconfig.json` for `moduleResolution` (bundler or node16) and `jsx` (react-jsx or react).

**Skip if** the project doesn't use TypeScript or the config is already correct.

---

## Phase 8: Create Usage Example

Create `src/components/KendoSetupTest.tsx` with a Button component to verify the setup.

**Skip if** the user is adding packages to an existing working setup.

---

## Phase 9: Verify & Report

1. **Build check** — Run the project build to verify no errors.
2. **Browser verification** — Delegate to **kr-tester** in browser verification mode with the example component and verification criteria (correct theme styling, no console errors). Read the tester's completion report.

**Skip browser verification if** only component packages were added (no theme/import/config changes), or the example was skipped.

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
- Run `/kendo-ui [requirement]` to build a feature end-to-end
```

---

## Persistent Workflow

When the user asks to add packages, change theme, or fix setup:
1. Return to **Phase 1** to re-assess only relevant aspects.
2. Skip already-completed phases. Focus only on requested changes.
