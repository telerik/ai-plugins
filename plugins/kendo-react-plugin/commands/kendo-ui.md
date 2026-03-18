---
name: kendo-ui
description: Orchestrate a complete KendoReact development workflow to accomplish a UI requirement. This command coordinates the available KendoReact agents and skills to plan, implement, and validate a KendoReact feature end-to-end. Use it as the primary entry point for building KendoReact UI.
argument-hint: "[requirement] — describe what you want to build"
allowed-tools: "*"
---

Orchestrate a complete KendoReact UI development workflow to accomplish the user's requirement.

## Routing

Analyze the user's requirement and hand off to the appropriate agent:

### Building new UI components or features
Hand off to the **kendo-developer** agent with the user's requirement. The agent uses the kendo-react-developer, kendo-react-layout, and kendo-react-theme skills along with MCP tools to implement the feature.

### Analyzing or fixing existing KendoReact code
Hand off to the **kendo-reviewer** agent. The agent uses the kendo-react-analyzer skill and MCP tools to audit and fix the code.

### Theming and design customization
Hand off to the **kendo-developer** agent with a theming focus. For advanced DOM-level styling, hand off to the **kendo-custom-stylist** agent.

### Testing
Hand off to the **kendo-tester** agent. The agent uses the kendo-react-testing and kendo-e2e skills.

### Compliance enforcement
Hand off to the **kendo-reviewer** agent for a compliance audit using the kendo-react-analyzer skill.

### Migrating from another UI library
Hand off to the **kendo-migrator** agent. The agent orchestrates the full migration workflow.

### Advanced / deeply custom styling
Hand off to the **kendo-custom-stylist** agent. The agent inspects living DOM, writes targeted CSS, and verifies visually.

## Context to provide the agent

- The user's requirement from `$ARGUMENTS`
- If no argument was provided, ask the user: "What would you like to build? Describe the UI requirement, component, or feature."
- Check `package.json` to determine if KendoReact is already installed. If not, hand off to the **kendo-setup** command first.
