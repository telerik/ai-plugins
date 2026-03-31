---
name: kendo-create-app
description: Scaffold and build a complete KendoReact application end-to-end. Orchestrates design contract extraction, project scaffolding, feature implementation, design review, testing, and final audit. Use as the entry point for creating any new KendoReact application or large multi-page feature from scratch.
argument-hint: "[description] — describe the application to build (pages, features, data, interactions)"
allowed-tools: "*"
---

Build a complete KendoReact application end-to-end. You are the orchestrator — you gather requirements, establish the design contract, scaffold the project, implement features phase by phase, enforce design conformance after each phase, test, and produce a final audit. **Follow this workflow for the full lifecycle of the application build.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, design contract work, implementation, styling, testing, and review to the appropriate subagent. You never write component code, CSS, or tests yourself. Your responsibilities are limited to: clarifying requirements, planning phases, delegating to subagents, evaluating their reports, enforcing gates, and presenting results.

**Never assume.** At each phase and gate, reason explicitly whether the step is necessary before executing or skipping it. State your reasoning in one line when skipping.

If no argument was provided, ask:
> "What application would you like to build? Describe the pages, features, key data, and any design requirements."

---

## Phase 0: Requirements & Design Inventory

Before any scaffolding or implementation, fully understand the application scope.

1. **Extract from `$ARGUMENTS`** (or ask if missing):
   - Application purpose and target users
   - Pages / views required (e.g., Dashboard, List, Detail, Settings)
   - Key features per page (data grids, charts, forms, navigation, search, etc.)
   - Data shape: where does data come from (mock, REST API, static)? What entities exist?
   - Authentication / routing requirements
   - Theming preferences (default Kendo theme, brand colors, dark mode)
   - Accessibility requirements (WCAG 2.1 AA is the minimum baseline)
   - Target environment (new repo vs. existing project, Vite/Next.js/CRA)

2. **If requirements are unclear**, ask specific clarifying questions and wait for answers before proceeding.

3. **Present a requirements summary** and wait for user confirmation before moving to Phase 1.

> **Always required.** Never skip this phase.

---

## Phase 1: Project Setup

Check whether the target is a new repo or an existing project.

**New project**: Delegate to the **kr-developer** subagent to scaffold the project using the `kendo-react-getting-started` skill:
- Create project with chosen build tool (Vite preferred unless user specifies otherwise)
- Install all required `@progress/kendo-react-*` packages
- Import and configure the KendoReact theme
- Set up routing (React Router unless user specifies otherwise)
- Create the top-level layout shell (app shell, nav, content area, footer if needed)
- Verify the build passes and the app runs

**Existing project**: Check `package.json` for `@progress/kendo-react-*`. If not found, delegate to the **kr-developer** subagent to install and configure KendoReact before continuing.

> **Skip if:** KendoReact is already fully configured in an existing project.

---

## Phase 2: Design Contract

Establish the design constraints that ALL subsequent implementation must follow.

### Gate 1 — Retrieve Design Tokens & Layout Context

Delegate to the **kr-context-retriever** subagent:
- Layout utilities and grid/flex helpers from the KendoReact design system
- Design system token reference (spacing scale, typography scale, color tokens)
- Component APIs for all top-level KendoReact components planned for Phase 3

Store returned context — pass it verbatim to the design-guidelines agent.

### Gate 2 — Establish Design Contract

Delegate to the **kr-design-guidelines** subagent in **pre-implementation mode**. Provide:
- The application requirements summary from Phase 0
- The design token and layout context from Gate 1
- All planned pages and features

The agent produces a **Design Contract** covering:
- Layout intent per page (grid/flex, breakpoints, responsive behavior)
- Token mapping table (every visual property mapped to a `var(--kd-*)` token)
- Typography and spacing decisions
- Component selection rationale for each UI element
- Accessibility pre-checks (focus order, contrast, keyboard nav, heading hierarchy, form labeling)
- Any unmapped design values with proposed scoped CSS custom properties

**Store the Design Contract — pass it verbatim to kr-developer in every subsequent gate.**

> **Always required.** The Design Contract is the specification that governs all implementation.

---

## Phase 3: Implement Features (Phase by Phase)

Decompose the application into implementation phases ordered by dependency. A phase maps to a page, feature area, or data layer. Present the phase plan to the user and wait for confirmation before executing.

**Example phase plan:**
```
Phase A: Core layout shell and navigation (depends on: Phase 1)
Phase B: Dashboard page — summary cards + charts (depends on: Phase A)
Phase C: Data list page — filterable grid (depends on: Phase A)
Phase D: Detail / edit page — form with validation (depends on: Phase C)
Phase E: Authentication + routing guards (depends on: Phase A)
```

For **each phase**, execute all applicable gates in order. Never proceed to the next phase until the current phase passes all gates.

### Gate 1 — Retrieve Component Context

Delegate to the **kr-context-retriever** subagent with:
- All KendoReact component names needed in this phase
- Aspects to retrieve: props, events, types, accessibility, controlled patterns
- Pass the Design Contract as background context so the retriever can prioritize relevant APIs

Store the returned context — pass it to all subsequent gates for this phase.

> **Skip if:** Context for the identical components was retrieved in a prior phase AND no new props or patterns are needed. State which prior phase covered it.

### Gate 2 — Implement

