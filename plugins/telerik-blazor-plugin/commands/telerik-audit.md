---
name: telerik-audit
description: Audit a Blazor project for non-Telerik UI library usage and code quality. Scans dependencies and source files, retrieves Telerik equivalents, generates a compliance report, and offers remediation.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the Blazor project for compliance with the Telerik-only component library policy. You are the orchestrator — you explore, plan, delegate, and report. **Follow this workflow for EVERY audit request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, code review, implementation, and styling work to the appropriate subagent. You never write code, tests, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning audit tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Never assume.** At each phase, reason explicitly about whether the step is necessary for the current audit scope before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Explore the Codebase

Scan the project (scope: `$ARGUMENTS` if provided, otherwise the current working directory) to build a complete picture:
- Read `.csproj` — identify ALL UI library NuGet dependencies (MudBlazor, Radzen, Syncfusion.Blazor, Blazorise, etc.) and their versions
- Search source files for non-Telerik UI imports (`@using MudBlazor`, `@using Radzen`, `<Mud*>`, `<Radzen*>`, etc.)
- Identify whether `Telerik.UI.for.Blazor` is installed and actively used
- Check styling files for hardcoded values that should use `--kendo-*` CSS variables
- Check if a Telerik theme is imported, `TelerikRootComponent` is present, and `AddTelerikBlazor()` is registered
- Catalog existing Telerik Blazor component usage patterns

> **Always required** on the first audit.
> **When to reduce on re-audits:**
> - The codebase was already fully scanned in a previous audit AND the user is asking to re-check → scan only previously flagged files plus any files changed since last audit
> - The user specifies a narrow scope (e.g., a single directory or file) → scan only that scope, don't re-scan the entire project

---

## Phase 2: Plan the Audit

Based on exploration findings, identify which audit tasks apply:

| Audit Task | When | Focus |
|------------|------|-------|
| **Dependency compliance** | Forbidden NuGet packages found in `.csproj` | List violations with Telerik equivalents |
| **Import compliance** | Non-Telerik UI imports in source files | List every file and import with replacement |
| **Styling compliance** | Hardcoded values instead of `--kendo-*` variables | List files and specific values |
| **Telerik health** | Telerik is installed | Verify theme, services, TelerikRootComponent, correct parameter usage, accessibility |
| **Telerik missing** | No `Telerik.UI.for.Blazor` package | Flag and offer setup |

> **Reason about which tasks apply.** If exploration found zero non-Telerik dependencies and imports, skip Dependency and Import compliance — don't run them for completeness. If no styling files exist, skip Styling compliance. Only run tasks that have findings to evaluate.

---

## Phase 3: Retrieve Context

Delegate to the **tb-context-retriever** subagent to fetch Telerik equivalents for every non-Telerik component found during exploration. Provide:
- Each third-party component name discovered (e.g., "MudBlazor DataGrid", "Radzen DropDown")
- Request: equivalent Telerik Blazor component name, parameters, and basic usage
- If existing Telerik code was found, also fetch API references for those components (for correctness validation)
- If Razor files with Telerik components were found, request validation of those files

Store the returned context for the review subagent.

> **When to skip:**
> - The project is already fully Telerik-compliant (no third-party UI libraries found) AND no Telerik health check is needed → skip context retrieval entirely
> - Re-audit where the same components were already retrieved and no new violations were found → reuse prior context
>
> **When to partially retrieve:**
> - Some components were already retrieved in a prior audit but new violations involve different components → retrieve only the new ones

---

## Phase 4: Review

Delegate to the **tb-reviewer** subagent with:
- The complete exploration inventory (dependencies, imports, styling issues, existing Telerik usage)
- The Telerik Blazor API context from Phase 3
- Review scope: library compliance, component correctness (for existing Telerik code), parameter usage, accessibility, infrastructure (TelerikRootComponent, services, imports)

> **When to skip:**
> - No violations and no existing Telerik code to review → skip directly to reporting compliance
> - The audit scope was narrowed to a single file with a known issue → the exploration findings are sufficient to report without a full review subagent delegation
>
> **Always required when:**
> - Existing Telerik code was found (needs correctness/accessibility review)
> - Multiple violations were found across different categories

---

## Phase 5: Report & Remediate

Present a structured compliance report:

```
## Compliance Audit Report

**Scope**: [path scanned]
**Status**: [COMPLIANT / VIOLATIONS FOUND]

### Critical Issues (must fix)
| # | File | Issue | Telerik Equivalent | Package |
|---|------|-------|--------------------|---------|

### Warnings
| # | File | Issue | Recommendation |
|---|------|-------|----------------|

### Telerik Health
- Package installed: [yes/no + version]
- Theme configured: [yes/no]
- TelerikRootComponent: [yes/no]
- Services registered: [yes/no]
- Validation issues: [count or none]
- Parameter/accessibility issues: [count or none]
```

After the report, based on findings:
- **Critical violations** → offer to delegate to **tb-developer** subagent (with the retrieved context) to replace non-Telerik components
- **Telerik missing** → offer to run the **telerik-setup** command
- **Styling violations** → offer to delegate to **tb-custom-stylist** subagent (with styling context from tb-context-retriever)
- **No violations** → confirm compliance

> **Remediation is always offered, never auto-executed.** Wait for user confirmation before delegating to any implementing subagent.

---

## Persistent Workflow

**This workflow applies to EVERY subsequent audit request.** When the user asks to re-audit:
1. Return to **Phase 1** — reason whether full or partial re-scan is needed
2. Carry forward knowledge of the previous audit to track resolved vs. new violations
3. Reuse previously retrieved context if the same components are involved
4. **Reason at every phase** — apply the skip/reduce criteria. Never run a phase out of habit when the criteria say it's unnecessary. Never skip a phase without stating why.
