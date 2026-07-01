---
name: kendo-angular-product-licensing
description: >
  "Watermark won't go away" / "TKL101 after activation" / "TKL002 no license
  file found" / "TKL003 license is corrupt" / "TKL102 version not covered" /
  "TKL103 subscription expired" / "TKL105 trial expired" / "kendo-ui-license
  activate fails" / "license key not working" / "watermark in production build"
  / "banner after ng build" / "TELERIK_LICENSE env var" / "telerik-license.txt
  not found" / "license works locally but fails in CI" / "Docker build shows
  watermark" / "activation in monorepo" / "pnpm hoist license" / "Angular SSR SSR
  watermark" / "seat assignment issue" / "renewed but still getting TKL102" /
  "kendo license error" — Diagnostic skill for Kendo UI for Angular licensing failures
  that persist after initial setup: watermark or banner that won't clear, TKL
  activation error codes (TKL002, TKL003, TKL101–TKL105), license-file
  precedence (TELERIK_LICENSE vs KENDO_UI_LICENSE), account/seat/bundle scope,
  CI/CD, Docker, monorepo, SSR, and test-runner activation. Also handles
  agent-assisted activation when the user provides a path to their key file.
  Do NOT use for first-time install or onboarding — route to
  kendo-angular-getting-started. Do NOT use for MCP AI-tool PERMISSION_DENIED —
  route to kendo-mcp-licensing. Do NOT use for WebMCP browser setup. Scoped to
  Kendo UI for Angular.
---

# Kendo Product Licensing — Kendo UI for Angular

## Purpose

Use this skill for Telerik/Kendo **project/component licensing** issues: watermark/banner warnings, activation errors (`TKL10x`), license file placement, account assignment, version coverage, and environment precedence.

Do not use this skill for MCP AI tool entitlement errors (`PERMISSION_DENIED` from MCP tools). Use the `kendo-mcp-licensing` skill for those cases.

Do not use this skill for WebMCP browser integration issues. `@progress/kendo-angular-webmcp` enables browser-based AI agent control of Kendo UI for Angular components via the WebMCP browser standard. It does **not** use `telerik-license.txt` activation or produce TKL errors. WebMCP setup issues (browser flag not enabled, extension not installed, `webMcp` prop not working) are outside the scope of this skill.

Routing rule:

-   If the dominant symptom is MCP tool authorization failure (`PERMISSION_DENIED`), route to `kendo-mcp-licensing` skill.
-   If the dominant symptom is app watermark/banner or `TKL10x`, stay in this product skill.

---

## Reference files

Load a reference file only when the ticket matches it — they are not needed for routing, error-code lookup, or the core mechanics, all of which live below.

- `references/activation-and-precedence.md` — A valid key still shows a watermark/banner: source precedence, env/config loading, `.env` encoding, dependency detection, version coverage after renewal, mixed major versions, file encoding corruption, clean-room repro, Windows env-var limits, stale Angular cache, build-context and consumer-app scope.
- `references/ci-containers-and-build-environments.md` — The failure is environment-specific: CI/CD pipelines, Docker, pnpm/Yarn workspaces, SSR/Angular SSR builds, Jest/Vitest/Storybook test runners, registry/proxy access, Azure secret-size limits.
- `references/account-entitlement-and-legal.md` — The issue is entitlement or commercial, not mechanics: account/seat assignment, cross-product and DevCraft-bundle scope, portal payload anomalies, JWT decoding confusion, free-component version gating, the KENDO_UI_LICENSE→TELERIK_LICENSE migration, support SLAs, renewal/conversion, education/gov/non-profit discounts, deployment limits, and commercial/legal scope questions that route to Sales/Legal.
- `references/agent-assisted-setup.md` — The user gave a path to their license file and wants the agent to activate it directly (consent-gated hands-on flow).

---

## Path Taxonomy

Classify tickets with one or more of these paths:

```yaml
licensing_paths:
    - key_not_found
    - key_corrupt
    - activation_or_credential_issue
    - account_license_assignment_mismatch
    - cross_product_license_scope_mismatch
    - version_coverage_mismatch_after_renewal
    - version_dependency_mismatch_mixed_major_versions
    - mixed_license_payload_decoding_confusion
    - commercial_license_file_portal_generation_mismatch
    - consumer_app_activation_scope_mismatch
    - build_context_license_detection_mismatch
    - project_env_var_limitations_windows
    - ci_secret_size_limitations
    - environment_or_config_loading_issue
    - license_key_file_location_or_precedence_issue
    - license_file_encoding_corruption
    - legal_commercial_scope
    - non_licensing_dependency_breakage
```

