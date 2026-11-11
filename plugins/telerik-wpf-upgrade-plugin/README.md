# Telerik WPF Upgrade Plugin

Copilot CLI plugin that integrates with the Microsoft Upgrade Agent to modernize
WPF applications that use Telerik UI for WPF.

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
  [DevCraft or Telerik UI for WPF license](https://www.telerik.com/purchase/individual/wpf.aspx)
  (or a [free trial](https://www.telerik.com/try/ui-for-wpf))
- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download) or later — required
  for `dnx`, which runs the [Telerik.WPF.MCP](https://www.nuget.org/packages/Telerik.WPF.MCP)
  tool server (the target application can be on any supported .NET version,
  including .NET Framework)

## Installation

Add the `telerik/ai-plugins` marketplace, then install the plugin.

**GitHub Copilot CLI**
```bash
copilot plugin marketplace add telerik/ai-plugins
copilot plugin install telerik-wpf-upgrade-plugin@telerik-ai-plugins
```

## What It Does

This plugin registers three modernization scenarios. The agent picks the one
that matches the user's intent:

| Scenario | When | What happens |
|----------|------|--------------|
| **telerik-wpf-version-upgrade** | The project already uses Telerik and the user wants a newer Telerik version | Upgrades the Telerik package version, migrates assembly refs to NuGet, sets up licensing, and fixes breaking changes |
| **telerik-wpf-assembly-to-nuget** | The user only wants direct Telerik assembly references replaced with NuGet packages, with no version or .NET target change | Detects the current Telerik version, reference style, and Xaml/NoXaml flavor, sets up the right NuGet feed, maps assemblies to packages, and migrates the project |
| **telerik-wpf-licensing** | The user wants Telerik license activation set up, fixed, or migrated | Detects the licensing mechanism, repairs activation, and verifies builds |

`telerik-wpf-assembly-to-nuget` is a standalone, narrower scenario for when
only the reference style needs to change.

### .NET version upgrades

Neither scenario changes the project's `<TargetFramework>`. When the user also
wants a different .NET version (.NET Framework → .NET, or .NET 8 → .NET 10), run
the Microsoft `dotnet-version-upgrade` scenario **first** — the resulting .NET
target determines which Telerik versions are available — then run
`telerik-wpf-version-upgrade`. The scenario extensions below attach the
Telerik rules to the Microsoft scenarios themselves.

### Additive concerns

Both scenarios detect and handle:
- **Assembly → NuGet migration** — replaces direct DLL references with the
  minimal set of Telerik UI for WPF NuGet packages of the project's flavor,
  resolved from the assembly reference maps
- **License activation** — for Q1 2025+ projects, Telerik control NuGet packages
  bring `Telerik.Licensing` transitively so the shared license file activates the application

### Xaml vs NoXaml

Telerik UI for WPF ships two assembly sets: **Xaml** (styles embedded in the
control assemblies, themes applied with `StyleManager`) and **NoXaml** (no
styles in the control assemblies, themes applied as implicit styles).

- The flavor is detected per project and **always preserved** — no scenario
  switches Xaml ↔ NoXaml or adds packages of the other flavor.
- A **mixed** flavor (Xaml and NoXaml in one project or one application) is a
  blocker: the agent reports the conflicting references and asks which flavor
  to converge on before migrating anything.
- NoXaml projects need their theme packages
  (`Telerik.Windows.Themes.<Theme>.for.Wpf`) alongside the control packages.
- Theme XAML copied from the `Themes.Implicit` folder is version-specific and
  is not updated by NuGet or retargeting — it must be refreshed from the new
  version's folder (and from the `NET` folder after a .NET Framework → .NET
  move). The agent asks for the folder and never hand-edits theme XAML.

### Licensing

The Telerik license key is shared between the MCP server and NuGet-based
application activation. `telerik-wpf-version-upgrade` blocks on it because its
MCP tool calls need it; `telerik-wpf-assembly-to-nuget` checks for it but
continues without blocking, since its work doesn't call MCP tools. For
Q1 2025+ projects that use Telerik NuGet packages, `Telerik.Licensing` is a
transitive dependency, so the same key activates the application build
without an explicit package reference. A .NET Framework project that retains
direct Telerik assembly references must install `Telerik.Licensing`
explicitly.

Save the shared license file to `%AppData%\Telerik\telerik-license.txt`, or as
`telerik-license.txt` in the project or solution root, before running a
scenario.

## MCP Server

The plugin uses the [Telerik.WPF.MCP](https://www.nuget.org/packages/Telerik.WPF.MCP)
NuGet package, which exposes:

| Tool | What it does |
|------|--------------|
| `telerik-upgrade-assistant` | Breaking-change detection between Telerik versions (via Telerik CLI) |
| `telerik-wpf-assistant` | Component API guidance |

These run server-side against your project. Path arguments are elicited from
you if the agent passes one that can't be resolved.

`telerik-upgrade-assistant` additionally requires the Telerik CLI:

```bash
dotnet tool install --global Telerik.CLI
```
## Skills

### Scenarios

| Skill | Purpose |
|-------|---------|
| `telerik-wpf-version-upgrade` | Upgrade the Telerik UI for WPF version with breaking-changes detection |
| `telerik-wpf-assembly-to-nuget` | Migrate direct Telerik assembly references to NuGet packages, with no version or .NET target change |
| `telerik-wpf-licensing` | Set up, fix, or migrate Telerik license activation |

### Lazy (loaded on demand)

| Skill | Purpose |
|-------|---------|
| `telerik-wpf-breaking-changes` | Detect and fix breaking changes via `telerik-upgrade-assistant` |
| `telerik-wpf-dependency-management` | NuGet package management and assembly→NuGet migration |
| `telerik-wpf-license-detection` | Read-only detection of the current Telerik licensing mechanism, artifacts, and entry-point shape |
| `telerik-wpf-license-key-setup` | Obtain and place a license key for the recommended NuGet-based path, or the script-key path |
| `telerik-wpf-license-plugin-hosts` | Set up or fix licensing for add-in/plugin (hybrid) hosts with no standard entry point |
| `telerik-wpf-license-nuget-migration` | Move a project from script-key licensing to the NuGet-based `Telerik.Licensing` model |
| `telerik-wpf-license-diagnostics` | Map licensing symptoms and `TKL*` codes to causes and fixes |
| `telerik-wpf-license-verification` | Build and confirm a licensing setup actually activates |
| `telerik-wpf-component-guidance` | Component API help via `telerik-wpf-assistant` |
| `telerik-wpf-reference-detection` | Detect a project's current Telerik version, reference style (assembly / NuGet / packages.config), and flavor |
| `telerik-wpf-xaml-flavor` | Detect the Xaml/NoXaml flavor, flag mixed usage, and check the theming setup after a change |
| `telerik-wpf-nuget-feed-setup` | Determine, validate, and set up the NuGet feed needed for a given Telerik version |
| `telerik-wpf-assembly-mapping` | Map Telerik assembly references to their owning NuGet packages for the project's flavor and target framework |
| `telerik-wpf-reference-migration` | Edit a project file to replace assembly references with PackageReference |
| `telerik-wpf-reference-retargeting` | Retarget direct assembly references to a new Telerik version without changing the delivery method or flavor |
| `telerik-wpf-migration-verification` | Restore, build, run the NoXaml theming checks, and report after a reference migration |

### Scenario Extensions (injected into host scenarios)

These never appear as user-selectable scenarios. They attach Telerik-specific
rules to the Microsoft `dotnet-*` scenarios the host already owns, reusing the
same lazy skills above rather than duplicating the migration mechanics.

| Skill | Extends | Purpose |
|-------|---------|---------|
| `telerik-wpf-for-dotnet-framework-upgrade` | `dotnet-framework-version-upgrade` | Verify Telerik still supports net481; offer, never force, the NuGet migration; preserve the flavor |
| `telerik-wpf-for-dotnet-version-upgrade` | `dotnet-version-upgrade` | Handle both modern→newer-modern and Framework→modern sources; NuGet migration is mandatory on both whenever assembly references are found |

## Plugin Structure

```
telerik-wpf-upgrade-plugin/
├── .claude-plugin/
│   └── plugin.json
├── upgrade-extension.json
├── README.md
└── upgrade/
    └── skills/
        ├── scenarios/
        │   ├── telerik-wpf-version-upgrade/
        │   │   ├── SKILL.md
        │   │   ├── assessment.md
        │   │   ├── planning.md
        │   │   ├── execution.md
        │   │   └── post-completion.md
        │   ├── telerik-wpf-assembly-to-nuget/
        │   │   ├── SKILL.md
        │   │   ├── assessment.md
        │   │   ├── planning.md
        │   │   ├── execution.md
        │   │   └── post-completion.md
        │   └── telerik-wpf-licensing/
        │       ├── SKILL.md
        │       ├── assessment.md
        │       ├── planning.md
        │       ├── execution.md
        │       └── post-completion.md
        ├── lazy/
        │   ├── telerik-wpf-assembly-mapping/
        │   │   ├── SKILL.md
        │   │   └── ref/
        │   │       ├── assembly-map-noxaml.md
        │   │       ├── assembly-map-shared.md
        │   │       └── assembly-map-xaml.md
        │   ├── telerik-wpf-breaking-changes/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-component-guidance/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-dependency-management/
        │   │   ├── SKILL.md
        │   │   └── ref/
        │   │       └── version-compatibility.md
        │   ├── telerik-wpf-license-detection/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-license-diagnostics/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-license-key-setup/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-license-nuget-migration/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-license-plugin-hosts/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-license-verification/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-migration-verification/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-nuget-feed-setup/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-reference-detection/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-reference-migration/
        │   │   └── SKILL.md
        │   ├── telerik-wpf-reference-retargeting/
        │   │   └── SKILL.md
        │   └── telerik-wpf-xaml-flavor/
        │       └── SKILL.md
        └── extensions/
            ├── telerik-wpf-for-dotnet-framework-upgrade/
            │   ├── SKILL.md
            │   └── scopes/
            │       ├── assessment.md
            │       ├── planning.md
            │       └── execution.md
            └── telerik-wpf-for-dotnet-version-upgrade/
                ├── SKILL.md
                └── scopes/
                    ├── assessment.md
                    ├── planning.md
                    └── execution.md
```
