---
name: kendo-test
description: Run a full test suite against KendoReact components — unit tests, E2E tests, accessibility validation, and visual regression. Orchestrates the kendo-tester agent to verify KendoReact code quality. Use after building with kendo-developer or to add test coverage to existing KendoReact code.
argument-hint: "[path or component name] — file, directory, or component to test (default: current working directory)"
allowed-tools: "*"
---

Run a complete KendoReact test suite for the specified components or files.

Hand off to the **kendo-tester** agent with the following context:
- Task: Run a full test suite (unit tests, E2E tests, accessibility validation, visual regression)
- Target: `$ARGUMENTS` if provided, otherwise determine the most sensible target from recent changes or ask the user
- The agent uses the **kendo-react-testing skill** for unit test patterns and the **kendo-e2e skill** for browser automation
- The agent delegates context retrieval to the **kendo-context-retriever** agent to fetch component API and accessibility guidance before writing any test assertions
- If tests reveal code defects, the agent hands off to the **kendo-developer** agent to fix the code, then re-runs tests
