# MudBlazor → Telerik UI for Blazor Component Mappings

> **Self-populating reference**: When migrating from MudBlazor, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| MudBlazor Component | Telerik Equivalent | Complexity | Notes |
|--------------------|-------------------|------------|-------|
| `<MudDataGrid>` | `<TelerikGrid>` | Complex | See data-grid protocol |
| `<MudTable>` | `<TelerikGrid>` | Complex | MudTable is simpler, but Telerik Grid subsumes both |
| `<MudTextField>` | `<TelerikTextBox>` | Moderate | |
| `<MudNumericField>` | `<TelerikNumericTextBox>` | Moderate | |
| `<MudSelect>` | `<TelerikDropDownList>` | Moderate | |
| `<MudAutocomplete>` | `<TelerikAutoComplete>` | Moderate | |
| `<MudDatePicker>` | `<TelerikDatePicker>` | Moderate | |
| `<MudTimePicker>` | `<TelerikTimePicker>` | Moderate | |
| `<MudButton>` | `<TelerikButton>` | Simple | |
| `<MudIconButton>` | `<TelerikButton>` with `Icon` parameter | Simple | |
| `<MudFab>` | `<TelerikButton>` with `Rounded="true"` | Simple | |
| `<MudDialog>` | `<TelerikDialog>` | Moderate | |
| `<MudChart>` | `<TelerikChart>` | Complex | |
| `<MudDrawer>` | `<TelerikDrawer>` | Moderate | |
| `<MudTabs>` | `<TelerikTabStrip>` | Moderate | |
| `<MudTreeView>` | `<TelerikTreeView>` | Complex | |
| `<MudMenu>` | `<TelerikMenu>` | Moderate | |
| `<MudSwitch>` | `<TelerikSwitch>` | Simple | |
| `<MudCheckBox>` | `<TelerikCheckBox>` | Simple | |
| `<MudRadioGroup>` | `<TelerikRadioGroup>` | Simple | |
| `<MudSlider>` | `<TelerikSlider>` | Simple | |
| `<MudProgressLinear>` | `<TelerikProgressBar>` | Simple | |
| `<MudProgressCircular>` | `<TelerikLoader>` | Simple | |
| `<MudBreadcrumbs>` | `<TelerikBreadcrumb>` | Simple | |
| `<MudChip>` | `<TelerikChip>` / `<TelerikChipList>` | Simple | |
| `<MudExpansionPanels>` | `<TelerikPanelBar>` | Moderate | |
| `<MudTooltip>` | `<TelerikTooltip>` | Simple | |
| `<MudAlert>` | `<TelerikNotification>` | Moderate | imperative → component |
| `<MudSnackbar>` | `<TelerikNotification>` | Moderate | ISnackbar → component @ref |
| `<MudFileUpload>` | `<TelerikUpload>` | Moderate | |
| `<MudPagination>` | `<TelerikPager>` | Simple | |
| `<MudSkeleton>` | `<TelerikSkeleton>` | Simple | |

## Parameter Mapping Examples

> Fill these in as you migrate.

### MudTextField → TelerikTextBox
| MudBlazor Parameter | Telerik Parameter | Type Change | Notes |
|--------------------|------------------|-------------|-------|
| `@bind-Value` | `@bind-Value` | same | Same pattern |
| `Label` | `Label` | same | Same |
| `Placeholder` | `PlaceHolder` | same | Casing differs |
| `HelperText` | use `<TelerikFloatingLabel>` | string → component | |
| `Error` | use validation + `<ValidationMessage>` | bool → component | |
| `Disabled` | `Enabled` | bool → inverted bool | `Disabled=true` → `Enabled=false` |
| `ReadOnly` | `ReadOnly` | same | Same |
| `Immediate` | `DebounceDelay="0"` | bool → int | |
| | | | |

### MudButton → TelerikButton
| MudBlazor Parameter | Telerik Parameter | Type Change | Notes |
|--------------------|------------------|-------------|-------|
| `Variant="Variant.Filled"` | `ThemeColor="primary"` | enum → string | |
| `Variant="Variant.Outlined"` | `FillMode="outline"` | enum → string | |
| `Variant="Variant.Text"` | `FillMode="flat"` | enum → string | |
| `StartIcon` | `Icon` | string → string | Use Telerik icon class |
| `Disabled` | `Enabled` | bool → inverted | |
| `OnClick` | `OnClick` | same | Same |
| `Size` | `Size` | same | Same |

### MudDataGrid → TelerikGrid
| MudBlazor Parameter | Telerik Parameter | Type Change | Notes |
|--------------------|------------------|-------------|-------|
| | | | |

## Service Migration

| MudBlazor Service | Telerik Equivalent | Pattern Change |
|------------------|-------------------|----------------|
| `IDialogService.ShowAsync<T>()` | `<TelerikDialog @bind-Visible>` or `DialogFactory` | Imperative → declarative (or Factory) |
| `ISnackbar.Add()` | `<TelerikNotification @ref="notif">` + `notif.Show()` | Injected service → component ref |
| `IScrollManager` | No equivalent | Use JS interop directly |
| `IBreakpointService` | No equivalent | Use CSS media queries or JS interop |

## Event Mapping Examples

> Fill these in as you migrate.

| MudBlazor Event | Telerik Event | Payload Change | Notes |
|----------------|--------------|----------------|-------|
| | | | |
