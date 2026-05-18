---
name: kendo-angular-agent-orchestrator
description: Main entry point for building or refining UI with Kendo UI for Angular using a custom-agent handoff pipeline (kendo-angular-context-retrieval / kendo-angular-developer / kendo-angular-tester / kendo-angular-audit). Coexists with kendo-angular-orchestrator. Orchestrates the full workflow including accessibility, layout, components, theming, icons, and validation. Use when the user wants to build or modify a complete page, section, or UI feature with Kendo UI for Angular components and prefers the agent-handoff pattern. Trigger on "build a page", "create a dashboard", "implement a UI", "generate a form", "build UI with Kendo Angular", "create an Angular page", "#kendo_ui_agent_generator".
---

# Kendo UI for Angular — Agent Orchestrator

**Current Goal:**

$ARGUMENTS

The orchestrator dispatches subagents, coordinates context loops, preserves prompt requirements, and aggregates results. It never writes app code, runs builds, or audits.

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

If a later phase sends `NEEDS_CONTEXT`, return to [references/context-retrieval.md](references/context-retrieval.md) for the context-loop mechanics, then re-run plan execution.

---

## Universal Subagent Contract

- Each subagent writes its output to a file and returns only the file path + `Status:` line.
- Each execution-producing subagent report starts with a compact JSON status block. Green-path reports should rely on that block and omit long Markdown detail unless there are findings, risks, or routing decisions to explain.
- Context briefs are full reference artifacts. Downstream handoffs receive brief paths and section hints, not pasted full documentation.
- Subagents use progressive disclosure: read each relevant brief's `Dispatch summary` first, then read only the referenced sections needed to complete the task.
- The orchestrator reads only compact context-producing summaries during plan execution. It does not read full context briefs unless a summary is missing or a later `NEEDS_CONTEXT` state requires targeted inspection.
- The orchestrator never reads full execution-producing outputs casually. It relays file paths verbatim and reads only the leading JSON status block plus structured `Files written` / `Findings` / `Concerns` metadata sections when a later phase needs routing data.
- Developer reports include a structured `selfCheck` block for source/static/build checks. Tester must consume it before deciding which duplicate static/build checks to skip, but tester owns runtime smoke, a11y smoke, and test execution.
- Report caps are mandatory: runtime findings are capped at the first 3 unique critical errors, a11y findings at the first 5 grouped rule violations, audit findings at Critical and Important by default, and fix-loop payloads at files changed plus applied findings.
- The orchestrator persists `dispatch-plan.md` and `layout-contract.md` to disk so prompt requirements and brief content survive the context window across fix loops.

Scratch directory: `tmp/orchestrator-run-<session_id>/`

---

## Kendo Fact Source Policy

- Authoritative Kendo/design-system facts come from context briefs, explicit handoff facts, and prior reports produced by this pipeline.
- Application source may be inspected for local usage patterns, existing imports, project wiring, and generated-code behavior.
- Package manifests, lockfiles, Angular config, root styles, and `index.html` may be inspected for dependency presence and setup.
- Do not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `.angular`, `dist`, or package caches to discover Kendo component APIs, inputs, outputs, directives, providers, payload types, accessibility requirements, icon names, theme variables, or layout utility classes.
- Developer, tester, and audit must not call MCP tools or external documentation lookup for Kendo/design-system facts. Context retrieval is the only stage that retrieves authoritative Kendo/design-system facts.
- If a Kendo/design-system fact is missing, ambiguous, or contradictory, batch it as a `Context-loop candidates` entry and route through the context loop instead of dependency-internal discovery.

---

## Workflow Map

