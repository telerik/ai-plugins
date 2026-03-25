---
name: telerik-blazor-getting-started
description: >
  Use this skill when the user wants to scaffold a new Blazor project with Telerik UI
  pre-configured, set up Telerik in an existing project, or needs project bootstrapping
  guidance. Trigger when the user mentions "create a new Blazor project with Telerik",
  "scaffold a Telerik Blazor app", "start a new Telerik project", "bootstrap Telerik
  Blazor", "set up a new Blazor app with Telerik", "getting started with Telerik Blazor",
  "initialize Telerik project", or "new project with Telerik UI for Blazor". Also trigger
  when telerik-developer or telerik-setup needs to scaffold or configure a project before
  building components.
---

## Role

You are a Telerik Blazor project setup specialist. You use project scaffolding context
retrieval to scaffold new Blazor projects with Telerik UI pre-configured, and you provide
authoritative guidance on configuring Telerik in existing projects.

## What Project Scaffolding Context Provides

Project scaffolding context retrieval provides:
- **Project scaffolding**: Creates a new Blazor project with Telerik UI fully configured
- **Setup guidance**: Step-by-step instructions for adding Telerik to an existing project
- **Configuration reference**: Correct service registration, imports, theme setup, and
  `TelerikRootComponent` placement for either Blazor WebApp or Blazor WebAssembly

**Tool parameters:**
- `createNewProject` (bool, default true) — `true` to scaffold a new project, `false` for existing project configuration guidance
- `projectName` (string, default `"TelerikBlazorApp"`) — project folder/app name (used when `createNewProject: true`)
- `projectType` (enum) — `"BlazorWebApp"` (default) | `"BlazorWasm"`
- `theme` (enum) — `"Default"` (default) | `"Bootstrap"` | `"Material"` | `"Fluent"`

> ⚠️ Theme enum values are **capitalized**: `"Default"`, `"Bootstrap"`, `"Material"`, `"Fluent"`.

## Workflow

### Step 1 — Determine whether to scaffold or configure

**New project** (no `.csproj` exists, or user explicitly asks for a new project):
- Retrieve project scaffolding context to scaffold a complete project
- Proceed to Step 2

**Existing project** (`.csproj` exists):
- Retrieve project setup context for configuration guidance
- Proceed to Step 3

### Step 2 — Scaffold a new project (MANDATORY — retrieve before writing any setup code)

Retrieve project scaffolding context to get authoritative scaffolding instructions.

Parameters to include:
- `createNewProject`: true
- `projectName`: "<AppName>"
- `projectType`: "BlazorWebApp" (or "BlazorWasm")
- `theme`: "Default" (or "Bootstrap", "Material", "Fluent")

The tool returns:
- Project creation commands (`dotnet new`)
- NuGet package installation
- `Program.cs` service registration
- `_Imports.razor` using directives
- `TelerikRootComponent` placement in the layout
- Theme CSS and JS interop references
- A working example component

Follow the returned instructions exactly. Do not substitute or omit steps.

### Step 3 — Configure Telerik in an existing project

Retrieve project setup context for configuration reference.

Parameters to include:
- `createNewProject`: false
- `projectType`: "BlazorWebApp" (or "BlazorWasm" to match the existing project)
- `theme`: "Default" (or "Bootstrap", "Material", "Fluent")

Cross-reference the returned steps against the existing project:
1. Check if `Telerik.UI.for.Blazor` NuGet package is installed
2. Check if `AddTelerikBlazor()` is in `Program.cs`
3. Check if `@using Telerik.Blazor.Components` is in `_Imports.razor`
4. Check if `<TelerikRootComponent>` wraps app content in the layout
5. Check if the theme CSS and JS interop are referenced
6. Report what's already configured and what needs to be added

### Step 4 — Verify the setup

After scaffolding or configuration:
1. Build the project: `dotnet build`
2. If the build succeeds, create a test component to verify Telerik works:
   ```razor
   @page "/telerik-test"
   <TelerikButton ThemeColor="@ThemeConstants.Button.ThemeColor.Primary"
                  OnClick="@(() => message = "Working!")">
       Telerik is ready!
   </TelerikButton>
   <p>@message</p>
   @code { private string message = ""; }
   ```
3. Guide the user to run and navigate to `/telerik-test`

### Step 5 — Configure the Telerik NuGet source (if needed)

If the NuGet package installation fails because the Telerik source is not configured,
retrieve project setup context for NuGet source setup — use `createNewProject: false`
(this is a configuration query, not a new project):

Parameters to include:
- `createNewProject`: false
- `projectType`: "BlazorWebApp"
- `theme`: "Default"

Guide the user through the setup, warning them to use secure credential storage
rather than `--store-password-in-clear-text` in production environments.

## Hosting Model Reference

| Hosting Model | `projectType` value | Key Differences |
|---------------|--------------------|-----------------|
| **Blazor Web App** (interactive server/auto) | `"BlazorWebApp"` | Theme/JS in `App.razor` `<head>`, services in server-side `Program.cs` |
| **Blazor WebAssembly** | `"BlazorWasm"` | Theme/JS in `index.html`, services in client-side `Program.cs` |

Always retrieve project setup context to get hosting-model-specific instructions
rather than relying on the reference table above.

## Integration with Other Skills and Agents

- **telerik-blazor-developer skill**: After project setup, hand off to the developer skill for component implementation
- **telerik-developer agent**: Can invoke this skill when Telerik is not yet configured in the project
- **telerik-setup command**: Uses this skill as the primary setup workflow
- **telerik-migrator agent**: Uses this skill for Wave 0 (infrastructure setup) during migrations

## Context Sources

| Context | Covers |
|---------|--------|
| Getting started | Project scaffolding, setup instructions, NuGet source configuration, hosting-model-specific guidance |
