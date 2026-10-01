---
name: telerik-assembly-to-nuget
description: >
  Migrate a WinForms project's direct Telerik UI for WinForms assembly
  references to the equivalent NuGet packages, keeping the Telerik version and
  .NET target unchanged. Detects the current version and reference style,
  sets up the right NuGet feed, maps assemblies to packages, and verifies the
  result. Use only when no version or .NET-target change is also wanted.
requires-extension: telerik-winforms-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 8000
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  scenarioTraitsSet: [.NET, WinForms, WindowsForms, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-version-upgrade
      - telerik-control-conversion
    suggest-actions:
      - generate-report
---

# Telerik WinForms Assembly-to-NuGet Migration Scenario

Replace direct Telerik UI for WinForms assembly references with the
equivalent NuGet `PackageReference` entries, without changing the Telerik
version or the project's .NET target.

**Goal**: Same Telerik version, same .NET target, `PackageReference` instead
of `<Reference>`/`HintPath`.

**Also triggered by**: "migrate Telerik assembly references to NuGet", "switch
my Telerik DLL references to packages", "stop using Telerik DLLs directly".

## Scope

- **Target**: .NET Framework WinForms projects with direct Telerik assembly
  references — the common case for this reference style.
- **Modern .NET is already assumed to use packages.** If a project targets
  modern .NET (net6.0+) and has no direct Telerik assembly references, there
  is nothing to migrate for it — report that and stop instead of doing
  analysis work. If a modern-.NET project unexpectedly still has assembly
  references, migrate it the same as any other project.
- **Not this scenario**:
  - Changing the Telerik version → `telerik-version-upgrade` (which also migrates
    assembly references as part of that flow)
  - Adopting Telerik for the first time → `telerik-control-conversion`
  - Setting up or fixing license activation alone → `telerik-licensing`
  - Changing the .NET target → the host's `dotnet-version-upgrade` scenario

## Workflow Stages

This file only orchestrates. Each stage delegates the actual procedure to
lazy skills that are independently callable outside this scenario too.

0. **Pre-Initialization** — Verify the Telerik license, identify in-scope
   projects, apply the early-exit check above, confirm parameters.
1. **Assessment** — Load [assessment.md](assessment.md).
2. **Planning** — Load [planning.md](planning.md).
3. **Execution** — Load [execution.md](execution.md).
4. **Post-Completion** — Load [post-completion.md](post-completion.md).

## Pre-Initialization

### Step 0: Check the Telerik License (non-blocking)

Unlike the plugin's other scenarios, this migration works through direct
project-file edits and the .NET/NuGet CLI — the reference detection, feed
setup, package mapping, project editing, and restore/build steps described in
this scenario's lazy skills need no `telerik_*` MCP tool call. A missing
Telerik license does **not** block this scenario.

Still load `telerik-winforms-license-detection` and run its **Step 0** (MCP
server prerequisite check) — do not re-implement the path/existence check
here; it resolves the environment variable correctly per shell and avoids
the false negatives a naive literal `%AppData%` check produces in
PowerShell.

Check existence only — never read, print, or echo the key. If it's missing,
tell the user once that no Telerik license was found — `telerik_add_package_reference`
and every other Telerik MCP tool stay unavailable until one is activated
(offer `telerik-winforms-license-key-setup` if they want it set up now) —
then continue with the migration regardless.

### Tools to Call

- Call `get_solution_path()` to find the solution file.
- Scan `.csproj`/`.vbproj` files for WinForms projects, then load
  `telerik-winforms-reference-detection` to classify each one's Telerik
  reference style.
- Apply the early-exit check from *Scope* per project. If every WinForms
  project is already NuGet-based (or has no Telerik reference at all), stop
  here and report that there is nothing to migrate.
- Confirm the in-scope project list and Flow Mode (Automatic or Guided) with
  the user, plus source control parameters (git only).

## Success Criteria

- [ ] Every previously assembly-referenced Telerik project now uses
      `PackageReference` for the same feature set
- [ ] No `<Reference>` entries or `HintPath`s pointing at Telerik DLLs remain
- [ ] All Telerik packages added to a project share the same version
- [ ] The solution restores and builds cleanly
- [ ] Any assembly with no known package mapping was reported to the user,
      not guessed

## Notes

- This scenario does not change the Telerik version or the .NET target — see
  `telerik-version-upgrade` and the host's `dotnet-version-upgrade` scenario for
  those.
- Tool names are the bare names exposed by the `telerik-winforms-upgrade-plugin`
  MCP; every host resolves them. `telerik_add_package_reference` only
  documents install instructions for `Telerik.UI.for.WinForms.AllControls` —
  see `telerik-winforms-reference-migration` for how the other packages this
  scenario needs are added.
