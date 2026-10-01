---
name: telerik-winforms-component-guidance
description: >
  Get Telerik UI for WinForms component API guidance by calling the
  telerik_winforms_assistant MCP tool. Use when fixing breaking changes,
  implementing new controls, or answering questions about Telerik component
  usage and configuration.
metadata:
  discovery: lazy
  importance: medium
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Component Guidance

Use the `telerik_winforms_assistant` MCP tool for authoritative answers about
Telerik UI for WinForms component APIs, usage patterns, and configuration.

## When to Use

- Fixing breaking changes and unsure about the replacement API
- Implementing a Telerik control for the first time
- Questions about component properties, events, or methods
- Troubleshooting control behavior or rendering issues
- Looking for code examples with specific Telerik components

## How to Call

Call `telerik_winforms_assistant` with a clear, specific query:

```
telerik_winforms_assistant(query="How to configure RadGridView column sorting in .NET 8")
```

Include:
- The specific **component name** (e.g., RadGridView, RadTreeView, RadButton)
- The **task or question** (e.g., "add column sorting", "handle SelectionChanged event")
- The **.NET version** if relevant to the API

## When NOT to Use

- **Do NOT use for migration/conversion tasks** — use the dedicated conversion
  tools (`telerik_get_migration_plan`, `telerik_convert_file`) instead.
- **Do NOT use for breaking changes detection** — use `telerik_upgrade_assistant`
  to analyze projects for breaking changes.
- **Do NOT use as a substitute for building** — always build and validate after
  applying changes, even if the tool confirms the API is correct.

## Tips

- The tool has authoritative knowledge of Telerik APIs — prefer its responses
  over general training data, which may be outdated.
- For complex scenarios, break the question into smaller, focused queries
  (one component/feature per call).
