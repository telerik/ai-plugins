# Execution Stage — Telerik WinForms Version Upgrade

Execute the upgrade tasks using the Telerik MCP tools, validating with builds and
fixing breaking changes iteratively.

## General Execution Rules

1. **Load related skills** before starting each task — check the
   `<task_related_skills>` block from `start_task` and load the relevant
   skill SKILL.md files.
2. **Work in small batches** — apply breaking-change fixes to a small set of
   files, build, validate, then proceed.
3. **Build frequently** — after every meaningful change, build the project and
   analyze remaining errors. Do not accumulate large uncommitted changes.
4. **Use MCP tools** — always prefer the Telerik MCP tools over manual code
   changes. The tools have authoritative knowledge of Telerik APIs.
5. **Do NOT decompile DLLs** — never try to load, decompile, or inspect Telerik
   assemblies to extract API information. Use `telerik_winforms_assistant`
   instead.

## Task-Specific Execution Guidance

### Version Upgrade Tasks (Delivery-Method Branch)

Apply whichever branch assessment/planning recorded — see `planning.md` for
how the branch is chosen. Never invoke the NuGet-only skills
(`telerik-winforms-nuget-feed-setup`, `telerik-winforms-assembly-mapping`) on
a project that is staying on assembly references.

#### Already on NuGet

- Update the `Version` attribute on every Telerik `PackageReference` to the
  target version via `telerik-winforms-dependency-management`. If the
  project references a retired framework-specific id (`Net462`, `Net48`,
  `Net80`, `Net90`), replace it with the unified `AllControls` id at the
  same step.
- Restore and build. Compilation errors from changed APIs are expected here
  and are fixed in the breaking-changes tasks — capture them, do not try to
  fix them here.

#### Direct Assembly References — In-Place Retarget (Default)

Delegate to `telerik-winforms-reference-retargeting` with the confirmed
target Telerik version. That skill:
1. Asks the customer where the target version's DLLs are located (typically
   a `Bin` folder matching the project's target framework) — never guesses
   the path or assumes a default install location.
2. Validates the supplied path before touching the project: confirms the
   DLLs exist there, are the expected target Telerik version, and are the
   correct framework-specific build for the project's TFM.
3. Updates every Telerik `<Reference>`/`<HintPath>` entry to point at the
   validated location — no mix of old- and new-version paths.
4. Leaves the licensing mechanism untouched; the license-activation task
   below only verifies an existing Script Key / `EvidenceAttribute` still
   validates against the newly referenced assemblies.
5. Hands off to `telerik-winforms-migration-verification` to restore/build
   — the same verification used by the NuGet branch; it is delivery-method
   agnostic.

This is the shared skill also used by the `telerik-for-dotnet-framework-upgrade`
and `telerik-for-dotnet-version-upgrade` host extensions for the identical
retarget — do not re-implement these steps inline.

#### Direct Assembly References — Move to NuGet (Only If Accepted)

The NuGet option is mentioned exactly once, during planning — never here,
and never a second time. If the customer already accepted it, this replaces
the in-place retarget above (never run both):

`telerik-winforms-nuget-feed-setup` → `telerik-winforms-assembly-mapping` →
`telerik-winforms-reference-migration` → `telerik-winforms-license-key-setup`
(or `telerik-winforms-license-nuget-migration` if a Script Key already
existed) for the transitive `Telerik.Licensing`, Q1 2025+ →
`telerik-winforms-migration-verification` — all resolved at the **target**
Telerik version, so the version bump and the delivery-method change land in
one pass.

### Breaking Changes Tasks

- Call `telerik_upgrade_assistant` with `projectPath` (the `.csproj` or
  `.vbproj` path) and optionally `targetVersion`. `fromVersion` is auto-detected
  from the project file when omitted.
- The tool returns a report with findings grouped by file, each showing: file
  path, line number, old API, new API, and guidance. Present a concise summary
  rather than the raw report.
- Apply fixes file-by-file or in small logical groups. Build after each batch.
- When unsure about the correct replacement API, call
  `telerik_winforms_assistant` with the specific component and usage question.
- Also rely on build error messages — they often indicate the correct API.
- Re-run `telerik_upgrade_assistant` after the batches complete to confirm no
  findings remain.

### Application License Activation Tasks

These tasks use the shared key already verified for the MCP server.

- When Telerik control NuGet packages are referenced, restore the project; they
  bring `Telerik.Licensing` transitively, so do not add an explicit package
  reference. The shared `telerik-license.txt` verified during pre-initialization
  also activates the application.
- On direct assembly references, if the project already has an
  `EvidenceAttribute` (Script Key), leave it unchanged and verify it still
  validates for the newly referenced assemblies — do not switch an existing,
  working Script Key to `Telerik.Licensing` as part of a version upgrade. If
  none exists yet and this upgrade crosses the Q1 2025 boundary, set up
  licensing via `telerik-winforms-license-key-setup`: the recommended default
  there is the `Telerik.Licensing` NuGet package plus a resolved
  `telerik-license.txt`, which works standalone without requiring the control
  assemblies themselves to be NuGet-referenced; fall back to a new Script Key
  only for that skill's documented NuGet exceptions.
- The agent must NOT handle, store, or display license keys — instruct the user
  to download theirs from the Telerik account portal.
- **Always run `telerik-winforms-license-verification` for this project when
  the target version is Q1 2025 or later — even when this run did not cross
  the boundary itself** (e.g. the project was already past it before this
  upgrade). Do not close the task on the assumption that transitive
  `Telerik.Licensing` delivery via NuGet already activates cleanly; confirm
  it with a build that shows no `TKL*` codes.

## Out of Scope

Do not run the conversion tools (`telerik_get_migration_plan`,
`telerik_convert_file`) in this scenario. Converting Microsoft controls to
Telerik belongs to the `telerik-control-conversion` scenario.

`telerik_get_theme_setup` may be called only when a breaking change requires a
theme reconfiguration — not to introduce a new theme.

## Building

- **SDK-style projects**: `dotnet build`.
- **Classic-style .NET Framework projects built outside Visual Studio**: use
  **Visual Studio MSBuild**. The .NET SDK's MSBuild does not fully support
  `PackageReference` in classic `.csproj` files, so `dotnet build` reports
  CS0246 `The type or namespace name 'Telerik' could not be found` even after a
  successful restore. Locate it with:
  ```powershell
  & "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe" -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | Select-Object -First 1
  ```
  Use it for **all** subsequent builds in that project.

**Warning handling**: follow `telerik-winforms-migration-verification`'s
**Warning Policy**, not the common `building-projects` skill's "fix every
warning" default — fix errors, `TKL*` codes, and new regressions introduced
by this upgrade's own fixes; pre-existing or unrelated warnings don't need
to be resolved as part of this scenario.

## Error Handling

- If a build fails after changes, analyze the error messages first. Many
  breaking change errors include the new API signature in the message.
- If stuck on a specific API change, call `telerik_winforms_assistant` with the
  component name and describe the usage pattern.
- If `telerik_upgrade_assistant` returns no findings but the build still fails
  with Telerik-related errors, the issue may be a namespace change or a
  dependency conflict — check the project file references carefully.
- If a custom class subclasses a Telerik type whose base changed, fix the
  subclass first; downstream errors often resolve with it.
