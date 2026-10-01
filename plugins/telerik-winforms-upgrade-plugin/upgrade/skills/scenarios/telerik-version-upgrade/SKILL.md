---
name: telerik-version-upgrade
description: >
  Upgrade the Telerik UI for WinForms version used by a WinForms application —
  detect and fix breaking changes, and set up license activation when crossing
  the Q1 2025 boundary. Works whether Telerik is referenced via NuGet or direct
  assembly references; moving to NuGet is offered, never required. Not for a
  reference-style change alone — use telerik-assembly-to-nuget for that.
requires-extension: telerik-winforms-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 9000
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  scenarioTraitsSet: [.NET, WinForms, WindowsForms, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-control-conversion
    suggest-actions:
      - generate-report
---

# Telerik WinForms Version Upgrade Scenario

Upgrade an existing Telerik UI for WinForms dependency to a newer version,
resolving breaking changes and modernizing how Telerik is referenced.

**Goal**: Move a WinForms application from its current Telerik UI for WinForms
version to a newer, compatible one with a clean build.

**Target-version rule**: "latest" is a request, not a version value. Never
use the detected current Telerik version as the answer to a latest-version
request. Resolve the latest available release independently, record the
concrete version and resolution source, and compare it with the current
version before asking for confirmation or creating an assessment.

**Prerequisite**: The project already references Telerik UI for WinForms. If it
does not, run the **telerik-control-conversion** scenario instead.

**Not this scenario**: for reference-style changes only (no version change),
use `telerik-assembly-to-nuget`; for license setup or fixes alone, use
`telerik-licensing`.

**Also triggered by**: "upgrade Telerik WinForms", "update Telerik version",
"move to the latest Telerik UI for WinForms", "fix Telerik breaking changes",
"set up Telerik licensing", or as a follow-up after `dotnet-version-upgrade`
completes on a WinForms project that already references Telerik.

## Relationship to the .NET Version Upgrade

A Telerik version upgrade and a .NET version upgrade are separate concerns, and
the .NET change always comes first:

- If the user **also wants a different .NET target** (.NET Framework → .NET, or
  .NET 8 → .NET 10), run the Microsoft `dotnet-version-upgrade` scenario first,
  then return here to bring Telerik to a version that supports the new target.
- If the user **stays on the current .NET target**, run this scenario directly.
  It works for both .NET Framework and modern .NET projects — the .NET target
  only constrains which Telerik versions are available.

Confirm this during pre-initialization; do not start a .NET version change from
within this scenario.

## Additive Concerns (layered into the task plan when detected)

| Concern | Trigger | Action |
|---------|---------|--------|
| **Delivery method** | Telerik referenced via direct assembly references | Upgrade in place by default (retarget `HintPath` to the new version); NuGet migration is mentioned once as an optional improvement, never required — see *Delivery Method Branch* below |
| **Application License Activation** | Source version pre-Q1 2025, target version Q1 2025 or later | On NuGet: `Telerik.Licensing` arrives transitively, nothing explicit to add. On assembly references: leave any existing Script Key / `EvidenceAttribute` in place and verify it still validates against the new version; only set one up via `telerik-winforms-license-key-setup` if none exists yet and the boundary is crossed |
| **MS Control Conversion** | A single standard Microsoft WinForms control found alongside Telerik — stop scanning at the first match, never a full inventory | Offered in post-completion as the `telerik-control-conversion` scenario |

## Delivery Method Branch (Assembly References vs. NuGet)

Detected during Assessment, alongside the current Telerik version. This
scenario's job is the **version** change; the delivery method (how Telerik
is referenced) is a separate, independent decision that must never block,
gate, or delay it.

