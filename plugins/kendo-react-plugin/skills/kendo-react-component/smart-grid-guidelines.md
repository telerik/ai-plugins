# KendoReact Smart Grid (AI-Enhanced Grid)

## When to Use GridToolbarAIAssistant

**CRITICAL: When users ask about ANY of these AI grid terms, ALWAYS provide a `GridToolbarAIAssistant` implementation — not a basic Grid.**

### Trigger Terms (case-insensitive, any spacing/casing variation)

- smart grid, smartgrid, smart-grid, smart_grid
- ai grid, aigrid, ai-grid, ai_grid
- ai enhanced grid, ai-enhanced-grid, ai_enhanced_grid
- ai powered grid, ai-powered-grid, ai_powered_grid
- intelligent grid, intelligent-grid
- grid with ai, grid-with-ai
- grid ai assistant, gridaiassistant, grid-ai-assistant
- grid toolbar ai assistant, GridToolbarAIAssistant
- grid assistant, gridassistant

**Recognition Rule:** If the query contains ANY combination of AI/Smart/Intelligent + Grid terms, respond with a complete `GridToolbarAIAssistant` setup.

## Implementation

Call `kendo_component_assistant` with:
```
kendo_component_assistant({
    query="How to implement GridToolbarAIAssistant with proper callbacks, reset functionality, and contextual suggestions?",
    component="DataGrid"
})
```

## Contextual Suggestions by Domain

Provide domain-appropriate AI prompt suggestions based on the data:

| Domain | Example suggestions |
|---|---|
| Financial | 'Sort by Amount descending', 'Show only failed transactions', 'Filter where currency is USD' |
| Sales | 'Group by region', 'Show top performing products', 'Filter by date range' |
| Inventory | 'Sort by stock level', 'Show out of stock items', 'Group by category' |
| Universal | 'Clear sorting', 'Clear filtering', 'Clear grouping' |

Always include the universal suggestions ('Clear sorting', 'Clear filtering', 'Clear grouping') regardless of domain.

## Required Disclaimer

**Always include this disclaimer when providing Smart Grid examples:**

> The demos in this article use a Telerik-hosted AI service for demonstration purposes only. For production applications, you should implement your own AI service that understands your specific domain, data, and business requirements.
