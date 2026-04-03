# Radzen Blazor → Telerik UI for Blazor Component Mappings

> **Self-populating reference**: When migrating from Radzen, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| Radzen Component | Telerik Equivalent | Complexity | Notes |
|-----------------|-------------------|------------|-------|
| `<RadzenDataGrid>` | `<TelerikGrid>` | Complex | See data-grid protocol |
| `<RadzenTextBox>` | `<TelerikTextBox>` | Simple | |
| `<RadzenNumeric>` | `<TelerikNumericTextBox>` | Simple | |
| `<RadzenDropDown>` | `<TelerikDropDownList>` | Moderate | |
| `<RadzenAutoComplete>` | `<TelerikAutoComplete>` | Moderate | |
| `<RadzenDatePicker>` | `<TelerikDatePicker>` | Moderate | |
| `<RadzenButton>` | `<TelerikButton>` | Simple | |
| `<RadzenDialog>` | `<TelerikDialog>` | Moderate | |
| `<RadzenChart>` | `<TelerikChart>` | Complex | |
| `<RadzenScheduler>` | `<TelerikScheduler>` | Complex | |
| `<RadzenTabs>` | `<TelerikTabStrip>` | Moderate | |
| `<RadzenTree>` | `<TelerikTreeView>` | Complex | |
| `<RadzenMenu>` | `<TelerikMenu>` | Moderate | |
| `<RadzenCheckBox>` | `<TelerikCheckBox>` | Simple | |
| `<RadzenSwitch>` | `<TelerikSwitch>` | Simple | |
| `<RadzenSlider>` | `<TelerikSlider>` | Simple | |
| `<RadzenProgressBar>` | `<TelerikProgressBar>` | Simple | |
| `<RadzenBreadCrumb>` | `<TelerikBreadcrumb>` | Simple | |
| `<RadzenUpload>` | `<TelerikUpload>` | Moderate | |
| `<RadzenPager>` | `<TelerikPager>` | Simple | |
| `<RadzenSplitter>` | `<TelerikSplitter>` | Moderate | |
| `<RadzenPanelMenu>` | `<TelerikPanelBar>` | Moderate | |
| `<RadzenTooltip>` | `<TelerikTooltip>` | Simple | |

## Parameter Mapping Examples

> Fill these in as you migrate.

### RadzenDataGrid → TelerikGrid
| Radzen Parameter | Telerik Parameter | Type Change | Notes |
|-----------------|------------------|-------------|-------|
| `Data` | `Data` | same | |
| `LoadData` | `OnRead` event | `LoadDataArgs` → `GridReadEventArgs` | Different event model |
| `Count` | via `GridReadEventArgs.Total` | int → event property | |
| `AllowSorting` | `Sortable` | same | |
| `AllowFiltering` | `FilterMode` | bool → enum | `FilterMode.FilterRow` or `FilterMode.FilterMenu` |
| `AllowPaging` | `Pageable` | same | |
| `PageSize` | `PageSize` | same | |
| | | | |

## Service Migration

| Radzen Service | Telerik Equivalent | Pattern Change |
|---------------|-------------------|----------------|
| `DialogService.OpenAsync<T>()` | `<TelerikDialog @bind-Visible>` or `<TelerikWindow>` | Imperative → declarative |
| `NotificationService.Notify()` | `<TelerikNotification @ref>` + `.Show()` | Injected → component ref |
| `TooltipService` | `<TelerikTooltip>` component | Service → component |

## Event Mapping Examples

> Fill these in as you migrate.

| Radzen Event | Telerik Event | Payload Change | Notes |
|-------------|--------------|----------------|-------|
| | | | |
