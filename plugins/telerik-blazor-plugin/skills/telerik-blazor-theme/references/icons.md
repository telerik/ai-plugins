# Telerik UI for Blazor — Icons

## Icon Name Convention

Icon names from the Progress Design System Kit are in kebab-case (e.g., `volume-mute`), but when using them in Blazor, you must convert them to PascalCase (e.g., `VolumeMute`). Always use PascalCase for icon names in Blazor components.

## Required Namespaces

```razor
@using Telerik.SvgIcons
@using Telerik.FontIcons
```

These should already be in `_Imports.razor` if the project was set up correctly.

## SVG Icon Usage (Preferred)

```razor
<TelerikSvgIcon Icon="@SvgIcon.Paperclip" />
```

Or via a component's `Icon` parameter:

```razor
<TelerikButton Icon="@SvgIcon.Save">Save</TelerikButton>
```

## Font Icon Usage (Fallback)

```razor
<TelerikFontIcon Icon="@FontIcon.Paperclip" />
```

## Common Icons Reference

| Icon | SVG Name | Purpose |
|------|----------|---------|
| Add | `SvgIcon.Plus` | Create actions |
| Remove | `SvgIcon.Minus` | Remove actions |
| Edit | `SvgIcon.Pencil` | Edit actions |
| Delete | `SvgIcon.Trash` | Delete actions |
| Save | `SvgIcon.Save` | Save actions |
| Search | `SvgIcon.Search` | Search functionality |
| Filter | `SvgIcon.Filter` | Filter functionality |
| Sort Asc | `SvgIcon.SortAsc` | Sort ascending |
| Sort Desc | `SvgIcon.SortDesc` | Sort descending |
| Chevron Up | `SvgIcon.ChevronUp` | Navigation |
| Chevron Down | `SvgIcon.ChevronDown` | Navigation |
| Chevron Left | `SvgIcon.ChevronLeft` | Navigation |
| Chevron Right | `SvgIcon.ChevronRight` | Navigation |
| Check | `SvgIcon.Check` | Confirmation |
| Close | `SvgIcon.X` | Cancel/Close |
