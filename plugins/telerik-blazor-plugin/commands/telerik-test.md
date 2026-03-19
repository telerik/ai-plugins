---
name: telerik-test
description: Run a test suite against Telerik UI for Blazor components — unit tests, accessibility validation, property validation, and browser-based visual verification. Orchestrates the telerik-tester agent to verify Telerik Blazor code quality. Use after building with telerik-developer or to add test coverage to existing Telerik Blazor code.
argument-hint: "[path or component name] — file, directory, or component to test (default: current working directory)"
allowed-tools: "*"
---

Run a complete Telerik Blazor test suite for the specified components or files.

Hand off to the **telerik-tester** agent with the following context:
- Task: Run a full test suite (unit tests, accessibility validation, property validation via `telerik_validator_assistant`, and visual verification via kendo-e2e browser snapshots when styling/theming is in scope)
- Target: `$ARGUMENTS` if provided, otherwise determine the most sensible target from recent changes or ask the user
- The agent uses the **telerik-blazor-testing skill** for unit test patterns
- The agent calls `telerik_component_assistant` and `telerik_accessibility_assistant` MCP tools (via telerik-context-retriever) before writing any test assertions
- The agent runs `telerik_validator_assistant` on all Razor files under test
- The agent uses **kendo-e2e MCP tools** for browser-based visual verification when the test scope includes design, styling, or theming — visual snapshots only, not automated test generation
- If tests reveal code defects, the agent hands off to the **telerik-developer** agent to fix the code, then re-runs tests
