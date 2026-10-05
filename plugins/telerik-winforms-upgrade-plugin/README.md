# Telerik WinForms Upgrade Plugin

Copilot CLI plugin that integrates with the Microsoft Upgrade Agent to modernize
WinForms applications using Telerik UI for WinForms.

## Microsoft Upgrade Agent Resources

This plugin extends Microsoft's Upgrade Agent. These references cover the host
plugin, setup, samples, and instruction-authoring guidance:

- [Microsoft Upgrade Agent plugin repository](https://github.com/microsoft/upgrade-agent-plugins)
- [Upgrade Agent samples documentation](https://github.com/microsoft/upgrade-agent-samples/tree/ap/AddInitialSamples/docs)
- [Instruction size and token budget guidelines](https://github.com/microsoft/upgrade-agent-samples/blob/ap/AddInitialSamples/docs/07-instruction-size-and-tokens.md)
- [GitHub Copilot upgrade online docs](https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-upgrade/overview)

## Prerequisites

- [GitHub Copilot CLI](https://docs.github.com/en/copilot) with Upgrade Agent support
- A [Telerik user account](https://www.telerik.com/account/) with an active
  [DevCraft or Telerik UI for WinForms license](https://www.telerik.com/purchase/individual/winforms.aspx)
  (or a [free trial](https://www.telerik.com/try/ui-for-winforms))
- [.NET 8](https://dotnet.microsoft.com/en-us/download) or later — required to run
  the `Telerik.WinForms.MCP` tool server (the target application can be on any
  supported .NET version, including .NET Framework)

## Installation

From the repository root, install the plugin via Copilot CLI:

```bash
copilot plugin install ./plugins/telerik-winforms-upgrade-plugin
```

## What It Does

This plugin registers four modernization scenarios. The agent picks the one
that matches the user's intent:

| Scenario | When | What happens |
|----------|------|--------------|
| **telerik-version-upgrade** | The project already uses Telerik and the user wants a newer Telerik version | Upgrades the Telerik package version, migrates assembly refs to NuGet, sets up licensing, and fixes breaking changes |
| **telerik-control-conversion** | The user wants standard Microsoft WinForms controls replaced with Telerik equivalents | Installs Telerik, sets up licensing, converts forms one at a time, and applies a Telerik theme |
| **telerik-assembly-to-nuget** | The user only wants direct Telerik assembly references replaced with NuGet packages, with no version or .NET target change | Detects the current Telerik version and reference style, sets up the right NuGet feed, maps assemblies to packages, and migrates the project |
| **telerik-licensing** | The user wants Telerik license activation set up, fixed, or migrated | Detects the licensing mechanism, repairs activation, and verifies builds |

`telerik-version-upgrade` and `telerik-control-conversion` chain: after an upgrade completes,
the plugin offers control conversion; after a conversion completes, it offers
a version upgrade. `telerik-assembly-to-nuget` is a standalone, narrower scenario for
when only the reference style needs to change.

### .NET version upgrades

Neither scenario changes the project's `<TargetFramework>`. When the user also
wants a different .NET version (.NET Framework → .NET, or .NET 8 → .NET 10), run
the Microsoft `dotnet-version-upgrade` scenario **first** — the resulting .NET
target determines which Telerik versions are available — then run
`telerik-version-upgrade`.

### Additive concerns

Both scenarios detect and handle:
- **Assembly → NuGet migration** — replaces direct DLL references with the
  `Telerik.UI.for.WinForms.AllControls` NuGet package
- **License activation** — for Q1 2025+ projects, Telerik control NuGet packages
  bring `Telerik.Licensing` transitively so the shared license file activates the application

### Licensing

The Telerik license key is shared between the MCP server and NuGet-based
application activation. `telerik-control-conversion` and `telerik-version-upgrade` block on
it because their MCP tool calls need it; `telerik-assembly-to-nuget` checks for it but
continues without blocking, since its work doesn't call `telerik_*` tools. For
Q1 2025+ projects that use Telerik NuGet packages, `Telerik.Licensing` is a
transitive dependency, so the same key activates the application build
without an explicit package reference. A .NET Framework project that retains
direct Telerik assembly references must install `Telerik.Licensing`
explicitly.

Save the shared license file to `%AppData%\Telerik\telerik-license.txt`, or as
`telerik-license.txt` in the project or solution root, before running a
scenario.

## MCP Server

The plugin uses the [Telerik.WinForms.MCP](https://www.nuget.org/packages/Telerik.WinForms.MCP)
NuGet package, which exposes:

| Tool | What it does |
|------|--------------|
| `telerik_get_migration_plan` | Returns a static migration playbook — workflow, critical rules, anti-patterns |
| `telerik_analyze_project` | Analyzes the **`.csproj`** — target framework, project style, Telerik references. Does *not* enumerate controls. |
| `telerik_add_package_reference` | Install instructions for `Telerik.UI.for.WinForms.AllControls` |
| `telerik_convert_file` | Roslyn conversion of one file — **this is where control mapping happens** |
| `telerik_upgrade_assistant` | Breaking-change detection between Telerik versions (via Telerik CLI) |
| `telerik_get_theme_setup` | Telerik theme configuration |
| `telerik_winforms_assistant` | Component API guidance |

These run server-side against your project — analysis works on a project with no
Telerik reference at all. Path arguments are elicited from you if the agent
passes one that can't be resolved.

`telerik_upgrade_assistant` additionally requires the Telerik CLI:

```bash
dotnet tool install --global Telerik.CLI
```
## Skills

### Scenarios

| Skill | Purpose |
|-------|---------|
| `telerik-version-upgrade` | Upgrade the Telerik UI for WinForms version with breaking-changes detection |
| `telerik-control-conversion` | Convert Microsoft WinForms controls to Telerik equivalents |
| `telerik-assembly-to-nuget` | Migrate direct Telerik assembly references to NuGet packages, with no version or .NET target change |
| `telerik-licensing` | Set up, fix, or migrate Telerik license activation |

### Lazy (loaded on demand)

| Skill | Purpose |
|-------|---------|
| `telerik-winforms-breaking-changes` | Detect and fix breaking changes via `telerik_upgrade_assistant` |
| `telerik-winforms-dependency-management` | NuGet package management and assembly→NuGet migration |
| `telerik-winforms-license-detection` | Read-only detection of the current Telerik licensing mechanism, artifacts, and entry-point shape |
| `telerik-winforms-license-key-setup` | Obtain and place a license key for the recommended NuGet-based path, or the script-key path |
| `telerik-winforms-license-plugin-hosts` | Set up or fix licensing for add-in/plugin (hybrid) and OpenEdge (script-key-only) hosts with no standard entry point |
| `telerik-winforms-license-nuget-migration` | Convert a project from script-key licensing to the NuGet-based `Telerik.Licensing` model |
| `telerik-winforms-license-diagnostics` | Map licensing symptoms and `TKL*` codes to causes and fixes |
| `telerik-winforms-license-verification` | Build and confirm a licensing setup actually activates |
| `telerik-winforms-conversion` | Convert MS WinForms controls to Telerik equivalents, one class pair at a time |
| `telerik-winforms-component-guidance` | Component API help via `telerik_winforms_assistant` |
| `telerik-winforms-reference-detection` | Detect a project's current Telerik version and reference style (assembly / NuGet / packages.config) |
| `telerik-winforms-nuget-feed-setup` | Determine, validate, and set up the NuGet feed needed for a given Telerik version |
| `telerik-winforms-assembly-mapping` | Map Telerik assembly references to their owning NuGet packages |
| `telerik-winforms-reference-migration` | Edit a project file to replace assembly references with PackageReference |
| `telerik-winforms-reference-retargeting` | Retarget direct assembly references to a new Telerik version without changing the delivery method |
| `telerik-winforms-migration-verification` | Restore, build, and report after a reference migration |

### Scenario Extensions (injected into host scenarios)

These never appear as user-selectable scenarios. They attach Telerik-specific
rules to the Microsoft `dotnet-*` scenarios the host already owns, reusing the
same lazy skills above rather than duplicating the migration mechanics.

| Skill | Extends | Purpose |
|-------|---------|---------|
| `telerik-for-dotnet-framework-upgrade` | `dotnet-framework-version-upgrade` | Verify Telerik still supports net481; offer, never force, the NuGet migration |
| `telerik-for-dotnet-version-upgrade` | `dotnet-version-upgrade` | Handle both modern→newer-modern and Framework→modern sources; NuGet is offered on the former, standard on the latter |

## Plugin Structure

```
telerik-winforms-upgrade-plugin/
├── plugin.json
├── upgrade-extension.json
├── README.md
└── upgrade/
    └── skills/
        ├── scenarios/
        │   ├── telerik-version-upgrade/
        │   │   ├── SKILL.md
        │   │   ├── assessment.md
        │   │   ├── planning.md
        │   │   ├── execution.md
        │   │   └── post-completion.md
        │   ├── telerik-control-conversion/
        │   │   ├── SKILL.md
        │   │   ├── assessment.md
        │   │   ├── planning.md
        │   │   ├── execution.md
        │   │   └── post-completion.md
        │   ├── telerik-assembly-to-nuget/
        │   │   ├── SKILL.md
        │   │   ├── assessment.md
        │   │   ├── planning.md
        │   │   ├── execution.md
        │   │   └── post-completion.md
        │   └── telerik-licensing/
        │       ├── SKILL.md
        │       ├── assessment.md
        │       ├── planning.md
        │       ├── execution.md
        │       └── post-completion.md
        ├── lazy/
        │   ├── telerik-winforms-assembly-mapping/
        │   │   ├── SKILL.md
        │   │   └── ref/
        │   │       └── assembly-reference-map.md
        │   ├── telerik-winforms-breaking-changes/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-component-guidance/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-conversion/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-dependency-management/
        │   │   ├── SKILL.md
        │   │   └── ref/
        │   │       └── version-compatibility.md
        │   ├── telerik-winforms-license-detection/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-license-diagnostics/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-license-key-setup/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-license-nuget-migration/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-license-plugin-hosts/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-license-verification/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-migration-verification/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-nuget-feed-setup/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-reference-detection/
        │   │   └── SKILL.md
        │   ├── telerik-winforms-reference-migration/
        │   │   └── SKILL.md
        │   └── telerik-winforms-reference-retargeting/
        │       └── SKILL.md
        └── extensions/
            ├── telerik-for-dotnet-framework-upgrade/
            │   ├── SKILL.md
            │   └── scopes/
            │       ├── assessment.md
            │       ├── planning.md
            │       └── execution.md
            └── telerik-for-dotnet-version-upgrade/
                ├── SKILL.md
                └── scopes/
                    ├── assessment.md
                    ├── planning.md
                    └── execution.md
```
