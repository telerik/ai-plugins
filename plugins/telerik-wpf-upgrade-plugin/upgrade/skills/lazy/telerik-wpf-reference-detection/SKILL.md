---
name: telerik-wpf-reference-detection
description: >
  Detect a WPF project's current Telerik UI for WPF version, reference style
  (direct assembly reference, NuGet PackageReference, or packages.config),
  and assembly flavor (Xaml or NoXaml). Read-only — produces the facts that
  other Telerik skills and scenarios plan from.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Reference Detection

Read-only detection of a project's Telerik reference style, version, and
flavor. Safe to call standalone, from the `telerik-wpf-assembly-to-nuget`
scenario, or from any other scenario that needs these facts (for example,
Telerik guidance inside a .NET Framework → .NET upgrade flow).

## Step 1: Classify Reference Style

For each `.csproj`/`.vbproj`, check for all of the following — a project can
have more than one:
- **Assembly reference**: `<Reference Include="...">` whose name starts with
  `Telerik.Windows.`, `Telerik.Pivot.`, `Telerik.Documents.`, or is
  `Telerik.Licensing.Runtime`, with a `<HintPath>`
- **NuGet reference**: `<PackageReference>` whose id ends with `.for.Wpf` or
  `.for.Wpf.Xaml`, is `Telerik.UI.for.Wpf.AllControls.Xaml` /
  `Telerik.UI.for.Wpf.AllControls.NoXaml`, is a
  `Telerik.Windows.Themes.*.for.Wpf` theme package, or is a flavor-neutral
  Telerik package (`Telerik.Windows.Documents.*`, `Telerik.Windows.Zip*`,
  `Telerik.Documents.*`, `Telerik.Licensing`)
- **packages.config**: a `<package id="Telerik..." .../>` entry, which
  implies assembly-style `<Reference>` elements pointing into the `packages`
  folder

Record every match found, not just the first — a project migrating in stages
can be mixed.

## Step 2: Determine Target Framework

Read `<TargetFramework>`/`<TargetFrameworks>` (or `<TargetFrameworkVersion>`
in classic projects). Classify as **.NET Framework** (`net4x` / `v4.x`) or
**modern .NET** (`net8.0-windows` and later; older `net5.0-windows` –
`net7.0-windows` and `netcoreapp3.1` too).

## Step 3: Determine Current Telerik Version

- **NuGet reference**: the `Version` attribute on the UI `PackageReference`
  (or the `<package version="...">` attribute in `packages.config`). Ignore
  the flavor-neutral Document Processing packages here — their version can
  differ from the UI version by design.
- **Assembly reference**: the version folder in the `HintPath`
  (e.g. `..\Telerik\2024.4.1111\Binaries.NoXaml\WPF462\Telerik.Windows.Controls.dll`
  → `2024.4.1111`), or the `Version=` in the reference's strong-name
  `Include` attribute, or the file version of the referenced
  `Telerik.Windows.Controls.dll`
- If none yields a version, report it as **unknown** — do not guess a
  version from unrelated signals such as file dates

## Step 4: Determine Flavor

Load `telerik-wpf-xaml-flavor` and record its per-project result (Xaml,
NoXaml, mixed, or unknown) plus any blockers or warnings it raised. Do not
re-implement its rules here.

## Step 5: Report Shape

Produce one record per project:
- `targetFramework`, `frameworkFamily` (.NET Framework / modern .NET)
- `referenceStyle` (assembly / NuGet / packages.config / mixed)
- `telerikVersion` (or "unknown")
- `flavor` (Xaml / NoXaml / mixed / unknown) and its issues
- `assemblyReferences` — the full list of Telerik `<Reference>` entries
  found, populated only when the style includes assembly references; this is
  the input `telerik-wpf-assembly-mapping` needs
- `localizationPackages` — any per-language `Telerik.Windows.Controls.for.Wpf.<lang>`
  packages (retired from Q2 2026)

## Notes

- This skill only reads files. Never edit a project file here — that is
  `telerik-wpf-reference-migration`'s job.
- Do not assume a modern-.NET project has no assembly references — check
  anyway; a project can be an unusual case.
