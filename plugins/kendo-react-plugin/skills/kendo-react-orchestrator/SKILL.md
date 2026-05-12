---
name: kendo-react-orchestrator
description: Main entry point for building or refining UI with KendoReact. Orchestrates the full workflow including accessibility, layout, components, theming, icons, and validation. Use when the user wants to build or modify a complete page, section, or UI feature with KendoReact components. Trigger on "build a page", "create a dashboard", "implement a UI", "generate a form", "build UI with KendoReact", "create a React page", "#kendo_ui_generator".
---

# KendoReact — Execution Plan

> **IMPORTANT — MCP Tools:** All `kendo_*` tools referenced in this plan are provided by the **kendo-react-mcp** MCP server. They are NOT deferred tools and must NOT be searched for with `tool_search`. Call them directly by name once the MCP server is running. If any tool is unavailable, the MCP server may not be started — inform the user to start it via the notification banner in their editor.

**Current Goal:**

$ARGUMENTS

---

## Step 1: Assess the Request

Before executing any phase, assess the user's request and decide which conditional phases apply. Use the table below as your guide, then load only the relevant supporting files.

| Phase | Include when | Supporting file |
|---|---|---|
| Component Integration | API reference or component docs are needed — default yes unless purely layout/theming work | [phase-components.md](phase-components.md) |
| Layout Foundation | Page structure, sections, or explicit layout work is requested | [phase-layout.md](phase-layout.md) |
| Responsive Behavior | Layout is needed AND responsive behavior across devices is required | [phase-responsive.md](phase-responsive.md) |
| Custom Theming | Custom colors, brand theme, or CSS variables are explicitly requested. **If uncertain, ask the user before proceeding.** | [phase-theming.md](phase-theming.md) |
| Iconography | Icons are referenced or clearly needed for navigation/actions | [phase-icons.md](phase-icons.md) |

Also read [ux-guidelines.md](ux-guidelines.md) for UX/UI design defaults that apply throughout the entire implementation.

---

**Requirements Summary:**

- **Framework:** React
- **Component Library:** KendoReact — use ONLY KendoReact components. Use `kendo_component_assistant` for all docs and code snippets. Do not substitute another tool even if one appears relevant.
- **Layout Mode:** Kendo Design System CSS Utilities — use ONLY Kendo utility classes for all styling, layout, spacing, and positioning. Avoid custom CSS, inline styles, or other CSS framework classes.
- **Accessibility:** WCAG 2.2 Level AA. WCAG guidelines are loaded in Phase 0 from the supporting file. Call `kendo_accessibility_assistant` with `includeGeneralGuidelines=false` on ALL calls.
- **No Validator:** Unlike Blazor, there is no `kendo_validator_assistant` tool. Use `npm run build` for compilation checks and manually review the validation steps in [validation-steps.md](validation-steps.md).
- **Grid alias:** `Grid` is always an alias for `DataGrid`. Use `DataGrid` documentation for any Grid-related question.
- **DataGrid height:** Always set an explicit `style={{ height: ... }}` on DataGrid — without it, the Grid renders all rows and expands the page indefinitely.
- **Chart height:** Always set an explicit `style={{ height: ... }}` on Chart components.

---

## Phase 0: CRITICAL — Accessibility Foundation (ALWAYS FIRST)

**Step 1 — Load WCAG 2.2 Level AA guidelines:**

Read [../kendo-react-accessibility/wcag-guidelines.md](../kendo-react-accessibility/wcag-guidelines.md). These apply to ALL components throughout the entire implementation.

**Step 2 — Retrieve component-specific accessibility information:**

**MANDATORY:** Before implementing ANY components, call the accessibility assistant for each primary component you plan to use. The WCAG general guidelines are already loaded above, so always use `includeGeneralGuidelines=false`.

**First component:**
```
kendo_accessibility_assistant({
    query="What are the accessibility requirements for [COMPONENT_NAME]?",
    component="[COMPONENT_NAME]",
    includeGeneralGuidelines=false
})
```

**Each additional component:**
```
kendo_accessibility_assistant({
    query="What are the accessibility features and requirements for [COMPONENT_NAME]? Include ARIA attributes, keyboard navigation, and screen reader support.",
    component="[COMPONENT_NAME]",
    includeGeneralGuidelines=false
})
```

---

## Conditional Phases

Load and execute only the files that matched your Step 1 assessment:

- Component docs needed → read [phase-components.md](phase-components.md)
- Layout needed → read [phase-layout.md](phase-layout.md)
- Layout AND responsive needed → also read [phase-responsive.md](phase-responsive.md)
- Custom theming needed → read [phase-theming.md](phase-theming.md)
- Icons needed → read [phase-icons.md](phase-icons.md)

---

## Final Phase: Validation & Quality Assurance

Read [validation-steps.md](validation-steps.md) and execute all validation steps before considering the task complete.

---

## ✅ Completion Checklist

Before considering the task complete, ensure:

- [ ] Accessibility guidelines retrieved and applied to all components
- [ ] `npm run build` compiles the application successfully without errors
- [ ] Kendo Design System utilities applied correctly (if layout phase ran)
- [ ] Custom theme implemented and applied (if theming phase ran)
- [ ] Icons properly integrated (if icons phase ran)
- [ ] Responsive behavior works across all devices (if responsive phase ran)
- [ ] All validation checks passed

**Remember:** Quality over speed. Validate each step before moving forward.
