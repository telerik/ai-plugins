---
name: telerik-audit
description: Audit a Blazor project for non-Telerik UI library usage and code quality. Scans dependencies and source files, retrieves Telerik equivalents, generates a compliance report, and offers remediation.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the Blazor project for compliance with the Telerik-only component library policy. You are the orchestrator — you explore, plan, delegate, and report. **Follow this workflow for EVERY audit request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, code review, implementation, and styling work to the appropriate subagent. You never write code, tests, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning audit tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit `.razor`, `.cs`, `.css`, `.scss` application files. You do not write code.
- **NEVER** write Razor markup, C# code, CSS rules, or test assertions — not even for "trivial" fixes.
- **NEVER** treat your own built-in knowledge of Telerik Blazor APIs as "retrieved context." Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.
- **NEVER** skip a mandatory phase because the output "seems obvious" or the audit "seems clean." Every phase exists to catch issues that other phases cannot.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next. If an artifact is missing, the phase was not completed — go back and complete it.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Codebase exploration inventory (packages, imports, violations) | You (orchestrator) |
| Phase 2 | Audit task plan | You (orchestrator) |
| Phase 3 | **Context Retrieval Report** | `tb-context-retriever` subagent |
| Phase 4 | **Review Report** | `tb-reviewer` subagent |
| Phase 5 | Final Compliance Audit Report (compiled from all prior artifacts) | You (orchestrator) |

---

## Phase 1: Explore the Codebase

Scan the project (scope: `$ARGUMENTS` if provided, otherwise current working directory):
- Read `.csproj` — identify ALL non-Telerik UI library NuGet dependencies (MudBlazor, Radzen, Syncfusion.Blazor, Blazorise, etc.)
- Search source files for non-Telerik UI imports (`@using MudBlazor`, `@using Radzen`, `<Mud*>`, `<Radzen*>`, etc.)
- Identify whether `Telerik.UI.for.Blazor` is installed and actively used
- Check styling files for hardcoded values that should use `--kendo-*` CSS variables
- Check if a Telerik theme is imported, `TelerikRootComponent` is present, and `AddTelerikBlazor()` is registered
- Catalog existing Telerik Blazor component usage patterns

**On re-audits:** scan only previously flagged files plus changed files, or the narrowed scope the user specified.

---

## Phase 2: Plan the Audit

Based on findings, identify which audit tasks apply:

| Audit Task | When | Focus |
|------------|------|-------|
| **Dependency compliance** | Forbidden NuGet packages in `.csproj` | Violations with Telerik equivalents |
| **Import compliance** | Non-Telerik UI imports in source | Every file and import with replacement |
| **Styling compliance** | Hardcoded values instead of `--kendo-*` | Files and specific values |
| **Telerik health** | Telerik is installed | Theme, services, TelerikRootComponent, parameter usage, accessibility |
| **Telerik missing** | No `Telerik.UI.for.Blazor` | Flag and offer setup |

Only run tasks that have findings. If no non-Telerik dependencies or imports exist, skip those tasks.

---

## Phase 3: Retrieve Context

Delegate to the **tb-context-retriever** subagent to fetch Telerik equivalents for every non-Telerik component found. Provide each third-party component name and request the equivalent Telerik component, parameters, and basic usage. Also fetch API references for existing Telerik code (for correctness validation). If Razor files with Telerik components were found, request validation of those files.

Read the retriever's completion report. Store the returned context — pass it verbatim to the reviewer in Phase 4.

**Your own built-in knowledge of Telerik Blazor APIs is NOT retrieved context.** Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.

**Skip ONLY if** the project has zero non-Telerik UI imports AND zero existing Telerik code to validate. When skipping, state the reason explicitly. **Reduce if** only new violations involve different components from a prior audit.

---

## Phase 4: Review

Delegate to the **tb-reviewer** subagent with the exploration inventory, API context from Phase 3, and review scope (library compliance, component correctness, parameter usage, accessibility, infrastructure).

Read the reviewer's **Review Report** in full. Note findings and severity.

**Skip ONLY if** both Phase 1 found zero non-Telerik imports AND zero existing Telerik code. When skipping, state the reason explicitly. **Always required when** existing Telerik code was found, any violations exist, or the user requested a health check.

---

## Phase 5: Report & Remediate

Compile the final report from all prior phase artifacts. Every section below is **mandatory** — if a section cannot be filled because the corresponding phase was not run, you MUST state which phase was skipped and why.

```
## Compliance Audit Report

**Scope**: [path scanned]
**Status**: [COMPLIANT / VIOLATIONS FOUND]

### Phase Artifacts
- Context Retrieval Report: [received / skipped — reason]
- Review Report: [received / skipped — reason]

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
- Parameter/accessibility issues: [count or none — sourced from tb-reviewer's Review Report]
```

Based on findings, offer remediation:
- **Critical violations** → offer to delegate to **tb-developer** (with retrieved context) to replace non-Telerik components
- **Telerik missing** → offer to run **telerik-setup** command
- **Styling violations** → offer to delegate to **tb-stylist** (with styling context)
- **No violations** → confirm compliance

**Remediation is always offered, never auto-executed.** Wait for user confirmation.

---

## Persistent Workflow

When the user asks to re-audit:
1. Return to **Phase 1** — reason whether full or partial re-scan is needed.
2. Carry forward knowledge of the previous audit to track resolved vs. new violations.
3. Reuse previously retrieved context if the same components are involved.
