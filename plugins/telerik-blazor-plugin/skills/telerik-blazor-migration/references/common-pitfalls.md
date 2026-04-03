# Common Migration Pitfalls (Blazor)

> Cross-library pitfalls that apply to most source library → Telerik UI for Blazor migrations.

## TelerikRootComponent Placement

- `<TelerikRootComponent>` MUST wrap the app content in `MainLayout.razor`
- It provides the rendering context for popups, dialogs, notifications, and tooltips
- Missing it → popups render at wrong z-index or don't appear at all
- Place it as the outermost wrapper around `@Body`

## Service Registration Order

- `builder.Services.AddTelerikBlazor()` must be called in `Program.cs`
- Call it after the builder is created but before `builder.Build()`
- Missing it → runtime exception: "Unable to resolve service for type 'Telerik.Blazor...'"

## Namespace Collisions

- During incremental migration, both source and Telerik namespaces are in `_Imports.razor`
- Component name collisions (e.g., `Button` from both libraries) → use fully qualified names
- Alternatively, use `@using` only in specific `.razor` files instead of globally

## Two-Way Binding Differences

- Telerik consistently uses `@bind-Value` (capital V) for input binding
- MudBlazor uses `@bind-Value` (same pattern)
- Radzen uses `@bind-Value` but some components use `Value` + `Change` event separately
- When migrating, verify the binding pattern per component

## Event Callback Signatures

- Telerik events use strongly-typed EventArgs (e.g., `GridReadEventArgs`, `ButtonClickEventArgs`)
- Source libraries may use generic `EventArgs`, `MouseEventArgs`, or custom types
- Always check the delegate signature when mapping event handlers

## CSS Theme Conflicts

- Telerik themes use `k-` prefixed CSS classes (shared with KendoReact themes)
- Source library themes may use global styles that affect Telerik rendering
- During coexistence: load Telerik theme CSS after source theme to give it priority
- Or use CSS `@layer` for explicit cascade control

## Licensing

- Telerik UI for Blazor requires a license
- Configure the Telerik NuGet feed in `nuget.config`
- Missing NuGet source → package restore failure
- Trial license → banner watermark in browser

## Server-Side Data Operations

- Telerik Grid uses `OnRead` event with `DataSourceRequest` / `DataSourceResult`
- Extension method `ToDataSourceResult()` handles sort/filter/page on `IQueryable`
- Source libraries may use different patterns (LoadData callbacks, manual LINQ, OData)
- The `Telerik.DataSource` NuGet package provides the data operation utilities

## EditForm Integration

- Telerik input components work natively with Blazor `<EditForm>` and `<DataAnnotationsValidator>`
- No need for special form wrappers — use standard Blazor form patterns
- `@bind-Value` on Telerik inputs triggers validation automatically
- Custom validation: works the same way as any Blazor input component

## JavaScript Interop

- Telerik requires its JS interop file: `_content/Telerik.UI.for.Blazor/js/telerik-blazor.js`
- Must be loaded before closing `</body>` tag
- Missing it → "Could not find 'TelerikBlazor' in 'window'" console error
- Remove source library JS files only after all components are migrated
