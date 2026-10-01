---
name: telerik-winforms-conversion
description: >
  Convert standard Microsoft WinForms controls to Telerik UI for WinForms
  equivalents using the Telerik MCP migration tools. Covers the migration
  playbook, project analysis, the per-class conversion loop
  (Designer.cs then .cs, build, fix), itemsToReview handling, dry-run mechanics,
  and theme setup. Use when converting forms with telerik_convert_file, when a
  conversion produces build errors, or when deciding the order to convert
  WinForms files in.
metadata:
  discovery: lazy
  importance: medium
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Control Conversion

Guide for converting standard Microsoft WinForms controls to their Telerik UI
for WinForms equivalents using the MCP migration tools.

## When to Use

- During the **telerik-control-conversion** scenario — this skill backs
  its planning and execution stages
- After the **telerik-version-upgrade** scenario completes, when the
  user accepts the offer to convert remaining MS controls
- Any WinForms project where the user wants to adopt Telerik controls

**Not for version upgrades.** If the project already uses Telerik and the user
wants a newer Telerik version, use `telerik_upgrade_assistant` instead — see the
telerik-winforms-breaking-changes skill.

## What Each Tool Actually Does

| Tool | Arguments | Returns |
|------|-----------|---------|
| `telerik_get_migration_plan` | none | A **static** playbook — workflow, strategy, critical rules, anti-patterns, file order, skip list, error handling. Not project-specific. |
| `telerik_analyze_project` | `csprojPath` | **`.csproj` facts only** — target framework, project style (SDK/Classic), output type, existing Telerik references, `hasAllControlsPackage`, `windowsFormsEnabled`, `hasPackagesConfig`, recommendations |
| `telerik_add_package_reference` | `csprojPath`, `targetFramework`, `projectStyle` | Install instructions for `Telerik.UI.for.WinForms.AllControls` |
| `telerik_convert_file` | `filePath`, `dryRun` | Roslyn conversion of one file, plus `itemsToReview` |
| `telerik_get_theme_setup` | none | Theme configuration, App.config approach preferred |

**`telerik_analyze_project` does not enumerate controls or forms.** It reads the
project file. Control-level mapping happens per file inside
`telerik_convert_file`, which holds the complete mapping database. Enumerating
which form/user-control files exist is the agent's own job.

**Always pass a `.csproj` path.** Use the one visible in the workspace or
solution root — do not search the file system. If the path is wrong or outside
the workspace boundary, the tool **elicits the correct one from the user**, so a
best-effort path beats omitting the call.

## Prerequisites

- **An active Telerik license** — required for the MCP server itself to run.
  Every `telerik_*` tool call fails without it. See the
  telerik-winforms-license-detection skill.

The analysis tools run on the MCP server and need nothing else — they work on a
project with no Telerik reference at all.

Before **converting** files, additionally ensure:
1. `Telerik.UI.for.WinForms.AllControls` is installed (use the
   telerik-winforms-dependency-management skill if needed), and `dotnet restore`
   has run
2. Application license activation is configured for Q1 2025+ projects: the
  Telerik control NuGet package brings `Telerik.Licensing` transitively, so the
  shared license file is used without an explicit package reference
3. The project builds successfully with current controls
4. The project is committed to source control

## Migration Workflow

> Inside the **telerik-control-conversion** scenario, Steps 1 and 2 run
> during the assessment stage and their output is recorded in `assessment.md`.
> Read it from there instead of re-running them — the playbook's critical rules
> state both run **once per session**.

### Step 1: Get the Migration Plan

Call `telerik_get_migration_plan` (no arguments) to receive the playbook. Its
`criticalRules` and `antiPatterns` are binding for everything that follows.

### Step 2: Analyze the Project

Call `telerik_analyze_project` with the `.csproj` path. Use the result to decide
whether the `AllControls` package is missing (`hasAllControlsPackage`), how to
add it (`projectStyle`, `hasPackagesConfig`), and how to build.

### Step 3: Add References

Call `telerik_add_package_reference` **only** if `hasAllControlsPackage` is
false, then run `dotnet restore`. Never guess package names and never use a
TFM-suffixed variant.

### Step 4: Convert, One Class at a Time

The unit of work is a class pair. For each form or user control:

1. Convert `{Name}.Designer.cs` — control declarations
2. Convert `{Name}.cs` — event handlers
3. Resolve `itemsToReview` from each result: these are properties/events the
   converter removed for lack of a direct Telerik equivalent. Ask
   `telerik_winforms_assistant` whether an alternative exists — **one item at a
   time, never batched in parallel**. Not all will have one.
4. Build and fix **only** errors in the pair you just converted; ignore errors in
   files not yet converted
5. Repeat until the pair is clean, then move to the next class

A `.bak` backup is written beside every modified file.

### Step 5: Full Build

After all classes are converted, run a full build to catch cross-form errors.

### Step 6: Apply Theme

Call `telerik_get_theme_setup` as the final step. Prefer the App.config approach
— it also applies inside the Designer. Merge into an existing Telerik
`appSettings` section rather than replacing it.

## Important Rules

- **Never hand-edit WinForms code to convert it** — always `telerik_convert_file`.
- **Never author manual control mappings** — the converter has the full database.
- **Never rename fields or variables.** Only the type changes:
  `private ToolStripMenuItem fileToolStripMenuItem` becomes
  `private RadMenuItem fileToolStripMenuItem`, field name untouched.
- **Never create stub or wrapper classes** like
  `public class RadButton : Button { }`.
- **Never re-convert a file within the same pass** — once you've called
  `telerik_convert_file` and started fixing its build errors, a second call on
  that file overwrites your fixes; fix build errors in code instead. This does
  **not** mean skip the call in the first place: never substitute manual code
  inspection for calling the tool. Even a file that looks fully converted (e.g.
  a control is already a `RadX` type) may still need the file-level change the
  converter applies (such as the form's own base class). Always call
  `telerik_convert_file` on every enumerated file; its `totalChanges: 0` result
  is the only valid basis for concluding nothing needs to change.
- **Never batch** — don't convert all designer files then all code files. That is
  an explicit anti-pattern; it destroys context and piles up errors.
- **Don't call `telerik_winforms_assistant` for build errors** — it's for
  `itemsToReview` only. Read the compiler message and apply standard C# fixes.
- **Don't use `dryRun`** unless the user asked. If you do, you must apply every
  returned change yourself using `lineNumber`, `originalSourceLine`, and
  `convertedSourceLine` — never report them and stop, and never tell the user to
  re-run with `dryRun=false`.
- **Preserve application logic** — conversion changes control types and
  properties, not business logic or event handler behavior.

## Building

- SDK-style: `dotnet build`
- **Classic-style .NET Framework outside Visual Studio**: use Visual Studio
  MSBuild. The SDK's MSBuild doesn't fully support `PackageReference` in classic
  `.csproj`, so you get CS0246 `The type or namespace name 'Telerik' could not be
  found` even after a successful restore. Find it with `vswhere.exe`
  (`-latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe`)
  and use it for all subsequent builds in that project.

## Limits

Trial Telerik accounts are capped at **20 conversions**. Each class pair costs
two. The tool returns an explicit error when the cap is hit — stop, report
progress, and tell the user a license upgrade is required.
