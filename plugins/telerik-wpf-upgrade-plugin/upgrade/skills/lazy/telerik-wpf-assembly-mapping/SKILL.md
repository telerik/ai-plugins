---
name: telerik-wpf-assembly-mapping
description: >
  Map direct Telerik UI for WPF assembly references to the NuGet packages
  that own them, for the project's assembly flavor (Xaml or NoXaml) and target
  framework, using dependency-aware minimal package selection. Reports any
  assembly with no known mapping instead of guessing a package name.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Assembly-to-Package Mapping

Resolve the minimal set of Telerik NuGet packages that replace a project's
direct assembly references. The reference tables are generated from the
release packages (`scripts/generate-wpf-assembly-map.mjs`) — consult them,
this file only describes the process:

The maps identify assemblies and packages, not versions to install. Source
versions in their headers are provenance only; validate package availability,
framework support, and dependencies against the requested release's nuspecs.

| Flavor | Reference map |
|--------|---------------|
| Xaml | [ref/assembly-map-xaml.md](ref/assembly-map-xaml.md) |
| NoXaml | [ref/assembly-map-noxaml.md](ref/assembly-map-noxaml.md) |
| Both (flavor-neutral packages) | [ref/assembly-map-shared.md](ref/assembly-map-shared.md) |

## Inputs

- The Telerik assembly references found by `telerik-wpf-reference-detection`
- The project's **flavor** (Xaml or NoXaml) from `telerik-wpf-xaml-flavor` —
  if it is **mixed** or unknown, stop: that is a blocker the calling scenario
  must resolve with the user first
- The **resulting** target framework (unchanged for `telerik-wpf-assembly-to-nuget`;
  the new TFM inside a .NET version upgrade)
- The Telerik version (unchanged here; it is decided by the calling scenario)

Load only the map for the detected flavor plus the shared map. Never mix
packages from the two flavor maps in one project.

## Step 1: Look Up Each Assembly

For each Telerik assembly reference, look up its owning package in the
**Assembly Reference → NuGet Package** table of the flavor map, or of the
shared map for `Telerik.Windows.Documents.*` Document Processing,
`Telerik.Windows.Zip*`, `Telerik.Documents.*`, and `Telerik.Licensing.Runtime`
assemblies. Use the column for the resulting TFM: `net462` for any
.NET Framework 4.6.2+ project, `net8.0-windows7.0` for `net8.0-windows` and
later.

Notes that the table encodes:
- `Telerik.Windows.MediaFoundation.dll` ships inside the Media package — it
  has no package of its own.
- `Telerik.Documents.SpreadsheetStreaming.dll` ships in
  `Telerik.Windows.Documents.SpreadsheetStreaming` (the package id differs
  from the assembly name).
- `Telerik.Licensing.Runtime.dll` → `Telerik.Licensing`. Do not add it as a
  package when any Telerik control package is selected — it arrives
  transitively (see `telerik-wpf-dependency-management`).
- Theme assemblies (`Telerik.Windows.Themes.<Theme>.dll`) exist only in the
  NoXaml map and map one-to-one to `Telerik.Windows.Themes.<Theme>.for.Wpf`.

If an assembly has **no entry** for the flavor and TFM, report it explicitly
as unmapped. Do not guess a package name and do not silently fall back to
`AllControls`. Ask the user how to proceed — for example, confirm it's a
third-party or custom assembly, keep it as a direct reference, or accept a
documented replacement. A known unmapped assembly in the inspected artifacts is
`Telerik.Windows.Controls.Charting.dll` (Xaml distribution only, no NuGet
package). Verify this against the requested release rather than treating the
gap as permanent.

## Step 2: Apply Cross-TFM Replacements (.NET Framework → .NET Only)

When the project's TFM changes from .NET Framework to .NET in the same pass,
some assemblies have no .NET build (see *Assemblies Shipped for Only One
Target Framework* in the shared map). Resolve them before Step 3:

| .NET Framework assembly | On .NET (`net8.0-windows` and later) |
|-------------------------|--------------------------------------|
| `Telerik.Windows.Documents.dll`, `Telerik.Windows.Controls.RichTextBoxUI.dll`, `Telerik.Windows.Documents.FormatProviders.{Html,MsRichTextBoxXaml,OpenXml,Pdf,Rtf,Xaml}.dll` | Merged into `Telerik.Windows.Controls.RichTextBox.dll` → `Telerik.Windows.Controls.RichTextBox.for.Wpf[.Xaml]`. Namespaces are unchanged; only the assembly/package changes. |
| `Telerik.Windows.Controls.EntityFramework60.dll` | **No .NET equivalent package.** `Telerik.Windows.Controls.EntityFrameworkCore` targets EF Core, which is not a drop-in replacement for EF 6 — report as a blocker requiring a code migration decision by the user. |
| `Telerik.Windows.Documents.Proofing.Dictionaries.En-US.dll` | **No .NET package in the release.** Report it to the user; do not invent a replacement. |

Never apply these replacements when the TFM stays on .NET Framework.

## Step 3: Apply Dependency-Aware Minimal Selection

Using the **Nuspec Package Dependencies** table for the resulting TFM, drop
any package from the selection that is already a dependency (direct or
transitive) of another package already selected — NuGet installs it
automatically.

Examples (Xaml package names; NoXaml omits the `.Xaml` suffix):

| Requested assemblies | Package candidates | Minimal selection |
|----------------------|--------------------|-------------------|
| RadGridView: `Telerik.Windows.Controls`, `.Controls.Input`, `.Data`, `.Controls.GridView` | Controls, Input, Data, GridView | `Telerik.Windows.Controls.GridView.for.Wpf.Xaml` |
| RadGridView export: above + `.Controls.GridView.Export` + Document Processing DLLs | GridView, GridView.Export, Documents.* | `Telerik.Windows.Controls.GridView.Export.for.Wpf.Xaml` |
| RadDocking: `Telerik.Windows.Controls`, `.Controls.Navigation`, `.Data`, `.Controls.Docking` | Controls, Navigation, Data, Docking | `Telerik.Windows.Controls.Docking.for.Wpf.Xaml` |
| RadRichTextBox on .NET: `.Controls.RichTextBox` + Documents Core/Flow | RichTextBox, Documents.Core, Documents.Flow | `Telerik.Windows.Controls.RichTextBox.for.Wpf.Xaml` |
| NoXaml RadGridView + Fluent theme | GridView, Themes.Fluent | `Telerik.Windows.Controls.GridView.for.Wpf`, `Telerik.Windows.Themes.Fluent.for.Wpf` |

**Watch for every dependency edge, not just the shared core.** Dependencies
can differ per TFM (e.g. on `net8.0-windows7.0`, `Expressions` and the
`Proofing` packages depend on `RichTextBox`). Theme packages depend only on
`Telerik.Windows.Controls` — keep each theme package whose theme assembly is
referenced; nothing else pulls it in.

## Step 4: Resolve Versions

- **UI packages** (`*.for.Wpf`, `*.for.Wpf.Xaml`, `AllControls.*`): every
  one uses the **same** Telerik version — the one the calling scenario
  decided. A mismatch across UI packages is a defect to flag.
- **Flavor-neutral packages** (Document Processing, Zip, AI): add them
  explicitly only when a referenced assembly is not already covered by a
  selected UI package's dependencies. Their versions are independent of the
  UI version. Resolve compatible versions from the requested release's nuspec
  dependency groups and NuGet restore, preserving existing compatible versions
  during reference-only migrations. Do not reuse source-artifact versions
  from the maps or assume shared packages must match or differ from the UI
  version. If a version cannot be verified, report it as unresolved instead
  of guessing.
- Use package ids available for the requested release, flavor, and TFM.
  Never append a target-framework suffix to `Version`.

## Step 5: Output

Produce, per project:
- The flavor and resulting TFM used for the lookup
- The minimal package list (id + version)
- Any cross-TFM replacements applied
- Any unmapped assemblies and blockers, to surface in planning

Project file edits happen in `telerik-wpf-reference-migration` — this
skill only produces the mapping.

## Regenerating the Maps

For a new release, re-run:
```
node ./scripts/generate-wpf-assembly-map.mjs --dlls <Telerik_UI_for_WPF_<version>_Dlls> --nuget <folder with the extracted NuGet_Separate_Packages_Xaml/NoXaml zips> --report <coverage.md>
```
Review the coverage report for new gaps and update the replacement table in
Step 2 if needed.
