# Context Retrieval Reference

Use this reference when planning, dispatching, aggregating, or re-dispatching KendoReact context shards.

## KendoReact Fact Source Policy

Context retrieval is the only stage that retrieves authoritative KendoReact and Progress/Kendo Design System facts through documentation/design-system MCP tools. Developer, tester, and audit consume the briefs produced here and route missing, ambiguous, or contradictory facts back through this context loop.

Downstream agents may inspect application source and project files for local usage patterns, dependency presence, and setup. They must not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `dist`, `build`, coverage output, or package caches to discover KendoReact APIs, props, events, accessibility requirements, icon names, theme variables, validation rules, or layout utility classes.

Context-retrieval agents load only scoped skill entry points. The loaded skill files own progressive disclosure for sibling references such as common guidelines, component-specific guidance, layout conventions, theme application methods, accessibility helper skills, and WCAG exceptions. The agent must strictly obey those skill-level instructions instead of hard-coding support-file reads.

## Shards

Component shards stay exclusive and capped. Non-component dimensions (`layout`, `icons`, `theming`) may be combined into an inclusive shard when that reduces handoff overhead and the user goal naturally couples those concerns. Dispatch active shards as parallel groups of <=3.

| Shard | Owns | Active when |
|---|---|---|
| `components-N` | <=3 KendoReact components: API, examples, setup, component-specific static guidance, and accessibility highlights | Any KendoReact component named or implied |
| `layout` | Kendo Design System utility classes, React layout conventions, ready layout components, DataGrid/Chart sizing, theme-utils setup, dark-theme body styling | Page sections or explicit layout needed |
| `icons` | Icon slot -> Kendo SVG icon import name or font-icon fallback | Icons or icon-only buttons implied |
| `theming` | CSS variables, Kendo theme tokens, application method | Custom colors, dark/light mode, brand, density, mood |
| `layout+icons`, `layout+theming`, `icons+theming`, `layout+icons+theming` | Listed non-component dimensions, kept in separate brief sections | Multiple non-component dimensions can be researched together |

Use inclusive shards for non-component dimensions by default when two or more of `layout`, `icons`, and `theming` are active. Keep them separate when one dimension is ambiguous, likely to need its own context loop, or substantially heavier than the others.

Component accessibility is retrieved inside component shards. WCAG baseline and static React validation guidance are validation/audit inputs, not standalone context shards.

## 1a - Plan

```text
Context-retrieval shard plan:
- components-1: [<=3 names]
- components-2: [<=3 names]   # if needed
- ui-context: [layout | icons | theming]   # combine active non-component dimensions when useful
- separate non-component shards: [layout, icons, theming]   # only when not combining
Total handoffs: N
```

Normalize component names before sharding. `Grid` must be treated as `DataGrid`. AI/smart/intelligent grid requests must include `DataGrid` and the Smart Grid guidance.

## 1b - Staged Parallel Dispatch

Group active shards into sub-groups of <=3 parallel handoffs. Order component shards first, then the inclusive non-component shard or separate `layout`, `icons`, and `theming` shards.

Within a sub-group, emit all `kendo-react-context-retrieval` handoffs in one assistant turn by issuing multiple `runSubagent` calls in the same parallel batch. Use one call per shard, up to 3. Do not await one shard before issuing the next shard inside the same sub-group. If total handoffs exceed 3, dispatch the next sub-group only after the previous sub-group returns and is aggregated.

```text
Handoff to: kendo-react-context-retrieval  (shard: <name>)
- user_goal_slice: <verbatim $ARGUMENTS>
- shard: components | layout | icons | theming | <non-component dimensions joined by "+">
- dimensions: [layout | icons | theming]  # required when shard combines dimensions
- component_list: [<=3 names]         # component shards only; use DataGrid for Grid
- output_path: tmp/.../context-brief-<shard>.md
-> file path; Status: DONE | NEEDS_CONTEXT | BLOCKED
```

Context report caps: each `Dispatch summary` should be at most 12 bullets. Missing facts should use an explicit `Not specified by retrieved context` entry. These caps apply to the summary, not to minimal retrieved examples preserved in full reference sections.

For component shards, request preservation of up to 1-2 minimal MCP-retrieved examples per component when they demonstrate imports, props, events, data shape, setup, accessibility facts, or component composition. Examples belong in full component sections, not in the `Dispatch summary`, and are reference material rather than implementation plans.

For non-component shards, preserve minimal MCP-retrieved examples only when they directly demonstrate layout utility usage, icon usage, theming application, CSS variable application, or React setup needed by the requested dimension. Keep examples inside the matching `Layout`, `Icons`, or `Theming` section.

Inclusive non-component briefs must preserve dimension boundaries with separate `## Layout`, `## Icons`, and `## Theming` sections as applicable. Do not merge guidance into a cross-dimensional implementation plan; developer owns implementation decisions.

For layout shards, request `includeBuildingBlockExamples=true` from `kendo_layout_assistant` so current React static guidance examples stay available. For theming shards, preserve exact user color/theme wording in the `kendo_style_assistant` query, including hex values, RGB/RGBA/HSL values, CSS variable names, named brand colors, primary/accent/success/error colors, theme mode, contrast, density, mood, typography, and palette constraints.

## Aggregate And Loop

- `DONE` -> add path to `context_brief_paths`.
- `NEEDS_CONTEXT` -> re-handoff the same shard or smallest affected dimension with `prior_brief_path` + `gap_notes` + fresh `output_path`. Add both original and addendum paths.
- `BLOCKED` -> drop shard, record warning, continue only if the missing dimension is not required by the layout contract or acceptance criteria.

Any `NEEDS_CONTEXT` from `kendo-react-developer`, `kendo-react-tester`, or `kendo-react-audit` citing a scoped fact contradiction triggers the smallest relevant context addendum, then plan regeneration and rerun of only affected downstream handoffs.

For context loops:

1. Identify the affected retrievable dimension: component name, layout, icons, or theming.
2. Re-dispatch only the smallest relevant shard. If the original brief was inclusive, re-dispatch the affected dimension alone unless the gap explicitly spans multiple dimensions.
3. Preserve `missing_fact` and evidence in `gap_notes`.
4. Regenerate `dispatch-plan.md` with updated brief paths, section hints, and compact summaries.
5. Rerun only affected downstream handoffs with the updated plan and continuation task.

Validation-rule gaps are not context-retrieval gaps. Do not dispatch a `validation` shard from context retrieval.
Build, runtime, a11y smoke, and test failures route to the fix loop unless the finding explicitly identifies missing or contradictory context facts.