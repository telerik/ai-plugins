---
name: kendo-modernize
description: Modernize an existing React application — upgrade legacy patterns, migrate from outdated or third-party UI libraries to KendoReact, audit and fix design system conformance and WCAG accessibility compliance. Works in waves so each wave is independently shippable. Use as the entry point for any application modernization, legacy upgrade, or library migration task.
argument-hint: "[path or description] — path to the project to modernize, or a description of what needs updating (default: current working directory)"
allowed-tools: "*"
---

Modernize an existing React application. You are the orchestrator — you inventory the codebase, assess design debt and code quality, plan modernization in independently shippable waves, delegate each wave to specialized subagents, enforce design conformance and test coverage at every wave boundary, and produce a final audit. **Follow this workflow for every modernization request, including follow-up waves and scope expansions.**

**You are strictly an orchestrator.** You never write component code, CSS, or tests yourself. Delegate all analysis, implementation, testing, and review to the appropriate subagents. Your responsibilities are: planning, delegating, evaluating reports, enforcing gates, and presenting results.

**Never assume.** At each phase and gate, reason explicitly whether the step is necessary before executing or skipping it. State your reasoning in one line when skipping.

If no argument was provided:
- Check if the current directory has a `package.json`
- If yes: "I found a React project here. What would you like to modernize? (e.g., migrate from [library], upgrade class components, fix accessibility, update to current KendoReact APIs)"
- If no: "Which project should I modernize? Provide the path."

---

## Phase 1: Codebase Inventory & Assessment

Build a complete picture of the current state before planning any changes.

### 1.1 — Project Inventory

Scan the project to establish:
- **React version** and build tooling (Vite, CRA, Next.js, Webpack)
- **UI libraries in use**: all `package.json` dependencies — identify any non-KendoReact UI libraries (MUI, Ant Design, Chakra, Bootstrap, etc.)
- **KendoReact presence**: which `@progress/kendo-react-*` packages are installed (if any) and their versions
- **Component inventory**: every source file using UI library imports — list files, component names, usage frequency, and complexity (Simple / Moderate / Complex)
  - Simple: direct replacement, no prop remapping
  - Moderate: prop remapping or minor structural change
  - Complex: structural rewrite, custom logic, or KendoReact has no direct equivalent
- **Code patterns**: class components vs function components, prop types vs TypeScript, inline styles vs CSS modules vs utility classes
- **Styling approach**: how theming and custom styles are applied; inline styles, hardcoded values, design token usage
- **Accessibility state**: obvious keyboard nav gaps, missing ARIA attributes, missing form labels
- **Test coverage**: test framework in use, existing test files, and which components have tests
- **TypeScript**: is the project typed? Are there `any` escapes or missing types?

### 1.2 — Design Debt Assessment

Delegate to the **kr-design-guidelines** subagent in **post-implementation review mode** for an initial design audit covering:
- Token usage vs. hardcoded values across the codebase (sample the 5 most-used style files)
- Spacing and typography conformance
- WCAG 2.1 AA accessibility gaps (keyboard nav, contrast, ARIA, labels, focus management)
- Iconography issues (unicode characters, missing aria-hidden, missing labels)

Store the design debt report — it shapes the wave plan.

### 1.3 — Modernization Scope Confirmation

Present the inventory and design debt findings as a summary:

```
## Current State Assessment

### Technology Stack
- React: [version] | Build: [tool] | TypeScript: [yes/no]

### UI Library Analysis
| Library | Version | Components Found | Files Affected |
|---------|---------|-----------------|----------------|

### Code Pattern Gaps
- Class components: [N files]
- Inline styles / hardcoded values: [N instances]
- Missing TypeScript types: [N files]
- Prop types (not TypeScript): [N files]

### Design & Accessibility Debt
[Summary from design audit — top 5 issues by severity]

### Test Coverage
- Files with tests: [N / total]
- Framework: [Jest/Vitest/Playwright/Cypress]
```

**Ask the user**:
> "Based on this assessment, here is the proposed modernization scope. Would you like to:
> 1. Proceed with the full scope (all items above)
> 2. Focus on specific areas (e.g., only migrate [library], only fix accessibility)
> 3. Adjust the scope before planning waves"

Wait for confirmation before moving to Phase 2.

> **Always required.** Never skip Phase 1.

---

## Phase 2: Wave Planning

Decompose the confirmed modernization scope into ordered waves. Each wave must be independently shippable (no partial-wave commits that break the app).