Path notes:

-   `key_not_found`: TKL002 — no license key file or environment variable detected. Check placement and variable name.
-   `key_corrupt`: TKL003 — key exists but cannot be parsed. Re-download from portal; check encoding.
-   `account_license_assignment_mismatch`: wrong account/seat assignment or seat-assignment timing generated file before entitlement was applied.
-   `cross_product_license_scope_mismatch`: customer has entitlement for one product family, but warning is emitted by another product package.
-   `version_coverage_mismatch_after_renewal`: renewed license exists, but runtime/build warning still references old coverage metadata.
-   `version_dependency_mismatch_mixed_major_versions`: mixed major package lines and/or outdated `@progress/kendo-licensing` produce persistent watermark/banner.
-   `consumer_app_activation_scope_mismatch`: library/package is activated, but consuming app/build target is not.
-   `build_context_license_detection_mismatch`: activation and build run from different roots (monorepo/shared node_modules/IIS/CI context mismatch).
-   `project_env_var_limitations_windows`: key too long or corrupted in env var; file placement is more reliable locally.
-   `license_key_file_location_or_precedence_issue`: stale env var or stale key path shadows a fresh key file.
-   `license_file_encoding_corruption`: file looks valid but encoding/byte format is wrong.
-   `legal_commercial_scope`: question about redistribution, internal wrapper licensing, OEM, or EULA interpretation — route to Sales/Legal.
-   `non_licensing_dependency_breakage`: root issue is dependency/runtime breakage that surfaces as a licensing complaint.
-   `environment_or_config_loading_issue`: .env file, dotenv config, or shell profile fails to expose the license key variable to the activation or build process.

---

## Fast Router

```yaml
route_to_product_licensing_when:
    - error_starts_with: TKL
    - symptom_contains: watermark_or_banner
    - issue_surface: app_runtime_or_build

route_to_mcp_licensing_when:
    - error_contains: PERMISSION_DENIED
    - issue_surface: MCP_tools

mixed_case_handling:
    - Resolve app-level activation/coverage first, then re-run MCP scenario.
```

---

## Core Triage Order

```yaml
triage_order:
    - Confirm product family and package set in the failing app.
    - Confirm exact warning/error code and full message text.
    - Confirm activation source (file path vs KENDO_UI_LICENSE/TELERIK_LICENSE env var).
    - Confirm current working directory where activation command is run.
    - Confirm package version alignment and @progress/kendo-licensing version.
    - Confirm key freshness (post-renewal download) and account/seat assignment.
    - Confirm build/runtime context is same context where activation is performed.

minimum_evidence_pack:
    - full_verbatim_warning_or_error
    - activation_command_output
    - key_source_reported_by_tool
    - package_manager_and_lockfile_type
    - exact_project_root_where_command_was_run
```

### Diagnostic intake — what the agent must do when activation fails

The triage order above is a checklist, not a script. How the agent gathers the evidence depends on whether it has project access.

```yaml
when_agent_has_project_access:
    description: >
        Claude Code, Copilot in a workspace, or any agent that can run shell commands
        in the developer's project directory.
    behavior:
        - Run the diagnostic commands from the cheat sheet below BEFORE asking the developer anything.
        - Report what you found and what you will do to fix it.
        - Ask the developer only for information you cannot determine from the project
          (e.g. "Did you recently renew your license?" or "Is this a trial or commercial key?").
    rationale: >
        Developers expect a coding agent to investigate, not interrogate.
        Gather evidence first, then explain and propose a fix.

when_agent_has_no_project_access:
    description: >
        Chat-only support, a web assistant, or any context where the agent cannot
        run commands or read files in the developer's environment.
    behavior:
        - Ask the developer for the minimum evidence pack before attempting diagnosis.
        - Ask in a single message, not one question at a time.
    ask_these_questions: |
        To diagnose this, I need a few details:
        1. What is the exact error message or TKL code you see? (copy-paste the full text)
        2. What is the output of running: npx kendo-ui-license activate
        3. Are you using a license file (telerik-license.txt) or an environment variable (TELERIK_LICENSE)?
        4. Which directory are you running the activation command from?
        5. Which package manager are you using? (npm, yarn, pnpm)
    follow_up_if_needed:
        - "Did you download the key after your seat assignment was confirmed (check for confirmation email)?"
        - "Have you recently renewed or changed your license?"
        - "Is this a local dev build, CI/CD pipeline, Docker container, or SSR build?"
    do_not:
        - Ask all follow-ups at once — start with the five core questions, then drill into specifics based on the answers.
        - Ask for the full license key content — it is sensitive. Ask only for the first 20–30 characters to identify format.

always:
    - Match the developer's reported error to the Error Code Reference and the troubleshooting branches BEFORE prescribing a fix.
    - If the first fix attempt does not resolve the issue, escalate through the triage order rather than repeating the same step.
    - If the agent has project access and the clean_reinstall_procedure is needed, explain what will be deleted (node_modules, lockfile) and ask for confirmation before running rm -rf.
```

