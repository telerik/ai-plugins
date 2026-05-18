# Telerik UI for Blazor — Common Guidelines

These rules apply to every Telerik UI for Blazor implementation.

## Enable Blazor Interactivity

Always use global interactive render mode for Telerik UI for Blazor applications unless otherwise specified.

## Installing NuGet Package

Always use the latest version of Telerik UI for Blazor. For initial installation, use:

```bash
dotnet add package Telerik.UI.for.Blazor
```

## TelerikRootComponent

Use a single `TelerikRootComponent` component as a top-level component in the app. Add a `<TelerikRootComponent>` to the app layout file (by default, `MainLayout.razor`). Make sure that the `TelerikRootComponent` wraps all the content in the `MainLayout`.

In `MainLayout.razor`:

```razor
<TelerikRootComponent>
     @* Layout content *@
</TelerikRootComponent>
```

## No Attribute Splatting

Telerik UI for Blazor components do **not support attribute splatting**. Do not use `style`, `class`, or other arbitrary HTML attributes directly on Telerik components. Instead, use the component's built-in parameters (e.g., `Class`, `Width`, `Height`) or wrap the component in a container element to apply custom styling.
