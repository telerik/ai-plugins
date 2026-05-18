---
name: telerik-blazor-getting-started
description: Creates a new Telerik UI for Blazor project from scratch or adds Telerik UI for Blazor to an existing project. Use when the user wants to set up, scaffold, bootstrap, or get started with a Blazor application using Telerik UI for Blazor. Trigger on "create new Blazor project", "set up Telerik Blazor", "add Telerik to my Blazor app", "scaffold Blazor with Telerik", "getting started with Telerik Blazor", "bootstrap Blazor project", "install Telerik.UI.for.Blazor".
allowed-tools: Bash
---

# Telerik UI for Blazor — Getting Started

## Arguments

Usage: `/telerik-blazor-getting-started [project-type] [project-name]`

- `[project-type]`: `BlazorWebApp` (default, .NET 8+) or `BlazorWasm` (Blazor WebAssembly standalone)
- `[project-name]`: The name for your project (default: `MyBlazorApp`)

## Instructions

1. Determine the project type from `$ARGUMENTS`:
   - If `$ARGUMENTS` contains `wasm`, `webassembly`, or `BlazorWasm` (case-insensitive) → read and follow [blazor-wasm.md](blazor-wasm.md)
   - Otherwise → read and follow [blazor-web-app.md](blazor-web-app.md) (this is the default for .NET 8+)

2. Extract the project name from `$ARGUMENTS`. If no name is provided, use `MyBlazorApp`.

3. Replace every `<project-name>` placeholder in the loaded setup file with the actual project name before executing.

4. Run all commands sequentially. **Do not skip any step.**

5. After completing every step, run the application and keep it running.
