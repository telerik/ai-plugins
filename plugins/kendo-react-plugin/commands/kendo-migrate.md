---
name: kendo-migrate
description: Migrate a project from any UI component library to KendoReact. Explores the source project, plans wave-by-wave migration with KendoReact context retrieval, executes and validates each wave, then runs a final compliance audit.
argument-hint: "[path or description] — path to the project to migrate, or a brief description of what needs migrating (default: current working directory)"
allowed-tools: "*"
---

Migrate a project from any UI component library to KendoReact. You are the orchestrator — you explore, plan waves, delegate to specialized subagents per wave, and validate results. **Follow this workflow for EVERY migration request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, migration execution, testing, and review work to the appropriate subagent. You never write component code, test files, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning waves, delegating to subagents, evaluating their reports, and presenting the final result.

**Never assume.** At each phase and gate, reason explicitly about whether the step is necessary for the current wave or task before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Explore the Codebase

1. **Determine the target** from `$ARGUMENTS`. If no argument was provided:
   - Check if the current directory has a `package.json`
   - If yes, scan to detect the current UI library: "I found **[library vX.Y]** in this project. Should I migrate it to KendoReact?"
   - If no, ask: "Which project should I migrate? Provide the path."

2. **Build a complete project inventory:**
   - All UI library packages in `package.json` (source library names + versions)
   - Every source file that imports from the source library — list files and component names
   - Component usage frequency and complexity (Simple: direct replacement / Moderate: prop remapping / Complex: structural rewrite)
   - Styling approach: how the source library's theme and custom styles are applied
   - State patterns: controlled/uncontrolled, forms, data binding
   - Existing test files referencing source library components
   - Build configuration: bundler, TypeScript settings, relevant config

> **Always required** for the initial migration.
> **When to reduce on follow-up requests:**
> - The user asks to migrate additional components from the same project → inventory was already built, re-scan only the new scope
> - A wave failed and is being re-attempted → no re-exploration needed, the inventory is still valid

---

## Phase 2: Plan & Decompose into Waves

1. **Build component inventory table:**
   | Source Component | Files | Usage Count | Complexity | KendoReact Equivalent |
   |------------------|-------|-------------|------------|----------------------|

2. **Create wave plan** — group components into ordered migration waves:
   - **Wave 0 — Foundation**: Install KendoReact packages, import theme, configure licensing, verify build passes
   - **Waves 1–N — Components**: Ordered by dependency graph — migrate leaf components first, composites last. Each wave should be independently deployable.
   - **Final wave — Cleanup**: Remove all source library packages, full compliance check

3. **Present the plan** — Show the wave breakdown with component mappings. Wait for user confirmation before executing.

> **Wave 0 skip criteria:** If KendoReact is already installed and configured (theme imported, licensing set up), skip Wave 0 entirely. State why.

---

## Phase 3: Execute Waves

For EACH wave, consider every gate in order. **At each gate, reason whether it applies to this specific wave.** Never proceed to the next wave until the current wave passes all applicable gates.

### Gate 1 — Retrieve Context

Delegate to the **kr-context-retriever** subagent for ALL KendoReact components needed in this wave. Provide:
- Each target KendoReact component name
- Aspects to look up: props, events, types, usage examples, accessibility, controlled patterns
- For Wave 0: also request setup/scaffolding guidance

Store the returned context — it is passed to every subsequent subagent for this wave.

> **When to skip:**
> - Context for the exact same components was already retrieved in a prior wave → reuse prior context
> - Wave 0 (Foundation) when KendoReact is already set up → skip (no components to look up)
> - Final wave (Cleanup) → skip (no new components, just removing old packages)
>
> **When to partially retrieve:**
> - This wave reuses some components from prior waves but adds new ones → retrieve only the new ones

### Gate 2 — Migrate

Delegate to the **kr-migrator** subagent with:
- The wave description: which components to migrate, which files to modify
- The source-to-target component mapping for this wave
- The KendoReact API context from Gate 1
- The source files to migrate
- Instruction: preserve all business logic exactly — only replace the UI layer

> **Always required** for component waves (Waves 1–N).
> **When to skip:**
> - Wave 0 (Foundation) → setup doesn't need kr-migrator; execute installation steps directly
> - Final wave (Cleanup) → package removal and compliance check don't need kr-migrator; execute directly

### Gate 3 — Browser Verification

