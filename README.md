# Telerik AI Plugins

AI coding agent plugins for [Claude Code](https://code.claude.com), [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli), and [VS Code Copilot](https://code.visualstudio.com/docs/copilot/overview) that bring Progress / Telerik UI component expertise directly into your development workflow.

## Plugins

| Plugin | Description |
|--------|-------------|
| [`telerik-blazor-plugin`](plugins/telerik-blazor-plugin/) | Telerik UI for Blazor — component implementation, validation, theming, testing, and migration |
| [`kendo-react-plugin`](plugins/kendo-react-plugin/) | KendoReact — component implementation, accessibility, theming, testing, migration, and styling |
| [`kendo-angular-plugin`](plugins/kendo-angular-plugin/) | Kendo UI for Angular — component documentation, layout utilities, theming, icons, and accessibility |

## How It Works

Each plugin wraps a **Progress MCP server** that gives your coding agent live access to component documentation, APIs, and code generation. The MCP server starts automatically — no manual setup required.

A valid **Progress product license** is required to use the plugins:

| Plugin | License |
|--------|---------|
| `telerik-blazor-plugin` | [Telerik UI for Blazor](https://www.telerik.com/blazor-ui) |
| `kendo-react-plugin` | [KendoReact](https://www.telerik.com/kendo-react-ui) |
| `kendo-angular-plugin` | [Kendo UI for Angular](https://www.telerik.com/kendo-angular-ui) |

## Getting Started

Add the `telerik/ai-plugins` marketplace to your agent, then install the plugin you need.

**Claude Code**
```shell
/plugin marketplace add telerik/ai-plugins
/plugin install kendo-react-plugin@ai-plugins
```

**GitHub Copilot CLI**
```bash
copilot plugin marketplace add telerik/ai-plugins
copilot plugin install kendo-react-plugin@ai-plugins
```

**VS Code Copilot** *(Agent Plugins is a preview feature — requires VS Code 1.100+ with `chat.plugins.enabled: true`)* — add to `settings.json`, then browse `@agentPlugins` in the Extensions view and click **Install**:
```json
"chat.plugins.marketplaces": ["telerik/ai-plugins"]
```

For full setup instructions and local dev configuration see [docs/local-installation.md](docs/local-installation.md).

## Using the Skills

Once a plugin is installed, you interact with it by invoking its skills directly in your agent chat.

Skills are typically invoked automatically when the agent recognises a relevant prompt. You can also trigger them explicitly using the `/plugin-name:skill-name` hashtag (e.g. `/kendo-react-plugin:kendo-react-ui-generator`).

### Set Up a New Project

Use the `getting-started` skill to scaffold a brand-new project or add the library to an existing one:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-getting-started` |
| `kendo-angular-plugin` | `kendo-angular-getting-started` |
| `telerik-blazor-plugin` | `telerik-blazor-getting-started` |

**Example prompts:**
```
Create a new KendoReact project called my-app with the Material theme
```
```
Add KendoReact to my existing project
```
```
Set up a new Telerik Blazor project called my-blazor-app --theme=bootstrap
```

Or forcefully run the getting-started skill workflow by using slash command: 
```
/kendo-react-plugin:kendo-react-getting-started Create a new KendoReact project called my-app with the Material theme
```

### Build UI

Use the `ui-generator` skill to build or refine complete pages, sections, forms, and dashboards:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-ui-generator` |
| `kendo-angular-plugin` | `kendo-angular-ui-generator` |
| `telerik-blazor-plugin` | `telerik-blazor-ui-generator` |

To ensure that the ui-generator skill is relevant for the task it is prefered to invoke it as a slash command.

**Example prompts:**
```
/kendo-react-plugin:kendo-react-ui-generator Build a KendoReact admin dashboard with a data grid, charts, and a sidebar nav
```
```
/telerik-blazor-plugin:telerik-blazor-ui-generator Generate a Telerik Blazor order management form with validation
```
```
/kendo-angular-plugin:kendo-angular-ui-generator Create an Angular page with a filterable Kendo Grid and a date picker toolbar
``` 

### Explore Components

Use the `component` skill to retrieve documentation, API reference, and code examples for any specific component (Grid, Chart, Scheduler, DatePicker, DropDownList, Form, and more):

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-component` |
| `kendo-angular-plugin` | `kendo-angular-component` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-component Create a Grid with paging, sorting, and filtering for a product catalog with name, price, category, and actions columns
```
```
/kendo-angular-plugin:kendo-angular-component How do I enable virtual scrolling and Excel export on the Kendo Grid?
```

### Add Layout and Spacing

Use the `layout` skill to retrieve Kendo Design System CSS utility classes for page structure, spacing, flexbox/grid, and responsive behavior. Call it before writing custom layout CSS:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-layout` |
| `kendo-angular-plugin` | `kendo-angular-layout` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-layout Add a responsive section with a dashboard card showing KPIs next to a compact card with a recent alert, using proper spacing and typography
```
```
/kendo-angular-plugin:kendo-angular-layout Convert this desktop-first dashboard into a responsive layout that works on tablet and mobile
```

### Style and Theme

Use the `style` skill to generate CSS variables and custom themes from a natural language description of the desired visual style, including dark mode and high-contrast variants:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-style` |
| `kendo-angular-plugin` | `kendo-angular-style` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-style Generate a custom theme for a corporate blue and green color scheme with high contrast accessibility requirements
```
```
/kendo-angular-plugin:kendo-angular-style Create a dark mode theme with a dark background, light text, and subtle border radius on cards and buttons
```

### Find Icons

Use the `icon` skill to search the icon library by name, action, or concept and get matching icons with usage details:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-icon` |
| `kendo-angular-plugin` | `kendo-angular-icon` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-icon Add icons suitable for the Home, Settings, and User Profile buttons in my navigation bar
```
```
/kendo-angular-plugin:kendo-angular-icon Find icons for export, print, refresh, and search actions in a dashboard toolbar
```

### Improve Accessibility

Use the `accessibility` skill for WCAG 2.2 Level AA guidance and component-specific ARIA, keyboard navigation, focus management, and screen reader requirements:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-accessibility` |
| `kendo-angular-plugin` | `kendo-angular-accessibility` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-accessibility My Grid has a custom cell template with multiple buttons. How do I make keyboard navigation work for the focusable elements inside the cell?
```
```
/kendo-angular-plugin:kendo-angular-accessibility How can I improve accessibility for screen reader users navigating a Grid that displays employee data?
```

### Upgrade Versions

Use the `version-upgrade` skill to guide major version upgrades, including breaking changes, rendering changes, framework compatibility, and safe upgrade planning:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-version-upgrade` |
| `kendo-angular-plugin` | `kendo-angular-version-upgrade` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-version-upgrade Upgrade my project to the latest KendoReact major version and resolve any breaking changes
```
```
/kendo-angular-plugin:kendo-angular-version-upgrade What breaking changes should I expect when upgrading Kendo UI for Angular, and how do I plan the migration?
```

### Manage Licensing

Use the `licensing` skill to understand how license verification works, how to set up your license key, and how to troubleshoot license-related issues:

| Plugin | Skill |
|--------|-------|
| `kendo-react-plugin` | `kendo-react-product-licensing` |
| `kendo-angular-plugin` | `kendo-angular-product-licensing` |

**Example prompts:**
```
/kendo-react-plugin:kendo-react-product-licensing How do I set up my KendoReact license key and why am I seeing a license warning?
```
```
/kendo-angular-plugin:kendo-angular-product-licensing Help me troubleshoot an invalid license error in my Kendo UI for Angular project
```


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for plugin structure, template rendering, and versioning.