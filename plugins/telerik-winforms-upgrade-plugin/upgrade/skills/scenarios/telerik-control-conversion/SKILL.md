---
name: telerik-control-conversion
description: >
  Convert standard Microsoft WinForms controls (Button, DataGridView, TreeView,
  ListView, ComboBox, and others) to Telerik UI for WinForms equivalents —
  install the AllControls NuGet package, set up licensing, convert forms with
  the Telerik MCP migration tools, and apply a theme. Use to adopt Telerik UI
  for WinForms, or as a follow-up after telerik-version-upgrade or
  dotnet-version-upgrade.
requires-extension: telerik-winforms-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 8500
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  scenarioTraitsSet: [.NET, WinForms, WindowsForms, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-version-upgrade
    suggest-actions:
      - generate-report
---

# Telerik WinForms Control Conversion Scenario

Convert standard Microsoft WinForms controls to Telerik UI for WinForms
equivalents, including package installation, licensing setup, form-by-form
conversion, and theme application.

**Goal**: Adopt Telerik UI for WinForms controls in a WinForms application that
currently uses standard Microsoft controls.

**Also triggered by**: "convert WinForms controls to Telerik", "migrate to
Telerik", "replace Microsoft controls with Telerik controls", "add Telerik to
my WinForms app".

**Not this scenario**: if the project already uses Telerik and the user wants
a newer Telerik version, use `telerik-version-upgrade` instead (run it first
if the user needs both); for reference-style changes only, use
`telerik-assembly-to-nuget`; for license setup alone, use `telerik-licensing`.

## Starting States

The scenario handles both entry states — assessment detects which applies:

| State | Condition | Effect on the plan |
|-------|-----------|--------------------|
| **Greenfield adoption** | No Telerik references in the project | Install the Telerik NuGet package and set up licensing before converting |
| **Incremental conversion** | Telerik already referenced (e.g. after a version upgrade, or a partially converted app) | Skip install/licensing; convert the remaining Microsoft controls only |

## MCP Server

This scenario uses the **Telerik.WinForms.MCP** NuGet package which provides:

| Tool | Arguments | What it actually does |
|------|-----------|----------------------|
| `telerik_get_migration_plan` | none | Returns a **static** playbook: workflow, strategy, critical rules, anti-patterns, file order, skip list, error handling. Call first. |
| `telerik_analyze_project` | `csprojPath` | Reads **the `.csproj`** (+ `packages.config`): target framework, project style, output type, existing Telerik references, `hasAllControlsPackage`, `windowsFormsEnabled`, `hasPackagesConfig`, recommendations |
| `telerik_add_package_reference` | `csprojPath`, `targetFramework`, `projectStyle` | Returns install instructions for `Telerik.UI.for.WinForms.AllControls`. Only when the package is missing. |
| `telerik_convert_file` | `filePath`, `dryRun` | Roslyn-based conversion of one `.cs`/`.vb` file. **This is where control mapping happens.** Returns `itemsToReview`. |
| `telerik_get_theme_setup` | none | Returns theme configuration (App.config preferred). Final step only. |
| `telerik_winforms_assistant` | — | Component API questions, and resolving `itemsToReview` entries one at a time |

Two things to keep straight:

- **`telerik_analyze_project` does not enumerate controls or forms.** It analyzes
  the project file only. Per-control mapping happens later, per file, inside
  `telerik_convert_file`. Enumerating the form/user-control *files* is the
  agent's job during assessment.
- **Always pass `csprojPath`.** Use the path visible in the workspace or solution
  root — do not search the file system. If it is wrong or outside the workspace
  boundary, the tool **elicits the correct path from the user**, so a best-effort
  path is always better than omitting the call.

These tools run **on the MCP server** and require an active Telerik license (see
Pre-Initialization). They do not require `Telerik.UI.for.WinForms.AllControls`
to be referenced — analysis works on a project with no Telerik at all.

## Workflow Stages

Run these stages in order:

0. **Pre-Initialization** — Verify the Telerik license, gather project info, confirm parameters, set up source control and workflow folder.
1. **Assessment** — Fetch the migration playbook, run `telerik_analyze_project` per project, and enumerate form/user-control file pairs. Creates `assessment.md`.
2. **Planning** — Turn the playbook and conversion units into tasks, one per class pair. Creates `plan.md`.
3. **Execution** — Convert each `.Designer.cs` + `.cs` pair with `telerik_convert_file`, building and fixing after each. Creates `tasks/*/task.md`.
4. **Post-Completion** — Report conversion results and suggest follow-ups.

## Pre-Initialization

### Step 0: Verify the Telerik License (blocking prerequisite)

The `Telerik.WinForms.MCP` server requires an active Telerik license to operate.
Without it **no `telerik_*` tool call works**, so this must be settled before
anything else — including the assessment's migration analysis. This check
applies **regardless of whether the project references Telerik yet** —
greenfield conversion needs the MCP server just as much as any other path.

Load `telerik-winforms-license-detection` and run its **Step 0** (MCP server
prerequisite check) — do not re-implement the path/existence check here, and
do not skip it because the project has no Telerik reference. That skill
resolves the environment variable correctly per shell and avoids the false
negatives a naive literal `%AppData%` check produces in PowerShell.

If it reports the license missing: don't just point the user to their
account and wait — offer to walk them through it right now via
`telerik-winforms-license-key-setup`, then re-run the Step 0 check before
proceeding. If the user declines or can't complete it immediately, stop and
direct them to
<https://www.telerik.com/account/your-licenses/license-keys> (a
[free trial](https://www.telerik.com/try/ui-for-winforms) also issues a valid
key), then resume once they confirm.

This shared key activates the MCP server and, for Q1 2025+ projects using
Telerik NuGet packages, the application through the package's transitive
`Telerik.Licensing` dependency.
The conversion workflow always installs Telerik through NuGet and uses this
license-file path; it never suggests script-key activation.

### Tools to Call

**Step 1**: Identify the solution and WinForms projects:
- Call `get_solution_path()` to find the solution file
- Scan `.csproj` files for `<UseWindowsForms>true</UseWindowsForms>` or WinForms assembly references

**Step 2**: Gather project parameters:
- Detect current .NET version (`<TargetFramework>` in each `.csproj`)
- Detect Telerik presence (scan for `Telerik.WinControls`, `Telerik.UI.for.WinForms`, or `Telerik.` assembly references)
- If Telerik is **not** present, determine the Telerik version to install — suggest the latest version compatible with the project's .NET target
- If Telerik **is** present, reuse the referenced version; do not change it in this scenario

**Step 3**: Assemble `confirmFields` for the combined confirmation:
- **Telerik Version to Install**: suggested or user-specified *(only when Telerik is absent)*
- **Conversion Scope**: all forms, or a user-selected subset
- **Flow Mode**: Automatic or Guided
- Source control parameters (git only): working branch, commit strategy

## Stage Instructions

**IMPORTANT**: Load each stage's instructions file **only when entering that stage**.

### Stage 1: Assessment

**When entering this stage, load**: [assessment.md](assessment.md)

Fetches the migration playbook, analyzes each `.csproj` with
`telerik_analyze_project`, and enumerates the form/user-control file pairs to
convert. Produces `assessment.md` in the workflow folder.

### Stage 2: Planning

**When entering this stage, load**: [planning.md](planning.md)

Derives the task list from the assessment — the playbook's workflow gives the
structure, the conversion units give one task per class pair. Produces `plan.md`
in the workflow folder.

### Stage 3: Execution

**When entering this stage, load**: [execution.md](execution.md)

Converts each `.Designer.cs` + `.cs` pair with `telerik_convert_file`, resolves
`itemsToReview` entries, and builds and fixes after every pair.

### Stage 4: Post-Completion

**When entering this stage, load**: [post-completion.md](post-completion.md)

Summarizes conversion results, reports any skipped forms, and suggests
follow-ups.

## Success Criteria

- [ ] Application license activation is configured when the installed version is Q1 2025 or later
- [ ] Every in-scope class pair converted; each builds and opens in the Designer
- [ ] `itemsToReview` entries resolved or explicitly recorded as having no alternative
- [ ] A Telerik theme is applied consistently across converted forms
- [ ] Application logic and event handler behavior is unchanged

## Notes

- Tool names above are the bare names exposed by the `telerik-winforms-upgrade-plugin`
  MCP; every host resolves them.
- `telerik_convert_file` owns control mapping. Do NOT author your own
  Microsoft→Telerik mapping table, and never hand-edit WinForms code to perform
  a conversion.
- Convert one class pair at a time — `.Designer.cs` first, then `.cs`, then build
  and fix. Converting all designer files before all code files is an explicit
  anti-pattern.
- Do NOT try to load or decompile Telerik DLLs to extract API information.
  Use `telerik_winforms_assistant` for component API questions instead.
- Always install Telerik through the `Telerik.UI.for.WinForms.AllControls`
  NuGet package — never a TFM-suffixed variant, never direct assembly
  references.
- If the project already uses Telerik and the user wants a newer Telerik
  version, this is the wrong scenario — use `telerik-version-upgrade`.
