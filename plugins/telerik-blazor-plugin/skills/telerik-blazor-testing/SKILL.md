---
name: telerik-blazor-testing
description: >
  Use this skill when writing tests for Telerik UI for Blazor components, setting up a
  Blazor test environment, selecting the right testing library, or applying test patterns
  for specific Telerik Blazor components. Trigger when the user mentions "unit test Telerik
  Blazor", "how to test TelerikGrid", "set up testing for my Telerik app", "test a Telerik
  form", "mock Telerik components", "add accessibility tests for Telerik Blazor", or asks
  about testing patterns for any Telerik.Blazor component. Also trigger when telerik-tester
  needs component-specific testing guidance.
---

## Role

You are a Telerik UI for Blazor testing expert. You provide authoritative guidance on
test setup, patterns, and strategies specifically for `Telerik.UI.for.Blazor` components.

---

## Test Environment Setup

### Recommended Stack

| Tool | Purpose |
|------|---------|
| `bUnit` | Blazor component test framework |
| `xUnit` | Test runner (preferred for .NET projects) |
| `NUnit` | Alternative test runner |
| `Moq` | Mocking framework |
| `AngleSharp` | HTML parsing and DOM assertions (included with bUnit) |
| `Telerik.JustMock` | Advanced mocking (optional, for Telerik-specific scenarios) |

### Install

```bash
dotnet add package bunit --version latest
dotnet add package xunit
dotnet add package xunit.runner.visualstudio
dotnet add package Microsoft.NET.Test.Sdk
dotnet add package Moq
```

### Test project setup

Create a separate test project:
```bash
dotnet new xunit -n MyApp.Tests
dotnet add MyApp.Tests reference MyApp
dotnet add MyApp.Tests package bunit
dotnet add MyApp.Tests package Telerik.UI.for.Blazor
```

### Register Telerik services in tests

Telerik Blazor components require service registration:

```csharp
using Bunit;
using Telerik.Blazor.Components;

public class TelerikTestBase : TestContext
{
    public TelerikTestBase()
    {
        Services.AddTelerikBlazor();
        // Add JSInterop setup for Telerik
        JSInterop.Mode = JSRuntimeMode.Loose;
    }
}
```

---

## Universal Test Patterns

### Render without crashing

Every component test must start with a smoke test:

```csharp
[Fact]
public void Component_RendersWithoutCrashing()
{
    var cut = RenderComponent<MyTelerikComponent>();
    Assert.NotNull(cut.Markup);
}
```

### Parameter binding round-trip

Telerik components use two-way binding. Test the full Value/ValueChanged cycle:

```csharp
[Fact]
public void Input_CallsValueChanged_OnInput()
{
    string? capturedValue = null;
    var cut = RenderComponent<TelerikTextBox>(parameters => parameters
        .Add(p => p.Value, "")
        .Add(p => p.ValueChanged, (string val) => capturedValue = val)
    );

    cut.Find("input").Change("Hello");
    Assert.Equal("Hello", capturedValue);
}
```

### Accessibility assertion

```csharp
[Fact]
public void Component_HasProperAriaAttributes()
{
    var cut = RenderComponent<TelerikDropDownList<string, string>>(parameters => parameters
        .Add(p => p.Data, new List<string> { "Option A", "Option B" })
        .Add(p => p.Value, "Option A")
    );

    var element = cut.Find("[role]");
    Assert.NotNull(element);
}
```

---

## Component-Specific Patterns

> **IMPORTANT**: The patterns below are structural examples for illustration purposes only.
> They showcase a subset of Telerik Blazor components — the same testing approach applies to
> all Telerik components. Exact parameter names, event signatures, and EventArgs shapes
> **must** be verified via telerik-context-retriever before writing any assertions. Do not
> assume the API shown here is current or complete — always ground assertions in MCP tool output.

### Example: Data Grid Component (e.g., TelerikGrid)

