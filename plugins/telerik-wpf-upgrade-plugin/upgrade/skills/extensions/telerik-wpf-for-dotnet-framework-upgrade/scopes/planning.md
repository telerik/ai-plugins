# Planning — Telerik Rules for .NET Framework Version Upgrade

If Assessment recorded `Telerik UI for WPF: not present`, contribute
nothing here — stop immediately. Do not re-inspect the project; rely on the
Assessment record.

If Assessment recorded a **mixed or unknown flavor**, report the blocker
with every conflicting reference and ask the user which flavor to converge
on before adding any Telerik task for the affected projects. Do not choose
one.

Otherwise, contribute the NuGet decision as an upgrade option; do not decide
it, and do not add it to the plan silently.

## Upgrade Option

**Telerik UI for WPF reference style** — choose `NuGet` or `Keep assembly
references` (default: recommend `NuGet`, but either is a supported outcome).

Recommend NuGet once and say concretely why: simpler restore and version
management, simpler licensing (`Telerik.Licensing` arrives transitively with
the control packages), and no DLLs to track on disk or in source control.
Then let the customer choose — do not re-prompt or partially migrate once
they've answered. Do not present moving to modern .NET as a reason or an
option; this upgrade stays on .NET Framework.

Either choice keeps the project's flavor: NuGet packages of the same flavor
(Xaml `*.for.Wpf.Xaml`, NoXaml `*.for.Wpf` plus theme packages), or
assembly references from the same `Binaries` / `Binaries.NoXaml` folder.

**Plan impact**:
- `NuGet` adds: feed setup, assembly → package mapping for the project's
  flavor and the `net462` package group, `PackageReference` edits
  (+ `packages.config` removal if present), and the NuGet licensing path —
  via `telerik-wpf-nuget-feed-setup`, `telerik-wpf-assembly-mapping`,
  `telerik-wpf-reference-migration`, `telerik-wpf-license-key-setup`
  (or `telerik-wpf-license-nuget-migration` if a Script Key already
  existed).
- `Keep assembly references` adds nothing when the current version already
  supports net481. If a version bump is required (Step 2 of assessment), it
  adds one task: retarget the assembly references to the new version via
  `telerik-wpf-reference-retargeting`, using the folder of the project's
  flavor and .NET Framework build — see Execution.
- A version bump on a NoXaml project that merges copied theme XAML also
  adds the refresh of that XAML from the new version's `Themes.Implicit`
  folder, supplied by the user (`telerik-wpf-xaml-flavor` Step 4), on
  either path.

## Ordering

- A required Telerik version bump can be planned independently of the host's
  TFM tasks — net4xx → net481 does not require Telerik to move first or
  last, just before final verification.
- Never add a task for a Telerik version bump that Step 2 of assessment
  didn't actually flag as required.
