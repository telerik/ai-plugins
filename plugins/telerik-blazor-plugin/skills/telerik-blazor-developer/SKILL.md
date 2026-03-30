---
name: telerik-blazor-developer
description: >
  Use this skill whenever the user wants to build, implement, or customize Telerik UI
  for Blazor components. Trigger when the user mentions adding a Telerik component, using
  TelerikGrid/TelerikScheduler/TelerikChart/TelerikDropDownList or any other Telerik Blazor
  UI component, applying a Telerik theme, finding Telerik icons, or phrases like "how do I
  use Telerik Blazor", "add a Telerik grid", "implement a Telerik chart", "customize
  Telerik theme", "Telerik Blazor example", "install Telerik.UI.for.Blazor", or "use
  Telerik UI for Blazor". Also trigger when the user asks to build Blazor UI components
  and Telerik.UI.for.Blazor is already a dependency in the project.
---

## Purpose

This skill teaches an agent how to implement Telerik UI for Blazor components correctly
and efficiently — producing API-accurate, accessible, and well-typed code using
exclusively `Telerik.UI.for.Blazor`.

---

## Reference Loading

Before implementing any component, read the relevant reference files from `references/`:

- **Always** → Read `references/common-guidelines.md` for NuGet installation, TelerikRootComponent, and attribute splatting rules
- **Always** → Read `references/component-registry.md` for the full component list
- **When accessibility matters** → Read `references/accessibility.md` for WCAG 2.2 AA guidelines and checklist

---

## Responsibilities

- Implement Telerik Blazor components with correct parameters and C# types
- Select the right component for a given use case
- Configure data binding, event handlers, and state management
- Apply Progress Design System layout utilities for spacing and structure
- Generate or customize themes using CSS variables
- Find and integrate Telerik icons
- Ensure implementations meet WCAG 2.2 AA accessibility requirements
- Install only the NuGet packages actually needed

## Implementation Patterns

> **Note**: The code examples below use specific Telerik Blazor components for illustration only.
> Always verify the exact API via injected context before writing implementation code.

### Prefer Razor components with parameters and EventCallback
```razor
@page "/products"

<TelerikGrid Data="@GridData"
             Pageable="true"
             Sortable="true"
             FilterMode="@GridFilterMode.FilterRow">
    <GridColumns>
        <GridColumn Field="@nameof(Product.Name)" Title="Name" />
        <GridColumn Field="@nameof(Product.Price)" Title="Price" />
    </GridColumns>
</TelerikGrid>

@code {
    private List<Product> GridData { get; set; } = new();

    protected override async Task OnInitializedAsync()
    {
        GridData = await ProductService.GetProductsAsync();
    }
}
```

### Import Telerik namespaces in _Imports.razor

Ensure the following are in `_Imports.razor`:

```razor
@using Telerik.Blazor
@using Telerik.Blazor.Components
```

### Configure TelerikRootComponent

The `TelerikRootComponent` must wrap the app content in the layout:

```razor
@* MainLayout.razor *@
<TelerikRootComponent>
    @Body
</TelerikRootComponent>
```

### Register Telerik services in Program.cs
```csharp
builder.Services.AddTelerikBlazor();
```

### Package installation
Install the Telerik.UI.for.Blazor NuGet package if not already present:
```bash
dotnet add package Telerik.UI.for.Blazor
```
Ensure the Telerik NuGet source is configured.

## Accessibility Rules

Every component implementation must meet WCAG 2.1 AA:

- Provide accessible labels for all inputs (`aria-label`, `aria-labelledby`, or visible label)
- Ensure keyboard navigability (Tab, Enter, Escape, arrow keys)
- Use correct ARIA roles for custom interactive elements
- Manage focus appropriately on open/close of overlays and dialogs
- Ensure sufficient color contrast

## Quality Checklist

Before delivering any implementation, verify:

1. No imports from non-`Telerik.UI.for.Blazor` UI libraries
2. All component parameters are strongly typed with C# models
3. All interactive elements have accessible labels
4. Two-way binding patterns use `@bind-Value` correctly
5. `TelerikRootComponent` wraps app content and `AddTelerikBlazor()` is registered
6. Code follows the project's existing patterns and conventions
| Icon lookup | Find Telerik SVG icons by purpose or keyword |
| Layout utilities | CSS utility classes, building block examples, responsive design, layout component recommendations |
| Theme variables | CSS variable theme generation, customization, brand application |
| Getting started | Project scaffolding, setup instructions, NuGet source configuration |
