# Plan Execution Reference

Use this reference after all active context shard briefs have returned. Non-component dimensions (`layout`, `icons`, `theming`) may arrive as separate brief files or as sections inside one inclusive brief.

## Purpose

This step reads compact context brief summaries, not full briefs. The outputs are `layout-contract.md` and `dispatch-plan.md`. The contract preserves prompt fidelity requirements; the dispatch plan persists a brief index, section hints, static guidance sources, and acceptance criteria for developer, tester, audit, and fix-loop handoffs.

## 1.4 - Write `layout-contract.md`

Before sharding decisions, extract the current user goal into a concise contract artifact in the run scratch directory. This is not API documentation and must not duplicate context brief content. It preserves prompt fidelity requirements for downstream agents.

```markdown
## Layout contract

### Required page target
- Route/page/file target: </page | user-specified target | unknown>

### Required sections
- <section name> - <purpose and required position/order>

### Component-purpose mapping
- <KendoReact component or expected component category> - <purpose in the UI>

### Structure and sizing
- <row/column/panel/region/split/height/density requirement; include DataGrid/Chart height requirements when applicable>

### Responsive behavior
- <mobile/tablet/desktop behavior or "None specified">

### Visual identity
- <theme mode, palette, mood, typography, density, brand notes or "None specified">

### Data and states
- <sample data counts, named entities, empty/loading/error states>

### Interactions
- <filters, selection, dialogs, actions, notifications, editing, navigation>

### React setup expectations
- <package, entry file, root CSS, theme import, theme-utils, and bundler expectations implied by context>

### Out-of-scope or ambiguous requirements
- <None | ambiguous prompt item requiring context/user clarification>
```

Reference `layout-contract.md` from `dispatch-plan.md`. Pass either the relevant contract section inline or the contract path plus scoped bullets in every developer and audit handoff.

## 1.5a - Load Brief Summaries

Run this as a single parallel turn:

- `read_file` only the top summary range of every path in `context_brief_paths`, enough to include `Status`, `Shard`, `User goal`, and `Dispatch summary`. If a brief has no `Dispatch summary`, read only the smallest section needed to recover equivalent routing facts and record the missing summary as a concern.

Do not perform project detection for developer. The developer detects React app model, routes, entry files, package/config, theme setup, root styles, and implementation files. Tester may still perform targeted validation checks later from the developer report and source files.

## 1.5b - Developer Task Strategy

Prefer a single autonomous developer handoff. Parallel developer tasks are only safe when requested work is truly independent and overlapping edits to routes, root components, entry files, root styles, package/config, and shared UI are unlikely.

Only dispatch multiple developer tasks when the requested work is truly independent and the risk of overlapping edits is explicitly acceptable. Record that risk in `dispatch-plan.md` and resolve any overlapping `Files written` before validation.

## 1.5c - Write `dispatch-plan.md`

```markdown
## Layout contract
- path=<absolute path to layout-contract.md>
- summary=<compact list of sections/components/structure/interactions/setup expectations>

## Brief index
- `<brief-id>`: path=<absolute path>, shard=<components-N|layout|icons|theming|combined>, dimensions=<list>, summary=<compact dispatch summary>, deeper sections=<section headings likely needed, including Retrieved examples>

## Static guidance index
- React common component guidelines: <brief path or source file summary>
- DataGrid guidance: <brief path or source file summary when DataGrid/Grid is in scope>
- Editor guidance: <brief path or source file summary when Editor is in scope>
- Smart Grid guidance: <brief path or source file summary when AI grid is in scope>
- Layout conventions: <brief path or source file summary>
- UX guidelines: <brief path or source file summary>
- Accessibility baseline: <brief path or source file summary>
- Theme application methods: <brief path or source file summary>
- Validation expectations: <brief path or source file summary>

## Developer task
- task: <one concrete autonomous implementation task>
- user_goal: <original request or relevant slice>
- acceptance_criteria: <compact bullets from layout-contract.md, user goal, and React static guidance requirements>
- known_context:
    - layout_contract: <path plus compact full contract summary>
    - context_brief_paths: [<all relevant brief/addendum paths>]
    - brief_section_hints: [<section headings likely needed if Dispatch summaries are insufficient>]
    - static_guidance_notes: <compact reminders for DataGrid/Chart height, Grid alias, EditorTools, Smart Grid, Kendo utilities, WCAG, validation>
    - notes: <routing notes, blocked shards, or previous-loop state; omit if none>
- findings: None on first implementation pass
- output_path: tmp/.../developer-report.md
```

## Progressive Disclosure Policy

- Do not inline whole shard sections into `dispatch-plan.md`.
- Do not inline full API docs into `layout-contract.md`; it captures prompt requirements only.
- Do not inline retrieved examples into `dispatch-plan.md`; preserve section hints so downstream agents can read examples on demand.
- Handoffs pass brief paths plus section hints. Developer, tester, and audit read each brief's `Dispatch summary` first and then only deeper sections that are needed.
- For `NEEDS_CONTEXT` recovery, re-dispatch only the smallest affected shard. Regenerate `dispatch-plan.md` using summaries from the updated brief/addendum.
- Persist both `layout-contract.md` and `dispatch-plan.md` in the run scratch directory.