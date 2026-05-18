# Fix Loop Reference

Use this reference when tester or audit reports findings that require developer changes.

## Triggers

- `kendo-react-tester BLOCKED` with fix-required findings, build failure, runtime failure, or other code-level validation failure.
- `kendo-react-audit DONE_WITH_CONCERNS`.
- `kendo-react-audit BLOCKED` when the blocker is fixable by source changes.
- `kendo-react-developer DONE_WITH_CONCERNS` with fix-loop candidates or self-check concerns that can be fixed from existing context.
- `kendo-react-developer BLOCKED` when a narrower listed fix-loop candidate can be safely dispatched.

Tester runs before audit. Enter the fix loop immediately when tester returns fix-required findings, build/runtime failure, or actionable validation blockers; do not wait for audit in that iteration. Audit findings enter a later fix loop only after tester is green and audit has run. Developer-originated fix-loop candidates may start a pre-validation fix loop when they are discovered before tester dispatch.

External blockers that require user intervention should be surfaced instead of entering the fix loop.

## Build Fix Task

Use findings from `validation-brief.md`, `audit-brief.md`, or developer `Batched loop requests` to build one autonomous fix task for `kendo-react-developer`. The orchestrator summarizes what failed and passes relevant report paths and context, but it does not preassign files to edit.

Use the developer report's `Files written` section and tester/audit file evidence to decide which validation/audit scopes need reruns after the fix. Do not turn that evidence into developer file restrictions.

Map common React/KendoReact findings into acceptance criteria:

- Invalid KendoReact prop/event/import -> correct using scoped component facts or request context first.
- DataGrid deprecated prop, missing explicit height, unset dense column widths, or wrong `Grid` alias -> fix using DataGrid guidance.
- Chart missing explicit height -> add stable sizing.
- Editor string tools or missing `EditorTools` import -> fix using Editor guidance.
- Smart Grid request without `GridToolbarAIAssistant` setup -> fix using Smart Grid guidance.
- Missing theme package/import, `@progress/kendo-theme-utils`, root CSS, dark-theme body styles, or icon package import -> inspect project and make the minimal setup edit.
- Missing accessible name/label/focus behavior -> fix using WCAG and component-specific accessibility facts.
- Prompt-fidelity or layout-contract miss -> implement the missing state, section, interaction, responsive behavior, or visual requirement.

For each fix round, build a **current loop task** from the findings instead of reusing the original request wholesale:

- `loop_files`: files named by findings, then updated after developer reports actual files written.
- `loop_findings`: tester/audit/developer findings for this owner, grouped by source report.
- `loop_dimensions`: only dimensions implicated by the findings/files (`components`, `layout`, `icons`, `theming`).
- `loop_component_facts`: only component facts needed for KendoReact components in `loop_files`.
- `loop_brief_paths`: only briefs needed for those dimensions/components.
- `loop_section_hints`: only section headings needed to resolve the findings.
- `layout_contract_scope`: only contract bullets implicated by the findings/files.
- `current_loop_scope`: compact summary of what changed, what must be fixed, and which brief/static facts apply.

## Fix Dispatch

Dispatch one autonomous fix task by default. Multiple fix tasks may be dispatched only when the findings are truly independent and overlapping edits are unlikely.

```text
Handoff to: kendo-react-developer
- task: <autonomous fix task summary>
- user_goal: <original request or relevant slice>
- acceptance_criteria:
    - <every Critical/Important or validation finding is fixed or explicitly explained>
    - <relevant layout-contract bullets remain satisfied>
    - <relevant React static guidance rules remain satisfied>
- known_context:
    layout_contract: <path plus relevant contract bullets>
    context_brief_paths: [<loop_brief_paths>]
    brief_section_hints: [<loop_section_hints>]
    prior_reports: [<developer-report.md, validation-brief.md, audit-brief.md as relevant>]
    notes: |
      <current_loop_scope; compact summary of what changed, what must be fixed, and which brief/static facts apply>
- findings:
    source: tester | audit | developer | mixed
    items: |
      <verbatim findings for this fix round>
- output_path: tmp/.../developer-report-fix-<iter>.md
-> developer report path; Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

## After Each Fix Round

1. Update `files_to_check` from the fix report `Files written` section. Keep a latest-writer map for routing reruns, but do not treat it as developer ownership.
2. Update the current loop task: `loop_files` becomes files modified by the fix plus shared route, root component, entry file, root CSS, package/config, theme/static asset, or bundler files that could affect them; keep only still-relevant findings, dimensions, brief paths, and section hints.
3. Re-run tester for the current loop task when the original round had tester findings, build failures, or the fix touched imports, package/config, routing, entry files, theme setup, JSX/TSX bindings, data shape, or Kendo component props.
4. Re-run audit for the current loop task when the original round had audit findings or the fix touched JSX UI, styles, accessibility, behavior, shared layout, routing, theme/static assets, or configuration.
5. If both gates are relevant, dispatch tester first and dispatch audit only after tester returns `GREEN`.
6. Repeat until all relevant tester runs return `GREEN` and all relevant audit runs return `DONE`.

Do not rerun tester/audit with the original task's full brief set or full scope unless the current loop task genuinely spans that full scope.

`NEEDS_CONTEXT` from any fix worker routes to the context loop. `BLOCKED` from a fix worker is surfaced unless a narrower retry can be safely dispatched.

## Developer Batched Loop Requests

When a developer report includes `## Batched loop requests`:

1. Collect all `Context-loop candidates` and group them by smallest affected dimension/component. Dispatch context retrieval addenda first when any fix candidate depends on missing context.
2. Collect all `Fix-loop candidates` and fold them into the next autonomous developer fix task using `Files written`, changed-file evidence, and shared-file impact notes.
3. Dispatch autonomous developer fix tasks only after required context addenda have been produced and affected handoffs have been regenerated.
4. Preserve all candidates in the run record so the final answer can surface unresolved items.