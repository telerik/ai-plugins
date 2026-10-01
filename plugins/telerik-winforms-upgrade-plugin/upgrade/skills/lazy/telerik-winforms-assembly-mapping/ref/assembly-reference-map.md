# Telerik UI for WinForms NuGet Assembly Reference Map

Reference tables for `telerik-winforms-assembly-mapping`. Source: the Telerik
UI for WinForms NuGet package `lib/<target-framework>` payloads and nuspecs.
Designer-only DLLs under `lib/<target-framework>/Design` are excluded.

## Supported Target Frameworks

Every package is multi-targeted — one package id supports both .NET
Framework and modern .NET. For the exact target frameworks and which
Telerik version supports which, see the `telerik-winforms-dependency-management`
skill and its [version-compatibility.md](../../telerik-winforms-dependency-management/ref/version-compatibility.md)
reference — the set is release-dependent.

## Package Naming History

Starting with release `2026.3.812`, packages use the
`Telerik.UI.for.WinForms.*` naming convention used throughout this file.
**Before `2026.3.812`**, packages did not include `Telerik` in their names,
**except** `Telerik.UI.for.WinForms.AllControls`, which keeps the prefix at
every version. When resolving a package id for an older version, drop the
`Telerik.` prefix from every other package id in this file.

## Version Format

Every package in this file is a single **multi-targeted** NuGet package — one
package id supports both .NET Framework and modern .NET; NuGet selects the
matching assets automatically for the consuming project. See the
`telerik-winforms-dependency-management` skill and its version-compatibility
reference for the exact TFMs. The `Version` attribute is always the plain
Telerik release version, e.g.
`2026.3.812` or `2024.1.130` — **never** append a target-framework suffix
such as `.Net462`, `.Net48`, `.Net80`, or `.Net90`, `.462`, or `.90`.
`<PackageReference Include="Telerik.UI.for.WinForms.Common" Version="2026.3.812.Net462" />`
is invalid and will fail to resolve. The retired `UI.for.WinForms.AllControls.Net462`-style
names (see `telerik-winforms-dependency-management`) were separate **package
ids** from before packages were multi-targeted — that suffix pattern does not
carry over to `Version` on the current unified packages.

## Package → DLL Mapping

| NuGet package | DLLs in `lib` |
| --- | --- |
| `Telerik.UI.for.WinForms.Common` | `TelerikCommon.dll`, `Telerik.WinControls.dll`, `Telerik.WinControls.UI.dll`, `Telerik.WinControls.UI.Design.dll` |
| `Telerik.UI.for.WinForms.GridView` | `Telerik.WinControls.GridView.dll`, `TelerikData.dll` |
| `Telerik.UI.for.WinForms.Scheduler` | `Telerik.WinControls.Scheduler.dll` |
| `Telerik.UI.for.WinForms.Dock` | `Telerik.WinControls.RadDock.dll` |
| `Telerik.UI.for.WinForms.RichTextEditor` | `Telerik.WinControls.RichTextEditor.dll` |
| `Telerik.UI.for.WinForms.ChartView` | `Telerik.WinControls.ChartView.dll` |
| `Telerik.UI.for.WinForms.PivotGrid` | `Telerik.WinControls.PivotGrid.dll` |
| `Telerik.UI.for.WinForms.MarkupEditor` | `Telerik.WinControls.RadMarkupEditor.dll` |
| `Telerik.UI.for.WinForms.Themes` | Every `Telerik.WinControls.Themes.*.dll` (wildcard `*Themes*.dll`) |
| `Telerik.UI.for.WinForms.Export` | `TelerikExport.dll` |
| `Telerik.UI.for.WinForms.PdfViewer` | `Telerik.WinControls.PdfViewer.dll` |
| `Telerik.UI.for.WinForms.RadDiagram` | `Telerik.WinControls.RadDiagram.dll` |
| `Telerik.UI.for.WinForms.RadMap` | `Telerik.WinControls.RadMap.dll` |
| `Telerik.UI.for.WinForms.SpellChecker` | `Telerik.WinControls.SpellChecker.dll` |
| `Telerik.UI.for.WinForms.RadSpreadsheet` | `Telerik.WinControls.RadSpreadsheet.dll` |
| `Telerik.UI.for.WinForms.RadWebCam` | `Telerik.WinControls.RadWebCam.dll`, `MediaFoundation.dll`, `Telerik.Windows.MediaFoundation.dll` |
| `Telerik.UI.for.WinForms.SyntaxEditor` | `Telerik.WinControls.SyntaxEditor.dll` |
| `Telerik.UI.for.WinForms.RadControlSpy` | `RadControlSpy.dll` |
| `Telerik.UI.for.WinForms.RadToastNotification` | `Telerik.WinControls.RadToastNotification.dll`, `Telerik.WinControls.RadToastNotification.Design.dll` |
| `Telerik.UI.for.WinForms.AllControls` | No direct DLL payload — meta-package only |

