# Kendo UI for Angular — Charts Guidelines

## Charts Data Binding

Never bind the Chart's data to a getter property. Using a getter causes the chart to re-render on every Angular change detection cycle.

```typescript
// BAD — getter triggers re-render on every change detection cycle
get chartData() { return [ /* data items */ ] }

// GOOD — public class property
public chartData = [ /* data items */ ];

// GOOD — computed once from source data
public chartData = this.data.map(item => /* transform */);
```

This applies to all Chart variants: `kendo-chart`, `kendo-sparkline`, `kendo-stockchart`, and `kendo-sankey`.
