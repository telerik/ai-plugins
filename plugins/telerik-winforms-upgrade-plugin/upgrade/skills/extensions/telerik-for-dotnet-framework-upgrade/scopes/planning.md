# Planning — Telerik Rules for .NET Framework Version Upgrade

If Assessment recorded `Telerik UI for WinForms: not present`, contribute
nothing here — stop immediately. Do not re-inspect the project; rely on the
Assessment record.

Otherwise, contribute the NuGet decision as an upgrade option; do not decide
it, and do not add it to the plan silently.

## Upgrade Option

**Telerik UI for WinForms reference style** — choose `NuGet` or `Keep assembly
references` (default: recommend `NuGet`, but either is a supported outcome).

Recommend NuGet and say concretely why: simpler restore and version
management, simpler licensing (`Telerik.Licensing` arrives transitively with
the control packages), and no DLLs to track on disk or in source control.
Then let the customer choose — do not re-prompt or partially convert once
they've answered.

**Plan impact**:
- `NuGet` adds: feed setup, assembly → package mapping, `PackageReference`
  edits (+ `packages.config` removal if present), and the NuGet licensing
  path — via `telerik-winforms-nuget-feed-setup`, `telerik-winforms-assembly-mapping`,
  `telerik-winforms-reference-migration`, `telerik-winforms-license-key-setup`
  (or `telerik-winforms-license-nuget-migration` if a Script Key already
  existed).
- `Keep assembly references` adds nothing when the current version already
  supports net481. If a version bump is required (Step 2 of assessment), it
  adds one task: retarget the assembly references to the new version via
  `telerik-winforms-reference-retargeting` — see Execution.

## Ordering

- A required Telerik version bump can be planned independently of the host's
  TFM tasks — net4xx → net481 does not require Telerik to move first or
  last, just before final verification.
- Never add a task for a Telerik version bump that Step 2 of assessment
  didn't actually flag as required.
