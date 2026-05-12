---
name: telerik-blazor-icon
description: Searches for icons in the Telerik UI for Blazor icon library. Use when the user needs an icon for a specific action, concept, or UI element, or asks about available icons. Trigger on "find icon", "what icon", "icon for", "search icons", "Telerik icons", "Kendo icons", "SVG icon", "icon library", or when implementing icon-only buttons, decorative icons, or navigation icons.
---

## Telerik UI for Blazor — Icon Assistant

### Calling the Icon Assistant

Use the `telerik_icon_assistant` MCP tool to search for icons by name, purpose, or keyword.

**Tool call:**
```
telerik_icon_assistant({
    query="<Description of the icon purpose or keyword>",
    limit=0.3  // Adjust based on expected count: 0.1 for ~1 icon, 0.3 for a few icons, 1.0 for many
})
```

**Examples:**
```
telerik_icon_assistant({
    query="save document",
    limit=0.3
})
```

```
telerik_icon_assistant({
    query="user profile avatar account",
    limit=0.3
})
```

```
telerik_icon_assistant({
    query="navigation arrow chevron",
    limit=0.5
})
```

### Using Icons in Blazor — Naming Convention

Icon names returned by the tool are in **kebab-case** (e.g., `volume-mute`), but when using them in Blazor, you must convert them to **PascalCase** (e.g., `VolumeMute`).

Always use PascalCase for icon names in Blazor components when using existing icons from the Progress Design System Kit.

**Example:**
```razor
@* Icon returned by tool: "volume-mute" → use as: SvgIcon.VolumeMute *@
<TelerikSvgIcon Icon="@SvgIcon.VolumeMute" />

@* Icon returned by tool: "user" → use as: SvgIcon.User *@
<TelerikSvgIcon Icon="@SvgIcon.User" />
```
