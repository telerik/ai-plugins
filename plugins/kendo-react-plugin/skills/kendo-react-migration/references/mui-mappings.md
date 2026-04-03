# MUI (Material UI) → KendoReact Component Mappings

> **Self-populating reference**: When migrating from MUI, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| MUI Component | MUI Package | KendoReact Equivalent | KendoReact Package | Complexity | Notes |
|--------------|-------------|----------------------|-------------------|------------|-------|
| `<Button>` | `@mui/material` | `<Button>` | `@progress/kendo-react-buttons` | Simple | |
| `<IconButton>` | `@mui/material` | `<Button>` with `svgIcon` prop | `@progress/kendo-react-buttons` | Simple | |
| `<TextField>` | `@mui/material` | `<Input>` / `<TextArea>` | `@progress/kendo-react-inputs` | Moderate | |
| `<Select>` | `@mui/material` | `<DropDownList>` | `@progress/kendo-react-dropdowns` | Moderate | |
| `<Autocomplete>` | `@mui/material` | `<AutoComplete>` / `<ComboBox>` | `@progress/kendo-react-dropdowns` | Moderate | |
| `<DatePicker>` | `@mui/x-date-pickers` | `<DatePicker>` | `@progress/kendo-react-dateinputs` | Moderate | |
| `<DataGrid>` | `@mui/x-data-grid` | `<Grid>` | `@progress/kendo-react-grid` | Complex | See data-grid protocol |
| `<Dialog>` | `@mui/material` | `<Dialog>` | `@progress/kendo-react-dialogs` | Moderate | |
| `<Drawer>` | `@mui/material` | `<Drawer>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tabs>` | `@mui/material` | `<TabStrip>` | `@progress/kendo-react-layout` | Moderate | |
| `<Checkbox>` | `@mui/material` | `<Checkbox>` | `@progress/kendo-react-inputs` | Simple | |
| `<Switch>` | `@mui/material` | `<Switch>` | `@progress/kendo-react-inputs` | Simple | |
| `<Slider>` | `@mui/material` | `<Slider>` | `@progress/kendo-react-inputs` | Simple | |
| `<Menu>` | `@mui/material` | `<Menu>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tooltip>` | `@mui/material` | `<Tooltip>` | `@progress/kendo-react-tooltip` | Simple | |
| `<Snackbar>` / `<Alert>` | `@mui/material` | `<Notification>` | `@progress/kendo-react-notification` | Moderate | |
| `<Accordion>` | `@mui/material` | `<PanelBar>` | `@progress/kendo-react-layout` | Moderate | |
| `<Breadcrumbs>` | `@mui/material` | `<Breadcrumb>` | `@progress/kendo-react-layout` | Simple | |
| `<Chip>` | `@mui/material` | `<Chip>` | `@progress/kendo-react-buttons` | Simple | |
| `<Stepper>` | `@mui/material` | `<Stepper>` | `@progress/kendo-react-layout` | Moderate | |
| `<TreeView>` | `@mui/x-tree-view` | `<TreeView>` | `@progress/kendo-react-treeview` | Complex | |
| `<Charts>` | `@mui/x-charts` | `<Chart>` | `@progress/kendo-react-charts` | Complex | |

## Prop Mapping Examples

> Fill these in as you migrate. Each row should have: MUI prop → KendoReact prop, type change (if any), notes.

### Button
| MUI Prop | KendoReact Prop | Type Change | Notes |
|----------|----------------|-------------|-------|
| `variant="contained"` | `themeColor="primary"` | string → string | |
| `variant="outlined"` | `fillMode="outline"` | string → string | |
| `variant="text"` | `fillMode="flat"` | string → string | |
| `startIcon` | `svgIcon` | ReactNode → SVGIcon | Use `@progress/kendo-svg-icons` |
| `disabled` | `disabled` | bool → bool | Same |
| `onClick` | `onClick` | same signature | Same |
| `size` | `size` | `"small"/"medium"/"large"` → `"small"/"medium"/"large"` | Same |

### TextField / Input
| MUI Prop | KendoReact Prop | Type Change | Notes |
|----------|----------------|-------------|-------|
| `value` | `value` | | Same |
| `onChange` | `onChange` | `(e: ChangeEvent) => void` → `(e: InputChangeEvent) => void` | Event shape differs |
| `label` | `label` | | Same |
| `placeholder` | `placeholder` | | Same |
| `error` | `valid={false}` | bool → inverted bool | |
| `helperText` | use `<Error>` / `<Hint>` component | string → component | |
| `multiline` | Use `<TextArea>` instead | | Different component |
| `type` | `type` | | Same |

### Select / DropDownList
| MUI Prop | KendoReact Prop | Type Change | Notes |
|----------|----------------|-------------|-------|
| | | | |

### DataGrid / Grid
| MUI Prop | KendoReact Prop | Type Change | Notes |
|----------|----------------|-------------|-------|
| | | | |

## Event Mapping Examples

> Fill these in as you migrate.

| MUI Event | KendoReact Event | Payload Change | Notes |
|-----------|-----------------|----------------|-------|
| | | | |
