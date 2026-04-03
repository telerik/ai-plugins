---
name: kendo-modernize
description: Modernize an existing React application — upgrade legacy patterns, migrate from outdated or third-party UI libraries to KendoReact, audit and fix design system conformance and WCAG accessibility compliance. Works in waves so each wave is independently shippable. Use as the entry point for any application modernization, legacy upgrade, or library migration task.
argument-hint: "[path or description] — path to the project to modernize, or a description of what needs updating (default: current working directory)"
allowed-tools: "*"
---

Modernize an existing React application. You are the orchestrator — you inventory the codebase, assess design debt and code quality, plan modernization in independently shippable waves, delegate each wave to specialized subagents, enforce design conformance and test coverage at every wave boundary, and produce a final audit. **Follow this workflow for every modernization request, including follow-up waves and scope expansions.**

**You are strictly an orchestrator.** You never write component code, CSS, or tests yourself. Delegate all analysis, implementation, testing, and review to the appropriate subagents. Your responsibilities are: planning, delegating, evaluating reports, enforcing phases, and presenting results.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding. If a report flags open issues or knowledge gaps, address them before moving to the next phase.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss`, or `.module.css` application files. You do not write code.
- **NEVER** write JSX, React component code, CSS rules, or test assertions — not even for "trivial" modernization changes.
- **NEVER** substitute a TypeScript compilation check, build check, or type check for browser verification or testing. These are not equivalent.
- **NEVER** treat your own built-in knowledge of KendoReact APIs as "retrieved context." Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts.
- **NEVER** skip a mandatory phase because the modernization "seems straightforward." Every phase exists to catch regressions that downstream phases cannot.

**Scoped exception — Wave 0 and Cleanup Wave only:** Package installation (Wave 0) and package removal (Cleanup) are orchestration-level operations. You may execute `npm install` / `npm uninstall` commands directly for these waves. This exception does NOT extend to writing component code, CSS, or tests in any wave.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next. If an artifact is missing, the phase was not completed — go back and complete it.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Project inventory | You (orchestrator) |
| Phase 2 | **Design Debt Report** | `kr-designer` subagent |
| Phase 3 | User-confirmed scope | You (orchestrator) + user confirmation |
| Phase 4 | User-confirmed wave plan | You (orchestrator) + user confirmation |
| Phase 5 | **Context Retrieval Report** (per wave) | `kr-context-retriever` subagent |
| Phase 6 | **Pre-Change Design Review** | `kr-designer` subagent |
| Phase 7 | **Developer Report** (per wave) | `kr-developer` subagent |
| Phase 7b | **Styling Report** (per wave) | `kr-stylist` subagent |
| Phase 8 | **Post-Change Design Review** | `kr-designer` subagent |
| Phase 9 | **Test Report** (per wave) | `kr-tester` subagent |
| Phase 10 | Fix confirmation (re-run of Phase 9) | `kr-tester` subagent |
| Phase 11 | **Final Design Conformance Report** | `kr-designer` subagent |
| Phase 12 | **Review Report** | `kr-reviewer` subagent |
| Phase 13 | Final Summary (compiled from all prior artifacts) | You (orchestrator) |

If no argument was provided:
- Check if the current directory has a `package.json`
- If yes: "I found a React project here. What would you like to modernize?"
- If no: "Which project should I modernize? Provide the path."

---

## Phase 1: Project Inventory

Scan the project to establish: React version, build tooling, all UI library dependencies (non-KendoReact), KendoReact packages and versions, component inventory per file (usage frequency, complexity: Simple/Moderate/Complex), code patterns (class vs function, PropTypes vs TypeScript, inline styles vs CSS modules), styling approach (theming, hardcoded values, design tokens), accessibility state (keyboard nav, ARIA, labels), test coverage and framework, TypeScript completeness.

---

## Phase 2: Design Debt Assessment

Delegate to **kr-designer** in **post-implementation review mode** for an initial design audit. Provide a sample of the 5 most-used style files. Request: token usage vs hardcoded values, spacing/typography conformance, WCAG 2.1 AA accessibility gaps, iconography issues.

Read the design guidelines completion report. Store the design debt report for wave planning.

---

## Phase 3: Scope Confirmation

Present the inventory and design debt as a structured summary:
```
## Current State Assessment
### Technology Stack
### UI Library Analysis  
### Code Pattern Gaps
### Design & Accessibility Debt
### Test Coverage
```

Ask the user: proceed with full scope, focus on specific areas, or adjust before planning? Wait for confirmation.

---

## Phase 4: Wave Planning

Decompose the confirmed scope into ordered waves. Each wave must be independently shippable.

Standard structure:
- **Wave 0 — Foundation**: Install/upgrade KendoReact, import theme, configure licensing, verify build.
- **Waves 1-N — Component/Pattern**: Ordered by dependency (leaf first, composites last). Each wave groups related components or a pattern area.
- **Final Wave — Cleanup**: Remove deprecated/source packages, fix TypeScript errors, full compliance check.

Present the wave plan as a table with component mappings. Wait for confirmation.

**Skip Wave 0 if** KendoReact is already installed, themed, and licensed.

---

## Wave Execution Loop

For each wave from Phase 4, execute Phases 5 through 10 in order before moving to the next wave.

---

## Phase 5: Retrieve Context

Delegate to **kr-context-retriever** with all KendoReact component names for this wave, aspects (props, events, types, accessibility, controlled patterns, migration notes), and for Wave 0 also setup guidance.

Read the retriever's completion report. Store context for subsequent phases.

**Your own built-in knowledge of KendoReact APIs is NOT retrieved context.** Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts.

**Skip ONLY if** a Context Retrieval Report for the exact same components AND aspects already exists from a prior wave in this conversation. When skipping, reference the prior wave and confirm the report covers the current wave's needs. **Skip for** Cleanup wave.

---

## Phase 6: Pre-Change Design Review

**First time a wave category appears only** — before modifying files in a new area, delegate to **kr-designer** in post-implementation review mode for the files this wave will touch. Provide the files and the design debt report from Phase 2. This establishes the before-state.

Read the completion report.

**Skip for** Wave 0 and Cleanup. **Skip if** these files were already audited in Phase 2 or a prior wave.

---

## Phase 7: Implement / Migrate

**Library migration or code pattern waves:** Delegate to **kr-developer** with the wave description, API context from Phase 5, source files, component mappings, and instruction to preserve functional parity. The developer handles component logic and structure only — **not** final styling.

**Accessibility waves:** Delegate to **kr-developer** with the WCAG findings from Phase 6 or Phase 2 as the fix specification.

Read the subagent's completion report.

**Wave 0:** Execute package installation/configuration directly (scoped exception — see Prohibited Actions). **Cleanup wave:** Execute package removal directly (scoped exception). These exceptions apply ONLY to package management commands, not to writing component code or CSS.

---

## Phase 7b: Style & Visual Polish

**Always run after Phase 7** for any wave that produces or modifies renderable KendoReact components. KendoReact components have complex internal DOM structures that require specialized styling — all theming and CSS customization must go through the stylist.

Delegate to **kr-stylist** with:
- The files created/modified in Phase 7
- The design debt report from Phase 2 (styling issues to fix)
- The before-state from Phase 6 (to know what to improve)
- Instruction: **inspect the live DOM first** — navigate to the page, snapshot the component DOM, build a selector map from confirmed classes, then write styles composing with `--kendo-*` variables

The stylist will:
1. Inspect the rendered DOM in the browser to understand actual component structure
2. Apply theme variables and scoped CSS targeting confirmed selectors
3. Verify the result via browser screenshot
4. Loop until the visual output matches modernization goals (up to 3 iterations)

Read the stylist's completion report. Confirm styling files created/modified. **If the Styling Report indicates DOM inspection was skipped**, re-delegate to `kr-stylist` with explicit instruction to perform DOM inspection first.

**Skip for** Wave 0 and Cleanup wave. **Skip ONLY if** the wave produced exclusively non-renderable artifacts (TypeScript interfaces only, configuration only, data utilities with no JSX). If the wave produced ANY React component with JSX output, Phase 7b is mandatory.

---

## Phase 8: Post-Change Design Review

Delegate to **kr-designer** in post-implementation review mode with files from Phases 7 and 7b, the before-state from Phase 6, and design token context. The agent verifies conformance improved or was maintained, token usage is correct, and WCAG 2.1 AA is met.

Read the completion report. If CRITICAL findings:
- **CSS/visual findings** → re-delegate to **kr-stylist** with the findings
- **Structural findings** → re-delegate to **kr-developer** with the findings
Re-review (up to 2 iterations).

**Skip for** Wave 0 and Cleanup.

---

## Phase 9: Verify & Test

**Browser verification** — Delegate to **kr-tester** in browser verification mode with files from Phases 7 and 7b, API context, pages/routes, and criteria (visual match, functional parity, correct styling, no console errors). If regressions:
- **Visual/CSS regressions** → re-delegate to **kr-stylist**
- **Structural/logic regressions** → re-delegate to **kr-developer**
Re-verify (up to 2 iterations).

**Skip browser verification for** Wave 0 and Cleanup.

**Testing** — Build check and type check are always required. Then delegate to **kr-tester** in test mode. **Testing is MANDATORY for every wave that produces or modifies code — no exceptions.** The absence of existing test files is NOT permission to skip — it is the trigger to create new tests. Scope depends on wave type: migration waves (update tests to KendoReact selectors), class→function waves (update patterns), design token waves (visual regression + accessibility), accessibility waves (validate every fix).

A wave is not complete until `kr-tester` has produced a Test Report with pass/fail results.

Read the tester's **Test Report** in full. If it is missing or incomplete, the phase gate is not satisfied — re-delegate to `kr-tester`.

---

## Phase 10: Fix Issues

**Enter only if** Phases 8 or 9 reported failures.

1. **Visual/CSS failures** → re-delegate to **kr-stylist** with failures, screenshots, and design debt context.
2. **Structural/logic failures** → re-delegate to **kr-developer** with failures and API context.
3. Re-run browser verification if fix touched visual code.
4. Re-run tests.
5. Repeat up to **3 iterations**. Log persistent issues and proceed.

---

## Phase 11: Final Design Conformance

After all waves complete, delegate to **kr-designer** with all files across all waves, the Phase 2 design debt report as baseline, and request a final cross-cutting conformance check.

Read the completion report. Fix remaining CRITICAL findings.

---

## Phase 12: Final Code Review

Delegate to **kr-reviewer** with all files across all waves, aggregated API context, and review scope (correctness, TypeScript, prop usage, accessibility, performance, library compliance, security).

Read the reviewer's **Review Report** in full. If Critical issues, delegate to kr-developer to fix, then re-run review.

---

## Phase 13: Report

Compile the final summary from all prior phase artifacts. Every section below is **mandatory** — if a section cannot be filled because the corresponding phase was not run, you MUST state which phase was skipped and why. An empty section without explanation is a workflow violation.

```
## Modernization Complete

