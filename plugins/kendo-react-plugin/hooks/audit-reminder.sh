#!/bin/bash
set -euo pipefail

# Audit Reminder Hook (SubagentStop)
# After the kr-developer agent finishes, checks if code files were modified
# and reminds the user to run /kendo-audit.
# Cross-tool compatible: works in both Claude Code and VS Code Copilot.

input=$(cat)

# Extract transcript path to check for code modifications
transcript_path=$(echo "$input" | jq -r '.transcript_path // empty')

if [[ -z "$transcript_path" || ! -f "$transcript_path" ]]; then
  # No transcript available - approve silently
  echo '{"decision": "approve"}'
  exit 0
fi

# Check if code files were written or edited during the session
# Look for common code file extensions in tool outputs
CODE_PATTERN='\.(ts|tsx|js|jsx|css|scss|sass|less|html|json|vue|svelte)'

if grep -qEi "$CODE_PATTERN" "$transcript_path" 2>/dev/null; then
  # Code files were touched - remind user to audit
  echo '{"decision": "block", "reason": "Development session complete. Ask the kr-reviewer agent to check your code for KendoReact best practices, accessibility, and performance."}'
  exit 0
fi

# No code modifications detected - approve silently
echo '{"decision": "approve"}'
exit 0
