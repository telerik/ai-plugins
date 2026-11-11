# Execution — Telerik Rules for the .NET Version Upgrade

If Assessment recorded `Telerik UI for WPF: not present`, there are no
Telerik tasks in the plan and nothing to execute here — stop immediately.

Otherwise, apply the plan's Telerik tasks inside the host's own execution
flow — do not run these as a separate pass. Skip whichever branch below
doesn't apply to the resolved situation rather than running it as a no-op.

If a project's flavor is mixed or unknown and the user has not yet decided
which flavor to converge on, do not touch its Telerik references — report
the blocker.

## Version Bump (Either Path, When Required)

Use `telerik-wpf-breaking-changes` (`telerik-upgrade-assistant`) to detect
and fix API-level breaking changes for the new Telerik version. This applies
regardless of whether this is B1 (typically already NuGet, so this is often
the only work needed) or B2 (always migrating) — fix breaking changes once
the final NuGet-based version is in place. For a NoXaml project with copied
theme XAML, refresh it from the new version's `Themes.Implicit` folder per
`telerik-wpf-xaml-flavor` Step 4 — the user supplies the folder.

## Mandatory NuGet Migration (B2 Always; B1 When Assembly References Are Found)

Run, in order, unconditionally — do not ask, and do not branch on customer
preference:

`telerik-wpf-nuget-feed-setup` (confirm/finish feed setup for the version
chosen in assessment) → `telerik-wpf-assembly-mapping` (minimal package set
for the project's flavor and resulting TFM, including the .NET
Framework-only replacements on B2) → `telerik-wpf-reference-migration`
(removes assembly references and `packages.config` entries, adds
`PackageReference`) → `telerik-wpf-license-nuget-migration` (transitions to
`Telerik.Licensing`; removes the Telerik UI for WPF `EvidenceAttribute` line
rather than leaving it alongside the new mechanism) → on B2, for NoXaml
projects with copied theme XAML, replace it from the `Themes.Implicit\NET`
folder the user supplies (`telerik-wpf-xaml-flavor` Step 4) →
`telerik-wpf-migration-verification`.

**Never invoke `telerik-wpf-reference-retargeting` from this extension** —
on either path, there is no assembly-reference outcome to retarget into;
that skill's fallback has no home here.

If any step reports it cannot complete — no obtainable version, an assembly
with no mapping, `Telerik.Windows.Controls.EntityFramework60`, a feed that
won't resolve — **stop and report**, including the Toolbox and
design-time-support consequence (no Telerik Toolbox items or design-time
support in Visual Studio) of not completing the migration. Do not leave the
project on assembly references and do not leave it partially migrated (mixed
delivery method, mixed flavor, or NuGet packages without the licensing
transition).

## Either Path

Finish with `telerik-wpf-migration-verification`, which also confirms the
resolved Telerik version, delivery method, and flavor match what was
planned, and runs the NoXaml theming checks. Report which situation (B1/B2)
applied, which path was taken, and why — plus any open items (copied theme
XAML not yet refreshed, `Telerik.Windows.Documents.Proofing.Dictionaries.En-US`
with no .NET package) — as part of the host's own execution reporting, not a
separate summary.
