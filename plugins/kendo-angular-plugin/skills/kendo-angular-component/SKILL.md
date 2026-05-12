---
name: kendo-angular-component
description: Retrieves documentation, API reference, and code examples for Kendo UI for Angular components. Use when the user asks about a specific Kendo component, needs API reference, asks how to use a component, wants code examples, or mentions component names like Grid, Chart, Scheduler, DatePicker, DropDownList, Forms, Button, Dialog, Editor, etc. Trigger on "how do I use", "what inputs does", "Kendo Angular component example", "component docs", "/kendo", "/ask_kendo", "@kendo". One call per component — do not batch multiple components into one query.
---

## Kendo UI for Angular — Component Assistant

### Common Guidelines

Before implementing any component, read [common-guidelines.md](common-guidelines.md) for the foundational rules that apply to every Kendo UI for Angular implementation (package installation via `ng add`, Angular types, and component patterns).

### Component-Specific Guidelines

Certain components have additional guidelines that must be consulted:

| Component | Read before implementing |
|---|---|
| `Grid` | [grid-guidelines.md](grid-guidelines.md) — `kendoGridBinding`, manual binding, command directive restrictions |
| `Smart Grid` / AI-enhanced Grid | [grid-guidelines.md](grid-guidelines.md) — `kendoGridAIAssistantTool` setup |
| `TreeList` | [treelist-guidelines.md](treelist-guidelines.md) — command directive restrictions |
| `ListView` | [listview-guidelines.md](listview-guidelines.md) — command directive restrictions |
| `Scheduler` | [scheduler-guidelines.md](scheduler-guidelines.md) — PDF command directive restriction |
| `Window` | [window-guidelines.md](window-guidelines.md) — action directive restrictions |
| `Charts` / `Sparkline` / `StockChart` | [charts-guidelines.md](charts-guidelines.md) — getter anti-pattern |
| `DropDownList`, `ComboBox`, `MultiSelect`, `AutoComplete`, `DropDownTree`, `MultiSelectTree`, `MultiColumnComboBox` | [dropdowns-guidelines.md](dropdowns-guidelines.md) — `textField`/`valueField` rules per variant |

### Calling the Component Assistant

Use the `kendo_component_assistant` MCP tool to retrieve accurate API reference and documentation for any Kendo UI for Angular component.

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
    query="How to implement paging and sorting in Grid?",
    component="Grid"
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
    query="How to implement a multi-column DropDownList?",
    component="MultiColumnComboBox"
})
```

### Query Guidelines

- **One component per call** — do not combine multiple component questions in one query
- **Be specific** — describe exactly the feature or behavior you need (e.g., "paging in Grid" not "Grid usage")
- **Break broad queries down** — for a Grid with paging, sorting, and filtering, make three separate calls
- Use the exact component name (e.g., `Grid`, `DatePicker`, `DropDownList`)
