---
name: telerik-winforms-migration-verification
description: >
  Restore and build a WinForms project after a Telerik reference migration,
  using the correct build method for Classic-style .NET Framework projects,
  and report exactly what changed. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Migration Verification

Confirms a reference migration actually resolves and builds, and reports the
result. Runs after `telerik-winforms-reference-migration`.

## Step 1: Restore

Run `dotnet restore` (or the IDE equivalent). If the required feed from
`telerik-winforms-nuget-feed-setup` isn't resolvable, restore fails with
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

## Step 3: Fix Only Migration Mistakes

If the build fails, fix only reference-migration mistakes: a missing
package, a wrong version, or a leftover `<Reference>`. Do not fix unrelated
API breaking changes here — that is out of scope for this scenario (see
`telerik-version-upgrade` and `telerik-winforms-breaking-changes` for that work).

## Warning Policy (Narrows the Shared Build Skill's Default for Telerik Tasks)

The common `building-projects` skill's default is to fix every warning in
touched projects, not just new ones. For Telerik migration/upgrade/conversion
work specifically, that bar is narrower — fixing every pre-existing or
unrelated warning is expensive and out of scope for these tasks. This
policy is the canonical definition; every other Telerik skill and scenario
that validates a build points back here rather than restating it.

**Assembly-to-NuGet missing-license exception**: only when the caller is
`telerik-assembly-to-nuget`, the unchanged Telerik version is Q1 2025 or
later, and a missing application license has been confirmed and explicitly
reported to the user, `TKL*` **warnings caused by that missing license**
(e.g. `TKL002`) are non-blocking. Account for environment-based license
inputs before concluding a license is missing. Record the warnings and
activation as deferred to `telerik-licensing`; do not start setup
automatically. This exception includes missing-license warnings introduced
by adding the control packages, but does not apply to any other scenario,
corrupted/expired licenses, product-mismatch warnings, or licensing errors.
Warnings promoted to errors still block verification; never suppress
diagnostics or change warning severity to make a build pass.

**Always fix, never leave:**
- Any compiler **error**.
- `TKL*` licensing codes, except the missing-license warnings covered by
  the exception above (`telerik-winforms-license-diagnostics`).
- A warning that is a **new regression introduced by this task's own
  edits**, except the missing-license warnings covered above (e.g. a stale
  `HintPath` left after a reference migration, or a breaking-change fix
  that compiles but warns because the wrong overload was picked).
- A warning `telerik_upgrade_assistant` or `telerik_winforms_assistant`
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

## Step 4: Report

- Packages added (id + version) and references removed, per project
- Feed used
- Restore result and build result
- For Q1 2025+ projects: application activation verified / deferred
  (confirmed missing license) / blocked, with warning codes and follow-up
- Any assembly that stayed unmapped, and how it was resolved

## Idempotency

Re-running after a successful reference migration should restore and build
successfully with no further reference edits needed. Continue to report any
deferred missing-license warnings until application activation is resolved.