| Current delivery method | What happens |
|--------------------------|---------------|
| **Already NuGet** | Plain version bump via package `Version` changes. The NuGet question does not arise — never raise it. |
| **Direct assembly references** | Upgraded in place by default via `telerik-winforms-reference-retargeting` (retargets `HintPath` to the new version's DLLs) — a complete, fully supported path, not a degraded fallback. NuGet is mentioned **once**, as an optional improvement, in planning. If accepted, delegate to the assembly-to-NuGet migration skills at the target version instead of the in-place retarget. If declined or unanswered, proceed with the in-place retarget — do not re-prompt or partially convert. |

In a non-interactive run, never convert to NuGet — always take the in-place
assembly-reference path and note that the NuGet option exists.

See `assessment.md`, `planning.md`, and `execution.md` for the exact steps
and lazy-skill delegation for each branch.

## MCP Server

This scenario uses the **Telerik.WinForms.MCP** NuGet package which provides:

| Tool | Arguments | What it actually does |
|------|-----------|----------------------|
| `telerik_upgrade_assistant` | `projectPath`, `targetVersion?`, `fromVersion?` | Runs the Telerik CLI (`telerik migrate analyze`) and reports every breaking API change with file, line, and old/new signature |
| `telerik_add_package_reference` | `csprojPath`, `targetFramework`, `projectStyle` | Returns install instructions for `Telerik.UI.for.WinForms.AllControls` |
| `telerik_winforms_assistant` | — | Component API questions when a replacement API is unclear |
| `telerik_get_theme_setup` | none | Theme configuration — only if a breaking change forces it |

Notes:
- `projectPath` accepts `.csproj` **or `.vbproj`**. Pass the path visible in the
  workspace or solution root — do not search the file system. If it is wrong,
  the tool **elicits the correct path from the user**, so a best-effort value
  always beats omitting the call.
- `fromVersion` is **auto-detected from the project file** when omitted; the tool
  asks the user if detection fails.
- `telerik_get_migration_plan`, `telerik_analyze_project`, and
  `telerik_convert_file` are **not** for this scenario — they belong to the
  Microsoft-controls migration workflow. Read `.csproj` facts directly instead.
- These tools run **on the MCP server** and require an active Telerik license
  (see Pre-Initialization).

## Workflow Stages

Run these stages in order:

0. **Pre-Initialization** — Gather project info, confirm target Telerik version and parameters, set up source control and workflow folder.
1. **Assessment** — Detect current Telerik version, reference style, .NET target, and additive concerns. Creates `assessment.md`.
2. **Planning** — Create the upgrade plan from the assessment findings. Creates `plan.md`.
3. **Execution** — Execute tasks with MCP tool delegation and build validation. Creates `tasks/*/task.md`.
4. **Post-Completion** — Summarize results and suggest follow-ups, including control conversion.

## Pre-Initialization

### Step 0: Verify the Telerik License (blocking prerequisite)

The `Telerik.WinForms.MCP` server requires an active Telerik license to operate.
Without it **no `telerik_*` tool call works**, so this must be settled before
anything else — including the assessment's breaking-changes preview.

Load `telerik-winforms-license-detection` and run its **Step 0** (MCP server
prerequisite check) — do not re-implement the path/existence check here.
That skill resolves the environment variable correctly per shell and avoids
the false negatives a naive literal `%AppData%` check produces in
PowerShell.

If it reports the license missing: don't just point the user to their
account and wait — offer to walk them through it right now via
`telerik-winforms-license-key-setup`, then re-run the Step 0 check before
proceeding. If the user declines or can't complete it immediately, stop and
direct them to
<https://www.telerik.com/account/your-licenses/license-keys> (a
[free trial](https://www.telerik.com/try/ui-for-winforms) also issues a valid
key), then resume once they confirm.

This shared key activates the MCP server and, for Q1 2025+ projects using
Telerik NuGet packages, the application through the package's transitive
`Telerik.Licensing` dependency.
Prefer this license-file path for the application. If an existing project has
an `EvidenceAttribute`, leave it unchanged; never suggest or create one.

### Step 0b: Telerik CLI

`telerik_upgrade_assistant` drives the Telerik CLI. If it is not installed the
tool prompts to install it; you can also install it up front:

```
dotnet tool install --global Telerik.CLI
```

### Tools to Call

**Step 1**: Identify the solution and WinForms projects:
- Call `get_solution_path()` to find the solution file
- Scan `.csproj` files for `<UseWindowsForms>true</UseWindowsForms>` or WinForms assembly references

**Step 2**: Gather project parameters:
- Detect current .NET version (`<TargetFramework>` in each `.csproj`)
- Detect the current Telerik version from package references or assembly
  versions — or leave it to `telerik_upgrade_assistant`, which auto-detects it
- If no Telerik reference is found, stop and redirect the user to the
  **telerik-control-conversion** scenario
- Ask whether a .NET version change is also wanted — if yes, direct the user to
  run `dotnet-version-upgrade` first (see *Relationship to the .NET Version
  Upgrade* above)
- Determine the target Telerik version, constrained by the project's .NET target:
  - If the user supplied a concrete version, preserve it exactly and record
    that it was user-specified.
  - If the user asked for "latest" or "newest", resolve it independently of
    the project file. A permitted resolution probe is
    `telerik_upgrade_assistant` with `projectPath` and `fromVersion`, omitting
    `targetVersion` so the Telerik CLI resolves its latest available target;
    capture the concrete target returned by that probe. If the probe does not
    return a concrete version, use an authoritative Telerik release/package
    source and record the version found. Never copy the current version into
    the target field and never call the current version "latest" merely
    because it is installed.
  - Apply the .NET compatibility constraint after resolving the latest
    release. If the newest release is incompatible with the current .NET
    target, explain the constraint and ask whether to upgrade .NET first or
    choose the newest compatible Telerik version; do not silently substitute
    the current version.
  - If the independently resolved target equals the current version, stop the
    upgrade flow and ask the user to choose an explicit newer version or
    confirm that there is no version upgrade to perform. Offer
    `telerik-control-conversion` only as a separate follow-up when applicable.

**Step 3**: Assemble `confirmFields` for the combined confirmation:
- **Target Telerik Version**: suggested or user-specified
- **Target Resolution**: user-specified / independently resolved latest,
  including the source used
- **Flow Mode**: Automatic or Guided
- Source control parameters (git only): working branch, commit strategy

## Stage Instructions

**IMPORTANT**: Load each stage's instructions file **only when entering that stage**.

### Stage 1: Assessment

**When entering this stage, load**: [assessment.md](assessment.md)

Detects the current Telerik version, reference style, and additive concerns, and
validates version compatibility. Produces `assessment.md` in the workflow folder.

### Stage 2: Planning

**When entering this stage, load**: [planning.md](planning.md)

Creates the upgrade task list from the detected additive concerns. Produces
`plan.md` in the workflow folder.

### Stage 3: Execution

**When entering this stage, load**: [execution.md](execution.md)

Executes tasks using MCP tools, validates with builds, and fixes breaking
changes iteratively.

### Stage 4: Post-Completion

**When entering this stage, load**: [post-completion.md](post-completion.md)

Summarizes results and offers the control conversion scenario for any remaining
Microsoft controls.

## Success Criteria

- [ ] The target version is a concrete version resolved independently from the
  current version when the user asked for "latest" or "newest"
- [ ] Every project references the target Telerik version, and target > current
  for a telerik-version-upgrade run
- [ ] Delivery method is consistent per project: every reference is NuGet, or
      every reference is a direct assembly path retargeted to the new
      version — never a mix of old and new, and never a mix of styles
- [ ] If a project stayed on assembly references, the NuGet option was
      mentioned exactly once and never repeated
- [ ] Application license activation is valid for the target version —
      transitive `Telerik.Licensing` on NuGet, or the existing Script Key /
      `EvidenceAttribute` verified (not replaced) on assembly references
- [ ] All breaking changes reported by `telerik_upgrade_assistant` are resolved
- [ ] Solution builds without errors and all tests pass

## Notes

- Tool names above are the bare names exposed by the `telerik-winforms-upgrade-plugin`
  MCP; every host resolves them.
- Do NOT try to load or decompile Telerik DLLs to extract API information.
  Use `telerik_winforms_assistant` for component API questions instead.
- Direct assembly references are a fully supported configuration. Do not
  frame them as legacy or deficient — the in-place retarget path must be as
  complete and well-supported as the NuGet path.
