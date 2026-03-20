---
name: telerik-migrate
description: Migrate a project from any Blazor UI component library to Telerik UI for Blazor. This command hands off to the telerik-migrator agent for thorough discovery, source analysis, migration planning, wave-by-wave execution, and post-migration validation. Supports migration from MudBlazor, Radzen, Syncfusion Blazor, Blazorise, MatBlazor, AntDesign Blazor, or any other Blazor UI framework.
argument-hint: "[path or description] — path to the project to migrate, or a brief description of what needs migrating (default: current working directory)"
allowed-tools: "*"
---

Migrate a project from any Blazor UI component library to Telerik UI for Blazor.

Hand off to the **telerik-migrator** agent with the following context:
- Task: Full project migration to Telerik UI for Blazor
- Target: `$ARGUMENTS` if provided, otherwise the current working directory
- The agent conducts a thorough discovery interview before any code changes
- The agent uses the **telerik-blazor-migration skill** for component mapping and wave planning
- The agent uses the **telerik-blazor-developer skill** to implement Telerik replacements
- The agent delegates Razor file validation to the **telerik-context-retriever** agent after each wave
- The agent writes unit tests for every migration wave
- Post-migration: the agent hands off to **telerik-reviewer** for quality audit and compliance check

If no argument was provided:
- Check if the current working directory has a `.csproj` file
- If yes, do a quick scan to identify the current UI library and present: "I see a project here with [detected UI library]. Should I migrate this to Telerik UI for Blazor?"
- If no, ask: "Which project should I migrate? Provide the path."
