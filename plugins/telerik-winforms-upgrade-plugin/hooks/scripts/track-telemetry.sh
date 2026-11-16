#!/usr/bin/env bash

write_success() {
    printf '%s\n' '{"continue":true}'
    exit 0
}

if [ "${TELERIK_TELEMETRY_OFF:-}" = "1" ]; then
    write_success
fi

EVENT="${1:-}"
case "$EVENT" in
    session_start|skill_read|session_end) ;;
    *) write_success ;;
esac

INPUT=$(cat 2>/dev/null || true)
if [ -z "$INPUT" ]; then
    write_success
fi

has_python3() {
    command -v python3 >/dev/null 2>&1 && python3 -c 'import sys' >/dev/null 2>&1
}

extract_field() {
    local json="$1"
    shift
    local key

    if has_python3; then
        printf '%s' "$json" | KEYS="$*" python3 -c '
import json
import os
import sys

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

keys = os.environ.get("KEYS", "").split()
sources = [data, data.get("tool_input") if isinstance(data, dict) else None,
           data.get("toolArgs") if isinstance(data, dict) else None]

for key in keys:
    for source in sources:
        if isinstance(source, str):
            try:
                source = json.loads(source)
            except Exception:
                continue
        if isinstance(source, dict):
            value = source.get(key)
            if isinstance(value, (str, int, float)) and str(value):
                print(value)
                sys.exit(0)
' 2>/dev/null
        return
    fi

    for key in "$@"; do
        local value
        value=$(printf '%s' "$json" \
            | tr -d '\n' \
            | grep -oE "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" \
            | head -n 1 \
            | sed -E "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"([^\"]*)\".*/\1/")
        if [ -n "$value" ]; then
            printf '%s' "$value"
            return
        fi
    done
}

normalize_path() {
    local value="${1//\\//}"
    value=$(printf '%s' "$value" | sed -E 's#/{2,}#/#g')

    case "$value" in
        [A-Za-z]:/*)
            local drive
            local rest
            drive=$(printf '%s' "${value:0:1}" | tr '[:upper:]' '[:lower:]')
            rest="${value:2}"
            printf '/%s%s' "$drive" "$rest"
            ;;
        *)
            printf '%s' "$value"
            ;;
    esac
}

utc_now() {
    if has_python3; then
        python3 -c 'from datetime import datetime, timezone; print(datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"))'
    else
        date -u '+%Y-%m-%dT%H:%M:%SZ'
    fi
}

normalize_timestamp() {
    local value="$1"

    if [ -z "$value" ]; then
        utc_now
        return
    fi

    if [[ "$value" =~ ^[0-9]+$ ]] && has_python3; then
        python3 -c 'from datetime import datetime, timezone; import sys; print(datetime.fromtimestamp(int(sys.argv[1]) / 1000, timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"))' "$value" 2>/dev/null || printf '%s' "$value"
    else
        printf '%s' "$value"
    fi
}

safe_session_id() {
    local value
    value=$(printf '%s' "$1" | sed -E 's/[^A-Za-z0-9._-]+/_/g')
    if [ -z "$value" ]; then
        printf 'unknown'
    else
        printf '%s' "$value"
    fi
}

read_frontmatter_value() {
    local file_path="$1"
    local key="$2"

    [ -f "$file_path" ] || return 0

    awk -v key="$key" '
        NR == 1 && $0 == "---" { in_frontmatter = 1; next }
        in_frontmatter && $0 == "---" { exit }
        in_frontmatter && $0 ~ "^[[:space:]]*" key "[[:space:]]*:" {
            sub("^[[:space:]]*" key "[[:space:]]*:[[:space:]]*", "", $0)
            sub(/[[:space:]]+#.*/, "", $0)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", $0)
            print
            exit
        }
    ' "$file_path"
}

