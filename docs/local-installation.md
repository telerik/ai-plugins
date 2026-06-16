# Installation

## Prerequisites

| Plugin | Requirement |
|--------|-------------|
| `telerik-blazor-plugin` | [.NET SDK](https://dotnet.microsoft.com/download) with `dnx` available |
| `kendo-react-plugin` | [Node.js](https://nodejs.org/) (for `npx`) |
| `kendo-angular-plugin` | [Node.js](https://nodejs.org/) (for `npx`) |

---

## Claude Code

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

## GitHub Copilot CLI

```bash
copilot plugin install ./plugins/kendo-react-plugin
```

To refresh after changes, exit and re-open or run `/restart`.

## VS Code Copilot

### From the marketplace

1. Open VS Code settings (`Cmd+,` / `Ctrl+,`) and search for `chat.marketplaces`
2. Add the `telerik/ai-plugins` marketplace
3. Press `F1` and select **Chat: Manage Plugin Marketplaces**
4. Select `telerik/ai-plugins` → **Show plugins**
5. In the **Agent Plugins** tab, install the desired plugin

### Local / dev setup

Add the plugin's absolute path to your `settings.json`. Set the value to `true` to enable it, or `false` to disable it:

```json
"chat.pluginLocations": {
    "/absolute/path/to/ai-plugins/plugins/kendo-react-plugin": true,
    "/absolute/path/to/ai-plugins/plugins/telerik-blazor-plugin": true
}
```

Open **Settings** (`Cmd+,` / `Ctrl+,`), search for `chat.pluginLocations`, and add your entries there, or edit `settings.json` directly. VS Code picks up changes on the next window reload (`Developer: Reload Window`).
