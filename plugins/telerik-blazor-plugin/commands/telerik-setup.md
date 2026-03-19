---
name: telerik-setup
description: Bootstrap Telerik UI for Blazor in an existing Blazor project. Installs the necessary NuGet package, configures services, sets up theming, and verifies the project is ready for Telerik component development. Run this when starting a new Telerik integration or when Telerik is not yet configured in the project.
argument-hint: "[theme] — optional theme name: default (default), fluent, material, bootstrap"
allowed-tools: "*"
---

Bootstrap Telerik UI for Blazor in the current Blazor project. Set up all required configuration so the developer can immediately start using Telerik components.

## Step 1: Assess the project

Read the `.csproj` file to understand:
- What .NET version is in use
- What Blazor hosting model (Server, WebAssembly, Hybrid)
- Whether `Telerik.UI.for.Blazor` NuGet package is already installed
- Whether a Telerik theme is already referenced

If Telerik is already configured, report what's installed and ask whether to fix or extend the setup.

## Step 2: Determine the theme

If the user provided a theme argument, use it. Valid themes:
- `default` → `kendo-theme-default`
- `fluent` → `kendo-theme-fluent`
- `material` → `kendo-theme-material`
- `bootstrap` → `kendo-theme-bootstrap`

If no argument was provided, ask the user: "Which Telerik theme would you like to use? Options: **default**, fluent, material, bootstrap. (default is recommended for most projects)"

## Step 3: Install the NuGet package

Ensure the Telerik NuGet source is configured, then install:

```bash
dotnet add package Telerik.UI.for.Blazor
```

If the Telerik NuGet source is not configured, guide the user:
```bash
dotnet nuget add source "https://nuget.telerik.com/v3/index.json" --name "Telerik" --username "your-email" --password "your-password" --store-password-in-clear-text
```

## Step 4: Register Telerik services

Find `Program.cs` and add the Telerik service registration:

```csharp
builder.Services.AddTelerikBlazor();
```

Add the required using statement if not present:
```csharp
using Telerik.Blazor;
```

## Step 5: Add TelerikRootComponent

Find the main layout file (typically `Shared/MainLayout.razor` or `Components/Layout/MainLayout.razor`) and wrap the content:

```razor
@inherits LayoutComponentBase

<TelerikRootComponent>
    <div class="page">
        @Body
    </div>
</TelerikRootComponent>
```

## Step 6: Configure imports

Add to `_Imports.razor`:

```razor
@using Telerik.Blazor
@using Telerik.Blazor.Components
```

## Step 7: Add theme CSS reference

Find the HTML host file (`_Host.cshtml`, `App.razor`, or `index.html` depending on the hosting model) and add the theme CSS:

**For Blazor Server (.NET 8+ with App.razor):**
```html
<link href="_content/Telerik.UI.for.Blazor/css/kendo-theme-<selected>/all.css" rel="stylesheet" />
```

**For Blazor WebAssembly (index.html):**
```html
<link href="_content/Telerik.UI.for.Blazor/css/kendo-theme-<selected>/all.css" rel="stylesheet" />
```

Also add the Telerik JS interop reference:
```html
<script src="_content/Telerik.UI.for.Blazor/js/telerik-blazor.js"></script>
```

## Step 8: Create a usage example

Create a simple example component to verify the setup works. Place it at `Pages/TelerikSetupTest.razor`:

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

Show the user how to navigate to `/telerik-test` to verify the setup.

## Step 9: Use telerik-blazor-getting-started skill for scaffolding or guidance

If the user wants to scaffold a completely new Blazor project with Telerik pre-configured,
or needs hosting-model-specific setup guidance, use the **telerik-blazor-getting-started skill**.

The skill calls `telerik_getting_started_assistant` to get authoritative, version-specific
instructions:

```
telerik_getting_started_assistant(
  query: "Create a new Blazor <hosting-model> project with Telerik UI for Blazor.
          Project name: <name>. Theme: <theme>."
)
```

This provides the exact commands, service registration, imports, theme references, and
`TelerikRootComponent` placement for the target hosting model.
