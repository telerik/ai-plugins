---
name: telerik-blazor-agent-orchestrator
description: Main entry point for building or refining UI with Telerik UI for Blazor using a custom-agent handoff pipeline (telerik-blazor-context-retrieval / telerik-blazor-developer / telerik-blazor-tester / telerik-blazor-audit). Coexists with telerik-blazor-orchestrator. Orchestrates the full workflow including accessibility, layout, components, theming, icons, validation, and current Blazor plugin building blocks. Use when the user wants to build or modify a complete page, section, or UI feature with Telerik Blazor components and prefers the agent-handoff pattern. Trigger on "build a page", "create a dashboard", "implement a UI", "generate a form", "build UI with Telerik Blazor", "create a Blazor page", "#telerik_ui_agent_generator".
---

# Telerik UI for Blazor - Agent Orchestrator

**Current Goal:**

$ARGUMENTS

The orchestrator dispatches subagents, coordinates context loops, preserves prompt requirements, syncs the current Blazor building-block guidance into the handoff, and aggregates results. It never writes app code, runs builds, validates Razor files directly, or audits source directly.

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
- Developer reports include a structured `selfCheck` block for source/static/build/Razor-validator checks. Tester may skip duplicate static/build/validator checks only when those checks passed against final files; runtime smoke, a11y smoke, and tests remain tester-owned.
- Report caps are mandatory: runtime findings are capped at the first 3 unique critical errors, a11y findings at the first 5 grouped rule violations, audit findings at Critical and Important by default, and fix-loop payloads at files changed plus applied findings.
- The orchestrator persists `layout-contract.md` and `dispatch-plan.md` to disk so prompt requirements and brief content survive context-window pressure and fix loops.

Scratch directory: `tmp/orchestrator-run-<session_id>/`

---

## Blazor Building-Block Sync Policy

The agent pipeline must keep the current Blazor plugin building blocks as authoritative static context:

- `../telerik-blazor-orchestrator/ux-guidelines.md` supplies UI/UX defaults.
- `../telerik-blazor-component/common-guidelines.md` supplies TelerikRootComponent, package, interactivity, and attribute-splatting rules.
- `../telerik-blazor-layout/layout-conventions.md` supplies Kendo Design System utility setup and Telerik layout-component priority rules.
- `../telerik-blazor-style/application-methods.md` supplies theme application methods.
- `../telerik-blazor-accessibility/wcag-guidelines.md` supplies WCAG 2.2 AA baseline rules.
- `../telerik-blazor-orchestrator/validation-steps.md` and `../telerik-blazor-validator/SKILL.md` supply Razor validation expectations.

Context retrieval reads these building blocks inside the relevant shard and summarizes them into context briefs. Developer, tester, and audit consume the briefs and may read linked static files only when the orchestrator explicitly includes them as section hints or when validating source-level Blazor setup. Do not duplicate or silently override those building-block rules.

---

## Telerik Fact Source Policy

- Authoritative Telerik Blazor, accessibility, icon, layout, theme, and validator facts come from context briefs, explicit handoff facts, current Blazor plugin building blocks, and prior reports produced by this pipeline.
- Application source may be inspected for local usage patterns, existing imports/usings, project wiring, and generated-code behavior.
- Project files such as `.csproj`, `Program.cs`, `Startup.cs`, `App.razor`, `Routes.razor`, `_Imports.razor`, layout files, static web assets, root CSS, and package/lock/config files may be inspected for dependency presence and setup.
- Do not inspect NuGet package internals, generated dependency source, Telerik assemblies/decompiled code, `obj`, `bin`, generated Razor artifacts, package caches, or dependency declaration files to discover Telerik component APIs, parameters, events, child content names, validator rules, accessibility requirements, icon names, theme variables, or layout utility classes.
- Developer, tester, and audit must not call Telerik documentation/design-system MCP tools or external documentation lookup for Telerik/design-system facts. Context retrieval is the only stage that retrieves authoritative Telerik/design-system facts. `telerik_validator_assistant` is a validation-gate exception for Razor files, not a fact source; validator errors that require API knowledge route through existing context or the context loop.
- If a Telerik/design-system fact is missing, ambiguous, or contradictory, batch it as a `Context-loop candidates` entry and route through the context loop instead of dependency-internal discovery.