### Standard Wave Structure

```
Wave 0 — Foundation
  Install / upgrade KendoReact packages, import theme, configure licensing.
  Verify build passes. (Skip if KendoReact is already correctly set up.)

Wave 1–N — Component / Pattern Waves
  Ordered by dependency graph — leaf components first, composites last.
  Each wave groups related components or a pattern area.
  Example waves:
    Wave 1: Migrate button, input, checkbox, radio (Simple — direct replacements)
    Wave 2: Migrate dropdown, date picker, form controls (Moderate)
    Wave 3: Migrate data grid (Complex)
    Wave 4: Migrate class components → function components
    Wave 5: Replace inline styles / hardcoded values with design tokens
    Wave 6: Accessibility fixes (ARIA, keyboard nav, focus management, labels)

Final Wave — Cleanup & Compliance
  Remove all deprecated/source-library packages.
  Fix any remaining TypeScript errors.
  Full compliance check: no source library imports, no hardcoded design values.
```

**Present the wave plan** — show the wave breakdown as a table with component mappings. Wait for user confirmation before executing.

> **Wave 0 skip criteria:** KendoReact is already installed, themed, and licensed — skip entirely.

---

## Phase 3: Execute Waves

For **each wave**, execute all applicable gates in order. Never proceed to the next wave until the current wave passes all gates.

### Gate 1 — Retrieve Context

Delegate to the **kr-context-retriever** subagent with:
- All KendoReact component names targeted in this wave
- Aspects to retrieve: props, events, types, accessibility, controlled patterns, migration notes
- For Wave 0: request setup / scaffolding guidance

Store the returned context — pass it verbatim to all subsequent gates for this wave.

> **Skip if:** Context for the exact same components was retrieved in a prior wave. State which wave.
> **Partially skip if:** Some components were retrieved in a prior wave; retrieve only new ones.
> **Skip for Cleanup wave:** No new components — only package removal and compliance checking needed.

### Gate 2 — Design Review (Current State)

**First time this wave category appears only** — before modifying any files in a new area:

Delegate to the **kr-design-guidelines** subagent in **post-implementation review mode** for the files this wave will touch. Provide:
- The files targeted in this wave
- The overall design debt report from Phase 1

This establishes the before-state findings so changes in this wave can improve (not regress) design conformance.

> **Skip for** Wave 0 (Foundation) and Cleanup waves.
> **Skip if** these exact files were already audited in Phase 1 or a prior wave.

### Gate 3 — Implement / Migrate

**Library migration or code pattern waves**: Delegate to the **kr-migrator** subagent or **kr-developer** subagent with:
- The wave description: which components / patterns to modernize, which files to modify
- The KendoReact API context from Gate 1
- All source files targeted in this wave
- For library migrations: the source-to-target component mapping
- For class-component upgrades: preserve all business logic — replace only the component structure
- For design token waves: replace all hardcoded values with design system tokens and utility classes; reference the Design Debt Assessment from Phase 1
- Instruction: every change must preserve functional parity with the current behavior

**Accessibility-specific waves**: Delegate to the **kr-developer** subagent with the WCAG findings from Gate 2 or Phase 1 as the fix specification.

> **Wave 0 (Foundation):** Execute installation and configuration steps directly (no delegation to kr-migrator). Verify build passes before marking complete.
> **Cleanup wave:** Execute package removal and compliance checks directly. No delegation needed.

### Gate 4 — Design Review (Post-Change)

After implementation, delegate to the **kr-design-guidelines** subagent in **post-implementation review mode**. Provide:
- All files modified in Gate 3
- The Gate 2 before-state findings (so the agent can compare before and after)
- The KendoReact design token context from Gate 1

The agent verifies:
- Design conformance has improved or is maintained (not regressed)
- Token usage is correct in all modified files
- WCAG 2.1 AA accessibility is met for all changed interactive components

**If CRITICAL findings are reported:**
- Re-delegate to the **kr-developer** subagent / **kr-migrator** subagent with the findings and Gate 1 context to apply fixes
- Re-delegate to the **kr-design-guidelines** subagent for re-review (up to **2 iterations**)
- Log unresolved findings for the final report

> **Skip for** Wave 0 and Cleanup waves.
> **Always required** for component migration waves and design token waves.

### Gate 5 — Browser Verification

