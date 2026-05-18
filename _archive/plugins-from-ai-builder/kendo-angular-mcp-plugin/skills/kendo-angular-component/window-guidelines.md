# Kendo UI for Angular — Window Guidelines

## kendoButton Must Not Be Combined with Action Directives

Never apply `kendoButton` to the same element as any of these Window action directives — they render their own button internally. Placing `kendoButton` on the same host element introduces a second component on the same node, which Angular does not allow and causes a runtime error.

**Affected directives:**
- `kendoWindowCloseAction`
- `kendoWindowMaximizeAction`
- `kendoWindowMinimizeAction`
- `kendoWindowRestoreAction`

```html
<!-- WRONG -->
<button kendoWindowCloseAction kendoButton></button>

<!-- CORRECT -->
<button kendoWindowCloseAction></button>
```
