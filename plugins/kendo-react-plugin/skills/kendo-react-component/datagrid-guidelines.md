# KendoReact DataGrid — Deprecated Properties

## Deprecated Properties and Modern Replacements

When implementing the DataGrid component, **never use deprecated properties**. Always use their modern replacements listed below.

| Deprecated | Modern Replacement |
|---|---|
| `selectedField` | Use the `select` state property |
| `editField` | Use the `edit` state property |
| `expandedField` | Use the `detailExpand` state property |
| `onExpandChange` | Use `onDetailExpandChange` (detail-row expansion) or `onGroupExpandChange` (group expansion) |
| `cellRender` | Use `cells={{ data: CustomCell }}` prop |
| `rowRender` | Use `rows={{ data: CustomRow }}` prop |
| `filterCellRender` | Use `cells={{ filterCell: CustomCell }}` prop |
| `headerCellRender` | Use `cells={{ headerCell: CustomHeaderCell }}` prop |
| `column.cell` | Use `column.cells={{ data: CustomCell }}` prop |
| `column.headerCell` | Use `column.cells={{ headerCell: CustomHeaderCell }}` prop |
| `column.filterCell` | Use `column.cells={{ filterCell: CustomCell }}` prop |
| `column.footerCell` | Use `column.cells={{ footerCell: CustomFooterCell }}` prop |

## Additional Modern Updates

- The `Input` component in Column Menu Filter has been replaced with `Textbox`
- The `scrollable` prop now defaults to `virtual`
- Virtual scrolling no longer applies height by default

## Rules

- **Never suggest or use deprecated properties** in DataGrid examples
- Always provide modern alternatives when users ask about these properties
- Explain that these properties are deprecated and provide the specific modern replacement
- Focus on current DataGrid API patterns using state properties and `cells`/`rows` props

**Example:**
```tsx
// ❌ Deprecated
<Grid selectedField="isSelected" editField="inEdit" />

// ✅ Modern
// Use select and edit state properties with proper configuration
```
