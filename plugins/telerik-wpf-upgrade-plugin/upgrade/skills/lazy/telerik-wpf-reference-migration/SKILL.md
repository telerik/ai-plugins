---
name: telerik-wpf-reference-migration
description: >
  Edit a WPF project file to replace direct Telerik UI for WPF assembly
  references with the resolved NuGet PackageReference set for the project's
  assembly flavor (Xaml or NoXaml). Prefers PackageReference over
  packages.config, removes superseded assembly references, and keeps the
  Telerik UI version consistent across added packages. Idempotent — safe to
  re-run on an already-migrated project.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Reference Migration

Edits a project file to move from direct Telerik assembly references to
`PackageReference`. This skill only edits the project — it does not decide
which packages are needed (`telerik-wpf-assembly-mapping`) or whether
the feed can resolve them (`telerik-wpf-nuget-feed-setup`); both must
already be confirmed before this runs.

## Step 1: Prefer PackageReference

`PackageReference` is always preferred over `packages.config` for the
Telerik packages being added:
- If `packages.config` lists Telerik entries, remove them from
  `packages.config` and add the same packages as `PackageReference` in the
  project file instead.
- If `packages.config` also manages unrelated, non-Telerik packages, leave
  those as they are — converting the whole project between styles is out of
  scope for this Telerik-focused migration unless the user asks for it.

## Step 2: Add the Resolved Packages

The resolved set must match the project's flavor recorded by
`telerik-wpf-xaml-flavor`: `*.for.Wpf.Xaml` ids for Xaml,
`*.for.Wpf` ids plus `Telerik.Windows.Themes.<Theme>.for.Wpf` theme packages
for NoXaml. If the set contains an id of the other flavor, or the flavor is
mixed or unknown, stop and report it — never switch the flavor here.

For each package (id + version) resolved by
`telerik-wpf-assembly-mapping`:
- If a `PackageReference` for that exact package id already exists, update
  its `Version` to match instead of adding a duplicate entry
- Otherwise add `<PackageReference Include="{id}" Version="{version}" />`

Edit the `.csproj`/`.vbproj` directly for each package id in the resolved
set, or use `dotnet add package {id} --version {version}`.

Every `Telerik.Windows.Themes.<Theme>.dll` reference (NoXaml) is replaced by
its `Telerik.Windows.Themes.<Theme>.for.Wpf` package — keep one theme package
per theme assembly that was referenced.

The `Version` value is always the plain Telerik release version, e.g.
`2026.3.1007` — never a target-framework-suffixed value. Every package is
multi-targeted — one id supports both .NET Framework and modern .NET — so
NuGet resolves the right assets from the project's own `TargetFramework`;
nothing framework-specific belongs in `Version`. For the exact TFMs and which
Telerik version supports which, see the `telerik-wpf-dependency-management`
skill and its version-compatibility reference.

## Step 3: Remove Superseded References

- Delete every `<Reference Include="Telerik...">` (and its `<HintPath>`)
  that detection recorded for this project, including theme assembly
  references
- Remove the corresponding Telerik entries from `packages.config` (Step 1)
- Remove Telerik-related assembly binding redirects from `app.config`
- When the target version is Q2 2026 or later, remove references and
  copied items for Telerik localization satellite assemblies, and any
  retired per-language `Telerik.Windows.Controls.for.Wpf.<lang>` packages —
  localization is bundled in `Telerik.Windows.Controls.for.Wpf[.Xaml]`
- Do **not** delete the DLL files themselves unless they are tracked in the
  repository and no other project still references them

## Step 4: Confirm Version Consistency

Every Telerik UI package added to the project (`*.for.Wpf`,
`*.for.Wpf.Xaml`, theme packages, `AllControls.*`) must share the **same**
`Version` value. Flavor-neutral packages (`Telerik.Windows.Documents.*`,
`Telerik.Windows.Zip*`, `Telerik.Documents.AI.*`) are the exception: they use
the version the UI packages depend on, which can differ (e.g. `2026.3.1006`
for UI `2026.3.1007`). A mismatch among UI packages is a defect — surface it
rather than silently picking one version to keep.

## Step 5: Idempotency Check

Re-running this skill on an already-migrated project should be a no-op:
every resolved package is already present with the matching version, and no
`<Reference>` entries remain to remove.

## Step 6: Restore

Run `dotnet restore` (or the IDE equivalent) after edits. Verification,
build, and the NoXaml theming checks (`telerik-wpf-xaml-flavor` Step 4)
happen in `telerik-wpf-migration-verification`.
