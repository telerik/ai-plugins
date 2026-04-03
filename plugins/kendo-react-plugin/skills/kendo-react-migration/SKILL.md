---
name: kendo-react-migration
description: >
  Use this skill when the user wants to migrate a project from any UI component library
  to KendoReact, or needs guidance on mapping components from third-party libraries
  to their KendoReact equivalents. Trigger when the user mentions migrating from MUI,
  Ant Design, Chakra UI, Shadcn, Bootstrap, Angular Material, PrimeReact, Mantine,
  or any other UI framework to KendoReact, or phrases like "migrate to KendoReact",
  "replace MUI with Kendo", "convert my app to use Kendo", "switch from Ant Design
  to Kendo", "move to KendoReact", "rewrite using Kendo components", or "how do I
  replace [library] with KendoReact". Also trigger when the user asks about component
  equivalents between a third-party library and KendoReact during an active migration.
---

## Purpose

This skill teaches how to migrate projects from any UI component library to
KendoReact — providing precise component mappings, prop translations, event handler
conversions, template/rendering pattern translations, styling migration strategies,
and common pitfalls grounded in the actual KendoReact API.

## Reference Files

The `references/` directory contains self-populating mapping files for common source libraries:
- `references/mui-mappings.md` — Material UI / MUI
- `references/antd-mappings.md` — Ant Design
- `references/chakra-mappings.md` — Chakra UI
- `references/common-pitfalls.md` — Cross-library gotchas

**Before migrating any component**: Check the relevant reference file for an existing mapping.
**After filling a gap via MCP tools**: Write the finding back to the reference file so future migrations benefit.
Reference files grow richer with each migration run.

## Supported Source Libraries

| Source Library | Package Prefix | Common Shorthand |
|----------------|---------------|------------------|
| Material UI / MUI | `@mui/*`, `@material-ui/*` | MUI |
| Ant Design | `antd`, `@ant-design/*` | Antd |
| Chakra UI | `@chakra-ui/*` | Chakra |
| Shadcn UI | `shadcn`, `@radix-ui/*` + custom | Shadcn |
| Mantine | `@mantine/*` | Mantine |
| React Bootstrap | `react-bootstrap` | RB |
| Blueprint.js | `@blueprintjs/*` | Blueprint |
| PrimeReact | `primereact` | Prime |
| Semantic UI React | `semantic-ui-react` | SUI |
| Headless UI | `@headlessui/react` | Headless |
| Radix Primitives | `@radix-ui/react-*` | Radix |
| Angular Material | `@angular/material` | AngMat |
| Vuetify | `vuetify` | Vuetify |
| Element Plus | `element-plus` | Element |
| Vanilla HTML / custom components | N/A | Custom |

## Component Mapping Process

### 1. Identify source components

Scan the source project to build a complete inventory:
```bash
grep -rn "from '@mui\|from 'antd\|from '@chakra-ui\|from '@mantine\|from 'react-bootstrap\|from '@blueprintjs\|from 'primereact\|from 'semantic-ui-react\|from '@headlessui\|from '@radix-ui" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
```

For each unique component, record: component name, source package, files where used, props passed, events handled.

### 2. Map to KendoReact equivalents

For each source component, determine its KendoReact equivalent and retrieve the
authoritative API. Build a mapping table:

| Source Component | Source Package | KendoReact Equivalent | KendoReact Package | Complexity |
|-----------------|---------------|----------------------|-------------------|------------|
| (discovered) | (discovered) | (from API context) | (from API context) | Simple / Moderate / Complex |

**Complexity ratings:**
- **Simple**: 1:1 prop mapping, minimal behavioral difference
- **Moderate**: Different prop names, event signatures, or controlled/uncontrolled patterns
- **Complex**: Significant API differences, custom rendering logic, or no direct equivalent

### 3. Build migration spec per component

