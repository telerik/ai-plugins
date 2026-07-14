# Activation & Precedence Troubleshooting — Kendo UI for Angular Licensing

Symptom-driven branches for when a watermark or banner persists despite a valid key: source precedence, environment/config loading, dependency detection, version coverage, encoding, build context, and consumer-app scope. Read the branch matching the reported symptom. For routing, error codes, and core mechanics, stay in `SKILL.md`.

### License Refresh and Source Precedence

```yaml
strong_signals:
    - Activation succeeds but reports old issue/expiry date.
    - Output shows source as KENDO_UI_LICENSE or TELERIK_LICENSE while customer expects file source.
    - Multiple key files/variables exist.

recommended_resolution:
    - Keep one active source only (single file or single env var source).
    - Remove/disable stale env vars that shadow project-local file.
    - Re-run activation from project root after source cleanup.

command_examples:
    - PowerShell remove env var (session): Remove-Item Env:KENDO_UI_LICENSE; Remove-Item Env:TELERIK_LICENSE
    - Bash remove env var (session): unset KENDO_UI_LICENSE; unset TELERIK_LICENSE
```

---

### Environment and Config Loading Issue

Use when the license key variable is set in a config file or shell profile but not visible to the process that runs activation or the build.

```yaml
strong_signals:
    - Key is defined in .env file but activation still reports no key source found.
    - Shell profile (.bashrc or .zshrc) sets TELERIK_LICENSE but the active terminal process does not see it.
    - dotenv or cross-env is used in build scripts but key is not loaded at activation time.
    - Key works when exported manually in the terminal but not when CI or build scripts run automatically.

recommended_resolution:
    - Verify the variable is exported, not just assigned: use 'export TELERIK_LICENSE=...' not 'TELERIK_LICENSE=...' in shell profiles.
    - For .env files: run activation in a shell where dotenv is loaded, or set the variable directly in the shell.
    - For CI: inject the variable at pipeline level rather than relying on .env file loading.
    - Run 'echo $TELERIK_LICENSE' immediately before the activation command to confirm visibility.

avoid:
    - Instructing the customer to re-download the key before confirming the variable is visible to the process.
    - Conflating .env file presence with variable availability in the active process environment.
```

Safe response template:

```text
A key defined in a .env file is not automatically available to every process. Please run 'echo $TELERIK_LICENSE' (bash/zsh) or 'echo $Env:TELERIK_LICENSE' (PowerShell) directly before the activation command to confirm the variable is visible.

If it is not visible, export it directly in your shell session or use your CI platform's environment variable injection instead of relying on a .env file.
```

#### .env File Encoding and Line Endings

A separate class of config loading issue on Windows: `.env` files saved with Notepad or other Windows editors may include a BOM (byte order mark) or CRLF line endings. dotenv parsers that do not strip these will read the variable value as `\r` or BOM-prefixed garbage, producing a corrupt-key symptom even though the key file itself is valid.

```yaml
strong_signals:
    - Key works when set directly in shell but fails when loaded from .env.
    - TKL003 (invalid key) appears but the key content looks correct to the customer.
    - Project runs on Windows or .env file was last edited on Windows.

resolution:
    - Open .env in VS Code and check the status bar for 'CRLF' vs 'LF' and 'UTF-8 with BOM' vs 'UTF-8'.
    - Convert to LF and UTF-8 without BOM.
    - Alternatively: set TELERIK_LICENSE directly in the shell or CI secret instead of via .env.
```

---

### Project Dependency Detection Mismatch

```yaml
strong_signals:
    - Activation warns: No Telerik or Kendo UI product references detected in project.
    - Activation still finds a key at parent/root path.

recommended_resolution:
    - Run command in app root where package.json contains relevant Kendo packages.
    - Ensure key file sits in same app root as package.json.
    - Remove misleading root-level fallback key files.
```

Safe response template:

```text
Please run the activation command from the directory that contains your app's package.json with Kendo packages listed as dependencies. If activation still reports no product references, confirm that your package.json includes the correct @progress/* packages and that node_modules are installed.
```

---

### Version Coverage Mismatch After Renewal

```yaml
strong_signals:
    - Warning says current license expired and not valid for current package version date.
    - Customer renewed recently but runtime warning still references old coverage window.
    - Activation succeeds but build/runtime still shows expiry-based warning.
    - Key source shown by activation tool is KENDO_UI_LICENSE or TELERIK_LICENSE instead of file.

triage_order:
    - Confirm exact warning text and key source reported by activation tool.
    - Confirm key was downloaded after renewal was fully processed.
    - Confirm renewal was fully committed by the portal backend before key was downloaded — if key was downloaded within seconds of renewal completing, the entitlement record may not have been committed yet; wait 1–2 minutes and re-download.
    - Check for stale env var sources shadowing the fresh key file.
    - Run activation from the same directory and user context as the build/runtime.
    - Clear node_modules/.cache and re-run build after source cleanup.
    - Confirm package version dates against new key coverage window.

do:
    - Remove stale env var sources before re-activating.
    - Re-download key from portal after renewal is confirmed complete.
    - Activate from exact project root and build context.
    - Confirm coverage window in decoded key JWT matches installed package release date.

avoid:
    - Repeating activation instructions before checking source precedence.
    - Claiming renewal did not process without confirming key download timestamp.
    - Mixing build context (wrong CWD) with source precedence issues.

confidence:
    - high_when: warning_dates_and_reported_key_source_do_not_match_new_download
    - medium_when: renewal_confirmed_but_source_precedence_unclear
```