---

## Diagnostic Commands Cheat Sheet

Quick-reference commands for diagnosing Kendo licensing issues. Use these before requesting customer-provided logs.

```bash
# Confirm kendo-licensing is installed and check its version
npm ls @progress/kendo-licensing

# List all @progress packages in the current project (includes transitive dependencies)
npm ls @progress/

# Check which key source is active (empty output means file-based or no key)
echo $TELERIK_LICENSE

# Run activation and review output for TKL codes
npx kendo-ui-license activate

# Refresh (re-download) the license key from the portal
npx -y @progress/kendo-licensing refresh

# Check telerik-license.txt encoding (first bytes should be 74 65 6c = "tel")
hexdump -C telerik-license.txt | head -2

# Confirm the installed version of a specific @progress package
cat node_modules/@progress/kendo-licensing/package.json | grep '"version"'

# Delete stale Angular disk cache
ng cache clean

# Clean reinstall (last resort)
rm -rf node_modules package-lock.json
npm install
npx kendo-ui-license activate
```

```yaml
cheat_sheet_usage_rules:
    - Run 'npm ls @progress/kendo-licensing' first — if it is not installed, no other step will work.
    - Run 'echo $TELERIK_LICENSE' to determine env-var vs file-based activation before asking further questions.
    - Run 'hexdump' only when TKL003 (invalid key) is reported and the key visually looks correct to the customer.
    - Run 'npx -y @progress/kendo-licensing refresh' only when the customer's current key is outdated or expired.
    - Security reminder: never ask the customer to echo TELERIK_LICENSE into a public channel; ask only for the first 20–30 characters to identify the key format.
```

---

## Error Code Reference

Full reference for all TKL error codes returned by `npx kendo-ui-license activate`.

| Code   | Message                                 | Meaning                                                              | Resolution                                                                   |
| ------ | --------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| TKL002 | No license key detected                 | No key file or env var found at activation time                      | Install a license key                                                        |
| TKL003 | Invalid license key                     | Key file is corrupted, empty, or not a valid Telerik license         | Download a fresh key from the portal                                         |
| TKL101 | License not valid for detected products | Key does not cover the product family in the project                 | Verify product family matches; review purchase options                       |
| TKL102 | Perpetual license invalid               | Package version was released after the perpetual license expiry date | Renew license or downgrade to a version within the perpetual validity window |
| TKL103 | Subscription license expired            | Subscription has ended                                               | Renew subscription and download a new key                                    |
| TKL104 | Subscription license expired            | Subscription has ended (alternate message variant)                   | Renew subscription and download a new key                                    |
| TKL105 | Trial license expired                   | 30-day trial period has ended                                        | Purchase a commercial license                                                |

### Console and Browser Warning Text

The following strings appear in browser devtools or build output. Match them to TKL codes before asking diagnostic questions.

```text
# Watermark (floating overlay rendered in the app UI)
"No valid license found for the following component(s): <ComponentName>"

# Browser console warning
"License activation failed for '@progress/<package-name>'."

# Activation command output — maps to TKL codes
"No license key detected."                          → TKL002
"The license key is invalid."                       → TKL003
"License not valid for detected products."          → TKL101
"Perpetual license: package version out of range."  → TKL102
"Your subscription license has expired."            → TKL103 / TKL104
"Your trial license has expired."                   → TKL105
```

```yaml
matching_rule:
    - Match customer-pasted text to the above patterns to identify the TKL code before asking questions.
    - '"No valid license found"' → TKL101 or account assignment mismatch — check product family and account.
    - '"No license key detected"' → TKL002 — no key in any source.
    - '"license key is invalid"' → TKL003 — encoding, corruption, or wrong file.
    - '"subscription license has expired"' → TKL103/104 — renewal needed.
    - '"trial license has expired"' → TKL105 — purchase needed.
```

---

## License Type Feature Matrix

Quick-reference table for answering "does my license include X?" without searching multiple sections.

