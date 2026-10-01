---
name: telerik-winforms-breaking-changes
description: >
  Detect and resolve Telerik UI for WinForms breaking changes when upgrading
  between versions. Calls the telerik_upgrade_assistant MCP tool to analyze
  projects and guides the agent through iterative fix-build-validate cycles.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Breaking Changes Detection and Resolution

Guide for detecting and fixing breaking changes when upgrading Telerik UI for
WinForms between versions.

## Prerequisites

- **An active Telerik license** — the MCP server requires one to run at all.
- **The Telerik CLI** — `telerik_upgrade_assistant` drives
  `telerik migrate analyze` under the hood. If the CLI is missing the tool
  prompts to install it; otherwise install it manually:
  ```
  dotnet tool install --global Telerik.CLI
  ```

## Step 1: Run Breaking Changes Analysis

Call `telerik_upgrade_assistant` with:
- `projectPath` — absolute path to the `.csproj` **or `.vbproj`** file. Use the
  path visible in the workspace or solution root; do **not** search the file
  system. If it is wrong or outside the workspace boundary, the tool **elicits
  the correct path from the user**, so always pass a best-effort value rather
  than skipping the call.
- `fromVersion` *(optional)* — current Telerik version (e.g., `2020.1.115`).
  **Auto-detected from the project file when omitted**; if detection fails the
  tool asks the user.
- `targetVersion` *(optional)* — target Telerik version. Defaults to the latest
  available when this lazy skill is invoked independently. When called from
  the `telerik-version-upgrade` scenario, the caller must first resolve and record a
  concrete target, then pass it explicitly; do not use the project's current
  version as a substitute for an unresolved "latest" request. If no target 
  version can be determined, the tool will use the latest embedded manifest 
  available version.
  
For a `telerik-version-upgrade` scenario, if the resolved target equals
`fromVersion`, report that the analysis is a no-op and return control to the
scenario for user clarification. Do not present it as a successful upgrade
target or continue to fix findings against the same version.

The tool returns a report with findings grouped by file. Each finding includes:
- File path and line number
- Type and member affected
- Change kind (Removed, Modified, Renamed)
- Old and new API signatures
- Guidance message

After the call, present a concise user-facing summary rather than dumping the
raw report.

> **This tool is for version upgrades only.** For migrating standard Microsoft
> WinForms controls to Telerik, use `telerik_get_migration_plan` and
> `telerik_convert_file` instead — see the telerik-winforms-conversion skill.

## Step 2: Plan Fixes

Group findings by file or logical area. Prioritize:
1. Removed APIs — these cause compile errors immediately
2. Modified APIs — signature changes that require parameter updates
3. Renamed APIs — namespace or type name changes

## Step 3: Apply Fixes Iteratively

**Work in small batches.** For each batch:

1. Pick a small group of related findings (same file or same API area)
2. Apply the fix using the guidance from the tool output
3. **Build the project** — `dotnet build` for SDK-style projects. For
   Classic-style .NET Framework projects built outside Visual Studio, use
   Visual Studio MSBuild instead: the SDK's MSBuild doesn't fully support
   `PackageReference` in classic `.csproj` files and reports spurious CS0246
   `The type or namespace name 'Telerik' could not be found` errors even after a
   successful restore. Locate it with `vswhere.exe`
   (`-latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe`).
4. Analyze remaining errors
5. If unsure about the correct replacement API, call
   `telerik_winforms_assistant` with the specific component name and describe
   the usage pattern
6. Repeat until the batch is clean

## Anti-Patterns — Do NOT

- **Do NOT decompile DLLs** — never try to load, decompile, or inspect Telerik
  assemblies to understand the API. Use `telerik_winforms_assistant` instead.
- **Do NOT guess API signatures** — if the breaking changes tool doesn't provide
  a clear replacement, ask `telerik_winforms_assistant` rather than guessing.
- **Do NOT accumulate large batches** — fix a few files, build, validate, then
  move on. Large uncommitted change sets make errors harder to diagnose.
- **Do NOT ignore a deprecation warning that signals a future breaking
  change** — that is exactly what this skill exists to catch. For every
  other warning, follow `telerik-winforms-migration-verification`'s
  **Warning Policy**: fix new regressions introduced by this task's own
  fixes, but pre-existing or unrelated warnings don't need to be resolved
  here — report them rather than spending edits on them.

## Tips

- Build error messages often contain the correct new API signature — read them
  carefully before searching elsewhere.
- Training data about Telerik APIs may be outdated — always prefer MCP tool
  responses over general knowledge.
- If `telerik_upgrade_assistant` returns no findings but the build fails with
  Telerik errors, check for namespace changes, removed assemblies, or NuGet
  package conflicts.
