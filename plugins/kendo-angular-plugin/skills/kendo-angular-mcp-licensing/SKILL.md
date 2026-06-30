# Kendo MCP Licensing — Kendo UI for Angular

## Purpose

This skill diagnoses and resolves **MCP server entitlement failures** for `@progress/kendo-angular-mcp`. It is the right skill when MCP tool calls return `PERMISSION_DENIED` despite the server starting correctly, when premium MCP tools don't appear in the IDE, or when the developer asks whether their license covers MCP AI tools.

This skill does NOT cover:

- Watermarks, banners, or TKL activation codes in the app — route to `kendo-angular-product-licensing`
- First-time install, onboarding, or "how do I get started" — route to `kendo-angular-getting-started`
- Component API, props, or usage questions — route to component docs or `#kendo_component_assistant`

## Reference files

Load these only when the ticket calls for it — they are not needed for the entitlement matrix, triage order, or IDE config basics, all of which live below.

- `references/ide-troubleshooting.md` — Read when the issue is IDE-specific rather than entitlement: MCP server startup logs (where to find them in VS Code and Cursor), the VS Code `#` vs Cursor `@` tool-handle syntax difference, npx version cache issues causing stale package versions, corporate network/proxy blocking server startup, and the MCP server start button missing or showing an error.
- `references/advanced-diagnostics.md` — Read when entitlement should be valid but tools still fail: the full 15-item support debugging checklist, confidence guidance (high/medium/low), decision logic for structured triage, cross-product package-line alignment, trial expiry per-tool behavior, diagnostic signal examples, and the normalized training example.

---

## Path Taxonomy

Classify tickets with one or more of these paths:

```yaml
mcp_licensing_paths:
    - entitlement_mismatch
    - tool_scope_gating
    - backend_entitlement_sync
    - mcp_host_env_propagation
    - handoff_execution_failure
    - trial_entitlement_provisioning_friction
    - activation_or_credential_issue
    - mcp_server_tools_not_recognized_in_ide
    - mcp_server_start_button_missing
    - ai_coding_assistant_deprecated_migration

path_notes:
    entitlement_mismatch: >
        License type does not include MCP AI tools. Perpetual licenses do not
        include MCP tools. Only Trial and active Subscription licenses qualify.
    tool_scope_gating: >
        Server starts and the free #kendo_getting_started_assistant works, but
        premium tools (#kendo_ui_generator and the five specialist assistants)
        return PERMISSION_DENIED.
    backend_entitlement_sync: >
        License is eligible (trial or subscription) but the backend hasn't
        synced the entitlement yet. Common after fresh trial activation or
        subscription renewal.
    mcp_host_env_propagation: >
        TELERIK_LICENSE or TELERIK_LICENSE_PATH is set in the shell but not
        visible to the MCP server process. The IDE spawns the server in its
        own environment; env vars must be in the mcp.json config or globally
        available to the IDE process.
    handoff_execution_failure: >
        Sales or support handoff was initiated but no follow-up occurred.
        Collect the handoff payload and re-escalate.
    trial_entitlement_provisioning_friction: >
        Developer with an existing perpetual or expired account cannot start
        a trial via the portal. The trial option may not appear.
    activation_or_credential_issue: >
        The license key itself is invalid, expired, or corrupt — this is a
        product-licensing problem surfacing through MCP. Confirm the key is
        valid first, then return here if PERMISSION_DENIED persists.
    mcp_server_tools_not_recognized_in_ide: >
        MCP server is configured but tools don't appear in the IDE's tool
        list. IDE config, Agent mode, or chat.mcp.enabled issue.
    mcp_server_start_button_missing: >
        The MCP server entry exists in settings but has no Start button or
        shows "not available." Config file format or path issue.
    ai_coding_assistant_deprecated_migration: >
        Developer is using the deprecated AI Coding Assistant
        (#kendo_angular_assistant) and needs to migrate to the Agentic UI
        Generator (#kendo_ui_generator).
```