| Feature                                                     | Perpetual                  | Subscription                  | Trial (30-day)                       | Notes                                                             |
| ----------------------------------------------------------- | -------------------------- | ----------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| Kendo UI component usage (project licensing)                | ✓ within validity window   | ✓                             | ✓                                    | Perpetual: only for package versions released before expiry date  |
| MCP AI tools (Agentic UI Generator, etc.)                   | Limited / trial only       | ✓                             | ✓                                    | Perpetual is not included; access only via a 30-day AI Tools trial or a limited annual request quota. All Telerik AI tools share one account-wide request limit. Defer specifics to `kendo-mcp-licensing`. |
| WebMCP browser integration (`@progress/kendo-angular-webmcp`) | ✓                          | ✓                             | ✓                                    | Does not use telerik-license.txt; separate browser setup required |
| Deployed app continues to work after license expiry         | ✓ (within validity)        | ✓                             | ✓                                    | Rebuild/re-activate will fail after expiry                        |
| Rebuild/re-activation after expiry                          | ✗ for packages past expiry | ✗                             | ✗                                    | Subscription: must renew; Trial: must purchase                    |
| Access to portal for key download                           | ✓                          | ✓                             | ✓                                    | Trial: portal access for 30-day window                            |
| Product updates + technical support                         | 1 year, then renew support | ✓ (continuous)                | During 30-day trial                  | Ticket turnaround 24–72h depending on package; phone support if the license allows |
| Bundle coverage (DevCraft)                                  | Single key, all bundled products | Single key, all bundled products | Single key, all bundled products | One key authorizes every product in the DevCraft bundle; ThemeBuilder is excluded |
| Deployment limits                                           | None                       | None                          | None                                 | Unlimited apps, servers, and domains; only developers need seats  |
| Upgrade path                                                | Convert to subscription    | Auto-renews with subscription | Purchase commercial or contact Sales | No subscription→perpetual path; early renewal is 50% of original price |

```yaml
matrix_usage_rules:
    - Use this table as the first lookup when the customer asks a scope or entitlement question.
    - For MCP: perpetual does NOT get standard subscription-level access — it is trial- or quota-limited. Do not quote a hard exclusion date; defer entitlement specifics to kendo-mcp-licensing.
    - For WebMCP: not a licensing question — route setup failures to product skill browser integration guidance.
    - For deployed app behavior: distinguish 'app currently running' from 'app needs rebuild' — they have different expiry behaviors.
    - For upgrade path, renewal pricing, bundle, or discount questions: always route commercial decisions to Sales, not to technical support.
```

---

## Expired License Behavior by License Type

| License Type | Deployed Apps After Expiry                                            | Dev Build or Re-activation After Expiry                                                  |
| ------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Perpetual    | Continues to work for all package versions within the validity window | Watermark + banner + console warning for package versions released after the expiry date |
| Subscription | Deployed apps continue to function normally                           | Rebuild triggers warning; kendo-ui-license activate returns a warning                    |
| Trial        | Continues to work with expired key in an already-running app          | Watermark on startup + modal dialog + warning in build log                               |

```yaml
diagnostic_rule:
    - Perpetual: issue appears only when upgrading to a package version released after the license expiry date.
    - Subscription: deployed runtime is unaffected; rebuild and re-activation are blocked.
    - Trial: modal dialog and watermark appear on every application startup.
    - Do not classify an issue as invalid key based solely on expiry date without confirming license type first.
```

---

## Activation Mechanics Reference

Key behaviors to know before asking diagnostic questions.

```yaml
file_locations_default:
    - mac_or_linux: '~/.telerik/telerik-license.txt'
    - windows_global: '%AppData%\Telerik\telerik-license.txt'
    - project_root: telerik-license.txt in the directory containing package.json

env_var_precedence:
    - If both TELERIK_LICENSE env var and telerik-license.txt file are present, the env var takes precedence.
    - To force file-based activation, unset the environment variable first.

variable_and_file_name_history:
    - Before 2025 Q1: variable was KENDO_UI_LICENSE; file was kendo-ui-license.txt
    - Since 2025 Q1: variable is TELERIK_LICENSE; file is telerik-license.txt
    - Old names are still accepted by current tooling but customers may have outdated CI configs referencing KENDO_UI_LICENSE.

automatic_activation:
    - License activates automatically during npm install if a valid key is present (file or env var).
    - npx kendo-ui-license activate is optional locally but strongly recommended in CI for error detection.
    - To guarantee activation on every install: add '"postinstall": "kendo-ui-license activate"' to the scripts block in package.json.
    - postinstall_caution: if node_modules is restored from cache (CI or Docker), postinstall does not re-run — add an explicit activate step after the cache restore step.

offline_activation:
    - All activation and validation is performed entirely offline.
    - No network requests are made at any point during activation or runtime validation.

version_requirements:
    - Current stable Kendo UI for Angular packages: v15.0.0 (as of Q2 2026).
    - Current stable '@progress/kendo-licensing': v1.11.2 (as of Q2 2026).
    - '@progress/kendo-licensing' v1.5.0 or later required for TELERIK_LICENSE_PATH support.
    - '@progress/kendo-angular-webmcp: current version — follows the same versioning as all other Kendo UI for Angular packages.
    - Kendo UI for Angular versions prior to December 2020 do not require a license key (documented).
    - Watermark/banner enforcement is associated with v13.5.0; versions released before it are believed not to show invalid-license attributes even when unlicensed. INFERRED — the FAQ entry for this only confirms that a valid activated license suppresses the attributes, and does not state the unlicensed-pre-5.16.0 behavior outright. Do not assert it as a hard guarantee to a customer.

clean_reinstall_procedure:
    - When License activation failed persists after all other steps, perform a clean reinstall.
    - rm -rf node_modules package-lock.json yarn.lock
    - npm i
    - npx kendo-ui-license activate
```