---

## Workflow Map

1. **Context retrieval** - plan active Telerik/design-system context shards, dispatch `telerik-blazor-context-retrieval` in parallel sub-groups of <=3, aggregate `context_brief_paths`.
2. **Plan execution** - read context brief summaries, extract the user request into `layout-contract.md`, and write `dispatch-plan.md` with a brief index, section hints, building-block notes, and autonomous developer acceptance criteria.
3. **Code generation** - dispatch one autonomous `telerik-blazor-developer` task by default, then inspect developer status, self-check, validator results, and batched loop requests before validation.
4. **Validation smoke gate** - load validation rules, build `files_to_check`, pass developer self-check summaries to `telerik-blazor-tester`, and dispatch the read-only tester first.
5. **Audit polish gate** - dispatch read-only `telerik-blazor-audit` only after tester is green or after tester gaps are intentionally skipped and non-blocking.
6. **Fix loop** - convert tester and audit findings into autonomous developer fix tasks, then re-run only affected gates/scopes until clean.

Status routing summary:

- `telerik-blazor-context-retrieval DONE` -> add path to `context_brief_paths`.
- `telerik-blazor-context-retrieval NEEDS_CONTEXT` -> re-dispatch only that shard with `prior_brief_path`, `gap_notes`, and a fresh output path.
- `telerik-blazor-context-retrieval BLOCKED` -> drop shard, record warning, continue if safe.
- `telerik-blazor-developer DONE` -> continue only after `Developer self-check` is present and contains no `concern` categories.
- `telerik-blazor-developer DONE_WITH_CONCERNS` -> route context-loop candidates first, then fix-loop candidates, or continue only for explicitly non-blocking concerns.
- `telerik-blazor-developer NEEDS_CONTEXT` -> context loop.
- `telerik-blazor-developer BLOCKED` -> surface blocker unless a narrower context-loop or fix-loop candidate is safe to dispatch.
- `telerik-blazor-tester GREEN` -> dispatch audit unless audit is explicitly unavailable or out of scope.
- `telerik-blazor-tester NEEDS_CONTEXT` -> context loop.
- `telerik-blazor-tester BLOCKED` with fix-required findings or build/runtime failure -> fix loop. Do not dispatch audit for the same iteration until tester is green.
- `telerik-blazor-audit DONE` after tester green -> complete.
- `telerik-blazor-audit DONE_WITH_CONCERNS` / `BLOCKED` -> fix loop.
- `telerik-blazor-audit NEEDS_CONTEXT` -> context loop.

Null-response routing: if a subagent returns no usable status/path, retry once with a status-only prompt and the same output path. If the retry is also empty, mark that handoff `BLOCKED (null_response)` and continue only when the workflow can safely surface the blocker.

---

## Non-Negotiables

- Context-retrieval shards are dispatched in staged parallel groups of <=3.
- Validation rules are loaded during the validation/audit phase; there is no always-active validation context shard.
- Tester is read-only. It reports validation/build/runtime/a11y/test findings and writes only `validation-brief.md`; it never edits source.
- Audit is read-only. It reports findings and writes only `audit-brief.md`; it never edits source or runs builds.
- Tester is the runtime smoke, a11y smoke, and test gate. Audit is deferred until tester returns green for the current iteration.
- The orchestrator does not write app code, run `dotnet build`, call `telerik_validator_assistant`, or perform quality audit work.
- Every Telerik component-bearing Razor file must be covered by Telerik validator evidence from developer self-check or tester validation unless the validator is unavailable and the skip is recorded.
- When layout is active, Kendo Design System utility availability must be validated through the current Blazor plugin layout conventions: package/static asset/CDN reference or an existing project-approved utility import.
- `files_to_check` is built before tester/audit from execution outputs' `Files written` sections.
- Fix-loop reruns are targeted to files touched by the fix unless a shared layout, route, `_Imports.razor`, root CSS, `Program.cs`, or project file changes.
- Any unresolved `BLOCKED` shards, external blockers, or unresolved `NEEDS_CONTEXT` states are surfaced in the final answer.
