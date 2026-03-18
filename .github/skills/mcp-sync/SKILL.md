---
name: mcp-sync
description: "Audit and sync MCP tool references in plugin files against actual MCP server configurations. Use when validating tool names, checking for stale MCP calls, syncing tool definitions after server changes, or phrases like 'sync MCP tools', 'validate tool references', 'check MCP schema'. Returns a structured diff report and optionally applies fixes."
argument-hint: "Path to a plugin directory (e.g., plugins/kendo-react-plugin)"
---

# MCP Sync

Validate that MCP tool references in a plugin's commands, skills, and agents match the
tools actually exposed by the configured MCP servers.

## When to Use

- After adding, removing, or renaming an MCP server in `.mcp.json`
- After an MCP server package is updated (tools may have been added/removed/renamed)
- As a pre-flight check before committing plugin file changes
- When another agent needs to verify tool references are correct

## Procedure

### 1. Identify the plugin

Use the provided path argument, or list `plugins/` and ask the user.
Confirm that `<plugin-path>/.mcp.json` exists.

### 2. Build the source-of-truth tool inventory

Read `<plugin-path>/.mcp.json` to get the server names and packages.

For each server, discover its actual tools using `tool_search_tool_regex` with the
pattern `mcp_<server_name>` (replace hyphens with underscores in the server name).

Record each tool's full name and description. If a server is unavailable, mark it
`⚠ UNAVAILABLE` and skip — never guess tool names.

### 3. Scan plugin files for tool references

Search all `.md` files in the plugin's `commands/`, `skills/`, and `agents/` directories.

Match these patterns:
- Bare tool names: `kendo_component_assistant`, `browser-navigate`
- Qualified names: `server-name.tool_name`
- MCP-prefixed: `mcp__server-name__tool_name`
- `#tool:` syntax
- Frontmatter `tools:` arrays
- Server name mentions in prose

### 4. Cross-reference and classify

Compare scanned references against the tool inventory:

| Status | Icon | Meaning |
|--------|------|---------|
| Valid | ✅ | Reference matches an actual tool |
| Stale | ❌ | No matching tool found |
| Renamed | 🔄 | Close match to an actual tool (fuzzy) |
| Undocumented | ➕ | Actual tool not referenced in any file |
| Inconsistent | ⚠️ | Same tool named differently across files |
| Server missing | 🔌 | References a server not in `.mcp.json` |

### 5. Produce the report

Output a markdown report grouped by file, with a summary table at the end:

```
## MCP Sync Report: <plugin-name>

### <file-path>
  ✅ tool_name — matches <server> tool
  ❌ old_tool_name — no match
  🔄 old_tool_name → new_tool_name (likely rename)

### Summary
  ✅ Valid: N    ❌ Stale: N    🔄 Renames: N
  ➕ Undocumented: N    ⚠️ Inconsistent: N
```

### 6. Apply fixes (if requested)

When invoked by the `mcp-sync` agent or when the user confirms, update tool names
in the affected files:
- Replace stale names with correct names
- Standardize naming to match the plugin's existing convention
- Add undocumented tools to the most relevant file section
- Preserve all surrounding prose and formatting

### 7. Verify

Re-run scan after fixes to confirm all references resolve to ✅.
