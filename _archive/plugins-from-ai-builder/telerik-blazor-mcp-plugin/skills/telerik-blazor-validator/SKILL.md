---
name: telerik-blazor-validator
description: Validates a Telerik UI for Blazor Razor file for invalid component properties, incorrect parameters, and misconfigured components. Use when the user wants to validate Razor files, check for invalid Telerik properties, find parameter errors in Blazor components, or after any code generation involving Telerik components. Trigger on "validate razor file", "check Telerik properties", "find invalid properties", "validate Telerik usage".
---

## Telerik UI for Blazor — Validator

### When to Run

**CRITICAL: Run the validator after every code generation step that involves Telerik components.**

- After generating or modifying any `.razor` file that contains Telerik components
- After applying changes suggested by the component assistant
- Before considering any implementation task complete

### Calling the Validator

Use the `telerik_validator_assistant` MCP tool. Provide the **absolute path** to the Razor file to validate.

**Tool call:**
```
telerik_validator_assistant({
    filePath="<absolute path to the .razor file>"
})
```

**Example:**
```
telerik_validator_assistant({
    filePath="C:/MyProject/Components/Pages/Dashboard.razor"
})
```

### Interpreting Results

- **No errors reported** → the file passes validation. Proceed.
- **Errors reported** → fix ALL reported errors before proceeding.
  - For each invalid property, use `telerik_component_assistant` to find the correct parameter name or type.
  - Re-run the validator after fixing to confirm all issues are resolved.

### What the Validator Checks

- Invalid or non-existent component parameters
- Incorrect parameter types or values
- Misconfigured component syntax
- Icon name validity

### Validation Loop

```
1. Generate or modify Razor code with Telerik components
2. Call telerik_validator_assistant with the file path
3. If errors found:
   a. Call telerik_component_assistant to find correct members
   b. Fix all reported errors
   c. Return to step 2
4. Proceed only when validator reports no errors
```