---

## MCP Entitlement Matrix

Before diagnosing, determine which license type the developer has. This table is definitive.

| License Type | Free #kendo_getting_started_assistant | Premium MCP Tools (#kendo_ui_generator + specialists) | Notes |
|---|---|---|---|
| Free (no key) | YES | NO | No MCP AI tools beyond the free assistant |
| Trial (30-day) | YES | YES | Full access during trial; PERMISSION_DENIED after expiry |
| Subscription (active) | YES | YES | Full access while subscription is active |
| Subscription (expired) | YES | NO | Renew to restore |
| Perpetual | YES | NO | Not included; access only via a 30-day trial or limited annual quota |

```yaml
entitlement_rules:
    - All Telerik AI tools share a single account-wide request limit.
    - Requests through the MCP server count against that same quota.
    - As of @progress/kendo-angular-mcp v1.4, the server automatically recognizes the Telerik license and activates the appropriate tools.
    - The free #kendo_getting_started_assistant is available to ALL license types including Free (no key required).

subscription_license_qualifying_names:
    - DevCraft Ultimate Subscription
    - DevCraft Complete Subscription
    - DevCraft UI Subscription
    - Kendo UI for Angular Subscription
    - Any license explicitly containing the word 'Subscription' at the end of its name (Telerik Subscription licenses introduced 2025).

perpetual_naming_trap:
    description: >
        The following are PERPETUAL licenses despite containing the word 'Subscription'
        in their name. They do NOT grant MCP access.
    examples:
        - 'DevCraft Ultimate with Subscription and Ultimate Support'
        - 'DevCraft Complete with Subscription and Priority Support'
        - 'DevCraft UI with Subscription and Lite Support'
    rule: >
        If the license name contains 'with Subscription and ... Support', it is perpetual.
        Only bare 'Subscription' at the end of the name is a qualifying subscription license.
    importance: >
        This is a common misdiagnosis trap. Always check the exact license name before
        concluding that a subscription license should include MCP tools.

privacy_policy:
    - The MCP server does not access workspace or application code.
    - The MCP server does not use prompts to train Telerik AI models.
    - The MCP server does not associate prompts with the customer's Telerik account.
    - Prompts and generated context are anonymized and stored for statistical and troubleshooting purposes only.
    - The MCP server does not generate responses; it provides context to the customer's chosen AI model.
```

---

## Core Triage Order

When PERMISSION_DENIED is reported, work through this checklist in order:

```yaml
triage_order:
    0_distinguish_timeout_from_permission_denied: >
        IMPORTANT: A first-call timeout after IDE restart or cold npx invocation is NOT
        a PERMISSION_DENIED entitlement issue. The first npx run downloads the package
        and may exceed the IDE's tool-call timeout (30–60s). Retry once — if the second
        call succeeds, it was a cold-start timeout, not a licensing failure.
        Only proceed with entitlement triage if PERMISSION_DENIED appears verbatim
        in the error body and is consistent across repeated calls.
    1_confirm_license_type: >
        Ask: "What type of Telerik license do you have — free, trial, subscription,
        or perpetual?" If perpetual, this is an entitlement_mismatch — explain and
        offer trial/subscription path. If free with no key, explain that premium
        MCP tools require at minimum a trial license.
        NAMING TRAP: check the exact license name against the perpetual_naming_trap
        in the Entitlement Matrix above — some perpetual licenses contain the word
        'Subscription' in their name and can be misidentified.
    2_confirm_license_validity: >
        Is the trial or subscription still active? Check expiry. If expired,
        the fix is renewal or a new trial, not debugging the MCP config.
    3_confirm_license_visibility_to_mcp_server: >
        The MCP server reads the license from the environment it is spawned in.
        Check: is TELERIK_LICENSE or TELERIK_LICENSE_PATH set in the mcp.json
        env block, OR is the key placed globally (~/.telerik/telerik-license.txt)?
        The IDE spawns the server process — shell env vars may not propagate.
    4_confirm_mcp_server_version: >
        Run: npm view @progress/kendo-angular-mcp version
        Auto-recognition requires v1.4+. If older, update: npx -y @progress/kendo-angular-mcp@latest
    5_confirm_backend_sync: >
        After fresh trial activation or subscription renewal, the backend may
        take a few minutes to sync entitlements. Restart the MCP server and
        retry after 5 minutes.
    6_confirm_ide_config: >
        If the server starts but tools don't appear, this is an IDE config
        issue (see IDE Configuration Reference below), not an entitlement issue.
        For detailed IDE troubleshooting (startup logs, # vs @ syntax, npx cache,
        proxy issues), see references/ide-troubleshooting.md.
    7_escalate_if_unresolved: >
        If the license is eligible, visible, current, and the server is v1.4+,
        but PERMISSION_DENIED persists — escalate to Sales/Support with the
        handoff payload. See references/advanced-diagnostics.md for the full
        15-item support debugging checklist and confidence guidance.
```

