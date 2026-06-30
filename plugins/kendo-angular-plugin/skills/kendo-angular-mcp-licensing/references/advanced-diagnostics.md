# Advanced Diagnostics — Kendo Angular MCP Licensing

Read this file when entitlement should be valid (trial or subscription, confirmed active) but MCP tools still return PERMISSION_DENIED after the standard triage in `SKILL.md` has been worked through. Contains the full support debugging checklist, decision logic, confidence guidance, cross-product alignment, trial expiry behavior, and the normalized training example.

---

## Support Debugging Checklist

Use when entitlement should be valid but MCP tools still fail. Collect these before escalating.

```text
 1. Which MCP package and version is used (e.g. @progress/kendo-angular-mcp@x.y.z)?
 2. Does the MCP server start reliably without errors?
 3. Which tools fail and which tools succeed (provide per-tool list)?
 4. What is the exact error text for each failing tool?
 5. Which license source is active in the MCP process environment (file path or env var)?
 6. Is the same license source readable from the directory where the MCP server process starts?
 7. Is behavior consistent across VS Code and JetBrains hosts, or host-specific?
 8. Does the customer's account show MCP entitlement in the portal?
 9. What is the customer's license type (perpetual, subscription, trial)?
10. Was the key regenerated after any recent license or seat changes?
11. Was 'npx kendo-ui-license activate' run in the same environment as the MCP server process?
12. Is there a KENDO_UI_LICENSE or TELERIK_LICENSE env var set; what is its source and length?
13. Does the MCP host config correctly reference the license file or env var?
14. Has the customer confirmed expected entitlement with their account team or portal?
15. Were there any recent account changes (seat reassignment, renewal, plan upgrade)?
```

```yaml
escalate_to_support_when:
    - customer_has_subscription_or_trial_expected_to_include_mcp_but_tools_still_deny
    - all_mcp_tools_fail_after_entitlement_model_confirmed_as_eligible
    - license_source_is_missing_malformed_or_loaded_from_wrong_location
    - mcp_server_does_not_start_or_host_env_propagation_is_inconsistent
```

---

## Confidence Guidance

Use to classify diagnostic certainty before choosing a response path.

```yaml
high_confidence_entitlement_mismatch:
    conditions:
        - server_starts: true
        - activation_success: true
        - errors_are_permission_denied: true
        - customer_license_type: perpetual_or_non_mcp_plan
    action: Explain entitlement boundary, offer trial/upgrade. No technical deep-dive needed.

medium_confidence_backend_issue:
    conditions:
        - expected_entitlement: true
        - errors_persist_after_host_and_env_validation: true
    action: Escalate to Support with the full checklist above.

low_confidence:
    conditions:
        - missing_error_text_or_missing_tool_level_behavior
        - unknown_license_type_and_unknown_server_state
    action: Gather minimum evidence before diagnosing. Do not guess.
```

---

## Decision Logic

Structured if/then blocks for the most common scenarios.

```yaml
scenario_1_perpetual_known:
    if:
        - mcp_server_status: running_or_start_button_missing
        - license_activation: success
        - tool_errors_include: PERMISSION_DENIED
        - customer_license_type: perpetual
    then:
        conclusion: definitive_entitlement_exclusion
        response: explain_perpetual_is_excluded_and_offer_trial_or_upgrade
    avoid:
        - repeated_reinstall_loops
        - claiming_setup_error_before_confirming_license_type

scenario_2_license_type_unknown:
    if:
        - mcp_server_status: running_or_start_button_missing
        - license_activation: success
        - tool_errors_include: PERMISSION_DENIED
        - customer_license_type: unknown
    then:
        conclusion: likely_entitlement_mismatch
        response: confirm_license_type_then_explain_and_offer_sales_handoff
    avoid:
        - claiming_invalid_key_without_entitlement_check

scenario_3_eligible_but_denied:
    if:
        - customer_license_type: subscription_or_trial_with_mcp
        - tool_errors_include: PERMISSION_DENIED
    then:
        conclusion: possible_backend_or_sync_issue
        response: support_debugging_with_escalation

scenario_4_handoff_stalled:
    if:
        - no_sales_contact_after_promised_followup: true
    then:
        conclusion: handoff_execution_failure
        response: re_route_with_owner_and_deadline
```

---

## Cross-Product Package-Line Alignment

