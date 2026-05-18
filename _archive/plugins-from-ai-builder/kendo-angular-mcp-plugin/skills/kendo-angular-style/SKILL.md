---
name: kendo-angular-style
description: Generates CSS variables and custom themes for Kendo UI for Angular applications using the Kendo Design System. Use when the user wants to create a custom theme, change colors, update visual style, apply brand guidelines, or customize CSS variables. Trigger on "custom theme", "change colors", "apply brand", "CSS variables", "theme generation", "dark theme", "style assistant", "Kendo theme".
---

## Kendo UI for Angular — Style Assistant

### How to Apply Generated CSS Variables

After calling the tool, apply the generated CSS variables using one of the methods described in [application-methods.md](application-methods.md).

This skill owns the progressive disclosure decision for theme support files. Read [application-methods.md](application-methods.md) for every theming-focused use so downstream guidance can include the application method. Do not read unrelated component, layout, icon, validation, or accessibility files from this skill.

### Calling the Style Assistant

Use the `kendo_style_assistant` MCP tool to generate CSS variables for a custom Kendo theme based on a natural language description.

Preserve user-specified theme requirements exactly in the tool query. If the user provides colors, brand guidelines, or theme constraints, copy them verbatim into `query`, including:

- Hex values such as `#2563EB`.
- RGB/RGBA/HSL values such as `rgb(12, 34, 56)`.
- CSS variable names and values such as `--brand-primary: #0057B8`.
- Named roles such as primary, secondary, accent, success, warning, error, info, background, surface, text, border, or focus.
- Theme mode, contrast requirements, density, mood, typography notes, and palette constraints.

Do not paraphrase or normalize exact color requirements before calling the tool. For example, if the user says `primary color should be #2563EB`, the query must include `primary color should be #2563EB`, not just `blue primary color`.

**Tool call:**
```
kendo_style_assistant({
    query="<Natural language description of the desired visual style or theme>"
})
```

**Examples:**
```
kendo_style_assistant({
    query="Create a modern dark theme with high contrast and blue accents."
})
```

```
kendo_style_assistant({
    query="Apply our brand colors: primary #2563EB (blue), success #16A34A (green), error #DC2626 (red). Use a clean, minimal light theme."
})
```

```
kendo_style_assistant({
    query="Create a warm, earthy theme with orange as the primary color and a neutral background."
})
```

### After Retrieval

The tool returns CSS variable declarations. Apply them using one of the four methods in [application-methods.md](application-methods.md). **Method 1 (Global Styles) is recommended** for most cases.
