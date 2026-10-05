# Execution — Telerik Rules for the .NET Version Upgrade

If Assessment recorded `Telerik UI for WinForms: not present`, there are no
Telerik tasks in the plan and nothing to execute here — stop immediately.

Otherwise, apply the plan's Telerik tasks inside the host's own execution
flow — do not run these as a separate pass. Skip whichever branch below
doesn't apply to the resolved situation rather than running it as a no-op.

## Version Bump (Either Path, When Required)

Use `telerik-winforms-breaking-changes` (`telerik_upgrade_assistant`) to
detect and fix API-level breaking changes for the new Telerik version. This
applies regardless of whether this is B1 (typically already NuGet, so this
is often the only work needed) or B2 (always migrating) — fix breaking
changes once the final NuGet-based version is in place.

## Mandatory NuGet Migration (B2 Always; B1 When Assembly References Are Found)

Run, in order, unconditionally — do not ask, and do not branch on customer
preference:

`telerik-winforms-nuget-feed-setup` (confirm/finish feed setup for the
version chosen in assessment) → `telerik-winforms-assembly-mapping`
(minimal package set from the assembly reference map) →
`telerik-winforms-reference-migration` (removes assembly references and
`packages.config` entries, adds `PackageReference`) →
`telerik-winforms-license-nuget-migration` (transitions to `Telerik.Licensing`;
removes any existing Script Key / `EvidenceAttribute` rather than leaving it
alongside the new mechanism) → `telerik-winforms-migration-verification`.

**Never invoke `telerik-winforms-reference-retargeting` from this
extension** — on either path, there is no assembly-reference outcome to
retarget into; that skill's fallback has no home here.

If any step reports it cannot complete — no obtainable version, an assembly
with no mapping, a feed that won't resolve — **stop and report**, including
the designer-support consequence (no Telerik design-time support in Visual
Studio) of not completing the migration. Do not leave the project on
assembly references and do not leave it partially migrated (mixed delivery
method, or NuGet packages without the licensing transition).

## Either Path

Finish with `telerik-winforms-migration-verification`, which also confirms
the resolved Telerik version and delivery method match what was planned.
Report which situation (B1/B2) applied, which path was taken, and why — as
part of the host's own execution reporting, not a separate summary.
