# Validation And Audit Reference

Use this reference before building `files_to_check`, dispatching the tester smoke gate, and dispatching audit after tester is green.

Validation rules are loaded in this phase. Do not retrieve a separate `context-brief-validation.md`; there is no validation context shard. Load `../../kendo-react-orchestrator/validation-steps.md` and validation-relevant static guidance summarized in context briefs.

## KendoReact Fact Source Policy

- Tester and audit compare generated source against context briefs, explicit handoff facts, prior reports, React validation references, and static guidance supplied by this pipeline.
- Tester and audit may inspect application source and project files for local usage, dependency presence, React/Kendo setup, and theme/static asset validation.
- Tester and audit must not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `dist`, `build`, coverage output, or package caches to recover missing Kendo facts.
- If a required Kendo/design-system/accessibility fact is absent from provided briefs or handoff facts, route it as `context_required` / `NEEDS_CONTEXT`; do not fill the gap from dependency internals.

## Rule Loading

Load validation references once before tester dispatch:

- `plugins/kendo-react-mcp-plugin/skills/kendo-react-orchestrator/validation-steps.md`
- `plugins/kendo-react-mcp-plugin/skills/kendo-react-component/datagrid-guidelines.md` when DataGrid/Grid appears in `files_to_check` or component facts.
- `plugins/kendo-react-mcp-plugin/skills/kendo-react-component/editor-guidelines.md` when Editor appears in `files_to_check` or component facts.
- `plugins/kendo-react-mcp-plugin/skills/kendo-react-component/smart-grid-guidelines.md` when AI grid behavior appears in the user goal or component facts.

Extract build requirements, React setup checks, KendoReact component validation checks, Kendo Design System utility checks, DataGrid/Chart sizing checks, and theme/styling checks.

Load audit checklist material from context brief summaries plus `kendo-react-orchestrator/ux-guidelines.md`, `kendo-react-accessibility/wcag-guidelines.md`, and component-specific accessibility facts from context briefs.

Accessibility is part of the validation and audit scope. It is not an `active_dimensions` value and does not create a standalone context-retrieval shard. WCAG baseline rules come from validation/audit references, and component-specific ARIA / keyboard / focus facts come from scoped component context briefs.

## Build `files_to_check`

Read the leading JSON status block and `Files written` section of every developer report. Build a deduplicated flat list `files_to_check`; latest write wins per path. Exclude dependency and generated folders by policy: `node_modules`, `dist`, `build`, coverage output, package caches, dependency package source, package `.d.ts` declarations, source maps, and generated dependency source.

Keep a latest-writer map for rerun routing and conflict awareness, but do not treat it as developer ownership. Fixes return to developer as autonomous tasks.

Also collect each developer report's `selfCheck` object into `developer_self_check`. Runtime smoke, a11y smoke, browser checks, and test execution are tester-owned gates and must not be marked complete from developer self-check data.

## Tester-First Gate Dispatch

Dispatch `kendo-react-tester` first. Do not dispatch `kendo-react-audit` for the same iteration until tester returns `GREEN`, unless tester is explicitly unavailable due to an external non-code blocker.

For first-pass gates, build scopes from developer reports and available context summaries. For fix-loop reruns, build scopes from the current loop task only: `loop_files`, `loop_dimensions`, `loop_component_facts`, `loop_brief_paths`, and `loop_section_hints`.

```text
Handoff to: kendo-react-tester
- verification_scope:
    validation_rules: <rules from validation steps and relevant static guidance>
    component_api_facts: <props/events/imports/setup from scoped summaries; include component-specific accessibility facts when present>
    accessibility_facts: <WCAG baseline and component-specific ARIA / keyboard / focus facts>
    project_detection: <optional known facts; tester detects missing facts read-only>
    active_dimensions: [components | layout | icons | theming — active subset; accessibility is supplied via accessibility_facts]
- files_to_check: [<deduplicated source file paths>]
- context_brief_paths: [<briefs needed to verify these files>]
- brief_section_hints: [<section headings tester may read if summaries are insufficient>]
- developer_self_check: <structured self-check object>
- loop_context: <omit on first pass | current loop task summary on rerun>
- output_path: tmp/.../validation-brief.md
-> validation-brief.md path; Status: GREEN | NEEDS_CONTEXT | BLOCKED
```

Tester consumes `developer_self_check` first. If `fileState = final` and a source/static/build check is listed in `passed`, tester should mark that same check as already completed and continue with uncovered validation work. Tester must not mark runtime smoke, a11y smoke, browser checks, unit tests, e2e tests, or integration tests complete from developer self-check data. Rerun checks when self-check data is missing, stale, failed, skipped, incomplete, or contradicted by the current scope.

## Audit Dispatch After Green

Dispatch `kendo-react-audit` only after tester returns `GREEN` for the current iteration. Audit does not read tester output.

