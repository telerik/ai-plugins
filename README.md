# Telerik AI Plugins

A collection of AI coding agent plugins for [Claude Code](https://code.claude.com), [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli), and [VS Code Copilot](https://code.visualstudio.com/docs/copilot/overview) that bring Progress / Telerik UI component expertise directly into your development workflow.

## Plugins

| Plugin | Description |
|--------|-------------|
| [`telerik-blazor-plugin`](plugins/telerik-blazor-plugin/) | AI-powered Telerik UI for Blazor development — component implementation, code analysis, property validation, theming, testing, and migration |
| [`kendo-react-plugin`](plugins/kendo-react-plugin/) | AI-powered KendoReact development — component implementation, code analysis, accessibility, theming, testing, migration, and advanced styling |
| [`kendo-angular-plugin`](plugins/kendo-angular-plugin/) | AI-powered Kendo UI for Angular development — orchestration, component documentation, layout utilities, theming, icons, and accessibility assistance |

---

## Plugin Structure

Every plugin follows a standard directory layout:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json        # Required: plugin manifest (name, version, description)
├── skills/                # Agent skills — each in its own subdirectory
│   └── skill-name/
│       └── SKILL.md       # Skill instructions with YAML frontmatter
├── .mcp.json              # MCP server definitions
└── README.md
```

---

## How It Works

Each plugin is a thin AI layer that wraps a **Progress MCP server** — a backend process that gives your coding agent live access to component documentation, APIs, and code generation for the respective product. The MCP server is started automatically when you register the plugin with your agent; no manual setup is required.

Using the plugins to write or generate code requires a valid **Progress product license** for the underlying UI library:

| Plugin | Product | Link |
|--------|---------|---------|
| `telerik-blazor-plugin` | Telerik UI for Blazor | [Telerik UI for Blazor](https://www.telerik.com/blazor-ui) |
| `kendo-react-plugin` | KendoReact | [KendoReact](https://www.telerik.com/kendo-react-ui) |
| `kendo-angular-plugin` | Kendo UI for Angular | [Kendo UI License]https://www.telerik.com/kendo-angular-ui) |

---

## Prerequisites

| Plugin | Requirement |
|--------|-------------|
| `telerik-blazor-plugin` | [.NET SDK](https://dotnet.microsoft.com/download) with `dnx` available |
| `kendo-react-plugin` | [Node.js](https://nodejs.org/) (for `npx`) |
| `kendo-angular-plugin` | [Node.js](https://nodejs.org/) (for `npx`) |

---

## Using a Plugin Locally

Clone this repository and use the path to a specific plugin directory when registering it with your coding agent. No GitHub repo or marketplace required.

### Claude Code

Pass the plugin directory with the `--plugin-dir` flag:

```bash
claude --plugin-dir ./plugins/kendo-react-plugin
```

Load multiple plugins in the same session:

```bash
claude --plugin-dir ./plugins/kendo-react-plugin \
       --plugin-dir ./plugins/telerik-blazor-plugin
```

While a session is running, reload plugins after making changes:

```
/reload-plugins
```

### GitHub Copilot CLI

Install directly from the local path:

```bash
copilot plugin install ./plugins/kendo-react-plugin
```

To refresh the plugins when editing you can either exit and re-open or run 

```
/restart
```

### VS Code Copilot

Add the plugin's absolute path to your `settings.json`. Set the value to `true` to enable it, or `false` to register it as disabled:

```json
"chat.pluginLocations": {
    "/absolute/path/to/plugins-test/plugins/kendo-react-plugin": true,
    "/absolute/path/to/plugins-test/plugins/telerik-blazor-plugin": true
}
```

Open **Settings** (`Cmd+,` / `Ctrl+,`), search for `chat.pluginLocations`, and add your entries there, or edit `settings.json` directly.

Typically, VSCode updates the plugins on new instance. But if you have doubts you can either restart VSCode or run `Developer: Reload Window`.