---
name: kendo-react-icon
description: Searches for icons in the KendoReact icon library. Use when the user needs an icon for a specific action, concept, or UI element, or asks about available icons. Trigger on "find icon", "what icon", "icon for", "search icons", "Kendo icons", "SVG icon", "icon library", or when implementing icon-only buttons, decorative icons, or navigation icons.
---

## KendoReact — Icon Assistant

### Progressive Disclosure

This skill owns the full icon lookup policy. Do not read additional reference files for icons. Make one `kendo_icon_assistant` call that covers all requested icon slots in the current request or follow-up notes. Set `limit` based on slot count: 1-3 slots -> `0.3`, 4-8 slots -> `0.5`, 9+ slots -> `1.0`.

### Calling the Icon Assistant

Use the `kendo_icon_assistant` MCP tool to search for icons by name, purpose, or keyword.

**Tool call:**
```
kendo_icon_assistant({
    query="<Description of the icon purpose or keyword>",
    limit=0.3  // Adjust based on expected count: 0.1 for ~1 icon, 0.3 for a few icons, 1.0 for many
})
```

**Examples:**
```
kendo_icon_assistant({
    query="save document",
    limit=0.3
})
```

```
kendo_icon_assistant({
    query="user profile avatar account",
    limit=0.3
})
```

```
kendo_icon_assistant({
    query="navigation arrow chevron",
    limit=0.5
})
```

### Using Icons in React

**Prioritize SVG icons over font icons.**

#### SVG Icons (Recommended)

Ensure the required packages are installed:

```bash
npm install @progress/kendo-svg-icons @progress/kendo-react-common
```

```tsx
import { SvgIcon } from "@progress/kendo-react-common";
import { paperclipIcon } from "@progress/kendo-svg-icons";

function App() {
  return (
    <SvgIcon icon={paperclipIcon} />
  );
}
```

Icon names returned by the tool are in **camelCase** with an `Icon` suffix (e.g., `paperclipIcon`, `chevronDownIcon`). Use them directly as imports from `@progress/kendo-svg-icons`.

You can also call `kendo_component_assistant` for the `SvgIcon` component for full API reference and docs.

#### Font Icons (Fallback)

If SVG is not an option, add the font icons CSS reference:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-font-icons/dist/index.css" />
```

```tsx
import { Icon } from "@progress/kendo-react-common";

function App() {
  return (
    <Icon name="paperclip" />
  );
}
```

You can call `kendo_component_assistant` for the `Icon` component for font icon API reference.

### Common Icon Reference

Frequently used icons from `@progress/kendo-svg-icons`:

| Purpose | Import name |
|---|---|
| Add/create | `plusIcon` |
| Remove | `minusIcon` |
| Edit | `pencilIcon` |
| Delete | `trashIcon` |
| Save | `saveIcon` |
| Search | `searchIcon` |
| Filter | `filterIcon` |
| Sort ascending | `sortAscIcon` |
| Sort descending | `sortDescIcon` |
| Navigate up/down/left/right | `chevronUpIcon`, `chevronDownIcon`, `chevronLeftIcon`, `chevronRightIcon` |
| Confirm | `checkIcon` |
| Cancel | `xIcon` |