For each component in the mapping table, build a prop-by-prop and event-by-event
translation using the authoritative component API. Cover:
- Props with types and defaults
- Event handler signatures and event object shapes
- Rendering/template patterns
- Accessibility requirements (ARIA, keyboard nav)
- Icon mappings
- Styling approach

### 4. Handle cross-cutting patterns

#### State Management
Redux, Zustand, MobX, Jotai, Recoil: Keep as-is — KendoReact is state-management agnostic. Components consume data via props and emit events.

#### Routing
No change needed. KendoReact does not provide routing.

#### Data Fetching
No change needed. KendoReact components consume data via props. TanStack Query, SWR, Apollo, etc. remain unchanged.

#### CSS-in-JS → Kendo CSS Variables
- MUI `sx` prop, `styled()`, `makeStyles()` → scoped CSS with `--kendo-*` variables or CSS modules
- Chakra style props (`bg`, `p`, `color`) → CSS classes + Kendo theme tokens
- Emotion/styled-components wrappers around source components → CSS modules or scoped CSS targeting Kendo class selectors
- Tailwind utility classes on source components → keep Tailwind for layout, use `--kendo-*` for component theming

#### Theme Provider Migration
- MUI `<ThemeProvider theme={...}>` → Kendo theme CSS import + CSS variable overrides in `:root`
- Chakra `<ChakraProvider theme={...}>` → same pattern
- Extract design tokens from source theme object and map to closest `--kendo-*` equivalents
- Dark mode: source toggle mechanism stays, CSS variable overrides switch via `[data-theme="dark"]` selector

#### Form Library Integration
- KendoReact provides `@progress/kendo-react-form` with `<Form>`, `<Field>`, `<FieldArray>`
- Formik `<Field>` / `<Form>` → KendoReact `<Field component={...}>` with `onChange`/`value` controlled pattern
- React Hook Form `register()` / `Controller` → KendoReact `<Field>` or keep RHF with KendoReact inputs via `Controller`
- Validation rule translation: yup/zod schemas can be reused — wire them through KendoReact's `validator` prop
- Decision: if source uses a form library heavily, it may be simpler to keep it and just swap input components

#### Internationalization
- KendoReact provides `@progress/kendo-react-intl` for component-level messages and formatting
- react-intl / react-i18next: Keep for app-level i18n; use `@progress/kendo-react-intl` for KendoReact component localization
- Date/number formatting: KendoReact uses CLDR data via `@progress/kendo-react-intl`

#### Test Selector Migration
- MUI `data-testid` attributes → KendoReact renders with CSS class selectors (`.k-grid`, `.k-button`, `.k-input`)
- React Testing Library `getByRole` queries generally remain stable across libraries
- `getByTestId` queries need selector updates if source components had custom test IDs
- Snapshot tests will break — regenerate after migration; do not try to fix inline

#### Components with No Direct Equivalent
When a source component has no KendoReact equivalent:
1. **Compose from primitives** — build from KendoReact atoms (Button, Input, Popup, etc.)
2. **Keep the third-party component** — if isolated, it can coexist with KendoReact (document as a known exception)
3. **Use a headless/unstyled alternative** — Radix, Headless UI, or custom hooks styled to match Kendo theme
4. Flag in the migration report as "no direct equivalent — [approach taken]"

## Data Grid Deep Migration Protocol

This protocol is **automatically triggered** when the component inventory includes any grid or table component (matching names like `Grid`, `Table`, `DataGrid`, `DataTable`, `ListView`). Grids typically account for 40–60% of migration complexity and require dedicated analysis.

### Step 1: Source Grid Analysis (LLM-driven)

For each grid/table in the source project:
1. **Catalog column definitions** — field name, data type, width, header text, format, locked/frozen, resizable, reorderable
2. **Identify cell customization** — custom cell renderers, cell templates, conditional formatting, editable cells
3. **Detect enabled features** — sorting (client/server), filtering (client/server, filter type), paging (client/server, page size), grouping, column reordering, column resizing, virtual scrolling
4. **Assess data source** — local array, server-side with callback functions, OData, GraphQL, REST with manual pagination
5. **Selection model** — single row, multi-row, checkbox, cell selection, range selection
6. **Edit mode** — inline, popup, batch/incell, custom editor components
7. **Export** — Excel, PDF, CSV, custom export
8. **Other features** — detail rows/row expansion, column menu, toolbar, aggregate footers, frozen columns, drag & drop rows

