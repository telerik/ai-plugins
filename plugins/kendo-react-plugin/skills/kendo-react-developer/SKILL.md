---
name: kendo-react-developer
description: >
  Use this skill when building, implementing, or customizing KendoReact components.
  Trigger when adding a component, using any @progress/kendo-react-* package,
  configuring data binding, selecting the right component for a use case, or
  applying implementation patterns for KendoReact. This skill covers implementation
  patterns, function component conventions, controlled state, TypeScript, data
  binding, and package management. It does NOT cover theming (use kendo-react-theme),
  project setup (use kendo-react-getting-started), or testing (use kendo-react-testing).
---

## Role

This skill teaches an agent how to implement KendoReact components correctly and
efficiently — producing API-accurate, accessible, and well-typed code using
exclusively `@progress/kendo-react-*` packages.

---

## Reference Loading

Before implementing any component, read the relevant reference files from `references/`:

- **Always** → Read `references/common-guidelines.md` for architecture and package installation rules
- **Always** → Read `references/component-registry.md` for the full component list and aliases
- **When using DataGrid/Grid** → Read `references/datagrid-deprecated.md` for deprecated properties and modern replacements
- **When using Editor** → Read `references/editor-tools.md` for the required tool import pattern
- **When using Smart Grid / AI Grid** → Read `references/smart-grid.md` for GridToolbarAIAssistant setup

---

## Implementation Patterns

### Function components with hooks

Always use function components with React hooks for state and lifecycle:

```tsx
import React, { useState } from 'react';

const MyComponent: React.FC = () => {
  const [data, setData] = useState(initialData);
  return <ComponentFromContext data={data} />;
};
```

### Controlled components

Prefer controlled patterns with explicit state management. Wire `value` and `onChange` for all inputs:

```tsx
const [value, setValue] = useState('');
<InputComponent value={value} onChange={(e) => setValue(e.value)} />
```

### TypeScript interfaces

Write typed interfaces for all props and data shapes:

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}
```

### Specific imports

Import from individual packages, never barrel imports:

```tsx
// ✅ Correct
import { Grid, GridColumn } from '@progress/kendo-react-grid';

// ❌ Wrong — never use
import { Grid } from '@progress/kendo-react-all';
```

### Package installation

Install only the packages required for the components being used:

```bash
npm install @progress/kendo-react-<package> @progress/kendo-data-query
```

Never install `@progress/kendo-react-all` unless explicitly requested.

### Data operations

Use `@progress/kendo-data-query` for local data operations:

```tsx
import { orderBy, filterBy, SortDescriptor } from '@progress/kendo-data-query';
```

### Theme import

Ensure the theme CSS is imported once at the app entry point:

```tsx
import '@progress/kendo-theme-default/dist/all.css';
```

Check if the theme is already imported before adding to avoid duplicates.

---

## Accessibility Rules

Every component implementation must meet WCAG 2.1 AA:

- Provide accessible labels for all inputs (`aria-label`, `aria-labelledby`, or visible `<label>`)
- Ensure keyboard navigability (Tab, Enter, Escape, arrow keys)
- Use correct ARIA roles for custom interactive elements
- Manage focus appropriately on open/close of overlays and dialogs
- Ensure sufficient color contrast

---

## Quality Checklist

Before delivering any implementation, verify:

1. No imports from non-`@progress/kendo-react-*` UI libraries
2. All props and data shapes are typed with TypeScript interfaces
3. All interactive elements have accessible labels
4. Controlled patterns are used with explicit state management
5. Only necessary packages are installed
6. Code follows the project's existing patterns and conventions
