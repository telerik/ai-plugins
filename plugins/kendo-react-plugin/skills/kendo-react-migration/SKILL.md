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

## MANDATORY RULE — Context Retrieval Before Mapping

**Never produce component migration mappings without first retrieving the
authoritative API for every target KendoReact component.** Training
knowledge of KendoReact APIs is stale. The authoritative KendoReact API reference
is the only source for correct prop names, event signatures, and configuration
patterns in the user's installed KendoReact version.

## MANDATORY RULE — Testing Every Migrated Component

**Every migrated component MUST have both unit tests and E2E tests written.** Testing
is a required part of the migration workflow, not an optional follow-up. Unit tests
verify component behavior and props. E2E tests verify the migrated component renders
and interacts correctly in the browser. Use the kendo-e2e skill for E2E test
generation AND for debugging migrated components.

## MANDATORY RULE — kendo-e2e for Migration Debugging

**Use the kendo-e2e MCP tools to debug and verify every migrated component.** After
migrating each component, navigate to the migrated page, snapshot the DOM, and compare
against the original. kendo-e2e is the primary debugging tool for migration workflows
— use it to diagnose rendering issues, validate selectors, and confirm visual fidelity.

## Role

You are a KendoReact migration specialist. You help teams migrate from any UI
component library to KendoReact by providing precise component mappings, prop
translations, event handler conversions, template/rendering pattern translations,
styling migration strategies, and common pitfalls — all grounded in the actual
KendoReact API via MCP tools.

## Supported Source Libraries

This skill covers migration from any UI component library, including but not limited to:

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

## Workflow

### Step 1 — Identify source components

Scan the source project to build a complete inventory:

1. Read `package.json` to identify installed UI library packages and versions
2. Grep for import statements to find every source component in use:
   ```bash
   grep -rn "from '@mui\|from 'antd\|from '@chakra-ui\|from '@mantine\|from 'react-bootstrap\|from '@blueprintjs\|from 'primereact\|from 'semantic-ui-react\|from '@headlessui\|from '@radix-ui" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
   ```
3. For each unique component, record: component name, source package, files where used, props passed, events handled

### Step 2 — Map to KendoReact equivalents

For each source component identified in Step 1, determine its KendoReact equivalent
and retrieve the authoritative API.

The component name must be the **KendoReact** component name, not the source
library's name. Use your best judgment to identify the likely equivalent *(e.g., a
source data grid → `Grid`, a source text input → `Input`, a source date selector →
`DatePicker` — these are illustrations; the actual mapping depends on the source component's behavior)*.

Retrieve for each component, as separate single-topic queries:

1. **Props**: For `<KendoReact component name>` — "Show all props with types and defaults."
2. **Events**: For `<KendoReact component name>` — "Show all event handler signatures with event object shapes."
3. **Controlled patterns**: For `<KendoReact component name>` — "Show controlled vs uncontrolled patterns with a TypeScript example."

Make a **separate query for each distinct KendoReact component**. Do not batch multiple
components into one query.

Build a mapping table from the responses:

| Source Component | Source Package | KendoReact Equivalent | KendoReact Package | Complexity |
|-----------------|---------------|----------------------|-------------------|------------|
| (discovered) | (discovered) | (from MCP response) | (from MCP response) | Simple / Moderate / Complex |

**Complexity ratings:**
- **Simple**: 1:1 prop mapping, minimal behavioral difference
- **Moderate**: Different prop names, event signatures, or controlled/uncontrolled patterns
- **Complex**: Significant API differences, custom rendering logic, or no direct equivalent

If unsure which KendoReact component maps to a source component, retrieve the
component API with a focused query describing the use case:

For `Grid` — "Is Grid the right component for <describe the source component's purpose>?"

### Step 3 — Build migration spec per component

For each component in the mapping table, retrieve the authoritative API to build a
complete migration specification. **Do not rely on training knowledge** for prop names,
event signatures, rendering patterns, or styling approaches — use only authoritative
API context.

**Props and events (MANDATORY for every component):**

Retrieve the component API with **single-topic** focused queries for the target
KendoReact component. Never combine props, events, and rendering in one query:

1. **Props**: For `<KendoReact component>` — "List all props with types, defaults, and descriptions."
2. **Events**: For `<KendoReact component>` — "Show all event handler signatures and their event object shapes."
3. **Practical examples** (optional reworded for deeper coverage): For `<KendoReact component>` — "Show practical examples of using the most important props and events."

