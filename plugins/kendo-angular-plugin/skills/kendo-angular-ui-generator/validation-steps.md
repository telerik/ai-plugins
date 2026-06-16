# Kendo UI for Angular — Code Validation & Quality Assurance

## Comprehensive Code Validation Checklist

Execute these validation steps systematically to ensure high-quality, maintainable code.

> **Note:** There is no automated validator tool for Kendo UI for Angular. Use `ng build` to check compilation and manually review each section below.

---

## Build Check

Run the build before considering the task complete:

```bash
ng build
```

Fix **all** TypeScript and build errors before proceeding. If a component API is unclear, use `kendo_component_assistant` to look up the correct inputs, outputs, and types.

---

## Angular Component Validation

**Component Structure:**
- Use proper `@Component` decorator configuration
- If using NgModule setup, use `@Component` decorator with `standalone: false` and declare the component in the NgModule `declarations` array
- Correct selector naming convention (kebab-case)
- Appropriate template and style file organization

---

## Kendo UI for Angular Setup Validation

**UI Library Setup:**
- Kendo UI for Angular modules/components properly imported and configured
- Kendo UI for Angular theme properly loaded and applied (one theme only — never mix theme packages)
- Only ONE theme reference exists across `angular.json` and styles files
- Theme import mechanism is consistent with existing project setup
- Kendo UI for Angular license properly configured (`npx kendo-ui-license activate` has been run)
- Kendo animations configured (`provideAnimations()` in Standalone, or `BrowserAnimationsModule` in NgModule)
- Globalization and localization properly configured for Kendo components
- Required Kendo UI for Angular dependencies installed and up-to-date

---

## Grid-Specific Validation

- Grid uses `kendoGridBinding` for standard data display (or correct manual binding with event handlers)
- Grid has an explicit height binding (e.g., `[height]="'500px'"`) — without it, Grid renders all rows and expands the page indefinitely
- No `kendoButton` combined with Grid command directives on the same element (check [../kendo-angular-component/grid-guidelines.md](../kendo-angular-component/grid-guidelines.md))

---

## Performance Optimization

**Performance Best Practices:**
- `OnPush` change detection strategy where appropriate
- Efficient `trackBy` functions for `*ngFor` with Kendo components
- Minimal unnecessary change detection cycles
- Lazy loading of Kendo UI for Angular components when appropriate
- Virtualization enabled for large datasets in Grid, ListView, and similar components
- Only required Kendo UI for Angular modules/components imported and tree-shaken
- Chart data bound to class properties — never bound to getter methods (getters trigger re-renders on every change detection cycle)

---

## Kendo UI Theme & Styling

- Prioritize Kendo Design System utilities (`k-*` classes)
- Avoid custom CSS or other framework classes
- Do not use inline styles
- Consistent Kendo theme application across all components
- Custom template colors use CSS variables, not hardcoded hex values
- `html, body` styles set `background-color: var(--kendo-body-bg)` and `color: var(--kendo-body-text)` (dark theme completeness)

---

## Accessibility

- Accessibility guidelines retrieved and applied to all components
- WCAG 2.2 Level AA contrast ratios met
- Focus indicators visible and keyboard navigation working
