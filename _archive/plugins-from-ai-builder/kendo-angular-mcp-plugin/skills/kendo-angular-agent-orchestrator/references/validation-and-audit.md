# Validation And Audit Reference

Use this reference before building `files_to_check`, dispatching the tester smoke gate, and dispatching audit after tester is green.

Validation and audit rules are loaded in this phase. Do not retrieve a separate `context-brief-validation.md`; there is no validation context shard. Load [../../kendo-angular-validation/SKILL.md](../../kendo-angular-validation/SKILL.md) when entering this phase and extract the needed sections directly.

## Kendo Fact Source Policy

- Tester and audit compare generated source against context briefs, explicit handoff facts, prior reports, and the static validation checklist.
- Tester and audit may inspect application source, package manifests, lockfiles, Angular config, root styles, and `index.html` for local usage, dependency presence, and setup validation.
- Tester and audit must not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `.angular`, `dist`, or package caches to recover missing Kendo facts.
- If a required Kendo/design-system fact is absent from the provided briefs or handoff facts, route it as `context_required` / `NEEDS_CONTEXT`; do not fill the gap from dependency internals.

## Rule Loading

Load the validation reference once before tester dispatch:

- `read_file plugins/kendo-angular-mcp-plugin/skills/kendo-angular-validation/SKILL.md`
- Extract **Part 1 — Pre-Build API Verification** into `verification_scope.pre_build_checklist`.
- Extract **Part 2 — Quality Audit** only after tester is green and audit is ready to run; drop subsections whose dimensions are out of scope.
- Keep the validation reference out of context retrieval; it is static phase policy, not retrieved project/component context.

## Build `files_to_check`

Read the leading JSON status block and `Files written` section of every developer report. Build a deduplicated flat list `files_to_check`; latest write wins per path. Pass this list verbatim to tester and, after tester is green, audit. Exclude dependency folders and generated dependency artifacts by policy: `node_modules`, `.angular`, `dist`, package caches, dependency package source, package `.d.ts` declarations, source maps, and generated declaration bundles must not enter `files_to_check` unless the user explicitly asks to validate those folders as first-party app output.

Keep a latest-writer map for rerun routing and conflict awareness, but do not treat it as developer ownership. Fixes return to developer as autonomous tasks.

Also collect each developer report's `selfCheck` object into `developer_self_check`. Preserve source/static/build check names, pass/fail status, skipped checks, artifact references, and file-state marker. Runtime smoke, a11y smoke, browser checks, and test execution are tester-owned gates and must not be marked complete from developer self-check data.

## Tester-First Gate Dispatch

Dispatch `kendo-angular-tester` first. Do not dispatch `kendo-angular-audit` for the same iteration until tester returns `GREEN`, unless the workflow explicitly records tester as unavailable due to an external non-code blocker.

For first-pass gates, build scopes from developer reports and available context summaries. For fix-loop reruns, build scopes from the current loop task only: `loop_files`, `loop_dimensions`, `loop_component_facts`, `loop_brief_paths`, and `loop_section_hints`.

### Tester Handoff

```text
Handoff to: kendo-angular-tester
- verification_scope:
    pre_build_checklist: |
        <verbatim Part 1 checklist from kendo-angular-validation/SKILL.md>
    component_api_facts: |
        <compact facts from scoped component Dispatch summaries; include key inputs / outputs / import paths>
    project_detection: <optional known facts; tester detects missing facts read-only from source/config files>
    active_dimensions: [components | layout | icons | theming — active subset]
- files_to_check: [<deduplicated source file paths>]
- context_brief_paths: [<briefs needed to verify these files>]
- brief_section_hints: [<section headings tester may read if summaries are insufficient>]
- developer_self_check:
    fileState: final | stale | partial | unknown
    checksRun: [source-self-check | build | type-check | lint | format-check | ...]
    passed: [<checks that passed against final files>]
    skipped: [<checks intentionally skipped by developer>]
    fixedFindings: [<normalized findings fixed before handoff>]
    artifactRefs: [<paths to logs/screenshots when provided>]
- loop_context: <omit on first pass | current loop task summary on rerun>
- output_path: tmp/.../validation-brief.md
-> validation-brief.md path; Status: GREEN | NEEDS_CONTEXT | BLOCKED
```

