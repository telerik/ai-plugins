# Execution Stage — Telerik WinForms Control Conversion

Execute the conversion tasks using `telerik_convert_file`, one class pair at a
time, building and fixing errors after each pair.

## General Execution Rules

These come from the migration playbook's `criticalRules` recorded in the
assessment. They are binding.

1. **Load related skills** before starting each task — check the
   `<task_related_skills>` block from `start_task` and load the relevant
   skill SKILL.md files.
2. **ALWAYS use `telerik_convert_file` for any `.cs` / `.vb` WinForms change.**
   Never hand-edit WinForms code to perform a conversion.
3. **Never attempt manual control mappings.** The converter holds the complete
   mapping database. Do not guess Telerik type names.
4. **Never rename fields or variables.** Only the type changes —
   `private ToolStripMenuItem fileToolStripMenuItem` becomes
   `private RadMenuItem fileToolStripMenuItem`. Apply converter output exactly.
5. **Never create stub or wrapper classes** such as
   `public class RadButton : Button { }`.
6. **One class pair at a time.** Convert, build, fix, then move on.
7. **Always call `telerik_convert_file` on every conversion unit — never
   decide from manual code inspection that a file is "already converted" and
   skip the call.** The tool's own response (`totalChanges: 0` means nothing to
   do) is the only valid signal that a file needs no changes. What "never
   re-convert" actually forbids is calling `telerik_convert_file` a **second**
   time on the same file **after** you already applied its output and started
   fixing build errors in that pass — a second call at that point overwrites
   your fixes. It does not mean skip the first call.
8. **Use** `telerik_winforms_assistant` for
   component API questions.

Do **not** call `telerik_get_migration_plan` or `telerik_analyze_project` during
execution — they ran once during assessment, and the playbook forbids re-running
them per form. Read their output from `assessment.md`.

## Task-Specific Execution Guidance

### Package and Reference Tasks

- Call `telerik_add_package_reference` **only** when the assessment recorded
  `hasAllControlsPackage: false`. It returns installation instructions based on
  target framework and project style — apply them.
- Never guess package names, and never add a TFM suffix
  (`.Net462`, `.Net48`, `.Net80`, `.Net90`). Always
  `Telerik.UI.for.WinForms.AllControls`.
- Run `dotnet restore` after the package is added.
- Remove old assembly `<Reference>` entries with `<HintPath>` pointing to
  Telerik DLLs.
- Build and verify all Telerik references resolve before converting anything.

### Application License Activation Tasks

These tasks use the shared key already verified for the MCP server.

- Restore the project after adding `Telerik.UI.for.WinForms.AllControls`; it
  brings `Telerik.Licensing` transitively. Do not add an explicit
  `Telerik.Licensing` reference. The shared `telerik-license.txt` verified
  during pre-initialization also activates the application.
- The agent must NOT handle, store, or display license keys — instruct the user
  to download theirs from the Telerik account portal.

### Class Conversion Tasks

Each task converts one class pair. Follow the playbook's `perClassWorkflow`:

1. **Convert `{Name}.Designer.cs` first** with `telerik_convert_file` — it holds
   the control declarations.
2. **Convert `{Name}.cs` immediately after** — it holds the event handlers.
3. **Review the `itemsToReview` array** in each conversion result. These are
   properties and events the converter removed because they have no direct
   Telerik equivalent. The `telerik_winforms_assistant` can help determining
   if an alternative exists and how to apply it.
   - **One item at a time.** Do NOT batch these calls in parallel.
   - Not every item will have an alternative; record the ones that don't.
4. **Build** and check for errors, using the build method recorded in the plan.
5. **Fix ONLY errors in the files you just converted.** Ignore errors in files
   not yet converted — they resolve when those files are converted.
6. **Repeat build-and-fix** until the converted pair is error-free.
7. Only then move to the next class pair.

The tool writes a `.bak` backup beside every file it modifies, so a bad
conversion is recoverable.

**`dryRun`**: leave it `false` unless the user explicitly asked for a dry run.
If you do run with `dryRun: true`, the response lists changes without touching
the file — you must then apply every change yourself using the returned
`lineNumber`, `originalSourceLine`, and `convertedSourceLine`, replacing each
original line with its converted form. Apply all changes first, then build and
fix. Never report the changes and stop, and never tell the user to "re-run with
dryRun=false".

### Theme Task

- Call `telerik_get_theme_setup` only after **all** forms are converted.
- Prefer the **App.config** approach it returns — it is the recommended method
  and lets the theme apply inside the Designer too. Merge the Telerik
  `appSettings` section carefully if one already exists.
- Use the `Program.cs` code approach only if App.config cannot be modified.
- Do not change the theme or background if the user asked to preserve the
  default appearance.

## Building

- **SDK-style projects**: `dotnet build`.
- **Classic-style .NET Framework projects built outside Visual Studio**: use
  **Visual Studio MSBuild**. The .NET SDK's MSBuild does not fully support
  `PackageReference` in classic `.csproj` files, so `dotnet build` reports
  CS0246 `The type or namespace name 'Telerik' could not be found` even after a
  successful restore.

  Locate it with:
  ```powershell
  & "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe" -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | Select-Object -First 1
  ```
  Then build with:
  ```powershell
  & "<MSBuild path>" <solution>.sln -restore -t:Build -p:Configuration=Debug
  ```
  Use VS MSBuild for **all** subsequent builds in that project.

**Warning handling**: follow `telerik-winforms-migration-verification`'s
**Warning Policy**, not the common `building-projects` skill's "fix every
warning" default — fix errors, `TKL*` codes, and new regressions introduced
by the conversion itself; pre-existing or unrelated warnings don't need to
be resolved as part of this scenario.

## Error Handling

- **Build errors after a conversion**: read the error message and apply standard
  C# fixes. Do **NOT** immediately call `telerik_winforms_assistant` for build
  errors — you can do it when unsure of the API and intended usage.
- **A type or property mapping looks wrong**: report it rather than hand-patching
  the file. Manual edits to converter output cause drift.
- **Designer fails to open a converted form**: check for missing Telerik
  references and confirm the NuGet package restored.
- **Conversion limit reached**: trial accounts are capped at 20 conversions. The
  tool returns an explicit error. Stop, report progress, and tell the user a
  license upgrade is required to continue.
- **A class cannot be converted cleanly**: restore it from the `.bak` file,
  record it as deferred in the task file, and continue with the remaining
  classes. Report it in post-completion rather than blocking the scenario.
