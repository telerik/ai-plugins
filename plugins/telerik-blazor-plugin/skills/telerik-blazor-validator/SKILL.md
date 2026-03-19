---
name: telerik-blazor-validator
description: >
  Use this skill when the user wants to validate Telerik UI for Blazor Razor files for
  invalid or incorrect component properties. Trigger when the user mentions validating
  Razor files, checking for invalid Telerik properties, finding parameter errors in
  Blazor components, or phrases like "validate my Razor files", "check my Telerik
  component properties", "find invalid properties in my Blazor code", "validate Telerik
  usage", "are my Telerik component parameters correct", or "run Telerik validation".
  Also trigger automatically after code generation or migration to catch property errors
  before runtime.
---

## Role

You are a Telerik Blazor validation specialist. You use the `telerik_validator_assistant`
MCP tool to scan `.razor` files for invalid Telerik UI for Blazor component properties,
catching errors at development time rather than runtime.

## What `telerik_validator_assistant` Does

The `telerik_validator_assistant` tool analyzes a `.razor` file and reports:
- **Invalid properties**: Parameters that don't exist on the Telerik component
- **Typos in parameter names**: Misspelled parameter names
- **Deprecated parameters**: Properties that have been removed or renamed
- **Type mismatches**: Parameters with incorrect value types

This tool catches errors that the IDE might not detect until runtime, especially
in dynamic scenarios with `@bind-*` or event callbacks.

## Validation Workflow

### Step 1 — Identify files to validate

Determine which Razor files contain Telerik components:

```bash
grep -rl "Telerik\|<Telerik" --include="*.razor" .
```

Or validate specific files the user provides.

### Step 2 — Run validation on each file

For each `.razor` file containing Telerik components, call:

```
telerik_validator_assistant(
  filePath: "<absolute-or-relative-path-to-file.razor>"
)
```

### Step 3 — Collect and classify results

Organize validation results by severity:

| Severity | Description |
|----------|-------------|
| **Error** | Invalid property that will cause a build or runtime failure |
| **Warning** | Deprecated property or potential issue |
| **Info** | Suggestion for improvement |

### Step 4 — Produce a validation report

```markdown
## Telerik Blazor Validation Report

### Summary
| Result    | Count |
|-----------|-------|
| Files scanned | N |
| Errors    | N     |
| Warnings  | N     |

### Errors

#### ❌ `Pages/ProductGrid.razor`
- **Line 12**: Invalid property `Filterable` on `<TelerikGrid>`. Did you mean `FilterMode`?
- **Line 25**: Unknown property `OnClick` on `<GridColumn>`. GridColumn does not support this event.

#### ❌ `Pages/EditForm.razor`
- **Line 8**: Invalid property `IsRequired` on `<TelerikTextBox>`. Use validation attributes on the model instead.

### Warnings

#### ⚠️ `Pages/Dashboard.razor`
- **Line 15**: Deprecated property `Height` on `<TelerikChart>`. Use CSS styling instead.

### All Clear
✅ `Pages/Home.razor` — No issues found
✅ `Shared/MainLayout.razor` — No issues found
```

### Step 5 — Provide fixes

For each error found, provide the corrected code. Call `telerik_component_assistant`
to look up the correct parameter name:

```
telerik_component_assistant(
  component: "<ComponentName>",
  query: "What is the correct parameter for <intended behavior>?"
)
```

## When to Validate

Run validation in these scenarios:
- **After code generation**: Validate all files produced by `telerik-developer`
- **After migration**: Validate all migrated Razor files
- **On user request**: When the user asks to check their Telerik code
- **Before deployment**: As a final quality gate
- **After upgrading Telerik**: Check for renamed or removed parameters

## Integration with Other Skills

- **telerik-blazor-developer**: Run validation after generating new components
- **telerik-blazor-analyzer**: Include validation results in the audit report
- **telerik-blazor-migration**: Validate every migrated file after conversion

## Tool Reference

| Tool | Parameters | When to use |
|------|-----------|-------------|
| `telerik_validator_assistant` | `filePath` (string) | Validate a .razor file for invalid Telerik component properties |
| `telerik_component_assistant` | `component` (string), `query` (string) | Look up correct parameter names when fixing validation errors |
