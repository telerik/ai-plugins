#!/usr/bin/env bash
# mcp-sync-check.sh — Lightweight pre-commit check for MCP tool reference staleness.
#
# Reads each plugin's .mcp.json, extracts declared server names, then scans
# staged .md files for tool-name patterns that don't match any known server.
#
# Exit codes:
#   0 — all clear (or no relevant files changed)
#   2 — potential stale MCP references detected (blocking)

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PLUGINS_DIR="$REPO_ROOT/plugins"

if [[ ! -d "$PLUGINS_DIR" ]]; then
  exit 0
fi

# Collect staged .md files under plugins/
staged_files=()
while IFS= read -r f; do
  staged_files+=("$f")
done < <(git diff --cached --name-only --diff-filter=ACM -- 'plugins/**/*.md' 2>/dev/null || true)

if [[ ${#staged_files[@]} -eq 0 ]]; then
  exit 0
fi

warnings=()

for file in "${staged_files[@]}"; do
  # Determine which plugin this file belongs to
  plugin_dir=$(echo "$file" | sed -E 's|^(plugins/[^/]+)/.*|\1|')
  mcp_json="$REPO_ROOT/$plugin_dir/.mcp.json"

  if [[ ! -f "$mcp_json" ]]; then
    continue
  fi

  # Extract server names from .mcp.json keys
  server_names=()
  while IFS= read -r name; do
    server_names+=("$name")
  done < <(grep -oE '"[a-zA-Z0-9_-]+"' "$mcp_json" | head -20 | tr -d '"' | sort -u)

  # Check if the file references tool-like patterns that don't relate to any known server
  # Look for mcp__ prefixed tool calls referencing unknown servers
  while IFS= read -r match; do
    server_ref=$(echo "$match" | sed -E 's/mcp__([^_]+)__.*/\1/' | tr '_' '-')
    found=false
    for s in "${server_names[@]}"; do
      if [[ "$server_ref" == "$s" ]]; then
        found=true
        break
      fi
    done
    if [[ "$found" == "false" ]]; then
      warnings+=("$file: references MCP server '$server_ref' (via '$match') not found in $plugin_dir/.mcp.json")
    fi
  done < <(grep -oE 'mcp__[a-zA-Z0-9_-]+__[a-zA-Z0-9_]+' "$REPO_ROOT/$file" 2>/dev/null || true)
done

if [[ ${#warnings[@]} -gt 0 ]]; then
  echo ""
  echo "⚠️  MCP Sync Check: potential stale tool references detected"
  echo "─────────────────────────────────────────────────────────────"
  for w in "${warnings[@]}"; do
    echo "  • $w"
  done
  echo ""
  echo "Run '@mcp-sync <plugin-path>' to audit and fix tool references."
  echo ""
  # Exit 2 = blocking error for hooks
  exit 2
fi

exit 0
