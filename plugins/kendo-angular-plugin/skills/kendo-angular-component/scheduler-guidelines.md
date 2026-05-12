# Kendo UI for Angular — Scheduler Guidelines

## kendoButton Must Not Be Combined with Command Directives

Never apply `kendoButton` to the same element as the Scheduler PDF command directive — it renders its own button internally. Placing `kendoButton` on the same host element introduces a second component on the same node, which Angular does not allow and causes a runtime error.

**Affected directives:**
- `kendoSchedulerPDFCommand`

```html
<!-- WRONG -->
<button kendoSchedulerPDFCommand kendoButton>Export to PDF</button>

<!-- CORRECT -->
<button kendoSchedulerPDFCommand>Export to PDF</button>
```
