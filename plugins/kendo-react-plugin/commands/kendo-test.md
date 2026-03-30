---
name: kendo-test
description: Plan and run a full KendoReact test suite — explores the codebase, decomposes into test tasks, retrieves API context per component, then orchestrates unit, E2E, accessibility, and visual regression tests.
argument-hint: "[path or component name] — file, directory, or component to test (default: current working directory)"
allowed-tools: "*"
---

Orchestrate a complete KendoReact test suite. You are the orchestrator — you explore, plan test tasks, retrieve context, delegate to the tester subagent, and report results. **Follow this workflow for EVERY test request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, test writing, test execution, and code fixes to the appropriate subagent. You never write test files, component code, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning test tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Never assume.** At each phase and gate, reason explicitly about whether the step is necessary for the current test scope before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Explore the Codebase

Determine what to test from `$ARGUMENTS`. If no argument, look for recently changed files or ask the user.

Scan the target to understand the test landscape:
- Identify all KendoReact components in the target files/directory
- Check for existing test files — what's covered and what's missing
- Identify the test framework in use (Jest, Vitest, Playwright, Cypress, etc.) and its configuration
- Note the test patterns used in existing tests (naming, structure, assertion style)
- For each component: identify data shapes, event handlers, controlled/uncontrolled patterns, and accessibility requirements

> **Always required** on the first test request.
> **When to reduce on follow-ups:**
> - The codebase was already explored in a previous test run AND the user is re-testing the same scope → re-read only the source files of components under test to detect changes since last run
> - The user specifies a single component or file → scan only that target, don't re-scan the entire project
> - The user asks to "re-run tests" without changes → skip exploration entirely, just re-run

---

## Phase 2: Plan & Decompose

1. **Build test inventory** — For each component, determine:
   - Which test modes apply: unit, E2E, accessibility, visual regression, browser verification
   - What already has coverage vs. what's missing
   - Dependencies between components that affect test order

2. **Classify the test request** to select the workflow variant:
   | Variant | When | Approach |
   |---------|------|----------|
   | **Full suite** | No existing tests or broad scope requested | All test modes for every component |
   | **Gap fill** | Partial coverage exists | Only write tests for uncovered paths |
   | **Regression** | After code changes | Re-run existing tests + add tests for changed behavior |
   | **Targeted** | Specific component or mode requested | Only the requested scope |

3. **Decompose into test tasks** — One task per component or logical group:
   ```
   Task 1: Unit + accessibility tests for DataGrid (no existing tests)
   Task 2: Unit tests for FilterPanel (partial coverage — add edge cases)
   Task 3: E2E test for grid → filter → detail flow (integration)
   Task 4: Visual regression for dashboard layout
   ```

4. **Present the plan** — Show the test plan and wait for confirmation.

> **Single trivial request:** If the user asks to test exactly one component or re-run existing tests, skip the full decomposition. State what you're doing and proceed.

---

## Phase 3: Execute Test Tasks

For EACH test task, consider every gate in order. **At each gate, reason whether it applies to this specific task.**

### Gate 1 — Retrieve Context

Delegate to the **kr-context-retriever** subagent. Provide:
- The KendoReact component names in this task
- What aspects to look up: props, events, types (for assertion targets), accessibility guidance (ARIA roles, keyboard nav, focus management)
- Purpose: `testing`

Store the returned context for the tester subagent.

> **When to skip:**
> - Context for the exact same components was already retrieved in a prior task within this session → reuse prior context
> - The task is a pure re-run of existing tests with no new test writing → skip (existing tests don't need fresh API context)
> - The component is a simple wrapper or utility with no KendoReact-specific APIs → skip
>
> **When to partially retrieve:**
> - Some components were already retrieved but this task adds a new one → retrieve only the new component

### Gate 2 — Test

Delegate to the **kr-tester** subagent with:
- The task description and which test modes to run
- The KendoReact API context from Gate 1 (or reused context)
- The source component files under test
- Existing test files (if extending coverage)
- The test framework and patterns discovered during exploration

> **Always required** — this is the core purpose of the command. Never skip.
> **Reduce scope when:**
> - **Gap fill variant** → only the uncovered paths, not the full test suite for the component
> - **Targeted variant** → only the specific mode the user requested (e.g., "just run accessibility tests")
> - **Regression variant** → prioritize changed code paths; existing passing tests just need to be re-run, not rewritten

### Gate 3 — Assess Results

Review kr-tester's output:
- **Test failures due to test code issues** — kr-tester handles these internally (up to 3 fix iterations)
- **Application code defects revealed by tests** — collect into a defect list. kr-tester does NOT modify application code.
- **All tests pass** — proceed to the next task

> **No skip criteria** — always assess results after Gate 2.

---

## Phase 4: Report

```
## Test Report

**Scope**: [components tested]
**Test framework**: [Jest/Vitest/etc.]
**Variant**: [Full suite / Gap fill / Regression / Targeted]

### Results
| Component | Unit | E2E | Accessibility | Visual | Browser | Status |
|-----------|------|-----|---------------|--------|---------|--------|

### Test Files Created/Updated
- [paths]

### Application Defects Found
| # | File | Issue | Severity |
|---|------|-------|----------|

### Coverage Summary (if available)
- Statements: [%]
- Branches: [%]
- Functions: [%]
```

If application defects were found, offer to delegate to the **kr-developer** subagent (with context from kr-context-retriever) to fix them, then re-run the affected test tasks.

> **Defect remediation is always offered, never auto-executed.** Wait for user confirmation before delegating.

---

## Persistent Workflow

**This workflow applies to EVERY subsequent test request.** When the user asks to test again:
1. Return to **Phase 1** — reason whether re-exploration is needed based on what changed
2. Skip components whose tests already pass and whose source hasn't changed
3. Focus on new, modified, or previously failing code
4. Reuse previously retrieved context if the same components are involved
5. **Reason at every gate** — apply the skip/reduce criteria. Never run a gate out of habit when the criteria say it's unnecessary. Never skip a gate without stating why.
