# Context Retrieval Reference

Use this reference when planning, dispatching, aggregating, or re-dispatching context-retrieval shards.

## Kendo Fact Source Policy

Context retrieval is the only stage that retrieves authoritative Kendo/design-system facts. Developer, tester, and audit consume the briefs produced here and must route missing, ambiguous, or contradictory facts back through this context loop.

Downstream agents may inspect application source for local usage patterns and package manifests/config for dependency presence, but they must not inspect `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `.angular`, `dist`, or package caches to discover Kendo APIs, inputs, outputs, directives, providers, payload types, accessibility requirements, icon names, theme variables, or layout utility classes.

Context-retrieval agents load only scoped skill entry points. The loaded skill files own progressive disclosure for sibling references such as common guidelines, component-specific guidelines, layout conventions, theme application methods, accessibility helper skills, and WCAG exceptions. The agent must strictly obey those skill-level instructions instead of hard-coding support-file reads.

## Shards

Component shards stay exclusive and capped. Non-component dimensions (`layout`, `icons`, `theming`) may be combined into an inclusive shard when that reduces handoff overhead and the user goal naturally couples those concerns. Dispatch active shards as parallel groups of <=3.

| Shard | Owns | Active when |
|---|---|---|
| `components-N` | <=3 components — API, accessibility, and examples | Any Kendo component named or implied |
| `layout` | Page structure, utility classes, responsive | Page sections or explicit layout needed |
| `icons` | Icon slot -> icon name resolution | Icons or icon-only buttons implied |
| `theming` | CSS variables, brand palette | Custom colors, dark mode, brand |
| `layout+icons`, `layout+theming`, `icons+theming`, `layout+icons+theming` | The listed non-component dimensions, each kept in its own brief section | Two or more active dimensions can be researched together without losing clarity |

Use inclusive shards for non-component dimensions by default when two or more of `layout`, `icons`, and `theming` are active. Keep them separate only when the user goal makes one dimension ambiguous, likely to need its own context loop, or substantially heavier than the others.

## 1a — Plan (inline, no tool calls)

```text
Context-retrieval shard plan:
- components-1: [<=3 names]
- components-2: [<=3 names]   # if needed
- ui-context: [layout | icons | theming]   # combine active non-component dimensions when useful
- separate non-component shards: [layout, icons, theming]   # only when not combining
Total handoffs: N
```

## 1b — Staged Parallel Dispatch

Group active shards into sub-groups of **<=3** parallel handoffs. Order: component shards first, then the inclusive non-component shard or any separate `layout`, `icons`, `theming` shards. If total >3, run sequential sub-groups; dispatch the next sub-group only after the previous sub-group returns and aggregation for that sub-group is complete.

Within a sub-group, emit all context-retrieval handoffs in a **single assistant turn** by issuing multiple `runSubagent` tool calls in the same parallel batch. Use one call per shard, up to 3. Do not await one shard before issuing the next shard inside the same sub-group.

Example sub-groups:

```text
Sub-group A: components-1, components-2, layout
Sub-group B: icons, theming

Sub-group A: components-1, components-2, layout+icons+theming
```

Each handoff:

```text
Handoff to: kendo-angular-context-retrieval  (shard: <name>)
- user_goal_slice: <verbatim $ARGUMENTS>
- shard: components | layout | icons | theming | <non-component dimensions joined by "+">
- dimensions: [layout | icons | theming]  # required when shard combines non-component dimensions
- component_list: [<=3 names]         # components shard only
- output_path: tmp/.../context-brief-<shard>.md
-> file path; Status: DONE | NEEDS_CONTEXT | BLOCKED
```

Context report caps: each `Dispatch summary` should be at most 12 bullets. Missing facts should use an explicit `Not specified by retrieved context` entry. These caps apply to the summary, not to minimal retrieved examples preserved in full reference sections.

For component shards, ask context-retrieval to preserve up to 1-2 minimal MCP-retrieved examples per component when they demonstrate imports, bindings, data shape, providers, required setup, or component composition. Examples belong in the full component section, not pasted into the `Dispatch summary`. They are reference material, not implementation plans.

For non-component shards, preserve minimal MCP-retrieved examples only when they directly demonstrate layout utility usage, icon usage, theming application, or CSS variable application needed by the requested dimension. Keep examples inside the matching `Layout`, `Icons`, or `Theming` section.

Inclusive non-component briefs must preserve dimension boundaries in the output file, using separate `## Layout`, `## Icons`, and `## Theming` sections as applicable. Do not merge guidance into a single cross-dimensional implementation plan; the developer agent owns implementation decisions.

For theming shards, instruct context-retrieval to pass color and theme requirements verbatim to `kendo_style_assistant`. The style query must preserve exact user wording for hex values, RGB/RGBA/HSL values, CSS variable names, named brand colors, primary/accent/success/error colors, theme mode, contrast, density, mood, typography, and palette constraints. Do not allow summarized phrases like "blue primary" when the user gave `primary #2563EB` or `rgb(...)`.

## 1c — Aggregate

- `DONE` -> add path to `context_brief_paths`.
- `NEEDS_CONTEXT` -> re-handoff the same handoff shard or the smallest affected dimension with `prior_brief_path` + `gap_notes` + fresh `output_path`. Add both paths. Repeat until `DONE`.
- `BLOCKED` -> drop shard, record warning, continue.

## Context Loop

Any `NEEDS_CONTEXT` from `kendo-angular-developer`, `kendo-angular-tester`, or `kendo-angular-audit` citing a scope contradiction triggers:

1. Identify the affected retrievable dimension: component name, layout, icons, or theming.
2. Re-dispatch only the smallest relevant `kendo-angular-context-retrieval` shard, passing `prior_brief_path` if a stale brief exists. If the original brief was inclusive, re-dispatch the affected dimension alone unless the gap explicitly spans multiple dimensions.
3. Re-run plan execution using only the updated brief summaries and regenerate `dispatch-plan.md` with updated brief paths, section hints, and compact summaries.
4. Re-run only the affected downstream handoff(s) with the updated plan and continuation task.

Validation-rule gaps are not context-retrieval gaps. Resolve them in the validation/audit phase by reloading the validation reference material, not by dispatching a `validation` shard.

`kendo-angular-tester BLOCKED` for a build failure triggers the fix loop, not the context loop.

When a developer report includes batched `Context-loop candidates`, group candidates by component and dimension before re-dispatch. Preserve each candidate's `missing_fact` and evidence in `gap_notes`, and request only the smallest addendum needed to unblock those facts. If the same component has multiple missing API facts, batch them into one addendum request for that component shard.
