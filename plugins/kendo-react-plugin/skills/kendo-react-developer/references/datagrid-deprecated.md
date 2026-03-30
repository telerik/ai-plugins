# KendoReact DataGrid — Deprecated Properties Reference

**Critical knowledge for any Grid/DataGrid implementation.** The following properties are deprecated and must never be used:

| Deprecated Property | Modern Replacement |
|---------------------|--------------------|
| `selectedField` | Use the `select` state property |
| `editField` | Use the `edit` state property |
| `expandedField` | Use the `detailExpand` state property |
| `onExpandChange` | Use `onDetailExpandChange` (detail-row) or `onGroupExpandChange` (group) |
| `cellRender` | Use `cells={{ data: CustomCell }}` prop |
| `rowRender` | Use `rows={{ data: CustomRow }}` prop |
| `filterCellRender` | Use `cells={{ filterCell: CustomCell }}` prop |
| `headerCellRender` | Use `cells={{ headerCell: CustomHeaderCell }}` prop |
| `column.cell` | Use `column.cells={{ data: CustomCell }}` prop |
| `column.headerCell` | Use `column.cells={{ headerCell: CustomHeaderCell }}` prop |
| `column.filterCell` | Use `column.cells={{ filterCell: CustomCell }}` prop |
| `column.footerCell` | Use `column.cells={{ footerCell: CustomFooterCell }}` prop |

## Additional Modern DataGrid Updates
- `Input` component in Column Menu Filter → replaced with `Textbox`
- `scrollable` prop now defaults to `virtual`
- Virtual scrolling no longer applies height by default
