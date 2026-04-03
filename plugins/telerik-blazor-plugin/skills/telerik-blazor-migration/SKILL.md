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

## Reference Files

The `references/` directory contains self-populating mapping files for common source libraries:
- `references/mudblazor-mappings.md` — MudBlazor
- `references/radzen-mappings.md` — Radzen Blazor
- `references/syncfusion-mappings.md` — Syncfusion Blazor
- `references/common-pitfalls.md` — Cross-library gotchas

**Before migrating any component**: Check the relevant reference file for an existing mapping.
**After filling a gap via MCP tools**: Write the finding back to the reference file so future migrations benefit.
Reference files grow richer with each migration run.

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

## Infrastructure Migration (Blazor-Specific)

### Program.cs Service Registration
- Remove source library service registration:
  - MudBlazor: `builder.Services.AddMudServices()`
  - Radzen: `builder.Services.AddRadzenComponents()`
  - Syncfusion: `builder.Services.AddSyncfusionBlazor()`
  - Blazorise: `builder.Services.AddBlazorise(...).AddBootstrapProviders()`
- Add: `builder.Services.AddTelerikBlazor()`

### _Imports.razor Namespace Changes
- Remove source namespaces:
  - MudBlazor: `@using MudBlazor`
  - Radzen: `@using Radzen`, `@using Radzen.Blazor`
  - Syncfusion: `@using Syncfusion.Blazor`, `@using Syncfusion.Blazor.Grids`, etc.
  - Blazorise: `@using Blazorise`, `@using Blazorise.DataGrid`
- Add: `@using Telerik.Blazor` and `@using Telerik.Blazor.Components`

### Layout / TelerikRootComponent
- Add `<TelerikRootComponent>` wrapping `@Body` in `MainLayout.razor`
- Source library layout wrappers to remove/replace:
  - MudBlazor: `<MudLayout>`, `<MudAppBar>`, `<MudDrawer>`, `<MudMainContent>` → Telerik equivalents or plain HTML with Kendo CSS
  - Radzen: `<RadzenLayout>`, `<RadzenHeader>`, `<RadzenSidebar>`, `<RadzenBody>` → same approach

### Theme CSS/JS Import Placement
- **Blazor Web App (.NET 8+)**: Add to `App.razor` `<head>` section
- **Blazor Server (.NET 6/7)**: Add to `_Host.cshtml` or `_Layout.cshtml` `<head>` section
- **Blazor WASM standalone**: Add to `wwwroot/index.html` `<head>` section
- Telerik theme CSS path: `_content/Telerik.UI.for.Blazor/css/kendo-theme-default/all.css`
- Telerik JS interop: `_content/Telerik.UI.for.Blazor/js/telerik-blazor.js` (add before `</body>`)

### NuGet Source Configuration
- Create or update `nuget.config` to include the Telerik private NuGet feed:
  ```xml
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="telerik" value="https://nuget.telerik.com/v3/index.json" />
  </packageSources>
  ```
- Authentication: user must configure credentials via `dotnet nuget update source` or NuGet credential provider

## Cross-Cutting Pattern Migration

### Service Pattern Migration
- MudBlazor `IDialogService` (injected, imperative) → Telerik `<TelerikDialog>` (declarative, `@bind-Visible`), or Telerik `DialogFactory` for programmatic dialogs
- MudBlazor `ISnackbar` (injected, imperative) → Telerik `<TelerikNotification>` (component-based, call `.Show()` via `@ref`)
- Radzen `DialogService` → Telerik `<TelerikDialog>` or `<TelerikWindow>` with visibility binding
- Radzen `NotificationService` → Telerik `<TelerikNotification>`

### Form Handling
- MudBlazor `<MudForm>` / `<EditForm>` with `<MudTextField>` → `<EditForm>` with Telerik input components
- Radzen `<RadzenTemplateForm>` → standard Blazor `<EditForm>` with Telerik inputs
- Telerik inputs work natively with `EditForm` and `DataAnnotationsValidator`
- Validation: `DataAnnotations`, `FluentValidation` — keep existing validation library, just swap input components
- Two-way binding: Telerik uses `@bind-Value` consistently

### CSS Isolation
- Source library scoped CSS (`.razor.css`) targeting source component classes must be rewritten for Telerik class selectors
- Telerik components use `k-` prefixed CSS classes (same as KendoReact)
- Use `::deep` combinator in `.razor.css` files to target Telerik component internals

### JSInterop Dependencies
- Remove source library JS references:
  - MudBlazor: `_content/MudBlazor/MudBlazor.min.js`
  - Radzen: `_content/Radzen.Blazor/Radzen.Blazor.js`
- Add Telerik JS: `_content/Telerik.UI.for.Blazor/js/telerik-blazor.js`

