---
name: telerik-ui
description: Orchestrate a complete Telerik UI for Blazor development workflow to accomplish a UI requirement. This command coordinates the available Telerik agents and skills to plan, implement, and validate a Telerik Blazor feature end-to-end. Use it as the primary entry point for building Telerik Blazor UI.
argument-hint: "[requirement] — describe what you want to build"
allowed-tools: "*"
---

Orchestrate a complete Telerik UI for Blazor development workflow to accomplish the user's requirement.

## Routing

Analyze the user's requirement and hand off to the appropriate agent:

### Building new UI components or features
Hand off to the **telerik-developer** agent with the user's requirement. The agent uses the telerik-blazor-developer, telerik-blazor-layout, and telerik-blazor-theme skills along with MCP tools to implement the feature.

### Analyzing or fixing existing Telerik Blazor code
Hand off to the **telerik-reviewer** agent. The agent uses the telerik-blazor-analyzer skill and MCP tools to audit and fix the code.

### Theming and design customization
Hand off to the **telerik-developer** agent with a theming focus. For advanced DOM-level styling, hand off to the **telerik-custom-stylist** agent.

### Testing
Hand off to the **telerik-tester** agent. The agent uses the telerik-blazor-testing skill.

### Compliance enforcement
Hand off to the **telerik-reviewer** agent for a compliance audit using the telerik-blazor-analyzer skill.

### Validating Razor files
Hand off to the **telerik-tester** agent with a validation focus, or directly use `telerik_validator_assistant`.

### Advanced / deeply custom styling
Hand off to the **telerik-custom-stylist** agent. The agent inspects the live DOM, writes targeted CSS, and guides visual verification.

### Migrating from another Blazor UI library
Hand off to the **telerik-migrator** agent. The agent orchestrates the full migration workflow.

## Context to provide the agent

- The user's requirement from `$ARGUMENTS`
- If no argument was provided, ask the user: "What would you like to build? Describe the UI requirement, component, or feature."
- Check `.csproj` to determine if Telerik is already installed. If not, hand off to the **telerik-setup** command first.
