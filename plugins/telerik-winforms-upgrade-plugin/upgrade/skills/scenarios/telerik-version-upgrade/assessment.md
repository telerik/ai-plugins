# Assessment Stage — Telerik WinForms Version Upgrade

Analyze the WinForms solution to establish the current Telerik state, validate
the target version, and detect additive concerns. Write findings to
`assessment.md` in the workflow folder.

## Step 1: Detect Delivery Method and Version (First, Before Anything Else)

This is the first fact-finding step — target-version resolution, breaking
changes preview, and planning all depend on it. Do not assume either the
delivery method or the current version.

Load `telerik-winforms-reference-detection` and run it for each in-scope
project. Record, per project:

1. **Target framework**: read `<TargetFramework>` / `<TargetFrameworks>`.
   Classify as `.NET Framework` (net4x) or modern `.NET` (net6.0+).
2. **WinForms marker**: confirm `<UseWindowsForms>true</UseWindowsForms>` or
   legacy WinForms references (System.Windows.Forms).
3. **Delivery method** (the detection skill's `referenceStyle`): NuGet
   (`PackageReference`), direct assembly reference (`<Reference>` with
   `<HintPath>`), `packages.config`, or mixed.
4. **Telerik version** (the detection skill's `telerikVersion`, or
   "unknown"): extracted from the `Version` attribute of `PackageReference`,
   or from the assembly `<HintPath>` version folder (e.g. `Bin\2024.1.130\`).
5. **Existing EvidenceAttribute**: detect whether the project already
   contains `Telerik.Licensing.EvidenceAttribute`. Record it as an existing
   customer choice; do not create, modify, or recommend it — Step 4 only
   verifies it still validates against the target version.
6. **Standard MS controls (fast, boolean only)**: scan `.Designer.cs` and
   `.cs` files for a standard System.Windows.Forms control that has a
   Telerik equivalent (Button, DataGridView, TreeView, ListView, ComboBox,
   DateTimePicker, TabControl, StatusStrip, ToolStrip, MenuStrip, etc.).
   **Stop at the first match per project** — this only needs to answer
   yes/no for the post-completion offer, not to plan work in this scenario.
   Do not enumerate every control, do not produce a count, and do not keep
   scanning further files once one match is found.

**If no project references Telerik**, stop the assessment and redirect the user
to the **telerik-control-conversion** scenario. This scenario has
nothing to upgrade.

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
  silently continue because the user said "latest". Offer the
  `telerik-control-conversion` scenario only as a separate follow-up when applicable.
- If the target equals current but the target was not independently resolved,
  treat the target as **unresolved**, not as a valid no-op, and resolve it
  before asking the user to confirm.
- **Target < current**: downgrades are not supported by the upgrade assistant.
  Flag it as a blocker and ask the user to confirm a forward target.

Also confirm the .NET target is **not** changing as part of this scenario. If
the user wants a different .NET version, direct them to run the Microsoft
`dotnet-version-upgrade` scenario first, then return here — the new .NET target
determines the minimum Telerik version.

## Step 3: Version Compatibility Check

The version compatibility matrix constrains which Telerik versions are available
based on the project's .NET target:

| .NET Target | Minimum Telerik Version |
|-------------|------------------------|
| .NET 8 | 2024 Q2 (2024.2.x) |
| .NET 9 / .NET 10 | 2024 Q4 (2024.4.x) |
| .NET Framework 4.6.2+ | 2024 Q2 (2024.2.x) |
| .NET Framework 4.8+ | R3 2022 (2022.3.x) |
| .NET Framework 4.0 | up to R1 2024 (distribution ended) |

If the target Telerik version does not support the project's .NET target, flag
this as a blocker and suggest a compatible version. If the .NET target caps the
available Telerik versions below what the user asked for, present the options —
either accept the capped version, or run `dotnet-version-upgrade` first.

For the full matrix, consult the `telerik-winforms-dependency-management` skill
reference.

## Step 4: Detect Additive Concerns

Flag each concern that applies:

### Delivery Method (Assembly References vs. NuGet)

This is not a migration decision to make during assessment — record the fact
from Step 1 and let planning present the branch:

- **Already NuGet**: nothing further to record — the version upgrade is a
  plain package `Version` change; the NuGet question never arises for this
  project.
- **Direct assembly references**: record the full list of Telerik
  `<Reference>` entries (from Step 1) — this is the input for the in-place
  retarget path, which is the default and must be planned as a complete
  path, not a placeholder. Do not add a task that assumes migration to
  NuGet.
- If the project already references one of the retired framework-specific
  packages (`Net462`, `Net48`, `Net80`, `Net90`), record that too — it always
  migrates to the unified `AllControls` id regardless of the delivery-method
  choice, since those ids no longer exist for the target version.

### Application License Activation
- **Trigger for setup**: current Telerik version is pre-Q1 2025 (before
  2025.1.x) AND the target version is Q1 2025 or later — this is when a new
  mechanism must be set up if none exists.
- **Trigger for verification — always, independent of the setup trigger**:
  the **target** version is Q1 2025 or later, whether or not this run is the
  one that crosses the boundary. A project already past the boundary before
  this upgrade (e.g. already on 2025.3.812) still needs its license
  activation **verified** against the target version — do not report
  "nothing to do" for it. Record a verification task for every such project
  even when no setup action is needed.
- **Action when setup is triggered**: add an application license activation
  setup task — starting Q1 2025, Telerik UI for WinForms requires license
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
  `telerik-winforms-license-key-setup` — `Telerik.Licensing` has no transitive path
  without the NuGet package

### MS Control Conversion Opportunity
- **Trigger**: at least one standard Microsoft WinForms control detected
  alongside Telerik (Step 1's first-match check)
- **Action**: record a plain yes/no per project for post-completion — not a
  count and not a list of every control found. The
  `telerik-control-conversion` scenario handles the actual work. Do NOT
  add conversion tasks to this scenario's plan.

## Step 5: Preview Breaking Changes

Call `telerik_upgrade_assistant` with `projectPath` (the `.csproj` or `.vbproj`
path) and `targetVersion` (the confirmed target) to size the upgrade before
planning. `fromVersion` is optional — the tool auto-detects it from the project
file and asks the user if detection fails.

Pass the project path visible in the workspace or solution root; do not search
the file system. If the path is wrong the tool elicits the correct one from the
user.

The tool runs the Telerik CLI on the MCP server and analyzes source — it does not
require the target package to be installed first. If it fails with a licensing
  error, the shared license key from pre-initialization is missing or stale;
resolve it with the `telerik-winforms-license-key-setup` skill and re-run. If the Telerik
CLI is missing, install it with `dotnet tool install --global Telerik.CLI`.

Record in the assessment:
- Total finding count
- Findings grouped by file
- Any findings the tool marks as high-risk or manual-only

This count drives task granularity during planning.

## Step 6: Write Assessment

Write `assessment.md` in the workflow folder with:

```markdown
# Telerik WinForms Version Upgrade Assessment

## Solution Summary
- **Solution**: {solution path}
- **WinForms Projects**: {count}
- **Upgrade**: Telerik {from} → {to}
- **Target request**: {explicit version / latest / newest compatible}
- **Target resolution**: {user-specified or independent source, with source}
- **Upgrade status**: ready / no-op requiring user clarification / blocked

## Project Analysis

### {project name}
- **Target Framework**: {tfm} (unchanged by this scenario)
- **Telerik Version**: {version}
- **Reference Style**: NuGet / Assembly
- **Standard MS Controls**: {Yes / No — first match only, not a full inventory}

## Version Compatibility
- **Current Telerik Version**: {version}
- **Target Telerik Version**: {version}
- **Compatible with .NET target**: {Yes/No — details}

## Additive Concerns
- [ ] Delivery method: NuGet / direct assembly references — {details, incl. any retired package id}
- [ ] Application license activation: {Yes/No — details}
- [ ] MS control conversion opportunity: {Yes/No} *(post-completion follow-up)*

## Breaking Changes Preview
- **Total findings**: {count}
- **Files affected**: {count}
- **High-risk findings**: {list or "none"}

| File | Findings |
|------|----------|
| {path} | {count} |

## Risks and Notes
{blockers, high-risk API changes, custom control subclasses of Telerik types,
any special considerations}
```