---

## IDE Configuration Reference

### VS Code — workspace level

File: `.vscode/mcp.json`

```json
{
    "servers": {
        "kendo-angular-mcp-server": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@progress/kendo-angular-mcp@latest"],
            "env": {
                "TELERIK_LICENSE_PATH": "THE_PATH_TO_YOUR_LICENSE_FILE"
            }
        }
    }
}
```

- Global: run `MCP: Open User Configuration` from the Command Palette.
- `chat.mcp.enabled` must be `true` in VS Code settings.
- Tools require **Agent mode** — they do not work in Ask mode.
- After config change, restart VS Code.

### VS Code — verifying tools appear

1. Open Copilot Chat in Agent mode.
2. Type `#kendo_getting_started_assistant` — if it autocompletes, the server is running.
3. Type `#kendo_ui_generator` — if it does not appear but the free tool does, this is a `tool_scope_gating` entitlement issue.

### Cursor — workspace level

File: `.cursor/mcp.json`

```json
{
    "mcpServers": {
        "kendo-angular-mcp-server": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@progress/kendo-angular-mcp@latest"],
            "env": {
                "TELERIK_LICENSE_PATH": "THE_PATH_TO_YOUR_LICENSE_FILE"
            }
        }
    }
}
```

- Note: Cursor uses `mcpServers` (camelCase), VS Code uses `servers`.
- Global: place the file in your user home folder under `.cursor/`.
- After config change, restart Cursor.
- Navigate to Settings → MCP Tools to verify the server is listed and toggled on.

### JetBrains

Configured automatically by `npx kendo setup angular`. Manual setup: follow JetBrains MCP documentation and point to the same npx command.

### Common config mistakes

```yaml
ide_config_pitfalls:
    wrong_key_name_in_json:
        description: Using "mcpServers" in VS Code config or "servers" in Cursor config.
        fix: VS Code uses "servers", Cursor uses "mcpServers".
    env_var_not_in_mcp_json:
        description: TELERIK_LICENSE is set in the shell but not in the mcp.json env block.
        explanation: >
            The IDE spawns the MCP server as a child process. Shell env vars may not
            propagate depending on how the IDE was launched (e.g., launched from Dock
            vs terminal on macOS). Set the env var explicitly in the mcp.json env block
            or place the key globally.
    ask_mode_instead_of_agent:
        description: Developer is in Ask mode in VS Code.
        fix: Switch to Agent mode — MCP tools are only available in Agent mode.
    stale_kendo_ui_license_var:
        description: mcp.json references KENDO_UI_LICENSE instead of TELERIK_LICENSE.
        explanation: Variable was renamed in 2025 Q1. Update all references.
    server_version_too_old:
        description: Running @progress/kendo-angular-mcp < v1.4 which lacks auto-recognition.
        fix: Update to @latest.
```

---

## AI Coding Assistant → Agentic UI Generator Migration