Delegate to the **kr-tester** subagent in **browser verification** mode. Provide:
- All files modified in Gate 3 (plus any fixes from Gate 4)
- The KendoReact API context from Gate 1
- The pages/routes that use the modernized components
- Verification criteria:
  1. Visual output matches or improves on the previous state — no regressions
  2. KendoReact components are correctly styled and themed
  3. Interactive elements (clicks, inputs, dropdowns, keyboard navigation) have full functional parity
  4. No broken layouts, unstyled elements, missing icons, or console errors

If kr-tester reports visual regressions:
- Re-delegate to the **kr-migrator** subagent / **kr-developer** subagent with screenshots and DOM snapshot evidence
- Re-verify after fixes (up to **2 iterations**)

> **Skip for** Wave 0 (unless an example component was created) and Cleanup wave.
> **Always required for** component migration waves and design token/styling waves.

### Gate 6 — Test

Delegate to the **kr-tester** subagent in **test** mode with:
- All files modified in this wave
- The KendoReact API context from Gate 1
- Test scope:
  - **Library migration waves**: update existing tests to use KendoReact selectors and APIs; add tests for any new KendoReact behavior
  - **Class → function component waves**: update existing tests to remove class-component-specific patterns
  - **Design token waves**: visual regression tests confirming token-based styling; accessibility tests for contrast and focus
  - **Accessibility waves**: accessibility tests validating every fix made in Gate 3
- Build check: verify the project compiles without errors after this wave
- Type check: verify no TypeScript errors introduced

> **Build and type checks are always required after every wave.**
> **Accessibility tests are required** for all waves that touch interactive components.

### Gate 7 — Fix Loop

If Gates 5 or 6 report failures:
1. Re-delegate to the modifying subagent with the specific failures and Gate 1 context
2. Re-run browser verification if the fix touched JSX, CSS, or layout
3. Re-run tests
4. Repeat up to **3 iterations** per wave. If issues persist, log them and proceed to the next wave.

---

## Phase 4: Final Audit

After all waves complete:

### Step 1 — Final Design Conformance

Delegate to the **kr-design-guidelines** subagent with:
- All files modified across all waves
- The Phase 1 design debt report as the before-state baseline
- Request a cross-cutting final conformance check

Fix any remaining CRITICAL findings before the code review.

### Step 2 — Final Code Review

Delegate to the **kr-reviewer** subagent with:
- All files modified across all waves
- The aggregated KendoReact context from all wave Gate 1 delegations
- Review scope: component correctness, TypeScript correctness, prop usage, accessibility, performance, library compliance (no source library remnants), security (no XSS, no hardcoded secrets)

If kr-reviewer finds Critical issues, delegate to the **kr-developer** subagent to fix them, then re-delegate to the kr-reviewer subagent.

---

## Phase 5: Report

```
## Modernization Complete

**Project**: [path / name]
**Waves completed**: [N/N]
**Files modified**: [count]

### Modernization Summary
| Wave | Description | Components | Status |
|------|-------------|-----------|--------|

### Before / After
| Metric | Before | After |
|--------|--------|-------|
| UI library imports | [source library] | KendoReact only |
| Class components | N | 0 |
| Hardcoded style values | N | 0 |
| WCAG 2.1 AA violations | N | [remaining] |
| TypeScript coverage | N% | ~100% |

### Validation
- Build: [PASS/FAIL]
- Types: [PASS/FAIL]
- Browser verification: [PASS / regressions noted]
- Tests: [N passed / N failed]
- Accessibility: [PASS / issues]
- Design compliance: [PASS / issues resolved]
- Library compliance: [PASS / remnants noted]

### Screenshots
[Before / after screenshots for key pages showing modernized components]

### Remaining Issues (if any)
| # | Severity | Wave | Description | Recommendation |
|---|----------|------|-------------|----------------|
```

---

## Persistent Workflow

**This workflow applies to every subsequent modernization request in this conversation.** When the user provides additional scope or follow-up waves:
1. Treat them as additional waves in the existing modernization
2. Return to **Phase 2** — add new wave(s) to the plan, present them, and confirm before executing
3. Reuse the Phase 1 inventory and design debt report; re-scan only if new areas are introduced
4. Reuse previously retrieved KendoReact context for components already handled; retrieve only new components
5. Continue wave numbering from where the previous run left off
6. **Tests must stay in sync** — Gate 6 always creates, updates, or fixes tests to match the current implementation
7. **Reason at every gate** — apply skip/reduce criteria. Never run a gate out of habit; never skip without stating why.
