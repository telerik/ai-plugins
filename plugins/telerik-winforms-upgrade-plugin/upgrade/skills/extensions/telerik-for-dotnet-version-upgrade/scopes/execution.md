# Execution — Telerik Rules for the .NET Version Upgrade

If Assessment recorded `Telerik UI for WinForms: not present`, there are no
Telerik tasks in the plan and nothing to execute here — stop immediately.

Otherwise, apply the plan's Telerik tasks inside the host's own execution
flow — do not run these as a separate pass. Skip whichever branch below
doesn't apply to the resolved situation rather than running it as a no-op.

## Version Bump (Either Path, When Required)

Use `telerik-winforms-breaking-changes` (`telerik_upgrade_assistant`) to
detect and fix API-level breaking changes for the new Telerik version. This
applies whether the project stays on assembly references (B1, declined) or
moves to NuGet (B1 accepted, or B2 always).

## B1 — NuGet Path (Only If Offered and Accepted)

Run, in order: `telerik-winforms-nuget-feed-setup` →
`telerik-winforms-assembly-mapping` → `telerik-winforms-reference-migration`
(handles `packages.config` → `PackageReference` too) →
`telerik-winforms-license-key-setup` (or `telerik-winforms-license-nuget-migration`
if a Script Key already existed) for the transitive `Telerik.Licensing`,
Q1 2025+ → `telerik-winforms-migration-verification`.

## B1 — Declined-NuGet Path (Explicit Customer Choice, B1 Only)

Delegate to `telerik-winforms-reference-retargeting` with the confirmed
target version. It asks the customer where the new version's DLLs are
located (never guessing the path), validates the supplied path (DLLs exist,
expected Telerik version, correct framework-specific build), and repoints
every Telerik `<Reference>`/`HintPath` entry to it. Afterward, set up Script
Key licensing via `telerik-winforms-license-key-setup` if the bump crosses
the Q1 2025 boundary — `Telerik.Licensing` has no transitive path without
the NuGet package.

**This path does not exist on B2.** Never invoke
`telerik-winforms-reference-retargeting` when the resolved situation is B2 —
there is no assembly-reference outcome to retarget into.

## B2 — Mandatory NuGet Migration (No Consent Gate)

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
