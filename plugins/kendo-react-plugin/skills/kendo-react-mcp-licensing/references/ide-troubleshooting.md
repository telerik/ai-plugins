# IDE Troubleshooting — KendoReact MCP Server

Read this file when the MCP issue is IDE-specific rather than entitlement-based: the server won't start, tools don't appear, the wrong tool handle is used, or a stale package version is cached. For entitlement triage (PERMISSION_DENIED with a working server), stay in `SKILL.md`.

---

## MCP Server Startup Logs

Check logs before asking diagnostic questions when the server fails to start or tools are completely unavailable.

```yaml
vs_code_log_location:
    - Open the Output panel: View → Output (Cmd+Shift+U on macOS, Ctrl+Shift+U on Windows/Linux).
    - Select 'kendo-react-mcp-server' from the dropdown.
    - The panel shows the server's stdout/stderr including startup errors, license validation results, and tool registration.

cursor_log_location:
    - Open Settings → MCP → click the server name to view status, last error, and log output inline.

what_to_look_for:
    - PERMISSION_DENIED in startup log → entitlement issue; return to SKILL.md triage.
    - 'Cannot find module' or 'MODULE_NOT_FOUND' → npx resolution failure; see npx cache section below.
    - 'Invalid license' or 'No license found' → TELERIK_LICENSE env var not propagated to the server process.
    - No log output at all → server process not starting; check mcp.json syntax and node/npx availability in PATH.
    - Generic timeout or 'tool call failed' with no error body → cold start timeout (see below).
```

---

## Timeout vs PERMISSION_DENIED

These are different issues with different fixes. Confirm which one before proceeding.

```yaml
timeout_symptoms:
    - First call after IDE restart or cold npx invocation fails with a generic timeout error.
    - Retry of the same call succeeds immediately.
    - Startup log shows package download activity before the failure.
    fix: Retry once. Subsequent calls complete faster after the package is cached locally.

permission_denied_symptoms:
    - PERMISSION_DENIED is present verbatim in the error body or startup log.
    - Failure is consistent across repeated calls, not just the first one.
    - Server starts and responds but returns authorization failure.
    fix: Return to SKILL.md entitlement triage.

rule: Do not treat a first-call timeout as a PERMISSION_DENIED entitlement issue. Confirm by retrying once and checking the startup log for the actual error text.
```

---

## VS Code `#` vs Cursor `@` Tool Handle Syntax

Customers copy VS Code documentation examples using `#` handles into Cursor and receive "unknown tool" or "unrecognized assistant" errors.

```yaml
handle_syntax_by_ide:
    vs_code_copilot: >
        Use #kendo_ui_generator, #kendo_getting_started_assistant, etc.
        in the Copilot chat input.
    cursor: >
        MCP tools are invoked in Agent mode — paste the tool name directly
        or reference the server via @kendo-react-mcp-server. The # prefix
        used in VS Code docs does not apply in Cursor.

resolution:
    - For VS Code: verify chat.mcp.enabled is true and the server is enabled via Configure Tools.
    - For Cursor: switch to Agent mode (not Ask mode) — MCP tools are only available in Agent mode.
    - If IDE is unknown: confirm MCP server started successfully in logs before investigating tool syntax.

vs_code_chat_mode_restriction:
    affected_mode: Ask mode (inline editor chat and Ask panel).
    available_mode: Agent mode only.
    symptom: >
        '#kendo_ui_generator' or '#kendo_getting_started_assistant' is unrecognized
        or shows "tool not available".
    rule: >
        MCP tools require Agent mode in GitHub Copilot Chat. Switching from Ask to
        Agent mode resolves this without any config changes.
    note: The mode selector is in the bottom left of the Copilot Chat input box.
```

---

## MCP Server Assistants Not Recognized in VS Code

```yaml
strong_signals:
    - Customer installed kendo-react-mcp but GitHub Copilot chat does not show the assistants.
    - '#kendo_ui_generator' handle is not recognized.
    - MCP server is listed in mcp.json but does not appear in Copilot.

recommended_resolution:
    - Verify chat.mcp.enabled is set to true in VS Code settings.
    - Click 'Configure Tools' in the bottom right of the Copilot chat window.
    - In the popup, check 'kendo-react-mcp-server' from the list to enable it.
    - Restart VS Code if the server does not appear after enabling.

avoid:
    - Blaming license issues before confirming the server is enabled in VS Code tools config.
    - Instructing re-installation before confirming chat.mcp.enabled is true.
```

Safe response template:

```text
If the KendoReact MCP server assistants are not available in GitHub Copilot, please check the following:
1. Ensure 'chat.mcp.enabled' is set to true in VS Code settings.
2. In the Copilot chat window, click 'Configure Tools' in the bottom right corner.
3. In the popup, enable 'kendo-react-mcp-server'.
4. Restart VS Code.
```

