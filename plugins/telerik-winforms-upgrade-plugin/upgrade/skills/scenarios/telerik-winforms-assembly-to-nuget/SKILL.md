---
name: telerik-winforms-assembly-to-nuget
description: >
  Migrate a WinForms project's direct Telerik UI for WinForms assembly
  references to the equivalent NuGet packages, keeping the Telerik version and
  .NET target unchanged. Detects the current version and reference style,
  sets up the right NuGet feed, maps assemblies to packages, and verifies the
  result. Use only when no version or .NET-target change is also wanted.
requires-extension: telerik-winforms-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 8000
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  scenarioTraitsSet: [.NET, WinForms, WindowsForms, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-winforms-version-upgrade
      - telerik-winforms-control-conversion
    suggest-actions:
      - generate-report
---

# Telerik WinForms Assembly-to-NuGet Migration Scenario

Replace direct Telerik UI for WinForms assembly references with the
equivalent NuGet `PackageReference` entries, without changing the Telerik
version or the project's .NET target.

**Goal**: Same Telerik version, same .NET target, `PackageReference` instead
of `<Reference>`/`HintPath`.

**Also triggered by**: "migrate Telerik assembly references to NuGet", "switch
my Telerik DLL references to packages", "stop using Telerik DLLs directly".

## Scope

- **Target**: .NET Framework WinForms projects with direct Telerik assembly
  references — the common case for this reference style.
- **Modern .NET is already assumed to use packages.** If a project targets
  modern .NET (net6.0+) and has no direct Telerik assembly references, there
  is nothing to migrate for it — report that and stop instead of doing
  analysis work. If a modern-.NET project unexpectedly still has assembly
  references, migrate it the same as any other project.
- **Not this scenario**:
  - Changing the Telerik version → `telerik-winforms-version-upgrade` (which also migrates
    assembly references as part of that flow)
  - Adopting Telerik for the first time → `telerik-winforms-control-conversion`
  - Setting up or fixing license activation alone → `telerik-winforms-licensing`
  - Changing the .NET target → the host's `dotnet-version-upgrade` scenario

## Workflow Stages

This file only orchestrates. Each stage delegates the actual procedure to
lazy skills that are independently callable outside this scenario too.

0. **Pre-Initialization** — Identify in-scope projects, apply the early-exit
  check above, confirm parameters.
1. **Assessment** — Load [assessment.md](assessment.md).
2. **Planning** — Load [planning.md](planning.md).
3. **Execution** — Load [execution.md](execution.md).
4. **Post-Completion** — Load [post-completion.md](post-completion.md).

## Build Warnings Policy

**Override for this scenario:** The host's "fix all build warnings" and
"warning-free" rules do not apply. Only fix warnings introduced by this
scenario's own edits that have a clear local fix (for example a stale `HintPath`
left after a reference migration). Do not fix pre-existing warnings in the
user's projects — those are out of scope.

- Warnings that come from a Telerik package's own dependency graph once the
  packages are added (for example `MSB3277` for `System.Net.Http`) cannot be
  fixed by this scenario's edits. Record them under **Known issues**; do not
  suppress them, add binding redirects, retarget the project, or change other
  packages.
- The build gate is **0 errors and no blocking `TKL*` diagnostics** (a warning
  the project promotes to an error counts as an error), except `TKL*` warnings
  caused by a confirmed missing license, which this scenario's exception in the
  Warning Policy covers. A warning never fails a task, makes a worker return
  `blocked`, pauses an Automatic run, or stops dependent tasks. A warnings-only
  task is **complete with known issues**: call `complete_task` without `failed`
  and continue. If a worker returns `blocked` or reports failure and a warning
  is the only open item, complete the task the same way.
- Include the build gate in every prompt you send to a worker (executor,
  error-fixer, validator, reviewer), for example: "Build gate: 0 errors and no
  blocking `TKL*`; warnings are known issues, never `blocked`."
- List the known issues in the final summary; never describe such a build as
  warning-free.
- When writing `scenario-instructions.md`, add this line under **Preferences**:
  `- **Build Warnings Policy**: Fix only warnings this scenario introduces; errors and blocking TKL* diagnostics block, other warnings are reported as known issues (Telerik plugin policy)`

`telerik-winforms-migration-verification`'s **Warning Policy** has the full
classification.

## Pre-Initialization

This workflow uses project-file edits and the .NET/NuGet CLI, not
`telerik_*` MCP tools. Do not run an MCP-server license prerequisite check
or block project discovery on a license file. For Q1 2025+ packages,
application activation is checked during migration builds as described in
[execution.md](execution.md).

### Tools to Call

- Call `get_solution_path()` to find the solution file.
- Scan `.csproj`/`.vbproj` files for WinForms projects, then load
  `telerik-winforms-reference-detection` to classify each one's Telerik
  reference style.
- Apply the early-exit check from *Scope* per project. If every WinForms
  project is already NuGet-based (or has no Telerik reference at all), stop
  here and report that there is nothing to migrate.
- Confirm the in-scope project list and Flow Mode (Automatic or Guided) with
  the user, plus source control parameters (git only).

## Success Criteria

- [ ] Every previously assembly-referenced Telerik project now uses
      `PackageReference` for the same feature set
- [ ] No `<Reference>` entries or `HintPath`s pointing at Telerik DLLs remain
- [ ] All Telerik packages added to a project share the same version
- [ ] The solution restores and builds successfully; any deferred
  missing-license warnings are explicitly reported
- [ ] Any assembly with no known package mapping was reported to the user,
      not guessed

## Notes

- This scenario does not change the Telerik version or the .NET target — see
  `telerik-winforms-version-upgrade` and the host's `dotnet-version-upgrade` scenario for
  those.
- Add the resolved packages via project-file edits or the .NET/NuGet CLI;
  follow `telerik-winforms-reference-migration` for the exact steps.
