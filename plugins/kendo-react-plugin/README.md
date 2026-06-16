# KendoReact Plugin

AI coding assistant for building React applications with [KendoReact](https://www.telerik.com/kendo-react-ui). Provides component documentation, code generation, accessibility guidance, theming, and layout utilities — powered by the KendoReact MCP server.

## Prerequisites

- [Node.js](https://nodejs.org/) (for `npx`)
- A valid [KendoReact license](https://www.telerik.com/kendo-react-ui)

## Skills

| Skill | What it does |
|-------|-------------|
| `kendo-react-getting-started` | Scaffolds a new KendoReact project or adds KendoReact to an existing one |
| `kendo-react-ui-generator` | Builds or refines complete pages, dashboards, and UI features end-to-end |
| `kendo-react-component` | Retrieves component docs, API reference, and code examples |
| `kendo-react-accessibility` | Provides WCAG 2.2 Level AA guidance and component-specific ARIA/keyboard requirements |
| `kendo-react-layout` | Retrieves Kendo Design System CSS utility classes for layout and spacing |
| `kendo-react-style` | Generates CSS variables and custom themes using the Kendo Design System |
| `kendo-react-icon` | Searches the KendoReact icon library |

## Usage

### Set up a project

```
Create a new KendoReact project called my-app with the Material theme
```
```
Add KendoReact to my existing React project
```

### Build UI

```
/kendo-react-plugin:kendo-react-ui-generator Build an admin dashboard with a data grid, charts, and a sidebar nav
```
```
/kendo-react-plugin:kendo-react-ui-generator Generate an order form with validation and a date picker
```

### Ask about a component

```
How do I use the KendoReact DataGrid with server-side paging?
```
```
What props does the KendoReact DatePicker accept?
```

Skills are triggered automatically from natural language. You can also invoke them explicitly with a slash command, e.g. `/kendo-react-plugin:kendo-react-ui-generator`.
