---
name: kendo-react-agent-orchestrator
description: Main entry point for building or refining UI with KendoReact using a custom-agent handoff pipeline (kendo-react-context-retrieval / kendo-react-developer / kendo-react-tester / kendo-react-audit). Coexists with kendo-react-orchestrator. Orchestrates the full workflow including accessibility, layout, components, theming, icons, and validation. Use when the user wants to build or modify a complete page, section, or UI feature with KendoReact components and prefers the agent-handoff pattern. Trigger on "build a page", "create a dashboard", "implement a UI", "generate a form", "build UI with KendoReact", "create a React page", "#kendo_ui_agent_generator", "#kendo_react_agent_generator".
---

# KendoReact - Agent Orchestrator

**Current Goal:**

$ARGUMENTS

The orchestrator dispatches subagents, coordinates context loops, preserves prompt requirements, syncs the current React plugin guidance into handoffs, and aggregates results. It never writes app code, runs builds, validates source directly, or audits source directly.

---

## Progressive Disclosure

Load detailed phase references only when entering that phase. Do not front-load all reference files.

| Phase | Load when | Reference |
|---|---|---|
| Context retrieval | Before planning or dispatching context shards | [references/context-retrieval.md](references/context-retrieval.md) |
| Plan execution | After context shard briefs are available | [references/plan-execution.md](references/plan-execution.md) |
| Developer dispatch | Before code-generation handoff | [references/developer-dispatch.md](references/developer-dispatch.md) |
| Validation and audit | Before building `files_to_check`, tester handoff, or audit handoff | [references/validation-and-audit.md](references/validation-and-audit.md) |
| Fix loop | When tester/audit findings require developer fixes | [references/fix-loop.md](references/fix-loop.md) |
| Completion | Before final response | [references/completion-checklist.md](references/completion-checklist.md) |

If a later phase sends `NEEDS_CONTEXT`, return to [references/context-retrieval.md](references/context-retrieval.md) for context-loop mechanics, then re-run plan execution.

---

## Universal Subagent Contract

- Each subagent writes its output to a file and returns only the file path + `Status:` line.
- Each execution-producing subagent report starts with a compact JSON status block.
- Context briefs are reference artifacts. Downstream handoffs receive brief paths and section hints, not pasted documentation.
- Subagents use progressive disclosure: read each relevant brief's `Dispatch summary` first, then only the referenced deeper sections needed for the task.
- The orchestrator reads compact summaries for routing and avoids full execution reports unless status routing requires structured sections such as `Files written`, `Findings`, `Batched loop requests`, or `Concerns`.
- Developer reports include a structured `selfCheck` block for source/static/build checks. Tester may skip duplicate static/build checks only when those checks passed against final files; runtime smoke, a11y smoke, and tests remain tester-owned.
- Report caps are mandatory: runtime findings are capped at the first 3 unique critical errors, a11y findings at the first 5 grouped rule violations, audit findings at Critical and Important by default, and fix-loop payloads at files changed plus applied findings.
- The orchestrator persists `layout-contract.md` and `dispatch-plan.md` to disk so prompt requirements and brief content survive context-window pressure and fix loops.

Scratch directory: `tmp/orchestrator-run-<session_id>/`

---

## React Static Guidance Sync Policy

The agent pipeline must keep the current React plugin guidance as authoritative static context:

- `../kendo-react-orchestrator/ux-guidelines.md` supplies UI/UX defaults.
- `../kendo-react-component/common-guidelines.md` supplies React architecture, package-installation, and component-name rules.
- `../kendo-react-component/datagrid-guidelines.md` supplies DataGrid/Grid alias, deprecated-prop replacements, virtual scrolling, and height guidance.
- `../kendo-react-component/editor-guidelines.md` supplies EditorTools import rules.
- `../kendo-react-component/smart-grid-guidelines.md` supplies GridToolbarAIAssistant rules for AI grid requests.
- `../kendo-react-layout/layout-conventions.md` supplies Kendo utility setup, ready layout components, DataGrid/Chart sizing, dark-theme body styling, surface hierarchy, popup stacking, and React layout patterns.
- `../kendo-react-style/application-methods.md` supplies theme CSS variable application methods.
- `../kendo-react-accessibility/wcag-guidelines.md` supplies WCAG 2.2 AA baseline rules.
- `../kendo-react-orchestrator/validation-steps.md` supplies React/KendoReact validation expectations.

Context retrieval reads these static guidance files inside the relevant shard and summarizes them into context briefs. Developer, tester, and audit consume the briefs and may read linked static files only when the orchestrator explicitly includes them as section hints or when validating source-level React setup. Do not duplicate or silently override those rules.

---

## KendoReact Fact Source Policy