---

## MCP Server Start Button Missing or Shows Error

```yaml
strong_signals:
    - MCP server panel shows an error message instead of a start button.
    - Customer cannot start the MCP server from the IDE UI.

triage_order:
    - Confirm license type: perpetual licenses cannot start the MCP server (AI tools not included).
    - Verify mcp.json configuration is present and correctly formed.
    - Verify license key is valid and accessible from the mcp.json env block or globally.
    - Restart IDE after confirming license and config are correct.

recommended_resolution:
    - If perpetual: explain MCP tools are not included, offer Sales handoff for subscription or 30-day trial.
    - If subscription or trial: check mcp.json config, verify license key is accessible, restart IDE.

avoid:
    - Assuming config error without first confirming license type.
    - Repeating key refresh instructions to a perpetual license holder.
```

---

## npx Version Cache Issues

Use when a customer reports that a known-fixed behavior or specific tool is still broken after updating `@progress/kendo-react-mcp`.

```yaml
strong_signals:
    - Customer says they updated kendo-react-mcp but behavior is unchanged.
    - 'npx -y @progress/kendo-react-mcp@latest' is silently using a cached older version.

recommended_resolution:
    - Force a fresh download: npx --yes --ignore-existing @progress/kendo-react-mcp@latest
    - Or clear the npm cache and retry: npm cache clean --force, then re-run the npx command.
    - Verify the version in use by checking the server startup log (the server prints its version at startup).

avoid:
    - Assuming 'npx -y @progress/kendo-react-mcp@latest' always fetches the true latest version.
    - Instructing reinstall of other packages when the issue is npx's local cache.
```

---

## Corporate Network or Proxy Blocking MCP Server Startup

Use when the MCP server never starts and the startup log shows network-related errors rather than license errors.

```yaml
strong_signals:
    - Startup log shows network timeout, ETIMEDOUT, ECONNREFUSED, or proxy authentication errors.
    - 'npx -y @progress/kendo-react-mcp@latest' hangs or fails on the corporate network but works on a personal machine or VPN bypass.
    - Corporate proxy requires allowlisting or uses SSL inspection that breaks npm TLS.
    - Error message does not mention PERMISSION_DENIED, TELERIK_LICENSE, or any licensing text.

root_cause:
    - Corporate proxies and firewalls may block outbound traffic to registry.npmjs.org.
    - SSL inspection proxies can invalidate npm TLS certificates, causing install failures.
    - This is an infrastructure issue, not a license or entitlement issue.

recommended_resolution:
    - Allowlist registry.npmjs.org and the @progress npm scope on the corporate proxy.
    - Configure npm proxy settings: npm config set proxy http://proxy.company.com:port
    - If SSL inspection is used: npm config set cafile /path/to/corporate-cert.pem or set strict-ssl=false (last resort, not recommended for production).
    - Consider pre-installing: 'npm install -g @progress/kendo-react-mcp' so npx uses the globally installed version without a network call.
    - Route infrastructure allowlisting requests to the IT/network team, not to licensing support.

avoid:
    - Blaming license or entitlement before confirming network connectivity to registry.npmjs.org.
    - Attempting license troubleshooting steps when the server process never starts.
```

Safe response template:

```text
The MCP server startup error points to a network connectivity issue rather than a license problem. Please verify that your network allows outbound access to registry.npmjs.org. If your organization uses a proxy or SSL inspection, npm may need proxy configuration or a custom CA certificate. Route this to your IT team for network/proxy allowlisting. Once the package can be downloaded, the startup should succeed.
```

---

## JetBrains Detailed Configuration

JetBrains IDEs (IntelliJ IDEA, WebStorm, Rider) support MCP servers via the AI Assistant plugin (2024.2+).

Config file: `.idea/mcp.json` at workspace root, or global config under Tools → AI Assistant → MCP Servers.

```json
{
    "mcpServers": {
        "kendo-react-mcp-server": {
            "command": "npx",
            "args": ["-y", "@progress/kendo-react-mcp@latest"],
            "env": {
                "TELERIK_LICENSE": "<your-license-key>"
            }
        }
    }
}
```

```yaml
jetbrains_config_notes:
    env_block_required: >
        JetBrains does not automatically propagate host process environment variables;
        always add an explicit env block with TELERIK_LICENSE or TELERIK_LICENSE_PATH.
    restart_required: Restart the IDE after adding or modifying the MCP configuration file.
    variable_name_note: Use TELERIK_LICENSE (current name since 2025 Q1), not KENDO_UI_LICENSE.
```
