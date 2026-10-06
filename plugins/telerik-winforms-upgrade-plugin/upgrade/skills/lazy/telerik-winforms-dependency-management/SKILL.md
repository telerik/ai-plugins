---
name: telerik-winforms-dependency-management
description: >
  Manage Telerik UI for WinForms NuGet packages and assembly references.
  Resolves the package set to install or migrate to from the assembly
  reference map by default; recommends the unified AllControls package only
  for greenfield/telerik-control-conversion adoption, a broad or unreliable reference
  set, or explicit customer preference. Also covers packages.config cleanup,
  removing retired framework-specific packages, and checking version
  compatibility with the target .NET runtime.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Dependency Management

Guide for managing Telerik UI for WinForms packages and assembly references.

## Package Selection (Default: Map-Driven)

When a project has existing Telerik assembly references to migrate, load
`telerik-winforms-assembly-mapping` to resolve the package set from the
**assembly reference map** — the source of truth for which package a
referenced assembly belongs to. That skill:
- resolves the full owning-package set first, then de-duplicates before
  proposing it, since several assemblies can map to the same package;
- never hand-resolves transitive Telerik dependencies — leaves a proposed
  package's own dependencies to NuGet restore;
- reports any assembly with **no entry** in the map by name rather than
  guessing a package;
- keeps one Telerik version across every proposed package.

Do not re-implement that lookup here — this skill decides *when* to use the
mapped result versus `AllControls`, not *how* the mapping is computed.

## When AllControls Is Still the Right Call

Recommend `Telerik.UI.for.WinForms.AllControls` instead of the mapped set —
state plainly that it's a recommendation and why, never apply it silently —
when:
- **Greenfield / telerik-control-conversion adoption**: no existing Telerik reference
  to map from (e.g. the `telerik-control-conversion` scenario installing Telerik for
  the first time).
- **Broad existing usage**: the mapped set covers a large enough share of the
  suite that individual packages add management overhead with no real benefit.
- **Unreliable resolution**: the reference set can't be reliably resolved
  from the map (e.g. several unmapped assemblies).
- **Explicit customer preference**: the customer prefers one package for
  simplicity.

When proposing the mapped, granular set, do not editorialize about
`AllControls` unless the customer asks.

This skill reports and proposes; it does not decide policy or prompt the
user — consent gates and version-change decisions belong to the calling
scenario.

## Output Shape

When proposing a package set, surface:
- the referenced Telerik assemblies found
- the resolved package for each, with the shared version
- any assemblies that could not be mapped
- one line if `AllControls` is recommended instead, with the reason

## Facts About the Unified Package

`Telerik.UI.for.WinForms.AllControls` is multi-targeted (supports both .NET
Framework and modern .NET in one id) and brings `Telerik.Licensing` as a
transitive dependency — do not add an explicit `Telerik.Licensing` reference
when it's used, whether recommended per the criteria above or resolved to on
its own because the mapping happens to cover the whole suite.

**This is not unique to `AllControls`.** Every Telerik UI for WinForms
control package (`GridView`, `PivotGrid`, `Scheduler`, etc.) brings
`Telerik.Licensing` in transitively, the same as `AllControls` does — it is
a dependency of the whole product line, not a perk of the unified package.
When a project is adding or already has **any** Telerik control NuGet
package, never add `Telerik.Licensing` as its own explicit
`PackageReference` alongside it — that duplicates a dependency NuGet
already resolves. An explicit `Telerik.Licensing` reference is only
legitimate when the project has **no** Telerik control NuGet package at all
(controls remain on direct assembly references) — see
`telerik-winforms-license-key-setup`'s Step 1.

The following framework-specific packages are **retired** and should always
be replaced with the unified id, regardless of the selection policy above:
- `UI.for.WinForms.AllControls.Net462`
- `UI.for.WinForms.AllControls.Net48`
- `UI.for.WinForms.AllControls.Net80`
- `UI.for.WinForms.AllControls.Net90`

These were separate package **ids**, not a `Version` suffix. `Version` is
always the plain release version (e.g. `2026.3.812`); never append
`.Net462`/`.Net48`/`.Net80`/`.Net90` to `Version`.

## NuGet Package Source

Starting **Q3 2026**, Telerik UI for WinForms NuGet packages are available on
[NuGet.org](https://www.nuget.org/). No Telerik private NuGet feed configuration
is needed for projects using Q3 2026+ versions.

For older versions, the Telerik NuGet server (`https://nuget.telerik.com/v3/index.json`)
may still be required — see `telerik-winforms-nuget-feed-setup`.

## Installing Telerik via NuGet

For any package the mapping resolves to, edit the `.csproj` directly or use:
```
dotnet add package {packageId} --version {targetVersion}
```

## Assembly → NuGet Migration

When a project references Telerik via direct DLL assembly references
(detected by `<Reference>` with `<HintPath>` in the `.csproj`):

1. **Identify all Telerik assembly references** — look for `<Reference>` entries
   where `Include` contains `Telerik.WinControls`, `TelerikCommon`, or similar.
2. **Resolve the package set** — see *Package Selection* above.
3. **Remove each assembly reference** from the `.csproj`
4. **Remove the DLL files** from the project's `Bin`/`lib` folders (if tracked)
5. **Add the resolved package(s)** — see *Installing Telerik via NuGet*
6. **Remove assembly binding redirects** from `app.config` / `web.config` that
   reference Telerik assemblies
7. **Build and verify** all Telerik references resolve correctly

Licensing implications of the resulting package set (or of keeping direct
references) are covered by `telerik-winforms-license-key-setup` and
`telerik-winforms-license-nuget-migration` — do not duplicate that guidance
here.

## Version Compatibility

Consult the [version compatibility matrix](ref/version-compatibility.md) when
choosing a Telerik version. Key constraints:

| .NET Target | Minimum Telerik Version |
|-------------|------------------------|
| .NET 8 | 2024 Q2 (2024.2.x) |
| .NET 9 / .NET 10 | 2024 Q4 (2024.4.x) |
| .NET Framework 4.6.2+ | 2024 Q2 (2024.2.x) |
| .NET Framework 4.8+ | R3 2022 (2022.3.x) |

If the desired Telerik version does not support the project's .NET target,
suggest the nearest compatible version.
