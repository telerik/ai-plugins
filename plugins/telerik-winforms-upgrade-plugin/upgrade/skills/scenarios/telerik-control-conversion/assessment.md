# Assessment Stage — Telerik WinForms Control Conversion

Fetch the migration playbook, analyze each project file, and enumerate the
form/user-control classes to convert. Write findings to `assessment.md` in the
workflow folder.

## What the MCP Tools Do (and Don't)

| Tool | Returns | Does NOT |
|------|---------|----------|
| `telerik_get_migration_plan` | A **static, project-independent** playbook: workflow, strategy, critical rules, anti-patterns, file order, skip list, error handling | Inspect your project; it takes no arguments |
| `telerik_analyze_project` | Facts read from **the `.csproj`** (+ `packages.config`): target framework, project style (SDK/Classic), output type, existing Telerik references, `hasAllControlsPackage`, `windowsFormsEnabled`, `hasPackagesConfig`, recommendations | Enumerate forms, controls, or Microsoft→Telerik mappings |

Control-level analysis and mapping happen **later**, inside `telerik_convert_file`
(Roslyn-based) during execution. Nothing in the assessment stage knows which
individual controls a form contains, and nothing needs to — the converter has
the complete mapping database.

Consequently:
- Do **not** hand-scan source files for `System.Windows.Forms` control usage.
- Do **not** author a Microsoft→Telerik mapping table.
- Do **not** try to predict per-control conversion outcomes in the assessment.

The agent's own scanning is limited to **file-level enumeration** of form and
user-control classes in Step 3 — no tool provides this, and planning needs it.

## Step 1: Get the Migration Plan

Call `telerik_get_migration_plan` **first**, with no arguments.

Record its output in the assessment, specifically:
- `workflow` — the canonical step order
- `strategy.perClassWorkflow` — the per-class conversion loop
- `criticalRules` and `antiPatterns` — binding constraints on planning and execution
- `errorHandling` — including `classicProjectBuild`

These rules govern the rest of the scenario. Where they conflict with anything
in this plugin's skills, **the migration plan wins**.

## Step 2: Analyze Each Project

For each WinForms project, call `telerik_analyze_project` with `csprojPath`.

**Passing the path is the agent's responsibility.** Use the `.csproj` path
visible in the workspace or solution root — do **not** spend time searching the
file system for it. Always pass a value even if you are unsure it is correct:
the tool resolves what it can and, when the path is wrong or outside the
workspace boundary, **elicits the correct path from the user**. Passing a
best-effort path is strictly better than skipping the call.

Record per project:
- `projectName`, `targetFramework`, `projectStyle` (SDK / Classic), `outputType`
- `existingTelerikReferences`, `hasAllControlsPackage`
- `windowsFormsEnabled`, `hasPackagesConfig`
- `recommendations` — verbatim

Notes:
- `projectStyle: Classic` + `hasPackagesConfig` affects how packages are added
  and how the project must be built — carry both into the plan.
- `windowsFormsEnabled: false` on an SDK-style project is a blocker to resolve
  before converting.
- Call this **once per project, at the start of the session**. The migration
  plan's critical rules forbid re-running it for each form.

## Step 3: Enumerate Forms and User Controls

No MCP tool lists the classes to convert, so the agent does this — at **file
level only**.

For each in-scope project, find every form and user control class, pairing each
one with its designer file:
- `{Name}.Designer.cs` + `{Name}.cs` (or `.vb` equivalents)
- Classes deriving from `Form`, `UserControl`, or an existing base form

Record the **pairs**, not their contents. The conversion unit is one class =
one `.Designer.cs` + `.cs` pair, and that is what planning turns into tasks.

Exclude what the migration plan's `skipFiles` lists — `.resx`, `.resources`,
`.settings`, and non-WinForms code (services, models, utilities).

Do not open these files to count or classify controls. This includes not
noting whether a control "looks already converted" — any such observation
recorded in the assessment biases planning/execution into skipping the
`telerik_convert_file` call for that unit, which is never correct. Enumerate
the pair's existence only; leave conversion-state determination entirely to
the tool.

## Step 4: Determine Required Setup Steps

Drive these from the `telerik_analyze_project` output, not from your own reading
of the `.csproj`. Honor any prerequisite the migration plan stated in Step 1.

### Telerik Package Installation
- **Trigger**: `hasAllControlsPackage` is `false`
- **Action**: add a task to call `telerik_add_package_reference`, followed by
  `dotnet restore`
