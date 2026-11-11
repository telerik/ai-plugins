---
name: telerik-wpf-migration-verification
description: >
  Restore and build a WPF project after a Telerik reference migration,
  using the correct build method for Classic-style .NET Framework projects,
  run the NoXaml theming checks, and report exactly what changed. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Migration Verification

Confirms a reference migration actually resolves and builds, and reports the
result. Runs after `telerik-wpf-reference-migration` (and after
`telerik-wpf-reference-retargeting`).

## Step 1: Restore

Run `dotnet restore` (or the IDE equivalent). If the required feed from
`telerik-wpf-nuget-feed-setup` isn't resolvable, restore fails with
missing packages — treat that as a feed problem, not a code problem, and
send the user back to feed setup rather than editing the project further.

## Step 2: Build

- **SDK-style projects**: `dotnet build`
- **Classic-style .NET Framework projects built outside Visual Studio**: the
  SDK's MSBuild doesn't fully support `PackageReference` in classic
  `.csproj` files and reports spurious `CS0246` ("The type or namespace
  name 'Telerik' could not be found") errors even after a successful
  restore. Use Visual Studio's MSBuild instead, located via `vswhere.exe`:
  ```
  vswhere.exe -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe
  ```

WPF XAML compile errors (`MC*`, e.g. `MC3074` for an unresolved
`telerik:` type, and `XDG*`) count as errors, the same as compiler errors.

## Step 3: Check Flavor and Theming

Load `telerik-wpf-xaml-flavor`:
- Re-run its flavor detection and confirm the project still has the flavor
  recorded before the change, and that no reference or package of the other
  flavor was introduced (no mixed flavor). A flavor change or a newly mixed
  flavor is a migration mistake — fix it under Step 4.
- For NoXaml projects, run its **Step 4 theming checks** and include each
  result in the report. Missing theme packages/DLLs and dictionaries merged
  for a missing assembly are migration mistakes; copied theme XAML that the
  user deferred refreshing is reported as an open item.

## Step 4: Fix Only Migration Mistakes

If the build or Step 3 fails, fix only reference-migration mistakes: a
missing package, a wrong version, a package or DLL of the wrong flavor, or a
leftover `<Reference>`. Do not fix unrelated API breaking changes here —
that is out of scope for this scenario (see `telerik-wpf-version-upgrade`
and `telerik-wpf-breaking-changes` for that work).

## Warning Policy (Narrows the Shared Build Skill's Default for Telerik Tasks)

The common `building-projects` skill's default is to fix every warning in
touched projects, not just new ones. For Telerik migration/upgrade work
specifically, that bar is narrower — fixing every pre-existing or
unrelated warning is expensive and out of scope for these tasks. This
policy is the canonical definition; every other Telerik skill and scenario
that validates a build points back here rather than restating it.

**Assembly-to-NuGet missing-license exception**: only when the caller is
`telerik-wpf-assembly-to-nuget`, the unchanged Telerik version is Q1 2025 or
later, and a missing application license has been confirmed and explicitly
reported to the user, `TKL*` **warnings caused by that missing license**
(e.g. `TKL002`) are non-blocking. Account for environment-based license
inputs before concluding a license is missing. Record the warnings and
activation as deferred to `telerik-wpf-licensing`; do not start setup
automatically. This exception includes missing-license warnings introduced
by adding the control packages, but does not apply to any other scenario,
corrupted/expired licenses, product-mismatch warnings, or licensing errors.
Warnings promoted to errors still block verification; never suppress
diagnostics or change warning severity to make a build pass.

**Always fix, never leave:**
- Any compiler **error**, including WPF XAML compile errors (`MC*`, `XDG*`).
- `TKL*` licensing codes, except the missing-license warnings covered by
  the exception above (`telerik-wpf-license-diagnostics`).
- A warning that is a **new regression introduced by this task's own
  edits**, except the missing-license warnings covered above (e.g. a stale
  `HintPath` left after a reference migration, or a breaking-change fix
  that compiles but warns because the wrong overload was picked).
- A warning `telerik-upgrade-assistant` or `telerik-wpf-assistant`
  explicitly flags as signaling an imminent breaking change at the version
  being moved to.

**Not blocking — report, but do not spend this task's edits fixing them
unless the customer asks:**
- Pre-existing warnings in touched projects that predate this task and are
  unrelated to the Telerik reference/version/licensing change being made
  (e.g. an existing unused-variable warning in application code).
- Telerik-emitted obsolete-API warnings (e.g. `CS0618`) for members that
  still compile and function correctly at the target version.

"Not blocking" means don't spend edits resolving it as part of this task —
it does not mean hide it. Always list every warning found in the build
output in the report, whether or not it was fixed.

## Step 5: Report

- Packages added (id + version) and references removed, per project
- Flavor (unchanged, or the blocker found)
- Feed used
- Restore result and build result
- NoXaml theming check results, including copied theme XAML still to refresh
- For Q1 2025+ projects: application activation verified / deferred
  (confirmed missing license) / blocked, with warning codes and follow-up
- Any assembly that stayed unmapped, and how it was resolved

## Idempotency

Re-running after a successful reference migration should restore and build
successfully with no further reference edits needed. Continue to report any
deferred missing-license warnings until application activation is resolved.