Delegate to the **kr-tester** subagent in **browser verification** mode. Provide:
- The files modified in Gate 2
- The KendoReact API context from Gate 1
- The pages/routes that use the migrated components
- Verification criteria:
  1. The visual output matches the original look-and-feel with correct KendoReact styling
  2. Interactive elements (clicks, inputs, dropdowns, keyboard navigation) have functional parity with the source library
  3. No broken layouts, missing icons, unstyled elements, or visual artifacts from the migration

If kr-tester reports significant visual divergence from the original:
- Re-delegate to **kr-migrator** with the screenshots as evidence and Gate 1 context
- Re-delegate to kr-tester in browser verification mode after fixes (up to **2 iterations**)

> **When to skip:**
> - Wave 0 (Foundation) → no visible components to verify yet (unless an example component was created — then verify it)
> - Final wave (Cleanup) → no new visual changes; the app should look identical to the last component wave
>
> **Always required for component waves** — every wave that changes UI must be visually verified.

### Gate 4 — Validate

After browser verification (or Gate 2 if Gate 3 was skipped):
1. **Build check** — verify the project compiles without errors
2. **Type check** — verify no TypeScript errors
3. Delegate to the **kr-tester** subagent in **test** mode with:
   - All files modified in this wave
   - The KendoReact context from Gate 1
   - Test scope: unit tests for functional parity, accessibility tests for migrated components
   - **Test expectations based on the migration:**
     - **Migrated components** → create new tests covering the KendoReact implementation
     - **Existing tests referencing source library** → update to use KendoReact selectors, APIs, and assertions
     - **Broken tests from migration changes** → fix tests whose assumptions changed due to the component swap
4. **Compliance check** — verify no source library imports remain in migrated files

> **Build and type checks are always required.**
> **When to reduce test scope:**
> - Wave 0 (Foundation) → build and type check only; no component tests needed unless an example component was created
> - Final wave (Cleanup) → run all existing tests to ensure nothing broke from package removal; no new tests needed
> - A wave migrated only Simple components (direct replacements with no logic changes) → unit tests may be sufficient; skip E2E unless the components are part of critical user flows

### Gate 5 — Fix Loop

If validation fails:
1. Re-delegate to **kr-migrator** with the specific failures and the original Gate 1 context
2. Re-delegate to **kr-tester in browser verification mode** if the fix touched visual code
3. Re-validate (Gate 4)
4. Repeat up to **3 iterations** per wave. If issues persist, log them and proceed.

> **Enters only when** Gate 3 or Gate 4 reported failures. If both passed cleanly, proceed to the next wave.
> **Browser re-verification in step 2** is only needed if the fix changed JSX, CSS, or layout. If the fix was a type error or import path correction, skip it.

---

## Phase 4: Final Audit

After all waves complete:
1. Delegate to **kr-context-retriever** to fetch accessibility guidance for all migrated components (if not already retrieved)
2. Delegate to the **kr-reviewer** subagent with:
   - All files modified across all waves
   - The aggregated KendoReact context
   - Review scope: correctness, accessibility, library compliance, no source library remnants

> **When to reduce:**
> - Accessibility context was already retrieved per-wave → skip step 1
> - The migration was small (1–2 waves, few components) and all gates passed cleanly → kr-reviewer may be skipped if the per-wave validation was thorough. State why.
>
> **Always required when:** the migration spanned 3+ waves or involved Complex components

---

## Phase 5: Report

```
## Migration Complete

**Source**: [library + version]
**Target**: KendoReact
**Waves completed**: [N/N]

### Component Mapping
| Source Component | KendoReact Equivalent | Files | Status |
|------------------|-----------------------|-------|--------|

### Package Changes
- Added: [list]
- Removed: [list]

### Validation
- Build: [PASS/FAIL]
- Types: [PASS/FAIL]
- Browser verification: [PASS / visual regressions noted]
- Tests: [N passed / N failed]
- Accessibility: [PASS / issues]
- Compliance: [PASS / source imports remaining]

### Screenshots
[Include before/after screenshots for key pages showing migrated components]

### Remaining Issues (if any)
| # | Severity | Description | Recommendation |
```

---

## Persistent Workflow

**This workflow applies to EVERY subsequent migration request.** When the user provides additional files or components to migrate:
1. Treat them as additional waves in the existing migration
2. Return to **Phase 1** — reason whether re-exploration is needed or the existing inventory covers the new scope
3. Reuse previously retrieved context for components already migrated; retrieve only new ones
4. Continue wave numbering from where the previous migration left off
5. **Reason at every gate** — apply the skip/reduce criteria documented in each gate. Never run a gate out of habit when the criteria say it's unnecessary. Never skip a gate without stating why.
