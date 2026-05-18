# Developer Dispatch Reference

Use this reference before handing work to the `kendo-angular-developer` agent.

## Architecture

Developer receives one autonomous implementation or fix task. The orchestrator does not assign file ownership, provide files to create/modify, forbid implementation files, or choose mode-specific behavior. Developer inspects the workspace, decides which files are relevant, edits the app, runs targeted source/static/build self-checks, and reports every changed file.

Context retrieval remains orchestrated. Developer must not call MCP tools or fetch Kendo/design-system documentation directly. When required facts are missing, developer reports `Context-loop candidates`; the orchestrator dispatches `kendo-angular-context-retrieval` addenda and then re-dispatches `kendo-angular-developer` with updated context.

## Kendo Fact Source Policy

- Authoritative Kendo/design-system facts come from context briefs, explicit handoff facts, and prior reports.
- Application source may be inspected for local usage patterns, existing imports, project wiring, and generated-code behavior.
- Package manifests, lockfiles, Angular config, root styles, and `index.html` may be inspected for dependency presence and setup.
- Do not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `.angular`, `dist`, or package caches to discover Kendo component APIs, inputs, outputs, directives, providers, payload types, accessibility requirements, icon names, theme variables, or layout utility classes.
- If a Kendo/design-system fact is missing, ambiguous, or contradictory, batch it as a `Context-loop candidates` entry and return the appropriate non-green status.

## Handoff Shape

```text
Handoff to: kendo-angular-developer
- task: <one concrete implementation or fix task>
- user_goal: <original user request or relevant slice>
- acceptance_criteria:
    - <observable outcome the implementation must satisfy>
    - <prompt/layout/behavior requirement to preserve>
- known_context:
    layout_contract: <path to layout-contract.md plus compact summary>
    dispatch_plan: <path to dispatch-plan.md, if useful for brief index/context notes>
    context_brief_paths: [<available brief and addendum paths>]
    brief_section_hints: [<section headings developer may read if Dispatch summaries are insufficient>]
    prior_reports: [<developer/tester/audit report paths relevant to this task>]
    notes: |
      <compact context from previous loops; omit if none>
- findings:
    source: none | developer | tester | audit | mixed
    items: |
      <verbatim findings to address, or None>
- output_path: tmp/.../developer-report.md
-> developer-report.md path; Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

For the first implementation pass, `findings.source = none` and `findings.items = None`.

For fix passes, keep the task autonomous. Provide the relevant findings and acceptance criteria, but do not restrict the developer to a predetermined file list. Developer determines the necessary edits and reports the final `Files written` list.

## Dispatch Guidance

- Prefer a single developer handoff for the implementation pass. Do not shard developer work by default; autonomous implementation and unrestricted file discovery make parallel file ownership unsafe.
- If a task is truly independent and can run in parallel without shared routes, styles, package/config, or root composition, the orchestrator may dispatch separate developer tasks, but it must treat overlapping edits as a risk and resolve conflicts before validation.
- Include all available context brief paths, but keep the developer responsible for deciding which sections are relevant through progressive disclosure.
- `brief_section_hints` may include `Retrieved examples`; developer decides when those examples are needed for import, binding, setup, or data-shape clarity.
- Include `layout-contract.md` or a compact contract summary in every developer handoff so prompt fidelity survives context loops.
- Do not paste full context brief prose into the handoff. Pass paths and hints.
- Do not ask developer to run smoke tests, browser checks, unit/e2e/integration tests, or broad audit. Developer self-checks its own implementation with source/static/build checks; tester and audit remain independent gates.

## Status Routing

- `DONE` -> inspect the leading JSON status block and `Developer self-check`; continue to validation setup only if every applicable category passes, `selfCheck.fileState = final`, and no batched loop requests remain.
- `DONE_WITH_CONCERNS` -> read `Concerns`, `Developer self-check`, and `Batched loop requests`; route context-loop candidates first, then fix-loop candidates, or continue only for explicitly non-blocking concerns.
- `NEEDS_CONTEXT` -> context loop for the smallest affected components/dimensions, then re-dispatch developer with updated `known_context` and a continuation task.
- `BLOCKED` -> surface blocker unless a listed context-loop or fix-loop candidate is safe to dispatch.

## Developer Boundary

Developer owns app-code edits. The orchestrator never writes app code. Tester and audit findings later return to developer as autonomous fix tasks, not as file-scoped instructions.

## Developer Output Routing

For every developer report, read only these structured sections unless routing requires more detail:

- `Status`.
- Leading JSON status block, especially `filesWritten`, `riskFlags`, `findings`, and `selfCheck`.
- `Files written`.
- `Developer self-check`.
- `Batched loop requests`.
- `Concerns`.

Any `concern` self-check category means the report is not clean. Context-loop candidates indicate missing or contradictory Kendo/design-system/context facts and must be handled before fix-loop candidates that depend on that context. Fix-loop candidates indicate known source changes that can be made from existing context but were not completed in the current developer pass.

Preserve the developer `selfCheck` object and pass it to tester as `developer_self_check`. Tester uses this object only to skip duplicate source/static/build checks that already passed against the final file state. Tester still owns runtime smoke, a11y smoke, browser checks, and test execution.
