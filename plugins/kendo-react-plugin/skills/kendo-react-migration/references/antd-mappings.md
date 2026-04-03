# Ant Design → KendoReact Component Mappings

> **Self-populating reference**: When migrating from Ant Design, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| Antd Component | Antd Package | KendoReact Equivalent | KendoReact Package | Complexity | Notes |
|---------------|-------------|----------------------|-------------------|------------|-------|
| `<Button>` | `antd` | `<Button>` | `@progress/kendo-react-buttons` | Simple | |
| `<Input>` | `antd` | `<Input>` | `@progress/kendo-react-inputs` | Simple | |
| `<Input.TextArea>` | `antd` | `<TextArea>` | `@progress/kendo-react-inputs` | Simple | |
| `<Select>` | `antd` | `<DropDownList>` / `<MultiSelect>` | `@progress/kendo-react-dropdowns` | Moderate | |
| `<AutoComplete>` | `antd` | `<AutoComplete>` | `@progress/kendo-react-dropdowns` | Moderate | |
| `<DatePicker>` | `antd` | `<DatePicker>` | `@progress/kendo-react-dateinputs` | Moderate | |
| `<Table>` | `antd` | `<Grid>` | `@progress/kendo-react-grid` | Complex | See data-grid protocol |
| `<Modal>` | `antd` | `<Dialog>` | `@progress/kendo-react-dialogs` | Moderate | |
| `<Drawer>` | `antd` | `<Drawer>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tabs>` | `antd` | `<TabStrip>` | `@progress/kendo-react-layout` | Moderate | |
| `<Checkbox>` | `antd` | `<Checkbox>` | `@progress/kendo-react-inputs` | Simple | |
| `<Switch>` | `antd` | `<Switch>` | `@progress/kendo-react-inputs` | Simple | |
| `<Slider>` | `antd` | `<Slider>` | `@progress/kendo-react-inputs` | Simple | |
| `<Menu>` | `antd` | `<Menu>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tooltip>` | `antd` | `<Tooltip>` | `@progress/kendo-react-tooltip` | Simple | |
| `<notification>` | `antd` | `<Notification>` | `@progress/kendo-react-notification` | Moderate | |
| `<Collapse>` | `antd` | `<PanelBar>` | `@progress/kendo-react-layout` | Moderate | |
| `<Breadcrumb>` | `antd` | `<Breadcrumb>` | `@progress/kendo-react-layout` | Simple | |
| `<Tag>` | `antd` | `<Chip>` | `@progress/kendo-react-buttons` | Simple | |
| `<Steps>` | `antd` | `<Stepper>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tree>` / `<TreeSelect>` | `antd` | `<TreeView>` | `@progress/kendo-react-treeview` | Complex | |
| `<Form>` | `antd` | `<Form>` | `@progress/kendo-react-form` | Complex | Different validation model |
| `<Upload>` | `antd` | `<Upload>` | `@progress/kendo-react-upload` | Moderate | |

## Prop Mapping Examples

> Fill these in as you migrate.

### Table / Grid
| Antd Prop | KendoReact Prop | Type Change | Notes |
|-----------|----------------|-------------|-------|
| `columns` | `<GridColumn>` children | array → JSX | Declarative columns in Kendo |
| `dataSource` | `data` | same | |
| `pagination` | `pageable` + `skip`/`take` | object → controlled state | |
| `onChange` | `onDataStateChange` | different payload shape | |
| | | | |

## Event Mapping Examples

> Fill these in as you migrate.

| Antd Event | KendoReact Event | Payload Change | Notes |
|-----------|-----------------|----------------|-------|
| | | | |