json_escape() {
    if has_python3; then
        printf '%s' "$1" | python3 -c 'import json, sys; print(json.dumps(sys.stdin.read()), end="")'
    else
        local escaped
        escaped=$(printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\r/\\r/g; s/\n/\\n/g')
        printf '"%s"' "$escaped"
    fi
}

run_telemetry_cli() {
    local input="$1"
    shift
    "$TELEMETRY_CLI" "$@" <<< "$input" >/dev/null 2>/dev/null &
    local cli_pid=$!
    (
        sleep 1 &
        local timer_pid=$!
        trap 'kill "$timer_pid" 2>/dev/null; exit' TERM
        wait "$timer_pid"
        kill -KILL "$cli_pid" 2>/dev/null
    ) >/dev/null 2>&1 &
    local watchdog_pid=$!
    local status=0
    wait "$cli_pid" 2>/dev/null || status=$?
    kill "$watchdog_pid" 2>/dev/null
    wait "$watchdog_pid" 2>/dev/null
    if [ "$status" -ne 0 ]; then
        printf 'Telerik telemetry CLI failed or timed out (exit %s); the record remains in the local log.\n' "$status" >&2
        return 1
    fi
}

send_telemetry() {
    [ "${TELERIK_TELEMETRY_OFF:-}" != "1" ] || return 0
    local TELEMETRY_CLI
    TELEMETRY_CLI=$(command -v telerik) || return 0
    if run_telemetry_cli "" telemetry record --help; then
        run_telemetry_cli "$1" telemetry record --source winforms-upgrade-plugin --stdin
    fi
}

write_entry() {
    local log_file="$1"
    local event="$2"
    local timestamp="$3"
    local session_id="$4"
    local skill_id="${5:-}"
    local discovery="${6:-}"
    local line

    if has_python3; then
        if [ "$event" = "skill_read" ]; then
            line=$(EVENT="$event" TIMESTAMP="$timestamp" SESSION_ID="$session_id" SKILL_ID="$skill_id" DISCOVERY="$discovery" python3 -c 'import json, os; print(json.dumps({"event": os.environ["EVENT"], "timestamp": os.environ["TIMESTAMP"], "session_id": os.environ["SESSION_ID"], "skill_id": os.environ["SKILL_ID"], "discovery": os.environ["DISCOVERY"], "source": "telerik-winforms-upgrade-plugin"}, separators=(",", ":")))')
        else
            line=$(EVENT="$event" TIMESTAMP="$timestamp" SESSION_ID="$session_id" python3 -c 'import json, os; print(json.dumps({"event": os.environ["EVENT"], "timestamp": os.environ["TIMESTAMP"], "session_id": os.environ["SESSION_ID"], "source": "telerik-winforms-upgrade-plugin"}, separators=(",", ":")))')
        fi
    else
        local escaped_event
        local escaped_timestamp
        local escaped_session_id
        escaped_event=$(json_escape "$event")
        escaped_timestamp=$(json_escape "$timestamp")
        escaped_session_id=$(json_escape "$session_id")
        if [ "$event" = "skill_read" ]; then
            line="{\"event\":$escaped_event,\"timestamp\":$escaped_timestamp,\"session_id\":$escaped_session_id,\"skill_id\":$(json_escape "$skill_id"),\"discovery\":$(json_escape "$discovery"),\"source\":\"telerik-winforms-upgrade-plugin\"}"
        else
            line="{\"event\":$escaped_event,\"timestamp\":$escaped_timestamp,\"session_id\":$escaped_session_id,\"source\":\"telerik-winforms-upgrade-plugin\"}"
        fi
    fi

    if printf '%s\n' "$line" >> "$log_file"; then
        send_telemetry "$line"
    else
        printf 'Telerik WinForms telemetry hook could not append to its local log.\n' >&2
    fi
}

SESSION_ID=$(extract_field "$INPUT" session_id sessionId)
if [ -z "$SESSION_ID" ]; then
    SESSION_ID="unknown"
fi
TIMESTAMP=$(normalize_timestamp "$(extract_field "$INPUT" timestamp)")

APPDATA_ROOT=$(normalize_path "${APPDATA:-}")
if [ -z "$APPDATA_ROOT" ]; then
    APPDATA_ROOT="${XDG_DATA_HOME:-$HOME/.local/share}"
fi
LOG_DIR="${APPDATA_ROOT%/}/Telerik/upgrade-plugin"
if ! mkdir -p "$LOG_DIR" 2>/dev/null; then
    printf 'Telerik WinForms telemetry hook could not create %s\n' "$LOG_DIR" >&2
    write_success
fi

LOG_FILE="$LOG_DIR/session-$(safe_session_id "$SESSION_ID").jsonl"

if [ "$EVENT" = "skill_read" ]; then
    TOOL_NAME=$(extract_field "$INPUT" tool_name toolName)
    if [[ "$TOOL_NAME" =~ [Uu][Pp][Gg][Rr][Aa][Dd][Ee].*[/_.:-]get_instructions$ ]]; then
        MCP_PYTHON=""
        for candidate in python3 python; do
            if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c 'import sys' >/dev/null 2>&1; then
                MCP_PYTHON="$candidate"
                break
            fi
        done
        if [ -z "$MCP_PYTHON" ]; then
            printf 'Telerik MCP skill detection requires Python 3; no skill entries were recorded.\n' >&2
            write_success
        fi
        SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
        if MCP_SKILLS=$(printf '%s' "$INPUT" | "$MCP_PYTHON" "$SCRIPT_DIR/mcp-skill-reads.py"); then
            while IFS=$'\t' read -r SKILL_ID DISCOVERY; do
                [ -n "$SKILL_ID" ] || continue
                DISCOVERY="${DISCOVERY%$'\r'}"
                write_entry "$LOG_FILE" skill_read "$TIMESTAMP" "$SESSION_ID" "$SKILL_ID" "$DISCOVERY"
            done <<< "$MCP_SKILLS"
        fi
        write_success
    fi
    case "$TOOL_NAME" in
        read_file|view|Read) ;;
        *) write_success ;;
    esac

    FILE_PATH=$(extract_field "$INPUT" file_path filePath path)
    if [ -z "$FILE_PATH" ]; then
        write_success
    fi

    NORMALIZED_PATH=$(normalize_path "$FILE_PATH")
    SKILL_ID=$(basename "$(dirname "$NORMALIZED_PATH")")
    HAS_SKILL_LAYOUT=false
    if [[ "$NORMALIZED_PATH" =~ /upgrade/([^/]+/)?skills/([^/]+/)+SKILL\.md$ || "$NORMALIZED_PATH" =~ /extensions/[^/]+/skills/([^/]+/)+SKILL\.md$ ]]; then
        HAS_SKILL_LAYOUT=true
    fi

    HAS_PLUGIN_MARKER=false
    if [[ "$NORMALIZED_PATH" == *"/telerik-winforms-upgrade-plugin/"* || "$NORMALIZED_PATH" =~ /upgrade/telerik-winforms-upgrade-plugin[^/]*/skills/ ]]; then
        HAS_PLUGIN_MARKER=true
    fi

    if [ "$HAS_SKILL_LAYOUT" != true ] || { [ "$HAS_PLUGIN_MARKER" != true ] && [[ "$SKILL_ID" != telerik-winforms-* && "$SKILL_ID" != telerik-for-dotnet-* ]]; }; then
        write_success
    fi

    FILE_FOR_READ="$NORMALIZED_PATH"
    if [ ! -f "$FILE_FOR_READ" ] && [ -f "$FILE_PATH" ]; then
        FILE_FOR_READ="$FILE_PATH"
    fi

    METADATA_NAME=$(read_frontmatter_value "$FILE_FOR_READ" name)
    METADATA_DISCOVERY=$(read_frontmatter_value "$FILE_FOR_READ" discovery)
    SKILL_ID=${METADATA_NAME:-$SKILL_ID}

    if [ -n "$METADATA_DISCOVERY" ]; then
        DISCOVERY="$METADATA_DISCOVERY"
    elif [[ "$NORMALIZED_PATH" == */scenarios/* ]]; then
        DISCOVERY="scenario"
    elif [[ "$NORMALIZED_PATH" == */lazy/* ]]; then
        DISCOVERY="lazy"
    elif [[ "$NORMALIZED_PATH" == */extensions/* ]]; then
        DISCOVERY="scenarioExtension"
    else
        DISCOVERY="unknown"
    fi

    write_entry "$LOG_FILE" skill_read "$TIMESTAMP" "$SESSION_ID" "$SKILL_ID" "$DISCOVERY"
else
    write_entry "$LOG_FILE" "$EVENT" "$TIMESTAMP" "$SESSION_ID"
fi

write_success
