# Execution — Telerik Rules for .NET Framework Version Upgrade

If Assessment recorded `Telerik UI for WinForms: not present`, there is no
Planning upgrade option and nothing to execute here — stop immediately.

Otherwise, apply whichever path the Planning upgrade option resolved to.

## Path 1: Customer Accepted NuGet

Run, in order: `telerik-winforms-nuget-feed-setup` →
`telerik-winforms-assembly-mapping` → `telerik-winforms-reference-migration`
(this also handles `packages.config` → `PackageReference`) →
`telerik-winforms-license-key-setup` (or `telerik-winforms-license-nuget-migration`
if a Script Key already existed) for the transitive `Telerik.Licensing`
dependency, if the resolved version is Q1 2025+ →
`telerik-winforms-migration-verification`.

## Path 2: Customer Kept Assembly References

- **No version bump required**: nothing to do. Leave every reference
  untouched.
- **Version bump required**: delegate to `telerik-winforms-reference-retargeting`
  with the confirmed target version. It asks the customer where the new
  version's DLLs are located (never guessing the path or assuming a default
  install location), validates the supplied path, and repoints every
  Telerik `<Reference>`/`HintPath` entry to it — no mix of old- and
  new-version paths. If this bump crosses the Q1 2025 licensing boundary,
  use `telerik-winforms-license-key-setup`'s Script Key guidance afterward —
  NuGet was declined, so `Telerik.Licensing` has no transitive path here.

## Either Path

Finish with `telerik-winforms-migration-verification` to confirm a clean
restore/build, then report which path was taken and why.