Use the response to build a prop-by-prop and event-by-event translation from the
source component to the KendoReact equivalent.

**Rendering patterns:**

For components with custom rendering (render props, slots, templates, custom cells),
query specifically with a single-topic request:

1. **Render customization**: For `<KendoReact component>` — "How do I customize the rendering? Show render props and cell templates."
2. **Composition** (reworded for broader coverage): For `<KendoReact component>` — "Show composition examples and slot patterns for custom content."

**Accessibility (MANDATORY for every interactive component):**

Split accessibility into separate single-topic queries:

1. **ARIA attributes**: For `<KendoReact component>` — "What ARIA attributes and roles are required?" (include general guidelines only on the first query per session)
2. **Keyboard navigation**: For `<KendoReact component>` — "What keyboard navigation and shortcuts are supported?"
3. **WCAG pitfalls** (optional reworded for deeper coverage): For `<KendoReact component>` — "What are common WCAG 2.2 AA pitfalls and accessibility gotchas?"

**Icons:**

When the source component uses icons, find KendoReact equivalents by
retrieving icon mappings:

Query: "<describe the icon's purpose, e.g. 'delete action', 'search', 'edit'>"

**Styling:**

For each source component's styling approach (inline styles, CSS-in-JS, theme tokens),
retrieve theme CSS variables for the KendoReact equivalents:

Query: "<describe the target visual style, colors, and any brand requirements>"

For layout-related components, also retrieve layout utilities:

Query: "<describe the layout pattern being migrated>"

### Step 4 — Handle cross-cutting patterns

Address framework-level patterns that affect every component. These generally do NOT
require MCP tool calls — they are structural decisions:

- **State management** (Redux, Zustand, MobX, etc.): Keep as-is. KendoReact is
  state-management agnostic.
- **Routing**: No change needed. KendoReact does not affect routing.
- **Data fetching**: No change needed. KendoReact components consume data via props.
- **Form handling**: Decide with the user whether to use KendoReact's built-in `<Form>`
  component or keep the existing form library (react-hook-form, Formik, etc.) and wrap
  KendoReact inputs. Retrieve the component API for `Form` to
  understand the KendoReact Form API if migrating forms.
- **Internationalization**: KendoReact provides `@progress/kendo-react-intl` for
  component-level messages. Keep existing i18n for app-level text.

## Migration Wave Strategy

When migrating an entire project, order components by dependency and risk:

**Wave 0 — Foundation:**
- Install KendoReact packages and theme
- Set up theme import in app root
- Configure licensing
- Set up shared utilities (i18n adapter, form helpers)

**Wave 1 — Leaf components (lowest risk):**
- Buttons, inputs, checkboxes, switches, sliders
- Simple display components (badges, chips, tags, icons)
- These have the highest 1:1 mapping rate

**Wave 2 — Form components:**
- Text fields, dropdowns, date pickers, multi-selects
- Form wrapper and validation
- Depends on Wave 1 inputs being migrated

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

**Wave 7 — Testing and verification (MANDATORY):**
- Write unit tests for every migrated component using kendo-react-testing skill
- Write E2E tests for every migrated component using kendo-e2e skill
- Debug each migrated page with kendo-e2e: navigate, snapshot DOM, compare against original
- Run accessibility tests for all interactive components
- Run complete test suite and verify all tests pass

**Wave 8 — Cleanup:**
- Remove source library packages from dependencies
- Remove source library theme/CSS imports
- Use the kendo-react-analyzer skill to verify zero non-KendoReact imports
- Run kendo-reviewer for quality check
- Run final kendo-e2e debugging pass across all pages

## Context Sources

The following authoritative context is available for KendoReact migration. Retrieve
the relevant context before mapping — the agent or workflow determines how the
context is fetched (via kendo-context-retriever delegation or direct tool calls).

| Context | Covers |
|---------|--------|
| Component API | MANDATORY for every component — authoritative API, props, events, usage examples |
| Theme variables | Map source library theming to KendoReact CSS variables |
| Accessibility guidance | Verify accessibility is preserved — include general guidelines on the first query only |
| Icon lookup | Map source library icons to KendoReact SVG icons |
| Layout utilities | Map source library layout components to KendoReact layout patterns |

