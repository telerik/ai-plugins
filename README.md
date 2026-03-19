# Telerik AI Plugins

A collection of AI coding agent plugins for [Claude Code](https://code.claude.com), [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli), and [VS Code Copilot](https://code.visualstudio.com/docs/copilot/overview) that bring Progress / Telerik UI component expertise directly into your development workflow.

## Plugins

| Plugin | Description |
|--------|-------------|
| [`kendo-react-plugin`](plugins/kendo-react-plugin/) | AI-powered KendoReact development — component implementation, code analysis, accessibility, theming, testing, migration, and advanced styling |
| [`telerik-blazor-plugin`](plugins/telerik-blazor-plugin/) | AI-powered Telerik UI for Blazor development — component implementation, code analysis, property validation, theming, testing, and migration |

Draft plugins (in progress):

| Plugin | Description |
|--------|-------------|
| [`[draft]-kendo-angular-skills`](plugins/[draft]-kendo-angular-skills/) | Skills for KendoReact Angular workflows |
| [`[draft]-migration-helper`](plugins/[draft]-migration-helper/) | Cross-framework migration utilities |

---

## Plugin Structure

Every plugin follows a standard directory layout:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json        # Required: plugin manifest (name, version, description)
├── commands/              # User-invokable slash commands (.md files)
├── agents/                # Custom agent definitions (.md files)
├── skills/                # Agent skills — each in its own subdirectory
│   └── skill-name/
│       └── SKILL.md       # Skill instructions with YAML frontmatter
├── hooks/
│   └── hooks.json         # Lifecycle hooks (PostToolUse, PreToolUse, etc.)
├── .mcp.json              # MCP server definitions
└── README.md
```

> **Important:** `commands/`, `agents/`, `skills/`, and `hooks/` must sit at the **plugin root**, not inside `.claude-plugin/`. Only `plugin.json` goes inside `.claude-plugin/`.

### Plugin manifest

Create `.claude-plugin/plugin.json` to declare the plugin's identity:

```json
{
  "name": "my-plugin",
  "description": "What this plugin does",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

### Skills

Skills live in `skills/<skill-name>/SKILL.md`. The folder name becomes the skill identifier, namespaced under the plugin name (e.g. `/my-plugin:skill-name`). Each `SKILL.md` requires a YAML frontmatter block:

```markdown
---
name: skill-name
description: Brief description — used by the agent to decide when to invoke this skill
---

Detailed instructions for the agent...
```

### Agents

Agents are `.md` files in the `agents/` directory. They define a persona, system prompt, tool restrictions, and can delegate to skills.

### Commands

Commands are `.md` files in the `commands/` directory. They are user-invokable via `/plugin-name:command-name` and typically hand off to a specific agent.

### MCP Servers

Declare MCP servers in `.mcp.json` at the plugin root. Use `${CLAUDE_PLUGIN_ROOT}` to reference paths relative to the plugin directory:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "${CLAUDE_PLUGIN_ROOT}/scripts/server.js",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  }
}
```

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