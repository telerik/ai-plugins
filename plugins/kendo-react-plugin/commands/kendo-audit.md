---
name: kendo-audit
description: Audit a React project for non-KendoReact UI library usage and code quality. Scans dependencies and source files, retrieves KendoReact equivalents, generates a compliance report, and offers remediation.
argument-hint: "[path] — optional path to scan (default: current directory)"
allowed-tools: "*"
---

Audit the React project for compliance with the KendoReact-only component library policy. You are the orchestrator — you explore, plan, delegate, and report. **Follow this workflow for EVERY audit request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, code review, implementation, and styling work to the appropriate subagent. You never write code, tests, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning audit tasks, delegating to subagents, evaluating their reports, and presenting the final result.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit `.tsx`, `.ts`, `.jsx`, `.js`, `.css`, `.scss`, or `.module.css` application files. You do not write code.
- **NEVER** write JSX, React component code, CSS rules, or test assertions — not even for "trivial" fixes.
- **NEVER** treat your own built-in knowledge of KendoReact APIs as "retrieved context." Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts.
- **NEVER** skip a mandatory phase because the output "seems obvious" or the audit "seems clean." Every phase exists to catch issues that other phases cannot.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next. If an artifact is missing, the phase was not completed — go back and complete it.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Codebase exploration inventory (packages, imports, violations) | You (orchestrator) |
| Phase 2 | Audit task plan | You (orchestrator) |
| Phase 3 | **Context Retrieval Report** | `kr-context-retriever` subagent |
| Phase 4 | **Review Report** | `kr-reviewer` subagent |
| Phase 5 | Final Compliance Audit Report (compiled from all prior artifacts) | You (orchestrator) |

---

## Phase 1: Explore the Codebase

Scan the project (scope: `$ARGUMENTS` if provided, otherwise current working directory):
- Read `package.json` — identify ALL non-KendoReact UI library dependencies
- Search source files for non-KendoReact UI imports
- Identify installed `@progress/kendo-react-*` packages and their usage
- Check styling files for hardcoded values that should use `--kendo-*` CSS variables
- Check theme import and licensing configuration
- Catalog existing KendoReact component usage patterns

**On re-audits:** scan only previously flagged files plus changed files, or the narrowed scope the user specified.

---

## Phase 2: Plan the Audit

Based on findings, identify which audit tasks apply:

| Audit Task | When | Focus |
|------------|------|-------|
| **Dependency compliance** | Forbidden packages in `package.json` | Violations with KendoReact equivalents |
| **Import compliance** | Non-KendoReact UI imports in source | Every file and import with replacement |
| **Styling compliance** | Hardcoded values instead of `--kendo-*` | Files and specific values |
| **KendoReact health** | KendoReact is installed | Theme, licensing, prop usage, accessibility |
| **KendoReact missing** | No `@progress/kendo-react-*` packages | Flag and offer setup |

Only run tasks that have findings. If no non-KendoReact dependencies or imports exist, skip those tasks.

---

## Phase 3: Retrieve Context

Delegate to the **kr-context-retriever** subagent to fetch KendoReact equivalents for every non-Kendo component found. Provide each third-party component name and request the equivalent KendoReact component, package, props, and basic usage. Also fetch API references for existing KendoReact code (for correctness validation).

Read the retriever's completion report. Store the returned context — pass it verbatim to the reviewer in Phase 4.

**Your own built-in knowledge of KendoReact APIs is NOT retrieved context.** Only a Context Retrieval Report produced by `kr-context-retriever` in THIS conversation counts.

**Skip ONLY if** the project has zero non-KendoReact UI imports AND zero existing KendoReact code to validate. When skipping, state the reason explicitly. **Reduce if** only new violations involve different components from a prior audit.

---

## Phase 4: Review

Delegate to the **kr-reviewer** subagent with the exploration inventory, API context from Phase 3, and review scope (library compliance, component correctness, prop usage, accessibility).

Read the reviewer's **Review Report** in full. Note findings and severity.

**Skip ONLY if** both Phase 1 found zero non-KendoReact imports AND zero existing KendoReact code. When skipping, state the reason explicitly. **Always required when** existing KendoReact code was found, any violations exist, or the user requested a health check.

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
| # | File | Issue | KendoReact Equivalent | Package |
|---|------|-------|-----------------------|---------|

### Warnings
| # | File | Issue | Recommendation |
|---|------|-------|----------------|

### KendoReact Health
- Packages installed: [list]
- Theme configured: [yes/no]
- Licensing configured: [yes/no]
- Prop/accessibility issues: [count or none — sourced from kr-reviewer's Review Report]
```

Based on findings, offer remediation:
- **Critical violations** → offer to delegate to **kr-developer** (with retrieved context) to replace non-KendoReact components
- **KendoReact missing** → offer to run **kendo-setup** command
- **Styling violations** → offer to delegate to **kr-stylist** (with styling context)
- **No violations** → confirm compliance

**Remediation is always offered, never auto-executed.** Wait for user confirmation.

---

## Persistent Workflow

When the user asks to re-audit:
1. Return to **Phase 1** — reason whether full or partial re-scan is needed.
2. Carry forward knowledge of the previous audit to track resolved vs. new violations.
3. Reuse previously retrieved context if the same components are involved.
