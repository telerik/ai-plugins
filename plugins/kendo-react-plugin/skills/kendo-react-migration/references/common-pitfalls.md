# Common Migration Pitfalls

> Cross-library pitfalls that apply to most source library → KendoReact migrations.

## CSS Specificity Conflicts

- Source library theme CSS may conflict with KendoReact theme if both are loaded simultaneously (incremental migration)
- **Fix**: Use CSS `@layer` to control cascade order, or scope source theme to a wrapper class
- KendoReact uses `.k-` prefixed classes; most source libraries use different prefixes, reducing direct conflicts
- Watch for global resets in source themes that affect KendoReact rendering

## Controlled vs Uncontrolled Components

- KendoReact strongly prefers controlled components (`value` + `onChange`)
- Some source libraries default to uncontrolled mode
- When migrating, ensure every input component has explicit `value` and `onChange` handlers
- Missing `onChange` → component appears frozen

## Event Object Shape Differences

- KendoReact events wrap native events in component-specific event objects
- `e.value` is common in KendoReact (not `e.target.value`)
- Grid events use `e.dataState`, `e.dataItem`, `e.field` etc.
- Always check the event type signature when mapping handlers

## Theme Variable Naming

- KendoReact uses `--kendo-*` CSS variables
- MUI uses `--mui-*` or `theme.palette.*` tokens
- Chakra uses `--chakra-*` CSS variables
- Antd uses `--ant-*` CSS variables
- When migrating theme customization, map source tokens to nearest `--kendo-*` equivalent

## Import Patterns

- KendoReact uses specific package imports: `import { Grid } from '@progress/kendo-react-grid'`
- Never use barrel imports from a single package
- Each component category has its own package — install only what you use

## Data Binding Patterns

- KendoReact Grid uses `process()` from `@progress/kendo-data-query` for client-side operations
- Server-side: use `toDataSourceRequestString()` to serialize state, `toDataSourceResult()` to parse response
- Source libraries may use different data transformation utilities — these must be replaced

## Licensing

- KendoReact requires a license key: `@progress/kendo-licensing`
- Run `npx kendo-ui-license activate` during setup
- Missing license → watermark on components in production

## Accessibility Gaps

- KendoReact components are WCAG 2.1 AA compliant out of the box
- Source library may have had custom ARIA attributes that KendoReact handles automatically
- Verify: don't duplicate ARIA roles/labels that KendoReact already provides
- Custom cell renderers in grids need manual `role` and `aria-*` attributes

## Form Validation

- KendoReact `<Form>` uses a `validator` prop (function returning error string or undefined)
- If source used yup/zod with Formik, the schema can be adapted to KendoReact's validator interface
- Alternatively, keep the form library and just swap input components
