# Assessment Stage — Telerik WPF Version Upgrade

Analyze the WPF solution to establish the current Telerik state, validate
the target version, and detect additive concerns. Write findings to
`assessment.md` in the workflow folder.

## Step 1: Detect Delivery Method, Version, and Flavor (First, Before Anything Else)

This is the first fact-finding step — target-version resolution, breaking
changes preview, and planning all depend on it. Do not assume the delivery
method, the current version, or the flavor.

Load `telerik-wpf-reference-detection` and run it for each in-scope
project. Record, per project:

1. **Target framework**: read `<TargetFramework>` / `<TargetFrameworks>`
   (or `<TargetFrameworkVersion>` in classic projects). Classify as
   `.NET Framework` (net4x) or modern `.NET` (`net8.0-windows` and later, or
   an older `net5.0-windows` – `net7.0-windows` / `netcoreapp3.1` target).
2. **WPF marker**: confirm `<UseWPF>true</UseWPF>` or, in classic projects,
   the WPF project type GUID or `PresentationFramework` references.
3. **Delivery method** (the detection skill's `referenceStyle`): NuGet
   (`PackageReference`), direct assembly reference (`<Reference>` with
   `<HintPath>`), `packages.config`, or mixed.
4. **Telerik version** (the detection skill's `telerikVersion`, or
   "unknown"): extracted from the `Version` attribute of the UI
   `PackageReference`, or from the assembly `<HintPath>` version folder
   (e.g. `..\Telerik\2024.4.1111\Binaries.NoXaml\WPF462\`). Flavor-neutral
   Document Processing package versions are not the UI version.
5. **Flavor** (the detection skill's `flavor`, from `telerik-wpf-xaml-flavor`):
   Xaml, NoXaml, mixed, or unknown, with the matched signals. For NoXaml,
   also record the theming mechanism (theme assemblies/packages or copied
   `Themes.Implicit` XAML) and the themes in use.
6. **Existing EvidenceAttribute**: detect whether the project already
   contains `Telerik.Licensing.EvidenceAttribute`. Record it as an existing
   customer choice; do not create, modify, or recommend it — Step 4 only
   verifies it still validates against the target version.

**If no project references Telerik**, stop the assessment and report that
this scenario has nothing to upgrade.

A **mixed** flavor (in one project, or across projects that ship in the same
application) or an **unknown** flavor is a blocker — record every
conflicting reference for planning. Never pick a flavor here.

## Step 2: Resolve and Validate the Upgrade Path

The target must be a concrete version before this step runs. The word
"latest" is not a value that can be copied from the project. When the user
asked for the latest version, resolve it independently from the detected
current version, using the Telerik CLI's latest-target resolution or an
authoritative Telerik release/package source, and record the exact version and
source. If no independent source returns a concrete version, stop and ask the
user for an explicit target; do not proceed with an assumed target.

If the target was resolved as "latest compatible", record the compatibility
constraint that excluded newer releases. Do not silently replace an
incompatible latest release with the current installed version.

Confirm the target Telerik version is reachable from the current one:

- **Target > current**: normal upgrade — continue.
- **Target == current**: this is a no-op, not a successful version upgrade.
  Stop before planning or execution and ask the user to choose an explicit
  newer target, upgrade the .NET target first if that is the compatibility
  constraint, or confirm that no Telerik version change is needed. Do not
  silently continue because the user said "latest".
- If the target equals current but the target was not independently resolved,
  treat the target as **unresolved**, not as a valid no-op, and resolve it
  before asking the user to confirm.
- **Target < current**: downgrades are not supported by the upgrade assistant.
  Flag it as a blocker and ask the user to confirm a forward target.

Also confirm the .NET target is **not** changing as part of this scenario. If
the user wants a different .NET version, direct them to run the Microsoft
`dotnet-version-upgrade` (or `dotnet-framework-version-upgrade`) scenario
first, then return here — the new .NET target determines the minimum Telerik
version.

## Step 3: Version Compatibility Check

The version compatibility matrix constrains which Telerik versions are available
based on the project's .NET target:

| .NET Target | Minimum Telerik Version |
|-------------|------------------------|
| .NET 8 / .NET 9 / .NET 10 (`-windows`) | 2024 Q4 (2024.4.x) — .NET 8 distribution |
| .NET Framework 4.6.2 – 4.8.1 | 2024 Q2 (2024.2.x) — .NET Framework 4.6.2 distribution; older releases ship .NET Framework 4.0/4.5 DLLs that also run here |
| .NET Framework 4.0 / 4.5 | up to 2024 Q1 (distribution ended) |

If the target Telerik version does not support the project's .NET target, flag
this as a blocker and suggest a compatible version. If the .NET target caps the
available Telerik versions below what the user asked for, present the options —
either accept the capped version, or run `dotnet-version-upgrade` first.

For the full matrix, consult the `telerik-wpf-dependency-management` skill
reference (`ref/version-compatibility.md`).

## Step 4: Detect Additive Concerns

Flag each concern that applies:

### Delivery Method (Assembly References vs. NuGet)

This is not a migration decision to make during assessment — record the fact
from Step 1 and let planning present the branch:

- **Already NuGet**: nothing further to record — the version upgrade is a
  plain package `Version` change at the same flavor; the NuGet question never
  arises for this project. Record the feed the target version needs
  (`telerik-wpf-nuget-feed-setup`: NuGet.org for `2026.3.812` and later,
  the Telerik NuGet server before).
- **Direct assembly references**: record the full list of Telerik
  `<Reference>` entries (from Step 1), including theme assembly references,
  plus the flavor and TFM — the in-place retarget asks for the DLL folder
  matching both (`Binaries\` for Xaml or `Binaries.NoXaml\` for NoXaml; e.g.
  `WPF462` or `WPF80` for `2026.3.1007`). This is the input for the in-place
  retarget path, which is the default and must be planned as a complete
  path, not a placeholder. Do not add a task that assumes migration to
  NuGet. If the project targets modern .NET, record that too — the one-time
  NuGet mention then includes the Visual Studio Toolbox/design-time reason.
- If the project references retired per-language localization packages
  (`Telerik.Windows.Controls.for.Wpf.<lang>`) and the target is Q2 2026 or
  later, record them — they are removed regardless of the delivery-method
  choice, since localization is bundled in
  `Telerik.Windows.Controls.for.Wpf[.Xaml]` from that release.

### NoXaml Copied Theme XAML
- **Trigger**: a NoXaml project merges XAML files copied from a
  `Themes.Implicit` folder (recorded in Step 1).
- **Action**: record the copied files and their themes. They are
  version-specific and not updated by a package bump or a retarget, so
  planning adds a task to refresh them from the target version's
  `Themes.Implicit` folder, which the user supplies
  (`telerik-wpf-xaml-flavor` Step 4). Never guess the folder.

### Application License Activation
- **Trigger for setup**: current Telerik version is pre-Q1 2025 (before
  2025.1.x) AND the target version is Q1 2025 or later — this is when a new
  mechanism must be set up if none exists.
- **Trigger for verification — always, independent of the setup trigger**:
  the **target** version is Q1 2025 or later, whether or not this run is the
  one that crosses the boundary. A project already past the boundary before
  this upgrade (e.g. already on a 2025.x release) still needs its license
  activation **verified** against the target version — do not report
  "nothing to do" for it. Record a verification task for every such project
  even when no setup action is needed.
- **Action when setup is triggered**: add an application license activation
  setup task — starting Q1 2025, Telerik UI for WPF requires license
  key activation in the built application.
- **On NuGet**: restore the project; Telerik control packages bring
  `Telerik.Licensing` transitively — this applies to any control package,
  not only `AllControls` — so no explicit package reference is needed
  (adding one anyway is redundant, not merely unnecessary). The shared
  `telerik-license.txt` verified during pre-initialization then also
  activates the application build, but this must still be **confirmed** by
  a build showing no `TKL*` codes — "arrives transitively" is a mechanism
  fact, not proof the build already activates cleanly.
- **On direct assembly references**: do not change the licensing mechanism.
  If an `EvidenceAttribute` is already recorded, leave it unchanged and
  verify it still validates for the target version's assemblies. If none
  exists yet and the boundary is crossed, set up a new Script Key via
  `telerik-wpf-license-key-setup` — `Telerik.Licensing` has no transitive path
  without the NuGet package
- **Class libraries**: when a Telerik-referencing project is a class library,
  the consuming application also needs activation
  (`telerik-wpf-license-key-setup` Step 1b) — record the consuming
  application project(s).

## Step 5: Preview Breaking Changes

Call `telerik-upgrade-assistant` with `projectPath` (the `.csproj` path) and
`targetVersion` (the confirmed target) to size the upgrade before planning.
`fromVersion` is optional — the tool auto-detects it from the project file
and asks the user if detection fails.

Pass the project path visible in the workspace or solution root; do not search
the file system. If the path is wrong the tool elicits the correct one from the
user.

The tool runs the Telerik CLI on the MCP server and analyzes source code and
XAML — it does not require the target package to be installed first. If it
fails with a licensing error, the shared license key from pre-initialization
is missing or stale; resolve it with the `telerik-wpf-license-key-setup`
skill and re-run. If the Telerik CLI is missing, install it with
`dotnet tool install --global Telerik.CLI`.

Record in the assessment:
- Total finding count
- Findings grouped by file (code and `.xaml`)
- Any findings the tool marks as high-risk or manual-only

This count drives task granularity during planning.

## Step 6: Write Assessment

Write `assessment.md` in the workflow folder with:

```markdown
# Telerik WPF Version Upgrade Assessment

## Solution Summary
- **Solution**: {solution path}
- **WPF Projects**: {count}
- **Upgrade**: Telerik {from} → {to}
- **Target request**: {explicit version / latest / newest compatible}
- **Target resolution**: {user-specified or independent source, with source}
- **Upgrade status**: ready / no-op requiring user clarification / blocked

## Project Analysis

### {project name}
- **Target Framework**: {tfm} (unchanged by this scenario)
- **Telerik Version**: {version}
- **Reference Style**: NuGet / Assembly
- **Flavor**: Xaml / NoXaml / mixed / unknown — {signals matched}
- **Theming (NoXaml)**: {theme assemblies/packages / copied Themes.Implicit XAML; themes in use, or "n/a"}

## Version Compatibility
- **Current Telerik Version**: {version}
- **Target Telerik Version**: {version}
- **Compatible with .NET target**: {Yes/No — details}

## Additive Concerns
- [ ] Delivery method: NuGet / direct assembly references — {details, incl. DLL folder flavor/TFM, required feed, retired localization packages}
- [ ] NoXaml copied theme XAML to refresh: {Yes/No — files}
- [ ] Application license activation: {Yes/No — details, incl. consuming applications of class libraries}

## Flavor Consistency
- **Mixed or unknown flavor (blocker)**: {conflicting references, or "none"}
- **Inconsistent theming (warning)**: {details, or "none"}

## Breaking Changes Preview
- **Total findings**: {count}
- **Files affected**: {count}
- **High-risk findings**: {list or "none"}

| File | Findings |
|------|----------|
| {path} | {count} |

## Risks and Notes
{blockers, high-risk API changes, custom control subclasses or style
templates of Telerik types, any special considerations}
```
