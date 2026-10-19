# Execution Stage — Telerik WPF Version Upgrade

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
   assemblies to extract API information. Use `telerik-wpf-assistant`
   instead.
6. **Preserve the flavor** — never add a package or DLL of the other
   Xaml/NoXaml flavor, and never offer a flavor switch
   (`telerik-wpf-xaml-flavor`).
7. **Never change the target framework** — that belongs to the host's
   `dotnet-version-upgrade` / `dotnet-framework-version-upgrade` scenario.

## Task-Specific Execution Guidance

### Flavor Decision Task

When planning added it, present the conflicting references and ask the user
which flavor to converge on. Do not choose one. Record the decision; no
other task runs until it is recorded.

### Version Upgrade Tasks (Delivery-Method Branch)

Apply whichever branch assessment/planning recorded — see `planning.md` for
how the branch is chosen. Never invoke the NuGet-only skills
(`telerik-wpf-nuget-feed-setup`, `telerik-wpf-assembly-mapping`) on
a project that is staying on assembly references.

#### Already on NuGet

- Update the `Version` attribute on every Telerik UI `PackageReference` of
  the project's flavor to the target version via
  `telerik-wpf-dependency-management`, and every flavor-neutral Document
  Processing package to the version the target UI packages depend on. If
  the target is Q2 2026 or later, remove retired per-language
  `Telerik.Windows.Controls.for.Wpf.<lang>` packages at the same step.
- Confirm the feed the target version needs resolves
  (`telerik-wpf-nuget-feed-setup`).
- Restore and build. Compilation errors from changed APIs are expected here
  and are fixed in the breaking-changes tasks — capture them, do not try to
  fix them here.

#### Direct Assembly References — In-Place Retarget (Default)

Delegate to `telerik-wpf-reference-retargeting` with the confirmed
target Telerik version. That skill:
1. Asks the customer where the target version's DLLs are located — the
   folder matching the project's flavor (`Binaries\` for Xaml,
   `Binaries.NoXaml\` for NoXaml) and target framework (e.g. `WPF462` or
   `WPF80` for `2026.3.1007`) — never guesses the path or assumes a default
   install location.
2. Validates the supplied path before touching the project: confirms the
   DLLs exist there, are the expected target Telerik version, are the
   project's flavor, and are the correct framework-specific build for the
   project's TFM.
3. Updates every Telerik `<Reference>`/`<HintPath>` entry, including theme
   assemblies, to point at the validated location — no mix of old- and
   new-version paths.
4. Leaves the licensing mechanism untouched; the license-activation task
   below only verifies an existing Script Key / `EvidenceAttribute` still
   validates against the newly referenced assemblies.
5. Hands off to `telerik-wpf-migration-verification` to restore/build and
   run the NoXaml theming checks — the same verification used by the NuGet
   branch; it is delivery-method agnostic.

This is the shared skill also used by the `telerik-wpf-for-dotnet-framework-upgrade`
and `telerik-wpf-for-dotnet-version-upgrade` host extensions for the identical
retarget — do not re-implement these steps inline.

#### Direct Assembly References — Move to NuGet (Only If Accepted)

The NuGet option is mentioned exactly once, during planning — never here,
and never a second time. If the customer already accepted it, this replaces
the in-place retarget above (never run both):

`telerik-wpf-nuget-feed-setup` → `telerik-wpf-assembly-mapping` →
`telerik-wpf-reference-migration` → `telerik-wpf-license-key-setup`
(or `telerik-wpf-license-nuget-migration` if a Script Key already
existed) for the transitive `Telerik.Licensing`, Q1 2025+ →
`telerik-wpf-migration-verification` — all resolved at the **target**
Telerik version and the project's flavor, so the version bump and the
delivery-method change land in one pass.

### Copied Theme XAML Task (NoXaml)

Ask the user for the target version's `Themes.Implicit` folder (the
`NET Framework` or `NET` subfolder matching the project's unchanged TFM) and
refresh the copied theme XAML files from it, per `telerik-wpf-xaml-flavor`
Step 4. Never guess the folder and never hand-edit the theme XAML. If the
user defers, record it as an open item with its risk.

### Breaking Changes Tasks

- Call `telerik-upgrade-assistant` with `projectPath` (the `.csproj` path)
  and optionally `targetVersion`. `fromVersion` is auto-detected from the
  project file when omitted.
- The tool returns a report with findings grouped by file — code-behind and
  `.xaml` — each showing: file path, line number, old API, new API, and
  guidance. Present a concise summary rather than the raw report.
- Apply fixes file-by-file or in small logical groups. Build after each batch.
- When unsure about the correct replacement API, call
  `telerik-wpf-assistant` with the specific component and usage question.
- Also rely on build error messages, including XAML compile errors (`MC*`) —
  they often indicate the correct API.
- Re-run `telerik-upgrade-assistant` after the batches complete to confirm no
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
  licensing via `telerik-wpf-license-key-setup`: the recommended default
  there is the `Telerik.Licensing` NuGet package plus a resolved
  `telerik-license.txt`, which works standalone without requiring the control
  assemblies themselves to be NuGet-referenced; fall back to a new Script Key
  only for that skill's documented NuGet exceptions.
- For a Telerik-referencing class library, the consuming application also
  needs activation (`telerik-wpf-license-key-setup` Step 1b).
- The agent must NOT handle, store, or display license keys — instruct the user
  to download theirs from the Telerik account portal.
- **Always run `telerik-wpf-license-verification` for this project when
  the target version is Q1 2025 or later — even when this run did not cross
  the boundary itself** (e.g. the project was already past it before this
  upgrade). Do not close the task on the assumption that transitive
  `Telerik.Licensing` delivery via NuGet already activates cleanly; confirm
  it with a build that shows no `TKL*` codes.

## Out of Scope

Theme changes are made only when a breaking change requires a theme
reconfiguration — not to introduce a new theme, and never to switch between
StyleManager (Xaml) and implicit styles (NoXaml). Use `telerik-wpf-assistant`
for the theming API question when one arises.

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

WPF XAML compile errors (`MC*`, `XDG*`) count as errors, the same as
compiler errors.

**Warning handling**: follow `telerik-wpf-migration-verification`'s
**Warning Policy**, not the common `building-projects` skill's "fix every
warning" default — fix errors, `TKL*` codes, and new regressions introduced
by this upgrade's own fixes; pre-existing or unrelated warnings don't need
to be resolved as part of this scenario.

## Error Handling

- If a build fails after changes, analyze the error messages first. Many
  breaking change errors include the new API signature in the message.
- If stuck on a specific API change, call `telerik-wpf-assistant` with the
  component name and describe the usage pattern.
- If `telerik-upgrade-assistant` returns no findings but the build still fails
  with Telerik-related errors, the issue may be a namespace change, a removed
  assembly, a package of the wrong flavor, or a dependency conflict — check
  the project file references carefully.
- If a custom class subclasses a Telerik type whose base changed, fix the
  subclass first; downstream errors often resolve with it.
- For NoXaml, a `/<ThemeAssembly>;component/Themes/<Assembly>.xaml`
  dictionary merged for an assembly that is no longer referenced is a
  runtime error — `telerik-wpf-xaml-flavor` Step 4 reports it.
