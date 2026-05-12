# Kendo UI for Angular — TreeList Guidelines

## kendoButton Must Not Be Combined with Command Directives

Never apply `kendoButton` to the same element as any of these TreeList command directives — they render their own button internally. Placing `kendoButton` on the same host element introduces a second component on the same node, which Angular does not allow and causes a runtime error.

**Affected directives:**
- `kendoTreeListExcelCommand`
- `kendoTreeListPDFCommand`

```html
<!-- WRONG -->
<button kendoTreeListExcelCommand kendoButton>Export to Excel</button>

<!-- CORRECT -->
<button kendoTreeListExcelCommand>Export to Excel</button>
```
