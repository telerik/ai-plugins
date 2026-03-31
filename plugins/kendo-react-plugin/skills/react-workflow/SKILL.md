---
name: react-workflow
description: >
  **WORKFLOW SKILL** — Load for ANY React development task, even the simplest one-liner.
  Covers building components, implementing features, styling, theming, testing, reviewing,
  auditing, fixing bugs, refactoring, and scaffolding. Trigger when the user mentions
  React, JSX, a component, a page, a layout, a form, or anything frontend-related.
  Trigger on any action verb — "build", "create", "add", "fix", "style", "test", "review",
  "refactor", "implement", "scaffold", "debug", "explain", "tell me how to", "document",
  "show me the API for" — regardless of how simple the request appears. Also trigger on
  bare goal descriptions (e.g. "a data grid with filtering", "dark mode", "login page",
  "mobile layout"). Even if the user says DO NOT CODE, still load 
---

## Agent Roster

| Agent | Name | Purpose |
|-------|------|---------|
| Context Retriever | `kr-context-retriever` | Fetches authoritative component API docs, accessibility guidance, icon mappings, layout utilities, and CSS variables via MCP tools. **Always the first call before any implementation, review, test, or styling work involving KendoReact components.** |
| Design Guidelines | `kr-design-guidelines` | Enforces design system standards and WCAG accessibility requirements. Runs proactively before implementation (design contract) and after implementation (design review). |
| Developer | `kr-developer` | Builds and extends React components and features. Uses KendoReact when UI components are needed. |
| Tester | `kr-tester` | Writes and runs unit, E2E, accessibility, visual regression, and browser verification tests. |
| Reviewer | `kr-reviewer` | Audits code for correctness, accessibility, performance, and best practices. |
| Custom Stylist | `kr-custom-stylist` | Applies pixel-perfect CSS targeting component internals when CSS variable overrides are not enough. |

---

## Workflow Playbook

Select the workflow that best matches the request. For compound requests, combine workflows.

---

### Workflow 1 — Build or Extend

**Triggers:** "build me a grid", "add filtering to my table", "create a date picker form", "implement a dashboard", "add a new page", "scaffold a feature"

```
1. kr-context-retriever   →  fetch component API, props, events, accessibility (KendoReact components only; skip for plain React)
2. kr-design-guidelines   →  establish design contract (tokens, spacing, a11y pre-checks, component selection)
3. kr-developer           →  implement using the retrieved context and design contract
4. kr-design-guidelines   →  design review of the implementation
5. kr-tester              →  browser verification (visual + interaction check)
6. kr-tester              →  unit + accessibility tests
```

**Skip rules:**
- Skip step 1 if no KendoReact components are involved, or if context for the exact same components was already retrieved this session.
- Skip steps 2 and 4 for trivial single-component additions where no design spec is involved — use Workflow 7 instead.
- Skip step 5 if the developer was invoked as a subagent by `kendo-ui` command (it handles verification separately).

---

### Workflow 2 — Style or Theme

**Triggers:** "change the button color", "apply dark mode", "match our brand colors", "pixel-perfect styling for the grid", "custom look for the dropdown", "update the layout spacing"

```
1. kr-context-retriever  →  fetch CSS variables and component DOM structure (KendoReact components only; skip for plain CSS/React)
2. kr-custom-stylist     →  apply scoped CSS using confirmed selectors and CSS variables
3. kr-tester             →  browser verification (screenshot + visual check)
```

**Skip rule:** If only CSS variable overrides or plain React styling is needed (no internal KendoReact DOM targeting), `kr-developer` can apply them directly — skip `kr-context-retriever` and `kr-custom-stylist`.

---

### Workflow 3 — Build End-to-End Application

**Triggers:** "build me a full app", "create an application from scratch", "scaffold a complete KendoReact app", "build a full-stack React application", "create a new project with KendoReact", "build an end-to-end solution", "create a production-ready app"

```
1. kr-context-retriever    →  fetch layout utilities, design system tokens, and APIs for planned components
2. kr-design-guidelines    →  establish design contract: spacing scale, token mapping, component selection, accessibility pre-checks
3. kr-developer            →  scaffold project structure, routing, and core layout shell
4. kr-design-guidelines    →  design review of the shell before feature build-out
5. kr-developer            →  implement features, pages, and data-driven components using the design contract
6. kr-tester               →  browser verification (visual + interaction check per page/feature)
7. kr-tester               →  unit + accessibility + E2E tests
8. kr-reviewer             →  final audit across all review dimensions
```

