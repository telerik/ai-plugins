# Syncfusion Blazor → Telerik UI for Blazor Component Mappings

> **Self-populating reference**: When migrating from Syncfusion Blazor, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| Syncfusion Component | Telerik Equivalent | Complexity | Notes |
|---------------------|-------------------|------------|-------|
| `<SfGrid>` | `<TelerikGrid>` | Complex | See data-grid protocol |
| `<SfTextBox>` | `<TelerikTextBox>` | Simple | |
| `<SfNumericTextBox>` | `<TelerikNumericTextBox>` | Simple | |
| `<SfDropDownList>` | `<TelerikDropDownList>` | Moderate | |
| `<SfAutoComplete>` | `<TelerikAutoComplete>` | Moderate | |
| `<SfDatePicker>` | `<TelerikDatePicker>` | Moderate | |
| `<SfButton>` | `<TelerikButton>` | Simple | |
| `<SfDialog>` | `<TelerikDialog>` | Moderate | |
| `<SfChart>` | `<TelerikChart>` | Complex | |
| `<SfSchedule>` | `<TelerikScheduler>` | Complex | |
| `<SfTab>` | `<TelerikTabStrip>` | Moderate | |
| `<SfTreeView>` | `<TelerikTreeView>` | Complex | |
| `<SfMenu>` | `<TelerikMenu>` | Moderate | |
| `<SfCheckBox>` | `<TelerikCheckBox>` | Simple | |
| `<SfSwitch>` | `<TelerikSwitch>` | Simple | |
| `<SfSlider>` | `<TelerikSlider>` | Simple | |
| `<SfUploader>` | `<TelerikUpload>` | Moderate | |
| `<SfTooltip>` | `<TelerikTooltip>` | Simple | |
| `<SfAccordion>` | `<TelerikPanelBar>` | Moderate | |
| `<SfBreadcrumb>` | `<TelerikBreadcrumb>` | Simple | |
| `<SfProgressBar>` | `<TelerikProgressBar>` | Simple | |
| `<SfSplitter>` | `<TelerikSplitter>` | Moderate | |
| `<SfPivotView>` | `<TelerikPivotGrid>` | Complex | |

## Parameter Mapping Examples

> Fill these in as you migrate.

### SfGrid → TelerikGrid
| Syncfusion Parameter | Telerik Parameter | Type Change | Notes |
|---------------------|------------------|-------------|-------|
| `DataSource` | `Data` | same type | Different name |
| `AllowSorting` | `Sortable` | same | |
| `AllowFiltering` | `FilterMode` | bool → enum | |
| `AllowPaging` | `Pageable` | same | |
| `PageSettings.PageSize` | `PageSize` | nested → flat | |
| | | | |

## Service Migration

| Syncfusion Service | Telerik Equivalent | Pattern Change |
|-------------------|-------------------|----------------|
| `SfDialogService` | `<TelerikDialog @bind-Visible>` | Service → component |
| `SfToast` (injected) | `<TelerikNotification @ref>` | Service → component ref |

## Event Mapping Examples

> Fill these in as you migrate.

| Syncfusion Event | Telerik Event | Payload Change | Notes |
|-----------------|--------------|----------------|-------|
| | | | |
