# Chakra UI → KendoReact Component Mappings

> **Self-populating reference**: When migrating from Chakra UI, check this file first.
> If a mapping row is empty, retrieve the target API via MCP tools and **write your finding back here** so future migrations benefit.

## Component Mapping

| Chakra Component | Chakra Package | KendoReact Equivalent | KendoReact Package | Complexity | Notes |
|-----------------|---------------|----------------------|-------------------|------------|-------|
| `<Button>` | `@chakra-ui/react` | `<Button>` | `@progress/kendo-react-buttons` | Simple | |
| `<Input>` | `@chakra-ui/react` | `<Input>` | `@progress/kendo-react-inputs` | Moderate | Style props → CSS |
| `<Textarea>` | `@chakra-ui/react` | `<TextArea>` | `@progress/kendo-react-inputs` | Simple | |
| `<Select>` | `@chakra-ui/react` | `<DropDownList>` | `@progress/kendo-react-dropdowns` | Moderate | |
| `<Modal>` | `@chakra-ui/react` | `<Dialog>` | `@progress/kendo-react-dialogs` | Moderate | |
| `<Drawer>` | `@chakra-ui/react` | `<Drawer>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tabs>` | `@chakra-ui/react` | `<TabStrip>` | `@progress/kendo-react-layout` | Moderate | |
| `<Checkbox>` | `@chakra-ui/react` | `<Checkbox>` | `@progress/kendo-react-inputs` | Simple | |
| `<Switch>` | `@chakra-ui/react` | `<Switch>` | `@progress/kendo-react-inputs` | Simple | |
| `<Menu>` | `@chakra-ui/react` | `<Menu>` | `@progress/kendo-react-layout` | Moderate | |
| `<Tooltip>` | `@chakra-ui/react` | `<Tooltip>` | `@progress/kendo-react-tooltip` | Simple | |
| `<Toast>` / `useToast` | `@chakra-ui/react` | `<Notification>` | `@progress/kendo-react-notification` | Moderate | Hook → component |
| `<Accordion>` | `@chakra-ui/react` | `<PanelBar>` | `@progress/kendo-react-layout` | Moderate | |
| `<Breadcrumb>` | `@chakra-ui/react` | `<Breadcrumb>` | `@progress/kendo-react-layout` | Simple | |
| `<Tag>` | `@chakra-ui/react` | `<Chip>` | `@progress/kendo-react-buttons` | Simple | |

## Cross-Cutting: Chakra Style Props → KendoReact CSS

Chakra uses style props (`bg`, `p`, `m`, `color`, `fontSize`, etc.) directly on components.
KendoReact does not support style props. Migration strategy:

- **Layout props** (`p`, `m`, `w`, `h`, `display`, `flex`) → CSS classes or inline styles
- **Color props** (`bg`, `color`, `borderColor`) → CSS with `--kendo-*` variable overrides
- **Typography** (`fontSize`, `fontWeight`) → CSS or Kendo theme variables
- **Responsive arrays** (`p={[2, 4, 8]}`) → CSS media queries

## Prop Mapping Examples

> Fill these in as you migrate.

| Chakra Prop | KendoReact Prop | Type Change | Notes |
|-------------|----------------|-------------|-------|
| | | | |

## Event Mapping Examples

> Fill these in as you migrate.

| Chakra Event | KendoReact Event | Payload Change | Notes |
|-------------|-----------------|----------------|-------|
| | | | |
