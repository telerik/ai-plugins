# Kendo UI for Angular — Grid Guidelines

## Grid Data Binding

**MUST** use `kendoGridBinding` directive for basic Grid operations. **MUST** respect existing manual data binding patterns in user code.

Always use `kendoGridBinding` for:
- Simple data display with sorting, filtering, and paging
- Automatic data operations handling
- Standard Grid implementations

```html
<kendo-grid [kendoGridBinding]="data">
```

## Manual Data Binding

When using manual binding (without `kendoGridBinding`), every enabled Grid data operation requires a corresponding event handler that applies the operation to the data manually.

The `@progress/kendo-data-query` package provides matching helpers (`filterBy()`, `orderBy()`, `process()`) that can be used directly inside these handlers. When multiple data operations are enabled at once, the preferred approach is a single `dataStateChange` handler using the `process()` helper.

**Filtering example:**
```typescript
import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';

onFilterChange(filter: CompositeFilterDescriptor): void {
  this.gridData = filterBy(this.sourceData, filter);
}
```

```html
<kendo-grid [data]="gridData" [filterable]="true" (filterChange)="onFilterChange($event)">
```

## kendoButton Must Not Be Combined with Command Directives

Never apply `kendoButton` to the same element as any of these Grid command directives — they render their own button internally. Placing `kendoButton` on the same host element introduces a second component on the same node, which Angular does not allow and causes a runtime error.

**Affected directives:**
- `kendoGridExcelCommand`
- `kendoGridCSVCommand`
- `kendoGridPDFCommand`
- `kendoGridAddCommand`
- `kendoGridEditCommand`
- `kendoGridSaveCommand`
- `kendoGridCancelCommand`
- `kendoGridRemoveCommand`

```html
<!-- WRONG -->
<button kendoGridExcelCommand kendoButton>Export to Excel</button>

<!-- CORRECT -->
<button kendoGridExcelCommand>Export to Excel</button>
```

## Smart Grid (AI-Enhanced) Instructions

When the user requests Kendo's built-in AI grid features like "smart grid", "ai grid", "intelligent grid", or "AI Assistant tool":

Always implement:
1. Complete `kendoGridAIAssistantTool` setup
2. Domain-specific suggestion examples
3. Include disclaimer

**Suggestion Examples by Domain:**
- Financial: "Sort by Amount descending", "Show failed transactions", "Filter USD currency"
- Sales: "Group by region", "Show top products", "Filter by date range"
- Inventory: "Sort by stock level", "Show out of stock", "Group by category"
- Universal: "Clear sorting/filtering/grouping"

**Required Disclaimer:**
> "The examples use a Telerik-hosted AI service for demonstration purposes only. For production applications, use an AI service that understands your specific domain, data, and business requirements."
