---
name: telerik-wpf-xaml-flavor
description: >
  Detect whether a WPF project uses the Telerik UI for WPF Xaml or NoXaml
  assemblies (direct references or NuGet packages), flag mixed or
  inconsistent usage, and check the theming setup that each flavor needs.
  Read-only — owns the rule that a migration always preserves the flavor.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Xaml / NoXaml Flavor

Telerik UI for WPF ships two assembly sets with the same code:

- **Xaml** — every control style and template for every theme is embedded in
  the assemblies. Themes are applied with `StyleManager`
  (`StyleManager.ApplicationTheme`, `telerik:StyleManager.Theme="..."`).
- **NoXaml** — no styles in the control assemblies. Themes come from a theme
  assembly (`Telerik.Windows.Themes.<Theme>.dll`) or XAML files copied from
  the `Themes.Implicit` folder, merged as implicit styles in `App.xaml`.

Mixing the two is not supported (it "works, but in some cases leads to visual
or design-time issues"). This skill is read-only: it reports facts and
violations, it never edits files.

## Rule: Preserve the Flavor

Every migration, retarget, and version upgrade keeps the flavor it found.
Never switch Xaml ↔ NoXaml, never offer to switch, and never pick packages of
the other flavor. Switching flavors is a theming re-architecture, not part of
any upgrade scenario.

## Step 1: Detect the Flavor per Project

Check every signal; record which ones matched.

**Direct assembly references** (`<Reference>` with `<HintPath>`):
- `HintPath` contains `\Binaries.NoXaml\` → **NoXaml**
- `HintPath` contains `\Binaries\` (not `.NoXaml`) → **Xaml**
- Any `Telerik.Windows.Themes.*` reference → **NoXaml** (theme assemblies
  ship only in the NoXaml distribution)
- No folder signal (e.g. DLLs copied to a `lib` folder): read the File
  Description of the referenced `Telerik.Windows.Controls.dll` — it ends with
  `(No XAML)` for NoXaml; otherwise Xaml. In PowerShell:
  `(Get-Item <path>\Telerik.Windows.Controls.dll).VersionInfo.FileDescription`

**NuGet packages** (`PackageReference` or `packages.config`):
- Id ends with `.for.Wpf.Xaml`, or is `Telerik.UI.for.Wpf.AllControls.Xaml` → **Xaml**
- Id ends with `.for.Wpf` (no `.Xaml`), is `Telerik.UI.for.Wpf.AllControls.NoXaml`,
  or is a `Telerik.Windows.Themes.*.for.Wpf` theme package → **NoXaml**
- `Telerik.Windows.Documents.*` (without `.for.Wpf`), `Telerik.Windows.Zip*`,
  `Telerik.Documents.*`, `Telerik.Licensing` → **neutral**, ignore for flavor

If no signal matches, report the flavor as **unknown** — do not guess.

## Step 2: Detect Mixed or Inconsistent Usage

- **Mixed flavor (blocker)**: Xaml and NoXaml signals in the same project, or
  in different projects that ship in the same application (a WPF app and the
  class libraries it references load into one process). Report every
  conflicting reference. The calling scenario must stop and ask the user which
  flavor to converge on before any migration task runs; do not choose one.
- **Inconsistent theming (warning)**: report, do not fix:
  - Xaml flavor with `Telerik.Windows.Themes.*` resource dictionaries merged
    (StyleManager and implicit styles mixed)
  - NoXaml flavor with `StyleManager.ApplicationTheme` set or
    `StyleManager.Theme` attributes (StyleManager must not be used with
    implicit styles)

## Step 3: Record the Theming Setup (NoXaml)

For NoXaml projects, record:
- **Theme assemblies or packages** referenced
  (`Telerik.Windows.Themes.<Theme>.dll` / `Telerik.Windows.Themes.<Theme>.for.Wpf`)
- **Merged dictionaries** in `App.xaml` (and any view-level `Resources`) and
  their source:
  - from a theme assembly:
    `/Telerik.Windows.Themes.<Theme>;component/Themes/<Assembly>.xaml`
  - copied files: `/Themes/<Assembly>.xaml` style URIs pointing to XAML files
    inside the project (copied from the `Themes.Implicit` folder of a
    Telerik installation, Build Action `Page`)
- **Custom styles** that target Telerik controls — they must use
  `BasedOn="{StaticResource <Control>Style}"`; report ones that don't

For Xaml projects, record the `StyleManager` theme usage only.

## Step 4: Theming Checks After a Change

Run after any reference migration, retarget, or version change on a NoXaml
project (`telerik-wpf-migration-verification` invokes this):

1. Every referenced theme assembly has its theme package (NuGet) or its
   retargeted DLL (assembly references).
2. Every merged `/<ThemeAssembly>;component/Themes/<Assembly>.xaml`
   dictionary has the matching control assembly referenced or restored — a
   dictionary merged for a missing assembly is a runtime error.
3. **Copied theme XAML** (from `Themes.Implicit`) is version-specific and is
   not updated by NuGet or by retargeting:
   - after a Telerik **version change**, it must be refreshed from the new
     version's `Themes.Implicit` folder;
   - after a move from **.NET Framework to .NET**, it must be taken from the
     `Themes.Implicit\NET` folder instead of `Themes.Implicit\NET Framework`.
   Ask the user for the folder of the new XAML files — never guess a path and
   never hand-edit the theme XAML. If the user defers, report it as an open
   item with its risk (missing or stale styles at run time).
4. On .NET Framework → .NET, merged dictionaries that referenced the
   assemblies merged into `Telerik.Windows.Controls.RichTextBox`
   (`Telerik.Windows.Documents`, `Telerik.Windows.Controls.RichTextBoxUI`)
   must be checked against the dictionaries present in the theme assembly or
   `Themes.Implicit\NET` folder of the target version — report any that no
   longer exist; do not invent new dictionary names.

Xaml projects need no theming change during these operations.

## Output Shape

Per project:
- `flavor`: Xaml / NoXaml / mixed / unknown, with the matched signals
- `themingMechanism`: StyleManager / implicit styles (theme assembly) /
  implicit styles (copied XAML) / none found
- `themes`: theme names in use
- `issues`: mixed-flavor blockers and inconsistent-theming warnings
- after a change: the result of each Step 4 check
