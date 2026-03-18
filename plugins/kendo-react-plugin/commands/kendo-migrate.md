---
name: kendo-migrate
description: Migrate a project from any UI component library to KendoReact. This command hands off to the kendo-migrator agent for thorough discovery, source analysis, migration planning, wave-by-wave execution, and post-migration validation. Supports migration from MUI, Ant Design, Chakra UI, Shadcn, Bootstrap, Angular Material, PrimeReact, Mantine, or any other UI framework.
argument-hint: "[path or description] — path to the project to migrate, or a brief description of what needs migrating (default: current working directory)"
allowed-tools: "*"
---

Migrate a project from any UI component library to KendoReact.

Hand off to the **kendo-migrator** agent with the following context:
- Task: Full project migration to KendoReact
- Target: `$ARGUMENTS` if provided, otherwise the current working directory
- The agent conducts a thorough discovery interview before any code changes
- The agent uses the **kendo-react-migration skill** for component mapping and wave planning
- The agent uses the **kendo-react-developer skill** to implement KendoReact replacements
- The agent uses the **kendo-e2e skill** for debugging, visual verification, and E2E test generation
- The agent writes unit tests and E2E tests for every migration wave
- Post-migration: the agent hands off to **kendo-reviewer** for quality audit and compliance check

If no argument was provided:
- Check if the current working directory has a `package.json`
- If yes, do a quick scan to identify the current UI library and present: "I see a project here with [detected UI library]. Should I migrate this to KendoReact?"
- If no, ask: "Which project should I migrate? Provide the path."
