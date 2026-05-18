---
name: kendo-react-component
description: Retrieves documentation, API reference, and code examples for KendoReact components. Use when the user asks about a specific Kendo component, needs API reference, asks how to use a component, wants code examples, or mentions component names like DataGrid, Chart, Scheduler, DatePicker, DropDownList, Form, Button, Dialog, Editor, etc. Trigger on "how do I use", "what props does", "KendoReact component example", "component docs", "/kendo", "/ask_kendo", "@kendo". One call per component — do not batch multiple components into one query.
---

## KendoReact — Component Assistant

### Common Guidelines

Before implementing any component, read [common-guidelines.md](common-guidelines.md) for the foundational rules that apply to every KendoReact implementation (package installation, function component patterns).

For component-scoped usage, read [common-guidelines.md](common-guidelines.md) before calling the component assistant. This skill owns that progressive disclosure decision; callers should follow this skill rather than hard-coding supporting files.

### Component-Specific Guidelines

Certain components have additional guidelines that must be consulted:

| Component | Read before implementing |
|---|---|
| `DataGrid` / `Grid` | [datagrid-guidelines.md](datagrid-guidelines.md) — deprecated props and modern replacements |
| `Editor` | [editor-guidelines.md](editor-guidelines.md) — EditorTools import pattern |
| `SmartGrid` / AI-enhanced Grid | [smart-grid-guidelines.md](smart-grid-guidelines.md) — GridToolbarAIAssistant setup |

> **Note:** `Grid` is an alias for `DataGrid`. Always use `DataGrid` documentation and apply the rules in [datagrid-guidelines.md](datagrid-guidelines.md).

For component-scoped usage, read only the component-specific files that match the current component list, request, or follow-up notes:

- `DataGrid` / `Grid` -> [datagrid-guidelines.md](datagrid-guidelines.md)
- `Editor` -> [editor-guidelines.md](editor-guidelines.md)
- `SmartGrid` / AI-enhanced Grid wording -> [smart-grid-guidelines.md](smart-grid-guidelines.md) and [datagrid-guidelines.md](datagrid-guidelines.md)

Do not read unrelated component guideline files. Normalize `Grid` to `DataGrid` before calling the component assistant.

### Component Accessibility

For component-specific accessibility facts, load [../kendo-react-accessibility/SKILL.md](../kendo-react-accessibility/SKILL.md) after this component skill. Use it only for component-specific accessibility assistant calls with `includeGeneralGuidelines=false`. Do not read `wcag-guidelines.md` for this narrow lookup; WCAG baseline belongs to the broader validation and audit workflow.

### Calling the Component Assistant

Use the `kendo_component_assistant` MCP tool to retrieve accurate API reference and documentation for any KendoReact component.

**Tool call:**
```
kendo_component_assistant({
    query="<Specific question about the component, its features, or configuration>",
    component="<ComponentName>"
})
```

**Examples:**
```
kendo_component_assistant({
    query="How to implement paging and sorting in DataGrid?",
    component="DataGrid"
})
```

```
kendo_component_assistant({
    query="How to configure the DatePicker with custom formats and min/max dates?",
    component="DatePicker"
})
```

```
kendo_component_assistant({
    query="How to implement multi-column DropDownList?",
    component="MultiColumnComboBox"
})
```

### Query Guidelines

- **One component per call** — do not combine multiple component questions in one query
- **Be specific** — describe exactly the feature or behavior you need (e.g., "paging in DataGrid" not "DataGrid usage")
- **Break broad queries down** — for a DataGrid with paging, sorting, and filtering, make three separate calls
- Use the exact component name (e.g., `DataGrid`, not `Grid`; `DatePicker`, not `date picker`)