- Authoritative KendoReact, accessibility, icon, layout, theme, and validation facts come from context briefs, explicit handoff facts, current React plugin guidance, and prior reports produced by this pipeline.
- Application source may be inspected for local usage patterns, existing imports, project wiring, and generated-code behavior.
- Project files such as `package.json`, lockfiles, Vite/CRA/Next/webpack config, `tsconfig`, entry files, root styles, and `index.html` may be inspected for dependency presence and setup.
- Do not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `dist`, `build`, coverage output, or package caches to discover KendoReact component APIs, props, events, payload types, accessibility requirements, icon names, theme variables, or layout utility classes.
- Developer, tester, and audit must not call KendoReact documentation/design-system MCP tools or external documentation lookup for Kendo/design-system facts. Context retrieval is the only stage that retrieves authoritative Kendo/design-system facts.
- If a Kendo/design-system fact is missing, ambiguous, or contradictory, batch it as a `Context-loop candidates` entry and route through the context loop instead of dependency-internal discovery.

---

## Workflow Map

1. **Context retrieval** - plan active KendoReact/design-system context shards, dispatch `kendo-react-context-retrieval` in parallel sub-groups of <=3, aggregate `context_brief_paths`.
2. **Plan execution** - read context brief summaries, extract the user request into `layout-contract.md`, and write `dispatch-plan.md` with a brief index, section hints, static guidance notes, and autonomous developer acceptance criteria.
3. **Code generation** - dispatch one autonomous `kendo-react-developer` task by default, then inspect developer status, self-check, and batched loop requests before validation.
4. **Validation smoke gate** - load validation rules, build `files_to_check`, pass developer self-check summaries to `kendo-react-tester`, and dispatch the read-only tester first.
5. **Audit polish gate** - dispatch read-only `kendo-react-audit` only after tester is green or after tester gaps are intentionally skipped and non-blocking.
6. **Fix loop** - convert tester and audit findings into autonomous developer fix tasks, then re-run only affected gates/scopes until clean.

Status routing summary:

- `kendo-react-context-retrieval DONE` -> add path to `context_brief_paths`.
- `kendo-react-context-retrieval NEEDS_CONTEXT` -> re-dispatch only that shard with `prior_brief_path`, `gap_notes`, and a fresh output path.
- `kendo-react-context-retrieval BLOCKED` -> drop shard, record warning, continue if the missing dimension is not required by the layout contract or acceptance criteria.
- `kendo-react-developer DONE` -> continue only after `Developer self-check` is present and contains no `concern` categories.
- `kendo-react-developer DONE_WITH_CONCERNS` -> route context-loop candidates first, then fix-loop candidates, or continue only for explicitly non-blocking concerns.
- `kendo-react-developer NEEDS_CONTEXT` -> context loop.
- `kendo-react-developer BLOCKED` -> surface blocker unless a narrower context-loop or fix-loop candidate is safe to dispatch.
- `kendo-react-tester GREEN` -> dispatch audit unless audit is explicitly unavailable or out of scope.
- `kendo-react-tester NEEDS_CONTEXT` -> context loop.
- `kendo-react-tester BLOCKED` with fix-required findings or build/runtime failure -> fix loop. Do not dispatch audit for the same iteration until tester is green.
- `kendo-react-audit DONE` after tester green -> complete.
- `kendo-react-audit DONE_WITH_CONCERNS` / `BLOCKED` -> fix loop.
- `kendo-react-audit NEEDS_CONTEXT` -> context loop.

Null-response routing: if a subagent returns no usable status/path, retry once with a status-only prompt and the same output path. If the retry is also empty, mark that handoff `BLOCKED (null_response)` and continue only when the workflow can surface the blocker.

---

## Non-Negotiables

- Context-retrieval shards are dispatched in staged parallel groups of <=3.
- Validation rules are loaded during the validation/audit phase; there is no always-active validation context shard.
- Tester is read-only. It reports validation/build/runtime/a11y/test findings and writes only `validation-brief.md`; it never edits source.
- Audit is read-only. It reports findings and writes only `audit-brief.md`; it never edits source or runs builds.
- Tester is the runtime smoke, a11y smoke, and test gate. Audit is deferred until tester returns green for the current iteration.
- The orchestrator does not write app code, run `npm run build`, install packages, call MCP tools other than subagent dispatch, or perform quality audit work.
- There is no KendoReact validator tool. Build/type-check plus validation checklist and context facts are the validation mechanism.
- When layout is active, `@progress/kendo-theme-utils` availability must be validated through current React layout conventions: dependency/static asset/CDN reference or existing project-approved utility import.
- DataGrid and Chart require stable explicit height evidence when used.
- `files_to_check` is built before tester/audit from execution outputs' `Files written` sections.
- Fix-loop reruns are targeted to files touched by the fix unless a shared route, root component, entry file, root CSS, package/config, or theme/static asset file changes.
- Any unresolved `BLOCKED` shards, external blockers, or unresolved `NEEDS_CONTEXT` states are surfaced in the final answer.