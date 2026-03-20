---
name: telerik-validate
description: Validate Telerik UI for Blazor Razor files for invalid component properties. Scans .razor files and reports invalid, deprecated, or misspelled parameters on Telerik components. Use after code generation, migration, or Telerik package upgrades to catch property errors before runtime.
argument-hint: "[path] — file or directory to validate (default: all .razor files in the project)"
allowed-tools: "*"
---

Validate Telerik UI for Blazor Razor files for invalid component properties.

## Determine the scope

If `$ARGUMENTS` specifies a single `.razor` file, validate that file only.

If `$ARGUMENTS` specifies a directory, find all `.razor` files containing Telerik components:
```bash
grep -rl "Telerik\|<Telerik" --include="*.razor" <directory>
```

If no arguments provided, scan the entire project:
```bash
grep -rl "Telerik\|<Telerik" --include="*.razor" .
```

## Run validation

For each identified Razor file, delegate validation to the **telerik-context-retriever** agent, which will run the appropriate MCP validation tool on each file.

## Report results

Produce a structured validation report:

```markdown
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

## Fix errors

If errors are found, offer to fix them:
- Delegate to the **telerik-context-retriever** agent to look up the correct parameter name
- Provide corrected code snippets
- Offer to hand off to the **telerik-developer** agent for automated fixes
