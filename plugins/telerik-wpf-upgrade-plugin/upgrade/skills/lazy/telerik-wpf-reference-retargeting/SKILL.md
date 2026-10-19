---
name: telerik-wpf-reference-retargeting
description: >
  Update direct Telerik UI for WPF assembly references to a new Telerik
  version without changing the delivery method or the assembly flavor —
  validates a customer-supplied DLL location, repoints every
  `<Reference>`/`<HintPath>` entry to it, and leaves everything else
  (delivery method, flavor, licensing mechanism) untouched. Idempotent — safe
  to re-run on an already-retargeted project. Use when a version bump is
  needed and the customer is staying on direct assembly references rather
  than moving to NuGet.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Reference Retargeting

Updates a project's direct Telerik assembly references to a new Telerik
version in place — the customer stays on assembly references; only the
version-specific DLL location changes. This is the counterpart to
`telerik-wpf-reference-migration`, which moves assembly references to
NuGet instead: use this skill only when the customer is not converting to
NuGet at all.

This skill only retargets assembly references. It does not decide the target
version (the calling scenario/extension does), does not touch
`PackageReference`/`packages.config`, never switches the Xaml/NoXaml flavor
(`telerik-wpf-xaml-flavor`), and does not set up or change licensing
(`telerik-wpf-license-key-setup`'s job) — it only confirms, in Step 4, that the
pre-existing licensing setup still applies to what it changed.

## Preconditions

- The project's current delivery method is direct assembly references
  (`<Reference>` with `<HintPath>`), as detected by
  `telerik-wpf-reference-detection`. If the project uses NuGet or
  `packages.config`, this skill does not apply — use
  `telerik-wpf-dependency-management` (NuGet version bump) or
  `telerik-wpf-reference-migration` (move to NuGet) instead.
- The project's flavor is Xaml or NoXaml. If `telerik-wpf-xaml-flavor`
  reports it as mixed or unknown, stop — that is a blocker the calling
  scenario resolves with the user.
- The target Telerik version has already been resolved and confirmed by the
  caller. This skill does not pick a version.

## Step 1: Locate the New Version's DLLs

Ask the customer where the target Telerik version's DLLs are located —
typically the installation's `Binaries\` (Xaml) or `Binaries.NoXaml\`
(NoXaml) folder, in the subfolder matching the project's target framework
(e.g. `...\Binaries.NoXaml\WPF462\` or `...\Binaries\WPF80\` for
`2026.3.1007`). **Do not guess the path, and do not assume a default install
location** — different machines and CI agents install Telerik to different
places, and older releases may use other subfolder names. This is a hard
gate: ask before searching the filesystem, reading candidate folders,
changing the project, or running a build that could hide the missing-source
problem. The customer may provide an install folder, package/cache location,
or another approved source; if they do not know yet, stop and ask them to
identify one rather than guessing.

## Step 2: Validate the Supplied Path

Before touching the project, confirm:
- The path exists and contains Telerik assembly files.
- The DLLs are the expected **target** Telerik version — do not accept a
  path that resolves to a different version than what was confirmed.
- The DLLs are the project's **flavor**: the path is under `Binaries\` for
  Xaml or `Binaries.NoXaml\` for NoXaml; when the folder name gives no
  signal, check the File Description of `Telerik.Windows.Controls.dll` — it
  ends with `(No XAML)` for NoXaml:
  `(Get-Item <path>\Telerik.Windows.Controls.dll).VersionInfo.FileDescription`
- The DLLs are the correct framework-specific build for the project's TFM
  (for `2026.3.1007`: `WPF462` for a .NET Framework project, `WPF80` for
  `net8.0-windows` and later). For older releases, validate the folder
  against the DLLs it contains rather than its name.
- For NoXaml, every referenced `Telerik.Windows.Themes.<Theme>.dll` exists in
  the supplied location.

If validation fails, report exactly what's wrong (missing files, wrong
version, wrong flavor, wrong framework build) and ask for a corrected path —
do not fall back to a guessed location, and never accept the other flavor.

## Step 3: Retarget Every Reference

For every Telerik `<Reference>` entry recorded by
`telerik-wpf-reference-detection`, including theme assembly references:
- Update its `<HintPath>` to point at the validated location.
- Keep the `Include` name as-is unless the assembly itself was renamed
  between versions (rare — flag it if `telerik-upgrade-assistant` or the
  build surfaces it, don't guess).

Do not leave a mix of old- and new-version paths — every reference in the
project moves together, in the same pass.

For NoXaml projects that merge **copied** theme XAML (from
`Themes.Implicit`), the XAML files are version-specific and are not updated
by retargeting — they must be refreshed per `telerik-wpf-xaml-flavor`
Step 4. Do not hand-edit them.

## Step 4: Confirm Licensing Still Applies

This skill does not change the licensing mechanism. If the project already
has a Script Key (`Telerik.Licensing.EvidenceAttribute`), leave it
unchanged — the build in Step 5 is what proves it still validates against
the newly referenced assemblies. If the upgrade newly crosses the Q1 2025
licensing boundary and no Script Key exists yet, that setup is
`telerik-wpf-license-key-setup`'s job, not this skill's — surface it as a
follow-up rather than handling it here.

## Step 5: Restore and Build

Hand off to `telerik-wpf-migration-verification` to restore/build and
confirm the retarget resolved cleanly (including the NoXaml theming checks).
Fix only retargeting mistakes there (wrong path, leftover old-version
reference) — API-level breaking changes are `telerik-wpf-breaking-changes`'s
job.

## Idempotency

Re-running this skill when every reference already points at the validated
target-version location is a no-op — confirm and report, don't re-prompt for
a path that's already correct.

## Output Shape

Report, per project:
- The validated DLL location used, with its flavor and TFM folder
- Every `<Reference>`/`<HintPath>` updated (old path → new path)
- Copied theme XAML that still needs refreshing (NoXaml)
- Any reference that could not be resolved or validated, as a blocker
