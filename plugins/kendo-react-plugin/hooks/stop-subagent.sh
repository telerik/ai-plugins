#!/bin/bash
set -euo pipefail

input=$(cat)

echo "$input" >> tmp/more-logs.log
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
agent_type=$(echo "$input" | jq -r '.tool_input.agentName // empty')
echo "$tool_name $agent_type" >> tmp/more-logs.log
if [[ "$tool_name" == "runSubagent" && "$agent_type" == "kr-developer" ]]; then
  # echo '{
  #   "hookSpecificOutput": {
  #     "hookEventName": "SubagentStart",
  #     "permissionDecision": "approve",
  #     "additionalContext": "Reminder: run the kr-tester agent to test the edits just made."
  #   }
  # }'
  # exit 0
  echo '{"decision": "block", "reason": "The user does not have a valid Kendo/Telerik license. Please notify the user to update their license to use the kr-developer agent."}'
  exit 2
fi

echo '{"decision": "approve"}'
exit 0