```csharp
public class GridTests : TelerikTestBase
{
    private readonly List<Product> _data = new()
    {
        new Product { Id = 1, Name = "Product A", Price = 100 },
        new Product { Id = 2, Name = "Product B", Price = 200 },
    };

    [Fact]
    public void Grid_RendersAllDataRows()
    {
        var cut = RenderComponent<TelerikGrid<Product>>(parameters => parameters
            .Add(p => p.Data, _data)
            .AddChildContent<GridColumns>(columns => columns
                .AddChildContent<GridColumn>(col => col
                    .Add(c => c.Field, nameof(Product.Name))
                    .Add(c => c.Title, "Name")
                )
            )
        );

        var rows = cut.FindAll("tbody tr");
        Assert.Equal(_data.Count, rows.Count);
    }
}
```

### Example: Form & Input Components

```csharp
[Fact]
public void Form_ShowsValidationError_OnInvalidSubmit()
{
    var model = new MyFormModel();
    var cut = RenderComponent<TelerikForm>(parameters => parameters
        .Add(p => p.Model, model)
    );

    cut.Find("form").Submit();

    var validationMessages = cut.FindAll(".k-form-error");
    Assert.NotEmpty(validationMessages);
}
```

### Example: Selection/Dropdown Components (e.g., TelerikDropDownList)

```csharp
[Fact]
public void DropDownList_CallsValueChanged_OnSelection()
{
    string? selectedValue = null;
    var data = new List<string> { "Baseball", "Basketball", "Football" };

    var cut = RenderComponent<TelerikDropDownList<string, string>>(parameters => parameters
        .Add(p => p.Data, data)
        .Add(p => p.Value, data[0])
        .Add(p => p.ValueChanged, (string val) => selectedValue = val)
    );

    // Simulate selection through Telerik's rendered markup
    var items = cut.FindAll(".k-list-item");
    if (items.Count > 1)
    {
        items[1].Click();
    }

    Assert.NotNull(selectedValue);
}
```

### Example: Dialog/Overlay Components (e.g., TelerikDialog)

```csharp
[Fact]
public void Dialog_RendersContent_WhenVisible()
{
    var cut = RenderComponent<TelerikDialog>(parameters => parameters
        .Add(p => p.Visible, true)
        .Add(p => p.Title, "Confirm Delete")
        .AddChildContent("<p>Are you sure?</p>")
    );

    Assert.Contains("Confirm Delete", cut.Markup);
    Assert.Contains("Are you sure?", cut.Markup);
}
```

### Example: Chart/Visualization Components (e.g., TelerikChart)

```csharp
[Fact]
public void Chart_RendersWithoutCrashing()
{
    var cut = RenderComponent<TelerikChart>();
    Assert.NotNull(cut.Markup);
}
```

---

## Mocking Patterns

### Mock data services *(example pattern — adapt service and method names to your project)*

```csharp
var mockService = new Mock<IMyDataService>();
mockService.Setup(s => s.GetItemsAsync())
    .ReturnsAsync(new List<MyItem> { new() { Id = 1, Name = "Test" } });

Services.AddSingleton(mockService.Object);
```

### JSInterop for Telerik components

Telerik Blazor components use JSInterop internally. Set loose mode:

```csharp
JSInterop.Mode = JSRuntimeMode.Loose;
```

---

## Test Organization

- **Co-locate unit tests**: `MyApp.Tests/Components/MyComponent/MyComponentTests.cs` *(replace with your actual component path)*
- **One test class per component, one method per behavior**
- **Descriptive test names**: `Component_Renders3Items_WhenDataHas3Items` not `Test1`
- **Use `Theory` + `InlineData`** for parameterized tests
- **Inherit from `TelerikTestBase`** for consistent service registration

---

## Coverage Targets

| Layer | Minimum Target |
|-------|---------------|
| Unit (statements) | 80% |
| Unit (branches) | 70% |
| Accessibility (manual review) | All interactive components verified |
