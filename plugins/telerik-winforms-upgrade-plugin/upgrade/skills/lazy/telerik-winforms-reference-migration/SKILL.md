---
name: telerik-winforms-reference-migration
description: >
  Edit a WinForms project file to replace direct Telerik UI for WinForms
  assembly references with the resolved NuGet PackageReference set. Prefers
  PackageReference over packages.config, removes superseded assembly
  references, and keeps the Telerik version consistent across added
  packages. Idempotent — safe to re-run on an already-migrated project.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Reference Migration

Edits a project file to move from direct Telerik assembly references to
`PackageReference`. This skill only edits the project — it does not decide
which packages are needed (`telerik-winforms-assembly-mapping`) or whether
the feed can resolve them (`telerik-winforms-nuget-feed-setup`); both must
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

For each package (id + version) resolved by
`telerik-winforms-assembly-mapping`:
- If a `PackageReference` for that exact package id already exists, update
  its `Version` to match instead of adding a duplicate entry
- Otherwise add `<PackageReference Include="{id}" Version="{version}" />`

`telerik_add_package_reference` only documents install instructions for
`Telerik.UI.for.WinForms.AllControls`. For every other package id in the
resolved set, edit the `.csproj`/`.vbproj` directly, or use
`dotnet add package {id} --version {version}`.

The `Version` value is always the plain Telerik release version, e.g.
`2026.3.812` — never a target-framework-suffixed value like
`2026.3.812.Net462` or `2026.3.812.Net48`. Every package is multi-targeted —
one id supports both .NET Framework and modern .NET — so NuGet resolves the
right assets from the project's own `TargetFramework`; nothing
framework-specific belongs in `Version`. For the exact TFMs and which
Telerik version supports which, see the `telerik-winforms-dependency-management`
skill and its version-compatibility reference.

## Step 3: Remove Superseded References

- Delete every `<Reference Include="Telerik...">` (and its `<HintPath>`)
  that detection recorded for this project
- Remove the corresponding Telerik entries from `packages.config` (Step 1)
- Remove Telerik-related assembly binding redirects from
  `app.config`/`web.config`
- Do **not** delete the DLL files themselves unless they are tracked in the
  repository and no other project still references them

## Step 4: Confirm Version Consistency

Every Telerik package added to the project must share the **same**
`Version` value. A mismatch is a defect — surface it rather than silently
picking one version to keep.

## Step 5: Idempotency Check

Re-running this skill on an already-migrated project should be a no-op:
every resolved package is already present with the matching version, and no
`<Reference>` entries remain to remove.

## Step 6: Restore

Run `dotnet restore` (or the IDE equivalent) after edits. Verification and
build happen in `telerik-winforms-migration-verification`.
