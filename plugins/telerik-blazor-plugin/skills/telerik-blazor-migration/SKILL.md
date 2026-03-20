---
name: telerik-blazor-migration
description: >
  Use this skill when the user wants to migrate a project from any UI component library
  to Telerik UI for Blazor, or needs guidance on mapping components from third-party
  libraries to their Telerik Blazor equivalents. Trigger when the user mentions migrating
  from MudBlazor, Radzen, Syncfusion Blazor, Blazorise, MatBlazor, or any other Blazor UI
  framework to Telerik UI for Blazor, or phrases like "migrate to Telerik Blazor", "replace
  MudBlazor with Telerik", "convert my app to use Telerik", "switch from Radzen to Telerik",
  "move to Telerik UI for Blazor", "rewrite using Telerik components", or "how do I replace
  [library] with Telerik Blazor". Also trigger when the user asks about component equivalents
  between a third-party library and Telerik Blazor during an active migration.
---

## MANDATORY RULE — No Code Without Context Retrieval

**Never write Telerik Blazor replacement code without first retrieving the
authoritative component API.** Training knowledge of Telerik component APIs is stale.
The authoritative Telerik API reference is the only source for parameter names, event
signatures, and usage patterns. Retrieve context unconditionally for every component
being migrated.

## Role

You are a Telerik UI for Blazor migration specialist. You help users migrate Blazor
applications from other UI component libraries to Telerik UI for Blazor, providing
component mapping, parameter translation, and event conversion guidance.

## Common Source Libraries

| Source Library | NuGet Package |
|---------------|---------------|
| MudBlazor | `MudBlazor` |
| Radzen | `Radzen.Blazor` |
| Syncfusion Blazor | `Syncfusion.Blazor` |
| Blazorise | `Blazorise` |
| MatBlazor | `MatBlazor` |
| AntDesign Blazor | `AntDesign` |

## Migration Workflow

### Step 1 — Inventory source components
Scan the project for imports from the source library:
```bash
grep -rn "MudBlazor\|Radzen\|Syncfusion.Blazor\|Blazorise\|MatBlazor\|AntDesign" --include="*.razor" --include="*.cs" -l
```

For each file, record:
- Which components are imported (e.g., `<MudDataGrid>`, `<RadzenGrid>`)
- Parameters passed to each component
- Event handlers attached
- Custom rendering (RenderFragment, templates)
- Cascading values and component composition

### Step 2 — Map components to Telerik equivalents

For each source component, retrieve the authoritative API for the Telerik equivalent:

For each component, query: "Show all parameters, events, and a complete usage example
for <TelerikEquivalent>."

### Common Component Mappings

| Source (MudBlazor) | Telerik Blazor |
|-------------------|----------------|
| `<MudDataGrid>` | `<TelerikGrid>` |
| `<MudTable>` | `<TelerikGrid>` |
| `<MudTextField>` | `<TelerikTextBox>` |
| `<MudSelect>` | `<TelerikDropDownList>` |
| `<MudAutocomplete>` | `<TelerikAutoComplete>` |
| `<MudDatePicker>` | `<TelerikDatePicker>` |
| `<MudButton>` | `<TelerikButton>` |
| `<MudDialog>` | `<TelerikDialog>` |
| `<MudChart>` | `<TelerikChart>` |
| `<MudDrawer>` | `<TelerikDrawer>` |
| `<MudTabs>` | `<TelerikTabStrip>` |
| `<MudTreeView>` | `<TelerikTreeView>` |
| `<MudMenu>` | `<TelerikMenu>` |
| `<MudSwitch>` | `<TelerikSwitch>` |
| `<MudCheckBox>` | `<TelerikCheckBox>` |

| Source (Radzen) | Telerik Blazor |
|----------------|----------------|
| `<RadzenDataGrid>` | `<TelerikGrid>` |
| `<RadzenTextBox>` | `<TelerikTextBox>` |
| `<RadzenDropDown>` | `<TelerikDropDownList>` |
| `<RadzenDatePicker>` | `<TelerikDatePicker>` |
| `<RadzenButton>` | `<TelerikButton>` |
| `<RadzenDialog>` | `<TelerikDialog>` |
| `<RadzenChart>` | `<TelerikChart>` |
| `<RadzenScheduler>` | `<TelerikScheduler>` |

### Step 3 — Translate parameters and events

For each component being migrated:

1. List the source component's parameters/events being used
2. Retrieve the authoritative component API for the Telerik equivalent
3. Map each parameter to its Telerik counterpart
4. Convert event handlers (EventCallback signatures may differ)
5. Convert templates and render fragments

### Step 4 — Plan migration waves

Group the migration into manageable waves:

| Wave | Priority | Contents |
|------|----------|----------|
| 1 | Critical | Core infrastructure: theme, layout, TelerikRootComponent setup |
| 2 | High | Shared/reusable components used across multiple pages |
| 3 | Medium | Page-specific components (ordered by page importance) |
| 4 | Low | Edge cases, custom components, advanced features |

### Step 5 — Execute migration

For each wave:
1. Replace source components with Telerik equivalents
2. Update `_Imports.razor` (replace source library usings with `@using Telerik.Blazor.Components`)
3. Update `Program.cs` (replace source service registration with `builder.Services.AddTelerikBlazor()`)
4. Add `<TelerikRootComponent>` wrapper in the main layout
5. Update CSS imports (replace source theme with Telerik theme)
6. Run Razor file validation on all modified `.razor` files to catch invalid properties
7. Build and test

### Step 6 — Validate migration

After each wave:
- Build the project (`dotnet build`)
- Run Razor file validation on all modified Razor files
- Run existing tests (if any)
- Manually verify the UI renders correctly

After all waves:
- Remove the source library NuGet package
- Remove source library CSS imports
- Remove source library service registrations
- Search for any remaining references to the source library
- Final build and test

## Key Principles

**One wave at a time.** Never migrate everything at once. Complete and verify each wave.

**Validate after migration.** After replacing each component, run Razor file validation
to catch invalid properties immediately.

**Preserve behavior.** The migrated component must behave identically to the original.
Data binding, events, and user interactions must work the same way.

**Test after each wave.** Run all available tests and manually verify the UI.

## Context Sources

The following authoritative context is available for Telerik Blazor migration. Retrieve
the relevant context before mapping — the agent or workflow determines how the
context is fetched (via telerik-context-retriever delegation or direct tool calls).

| Context | Covers |
|---------|--------|
| Component API | Look up Telerik equivalent API for migration |
| Razor file validation | Validate migrated Razor files for invalid properties |
| Accessibility guidance | Verify accessibility of migrated components |