- Always the unified `Telerik.UI.for.WinForms.AllControls` package — never a
  TFM-suffixed variant (`.Net462`, `.Net48`, `.Net80`, `.Net90`), which the
  migration plan lists as an anti-pattern
- If `hasAllControlsPackage` is `true`, **do not** plan this task — the critical
  rules forbid calling the tool when the package is already present

### Assembly → NuGet Migration
- **Trigger**: `existingTelerikReferences` contains `Telerik.WinControls*`
  assembly references while `hasAllControlsPackage` is `false`
- **Action**: add a task to replace the assembly references with the
  `AllControls` package before converting

### Application License Activation
- **Trigger**: the Telerik version being installed or already referenced is
  Q1 2025 or later (2025.1.x+) and the project has no runtime license
  configuration
- **Action**: verify `Telerik.UI.for.WinForms.AllControls` is restored. It brings
  `Telerik.Licensing` transitively, so no explicit package reference is needed;
  the shared license file verified during pre-initialization also activates the
  application build

### Theme Setup
- **Trigger**: always, as the final step after all forms are converted
- **Action**: add a theme task using `telerik_get_theme_setup`

### Build Method
- **Trigger**: `projectStyle: Classic` on a .NET Framework project, when working
  outside Visual Studio
- **Action**: record that builds must use **Visual Studio MSBuild**, not
  `dotnet build` — see the migration plan's `errorHandling.classicProjectBuild`.
  `dotnet build` produces misleading CS0246 "namespace Telerik not found" errors
  on these projects even after a successful restore.

## Step 5: Version Compatibility Check

When Telerik must be installed, verify the chosen version supports the
`targetFramework` reported by `telerik_analyze_project`:

| .NET Target | Minimum Telerik Version |
|-------------|------------------------|
| .NET 8 | 2024 Q2 (2024.2.x) |
| .NET 9 / .NET 10 | 2024 Q4 (2024.4.x) |
| .NET Framework 4.6.2+ | 2024 Q2 (2024.2.x) |
| .NET Framework 4.8+ | R3 2022 (2022.3.x) |
| .NET Framework 4.0 | up to R1 2024 (distribution ended) |

If the requested version does not support the project's .NET target, flag it as
a blocker and suggest a compatible version.

## Step 6: Write Assessment

Write `assessment.md` in the workflow folder:

```markdown
# Telerik WinForms Control Conversion Assessment

## Solution Summary
- **Solution**: {solution path}
- **WinForms Projects**: {count}
- **Starting State**: Greenfield adoption / Incremental conversion

## Migration Playbook (`telerik_get_migration_plan`)
- **Workflow**: {ordered steps from the tool}
- **Per-class loop**: {strategy.perClassWorkflow}
- **Critical rules**: {criticalRules, verbatim}
- **Anti-patterns**: {antiPatterns, verbatim}
- **Skip files**: {skipFiles}
- **Error handling**: {errorHandling, including classicProjectBuild}

## Project Analysis (`telerik_analyze_project`)

### {projectName}
- **Target Framework**: {targetFramework}
- **Project Style**: SDK / Classic
- **Output Type**: {outputType}
- **Existing Telerik References**: {list or "none"}
- **Has AllControls Package**: {true/false}
- **WindowsForms Enabled**: {true/false}
- **Has packages.config**: {true/false}
- **Recommendations**: {verbatim from the tool}
- **Build method**: `dotnet build` / Visual Studio MSBuild (Classic + outside VS)

## Conversion Units (form / user-control class pairs)

### {projectName}
| Class | Designer file | Code file |
|-------|---------------|-----------|
| {Form1} | {Form1.Designer.cs} | {Form1.cs} |

**Total conversion units**: {count}

> Per-control detail is intentionally absent — `telerik_convert_file` performs
> the control mapping during execution.

## Required Setup Steps
- [ ] Install `Telerik.UI.for.WinForms.AllControls`: {Yes/No — from hasAllControlsPackage}
- [ ] Assembly → NuGet migration: {Yes/No — details}
- [ ] Application license activation: {Yes/No — details}
- [ ] Theme setup: {Yes/No — details}

## Version Compatibility
- **Telerik Version**: {version}
- **Compatible with .NET target**: {Yes/No}

## Risks and Notes
- **Trial conversion limit**: {count} units vs. 20-conversion trial cap — {risk or "n/a"}
- {blockers such as windowsFormsEnabled=false, Classic build issues, other notes}
```
