# Telerik UI for Blazor Plugin

AI coding assistant for building Blazor applications with [Telerik UI for Blazor](https://www.telerik.com/blazor-ui). Provides component documentation, code generation, accessibility guidance, theming, property validation, and layout utilities — powered by the Telerik UI for Blazor MCP server.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) with `dnx` available
- A valid [Telerik UI for Blazor license](https://www.telerik.com/blazor-ui)

## Skills

| Skill | What it does |
|-------|-------------|
| `telerik-blazor-getting-started` | Scaffolds a new Telerik UI for Blazor project or adds it to an existing one |
| `telerik-blazor-ui-generator` | Builds or refines complete pages, dashboards, and UI features end-to-end |
| `telerik-blazor-component` | Retrieves component docs, API reference, and code examples |
| `telerik-blazor-validator` | Validates Razor files for invalid component properties and misconfigured parameters |
| `telerik-blazor-accessibility` | Provides WCAG 2.2 Level AA guidance and component-specific ARIA/keyboard requirements |
| `telerik-blazor-layout` | Retrieves Kendo Design System CSS utility classes for layout and spacing |
| `telerik-blazor-style` | Generates CSS variables and custom themes using the Kendo Design System |
| `telerik-blazor-icon` | Searches the Telerik UI for Blazor icon library |

## Usage

### Set up a project

```
Create a new Telerik UI for Blazor project called my-app with the Bootstrap theme
```
```
Add Telerik UI for Blazor to my existing Blazor project
```

### Build UI

```
/telerik-blazor-plugin:telerik-blazor-ui-generator Generate an order management form with validation
```
```
/telerik-blazor-plugin:telerik-blazor-ui-generator Build a dashboard with a TelerikGrid and charts
```

### Ask about a component

```
How do I use TelerikGrid with server-side paging?
```
```
What parameters does TelerikDatePicker accept?
```

### Validate generated code

```
Validate the Razor file for invalid Telerik component properties
```

Skills are triggered automatically from natural language. You can also invoke them explicitly with a slash command, e.g. `/telerik-blazor-plugin:telerik-blazor-ui-generator`.
