# Getting Started with Telerik UI for Blazor — Blazor Web App (.NET 8+)

This guide walks you through creating a new Blazor Web App (.NET 8+) and setting up Telerik UI for Blazor with the Default theme.

Execute the following steps in order.

**Important: Run all provided commands.**

## Prerequisites

Before you begin, ensure you have:
- **.NET 8 SDK or later** installed on your machine
- If .NET 8 is not available, install the latest .NET SDK automatically as a preliminary step before running the `dotnet new` command.

## Step 1: Create the Project

Create a new Blazor Web App (.NET 8+) project using the .NET CLI:

```bash
dotnet new blazor -n <project-name>
```

Navigate to the project directory:

```bash
cd <project-name>
```

## Step 2: Install the NuGet Package

Install the Telerik UI for Blazor NuGet package in your project:

```bash
dotnet add package Telerik.UI.for.Blazor
```

**Verification:** Check your `.csproj` file to confirm the package reference:

```bash
dotnet list package | grep Telerik.UI.for.Blazor
```

## Step 3: Add Client Assets (JS and CSS)

Add the Telerik JavaScript and CSS files to your application in `App.razor` or `Components/App.razor`:

```html
<head>
    <!-- Telerik Blazor JavaScript. It's important to be placed in the <head> section -->
    <script src="_content/Telerik.UI.for.Blazor/js/telerik-blazor.js"></script>

    <!-- Telerik Theme CSS (Default) -->
    <link rel="stylesheet" href="_content/Telerik.UI.for.Blazor/css/kendo-theme-default/all.css" />

    <!-- Telerik CSS Utils. It's important to use double @@, because it's a special syntax in Razor -->
    <link rel="stylesheet" href="https://unpkg.com/@@progress/kendo-theme-utils/dist/all.css" />
</head>
```

## Step 4: Add Namespace Imports

Add the Telerik namespaces to your `_Imports.razor` file:

**In `_Imports.razor`:**
```razor
@using Telerik.Blazor
@using Telerik.Blazor.Components
@using Telerik.SvgIcons
@using Telerik.FontIcons
```

## Step 5: Register Telerik Services

Add the Telerik services to your application's dependency injection container:

**In `Program.cs`:**
```csharp
// Add this using statement at the top
using Telerik.Blazor.Services;

var builder = WebApplication.CreateBuilder(args);

// Register Telerik Blazor services
builder.Services.AddTelerikBlazor();

var app = builder.Build();
```

## Step 6: Add TelerikRootComponent

Wrap your application content with the `TelerikRootComponent` in your layout file:

**In `MainLayout.razor` (or your main layout component):**
```razor
@inherits LayoutComponentBase

<TelerikRootComponent>
    @* existing MainLayout.razor content here *@
</TelerikRootComponent>
```

## Step 7: Create a Demo Page

Add the following to `Home.razor` to showcase Telerik UI for Blazor features and verify components are working correctly:

```razor
<div class="k-d-flex k-flex-col k-gap-5 k-p-6">
    <div class="k-d-flex k-flex-col k-align-items-center k-gap-3 k-py-4">
        <h1 class="k-h2 k-text-center">Telerik UI for Blazor</h1>
        <p class="k-h5 k-text-center k-color-subtle k-font-weight-normal k-max-w-3xl">
            Create sophisticated Blazor UIs with AI-powered agents using natural language prompts
        </p>
    </div>

    <div class="k-text-center k-py-2">
        <p class="k-font-size-lg k-font-weight-bold k-mb-4">😊 Ready to build? Copy any prompt below directly into your coding agent to get started</p>
        <div class="k-d-grid k-grid-cols-3 k-gap-4 k-max-w-screen-xl k-mx-auto">
            <div class="prompt-box k-p-4 k-rounded-md">
                <p class="k-font-family-monospace k-text-base k-m-0">'#telerik_ui_generator Create a dashboard with sales charts, revenue KPIs, and a recent orders grid'</p>
            </div>
            <div class="prompt-box k-p-4 k-rounded-md">
                <p class="k-font-family-monospace k-text-base k-m-0">'#telerik_ui_generator Create an ecommerce product details page with product images, specifications, reviews, and an add to cart button'</p>
            </div>
            <div class="prompt-box k-p-4 k-rounded-md">
                <p class="k-font-family-monospace k-text-base k-m-0">'#telerik_ui_generator Build a registration form with email and password inputs, where did you learn about us text area, and agreement checkbox'</p>
            </div>
        </div>
    </div>

    <div class="k-text-center">
        <p class="k-font-size-lg k-font-weight-bold k-mb-0 k-mt-4">🛠 Explore the tools available to help you build faster</p>
    </div>

    <div class="k-d-grid k-grid-cols-3 k-gap-5 k-max-w-screen-xl k-mx-auto">
        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">🎨 UI Generator</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Build complete pages and sections from a plain-language description, combining the right tools automatically.</p>
                <p class="k-font-size-lg"><strong>Examples:</strong> Dashboards, landing pages, admin panels</p>
            </CardBody>
        </TelerikCard>

        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">🧩 Component Assistant</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Generate Blazor components with the necessary configuration tailored to your specific requirements.</p>
                <p class="k-font-size-lg"><strong>Components:</strong> Grid, Chart, Scheduler, Form, Navigation</p>
            </CardBody>
        </TelerikCard>

        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">📐 Layout Assistant</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Build and arrange layouts, spacing your UI elements precisely for any screen size with utilities, Telerik layout components, and scoped CSS when needed.</p>
                <p class="k-font-size-lg"><strong>Utilities:</strong> Flexbox, Grid, Spacing, Typography</p>
            </CardBody>
        </TelerikCard>

        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">🎯 Icon Assistant</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Find the right icon for any action or concept and get it wired up with the correct Blazor syntax.</p>
                <p class="k-font-size-lg"><strong>Features:</strong> Suggests the best icons based on your scenario</p>
            </CardBody>
        </TelerikCard>

        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">✅ Validator Assistant</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Catch invalid component properties and misconfigurations before they cause runtime issues.</p>
                <p class="k-font-size-lg"><strong>Checks:</strong> Parameter types, values, best practices</p>
            </CardBody>
        </TelerikCard>

        <TelerikCard>
            <CardHeader Class="k-py-2">
                <CardTitle><span class="card-title k-font-weight-bold">🎨 Style Assistant</span></CardTitle>
            </CardHeader>
            <CardBody>
                <p class="k-mb-3 k-font-size-lg">Apply a custom color scheme or brand identity consistently across all components in one step.</p>
                <p class="k-font-size-lg"><strong>Customization:</strong> Color schemes, branding, appearance</p>
            </CardBody>
        </TelerikCard>
    </div>
</div>

<style>
    .prompt-box {
        position: relative;
        border-radius: var(--kendo-border-radius-lg, 0.375rem);
        border: 2px solid transparent;
        background: linear-gradient(#fff, #fff) padding-box, linear-gradient(105deg, #c158e4 11.99%, #0bf 49.33%, #001dff 88.12%) border-box;
        box-shadow: var(--kendo-elevation-4);
    }

    .card-title {
        font-size: 1.2rem;
        letter-spacing: 0.01em;
    }
</style>
```

## Step 8: Run Your Application

**Verification:** Automatically run the application. Do not just inform the user—execute the following command and keep the application running:

```bash
cd <project-name> && dotnet run
```
