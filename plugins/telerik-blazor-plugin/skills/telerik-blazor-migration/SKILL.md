---
name: telerik-blazor-migration
description: >
  Use this skill when the user wants to migrate a project from any UI component library
  to Telerik UI for Blazor, or needs guidance on mapping components from third-party
  libraries to their Telerik Blazor equivalents. Trigger when the user mentions migrating
  from MudBlazor, Radzen, Syncfusion Blazor, Blazorise, MatBlazor, or any other Blazor UI
  framework to Telerik UI for Blazor, or phrases like "migrate to Telerik Blazor", "replace
  MudBlazor with Telerik", "convert my app to use Telerik", "switch from Radzen to Telerik",
  "move to Telerik UI for Blazor", "rewrite using Telerik components", or "how do I replace
  [library] with Telerik Blazor". Also trigger when the user asks about component equivalents
  between a third-party library and Telerik Blazor during an active migration.
---

## Purpose

This skill teaches how to migrate Blazor applications from other UI component libraries
to Telerik UI for Blazor — providing component mapping, parameter translation, event
conversion guidance, and wave-based migration strategy grounded in the actual
Telerik Blazor API.

## Supported Source Libraries

| Source Library | NuGet Package |
|---------------|---------------|
| MudBlazor | `MudBlazor` |
| Radzen | `Radzen.Blazor` |
| Syncfusion Blazor | `Syncfusion.Blazor` |
| Blazorise | `Blazorise` |
| MatBlazor | `MatBlazor` |
| AntDesign Blazor | `AntDesign` |

## Component Mapping Process

### 1. Identify source components

Scan the source project to build a complete inventory:
```bash
grep -rn "MudBlazor\|Radzen\|Syncfusion.Blazor\|Blazorise\|MatBlazor\|AntDesign" --include="*.razor" --include="*.cs" -l
```

For each unique component, record: component name, source package, files where used, parameters passed, events handled.

### 2. Map to Telerik equivalents

For each source component, determine its Telerik Blazor equivalent and retrieve the
authoritative API. Build a mapping table:

| Source Component | Source Package | Telerik Equivalent | Complexity |
|-----------------|---------------|-------------------|------------|
| (discovered) | (discovered) | (from API context) | Simple / Moderate / Complex |

**Complexity ratings:**
- **Simple**: 1:1 parameter mapping, minimal behavioral difference
- **Moderate**: Different parameter names, event signatures, or binding patterns
- **Complex**: Significant API differences, custom rendering logic, or no direct equivalent

### 3. Build migration spec per component

For each component, build a parameter-by-parameter and event-by-event translation
using the authoritative component API. Cover:
- Parameters with types and defaults
- Event handler signatures and EventArgs shapes
- RenderFragment/template patterns
- Accessibility requirements (ARIA, keyboard nav)
- Icon mappings

## Common Component Mappings

### MudBlazor → Telerik Blazor

| Source (MudBlazor) | Telerik Blazor |
|-------------------|----------------|
| `<MudDataGrid>` | `<TelerikGrid>` |
| `<MudTable>` | `<TelerikGrid>` |
| `<MudTextField>` | `<TelerikTextBox>` |
| `<MudSelect>` | `<TelerikDropDownList>` |
| `<MudAutocomplete>` | `<TelerikAutoComplete>` |
| `<MudDatePicker>` | `<TelerikDatePicker>` |
| `<MudButton>` | `<TelerikButton>` |
| `<MudDialog>` | `<TelerikDialog>` |
| `<MudChart>` | `<TelerikChart>` |
| `<MudDrawer>` | `<TelerikDrawer>` |
| `<MudTabs>` | `<TelerikTabStrip>` |
| `<MudTreeView>` | `<TelerikTreeView>` |
| `<MudMenu>` | `<TelerikMenu>` |
| `<MudSwitch>` | `<TelerikSwitch>` |
| `<MudCheckBox>` | `<TelerikCheckBox>` |

### Radzen → Telerik Blazor

| Source (Radzen) | Telerik Blazor |
|----------------|----------------|
| `<RadzenDataGrid>` | `<TelerikGrid>` |
| `<RadzenTextBox>` | `<TelerikTextBox>` |
| `<RadzenDropDown>` | `<TelerikDropDownList>` |
| `<RadzenDatePicker>` | `<TelerikDatePicker>` |
| `<RadzenButton>` | `<TelerikButton>` |
| `<RadzenDialog>` | `<TelerikDialog>` |
| `<RadzenChart>` | `<TelerikChart>` |
| `<RadzenScheduler>` | `<TelerikScheduler>` |

## Migration Wave Strategy

When migrating an entire project, order components by dependency and risk:

**Wave 0 — Foundation:**
- Install Telerik, configure services, add TelerikRootComponent, import theme

**Wave 1 — Leaf components (lowest risk):**
- Buttons, inputs, checkboxes, switches
- Simple display components (badges, icons)

**Wave 2 — Form components:**
- Text fields, dropdowns, date pickers, multi-selects
- Form wrapper and validation

**Wave 3 — Layout components:**
- Navigation (drawer, menu, tabs, breadcrumbs)
- Cards, panels
- Page layout structure

**Wave 4 — Complex data components:**
- Data grids (most complex, highest risk)
- Tree views
- Schedulers / calendars

**Wave 5 — Overlay components:**
- Dialogs, modals, confirmations
- Notifications, toasts
- Tooltips, popovers

**Wave 6 — Charts and visualization:**
- Charts, sparklines, gauges

**Wave 7 — Testing and verification:**
- Unit tests for every migrated component
- Accessibility tests for all interactive components

**Wave 8 — Cleanup:**
- Remove source library packages and CSS imports
- Verify zero non-Telerik imports remain
- Final quality review

## Key Principles

**One wave at a time.** Never migrate everything at once. Complete and verify each wave.

**Preserve behavior.** The migrated component must behave identically to the original.
Data binding, events, and user interactions must work the same way.

**Test after each wave.** Run all available tests and verify the UI.
