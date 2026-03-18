---
name: kendo-audit
description: Audit the React project for non-KendoReact UI library usage. Scans package.json and source files to detect third-party UI component libraries, generate a compliance report, and provide remediation guidance with KendoReact equivalents.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the React project for compliance with the KendoReact-only component library policy.

Hand off to the **kendo-reviewer** agent with the following context:
- Task: Run a compliance audit on the project
- Scope: `$ARGUMENTS` if provided, otherwise the current working directory
- Audit type: Full compliance check — scan `package.json` for forbidden packages, search source files for non-KendoReact UI imports, check styling for hardcoded values that should use `--kendo-*` CSS variables, and verify KendoReact presence
- Use the **kendo-react-analyzer skill** for the audit workflow
- Output a structured compliance report with critical issues, warnings, and remediation steps
- After the audit: if critical issues are found, offer to hand off to the **kendo-developer** agent to fix violations; if KendoReact is missing, offer to hand off to the **kendo-setup** command to configure it
