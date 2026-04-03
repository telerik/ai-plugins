---
name: telerik-setup
description: Bootstrap Telerik UI for Blazor in an existing Blazor project. Assesses the project, retrieves authoritative setup guidance, installs the NuGet package, configures services and theme, and verifies the setup works.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap"
allowed-tools: "*"
---

Bootstrap Telerik UI for Blazor in the current Blazor project. You are the orchestrator — you assess, retrieve context, execute setup steps, and verify. **Follow this workflow for EVERY setup request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and browser verification to the appropriate subagent. You never load skills directly — skills are loaded by the agents you delegate to. For setup steps (NuGet installation, file edits, configuration), you execute them directly since they are orchestration-level operations, not component implementation.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding.

---

## Prohibited Actions

The following actions are **forbidden** even for a setup orchestrator:

- **NEVER** write Blazor component code beyond the minimal setup verification example (Phase 8). You do not build application features.
- **NEVER** treat your own built-in knowledge of Telerik Blazor setup procedures as "retrieved context." Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts as authoritative setup guidance.
- **NEVER** skip Phase 2 (Retrieve Setup Guidance) for initial setup. The MCP tools provide version-accurate instructions that may differ from your training data.

---

## Phase Gates

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Project assessment summary | You (orchestrator) |
| Phase 2 | **Context Retrieval Report** (setup guidance) | `tb-context-retriever` subagent |
| Phase 9 | **Test Report** (browser verification) | `tb-tester` subagent |

---

## Phase 1: Explore & Assess the Project

Read `.csproj` and scan the project to understand:
- .NET version in use
- Blazor hosting model (Server, WebAssembly, Hybrid — detect from project type and config)
- Whether `Telerik.UI.for.Blazor` NuGet package is already installed
- Whether a Telerik theme is already referenced (CSS and JS)
- Whether `TelerikRootComponent` is present in the layout
- Whether `AddTelerikBlazor()` is registered in Program.cs
- Whether `_Imports.razor` has the Telerik using directives
- Application entry point and layout file locations

If Telerik is already configured, report what's installed and ask whether to fix or extend the setup.

**On follow-ups:** re-read only the entry file and `.csproj` when changing themes, or only the relevant file(s) for a specific fix.

---

## Phase 2: Retrieve Authoritative Setup Guidance

Delegate to the **tb-context-retriever** subagent to fetch version-accurate setup instructions. Provide:
- Whether this is an existing project or a new project
- The desired theme: `$ARGUMENTS` if provided, otherwise ask: "Which Telerik theme? Options: **default**, fluent, material, bootstrap. (default is recommended)"
- The detected hosting model and .NET version

Read the retriever's completion report. Follow the returned instructions as the primary guide for Steps 3–8 below.

**Your own built-in knowledge of Telerik Blazor setup procedures is NOT retrieved context.** Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts. The MCP tools provide version-accurate instructions that may differ from your training data.

**Skip ONLY if** the user is only fixing a specific configuration issue in an already-working setup, or if a Context Retrieval Report with setup guidance was already retrieved this session.

---

## Phase 3: Determine the Theme

Map the user's selection to the correct theme:
- `default` → `kendo-theme-default`
- `fluent` → `kendo-theme-fluent`
- `material` → `kendo-theme-material`
- `bootstrap` → `kendo-theme-bootstrap`

**Skip if** a theme is already installed and the user didn't request a change.

---

## Phase 4: Install the NuGet Package

Ensure the Telerik NuGet source is configured, then install:
```bash
dotnet add package Telerik.UI.for.Blazor
```

If the Telerik NuGet source is not configured, guide the user through setup. Warn about secure credential storage rather than `--store-password-in-clear-text` in production environments.

**Skip if** the package is already installed. Only install what's missing.

---

## Phase 5: Register Telerik Services

Add to `Program.cs`:
```csharp
builder.Services.AddTelerikBlazor();
```

**Skip if** already registered.

---

## Phase 6: Add TelerikRootComponent

Find the main layout file and wrap content:
```razor
<TelerikRootComponent>
    @Body
</TelerikRootComponent>
```

**Skip if** already present. **Fix if** incorrectly placed.

---

## Phase 7: Configure Imports

Add to `_Imports.razor`:
```razor
@using Telerik.Blazor
@using Telerik.Blazor.Components
```

**Skip if** already present.

---

## Phase 8: Add Theme CSS and JS References

Add to the HTML host file (`App.razor`, `_Host.cshtml`, or `index.html` depending on hosting model):
```html
<link href="_content/Telerik.UI.for.Blazor/css/kendo-theme-<selected>/all.css" rel="stylesheet" />
<script src="_content/Telerik.UI.for.Blazor/js/telerik-blazor.js"></script>
```

**Skip if** the theme reference already exists. **Replace if** the user requested a different theme.

Create a simple test component at `Pages/TelerikSetupTest.razor` for initial setup. **Skip if** fixing existing configuration.

---

## Phase 9: Verify & Report

1. **Build check** — Run `dotnet build` to verify no errors.
2. **Browser verification** — Delegate to **tb-tester** in browser verification mode with the example component and verification criteria (correct theme styling, no console errors).

**Skip browser verification if** only a specific config fix was applied (no theme change), or if the example was skipped.

3. **Report:**
```
## Telerik UI for Blazor Setup Complete

**Theme**: kendo-theme-<name>
**Package**: Telerik.UI.for.Blazor [version]
**Hosting model**: [Server/WebAssembly/Hybrid]
**Build**: [PASS/FAIL]

### Phase Artifacts
- Context Retrieval Report: [received / skipped — reason]
- Test Report (browser verification): [received / skipped — reason]

**Next steps**:
- Configure the Telerik NuGet source if not yet done
- Use the **tb-developer** agent to start building components
- Use the **tb-reviewer** agent to verify compliance at any time
- Run `/telerik-ui [requirement]` to build a feature end-to-end
```

---

## Persistent Workflow

When the user asks to change the theme, add configuration, or fix setup issues:
1. Return to **Phase 1** to re-assess only relevant aspects.
2. Skip already-completed steps. Focus only on requested changes.