The AI Coding Assistant (`#kendo_angular_assistant`) was deprecated in February 2026 and replaced by the Agentic UI Generator (`#kendo_ui_generator`).

```yaml
migration:
    old_tool_handle: '#kendo_angular_assistant'
    new_tool_handle: '#kendo_ui_generator'
    what_changed:
        - The orchestrator tool handle changed.
        - The Agentic UI Generator includes five specialist assistants (Component, Layout, Styling, Icon, Accessibility) coordinated by an orchestrator.
        - The AI Coding Assistant was component-focused only; the Agentic UI Generator adds full UI generation with styling and layout.
    what_to_do:
        - Update prompts from '#kendo_angular_assistant' to '#kendo_ui_generator'.
        - Update @progress/kendo-angular-mcp to @latest.
        - No config file changes needed beyond updating the package version.
    common_symptom: >
        Developer says "AI Coding Assistant stopped working" — they are
        using the deprecated handle. The fix is the new handle + package update.
```

---

## Sales Handoff Rules

```yaml
sales_handoff:
    perpetual_requesting_mcp:
        trigger: Developer has a perpetual license and wants MCP AI tool access.
        action: Always escalate to Sales.
        payload:
            - Account email
            - Current license type and product family
            - "Requesting MCP AI tool access — perpetual license, needs subscription upgrade or trial"
        do_not: Try to "fix" this technically — it is an entitlement boundary.

    trial_provisioning_blocked:
        trigger: Developer with existing perpetual or expired account cannot start a trial.
        action: Escalate to Sales with account details.
        payload:
            - Account email
            - Current license type (perpetual / expired subscription)
            - "Trial option not appearing in portal — existing account state may be blocking"

    backend_sync_suspected:
        trigger: >
            License is eligible (trial or subscription, confirmed active), key is visible
            to the MCP server, server is v1.4+, but PERMISSION_DENIED persists after
            5-minute wait and server restart.
        action: Escalate to Support.
        payload:
            - Account email
            - @progress/kendo-angular-mcp version
            - Failing tool name(s) and full error text
            - License type and expiry date
            - IDE and OS

    sales_followup_delay:
        trigger: Developer was told Sales would follow up but hasn't heard back.
        action: >
            De-escalate — acknowledge the delay, confirm the handoff was sent, and
            provide a realistic timeline. Do not promise specific response times.
```

---

## Safe Response Templates

### Entitlement mismatch (perpetual license)

```text
MCP AI tools (the Agentic UI Generator and the specialist assistants) require an active
Subscription or Trial license. Perpetual licenses do not include these tools.

The free #kendo_getting_started_assistant is available to all license types, including
perpetual — so if that tool works but #kendo_ui_generator returns PERMISSION_DENIED,
your license is recognized but doesn't include MCP AI tool access.

To evaluate the AI tools, start a free 30-day trial: https://www.telerik.com/try/kendo-angular-ui
For a subscription upgrade, I can connect you with Sales.
```

### Eligible but still denied (support escalation)

```text
Your license type (trial/subscription) should include MCP AI tools, and the server is
running correctly. This may be a backend entitlement sync issue.

Please try: restart the MCP server, wait 5 minutes, and retry. If PERMISSION_DENIED
persists, I'll escalate to Support with your account details and the full error message.
```

### AI Coding Assistant deprecated

```text
The AI Coding Assistant (#kendo_angular_assistant) was deprecated in February 2026 and
replaced by the Agentic UI Generator (#kendo_ui_generator).

To migrate:
  1. Update the MCP server: ensure @progress/kendo-angular-mcp@latest is in your mcp.json
  2. Use #kendo_ui_generator instead of #kendo_angular_assistant in your prompts

The Agentic UI Generator includes everything the AI Coding Assistant did, plus full UI
generation with layout and styling capabilities.
```

### Trial expired

```text
Your 30-day trial has ended, so premium MCP tools now return PERMISSION_DENIED. This is
expected — not a bug or config issue.

To restore access, purchase a commercial subscription:
https://www.telerik.com/kendo-angular-ui/pricing

The free #kendo_getting_started_assistant remains available without any license.
```