### Components with No Direct Equivalent
When a source component has no Telerik Blazor equivalent:
1. **Compose from primitives** — build from Telerik atoms (TelerikButton, TelerikTextBox, TelerikPopup, etc.)
2. **Keep the third-party component** — if isolated, it can coexist with Telerik (document as a known exception)
3. **Build a custom Blazor component** — using standard Razor syntax styled to match Telerik theme
4. Flag in the migration report as "no direct equivalent — [approach taken]"

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

## Data Grid Deep Migration Protocol

This protocol is **automatically triggered** when the component inventory includes any grid or table component (matching names like `Grid`, `Table`, `DataGrid`, `DataTable`, `ListView`). Grids typically account for 40–60% of migration complexity and require dedicated analysis.

### Step 1: Source Grid Analysis (LLM-driven)

For each grid/table in the source project:
1. **Catalog column definitions** — field name, data type, width, header text, format, locked/frozen, resizable, reorderable
2. **Identify cell customization** — cell templates (`<Template>`, `<CellTemplate>`), conditional formatting, editable cells
3. **Detect enabled features** — sorting (client/server), filtering (client/server, filter row vs menu), paging (client/server, page size), grouping, column reordering, column resizing, virtual scrolling
4. **Assess data source** — local collection, server-side with `OnRead` event, OData, REST with manual pagination
5. **Selection model** — single row, multi-row, checkbox column, cell selection
6. **Edit mode** — inline, popup, incell, custom editor components (`<EditorTemplate>`)
7. **Export** — Excel, PDF, CSV
8. **Other features** — detail/hierarchy rows, column menu, toolbar, aggregate footers, frozen columns, drag & drop rows

### Step 2: Target Grid API Retrieval (tool-driven)

Call the `telerik_component_assistant` MCP tool for each feature detected in Step 1. Make separate calls:
- `TelerikGrid` — core parameters, data binding, `TItem`
- `GridColumn` — column definition parameters, `Field`, `Template`, `EditorTemplate`, `FilterCellTemplate`
- `TelerikGrid` events — `OnRead`, `OnEdit`, `OnUpdate`, `OnCreate`, `OnDelete`, `SelectedItemsChanged`
- `TelerikGrid` editing — inline, popup, incell edit modes, `OnUpdate`/`OnCreate`/`OnDelete`
- `TelerikGrid` export — `GridExcelExport`, `GridCommandButton` for export triggers
- `TelerikGrid` accessibility — ARIA roles, keyboard navigation

### Step 3: Feature Parity Checklist

Produce a table **before writing any code**:

| Feature | Source Implementation | Telerik API | Gap? | Workaround |
|---------|----------------------|-------------|------|------------|
| Column templates | `<CellTemplate>` | `<Template>` on `<GridColumn>` | No | — |
| Server-side paging | `LoadData` callback | `OnRead` event + `DataSourceResult` | Shape differs | Use `ToDataSourceResult()` |
| ... | ... | ... | ... | ... |

### Step 4: Escalation

If any feature has no target equivalent:
- Flag in the migration report with severity (Critical / Major / Minor)
- Propose a workaround (custom template, post-processing, external library)
- If Critical, pause and ask the user before proceeding

---

## Migration Wave Strategy

When migrating an entire project, order components by dependency and risk.
For incremental migrations, organize waves by page/feature instead of component type.

### Full Migration Wave Order

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

### Incremental Migration Wave Order

For incremental (page-by-page) migrations:

**Wave 0 — Coexistence Setup:**
- Install Telerik NuGet alongside the source library
- Register `AddTelerikBlazor()` in addition to source service registration
- Add `<TelerikRootComponent>` in layout (wraps everything — does not conflict with source)
- Add Telerik namespaces to `_Imports.razor` while keeping source namespaces
- Load both theme CSS files
- Verify both libraries render correctly on the same page

**Waves 1–N — Per-page/feature migration:**
- Each wave targets one page or feature boundary
- Migrate all components on that page from source to Telerik
- Remove source `@using` directives from migrated files only (keep global `_Imports.razor` unchanged)
- Verify the page in isolation and in the context of the full app

**Graduation Wave (when user requests):**
- Remove source library NuGet packages, service registration, and CSS imports
- Remove source namespaces from `_Imports.razor`
- Consolidate to single Telerik theme
- Run full test suite

## Key Principles

**One wave at a time.** Never migrate everything at once. Complete and verify each wave.

**Preserve behavior.** The migrated component must behave identically to the original.
Data binding, events, and user interactions must work the same way.

**Test after each wave.** Run all available tests and verify the UI.

**Check reference files first.** Before migrating a source component, check `references/{source-library}-mappings.md`. Use existing mappings where available. When you fill a gap via MCP tools, write the finding back to the reference file so future migrations benefit.
