---
name: kendo-react-context-retrieval
description: >
  Use this skill when an agent needs to fetch authoritative KendoReact component API
  references, accessibility guidance, icon mappings, layout utilities, CSS theme variables,
  or project setup guidance from MCP tools. Load this skill to identify knowledge gaps
  and fill them by calling the MCP tools directly. Trigger when the agent realizes it
  lacks specific KendoReact API knowledge needed to complete its task — for example,
  unknown prop names, event signatures, accessibility attributes, CSS variable names,
  or icon identifiers.
---

## Purpose

This skill enables any agent to autonomously retrieve authoritative KendoReact context
from MCP tools. Instead of depending solely on pre-injected context from the orchestrator
or `kr-context-retriever`, agents can identify knowledge gaps and fill them on the fly.

---

## Available MCP Tools

| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `kendo_component_assistant` | Component API — props, events, types, usage examples | `component` (string), `query` (string) |
| `kendo_accessibility_assistant` | WCAG 2.2 AA — ARIA roles, keyboard nav, focus management | `component` (string), `query` (string), `includeGeneralGuidelines` (bool) |
| `kendo_icon_assistant` | Find SVG icons by purpose or keyword | `query` (string), `limit` (number) |
| `kendo_layout_assistant` | Layout patterns, CSS utility classes, responsive design | `prompt` (string) |
| `kendo_style_assistant` | CSS variable theme generation, component CSS customization | `prompt` (string) |
| `kendo_getting_started_assistant` | Project scaffolding, setup instructions, licensing config | `createNewProject` (bool), `projectName` (string), `theme` (default\|bootstrap\|material\|fluent) |

---

## When to Use (Knowledge Gap Detection)

Load this skill and call the MCP tools when you encounter any of these gaps:

- **Unknown component API**: You need prop names, event signatures, or types for a KendoReact component but they were not in the injected context.
- **Missing accessibility guidance**: You need ARIA roles, keyboard navigation patterns, or focus management details for a component.
- **Unknown CSS variables or selectors**: You need CSS variable names, component DOM structure, or theme customization patterns.
- **Icon lookup**: You need to find the correct SVG icon for a purpose or keyword.
- **Layout patterns**: You need utility classes, responsive design patterns, or design system tokens.
- **Setup guidance**: You need installation steps, licensing configuration, or project scaffolding instructions.

---

## Execution Rules

### 1. One component per call
Never batch multiple components into one `kendo_component_assistant` query. Make separate calls for each component.

### 2. One topic per query — split and multiply
`kendo_component_assistant` and `kendo_accessibility_assistant` work best with single-topic queries. Split multi-topic requests:
- Props → one call
- Events → one call
- Rendering/templates → one call
- Controlled patterns → one call
- Filtering/sorting → one call

### 3. Route queries to the right tool
- Component API (props, events, types, defaults, usage examples) → `kendo_component_assistant`
- Accessibility (ARIA, keyboard nav, focus, screen readers) → `kendo_accessibility_assistant`
- CSS class names, rendered HTML structure, internal selectors → `kendo_style_assistant`
- Layout utilities, responsive patterns → `kendo_layout_assistant`
- Icons → `kendo_icon_assistant`
- Project setup → `kendo_getting_started_assistant`

### 4. Accessibility guideline flag
Set `includeGeneralGuidelines: true` only on the **first** `kendo_accessibility_assistant` call per session. All subsequent calls use `false`.

### 5. Icon search threshold
For `kendo_icon_assistant`, use `limit: 0.3` to get the most relevant matches.

### 6. Be concise but complete
Keep prop tables with types, event signatures, code examples (TypeScript), ARIA attributes, CSS variable names, and utility class names. Remove duplicate information across tool responses.

---

## Gap-Fill Workflow

When you detect a knowledge gap during your task:

1. **Identify the gap** — What specific information is missing? Which component? Which aspect (props, events, accessibility, styling)?
2. **Select the right tool** — Use the routing table above.
3. **Call the tool** — One component, one topic per call.
4. **Integrate the result** — Incorporate the retrieved information into your current task. Do not pause or hand off to another agent.
5. **Note what you retrieved** — Include the retrieved context in your completion report so downstream agents can benefit.