```text
Handoff to: kendo-react-audit
- audit_scope:
    quality_checklist: <UX guidelines + React setup quality + KendoReact component quality, filtered by active dimensions; WCAG baseline always included>
    component_api_facts: <compact facts from scoped component summaries; include ARIA / keyboard / focus bullets when present>
    layout_contract: <contract bullets relevant to prompt fidelity, layout, accessibility, behavior, and visual identity>
    project_detection: <optional known facts; audit detects missing facts read-only>
    active_dimensions: [components | layout | icons | theming — active subset; accessibility is supplied via quality_checklist, component_api_facts, and layout_contract]
- files_to_check: [<same deduplicated source file paths>]
- context_brief_paths: [<briefs needed to audit these files>]
- brief_section_hints: [<section headings audit may read if summaries are insufficient>]
- loop_context: <omit on first pass | current loop task summary on rerun>
- layout_contract_scope: <omit on first pass if full audit_scope.layout_contract is supplied | relevant contract bullets on rerun>
- output_path: tmp/.../audit-brief.md
-> audit-brief.md path; Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

## Fix-Loop Rerun Scoping

On subsequent validation/audit passes, do not reuse the first run's full `files_to_check`, `component_api_facts`, `active_dimensions`, `context_brief_paths`, or summaries by default. Rebuild them from the current loop task:

- `files_to_check = loop_files`.
- `active_dimensions = loop_dimensions`.
- `component_api_facts = loop_component_facts`.
- `context_brief_paths = loop_brief_paths`.
- `brief_section_hints = loop_section_hints`.
- `loop_context = current_loop_scope`.

Keep static validation/audit guidance available, but apply it only to loop files and dimensions. Expand beyond the current loop task only when a finding, compiler/type error, runtime error, or test error names an additional affected file or dimension.

## Gate Aggregation

Route tester output before audit dispatch. If tester returns `BLOCKED` or `NEEDS_CONTEXT`, enter the appropriate loop and do not run audit for that iteration.

Tester status routing:

- `GREEN` -> no validation fixes needed; audit may run.
- `NEEDS_CONTEXT` (`context_required` findings or scope contradiction in `verification_scope`) -> context loop.
- `BLOCKED` (`fix_required` findings, build/runtime failure, or external validation blocker) -> fix loop, except external blockers that require user intervention.

For trivial UI Kendo enforcement, route `[context_required] dimension=components` findings before fix-loop dispatch when tester says the Kendo replacement fact was not previously fetched. After the context addendum lands, rerun tester or dispatch a targeted fix loop with the new component fact. If tester already has the Kendo replacement fact, route the finding directly to the fix loop.

Tester is read-only. It must not edit files. Read `Required orchestrator action` from `validation-brief.md` and route failures through either the context loop or the fix loop before audit dispatch.

Tester report caps: for green paths, rely on the JSON block and keep Markdown concise. For blocked paths, include at most 3 unique build/runtime errors and at most 5 grouped a11y rule findings.

## Layout Utility Validation

When `layout` is active, tester must validate Kendo Design System utility availability through current React layout conventions:

- required package/static asset/CDN reference or existing project-approved utility import is present;
- required theme/static asset reference is wired through the detected React app mechanism;
- dark theme body styles use `var(--kendo-body-bg)` and `var(--kendo-body-text)` when dark theme or custom theme mode is active;
- DataGrid and Chart have explicit stable height when used;
- flex/grid children containing Kendo components include a `min-width: 0` equivalent when required by layout facts.

Detection facts that tester cannot determine from source/project files route to context loop. Missing package, static asset, CDN reference, utility import, theme/static asset wiring, or required sizing rules route to fix loop.

Audit status routing:

- `DONE` -> no audit fixes needed.
- `DONE_WITH_CONCERNS` / `BLOCKED` -> fix loop.
- `NEEDS_CONTEXT` -> context loop.

Audit is read-only. It reports findings and writes only `audit-brief.md`.

Audit report caps: include Critical and Important findings only by default, with at most 5 total findings per iteration unless the orchestrator explicitly asks for Minor/polish details.

Prompt-fidelity audit should use `audit_scope.layout_contract` or `layout_contract_scope` to identify missing required sections, component-purpose mismatches, missing interactions/states, missing responsive behavior, missing accessibility requirements, and missing visual requirements. Do not treat absent contract bullets as audit findings; only audit requirements explicitly supplied by the orchestrator.

Completion routing:

- `tester GREEN` + `audit DONE` -> completion.
- `tester GREEN` and audit skipped as explicitly unavailable/out of scope -> completion with caveat.
- Any `NEEDS_CONTEXT` from either gate -> context loop for the smallest affected dimension, then rerun the affected gate(s).
- Any fix-required tester findings -> enter fix loop before audit.
- Any fix-required audit findings after tester green -> enter fix loop with the audit findings.