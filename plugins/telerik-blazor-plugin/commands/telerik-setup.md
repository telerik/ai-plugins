---
name: telerik-setup
description: Bootstrap Telerik UI for Blazor in an existing Blazor project. Assesses the project, retrieves authoritative setup guidance, installs the NuGet package, configures services and theme, and verifies the setup works.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap"
allowed-tools: "*"
---

Bootstrap Telerik UI for Blazor in the current Blazor project. You are the orchestrator — you assess, retrieve context, execute setup steps, and verify. **Follow this workflow for EVERY setup request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval and browser verification to the appropriate subagent. You never load skills directly — skills are loaded by the agents you delegate to. For setup steps (NuGet installation, file edits, configuration), you execute them directly since they are orchestration-level operations, not component implementation.

**Never assume.** At each phase and step, reason explicitly about whether it is necessary for the current project state before executing or skipping it. Document your reasoning briefly (one line) when you skip a step.

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

> **Always required** on the first setup.
> **When to reduce on follow-ups:**
> - The user asks to change the theme on an already-assessed project → re-read only the entry file and `.csproj`, skip full project scan
> - The user asks to fix a specific configuration issue → read only the relevant file(s)

---

## Phase 2: Retrieve Authoritative Setup Guidance

Delegate to the **tb-context-retriever** subagent to fetch version-accurate setup instructions. Provide:
- Whether this is an existing project or a new project
- The desired theme: `$ARGUMENTS` if provided, otherwise ask: "Which Telerik theme? Options: **default**, fluent, material, bootstrap. (default is recommended)"
- The detected hosting model and .NET version

Follow the returned instructions as the primary guide for Steps 3–8 below.

> **When to skip:**
> - The user is only fixing a specific configuration issue in an already-working setup → no setup guidance needed
> - Setup guidance was already retrieved in this session and nothing has changed → reuse prior guidance

---

## Phase 3: Execute Setup Steps

### Step 3: Determine the theme

Map the user's selection to the correct theme:
- `default` → `kendo-theme-default`
- `fluent` → `kendo-theme-fluent`
- `material` → `kendo-theme-material`
- `bootstrap` → `kendo-theme-bootstrap`

> **Skip if** a theme is already installed and the user didn't request a change.

### Step 4: Install the NuGet package

Ensure the Telerik NuGet source is configured, then install:

```bash
dotnet add package Telerik.UI.for.Blazor
```

If the Telerik NuGet source is not configured, guide the user through setup. Warn about secure credential storage rather than `--store-password-in-clear-text` in production environments.

> **Skip if** the package is already installed (detected in Phase 1). Only install what's missing.

### Step 5: Register Telerik services

Add to `Program.cs`:
```csharp
builder.Services.AddTelerikBlazor();
```

> **Skip if** already registered (detected in Phase 1).

### Step 6: Add TelerikRootComponent

Find the main layout file and wrap content:
```razor
<TelerikRootComponent>
    @Body
</TelerikRootComponent>
```

> **Skip if** already present. **Fix if** incorrectly placed.

### Step 7: Configure imports

Add to `_Imports.razor`:
```razor
@using Telerik.Blazor
@using Telerik.Blazor.Components
```

> **Skip if** already present.

### Step 8: Add theme CSS and JS references

Add to the HTML host file (`App.razor`, `_Host.cshtml`, or `index.html` depending on hosting model):
```html
<link href="_content/Telerik.UI.for.Blazor/css/kendo-theme-<selected>/all.css" rel="stylesheet" />
<script src="_content/Telerik.UI.for.Blazor/js/telerik-blazor.js"></script>
```

> **Skip if** the theme reference already exists. **Replace if** the user requested a different theme.

### Step 9: Create a usage example

Create a simple test component at `Pages/TelerikSetupTest.razor`:
```razor
@page "/telerik-test"

<h3>Telerik Setup Test</h3>

<TelerikButton ThemeColor="@ThemeConstants.Button.ThemeColor.Primary"
               OnClick="@OnButtonClick">
    Telerik UI for Blazor is ready!
</TelerikButton>

<p>@message</p>

@code {
    private string message = "";

    private void OnButtonClick()
    {
        message = "Setup is working correctly!";
    }
}
```

> **Skip if** the user is fixing configuration on an existing working setup — the setup is already verified. Only create the example for initial setup.

---

## Phase 4: Verify & Report

1. **Build check** — Run `dotnet build` to verify no errors from the new packages or configuration.
2. **Browser verification** — Delegate to the **tb-tester** subagent in **browser verification** mode. Provide:
   - The example component file (`TelerikSetupTest.razor`)
   - The page/route where the example renders (start the dev server if needed)
   - Verification criteria:
     - The TelerikButton renders with the selected theme's styling (correct colors, typography, spacing)
     - No console errors related to missing CSS, theme imports, JS interop, or service registration
   - If tb-tester reports theme rendering issues, diagnose (missing import, wrong host file, CSS load order) and fix before reporting

> **Build check is always required** when packages or configuration were changed.
> **Browser verification skip criteria:**
> - The user only fixed a specific configuration issue (no theme change) → skip browser verification
> - The example component from Step 9 was skipped → skip browser verification (nothing new to render)
> **Browser verification always required when:**
> - A new theme was installed or changed
> - This is the initial Telerik setup

3. **Report:**

```
## Telerik UI for Blazor Setup Complete

**Theme**: kendo-theme-<name>
**Package**: Telerik.UI.for.Blazor [version]
**Hosting model**: [Server/WebAssembly/Hybrid]
**Build**: [PASS/FAIL]

**Next steps**:
- Configure the Telerik NuGet source if not yet done
- Use the **tb-developer** agent to start building components
- Use the **tb-reviewer** agent to verify compliance at any time
- Run `/telerik-ui [requirement]` to build a feature end-to-end
```

---

## Persistent Workflow

**This workflow applies to subsequent setup requests.** When the user asks to change the theme, add configuration, or fix setup issues:
1. Return to **Phase 1** to re-assess only the relevant aspects of the current state
2. Skip already-completed steps (don't reinstall what's present)
3. Focus only on the requested changes
4. **Reason at every step** — apply the skip criteria. Never run a step out of habit when the criteria say it's unnecessary. Never skip a step without stating why.
