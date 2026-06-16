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

### Set up a new project

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for plugin structure, template rendering, and versioning.