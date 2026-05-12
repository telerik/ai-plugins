---
name: telerik-blazor-accessibility
description: Retrieves accessibility guidance for Telerik UI for Blazor components including WCAG 2.2 Level AA guidelines and component-specific ARIA, keyboard navigation, and focus management information. Use when implementing accessible Telerik Blazor components, auditing for accessibility compliance, or needing WCAG guidance.
---

## Telerik UI for Blazor — Accessibility Assistant

### WCAG 2.2 Level AA Guidelines

For foundational WCAG 2.2 Level AA guidelines, read [wcag-guidelines.md](wcag-guidelines.md). These apply to all components throughout implementation.

### Calling the Accessibility Assistant

Use the `telerik_accessibility_assistant` MCP tool to retrieve component-specific accessibility guidance. Always pass `includeGeneralGuidelines=false` — the WCAG guidelines are already loaded from the file above and are never returned by the tool in this configuration.

**Tool call:**
```
telerik_accessibility_assistant({
    query="<Specific accessibility question about the component>",
    component="<ComponentName>",
    includeGeneralGuidelines=false
})
```

**Examples:**
```
telerik_accessibility_assistant({
    query="What ARIA attributes, keyboard navigation, and screen reader support does the Grid provide?",
    component="Grid",
    includeGeneralGuidelines=false
})
```

```
telerik_accessibility_assistant({
    query="How to ensure the DatePicker is accessible with keyboard navigation and proper labels?",
    component="DatePicker",
    includeGeneralGuidelines=false
})
```

```
telerik_accessibility_assistant({
    query="How to add labels associated with individual inputs?",
    component="Form",
    includeGeneralGuidelines=false
})
```

### Query Guidelines

- One component per call
- Focus on specific aspects: ARIA attributes, keyboard navigation, focus management, screen reader behavior
- Apply findings alongside the foundational rules in [wcag-guidelines.md](wcag-guidelines.md)
