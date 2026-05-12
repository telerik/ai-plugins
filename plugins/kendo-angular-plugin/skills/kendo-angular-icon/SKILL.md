---
name: kendo-angular-icon
description: Searches for icons in the Kendo UI for Angular icon library. Use when the user needs an icon for a specific action, concept, or UI element, or asks about available icons. Trigger on "find icon", "what icon", "icon for", "search icons", "Kendo icons", "SVG icon", "icon library", or when implementing icon-only buttons, decorative icons, or navigation icons.
---

## Kendo UI for Angular — Icon Assistant

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

### Using Icons in Angular

**Prioritize SVG icons over font icons.**

#### SVG Icons (Recommended)

Ensure the required packages are installed:

```bash
npm install @progress/kendo-svg-icons @progress/kendo-angular-icons
```

Use the `kendo-svg-icon` component with `KENDO_ICONS` from `@progress/kendo-angular-icons`:

```typescript
import { Component } from "@angular/core";
import { KENDO_ICONS } from "@progress/kendo-angular-icons";
import { paperclipIcon } from "@progress/kendo-svg-icons";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [KENDO_ICONS],
  template: `
    <kendo-svg-icon [icon]="icons.paperclip"></kendo-svg-icon>
  `,
})
export class AppComponent {
  public icons = { paperclip: paperclipIcon };
}
```

You can also call `kendo_component_assistant` for the `SVGIcon` component to get full API reference and docs:

```
kendo_component_assistant({
    query="How to use the SVGIcon component with custom icons and size options?",
    component="SVGIcon"
})
```

#### Font Icons (Fallback)

If SVG is not an option, use font icons. Add the font icon stylesheet to `index.html`:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-font-icons/dist/index.css" />
```

```typescript
import { Component } from "@angular/core";
import { KENDO_ICONS } from "@progress/kendo-angular-icons";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [KENDO_ICONS],
  template: `
    <kendo-icon name="paperclip"></kendo-icon>
  `,
})
export class AppComponent {}
```

Call `kendo_component_assistant` for the `Icon` component to get full API reference and docs:

```
kendo_component_assistant({
    query="How to use the Icon component with font icons?",
    component="Icon"
})
```
