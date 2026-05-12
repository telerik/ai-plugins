---
name: telerik-blazor-component
description: Retrieves documentation, API reference, and code examples for Telerik UI for Blazor components. Use when the user asks about a specific Telerik component, needs API reference, asks how to use a component, wants code examples, or mentions component names like TelerikGrid, TelerikChart, TelerikScheduler, TelerikDatePicker, TelerikDropDownList, TelerikForm, TelerikButton, TelerikDialog, etc. Trigger on "how do I use", "what parameters does", "Telerik component example", "Telerik component docs", "/telerik", "/ask_telerik", "@telerik". One call per component — do not batch multiple components into one query.
---

## Telerik UI for Blazor — Component Assistant

### Common Guidelines

Before implementing any component, read [common-guidelines.md](common-guidelines.md) for the foundational rules that apply to every Telerik Blazor implementation (NuGet setup, TelerikRootComponent, attribute splatting).

### Calling the Component Assistant

Use the `telerik_component_assistant` MCP tool to retrieve accurate API reference and documentation for any Telerik UI for Blazor component.

**Tool call:**
```
telerik_component_assistant({
    query="<Specific question about the component and the feature you need>",
    component="<ComponentName>"  // e.g. Grid, Chart, Form, DatePicker, DropDownList, etc.
})
```

**Examples:**
```
telerik_component_assistant({
    query="How to configure paging and sorting in the Grid?",
    component="Grid"
})
```

```
telerik_component_assistant({
    query="What parameters does DatePicker expose for two-way binding and value change events?",
    component="DatePicker"
})
```

```
telerik_component_assistant({
    query="How to use DropDownList with a custom data source and value field?",
    component="DropDownList"
})
```

### Query Guidelines

- **One component per call.** Never batch multiple components into one query. Make separate calls for each component.
- **One topic per query.** Split multi-topic requests into separate calls:
  - Parameters → one call
  - Events → one call
  - Templates / RenderFragments → one call
  - Data binding → one call
  - Filtering / sorting / paging → one call
- **Be specific.** "Grid with filtering and virtual scrolling" is better than "Grid features".
- **Use the exact component name** in the `component` parameter (e.g., `Grid`, `Chart`, `Form`, `DatePicker`).

### After Retrieval

Apply the response alongside the rules in [common-guidelines.md](common-guidelines.md):
- Use only `Telerik.UI.for.Blazor` components
- No attribute splatting on Telerik components
- Always ensure `TelerikRootComponent` wraps the app layout
- Validate any generated code with `telerik_validator_assistant`
