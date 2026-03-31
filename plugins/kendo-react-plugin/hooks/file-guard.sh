#!/bin/bash
set -euo pipefail

# File Access Guard Hook
# Blocks read/write access to files containing sensitive data.
# Runs as a PreToolUse hook on file access tool calls.
# Cross-tool compatible: handles both Claude Code and VS Code Copilot tool names.

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')

# --- Tool name filter (required for VS Code where matchers are ignored) ---
case "$tool_name" in
  Read|Write|Edit|read_file|create_file|replace_string_in_file|multi_replace_string_in_file|Bash|run_in_terminal) ;;
  *) exit 0 ;;
esac

# --- Sensitive file definitions (shared by file-access and bash-command checks) ---
EXACT_BLOCKED=(
  ".env"
  ".env.local"
  ".env.development"
  ".env.production"
  ".env.staging"
  ".env.test"
  ".npmrc"
  ".pypirc"
  ".netrc"
  ".htpasswd"
  ".pgpass"
  ".my.cnf"
  ".docker/config.json"
  "credentials"
  "credentials.json"
  "credentials.yml"
  "credentials.yaml"
  "service-account.json"
  "serviceaccount.json"
  "id_rsa"
  "id_rsa.pub"
  "id_ed25519"
  "id_ed25519.pub"
  "id_ecdsa"
  "id_dsa"
  "known_hosts"
  "authorized_keys"
  "keystore.jks"
  "truststore.jks"
  "token.json"
  "tokens.json"
)

BLOCKED_EXTENSIONS=(
  ".pem"
  ".key"
  ".p12"
  ".pfx"
  ".jks"
  ".keystore"
  ".crt"
  ".cer"
  ".der"
)

BLOCKED_PATTERNS=(
  "secret"
  "credential"
  "password"
  "passwd"
  "private.key"
  "private_key"
  "privatekey"
  "api.key"
  "api_key"
  "apikey"
  "access.token"
  "access_token"
  "auth.token"
  "auth_token"
  "master.key"
  "master_key"
)

# --- Bash/terminal tool: scan command text for sensitive file references ---
if [[ "$tool_name" == "Bash" || "$tool_name" == "run_in_terminal" ]]; then
  command_text=$(echo "$input" | jq -r '.tool_input.command // empty')

  if [[ -z "$command_text" ]]; then
    exit 0
  fi

  while IFS= read -r token; do
    [[ -z "$token" ]] && continue

    # Strip common quoting characters
    token="${token//\"/}"
    token="${token//\'/}"
    token="${token//\`/}"

    # Skip option flags
    [[ "$token" == -* ]] && continue

    t_base=$(basename "$token" 2>/dev/null) || continue
    t_base_lower=$(echo "$t_base" | tr '[:upper:]' '[:lower:]')

    [[ -z "$t_base_lower" ]] && continue

    # Exact filename match — checked for all tokens
    for blocked in "${EXACT_BLOCKED[@]}"; do
      if [[ "$t_base_lower" == "$blocked" ]]; then
        echo "{\"decision\": \"block\", \"reason\": \"Access denied: bash command references sensitive file '$t_base'.\"}" >&2
        exit 2
      fi
    done

    # Extension match — checked for all tokens
    for ext in "${BLOCKED_EXTENSIONS[@]}"; do
      if [[ "$t_base_lower" == *"$ext" ]]; then
        echo "{\"decision\": \"block\", \"reason\": \"Access denied: bash command references certificate or key file '$t_base'.\"}" >&2
        exit 2
      fi
    done

    # Pattern and .env.* match — only for path-like tokens to reduce false positives
    # (e.g. avoids blocking `grep "password" file.js` where "password" is a search term)
    if [[ "$token" == /* || "$token" == ./* || "$token" == ../* || "$token" == ~/* || "$token" == .* ]]; then
      for pattern in "${BLOCKED_PATTERNS[@]}"; do
        if [[ "$t_base_lower" == *"$pattern"* ]]; then
          echo "{\"decision\": \"block\", \"reason\": \"Access denied: bash command references sensitive file '$t_base' (matched pattern: '$pattern').\"}" >&2
          exit 2
        fi
      done

      if [[ "$t_base_lower" =~ ^\.env\..+ ]]; then
        echo "{\"decision\": \"block\", \"reason\": \"Access denied: bash command references environment configuration file '$t_base'.\"}" >&2
        exit 2
      fi
    fi

  done < <(printf '%s' "$command_text" | tr ' \t' '\n')

  exit 0
fi

# --- File access tools: extract and check the file path ---
file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.filePath // .tool_input.path // empty')

if [[ -z "$file_path" ]]; then
  exit 0
fi

# Normalize to basename for pattern matching
basename=$(basename "$file_path")
# Lowercase for case-insensitive matching
basename_lower=$(echo "$basename" | tr '[:upper:]' '[:lower:]')

# --- Exact filename matches ---
for blocked in "${EXACT_BLOCKED[@]}"; do
  if [[ "$basename_lower" == "$blocked" ]]; then
    echo "{\"decision\": \"block\", \"reason\": \"Access denied: '$basename' is a sensitive file.\"}" >&2
    exit 2
  fi
done

# --- Extension matches ---
for ext in "${BLOCKED_EXTENSIONS[@]}"; do
  if [[ "$basename_lower" == *"$ext" ]]; then
    echo "{\"decision\": \"block\", \"reason\": \"Access denied: '$basename' appears to be a certificate or private key file.\"}" >&2
    exit 2
  fi
done

# --- Pattern matches (substring in filename) ---
for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if [[ "$basename_lower" == *"$pattern"* ]]; then
    echo "{\"decision\": \"block\", \"reason\": \"Access denied: '$basename' appears to contain sensitive data (matched pattern: '$pattern').\"}" >&2
    exit 2
  fi
done

# --- .env.* catch-all ---
if [[ "$basename_lower" =~ ^\.env\..+ ]]; then
  echo "{\"decision\": \"block\", \"reason\": \"Access denied: '$basename' is an environment configuration file that may contain sensitive data.\"}" >&2
  exit 2
fi

# File is not sensitive — allow
exit 0
