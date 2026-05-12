# Kendo UI for Angular — ListView Guidelines

## kendoButton Must Not Be Combined with Command Directives

Never apply `kendoButton` to the same element as any of these ListView command directives — they render their own button internally. Placing `kendoButton` on the same host element introduces a second component on the same node, which Angular does not allow and causes a runtime error.

**Affected directives:**
- `kendoListViewAddCommand`
- `kendoListViewEditCommand`
- `kendoListViewSaveCommand`
- `kendoListViewCancelCommand`
- `kendoListViewRemoveCommand`

```html
<!-- WRONG -->
<button kendoListViewAddCommand kendoButton>Add</button>

<!-- CORRECT -->
<button kendoListViewAddCommand>Add</button>
```
