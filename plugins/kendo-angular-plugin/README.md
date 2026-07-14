# Kendo UI for Angular Plugin

AI coding assistant for building Angular applications with [Kendo UI for Angular](https://www.telerik.com/kendo-angular-ui). Provides component documentation, code generation, accessibility guidance, theming, and layout utilities — powered by the Kendo UI for Angular MCP server.

## Prerequisites

- [Node.js](https://nodejs.org/) (for `npx`)
- A valid [Kendo UI for Angular license](https://www.telerik.com/kendo-angular-ui)

## Skills

| Skill | What it does |
|-------|-------------|
| `kendo-angular-getting-started` | Scaffolds a new Kendo UI for Angular project or adds it to an existing one |
| `kendo-angular-ui-generator` | Builds or refines complete pages, dashboards, and UI features end-to-end |
| `kendo-angular-component` | Retrieves component docs, API reference, and code examples |
| `kendo-angular-accessibility` | Provides WCAG 2.2 Level AA guidance and component-specific ARIA/keyboard requirements |
| `kendo-angular-layout` | Retrieves Kendo Design System CSS utility classes for layout and spacing |
| `kendo-angular-style` | Generates CSS variables and custom themes using the Kendo Design System |
| `kendo-angular-icon` | Searches the Kendo UI for Angular icon library |
| `kendo-angular-version-upgrade` | Guides Kendo UI for Angular version upgrades, including breaking changes and safe migration paths |
| `kendo-angular-mcp-licensing` | Diagnoses and resolves MCP entitlement failures and `PERMISSION_DENIED` tool-access issues |
| `kendo-angular-product-licensing` | Diagnoses Kendo UI for Angular license activation issues, TKL errors, and watermark/banner failures |

## Usage

### Set up a project

```
Create a new Kendo UI for Angular project called my-app with the Bootstrap theme
```
```
Add Kendo UI for Angular to my existing Angular project
```

### Build UI

```
/kendo-angular-plugin:kendo-angular-ui-generator Build an admin dashboard with a grid, charts, and a sidebar nav
```
```
/kendo-angular-plugin:kendo-angular-ui-generator Create a page with a filterable grid and a date picker toolbar
```

### Ask about a component

```
How do I use the Kendo Angular Grid with virtual scrolling?
```
```
What inputs does the Kendo Angular DatePicker accept?
```

Skills are triggered automatically from natural language. You can also invoke them explicitly with a slash command, e.g. `/kendo-angular-plugin:kendo-angular-ui-generator`.
