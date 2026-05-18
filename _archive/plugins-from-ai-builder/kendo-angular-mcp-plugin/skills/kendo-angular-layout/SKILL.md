---
name: kendo-angular-layout
description: Retrieves Kendo Design System CSS utility classes for building layouts in Kendo UI for Angular applications. Use when the user wants to build a page layout, create sections, add spacing, use flexbox/grid utilities, structure a dashboard, or needs layout-related CSS classes. Trigger on "build layout", "add spacing", "flexbox utilities", "grid layout", "Kendo CSS utils", "layout structure", "responsive layout", "page sections". Always call before writing custom CSS for layout purposes.
---

## Kendo UI for Angular — Layout Assistant

### Setup (mandatory)

You **MUST** `read_file` on [layout-conventions.md](layout-conventions.md) as part of loading this skill. It is not optional and not "read it if you need to" — every consumer of this skill requires its contents for setup, prerequisites, sizing rules, and ready-to-use layout components. Load it in the same parallel batch as this SKILL.md.

This skill owns the progressive disclosure decision for layout support files. Read [layout-conventions.md](layout-conventions.md) for every layout-focused use. Read [../kendo-angular-orchestrator/ux-guidelines.md](../kendo-angular-orchestrator/ux-guidelines.md) only when the current request or follow-up notes ask for a full page, section composition, dashboard/application layout, visual hierarchy, or UX polish. Do not read unrelated component, icon, theme, validation, or accessibility files from this skill.

### CSS prerequisite (always required when using `k-*` utility classes)

Kendo Design System utility classes (`k-d-flex`, `k-gap-*`, `k-p-*`, `k-grid-cols-*`, etc.) only render when the `@progress/kendo-theme-utils` CSS package is referenced in the project. This prerequisite is **always required** whenever this skill is consumed — there is no scenario where layout utilities work without it.

When relaying this skill's output to downstream consumers, copy the following Prerequisites block verbatim:

```
Prerequisites:
- @progress/kendo-theme-utils MUST be referenced exactly once in the project. Use the project's existing Kendo theme import mechanism (angular.json `styles` array, SCSS `@use`, or CDN `<link>`). See layout-conventions.md "Setting up Styles/CSS" for the exact snippets per mechanism.
- Verification: at least one occurrence of `@progress/kendo-theme-utils` must exist across `angular.json`, `**/styles.{scss,css}`, or `**/index.html`. Zero occurrences = missing prerequisite.
```

### Calling the Layout Assistant

Use the `kendo_layout_assistant` MCP tool to retrieve Kendo Design System CSS utility classes relevant to your layout requirements.

**Tool call:**
```
kendo_layout_assistant({
    prompt="<Detailed description of the layout: sections, structure, responsive needs, component types>",
    includeBuildingBlockExamples=true  // Set to true to include example building blocks
})
```

**Examples:**
```
kendo_layout_assistant({
    prompt="Provide Kendo Design System utility classes for a dashboard layout with a header, sidebar navigation, main content area with cards, and a footer. Needs to be responsive across mobile and desktop.",
    includeBuildingBlockExamples=true
})
```

```
kendo_layout_assistant({
    prompt="Provide Kendo Design System utility classes to make a 3-column card grid responsive — stacked on mobile, 2 columns on tablet, 3 columns on desktop."
})
```

### Query Guidelines

- **Be descriptive.** Include all sections (header, sidebar, content area, footer), the component types used, and responsive requirements.
- **One layout call per major section** if sections have different requirements.
- Always call this tool **before** writing custom CSS for layout — the utility classes cover most layout scenarios.
- For responsive adjustments, make a separate call with the responsive requirements described.
- Check [layout-conventions.md](layout-conventions.md) for Angular-specific rules (e.g., `min-width: 0` on flex children, explicit `[height]` binding for Grid and Chart).