**Project**: [path / name]
**Waves completed**: [N/N]
**Files modified**: [count]

### Phase Artifacts
- Design Debt Report (Phase 2): [received / skipped — reason]
- Context Retrieval Reports: [count received / waves skipped — reasons]
- Developer Reports: [count received]
- Styling Reports: [count received / waves skipped — reasons]
- Design Review Reports: [count received / waves skipped — reasons]
- Test Reports: [count received / waves skipped — reasons]
- Final Design Conformance Report: [received / skipped — reason]
- Final Review Report: [received / skipped — reason]

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
- Browser verification: [PASS / regressions noted — sourced from kr-tester]
- Tests: [N passed / N failed — sourced from kr-tester's Test Reports]
- Accessibility: [PASS / issues — sourced from kr-tester's accessibility tests]
- Design compliance: [PASS / issues resolved — sourced from kr-designer's reports]
- Library compliance: [PASS / remnants noted]

### Screenshots
[Before / after screenshots for key pages — sourced from kr-tester or kr-stylist]

### Remaining Issues (if any)
| # | Severity | Wave | Description | Recommendation |
|---|----------|------|-------------|----------------|
```

## Persistent Workflow

When the user provides additional scope or follow-up waves:
1. Treat them as additional waves.
2. Return to **Phase 4** to add new waves, or **Phase 5** if planning is done.
3. Reuse the Phase 1 inventory and design debt report; re-scan only new areas.
4. Reuse previously retrieved context for handled components; retrieve only new ones.
5. Continue wave numbering from where the previous run left off.
6. Tests must stay in sync — Phase 9 always creates, updates, or fixes tests.
