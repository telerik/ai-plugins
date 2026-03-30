---
name: telerik-validate
description: Validate Telerik UI for Blazor Razor files for invalid component properties. Scans .razor files, retrieves authoritative validation, reports invalid/deprecated/misspelled parameters, and offers fixes.
argument-hint: "[path] — file or directory to validate (default: all .razor files in the project)"
allowed-tools: "*"
---

Validate Telerik UI for Blazor Razor files for invalid component properties. You are the orchestrator — you determine the scope, delegate validation to the context retrieval subagent, and report results. **Follow this workflow for EVERY validation request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and validation to the appropriate subagent. You never write code yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: determining scope, delegating to subagents, evaluating their reports, and presenting the final result.

**Never assume.** At each phase, reason explicitly about whether the step is necessary before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

---

## Phase 1: Determine Scope

If `$ARGUMENTS` specifies a single `.razor` file, validate that file only.

If `$ARGUMENTS` specifies a directory, find all `.razor` files containing Telerik components:
```bash
grep -rl "Telerik\|<Telerik" --include="*.razor" <directory>
```

If no arguments provided, scan the entire project:
```bash
grep -rl "Telerik\|<Telerik" --include="*.razor" .
```

> **Always required.** Never skip this phase.

---

## Phase 2: Retrieve Validation

Delegate to the **tb-context-retriever** subagent. Provide:
- Each Razor file identified in Phase 1 for validation
- Request: Razor file validation for invalid Telerik component properties

Store the returned validation results.

> **Always required** — this is the core purpose of the command. Never skip.
> **When to reduce on re-validations:**
> - The user re-validates after fixes → validate only the previously failing files, not the entire scope

---

## Phase 3: Report

Present a structured validation report:

```
## Telerik Blazor Validation Report

### Summary
| Result        | Count |
|---------------|-------|
| Files scanned | N     |
| Errors        | N     |
| Warnings      | N     |
| Clean files   | N     |

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
1. Delegate to **tb-context-retriever** to look up the correct parameter names for each invalid property
2. Present corrected code snippets to the user
3. Offer to delegate to the **tb-developer** subagent to apply fixes automatically

> **Fix application is always offered, never auto-executed.** Wait for user confirmation before delegating.

---

## Persistent Workflow

**This workflow applies to EVERY subsequent validation request.** When the user asks to re-validate:
1. Return to **Phase 1** — determine the scope (may be narrower: only previously failing files)
2. Carry forward knowledge of previous validation results
3. **Reason at every phase** — apply the skip/reduce criteria. Never run a phase out of habit when the criteria say it's unnecessary. Never skip a phase without stating why.
