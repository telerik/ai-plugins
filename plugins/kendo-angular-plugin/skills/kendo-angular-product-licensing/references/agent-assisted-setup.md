# Agent-Assisted License Setup — Kendo UI for Angular

Use this flow ONLY when the user provides a path to their license file and asks the agent to perform activation directly. The defining rule: take no action without explicit user consent. Acknowledge, state intended actions, ask permission, then execute and report. Pre-flight and failure handling below.

Use this section when the user provides a path to their license file and asks the agent to handle project licensing setup automatically.

### Trigger

The user says something like:
- "My license is at `~/Downloads/telerik-license.txt`"
- "I have the key at `/Users/me/keys/telerik-license.txt`, can you activate it?"
- "Here's the path to my license file: `C:\Users\me\telerik-license.txt`"

### Agent Behavior

When a license file path is provided, the agent **must not take any action without explicit user consent**. Instead:

1. **Acknowledge the path** and state exactly what actions will be taken.
2. **Ask for permission** before reading, copying, running commands, or modifying any files.
3. **Execute the agreed steps** once the user confirms.
4. **Report results** including the full activation command output.

### Pre-Flight Checks (before asking for permission)

```yaml
pre_flight:
    - Verify the file exists at the stated path (use file read/stat tool).
    - Verify the file is not empty and starts with the expected prefix (first bytes should be "tel" for telerik-license.txt).
    - Check whether a telerik-license.txt already exists in the project root.
    - Check whether TELERIK_LICENSE or KENDO_UI_LICENSE environment variables are currently set.
    - Check whether the project root has a package.json with @progress/* dependencies.
```

If the file does not exist at the provided path, tell the user and stop — do not proceed with any setup steps.

### Permission Request Template

```text
I found your license file at <path>. Here is what I will do to activate your Kendo UI for Angular license:

1. Copy the file to <project root>/telerik-license.txt (or: set TELERIK_LICENSE_PATH=<path> if you prefer to reference the file in-place).
2. Run: npx kendo-ui-license activate (from <project root>).
3. Show you the full activation output.

Note: If a stale TELERIK_LICENSE or KENDO_UI_LICENSE environment variable is set, I will let you know so you can remove it before activation to avoid source precedence conflicts.

Would you like me to proceed? (yes / no, and let me know if you prefer a different placement strategy)
```

### Execution Steps (after user confirms)

```yaml
execution_order:
    1. If user prefers project-root copy (recommended default):
         - Copy the file to <project root>/telerik-license.txt.
         - Add telerik-license.txt to .gitignore if not already listed.
    2. If user prefers in-place reference:
         - Do not copy the file.
         - Set TELERIK_LICENSE_PATH in the current shell session (for the activation step only).
    3. Warn the user if TELERIK_LICENSE or KENDO_UI_LICENSE env var is currently set — it takes
       precedence over the file and must be unset before activation for the file to be read.
    4. Run: npx kendo-ui-license activate from the project root.
    5. Show the full activation output to the user.
    6. Confirm activation succeeded (look for TKL codes in output; no code = success).

post_execution_verification:
    - If activation succeeds: inform the user that components should no longer show the watermark
      after the ng build or dev server restart.
    - If a TKL code appears: map it using the Error Code Reference table and continue with the
      appropriate troubleshooting branch for that code.
```

### Placement Strategy Decision Table

| Situation | Recommended strategy |
| --- | --- |
| Local development, single project | Copy to project root as `telerik-license.txt` |
| Multiple projects, same machine | Copy to global location (`~/.telerik/telerik-license.txt` on Mac/Linux; `%AppData%\Telerik\telerik-license.txt` on Windows) |
| File path is stable and user prefers not to copy | Use `TELERIK_LICENSE_PATH` env var pointing to the file |
| Windows local dev, key too long for env var | Copy to project root (file-based avoids truncation) |
| CI/CD context | Do not use file copy — use platform secret injection (out of scope for this flow) |

### Security Rules

```yaml
security_rules:
    - Never log or echo the license file contents.
    - Never commit the license file or its path to source control.
    - If the project has a .gitignore, verify telerik-license.txt is listed; add it if missing.
    - If the user is adding the path to any committed config file, warn them that the path
      may leak information about their machine or file system layout.
```

### Failure Handling

```yaml
failure_cases:
    file_not_found: Stop immediately, report path is invalid, ask user to verify.
    file_empty_or_wrong_format: Stop, report the symptom (first bytes do not match expected format),
                                 suggest re-downloading from the portal.
    stale_env_var_detected: Warn the user; do not unset it automatically — ask for permission first.
    activation_returns_tkl_code: Map code via Error Code Reference and continue with the matching
                                  troubleshooting branch. Do not repeat the copy/activate loop
                                  without first identifying the root cause from the TKL code.
    gitignore_write_fails: Report the issue; show the user the line to add manually.
```