### Step 2: Target Grid API Retrieval (tool-driven)

Call the `kendo_component_assistant` MCP tool for each feature detected in Step 1. Make separate calls:
- `Grid` — core props, data binding, controlled state
- `GridColumn` — column definition props, `cell`, `filterCell`, `editCell`
- `Grid` events — `onDataStateChange`, `onSelectionChange`, `onRowClick`, `onItemChange`
- `Grid` editing — inline, popup, incell edit modes, `onItemChange`
- `Grid` export — `ExcelExport`, `PDFExport`, `savePDF`, `saveExcel`
- `Grid` accessibility — ARIA roles, keyboard navigation

### Step 3: Feature Parity Checklist

Produce a table **before writing any code**:

| Feature | Source Implementation | KendoReact API | Gap? | Workaround |
|---------|----------------------|----------------|------|------------|
| Column templates | `render` prop | `cell` prop on `<GridColumn>` | No | — |
| Server-side paging | `onPageChange(page, pageSize)` | `onDataStateChange(e)` → `e.dataState` | Shape differs | Map to `DataState` |
| ... | ... | ... | ... | ... |

### Step 4: Escalation

If any feature has no target equivalent:
- Flag in the migration report with severity (Critical / Major / Minor)
- Propose a workaround (custom cell renderer, post-processing, external library)
- If Critical, pause and ask the user before proceeding

---

## Migration Wave Strategy

When migrating an entire project, order components by dependency and risk.
For incremental migrations, organize waves by page/feature instead of component type.

### Full Migration Wave Order

**Wave 0 — Foundation:**
- Install KendoReact packages and theme
- Set up theme import in app root
- Configure licensing
- Set up shared utilities (i18n adapter, form helpers)

**Wave 1 — Leaf components (lowest risk):**
- Buttons, inputs, checkboxes, switches, sliders
- Simple display components (badges, chips, tags, icons)

**Wave 2 — Form components:**
- Text fields, dropdowns, date pickers, multi-selects
- Form wrapper and validation

**Wave 3 — Layout components:**
- Navigation (drawer, menu, tabs, breadcrumbs)
- Cards, panels, expansion panels
- Page layout structure

**Wave 4 — Complex data components:**
- Data grids / tables (most complex, highest risk)
- Tree views
- Schedulers / calendars

**Wave 5 — Overlay components:**
- Dialogs, modals, confirmations
- Notifications, toasts
- Tooltips, popovers

**Wave 6 — Charts and visualization:**
- Charts, sparklines, gauges
- Dashboards

**Wave 7 — Testing and verification:**
- Unit tests and E2E tests for every migrated component
- Accessibility tests for all interactive components
- Complete test suite verification

**Wave 8 — Cleanup:**
- Remove source library packages
- Remove source library theme/CSS imports
- Verify zero non-KendoReact imports remain
- Final quality review

### Incremental Migration Wave Order

For incremental (page-by-page) migrations:

**Wave 0 — Coexistence Setup:**
- Install KendoReact packages alongside the source library
- Load both theme CSS files
- Apply CSS isolation to prevent conflicts:
  - Use CSS `@layer` to control cascade priority
  - Or scope source theme imports to a wrapper class
  - Or use CSS modules for component-level isolation
- Verify both libraries render correctly on the same page

**Waves 1–N — Per-page/feature migration:**
- Each wave targets one page or feature boundary
- Migrate all components on that page from source to KendoReact
- Remove source imports from migrated files only
- Verify the page in isolation and in the context of the full app

**Graduation Wave (when user requests):**
- Remove source library packages and theme CSS
- Clean up CSS isolation workarounds
- Run full test suite