Safe response template:

```text
This typically indicates the runtime is still reading an older key source rather than the freshly downloaded key.

Please remove any stale KENDO_UI_LICENSE or TELERIK_LICENSE environment variables, re-download your key from the portal after renewal, and run activation again from the exact directory where the build runs. Then clear node_modules/.cache and rebuild.
```

---

### Mixed Major Versions / Outdated Licensing Package

```yaml
strong_signals:
    - Different Kendo package major versions in same app (for example Kendo Angular v5 and v9 side by side).
    - '@progress/kendo-licensing' pre-1.5.0 used alongside newer package lines.
    - '@progress/kendo-licensing' significantly behind current stable (v1.11.2 as of Q2 2026) — older versions may have resolved licensing runtime bugs.
    - '@progress/kendo-licensing' hoisted version in lock file was not updated after upgrading Kendo packages — if the lock file satisfies the semver range with an older version, npm install will not update it; run 'npm update @progress/kendo-licensing' or delete the lock file entry.
    - Activation succeeds on one package line but watermark persists from another major version.
    - Monorepo with apps on different major lines consuming a shared component library.

recommended_resolution:
    - Align Kendo packages to same supported major release line.
    - Upgrade '@progress/kendo-licensing' to current stable.
    - Ensure telerik-license.txt filename and placement conventions match current tooling expectations.
    - For monorepos, activate at each app root independently.

avoid:
    - Assuming the most recently activated package version is the only one that matters.
    - Skipping '@progress/kendo-licensing' version check when watermark persists after valid activation.
```

Safe response template:

```text
When multiple Kendo major versions are present in the same project, the licensing runtime from each major line validates independently. A watermark from one major version does not mean your key is invalid — it means that particular version line is not activated or is reading a stale source.

Please upgrade '@progress/kendo-licensing' to the latest stable, align all Kendo packages to a single supported major line, and re-run activation from each app root.
```

---

### License File Encoding Corruption

```yaml
strong_signals:
    - File appears fine but parser reports corrupt or invalid license key.
    - Key works when pasted directly into env var but not when loaded from file.
    - File contains BOM marker, CRLF line endings, or non-UTF-8 encoding.
    - File was edited in a Windows text editor or email client and re-saved.

recommended_resolution:
    - Verify file encoding is UTF-8 without BOM.
    - Convert CRLF to LF when running on Linux/macOS CI agents.
    - Re-download key directly from portal without copying through clipboard intermediaries.
    - Avoid editing key file content — treat it as a binary blob to copy as-is.

diagnostic_commands:
    - Check for BOM: hexdump -C telerik-license.txt | head -2
    - Check line endings: file telerik-license.txt
    - Convert CRLF to LF: sed -i 's/\r$//' telerik-license.txt
    - Re-download: npx -y @progress/kendo-licensing refresh --output telerik-license.txt

avoid:
    - Assuming the portal always delivers a clean file without encoding artifacts.
    - Re-running activation loops without checking file encoding when parser reports corruption.
```

---

### Clean-Room Repro Mismatch

```yaml
strong_signals:
    - Support can reproduce success with customer artifacts in a clean app.
    - Customer still fails in their environment.

recommended_resolution:
    - Request minimal repro from known-good baseline.
    - Identify first app-specific change that reintroduces warning.

exit_criteria:
    - first_breaking_change_identified
    - or_customer_confirms_baseline_also_fails_with_same_exact_error
```

Safe response template:

```text
Because the same key activates successfully in a clean baseline app, the issue is environment-specific rather than a key validity problem. Please start from the clean baseline that works and apply your project changes one at a time until the warning reappears. Share the first change that causes the warning to return and we can investigate from there.
```

---

### False-Positive Licensing Incidents (Dependency/Runtime Breakage)

```yaml
strong_signals:
    - Activation is valid, but runtime/build fails due to dependency/import errors.
    - Wrapper libraries fail with React context errors from duplicate React/Kendo instances.
    - Package manager differences (npm vs Yarn) change reproduction.

recommended_resolution:
    - Separate licensing validity from dependency/runtime blocker.
    - For wrappers: use peerDependencies and mark react/react-dom/@progress/* as externals.
    - Align versions or pin to compatible lines until official compatibility release.

avoid:
    - Treating all post-activation failures as licensing regressions.
    - Repeating refresh/activate loops when dependency mismatch is the primary blocker.
```

Safe response template:

```text
Please separate the licensing validity question from the dependency or build error. If activation is valid but the runtime still fails with import errors or context issues, the blocker is most likely a dependency mismatch — not a licensing regression. Align dependency versions or mark shared packages as externals before repeating the activation cycle.
```