1. **Context retrieval** — plan active Kendo/design-system context shards, dispatch `kendo-angular-context-retrieval` in parallel sub-groups of <=3, aggregate `context_brief_paths`.
2. **Plan execution** — read context brief summaries, extract the user request into `layout-contract.md`, and write `dispatch-plan.md` with a brief index, section hints, and autonomous developer acceptance criteria.
3. **Code generation** — dispatch one autonomous `kendo-angular-developer` task by default, then inspect developer status, structured self-check, and batched loop requests before validation.
4. **Validation smoke gate** — load validation rules, build `files_to_check`, pass developer self-check summaries to tester, and dispatch read-only `kendo-angular-tester` first. Tester may skip duplicate static/build checks already completed by developer against the final file state, then runs tester-owned smoke/test gates as needed.
5. **Audit polish gate** — dispatch read-only `kendo-angular-audit` only after tester is green or after remaining tester gaps are known to be intentionally skipped and non-blocking. Audit focuses on prompt fidelity, layout quality, accessibility, and Critical/Important polish.
6. **Fix loop** — convert tester and audit findings into autonomous developer fix tasks, then re-run only the affected gates/scopes until clean.

Status routing summary:

- `kendo-angular-context-retrieval DONE` → add path to `context_brief_paths`.
- `kendo-angular-context-retrieval NEEDS_CONTEXT` → re-dispatch only that shard with `prior_brief_path`, `gap_notes`, and a fresh output path.
- `kendo-angular-context-retrieval BLOCKED` → drop shard, record warning, continue.
- `kendo-angular-developer DONE` → continue only after `Developer self-check` is present and contains no `concern` categories.
- `kendo-angular-developer DONE_WITH_CONCERNS` → read `Concerns`, `Developer self-check`, and `Batched loop requests`; route context-loop candidates first, then fix-loop candidates, or continue only for explicitly non-blocking concerns.
- `kendo-angular-developer NEEDS_CONTEXT` → context loop.
- `kendo-angular-developer BLOCKED` → surface blocker unless a narrower context-loop or fix-loop candidate is listed and safe to dispatch.
- `kendo-angular-tester GREEN` → dispatch audit unless the active path explicitly skipped audit as unavailable or out of scope.
- `kendo-angular-tester NEEDS_CONTEXT` → context loop.
- `kendo-angular-tester BLOCKED` with fix-required findings or build/runtime failure → fix loop, except external blockers that require user intervention. Do not dispatch audit for the same iteration until tester is green.
- `kendo-angular-audit DONE` after tester green → complete.
- `kendo-angular-audit DONE_WITH_CONCERNS` / `BLOCKED` → fix loop.
- `kendo-angular-audit NEEDS_CONTEXT` → context loop.

Null-response routing: if a subagent returns no usable status/path, retry once with a status-only prompt and the same output path. If the retry is also empty, mark that handoff `BLOCKED (null_response)` and continue only when the workflow can safely surface the blocker.

---

## Non-Negotiables

- Context-retrieval shards are dispatched in staged parallel groups of <=3.
- Validation rules are loaded during the validation/audit phase; there is no always-active validation context shard.
- Tester is read-only. It reports validation/build findings and writes only `validation-brief.md`; it never edits source.
- Audit is read-only. It reports findings and writes only `audit-brief.md`; it never edits source or runs builds.
- Tester is the runtime smoke, a11y smoke, and test gate. Audit is deferred until tester returns green for the current iteration. Audit must not read tester output, but the orchestrator may use tester status to decide whether audit should be dispatched.
- The orchestrator does not write app code, run `ng build`, or perform quality audit work.
- When layout is active, `@progress/kendo-theme-utils` must be validated as both installed in `package.json` and referenced in CSS/theme setup.
- `files_to_check` is built before tester/audit from execution outputs' `Files written` sections.
- Validation starts only after developer outputs are clean or after explicitly non-blocking developer concerns have been recorded.
- Fix-loop reruns are targeted to files touched by the fix unless a shared shell, routing, style, or configuration file changes.
- Any unresolved `BLOCKED` shards, external blockers, or unresolved `NEEDS_CONTEXT` states are surfaced in the final answer.
