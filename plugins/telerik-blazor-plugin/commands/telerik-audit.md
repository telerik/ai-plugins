---
name: telerik-audit
description: Audit the Blazor project for non-Telerik UI library usage. Scans .csproj and source files to detect third-party Blazor UI component libraries, generate a compliance report, and provide remediation guidance with Telerik equivalents.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the Blazor project for compliance with the Telerik-only component library policy.

Hand off to the **telerik-reviewer** agent with the following context:
- Task: Run a compliance audit on the project
- Scope: `$ARGUMENTS` if provided, otherwise the current working directory
- Audit type: Full compliance check — scan `.csproj` for forbidden NuGet packages, search source files for non-Telerik UI imports, check styling for hardcoded values that should use `--kendo-*` CSS variables, verify Telerik presence and correct configuration
- Use the **telerik-blazor-analyzer skill** for the audit workflow
- Run **telerik_validator_assistant** on all Razor files containing Telerik components
- Output a structured compliance report with critical issues, warnings, and remediation steps
- After the audit: if critical issues are found, offer to hand off to the **telerik-developer** agent to fix violations; if Telerik is missing, offer to hand off to the **telerik-setup** command to configure it
