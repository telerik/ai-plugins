---
name: telerik-test
description: Plan and run a full Telerik UI for Blazor test suite — explores the codebase, decomposes into test tasks, retrieves API context per component, then orchestrates unit, accessibility, validation, and visual verification tests.
argument-hint: "[path or component name] — file, directory, or component to test (default: current working directory)"
allowed-tools: "*"
---

Orchestrate a complete Telerik Blazor test suite. You are the orchestrator — you explore, plan test tasks, retrieve context, delegate to the tester subagent, and report results. **Follow this workflow for EVERY test request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, test writing, test execution, and code fixes to the appropriate subagent. You never write test files, component code, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning test tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding. If a report flags application defects, collect them for the final report.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit test files (`.cs` test files, bUnit test classes). You do not write tests.
- **NEVER** modify application source code, components, or CSS to make tests pass.
- **NEVER** treat your own built-in knowledge of Telerik Blazor APIs as "retrieved context." Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.
- **NEVER** skip testing because no test files exist. The absence of tests is the trigger to create them, not permission to skip.
- **NEVER** substitute a build check or type check for actual test execution.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next. If an artifact is missing, the phase was not completed — go back and complete it.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Codebase exploration (components, test framework, existing coverage) | You (orchestrator) |
| Phase 2 | User-confirmed test plan | You (orchestrator) + user confirmation |
| Phase 3 | **Context Retrieval Report** (per task) | `tb-context-retriever` subagent |
| Phase 4 | **Test Report** (per task) | `tb-tester` subagent |
| Phase 6 | Final Test Summary (compiled from all prior artifacts) | You (orchestrator) |

---

## Phase 1: Explore the Codebase

Determine what to test from `$ARGUMENTS`. If no argument, look for recently changed files or ask the user. Scan the target: identify all Telerik Blazor components, existing test files and coverage, test framework and configuration (bUnit, xUnit, NUnit), test patterns (naming, structure, assertion style), and per-component data shapes, event handlers, and accessibility requirements.

**On follow-ups:** re-read only source files of components under test to detect changes. Skip exploration entirely for pure re-runs.

---

## Phase 2: Plan & Decompose

1. **Build test inventory** — per component: which test modes apply, existing coverage vs. gaps, dependencies.
2. **Classify**: Full suite, Gap fill, Regression, or Targeted.
3. **Decompose into tasks** — one task per component or logical group (e.g., "Unit + accessibility for TelerikGrid").
4. **Present the plan** and wait for confirmation.

Skip decomposition for a single component or pure re-run.

---

## Task Execution Loop

For each task from Phase 2, execute Phases 3 through 5 in order before moving to the next task.

---

## Phase 3: Retrieve Context

Delegate to the **tb-context-retriever** subagent with component names, aspects (parameters, events, types, ARIA roles, keyboard nav, focus management), and purpose (testing). If Razor validation is needed, request file validation too.

Read the retriever's completion report. Store context for the tester.

**Your own built-in knowledge of Telerik Blazor APIs is NOT retrieved context.** Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.

**Skip ONLY if** a Context Retrieval Report for the exact same components AND aspects already exists from a prior task in this conversation. When skipping, reference the prior task number and confirm the report covers the current task's needs. **Skip if** the component is a simple wrapper with no Telerik-specific APIs.

---

## Phase 4: Test

Delegate to the **tb-tester** subagent with the task description, test modes, API context from Phase 3, source component files, existing test files (if extending), and the test framework and patterns.

Read the tester's completion report.

**Reduce scope for** Gap fill (uncovered paths only), Targeted (only requested mode), or Regression (prioritize changed code paths).

---

## Phase 5: Assess Results

Review the tester's completion report:
- **Test failures from test code** → tb-tester handles internally (up to 3 fix iterations)
- **Application defects revealed by tests** → collect into defect list (tb-tester does NOT modify application code)
- **All tests pass** → proceed to the next task

---

## Phase 6: Report

Compile the final summary from all prior phase artifacts. Every section below is **mandatory** — if a section cannot be filled because the corresponding phase was not run, you MUST state which phase was skipped and why. An empty section without explanation is a workflow violation.

```
## Test Report

**Scope**: [components tested]
**Test framework**: [bUnit/xUnit/etc.]
**Variant**: [Full suite / Gap fill / Regression / Targeted]

### Phase Artifacts
- Context Retrieval Reports: [count received / tasks skipped — reasons]
- Test Reports: [count received]

### Results
| Component | Unit | Accessibility | Validation | Visual | Browser | Status |
|-----------|------|---------------|------------|--------|---------|--------|

### Test Files Created/Updated
- [paths]

### Application Defects Found
| # | File | Issue | Severity |
|---|------|-------|----------|
```

If application defects were found, offer to delegate to **tb-developer** (with context from Phase 3) to fix them, then re-run affected tasks.

**Defect remediation is always offered, never auto-executed.** Wait for user confirmation.

---

## Persistent Workflow

When the user asks to test again:
1. Return to **Phase 1** — reason whether re-exploration is needed.
2. Skip components whose tests pass and whose source hasn't changed.
3. Reuse previously retrieved context if the same components are involved.
