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

Check existing validation evidence before executing. A successful restore/build
may be reused only for matching scope, configuration, toolchain, and unchanged
build-relevant inputs; record that it was reused. Run uncovered checks, and
restore when dependency/configuration/toolchain inputs changed.

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
`telerik-winforms-version-upgrade` and `telerik-winforms-breaking-changes` for that work).

## Warning Policy and Build Gate (Replaces the Shared Build Skill's Default for Telerik Tasks)

The host's defaults — the common `building-projects` skill's "fix all
warnings", the task executor's "Warnings fixed" definition of done, the
orchestrator's "build green and warning-free" step, and the build validator's
"0 warnings" GREEN — **do not apply to Telerik scenarios.** This policy
replaces them for every role (executor, error-fixer, BreakGlass, build
validator, reviewer, orchestrator). Fixing every warning is expensive, and
some warnings come from a Telerik package's own dependency graph, where no
fix inside the task exists. This policy is the canonical definition; every
other Telerik skill and scenario that validates a build points back here
rather than restating it.

**Build gate**: a Telerik task's build check passes with **0 errors and no
blocking `TKL*` diagnostics** (and passing tests, when the task has them). A
warning on its own never fails a task, never makes a worker return
`blocked`, never pauses an Automatic run, and never stops dependent tasks from
starting. A build with warnings only is a **pass with known issues**: finish
the task, report the warnings, and continue.

**Assembly-to-NuGet missing-license exception**: only when the caller is
`telerik-winforms-assembly-to-nuget`, the unchanged Telerik version is Q1 2025 or
later, and a missing application license has been confirmed and explicitly
reported to the user, `TKL*` **warnings caused by that missing license**
(e.g. `TKL002`) are non-blocking. Account for environment-based license
inputs before concluding a license is missing. Record the warnings and
activation as deferred to `telerik-winforms-licensing`; do not start setup
automatically. This exception includes missing-license warnings introduced
by adding the control packages, but does not apply to any other scenario,
corrupted/expired licenses, product-mismatch warnings, or licensing errors.
Warnings promoted to errors still block verification; never suppress
diagnostics or change warning severity to make a build pass.

**Blocking — fix before the task can pass:**
- Any compiler **error**, including a warning the project itself promotes to
  an error. For a promoted warning, report it to the user instead of editing
  the project's warning configuration.
- `TKL*` licensing codes, except the missing-license warnings covered by
  the exception above (`telerik-winforms-license-diagnostics`).

**Fix when the cause is local and clear — otherwise report; never a gate:**
- A warning that is a **new regression introduced by this task's own
  edits**, except the missing-license warnings covered above (e.g. a stale
  `HintPath` left after a reference migration, or a breaking-change fix
  that compiles but warns because the wrong overload was picked). Make at
  most one targeted fix attempt; if the warning remains, report it and
  continue.
- A warning `telerik_upgrade_assistant` or `telerik_winforms_assistant`
  explicitly flags as signaling an imminent breaking change at the version
  being moved to. Fix it, or record why it was deferred.

**Report only — do not fix, research, or escalate:**
- Pre-existing warnings in touched projects that predate this task and are
  unrelated to the Telerik reference/version/licensing change being made
  (e.g. an existing unused-variable warning in application code).
- Telerik-emitted obsolete-API warnings (e.g. `CS0618`) for members that
  still compile and function correctly at the target version.
- **Dependency-graph and target-framework warnings that surface once a
  Telerik package is added or upgraded** — for example `MSB3277`
  (conflicting versions of a transitive assembly such as `System.Net.Http`),
  `MSB3243`, `NU1701`, `NU1603`, `NU1608`, and `NU190x` advisories. They come
  from the package's dependency graph, not from a mistake in this task's
  edits, and removing them can mean changing the target framework or other
  packages, which is the user's decision. Do not suppress them, add binding
  redirects, retarget the project, or change other package versions to
  silence them. Record the code, the assemblies or packages and versions
  involved, and the project in the task's `progress-details.md`, then
  continue. If the application later fails at runtime with a
  `FileLoadException` or `FileNotFoundException` for a reported assembly,
  take that record to the user to decide on a redirect or retarget.

Do not spend an error-fixer, BreakGlass, research, or review loop on a
report-only warning, and do not return `blocked` for one. A reviewer should
confirm a report-only warning is recorded, not demand that it be fixed.

**Reporting**: always list every warning found in the build output under
**Known issues** in `progress-details.md` and in the final summary, grouped by
code, with the project and whether it was fixed or reported. "Not a gate"
means do not spend edits resolving it as part of this task — it does not mean
hide it. Never suppress a diagnostic or change warning severity to make a
build pass, and never describe a build with warnings as warning-free.

## Step 4: Report

- Packages added (id + version) and references removed, per project
- Feed used
- Restore result and build result, with any **Known issues** (warnings
  reported rather than fixed) listed by code
- For Q1 2025+ projects: application activation verified / deferred
  (confirmed missing license) / blocked, with warning codes and follow-up
- Any assembly that stayed unmapped, and how it was resolved

## Idempotency

Re-running after a successful reference migration should restore and build
successfully with no further reference edits needed. Continue to report any
deferred missing-license warnings until application activation is resolved.
