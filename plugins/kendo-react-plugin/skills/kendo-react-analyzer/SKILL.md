---
name: kendo-react-analyzer
description: >
  Use this skill whenever the user wants to audit, review, or analyze KendoReact component
  usage in their project. Trigger when the user mentions reviewing KendoReact code, finding
  issues with Kendo components, checking prop usage, auditing accessibility or performance
  of KendoReact, or phrases like "what's wrong with my Kendo components", "audit my kendo
  setup", "check my KendoReact code", "review how I'm using Kendo", or "find problems in
  my KendoReact project". Also trigger for general "analyze my React components" requests
  when KendoReact imports are present.
---

## Purpose

This skill teaches how to audit and review KendoReact component usage in a
project — scanning for imports, cross-referencing prop usage against the official
KendoReact API and best practices, and delivering a structured report of issues
and recommendations.

## Audit Checklist

### 1. Discovery
Search the project for imports from `@progress/kendo-react-*` packages:
```
grep -r "@progress/kendo-react" src/ --include="*.tsx" --include="*.ts" -l
```
For each file found, record:
- Which components are imported and from which package
- How each component is configured (props, event handlers, data sources)
- Any inline styles or className overrides applied to KendoReact components

Also check whether any file imports a `@progress/kendo-theme-*` package. A missing
theme import causes all KendoReact components to render completely unstyled — flag
this as a **CRITICAL** finding if absent from the entire project.

### 2. API Validation (per component)
For each distinct component discovered, retrieve the authoritative component API and
validate prop usage, event signatures, and configuration patterns.

Run multiple focused queries when a component has many concerns (props, events,
data-binding, virtualization, etc.) rather than one large query.

### 3. Styling Audit
Flag every `style={{}}` prop on a KendoReact component or its direct container.
Flag hardcoded color/font/spacing values that belong in the theme layer.
The Progress Design System provides utility classes for spacing, typography, and
color that should be used instead of inline styles.

### 4. Accessibility Audit (per component)
For each component, validate ARIA attributes, keyboard navigation, and WCAG 2.2 AA
compliance against authoritative accessibility guidance.

For virtual scrolling fixes always use the string form: `scrollable="virtual"`.

## Report Format

```
## KendoReact Audit Report

### Summary
| Category        | Issues Found |
|-----------------|-------------|
| API / Props     | N           |
| Accessibility   | N           |
| Performance     | N           |
| Styling         | N           |

### Findings

#### [SEVERITY] ComponentName — Short title
**File**: `src/path/to/file.tsx:line`
**Issue**: Clear description of the problem.
**Fix**:
```tsx
// corrected code snippet
```
**Reference**: [KendoReact docs link or API prop name]
```

Severity levels: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`

