---
name: telerik-wpf-dependency-management
description: >
  Manage Telerik UI for WPF NuGet packages and assembly references.
  Resolves the package set to install or migrate to from the assembly
  reference map by default; recommends the flavor-matching AllControls
  meta-package only for a broad or unreliable reference set, or explicit
  customer preference. Also covers packages.config cleanup, removing retired
  per-language localization packages, and checking version compatibility with
  the target .NET runtime.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Dependency Management

Guide for managing Telerik UI for WPF packages and assembly references.

## Package Selection (Default: Map-Driven)

When a project has existing Telerik assembly references to migrate, load
`telerik-wpf-assembly-mapping` to resolve the package set from the
**assembly reference maps** — the source of truth for which package a
referenced assembly belongs to. That skill:
- uses the map that matches the project's assembly flavor (Xaml or NoXaml,
  from `telerik-wpf-xaml-flavor`) and the resulting target framework;
- resolves the full owning-package set first, then de-duplicates before
  proposing it, since several assemblies can map to the same package;
- never hand-resolves transitive Telerik dependencies — leaves a proposed
  package's own dependencies to NuGet restore;
- reports any assembly with **no entry** in the map by name rather than
  guessing a package;
- keeps one UI version across every proposed UI package (flavor-neutral
  Document Processing packages follow their own paired version).

Do not re-implement that lookup here — this skill decides *when* to use the
mapped result versus `AllControls`, not *how* the mapping is computed.

## When AllControls Is Still the Right Call

Recommend the flavor-matching meta-package —
`Telerik.UI.for.Wpf.AllControls.Xaml` or
`Telerik.UI.for.Wpf.AllControls.NoXaml`, never the other flavor — instead of
the mapped set — state plainly that it's a recommendation and why, never
apply it silently — when:
- **Broad existing usage**: the mapped set covers a large enough share of the
  suite that individual packages add management overhead with no real benefit.
- **Unreliable resolution**: the reference set can't be reliably resolved
  from the map (e.g. several unmapped assemblies).
- **Explicit customer preference**: the customer prefers one package for
  simplicity.

`AllControls.NoXaml` references **every** theme package; `AllControls` does
not reference every feature package (check its membership list in the
assembly map — e.g. `Chart.Direct2D` is not included in `2026.3.1007`). If a
project needs a package that `AllControls` does not reference, add that
package explicitly alongside it.

When proposing the mapped, granular set, do not editorialize about
`AllControls` unless the customer asks.

This skill reports and proposes; it does not decide policy or prompt the
user — consent gates and version-change decisions belong to the calling
scenario.

## Output Shape

When proposing a package set, surface:
- the referenced Telerik assemblies found and the detected flavor
- the resolved package for each, with its version
- any assemblies that could not be mapped
- one line if `AllControls` is recommended instead, with the reason

## Facts About Telerik.Licensing

Every Telerik UI for WPF package — feature packages, theme packages,
`AllControls`, and the Document Processing packages — brings
`Telerik.Licensing` in transitively (`[1.9.3, 2.0.0)` for `2026.3.1007`).
When a project is adding or already has **any** Telerik control NuGet
package, never add `Telerik.Licensing` as its own explicit
`PackageReference` alongside it — that duplicates a dependency NuGet
already resolves. An explicit `Telerik.Licensing` reference is only
legitimate when the project has **no** Telerik control NuGet package at all
(controls remain on direct assembly references), or in the application
project that consumes a class library which references Telerik — see
`telerik-wpf-license-key-setup`.

## Retired Packages

Before **Q2 2026**, localization satellite assemblies shipped as separate
per-language packages (`Telerik.Windows.Controls.for.Wpf.de`,
`Telerik.Windows.Controls.for.Wpf.fr`, `Telerik.Windows.Controls.for.Wpf.es`,
etc.). Starting with Q2 2026 they are bundled in
`Telerik.Windows.Controls.for.Wpf[.Xaml]`. When the target version is Q2 2026
or later, remove those per-language packages.

`Version` is always the plain release version (e.g. `2026.3.1007`); never
append a target-framework suffix to it.

## NuGet Package Source

Starting with `2026.3.812` (**Q3 2026**), Telerik UI for WPF NuGet packages
are available on [NuGet.org](https://www.nuget.org/). No Telerik private
NuGet feed configuration is needed for projects using those versions.

For older versions, the Telerik NuGet server (`https://nuget.telerik.com/v3/index.json`)
is required — see `telerik-wpf-nuget-feed-setup`.

## Installing Telerik via NuGet

For any package the mapping resolves to, edit the `.csproj` directly or use:
```
dotnet add package {packageId} --version {targetVersion}
```

## Assembly → NuGet Migration

When a project references Telerik via direct DLL assembly references
(detected by `<Reference>` with `<HintPath>` in the `.csproj`):

1. **Identify all Telerik assembly references** — look for `<Reference>` entries
   where `Include` starts with `Telerik.Windows.`, `Telerik.Pivot.`,
   `Telerik.Documents.`, or `Telerik.Licensing.Runtime`.
2. **Determine the flavor** with `telerik-wpf-xaml-flavor` — the packages
   must match it.
3. **Resolve the package set** — see *Package Selection* above.
4. **Remove each assembly reference** from the `.csproj`
5. **Remove the DLL files** from the project's `Bin`/`lib` folders (if tracked)
6. **Add the resolved package(s)** — see *Installing Telerik via NuGet*
7. **Remove assembly binding redirects** from `app.config` that reference
   Telerik assemblies
8. **Build and verify** all Telerik references resolve correctly

Licensing implications of the resulting package set (or of keeping direct
references) are covered by `telerik-wpf-license-key-setup` and
`telerik-wpf-license-nuget-migration` — do not duplicate that guidance
here.

## Version Compatibility

Consult the [version compatibility matrix](ref/version-compatibility.md) when
choosing a Telerik version. Key constraints:

| .NET Target | Minimum Telerik Version (supported distribution) |
|-------------|--------------------------------------------------|
| .NET 8 / .NET 9 / .NET 10 (`-windows`) | 2024 Q4 (2024.4.x) — .NET 8 distribution |
| .NET Framework 4.6.2 – 4.8.1 | 2024 Q2 (2024.2.x) — .NET Framework 4.6.2 distribution; older releases ship .NET Framework 4.0/4.5 DLLs that also run here |

If the desired Telerik version does not support the project's .NET target,
suggest the nearest compatible version.

On a move from .NET Framework to .NET, some assemblies have no .NET build —
`telerik-wpf-assembly-mapping` lists their replacements and blockers.