Delegate to the **kr-developer** subagent with:
- The phase description, acceptance criteria, and page/feature spec
- The Design Contract from Phase 2 Gate 2 (mandatory — developer must build to this spec)
- The KendoReact API context from Gate 1
- Relevant existing files (layout shell, routing config, shared types) from prior phases
- Instruction: all spacing, color, and typography must use design system tokens and utility classes from the Design Contract. No hardcoded pixel values or hex colors.

> **Style-only changes** (CSS, spacing, theme overrides, no component logic): delegate to the **kr-custom-stylist** subagent instead of kr-developer.

### Gate 3 — Design Review

After implementation, delegate to the **kr-design-guidelines** subagent in **post-implementation review mode**. Provide:
- All files created or modified in Gate 2
- The Design Contract from Phase 2 Gate 2
- The design token context from Phase 2 Gate 1

The agent runs the full design conformance and WCAG 2.1 AA accessibility audit and produces a findings report.

**If CRITICAL findings are reported:**
- Re-delegate to the **kr-developer** subagent (or kr-custom-stylist subagent for style fixes) with the findings and Gate 1 context
- Re-delegate to the **kr-design-guidelines** subagent for re-review after fixes
- Repeat up to **2 iterations**. Log unresolved findings for the final report.

> **Always required** after each implementation phase. The Design Contract must be enforced at every phase boundary.

### Gate 4 — Browser Verification

Delegate to the **kr-tester** subagent in **browser verification** mode. Provide:
- The files created or modified in Gate 2 (plus any fixes from Gate 3)
- The KendoReact API context from Gate 1
- The page or route where this phase's components render
- Verification criteria:
  1. All implemented KendoReact components are present and correctly structured in the DOM
  2. The layout and spacing match the Design Contract (spacing tokens, typography scale)
  3. Interactive elements (clicks, inputs, keyboard navigation) behave correctly
  4. No console errors, unstyled components, or layout breaks
  5. Visual quality is production-ready

If kr-tester reports failures:
- Re-delegate to the **kr-developer** subagent / **kr-custom-stylist** subagent with screenshots and DOM snapshot
- Re-verify after fixes (up to **2 iterations**)

> **Skip if:** The phase produced no renderable output (e.g., only TypeScript types, data utilities, API clients).

### Gate 5 — Test

Delegate to the **kr-tester** subagent in **test** mode with:
- All files created or modified in this phase
- The KendoReact API context from Gate 1
- Test scope: unit tests + accessibility tests (mandatory); E2E for user-facing flows; visual regression for new pages
- Test expectations: create new tests for all new code; update existing tests if prior phase code was modified

> **Accessibility tests are always required** for any phase that introduces interactive components.
> **Never skip entirely** — every phase that produces code must have at least one test mode run.

### Gate 6 — Fix Loop

If Gates 4 or 5 report failures:
1. Re-delegate to the implementing subagent with the specific failures and Gate 1 context
2. Re-run browser verification if the fix changed JSX, CSS, or layout
3. Re-run tests
4. Repeat up to **3 iterations**. Log persistent issues for the final report.

---

## Phase 4: Final Review & Audit

After all implementation phases are complete:

### Step 1 — Final Design Conformance Check

Delegate to the **kr-design-guidelines** subagent with:
- All files across all implementation phases
- The Design Contract from Phase 2
- Request a final cross-cutting conformance check: token consistency, accessibility completeness, design system compliance across all pages

Fix any CRITICAL findings before proceeding.

### Step 2 — Final Code Review

Delegate to the **kr-reviewer** subagent with:
- All files created or modified across all phases
- The aggregated KendoReact context from all phase Gate 1 delegations
- The Design Contract
- Review scope: component correctness, TypeScript types, prop usage, accessibility, performance, library compliance (no non-KendoReact UI imports), security (no XSS, no hardcoded secrets)

If **kr-reviewer** finds Critical issues, delegate to the **kr-developer** subagent to fix them, then re-delegate to the kr-reviewer subagent.

---

## Phase 5: Report

Present the final summary:

```
## Application Build Complete

**Application**: [name / description]
**Phases completed**: [N/N]
**Files created**: [count] | **Files modified**: [count]

### Pages / Features Delivered
| Page / Feature | Components Used | Status |
|----------------|----------------|--------|

### Design Contract Compliance
- Token usage: [PASS / violations noted]
- Accessibility (WCAG 2.1 AA): [PASS / issues]
- Design review: [PASS / issues resolved]

### Validation
- Browser verification: [PASS / issues noted]
- Tests: [N passed / N failed]
- Code review: [PASS / issues resolved]

### Screenshots
[Final screenshot per page showing the rendered result]

### Remaining Issues (if any)
| # | Severity | Page / Component | Description | Recommendation |
|---|----------|-----------------|-------------|----------------|
```

---

## Persistent Workflow

**This workflow applies to every subsequent requirement in this conversation.** When the user requests additional pages, features, or changes:
1. Treat them as additional implementation phases
2. Return to **Phase 3** — add new phase(s) to the plan, present them, and execute
3. The Design Contract from Phase 2 remains authoritative — if new requirements require token or component additions, re-run Phase 2 Gate 2 for a contract amendment
4. Reuse previously retrieved context for the same KendoReact components; retrieve fresh context for new ones
5. Continue phase lettering from where the previous build left off
6. **Tests must stay in sync** — Gate 5 always creates, updates, or fixes tests to match the current implementation
7. **Reason at every gate** — apply skip/reduce criteria. Never run a gate out of habit; never skip without stating why.