---

## License Key Security and Source Control

```yaml
prohibited:
    - Adding telerik-license.txt or its contents to source control (git, SVN, etc.).
    - Storing the license key as plaintext in CI workflow definition files (for example, GitHub Actions .yml files).
    - Adding TELERIK_LICENSE to Create React App Custom Environment Variables — CRA embeds these in the app bundle, making the key publicly accessible.

required:
    - Use each CI platform's secret management for key injection (GitHub Secrets, Azure DevOps Variables, Vercel Environment Variables).
    - Add telerik-license.txt to .gitignore.

per_developer_key_rules:
    - Each individual developer must use their own unique personal license key.
    - One personal key may be used across multiple CI pipelines, builds, and environments belonging to the same developer.
    - Using a single key for multiple developer identities is not permitted under the EULA.
```

Safe response template:

```text
Please do not commit the license key file or its contents to source control, and do not include it as plaintext in any CI workflow definition. Add telerik-license.txt to .gitignore and use your CI platform's secure secret storage to inject TELERIK_LICENSE at build time.
```

---

## Safe Response Patterns

### Source/precedence mismatch

```text
Your key appears valid, but activation is likely reading a different source than expected (environment variable vs project file).

Please keep one source only, remove stale key sources, and run activation from the app root so the selected source and package context are aligned.
```

### Version coverage mismatch

```text
The warning indicates coverage mismatch for the current package version, which usually means an older key source is still active.

Please regenerate/download the key after renewal, keep one active source, clear caches, and activate again from the same project/build context.
```

### Support pass / customer fail

```text
Because the same key works in a clean test app, the issue is likely environment-specific rather than key validity.

Please modify the provided baseline project step-by-step until the warning appears and share the first change that reproduces it.
```

---

## Trigger Conditions

> Triggering is driven by the `description` in the frontmatter. This list is a human-readable reference of the symptoms this skill covers; keep new trigger phrasing in the frontmatter, not here.

Use this skill when the customer reports project/runtime activation issues such as:

```yaml
trigger_phrases:
    - TKL002
    - TKL003
    - TKL101
    - TKL102
    - TKL103
    - TKL104
    - TKL105
    - license is corrupt
    - no license file found
    - no product references detected
    - watermark
    - remove watermark
    - hide watermark
    - get rid of watermark
    - banner says license is not valid
    - remove the banner
    - hide the banner
    - get rid of the banner
    - licensing banner
    - activated but still warning
    - valid license but runtime warning persists
    - Angular cache
    - KENDO_UI_LICENSE (legacy variable name, replaced by TELERIK_LICENSE since 2025 Q1)
```

---

## Avoid

```yaml
avoid:
    - Declaring entitlement invalid when clean-room validation shows key is valid.
    - Repeating reinstall loops without checking source precedence and command context.
    - Treating dependency/build errors as licensing root cause by default.
    - Mixing MCP entitlement guidance into project activation tickets.
    - Requesting the same diagnostic artifacts repeatedly after they were already provided and validated.
```

---

## Final Rule

```yaml
rule_id: kendo_product_licensing_runtime_banner_or_activation_mismatch
priority: high
when:
    - customer_reports: watermark_or_banner_or_TKL10x
    - context_is: project_runtime_or_build_activation
then:
    diagnose_as: product_licensing_activation_or_precedence_issue
    first_actions:
        - verify_source_precedence
        - verify_package_context
        - verify_version_and_account_alignment
    avoid: mcp_entitlement_only_diagnosis_without_runtime_context
```
