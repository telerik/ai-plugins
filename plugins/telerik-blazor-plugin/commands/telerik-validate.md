---
name: telerik-validate
description: Validate Telerik UI for Blazor Razor files for invalid component properties. Scans .razor files, retrieves authoritative validation, reports invalid/deprecated/misspelled parameters, and offers fixes.
argument-hint: "[path] — file or directory to validate (default: all .razor files in the project)"
allowed-tools: "*"
---

Validate Telerik UI for Blazor Razor files for invalid component properties. You are the orchestrator — you determine the scope, delegate validation to the context retrieval subagent, and report results. **Follow this workflow for EVERY validation request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and validation to the appropriate subagent. You never write code yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: determining scope, delegating to subagents, evaluating their reports, and presenting the final result.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding. If a report flags open issues or knowledge gaps, address them before moving to the next phase.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit `.razor`, `.cs`, `.css` application files. You do not write code.
- **NEVER** write Razor markup, C# code, or fix code inline — delegate fixes to `tb-developer`.
- **NEVER** treat your own built-in knowledge of Telerik Blazor APIs as "retrieved context." Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.
- **NEVER** skip Phase 2 (Retrieve Validation) — it is the core purpose of this command.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Scoped file list (files to validate) | You (orchestrator) |
| Phase 2 | **Context Retrieval Report** (validation results) | `tb-context-retriever` subagent |
| Phase 3 | Structured validation report | You (orchestrator) |
| Phase 4 | Fix proposal (if errors found) | `tb-context-retriever` + user confirmation |

---

## Phase 1: Determine Scope

- **Single `.razor` file** in `$ARGUMENTS` → validate that file only.
- **Directory** in `$ARGUMENTS` → find all `.razor` files containing Telerik components via `grep -rl "Telerik\|<Telerik" --include="*.razor" <directory>`.
- **No arguments** → scan the entire project for `.razor` files with Telerik components.

---

## Phase 2: Retrieve Validation

Delegate to the **tb-context-retriever** subagent. Provide each Razor file from Phase 1 for validation of invalid Telerik component properties. Store the returned validation results.

**On re-validations:** validate only previously failing files, not the entire scope.

---

## Phase 3: Report

```
## Telerik Blazor Validation Report

### Summary
| Result        | Count |
|---------------|-------|
| Files scanned | N     |
| Errors        | N     |
| Warnings      | N     |
| Clean files   | N     |

### Phase Artifacts
- Context Retrieval Report: [received / skipped — reason]

### Errors
[List each error with file path, line number, invalid property, and suggested fix]

### Warnings
[List each warning with explanation]

### Clean Files
[List files with no issues]
```

---

## Phase 4: Offer Fixes

If errors are found:
1. Delegate to **tb-context-retriever** to look up the correct parameter names for each invalid property.
2. Present corrected code snippets to the user.
3. Offer to delegate to **tb-developer** to apply fixes automatically.

**Fix application is always offered, never auto-executed.** Wait for user confirmation before delegating.

---

## Persistent Workflow

When the user asks to re-validate:
1. Return to **Phase 1** — determine the scope (may be narrower: only previously failing files).
2. Carry forward knowledge of previous validation results.