## Nuspec Package Dependencies (Telerik → Telerik)

Only the Telerik-to-Telerik dependency edges are listed — other (non-Telerik)
nuspec dependencies resolve automatically through NuGet and don't affect
package selection.

| NuGet package | Depends on |
| --- | --- |
| `Telerik.UI.for.WinForms.Common` | None |
| `Telerik.UI.for.WinForms.GridView` | `Common` |
| `Telerik.UI.for.WinForms.Scheduler` | `Common`, `GridView` |
| `Telerik.UI.for.WinForms.Dock` | `Common` |
| `Telerik.UI.for.WinForms.RichTextEditor` | `Common` |
| `Telerik.UI.for.WinForms.ChartView` | `Common` |
| `Telerik.UI.for.WinForms.PivotGrid` | `Common`, `ChartView` |
| `Telerik.UI.for.WinForms.MarkupEditor` | `Common` |
| `Telerik.UI.for.WinForms.Themes` | `Common` |
| `Telerik.UI.for.WinForms.Export` | `GridView` |
| `Telerik.UI.for.WinForms.PdfViewer` | `Common` |
| `Telerik.UI.for.WinForms.RadDiagram` | `Common`, `Dock` |
| `Telerik.UI.for.WinForms.RadMap` | `Common` |
| `Telerik.UI.for.WinForms.SpellChecker` | `Common` |
| `Telerik.UI.for.WinForms.RadSpreadsheet` | `Common`, `GridView`, `ChartView` |
| `Telerik.UI.for.WinForms.RadWebCam` | `Common` |
| `Telerik.UI.for.WinForms.SyntaxEditor` | `Common` |
| `Telerik.UI.for.WinForms.RadControlSpy` | `Common` |
| `Telerik.UI.for.WinForms.RadToastNotification` | `Common`, `SyntaxEditor` |
| `Telerik.UI.for.WinForms.AllControls` | `Common`, `ChartView`, `Export`, `GridView`, `PdfViewer`, `PivotGrid`, `RadControlSpy`, `RadDiagram`, `Dock`, `RadMap`, `MarkupEditor`, `RadSpreadsheet`, `RadWebCam`, `RichTextEditor`, `Scheduler`, `SpellChecker`, `SyntaxEditor`, `Themes` |

Dependency names above omit the common `Telerik.UI.for.WinForms.` prefix
(e.g. `GridView` means `Telerik.UI.for.WinForms.GridView`).

## Dependency-Aware Package Selection

1. Map each explicitly referenced assembly to its owning package (previous
   table).
2. Add the packages that own the requested feature assemblies.
3. Do **not** add a package separately when it is already a dependency of a
   package already selected — NuGet installs it automatically.
4. Keep independent packages (e.g. `Themes`) only when their assemblies are
   explicitly referenced.

| Requested assemblies | Package candidates from ownership | Minimal selection |
| --- | --- | --- |
| RadGridView (common DLLs + `Telerik.WinControls.GridView.dll`) | `Common`, `GridView` | `Telerik.UI.for.WinForms.GridView` |
| Scheduler | `Common`, `GridView`, `Scheduler` | `Telerik.UI.for.WinForms.Scheduler` |
| RadDiagram | `Common`, `Dock`, `RadDiagram` | `Telerik.UI.for.WinForms.RadDiagram` |
| RadSpreadsheet | `Common`, `GridView`, `ChartView`, `RadSpreadsheet` | `Telerik.UI.for.WinForms.RadSpreadsheet` |
| Export | `GridView`, `Export` | `Telerik.UI.for.WinForms.Export` |
| PivotGrid | `Common`, `ChartView`, `PivotGrid` | `Telerik.UI.for.WinForms.PivotGrid` |
| RadToastNotification | `Common`, `SyntaxEditor`, `RadToastNotification` | `Telerik.UI.for.WinForms.RadToastNotification` |
| Only common Telerik UI assemblies | `Common` | `Telerik.UI.for.WinForms.Common` |

