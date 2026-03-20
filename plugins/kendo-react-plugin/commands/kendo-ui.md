---
name: kendo-ui
description: Orchestrate a complete KendoReact development workflow to accomplish a UI requirement. This command coordinates the available KendoReact agents and skills to plan, implement, and validate a KendoReact feature end-to-end. Use it as the primary entry point for building KendoReact UI.
argument-hint: "[requirement] — describe what you want to build"
allowed-tools: "*"
---

Orchestrate a complete KendoReact UI development workflow to accomplish the user's requirement.

## Workflow Gates — Complete All Before Responding to User

**You MUST complete every gate in order. Never skip a gate. Never present results to the user until all gates pass.**

1. **CHECK SETUP** — Check `package.json` to determine if KendoReact is already installed. If not, hand off to the **kendo-setup** command first.
2. **INVOKE kendo-developer** — Hand off the user's requirement (`$ARGUMENTS`) to the **kendo-developer** agent. The agent retrieves authoritative API context, implements the feature using KendoReact, and produces production-quality code.
3. **INVOKE kendo-tester** — After kendo-developer completes, hand off to the **kendo-tester** agent with all files created or modified. The agent writes and runs unit tests, E2E tests, accessibility tests, and takes browser screenshots to verify correctness.
4. **FIX ISSUES** — If kendo-tester reports any test failures, accessibility violations, or visual defects, invoke the **kendo-developer** agent again with the specific issues to fix. Then re-invoke **kendo-tester** to verify the fixes. Repeat this loop until all tests and visual verification pass with zero failures.
5. **INVOKE kendo-custom-stylist (if styling needed)** — If the user's requirement includes specific visual design, pixel-perfect styling, or custom look-and-feel beyond default theming, hand off to the **kendo-custom-stylist** agent to inspect the live DOM, design targeted CSS, and visually verify the result. If no custom styling was requested, skip this gate.

Only after ALL applicable gates are complete may you present the final result to the user.

## Context to provide each agent

- The user's requirement from `$ARGUMENTS`
- If no argument was provided, ask the user: "What would you like to build? Describe the UI requirement, component, or feature."
- Pass all file paths created or modified by the previous agent to the next agent in the chain
