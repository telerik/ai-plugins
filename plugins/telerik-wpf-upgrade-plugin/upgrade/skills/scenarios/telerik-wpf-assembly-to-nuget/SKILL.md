---
name: telerik-wpf-assembly-to-nuget
description: >
  Migrate a WPF project's direct Telerik UI for WPF assembly references to
  the equivalent NuGet packages of the same Xaml/NoXaml flavor, keeping the
  Telerik version and .NET target unchanged. Detects the current version,
  reference style, and flavor, sets up the right NuGet feed, maps assemblies
  to packages, and verifies the result. Use only when no version or
  .NET-target change is also wanted.
requires-extension: telerik-wpf-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 8000
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
  scenarioTraitsSet: [.NET, WPF, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-wpf-version-upgrade
    suggest-actions:
      - generate-report
---

# Telerik WPF Assembly-to-NuGet Migration Scenario

Replace direct Telerik UI for WPF assembly references with the equivalent
NuGet `PackageReference` entries, without changing the Telerik version, the
project's .NET target, or the Xaml/NoXaml assembly flavor.

**Goal**: Same Telerik version, same .NET target, same flavor,
`PackageReference` instead of `<Reference>`/`HintPath`.

**Also triggered by**: "migrate Telerik assembly references to NuGet", "switch
my Telerik DLL references to packages", "stop using Telerik DLLs directly".

## Scope

- **Target**: .NET Framework WPF projects with direct Telerik assembly
  references — the common case for this reference style.
- **Modern .NET is already assumed to use packages.** If a project targets
  modern .NET (`net8.0-windows` and later, or an older `net5.0-windows` –
  `net7.0-windows` / `netcoreapp3.1` target) and has no direct Telerik
  assembly references, there is nothing to migrate for it — report that and
  stop instead of doing analysis work. If a modern-.NET project unexpectedly
  still has assembly references, migrate it the same as any other project.
- **Flavor is preserved.** The packages added always match the flavor the
  project already uses (`telerik-wpf-xaml-flavor`): `*.for.Wpf.Xaml` ids for
  Xaml, `*.for.Wpf` ids plus theme packages for NoXaml. Never switch the
  flavor and never offer to. A mixed flavor is a blocker resolved with the
  user before any migration task runs.
- **Not this scenario**:
  - Changing the Telerik version → `telerik-wpf-version-upgrade` (which also
    migrates assembly references as part of that flow)
  - Setting up or fixing license activation alone → `telerik-wpf-licensing`
  - Changing the .NET target → the host's `dotnet-version-upgrade` scenario

## Workflow Stages

This file only orchestrates. Each stage delegates the actual procedure to
lazy skills that are independently callable outside this scenario too.

0. **Pre-Initialization** — Identify in-scope projects, apply the early-exit
  check above, confirm parameters.
1. **Assessment** — Load [assessment.md](assessment.md).
2. **Planning** — Load [planning.md](planning.md).
3. **Execution** — Load [execution.md](execution.md).
4. **Post-Completion** — Load [post-completion.md](post-completion.md).

## Pre-Initialization

This workflow uses project-file edits and the .NET/NuGet CLI, not the
Telerik MCP tools. Do not run an MCP-server license prerequisite check or
block project discovery on a license file. For Q1 2025+ packages,
application activation is checked during migration builds as described in
[execution.md](execution.md).

### Tools to Call

- Call `get_solution_path()` to find the solution file.
- Scan `.csproj`/`.vbproj` files for WPF projects, then load
  `telerik-wpf-reference-detection` to classify each one's Telerik
  reference style and flavor.
- Apply the early-exit check from *Scope* per project. If every WPF project
  is already NuGet-based (or has no Telerik reference at all), stop here and
  report that there is nothing to migrate.
- Confirm the in-scope project list and Flow Mode (Automatic or Guided) with
  the user, plus source control parameters (git only).

## Success Criteria

- [ ] Every previously assembly-referenced Telerik project now uses
      `PackageReference` for the same feature set
- [ ] Every project keeps the Xaml/NoXaml flavor it had before the migration,
      and no project ends up with a mixed flavor
- [ ] For NoXaml projects, every referenced theme assembly was replaced by
      its theme package
- [ ] No `<Reference>` entries or `HintPath`s pointing at Telerik DLLs remain
- [ ] All Telerik UI packages added to a project share the same version;
      flavor-neutral Document Processing packages use their paired version
- [ ] The solution restores and builds successfully; any deferred
  missing-license warnings are explicitly reported
- [ ] Any assembly with no known package mapping was reported to the user,
      not guessed

## Notes

- This scenario does not change the Telerik version, the .NET target, or the
  flavor — see `telerik-wpf-version-upgrade` and the host's
  `dotnet-version-upgrade` scenario for the first two; the flavor never
  changes.
- Add the resolved packages via project-file edits or the .NET/NuGet CLI;
  follow `telerik-wpf-reference-migration` for the exact steps.
