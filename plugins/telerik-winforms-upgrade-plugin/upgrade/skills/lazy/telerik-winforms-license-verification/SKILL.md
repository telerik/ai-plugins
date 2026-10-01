---
name: telerik-winforms-license-verification
description: >
  Confirm a Telerik UI for WinForms licensing setup actually activates —
  build the project(s) and check for TKL* warnings/errors, and confirm the
  resulting mechanism matches what was planned. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Licensing Verification

Confirms a licensing setup, fix, or migration actually resolves — the
counterpart every other licensing skill in this set hands off to.

## Inputs

- The mechanism the caller expects to be in place per project (from
  whichever setup/migration/diagnostics step ran before this).

## Preconditions

- The setup/migration/fix step being verified has already run.

## Step 1: Restore and Build

- **SDK-style projects**: `dotnet build`.
- **Classic-style .NET Framework projects built outside Visual Studio**: use
  Visual Studio's MSBuild, located via `vswhere.exe`
  (`-latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe`)
  — the same method used by `telerik-winforms-migration-verification`, since
  the .NET SDK's MSBuild does not fully support `PackageReference` in
  classic `.csproj` files.

## Step 2: Scan Build Output for TKL Codes

Check the build log for any `TKL0xx`/`TKL1xx` code or message. If any appear,
do not attempt to fix them here — hand off to
`telerik-winforms-license-diagnostics` with the exact code/message and let it
route to the correct fix skill. `TKL*` codes are always blocking, unlike
other build warnings — see `telerik-winforms-migration-verification`'s
**Warning Policy** for which non-`TKL*` warnings this task does and does not
need to resolve; do not apply the common `building-projects` skill's
"fix every warning" default here.

## Step 2a: Binding Redirect Check (.NET Framework, Non-SDK-Style Only)

When the project is .NET Framework, non-SDK-style, and has an **explicit**
`Telerik.Licensing` `PackageReference` (added either by a first-time setup
or a script-key-to-NuGet migration), confirm
`<AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>` is set
(or no explicit `false` overrides it). A missing or disabled setting here is
the documented cause of a `FileLoadException` for `Telerik.Licensing.Runtime`
at runtime, which a clean build alone will not surface. Report it as a
finding requiring `telerik-winforms-license-key-setup`'s Step 1a or
`telerik-winforms-license-nuget-migration`'s Step 3, rather than fixing it
inline here.

## Step 3: Confirm the Mechanism Matches What Was Planned

Re-run (or reuse the fresh output of) `telerik-winforms-license-detection`
and confirm:
- The classified `mechanism` matches what setup/migration intended.
- No stray leftover artifact remains (e.g. an `EvidenceAttribute` file after
  a migration that should have removed it, unless the project is a
  documented hybrid host).

## Step 4: Runtime Reminder

A clean build does not by itself prove no watermark/banner appears — that is
only fully confirmed by running the application once. Remind the customer to
launch the app and confirm no watermark, banner, or modal dialog appears.

## Output

- Build result (clean / TKL codes found, listed)
- Mechanism confirmed vs. planned (match / mismatch, with detail)
- Reminder issued to run the app once

## Idempotency

Re-running against an already-clean build reports the same clean result and
makes no changes.