### Sales follow-up delay (de-escalation)

```text
I can see the handoff to Sales was submitted. Response times can vary, but the team
typically follows up within a few business days. I'll flag this as a reminder.

In the meantime, if you'd like to evaluate the MCP AI tools immediately, you can start
a free 30-day trial: https://www.telerik.com/try/kendo-angular-ui
```

---

## Agent-Assisted License Setup for MCP

When the developer provides a path to their license file and asks the agent to configure MCP:

```yaml
agent_assisted_mcp_setup:
    consent_rule: Take no action without explicit user consent.
    flow:
        1_acknowledge: "I see your license file at [path]. I'll configure the MCP server to use it."
        2_state_intent: >
            Explain what you will do: update the mcp.json env block to set
            TELERIK_LICENSE_PATH pointing to their file, or copy the key to
            the global location.
        3_ask_permission: "Shall I proceed?"
        4_execute: Update the mcp.json file with the env block.
        5_verify: "Please restart your IDE and type #kendo_ui_generator in the chat to verify."
    do_not:
        - Modify mcp.json without asking first.
        - Move or delete the developer's license file.
        - Set TELERIK_LICENSE (full key content) in mcp.json — prefer TELERIK_LICENSE_PATH.
```

---

## Routing Rules

```yaml
route_to_kendo_angular_product_licensing_when:
    - Developer reports a watermark or licensing banner in the app (not in MCP tools)
    - A TKL error code appears (TKL002, TKL003, TKL101–TKL105)
    - The issue is project activation, not MCP entitlement
    - activation_or_credential_issue is suspected — confirm the key is valid via product licensing first, then return here if PERMISSION_DENIED persists

route_to_kendo_angular_getting_started_when:
    - Developer is setting up for the first time
    - Developer asks how to install Kendo UI for Angular or which license to choose
    - Developer asks about MCP setup (not a failure) — Phase 4 of getting-started covers initial setup

stay_in_this_skill_when:
    - PERMISSION_DENIED from any MCP tool
    - Premium MCP tools don't appear but the free assistant works
    - AI Coding Assistant stopped working (deprecated migration)
    - Developer asks whether their license type supports MCP AI tools
    - IDE config issue preventing MCP tools from appearing
    - Sales handoff needed for perpetual → subscription conversion
```

---

## Anti-Patterns

```yaml
avoid:
    - Treating PERMISSION_DENIED as a project licensing or activation issue — it is an MCP entitlement issue.
    - Telling a perpetual license holder to re-download their key or re-activate — that won't fix an entitlement gap.
    - Debugging IDE config before confirming the license type supports MCP tools — entitlement first, config second.
    - Suggesting the developer suppress or work around PERMISSION_DENIED programmatically.
    - Promising specific Sales response times.
    - Mixing project-licensing triage (TKL codes, watermarks) into MCP entitlement diagnosis.
    - Referencing the deprecated #kendo_angular_assistant handle without explaining the migration to #kendo_ui_generator.
    - Setting TELERIK_LICENSE (full key content) in a shared or committed mcp.json — use TELERIK_LICENSE_PATH instead.
```

---

## Relationship to Other Skills

```yaml
skill_relationships:
    kendo_angular_getting_started:
        relationship: upstream
        handoff_trigger: Developer is setting up for the first time or asking about MCP setup (not a failure)
        description: Initial onboarding, Phase 4 covers MCP setup

    kendo_angular_product_licensing:
        relationship: parallel
        handoff_trigger: Watermark, banner, or TKL code in the app — not in MCP tools
        description: Project activation and runtime licensing

note: >
    If both a watermark AND PERMISSION_DENIED are reported, resolve the product
    licensing issue first (kendo-angular-product-licensing), then re-check MCP
    entitlement. A corrupt or expired key can cause both symptoms.
```