Tester must read `developer_self_check` first. If `fileState = final` and a source/static/build check is listed in `passed`, tester should mark that same static/build check as already completed and continue with uncovered validation work instead of rerunning it. Tester must not mark runtime smoke, a11y smoke, browser checks, unit tests, e2e tests, or integration tests complete from developer self-check data. Rerun static/build checks when the self-check is missing, stale, failed, skipped, incomplete, or contradicted by the current scope.

## Audit Dispatch After Green

Dispatch `kendo-angular-audit` only after tester returns `GREEN` for the current iteration. Audit does not read tester output; the orchestrator uses tester status only as the dispatch gate.

### Audit Handoff

```text
Handoff to: kendo-angular-audit
- audit_scope:
    quality_checklist: |
        <verbatim Part 2 checklist from kendo-angular-validation/SKILL.md, filtered by active dimensions>
    component_api_facts: |
        <compact facts from scoped component Dispatch summaries; include ARIA / keyboard / focus bullets when present>
    layout_contract: |
        <contract bullets relevant to prompt fidelity, layout, accessibility, behavior, and visual identity for this audit scope>
    project_detection: <optional known facts; audit detects missing facts read-only from source/config files>
    active_dimensions: [components | layout | icons | theming — active subset]
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

Keep static checklist text available, but apply it only to the loop files and dimensions. Expand beyond the current loop task only when a finding or compiler error names an additional affected file or dimension.

## Gate Aggregation

Route tester output before audit dispatch. If tester returns `BLOCKED` or `NEEDS_CONTEXT`, enter the appropriate loop and do not run audit for that iteration.

Tester status routing:

- `GREEN` -> no validation fixes needed.
- `NEEDS_CONTEXT` (`context_required` findings or scope contradiction in `verification_scope`) -> context loop.
- `BLOCKED` (`fix_required` findings, build failure, or external validation blocker) -> fix loop, except external blockers that require user intervention.

For trivial UI Kendo enforcement, route `[context_required] dimension=components` findings before fix-loop dispatch when tester says the native control's Kendo replacement fact was not previously fetched. After the context addendum lands, rerun tester or dispatch a targeted fix loop with the new component fact. If tester already has the Kendo replacement fact, route the finding directly to the fix loop.

Tester is read-only. It must not edit files. Read `Required orchestrator action` from `validation-brief.md` and route failures through either the context loop or the fix loop before audit dispatch.

Tester report caps: for green paths, rely on the JSON block and keep Markdown to a concise summary. For blocked paths, include at most 3 unique runtime/build critical errors and at most 5 grouped a11y rule findings.

## Layout Utils Validation

When `layout` is active, tester must validate both:

- `@progress/kendo-theme-utils` is installed in `package.json` dependencies or devDependencies.
- `@progress/kendo-theme-utils` CSS is referenced through the detected theme import mechanism.

Detection facts that tester cannot determine from source/config files route to context loop. Missing package or missing CSS reference routes to fix loop.

Audit status routing:

- `DONE` -> no audit fixes needed.
- `DONE_WITH_CONCERNS` / `BLOCKED` -> fix loop.
- `NEEDS_CONTEXT` -> context loop.

Audit is read-only. It reports findings and writes only `audit-brief.md`.

Audit report caps: include Critical and Important findings only by default, with at most 5 total findings per iteration unless the orchestrator explicitly asks for Minor/polish details.

Prompt-fidelity audit should use `audit_scope.layout_contract` or `layout_contract_scope` to identify missing required sections, component-purpose mismatches, missing interactions/states, and missing responsive/visual requirements. Do not treat absent contract bullets as audit findings; only audit requirements explicitly supplied by the orchestrator.

Completion routing:

- `kendo-angular-tester GREEN` + `kendo-angular-audit DONE` -> completion.
- `kendo-angular-tester GREEN` and audit skipped as explicitly unavailable/out of scope -> completion with caveat.
- Any `NEEDS_CONTEXT` from either gate -> context loop for the smallest affected dimension, then rerun the affected gate(s).
- Any fix-required tester findings -> enter fix loop before audit. Any fix-required audit findings after tester green -> enter fix loop with the audit findings.