Use when the customer's MCP server package does not match the licensed product family.

```yaml
strong_signals:
    - Customer installs '@progress/kendo-angular-mcp' but account license is for Kendo UI for Angular or jQuery.
    - Customer has one product family activated; MCP package expects a different product family license.
    - Tools fail even when activation succeeds in a different product workspace.
    - MCP config references a license path from a different product's workspace.

triage_order:
    - Confirm MCP package name and the product family it requires.
    - Confirm customer's account license covers that product family.
    - Confirm activation was run in the workspace that uses the same product family.
    - Confirm MCP host config references the correct license file from the correct product workspace.

do:
    - Align MCP package to the licensed product family.
    - Activate in the workspace that matches the MCP package's product family.
    - Update host config to reference the correct license file path.

avoid:
    - Assuming activation for KendoReact covers MCP packages from other product families.
    - Diagnosing entitlement level before confirming product-family alignment.
```

Safe response template:

```text
The MCP package you installed may require entitlement for a different product family than your activated license covers. Please confirm that the MCP package name matches your licensed product (for example @progress/kendo-angular-mcp requires a Kendo UI for Angular license) and that activation was run in the workspace for that product.
```

---

## Trial Expiry Per-Tool Behavior

Detailed behavior when a trial expires, useful for confirming that the issue is expiry rather than config.

```yaml
trial_expiry_behavior:
    server_starts: true
    kendo_getting_started_assistant: available (free tool, no entitlement required)
    premium_tools_after_expiry: return PERMISSION_DENIED
    affected_tools:
        - kendo_ui_generator
        - kendo_component_assistant
        - kendo_layout_assistant
        - kendo_styling_assistant
        - kendo_icon_assistant
        - kendo_accessibility_assistant
    diagnosis_signal: >
        Free tool (#kendo_getting_started_assistant) works, premium tools fail
        → trial is expired or entitlement was not provisioned.
    resolution: Purchase commercial subscription or contact Sales for trial extension.
    do_not: Treat server startup as failure; the server is working correctly.
```

---

## Diagnostic Signals: Example Tool Behavior

Reference example showing the typical tool-by-tool output for a perpetual license holder.

```json
{
    "kendo_getting_started_assistant": "working",
    "kendo_ui_generator": "PERMISSION_DENIED: user does not have a valid license for the requested product/library",
    "kendo_component_assistant": "PERMISSION_DENIED: user does not have a valid license for the requested product/library",
    "kendo_layout_assistant": "PERMISSION_DENIED: user does not have a valid license for the requested product/library",
    "kendo_styling_assistant": "PERMISSION_DENIED: user does not have a valid license for the requested product/library"
}
```

Pattern: free tool works, all premium tools return the same PERMISSION_DENIED → entitlement boundary, not config failure.

---

## Normalized Training Example

Full structured example for testing/training agent behavior on the most common MCP licensing scenario.

```json
{
    "id": "kendo-react-mcp-perpetual-license-permission-denied-001",
    "title": "Kendo React MCP Server returns PERMISSION_DENIED for advanced tools despite valid perpetual license",
    "product": "Kendo UI for Angular",
    "feature": "Kendo React MCP Server / AI Tools",
    "customer_environment": {
        "product": "Kendo UI for Angular",
        "mcp_package": "@progress/kendo-angular-mcp",
        "license_type": "perpetual",
        "host": "VS Code"
    },
    "symptoms": {
        "error": "Error: 7 PERMISSION_DENIED: user does not have a valid license for the requested product/library",
        "working_tools": ["kendo_getting_started_assistant"],
        "failing_tools": [
            "kendo_ui_generator",
            "kendo_component_assistant",
            "kendo_layout_assistant",
            "kendo_styling_assistant"
        ],
        "note": "All Agentic UI Generator tools fail for perpetual license holders."
    },
    "diagnosis": {
        "license_valid": true,
        "license_type": "perpetual",
        "activation_succeeds": true,
        "mcp_server_running": true,
        "likely_root_cause": "Perpetual licenses do not include MCP AI tooling. Active Subscription or Trial license required."
    },
    "resolution": {
        "handoff_required": true,
        "handoff_target": "Sales/Licensing",
        "handoff_reason": "Entitlement scope review or plan upgrade needed"
    },
    "agent_confidence": "high"
}
```
