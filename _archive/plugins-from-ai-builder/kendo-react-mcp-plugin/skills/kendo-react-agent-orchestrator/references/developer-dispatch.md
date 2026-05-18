# Developer Dispatch Reference

Use this reference before handing work to the `kendo-react-developer` agent.

## Architecture

Developer receives one autonomous implementation or fix task. The orchestrator does not assign file ownership or choose implementation files. Developer inspects the workspace, edits the React app, runs targeted source/static/build self-checks, and reports every changed file.

Context retrieval remains orchestrated. Developer must not call KendoReact documentation/design-system MCP tools or fetch Kendo/design-system documentation directly. Missing API/design-system facts become `Context-loop candidates`.

## Handoff Shape

```text
Handoff to: kendo-react-developer
- task: <one concrete implementation or fix task>
- user_goal: <original user request or relevant slice>
- acceptance_criteria:
    - <observable outcome the implementation must satisfy>
    - <prompt/layout/behavior requirement to preserve>
    - <React setup/static guidance requirement to preserve>
- known_context:
    layout_contract: <path to layout-contract.md plus compact summary>
    dispatch_plan: <path to dispatch-plan.md, if useful>
    context_brief_paths: [<available brief and addendum paths>]
    brief_section_hints: [<section headings developer may read if summaries are insufficient>]
    prior_reports: [<developer/tester/audit report paths relevant to this task>]
    static_guidance_notes: |
      <compact reminders from current React plugin guidance>
    notes: |
      <compact context from previous loops; omit if none>
- findings:
    source: none | developer | tester | audit | mixed
    items: |
      <verbatim findings to address, or None>
- output_path: tmp/.../developer-report.md
-> developer-report.md path; Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
```

## Status Routing

- `DONE` -> continue only if the leading JSON block and `Developer self-check` are clean, `selfCheck.fileState = final`, and no batched loop requests remain.
- `DONE_WITH_CONCERNS` -> route context-loop candidates first, then fix-loop candidates, or continue only for explicitly non-blocking concerns.
- `NEEDS_CONTEXT` -> context loop for the smallest affected components/dimensions, then re-dispatch developer.
- `BLOCKED` -> surface blocker unless a listed context-loop or fix-loop candidate is safe to dispatch.

For routing, read only `Status`, the leading JSON block, `Files written`, `Developer self-check`, `Batched loop requests`, and `Concerns` unless more detail is necessary.

## Developer Boundary

Developer owns app-code edits. The orchestrator never writes app code. Tester and audit findings later return to developer as autonomous fix tasks, not file-scoped instructions.