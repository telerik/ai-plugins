---
name: kendo-react-accessibility
description: Retrieves accessibility guidance for KendoReact components including WCAG 2.2 Level AA guidelines and component-specific ARIA, keyboard navigation, and focus management information. Use when implementing accessible KendoReact components, auditing for accessibility compliance, or needing WCAG guidance.
---

## KendoReact — Accessibility Assistant

### WCAG 2.2 Level AA Guidelines

For foundational WCAG 2.2 Level AA guidelines, read [wcag-guidelines.md](wcag-guidelines.md). These apply to all components throughout implementation.

Narrow component-specific lookup exception: when general WCAG guidance is already supplied by the broader workflow and only component-specific facts are needed, do **not** read [wcag-guidelines.md](wcag-guidelines.md). Use component-specific assistant results with `includeGeneralGuidelines=false`.

### Calling the Accessibility Assistant

Use the `kendo_accessibility_assistant` MCP tool to retrieve component-specific accessibility guidance. Always pass `includeGeneralGuidelines=false` — the WCAG guidelines are already loaded from the file above and are never returned by the tool in this configuration.

**Tool call:**
```
kendo_accessibility_assistant({
    query="<Specific accessibility question about the component>",
    component="<ComponentName>",
    includeGeneralGuidelines=false
})
```

**Examples:**
```
kendo_accessibility_assistant({
    query="What ARIA attributes, keyboard navigation, and screen reader support does the Grid provide?",
    component="DataGrid",
    includeGeneralGuidelines=false
})
```

```
kendo_accessibility_assistant({
    query="How to ensure the DatePicker is accessible with keyboard navigation and proper labels?",
    component="DatePicker",
    includeGeneralGuidelines=false
})
```

```
kendo_accessibility_assistant({
    query="How to add labels associated with individual inputs?",
    component="Form",
    includeGeneralGuidelines=false
})
```

### Query Guidelines

- One component per call
- `Grid` is an alias for `DataGrid` — use `DataGrid` as the component name
- Focus on specific aspects: ARIA attributes, keyboard navigation, focus management, screen reader behavior
- Apply findings alongside the foundational rules in [wcag-guidelines.md](wcag-guidelines.md)
