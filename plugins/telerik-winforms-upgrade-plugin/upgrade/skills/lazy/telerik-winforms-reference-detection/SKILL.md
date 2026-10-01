---
name: telerik-winforms-reference-detection
description: >
  Detect a WinForms project's current Telerik UI for WinForms version and
  reference style (direct assembly reference, NuGet PackageReference, or
  packages.config). Read-only — produces the facts that other Telerik skills
  and scenarios plan from.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Reference Detection

Read-only detection of a project's Telerik reference style and version. Safe
to call standalone, from the `telerik-assembly-to-nuget` scenario, or from any other
scenario that needs these facts (for example, Telerik guidance inside a
.NET Framework → .NET upgrade flow).

## Step 1: Classify Reference Style

For each `.csproj`/`.vbproj`, check for all of the following — a project can
have more than one:
- **Assembly reference**: `<Reference Include="Telerik...">` (or
  `TelerikCommon`, or any `Telerik.` prefixed assembly) with a `<HintPath>`
- **NuGet reference**: `<PackageReference Include="Telerik.UI.for.WinForms...">`
  or a legacy non-prefixed `UI.for.WinForms.*` package id (see the package
  naming history note in `telerik-winforms-assembly-mapping`)
- **packages.config**: a `<package id="Telerik..." .../>` or
  `<package id="UI.for.WinForms..." .../>` entry, which implies assembly-style
  references even without explicit `<Reference>` elements in some legacy
  projects

Record every match found, not just the first — a project migrating in stages
can be mixed.

## Step 2: Determine Target Framework

Read `<TargetFramework>`/`<TargetFrameworks>`. Classify as **.NET Framework**
(`net4x`) or **modern .NET** (`net6.0` and later, including `-windows`
suffixed TFMs).

## Step 3: Determine Current Telerik Version

- **NuGet reference**: the `Version` attribute on the `PackageReference` (or
  the `<package version="...">` attribute in `packages.config`)
- **Assembly reference**: the version folder in the `HintPath`
  (e.g. `..\Bin\2024.1.130\Telerik.WinControls.dll` → `2024.1.130`)
- If neither yields a version, report it as **unknown** — do not guess a
  version from unrelated signals such as file dates

## Step 4: Report Shape

Produce one record per project:
- `targetFramework`, `frameworkFamily` (.NET Framework / modern .NET)
- `referenceStyle` (assembly / NuGet / packages.config / mixed)
- `telerikVersion` (or "unknown")
- `assemblyReferences` — the full list of Telerik `<Reference>` entries
  found, populated only when the style includes assembly references; this is
  the input `telerik-winforms-assembly-mapping` needs

## Notes

- This skill only reads files. Never edit a project file here — that is
  `telerik-winforms-reference-migration`'s job.
- Do not assume a modern-.NET project has no assembly references — check
  anyway; a project can be an unusual case.
