---
name: telerik-winforms-assembly-mapping
description: >
  Map direct Telerik UI for WinForms assembly references to the NuGet
  packages that own them, using dependency-aware minimal package selection.
  Reports any assembly with no known mapping instead of guessing a package
  name.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Assembly-to-Package Mapping

Resolve the minimal set of Telerik NuGet packages that replace a project's
direct assembly references. The reference tables this skill uses are in
[ref/assembly-reference-map.md](ref/assembly-reference-map.md) — consult it,
this file only describes the process.

## Step 1: Look Up Each Assembly

For each Telerik assembly reference found by
`telerik-winforms-reference-detection`, look up its owning package in the
**Assembly Reference → NuGet Package** table in the reference file.

If an assembly has **no entry** in that table, report it explicitly as
unmapped. Do not guess a package name and do not silently fall back to
`AllControls`. Ask the user how to proceed — for example, confirm it's a
third-party or custom assembly that isn't part of the suite, or accept
`AllControls` as an intentional catch-all for that project.

## Step 2: Apply Dependency-Aware Minimal Selection

Using the **Nuspec Package Dependencies** table, drop any package from the
selection that is already a dependency of another package already selected —
for example, do not add `Telerik.UI.for.WinForms.Common` explicitly alongside
`Telerik.UI.for.WinForms.GridView`, since `GridView` depends on `Common` and
NuGet installs it automatically. See the **Dependency-Aware Package
Selection** section of the reference file for the algorithm and examples.

**Common mistake to avoid**: `PivotGrid` depends on `ChartView` (and both
depend on `Common`). If the requested assemblies map to `PivotGrid`, do not
also add `Telerik.UI.for.WinForms.ChartView` explicitly — NuGet installs it
automatically as `PivotGrid`'s dependency. Only add `ChartView` explicitly
when a chart is used **independently** of `PivotGrid` (i.e. its own
assembly, `Telerik.WinControls.ChartView.dll`, is referenced by code that
does not also require `PivotGrid`). The same rule applies to every other
dependency edge in the table — always check whether a candidate package is
already pulled in by another package already selected before adding it.

## Step 3: Resolve Package Naming for the Version

Package IDs depend on the Telerik version being targeted (the version stays
the same as detected — this scenario does not change it):
- **Version `2026.3.812` or later**: use the `Telerik.UI.for.WinForms.*` ids
  as listed in the mapping.
- **Version before `2026.3.812`**: drop the `Telerik.` prefix from every
  package id **except** `Telerik.UI.for.WinForms.AllControls`, which keeps
  its prefix at every version.

Each package is multi-targeted — one id supports both .NET Framework and
modern .NET — so the `Version` attribute is always the plain release
version. Never append a target-framework suffix like `.Net462` or `.462` to the
version. For the exact TFMs and which Telerik version supports which, see
the `telerik-winforms-dependency-management` skill and its
version-compatibility reference.

## Step 4: Keep the Version Consistent

Every package added to a project must use the **same** Telerik version — the
one already detected for that project. This scenario does not change
versions; a version mismatch across packages is a defect to flag, not
something to resolve by picking one.

## Step 5: Output

Produce, per project:
- The minimal package list (id + version)
- Any unmapped assemblies, to surface as a blocker in planning

Project file edits happen in `telerik-winforms-reference-migration` — this
skill only produces the mapping.
