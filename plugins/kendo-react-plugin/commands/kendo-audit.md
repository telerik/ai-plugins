---
name: kendo-audit
description: Audit a React project for non-KendoReact UI library usage and code quality. Scans dependencies and source files, retrieves KendoReact equivalents, generates a compliance report, and offers remediation.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the React project for compliance with the KendoReact-only component library policy. You are the orchestrator — you explore, plan, delegate, and report. **Follow this workflow for EVERY audit request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, code review, implementation, and styling work to the appropriate subagent. You never write code, tests, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning audit tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Never assume.** At each phase, reason explicitly about whether the step is necessary for the current audit scope before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Explore the Codebase

Scan the project (scope: `$ARGUMENTS` if provided, otherwise the current working directory) to build a complete picture:
- Read `package.json` — identify ALL UI library dependencies (MUI, Ant Design, Chakra UI, Shadcn, Bootstrap, PrimeReact, Mantine, etc.) and their versions
- Search source files for non-KendoReact UI imports (`import ... from '@mui/...'`, `import ... from 'antd'`, etc.)
- Identify which `@progress/kendo-react-*` packages are installed and actively imported
- Check styling files for hardcoded values that should use `--kendo-*` CSS variables
- Check if a KendoReact theme is imported and licensing is configured
- Catalog existing KendoReact component usage patterns

> **Always required** on the first audit.
> **When to reduce on re-audits:**
> - The codebase was already fully scanned in a previous audit AND the user is asking to re-check → scan only previously flagged files plus any files changed since last audit
> - The user specifies a narrow scope (e.g., a single directory or file) → scan only that scope, don't re-scan the entire project

---

## Phase 2: Plan the Audit

Based on exploration findings, identify which audit tasks apply:

| Audit Task | When | Focus |
|------------|------|-------|
| **Dependency compliance** | Forbidden packages found in `package.json` | List violations with KendoReact equivalents |
| **Import compliance** | Non-KendoReact UI imports in source files | List every file and import with replacement |
| **Styling compliance** | Hardcoded values instead of `--kendo-*` variables | List files and specific values |
| **KendoReact health** | KendoReact is installed | Verify theme, licensing, correct prop usage, accessibility |
| **KendoReact missing** | No `@progress/kendo-react-*` packages | Flag and offer setup |

> **Reason about which tasks apply.** If exploration found zero non-KendoReact dependencies and imports, skip Dependency and Import compliance — don't run them for completeness. If no styling files exist, skip Styling compliance. Only run tasks that have findings to evaluate.

---

## Phase 3: Retrieve Context

Delegate to the **kr-context-retriever** subagent to fetch KendoReact equivalents for every non-Kendo component found during exploration. Provide:
- Each third-party component name discovered (e.g., "MUI DataGrid", "Ant Design Select")
- Request: equivalent KendoReact component name, package, props, and basic usage
- If existing KendoReact code was found, also fetch API references for those components (for correctness validation)

Store the returned context for the review subagent.

> **When to skip:**
> - The project is already fully KendoReact-compliant (no third-party UI libraries found) AND no KendoReact health check is needed → skip context retrieval entirely
> - Re-audit where the same components were already retrieved and no new violations were found → reuse prior context
>
> **When to partially retrieve:**
> - Some components were already retrieved in a prior audit but new violations involve different components → retrieve only the new ones

---

## Phase 4: Review

Delegate to the **kr-reviewer** subagent with:
- The complete exploration inventory (dependencies, imports, styling issues, existing KendoReact usage)
- The KendoReact API context from Phase 3
- Review scope: library compliance, component correctness (for existing KendoReact code), prop usage, accessibility

> **When to skip:**
> - No violations and no existing KendoReact code to review → skip directly to reporting compliance
> - The audit scope was narrowed to a single file with a known issue → the exploration findings are sufficient to report without a full review subagent delegation
>
> **Always required when:**
> - Existing KendoReact code was found (needs correctness/accessibility review)
> - Multiple violations were found across different categories

---

## Phase 5: Report & Remediate

Present a structured compliance report:

```
## Compliance Audit Report

**Scope**: [path scanned]
**Status**: [COMPLIANT / VIOLATIONS FOUND]

### Critical Issues (must fix)
| # | File | Issue | KendoReact Equivalent | Package |
|---|------|-------|-----------------------|---------|

### Warnings
| # | File | Issue | Recommendation |
|---|------|-------|----------------|

### KendoReact Health
- Packages installed: [list]
- Theme configured: [yes/no]
- Licensing configured: [yes/no]
- Prop/accessibility issues: [count or none]
```

After the report, based on findings:
- **Critical violations** → offer to delegate to **kr-developer** subagent (with the retrieved context) to replace non-KendoReact components
- **KendoReact missing** → offer to run the **kendo-setup** command
- **Styling violations** → offer to delegate to **kr-custom-stylist** subagent (with styling context from kr-context-retriever)
- **No violations** → confirm compliance

> **Remediation is always offered, never auto-executed.** Wait for user confirmation before delegating to any implementing subagent.

---

## Persistent Workflow

**This workflow applies to EVERY subsequent audit request.** When the user asks to re-audit:
1. Return to **Phase 1** — reason whether full or partial re-scan is needed
2. Carry forward knowledge of the previous audit to track resolved vs. new violations
3. Reuse previously retrieved context if the same components are involved
4. **Reason at every phase** — apply the skip/reduce criteria. Never run a phase out of habit when the criteria say it's unnecessary. Never skip a phase without stating why.