For multiple independent controls, combine only the top-level feature
packages — e.g. RadGridView + ChartView needs `GridView` and `ChartView`
only; `Common` is shared by both and should not be added explicitly.

**Watch for dependency edges, not just shared `Common`.** `PivotGrid`
already depends on `ChartView` — if both are in the requested-assembly set
and nothing besides `PivotGrid` needs `ChartView`, the minimal selection is
`PivotGrid` alone; adding `ChartView` alongside it is redundant, not
additive. Check every dependency edge in the table above before finalizing
a multi-package selection, not only the `Common` case.

## Assembly Reference → NuGet Package

- `TelerikCommon.dll`, `Telerik.WinControls.dll`, `Telerik.WinControls.UI.dll`, `Telerik.WinControls.UI.Design.dll` → `Telerik.UI.for.WinForms.Common`
- `Telerik.WinControls.GridView.dll`, `TelerikData.dll` → `Telerik.UI.for.WinForms.GridView`
- `Telerik.WinControls.Scheduler.dll` → `Telerik.UI.for.WinForms.Scheduler`
- `Telerik.WinControls.RadDock.dll` → `Telerik.UI.for.WinForms.Dock`
- `Telerik.WinControls.RichTextEditor.dll` → `Telerik.UI.for.WinForms.RichTextEditor`
- `Telerik.WinControls.ChartView.dll` → `Telerik.UI.for.WinForms.ChartView`
- `Telerik.WinControls.PivotGrid.dll` → `Telerik.UI.for.WinForms.PivotGrid`
- `Telerik.WinControls.RadMarkupEditor.dll` → `Telerik.UI.for.WinForms.MarkupEditor`
- Any `Telerik.WinControls.Themes.*.dll` (e.g. `Office2019`, `Fluent`, `Windows11`, `VisualStudio2022` — full set is release-dependent) → `Telerik.UI.for.WinForms.Themes`
- `TelerikExport.dll` → `Telerik.UI.for.WinForms.Export`
- `Telerik.WinControls.PdfViewer.dll` → `Telerik.UI.for.WinForms.PdfViewer`
- `Telerik.WinControls.RadDiagram.dll` → `Telerik.UI.for.WinForms.RadDiagram`
- `Telerik.WinControls.RadMap.dll` → `Telerik.UI.for.WinForms.RadMap`
- `Telerik.WinControls.SpellChecker.dll` → `Telerik.UI.for.WinForms.SpellChecker`
- `Telerik.WinControls.RadSpreadsheet.dll` → `Telerik.UI.for.WinForms.RadSpreadsheet`
- `Telerik.WinControls.RadWebCam.dll`, `MediaFoundation.dll`, `Telerik.Windows.MediaFoundation.dll` → `Telerik.UI.for.WinForms.RadWebCam`
- `Telerik.WinControls.SyntaxEditor.dll` → `Telerik.UI.for.WinForms.SyntaxEditor`
- `RadControlSpy.dll` → `Telerik.UI.for.WinForms.RadControlSpy`
- `Telerik.WinControls.RadToastNotification.dll`, `Telerik.WinControls.RadToastNotification.Design.dll` → `Telerik.UI.for.WinForms.RadToastNotification`

Any Telerik assembly not listed above has **no known mapping** — report it,
do not guess.

## Notes

- `AllControls` has no direct DLL payload; it is a meta-package that pulls in
  every feature package.
- Feature packages can depend on other Telerik packages — e.g. `Scheduler` →
  `GridView`, `RadDiagram` → `Dock`, `RadSpreadsheet` → `GridView` +
  `ChartView`.
- Document Processing assemblies (`Telerik.Windows.Documents.*`) are nuspec
  dependencies for `Export`, `PdfViewer`, `RichTextEditor`, and
  `RadSpreadsheet` — they are not direct DLL payload entries in these
  WinForms nuspecs, and NuGet resolves them automatically.
- `AllControls`'s current nuspec dependency groups omit
  `Telerik.UI.for.WinForms.RadToastNotification` and duplicate the
  `RadSpreadsheet` dependency for .NET 8 and .NET 9 — a known nuspec quirk;
  double-check the actual restored package set rather than assuming
  `AllControls` alone is complete.
