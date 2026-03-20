---
name: telerik-ui
description: Orchestrate a complete Telerik UI for Blazor development workflow to accomplish a UI requirement. This command coordinates the available Telerik agents and skills to plan, implement, and validate a Telerik Blazor feature end-to-end. Use it as the primary entry point for building Telerik Blazor UI.
argument-hint: "[requirement] — describe what you want to build"
allowed-tools: "*"
---

Orchestrate a complete Telerik UI for Blazor development workflow to accomplish the user's requirement.

## Workflow Gates — Complete All Before Responding to User

**You MUST complete every gate in order. Never skip a gate. Never present results to the user until all gates pass.**

1. **CHECK SETUP** — Check `.csproj` to determine if Telerik is already installed. If not, hand off to the **telerik-setup** command first.
2. **INVOKE telerik-developer** — Hand off the user's requirement (`$ARGUMENTS`) to the **telerik-developer** agent. The agent retrieves authoritative API context, implements the feature using Telerik UI for Blazor, and produces production-quality code.
3. **INVOKE telerik-tester** — After telerik-developer completes, hand off to the **telerik-tester** agent with all files created or modified. The agent writes and runs unit tests, accessibility tests, validates Razor files, and takes browser screenshots to verify correctness.
4. **FIX ISSUES** — If telerik-tester reports any test failures, validation errors, accessibility violations, or visual defects, invoke the **telerik-developer** agent again with the specific issues to fix. Then re-invoke **telerik-tester** to verify the fixes. Repeat this loop until all tests and visual verification pass with zero failures.
5. **INVOKE telerik-custom-stylist (if styling needed)** — If the user's requirement includes specific visual design, pixel-perfect styling, or custom look-and-feel beyond default theming, hand off to the **telerik-custom-stylist** agent to inspect the live DOM, design targeted CSS, and visually verify the result. If no custom styling was requested, skip this gate.

Only after ALL applicable gates are complete may you present the final result to the user.

## Context to provide each agent

- The user's requirement from `$ARGUMENTS`
- If no argument was provided, ask the user: "What would you like to build? Describe the UI requirement, component, or feature."
- Pass all file paths created or modified by the previous agent to the next agent in the chain