**Key rules:**
- Step 2 design contract is passed verbatim to `kr-developer` in step 3 and step 5.
- Step 4 design review gates step 5 — CRITICAL design issues must be fixed before feature build-out.
- If the project needs initial KendoReact setup (new repo), `kr-developer` loads the `kendo-react-getting-started` skill in step 3.

---

### Workflow 4 — Modernize Existing Application

**Triggers:** "modernize my app", "update my existing application", "bring my app up to date", "refactor my legacy React code", "migrate my application to current standards", "upgrade from class components", "modernize my codebase", "update to current KendoReact", "migrate away from [library]", "replace [library] with KendoReact"

```
1. kr-reviewer             →  audit existing codebase: identify outdated patterns, deprecated APIs, accessibility gaps, design token violations
2. kr-design-guidelines    →  design review of current implementation: full conformance audit against design system and WCAG 2.1 AA
3. kr-context-retriever    →  fetch current KendoReact APIs for components that will be updated or migrated
4. kr-developer            →  apply modernization changes wave by wave (class → function components, deprecated props, library migrations)
5. kr-design-guidelines    →  design review after each wave — verify design conformance is maintained or improved
6. kr-tester               →  regression tests after each wave (unit + accessibility + browser verification)
7. kr-reviewer             →  final audit confirming all modernization goals are met
```

**Key rules:**
- Work in waves — complete one area of the codebase at a time; do not attempt whole-app rewrites in a single step.
- Step 2 must complete before step 3 — design debt discovered in audit shapes the modernization scope.
- If migrating from a non-KendoReact library, load the `kendo-react-migration` skill in step 4.
- Cap fix loops: if step 6 reports regressions after two re-delegation cycles, pause and report to the user.

---

### Workflow 5 — Test

**Triggers:** "write tests for my Grid", "add accessibility tests", "run E2E tests", "validate my components", "test this feature", "add unit tests"

```
1. kr-context-retriever  →  fetch component API and accessibility requirements (KendoReact components only; skip for plain React)
2. kr-tester             →  write and run all applicable test modes (unit, E2E, a11y, visual regression, browser verification)
```

**Default test modes** (run all unless the user specifies):
- Unit — logic, props, state, event handlers
- E2E — user flows, data entry, navigation
- Accessibility — WCAG 2.1 AA, ARIA, keyboard nav
- Visual regression — CSS and theme correctness
- Browser verification — live page screenshot + DOM snapshot

---

### Workflow 6 — Review or Audit

**Triggers:** "review my code", "audit my setup", "find issues", "check accessibility", "is my Grid configured correctly", "code review"

```
1. kr-context-retriever  →  fetch API and accessibility context (KendoReact components only; skip for plain React)
2. kr-reviewer           →  audit across all review dimensions and fix Critical issues
```

**Review dimensions:** component correctness, prop usage, data binding, theming, accessibility, performance, React best practices.

---

### Workflow 7 — Quick Fix (Trivial)

**Triggers:** single-line changes — "fix the button label", "remove the border", "update the placeholder text", "change this prop"

```
1. kr-context-retriever  →  fetch only the specific prop or API needed (narrow query)
2. kr-developer          →  apply the change
```

No testing gate required unless the fix touches business logic or accessibility.

---

## Decision Guide

```
Is it visual-only (CSS, spacing, colors, theme)?
  YES → Workflow 2 (Style)

Is it testing or validation only?
  YES → Workflow 5 (Test)

Is it a code review or audit?
  YES → Workflow 6 (Review)

Is it a single trivial change?
  YES → Workflow 7 (Quick Fix)

Is it building a net-new application end-to-end?
  YES → Workflow 3 (Build End-to-End Application)

Is it modernizing or migrating an existing application?
  YES → Workflow 4 (Modernize Existing Application)

Otherwise (build, extend, implement a feature):
  → Workflow 1 (Build or Extend)
```

---

## Rules That Apply to All Workflows

- **Retrieve context when KendoReact is involved** — no agent has built-in KendoReact knowledge. Run `kr-context-retriever` before any task that uses `@progress/kendo-react-*` components. For plain React work with no KendoReact components, skip this step.
- **Pass context forward** — every context payload retrieved in step 1 must be passed verbatim to all downstream agents in that workflow.
- **One agent per concern** — never ask `kr-developer` to do styling-only work; never ask `kr-custom-stylist` to write component logic.
- **Sequential, not parallel** — each agent depends on the output of the previous one within a workflow step.
- **Fix loop cap** — if `kr-tester` reports failures after a fix attempt, re-delegate to the implementing agent with evidence. Cap at 2 re-delegation cycles per task to avoid infinite loops.
