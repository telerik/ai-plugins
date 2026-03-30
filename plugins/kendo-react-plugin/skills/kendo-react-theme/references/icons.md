# KendoReact — Icons

## Priority: SVG Icons over Font Icons

**Required packages:**
- `@progress/kendo-svg-icons` — icon definitions
- `@progress/kendo-react-common` — contains `SvgIcon` component

## SVG Icon Usage (Preferred)
```tsx
import { SvgIcon } from "@progress/kendo-react-common";
import { paperclipIcon } from "@progress/kendo-svg-icons";

<SvgIcon icon={paperclipIcon} />
```

## Font Icon Usage (Fallback)
```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-font-icons/dist/index.css" />
```
```tsx
import { Icon } from "@progress/kendo-react-common";
<Icon name="paperclip" />
```

## Common Icons Reference

| Icon | Import Name | Purpose |
|------|-------------|---------|
| Add | `plusIcon` | Create actions |
| Remove | `minusIcon` | Remove actions |
| Edit | `pencilIcon` | Edit actions |
| Delete | `trashIcon` | Delete actions |
| Save | `saveIcon` | Save actions |
| Search | `searchIcon` | Search functionality |
| Filter | `filterIcon` | Filter functionality |
| Sort Asc | `sortAscIcon` | Sort ascending |
| Sort Desc | `sortDescIcon` | Sort descending |
| Chevron Up | `chevronUpIcon` | Navigation |
| Chevron Down | `chevronDownIcon` | Navigation |
| Chevron Left | `chevronLeftIcon` | Navigation |
| Chevron Right | `chevronRightIcon` | Navigation |
| Check | `checkIcon` | Confirmation |
| Close | `xIcon` | Cancel/Close |
