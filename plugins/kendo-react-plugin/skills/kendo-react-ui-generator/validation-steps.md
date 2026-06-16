# KendoReact — Code Validation & Quality Assurance

## Comprehensive Code Validation Checklist

Execute these validation steps systematically to ensure high-quality, maintainable code.

> **Note:** There is no automated validator tool for KendoReact. Use `npm run build` to check compilation and manually review each section below.

---

## Build Check

Run the build before considering the task complete:

```bash
npm run build
```

Fix **all** TypeScript and build errors before proceeding. If a component API is unclear, use `kendo_component_assistant` to look up the correct props and types.

---

## React Component Validation

**Component Structure:**
- Use proper function component patterns with Hooks
- Correct component naming convention (PascalCase)
- Appropriate file organization (components, hooks, utils)
- Props interface/type definitions where needed

---

## KendoReact Setup Validation

**UI Library Setup:**
- KendoReact modules properly imported and configured
- KendoReact theme properly loaded and applied (one theme only — never mix theme packages)
- KendoReact license properly configured (`npx kendo license activate` has been run)
- Globalization and localization properly configured for KendoReact components
- Required KendoReact dependencies installed and up-to-date
- Appropriate bundler (Vite/CRA/Next.js) configuration for KendoReact packages

---

## DataGrid-Specific Validation

- No deprecated DataGrid properties used (check [../kendo-react-component/datagrid-guidelines.md](../kendo-react-component/datagrid-guidelines.md))
- DataGrid has an explicit `style={{ height: ... }}` — without it, the Grid renders all rows and expands the page indefinitely
- `scrollable` prop defaults to `virtual` — confirm this is the intended behavior

---

## Performance Optimization

**Performance Best Practices:**
- `React.memo` for components that receive stable props
- `useMemo`/`useCallback` for expensive computations and callbacks
- Proper `key` props for list rendering with KendoReact components
- Efficient rendering patterns to prevent unnecessary re-renders
- Lazy loading of KendoReact components when appropriate
- Virtualization enabled for large datasets in KendoReact components
- Only required KendoReact modules imported and tree-shaken

---

## Theme & Styling Validation

**KendoReact Theme & Styling:**
- Prioritize the Kendo Design System utilities
- Avoid custom CSS or other framework classes
- Do not use inline styles
- Consistent KendoReact theme application across all components
- Custom theme variables properly defined and scoped
- KendoReact icon fonts properly loaded and optimized
- Brand colors integrated with KendoReact component themes
- Proper theme switching functionality (if implemented)
- Only ONE theme import exists across the application
- Theme import mechanism is consistent with existing project setup
- Dark theme completeness: `html, body` styled with `var(--kendo-body-bg)` and `var(--kendo-body-text)`

---

## Accessibility Validation

- Accessibility guidelines retrieved and applied to all components
- All components meet WCAG 2.2 Level AA standards
- ARIA attributes present where needed
- Keyboard navigation works for all interactive elements
- Visible focus indicators on all focusable elements
- Color contrast meets minimum ratios (4.5:1 body text, 3:1 large text/UI)

---

## General Code Quality

**File Organization:**
- Files properly named using appropriate conventions
- Components logically grouped in appropriate directories
- Clear separation of concerns between files

**Performance Best Practices:**
- Optimized rendering patterns
- Minimal unnecessary re-renders
- Efficient data handling
