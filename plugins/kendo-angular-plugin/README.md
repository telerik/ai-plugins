# Kendo UI for Angular Plugin

AI coding assistant and [MCP server](https://modelcontextprotocol.io) for building Angular applications with [Kendo UI for Angular](https://www.telerik.com/kendo-angular-ui). Provides component documentation, API reference, code generation, accessibility guidance, theming, and layout utilities — powered by the Kendo UI for Angular MCP server.

## Prerequisites

- [Node.js](https://nodejs.org/) (for `npx`)
- A valid [Kendo UI for Angular license](https://www.telerik.com/kendo-angular-ui)

## MCP Server

The plugin registers the Kendo UI for Angular MCP server, distributed as [`@progress/kendo-angular-mcp`](https://www.npmjs.com/package/@progress/kendo-angular-mcp) on npm.

| Property | Value |
|----------|-------|
| npm package | `@progress/kendo-angular-mcp` |
| Transport | stdio |
| Launch command | `npx @progress/kendo-angular-mcp@latest` |

The plugin declares the server in [.mcp.json](.mcp.json) and starts it automatically, so no manual MCP configuration is needed. It requires an active Telerik license.

### Other setup options

The MCP server can also be set up individually with the Kendo CLI or manually in any [MCP-compatible client](https://modelcontextprotocol.io/clients). See [Agentic UI Generator Getting Started](https://www.telerik.com/kendo-angular-ui/components/ai-tools/agentic-ui-generator/getting-started) and the [AI Tools overview](https://www.telerik.com/kendo-angular-ui/components/ai-tools/agentic-ui-generator). Do not run the plugin and a separately configured MCP server together, as this can cause conflicts and increased token usage.

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
