# Execution — Telerik Rules for .NET Framework Version Upgrade

If Assessment recorded `Telerik UI for WPF: not present`, there is no
Planning upgrade option and nothing to execute here — stop immediately.

If a project's flavor is mixed or unknown and the user has not yet decided
which flavor to converge on, do not touch its Telerik references — report
the blocker.

Otherwise, apply whichever path the Planning upgrade option resolved to.
Neither path changes the Xaml/NoXaml flavor.

## Path 1: Customer Accepted NuGet

Run, in order: `telerik-wpf-nuget-feed-setup` →
`telerik-wpf-assembly-mapping` (project's flavor, `net462` column) →
`telerik-wpf-reference-migration` (this also handles `packages.config` →
`PackageReference`) → `telerik-wpf-license-key-setup` (or
`telerik-wpf-license-nuget-migration` if a Script Key already existed) for
the transitive `Telerik.Licensing` dependency, if the resolved version is
Q1 2025+ → `telerik-wpf-migration-verification`.

## Path 2: Customer Kept Assembly References

- **No version bump required**: nothing to do. Leave every reference
  untouched.
- **Version bump required**: delegate to `telerik-wpf-reference-retargeting`
  with the confirmed target version. It asks the customer where the new
  version's DLLs are located (never guessing the path or assuming a default
  install location), validates that the supplied folder matches the
  project's flavor (`Binaries` or `Binaries.NoXaml`) and .NET Framework
  build, and repoints every Telerik `<Reference>`/`HintPath` entry to it —
  including theme assemblies, with no mix of old- and new-version paths. If
  this bump crosses the Q1 2025 licensing boundary, use
  `telerik-wpf-license-key-setup` afterward — NuGet was declined for the
  controls, so `Telerik.Licensing` has no transitive path here: follow that
  skill's method choice (an explicit `Telerik.Licensing` package, or the
  Script Key path when the project cannot use NuGet at all).

## Either Path

For a NoXaml project whose version changed and that merges copied theme
XAML, refresh it from the new version's `Themes.Implicit` folder the user
supplies (`telerik-wpf-xaml-flavor` Step 4); if the user defers, report it
as an open item. Finish with `telerik-wpf-migration-verification` to confirm
a clean restore/build and the NoXaml theming checks, then report which path
was taken and why.
