---
name: telerik-blazor-style
description: Generates CSS variables and custom themes for Telerik UI for Blazor applications using the Kendo Design System. Use when the user wants to create a custom theme, change colors, update visual style, apply brand guidelines, or customize CSS variables. Trigger on "custom theme", "change colors", "apply brand", "CSS variables", "theme generation", "dark theme", "style assistant", "Kendo theme".
---

## Telerik UI for Blazor — Style Assistant

### How to Apply Generated CSS Variables

After calling the tool, apply the generated CSS variables using one of the methods described in [application-methods.md](application-methods.md).

### Calling the Style Assistant

Use the `telerik_style_assistant` MCP tool to generate CSS variables for a custom Kendo theme based on a natural language description.

**Tool call:**
```
telerik_style_assistant({
    prompt="<Natural language description of the desired visual style or theme>"
})
```

**Examples:**
```
telerik_style_assistant({
    prompt="Create a modern dark theme with high contrast and blue accents."
})
```

```
telerik_style_assistant({
    prompt="Apply our brand colors: primary #2563EB (blue), success #16A34A (green), error #DC2626 (red). Use a clean, minimal light theme."
})
```

```
telerik_style_assistant({
    prompt="Create a warm, earthy theme with orange as the primary color and a neutral background."
})
```

### After Retrieval

The tool returns CSS variable declarations. Apply them using one of the four methods in [application-methods.md](application-methods.md). **Method 1 (Global CSS) is recommended** for most cases.