---

### Build Context License Detection Mismatch (Shared node_modules/IIS)

```yaml
strong_signals:
    - Shared dependency root with per-site build roots.
    - Local build passes, server/IIS artifacts still show watermark/banner.

recommended_resolution:
    - Place key in each project root that performs a build.
    - Ensure service/build user can read license source.
    - Rebuild and redeploy from each project root context.
```

Safe response template:

```text
Activation must be performed from the same directory and user context where the build runs. If your build service or IIS deployment runs under a different user or from a different root than your local machine, place the license file in that build root and run activation from there before rebuilding and redeploying.
```

---

### Consumer App Activation Scope Mismatch

Use when a custom npm package containing Kendo components works in the package project itself, but a watermark appears in consuming applications, on teammate machines, or in deployed environments.

```yaml
strong_signals:
    - License activation succeeds in library or package workspace.
    - Consuming app still shows Kendo watermark, banner, or license invalid warning.
    - Colleague machine or deployment environment reproduces the warning while the author machine appears fine.
    - Custom wrapper package works when consumed directly from source, but shows warnings when using the built package.

recommended_resolution:
    - Activate license in each consuming application environment, not only in the component library workspace.
    - For CI/CD pipelines: Include 'npx kendo-ui-license activate' as a build step each time the application is built.
    - Ensure the license file is available in the consuming app's build context.
    - For library consumers on different machines: each team member or CI build must run activation independently.

avoid:
    - Assuming one activation in the shared npm package project propagates to all consumers automatically.
    - Assuming activation is a one-time step that persists across all environments.
    - Treating watermark in consuming app as a sign of invalid entitlement before checking activation scope.
```

Safe response template:

```text
The activation in your wrapper package project does not automatically apply to consuming applications. Each application that uses Kendo components must have its own activation.

For CI/CD pipelines: Add 'npx kendo-ui-license activate' as a build step in your deployment pipeline (each time the application is built). Each developer machine and build environment must run activation independently using a valid key.
```

---

### Project Licensing Environment Variable Limits on Windows

Use when a customer cannot set the full TELERIK_LICENSE content reliably in a Windows local environment.

```yaml
strong_signals:
    - Customer reports TELERIK_LICENSE value is too long to set reliably in Windows local environment.
    - File-based setup works when telerik-license.txt is placed in project root or %AppData%\Telerik\telerik-license.txt on Windows.
    - Customer asks about TELERIK_LICENSE_PATH support in .env for project licensing.

scope_clarification:
    - TELERIK_LICENSE_PATH points to a license file path and IS supported for Kendo UI project licensing via Azure DevOps secure file pipelines (requires @progress/kendo-licensing v1.5.0 or later). It is also used in MCP server configuration.
    - For local Windows development, use file-based placement: project root telerik-license.txt or %AppData%\Telerik\telerik-license.txt.
    - Windows environment variable string limits can cause key content truncation, which produces corrupt-key symptoms.
    - Kendo UI project licensing searches for license files at: project root telerik-license.txt, then global locations (~/.telerik/telerik-license.txt on Mac/Linux; %AppData%\Telerik\telerik-license.txt on Windows).

recommended_resolution:
    - Prefer file-based key placement for local Windows project setup.
    - Validate variable content integrity in the active shell session before activation.
    - Compare TELERIK_LICENSE shell output against the exact license file payload to detect truncation.
    - Use CI-specific guidance for environment variable injection where platform limits are suitable.

verification_commands:
    - Bash/zsh: echo $TELERIK_LICENSE
    - PowerShell: echo $Env:TELERIK_LICENSE
    - Compare length: (echo $TELERIK_LICENSE).length vs original file byte count

avoid:
    - Instructing Windows local users to rely on TELERIK_LICENSE when value length is impractical.
    - Mixing MCP variable guidance into project licensing activation without clarifying scope.
    - Assuming corrupt-key symptom always means invalid entitlement before checking variable truncation.
```

---

### Angular Disk Cache Stale After Re-activation

Use when activation reports success but watermark and banner still appear in a Vite-based project after renewing or updating the license.

```yaml
strong_signals:
    - npx kendo-ui-license activate command output confirms license activated successfully.
    - Watermark or banner still visible in the browser after successful activation.
    - Project uses Vite as the build tool.
    - Issue appeared after a license renewal or license key update.

recommended_resolution:
    - Delete the Angular disk cache: ng cache clean
    - Re-run: npx kendo-ui-license activate
    - Restart the Vite dev server or re-run the build.

avoid:
    - Repeating refresh/activate cycles without clearing the Angular cache first.
    - Treating Angular cache persistence as a key validity problem when activation command itself reports success.
    - Requesting a new key download when activation already reports success.
```

Safe response template:

```text
Angular caches compiled output and does not automatically invalidate that cache when a license key changes. Please run 'ng cache clean', then re-run 'npx kendo-ui-license activate' and start a fresh Vite dev server. This resolves most cases where activation succeeds but the watermark still appears.
```
