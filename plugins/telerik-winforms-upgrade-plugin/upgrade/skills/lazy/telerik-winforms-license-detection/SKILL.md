---
name: telerik-winforms-license-detection
description: >
  Determine how, and whether, a Telerik UI for WinForms project is currently
  licensed. Read-only — reports the active mechanism, every license artifact
  found and its precedence, the entry-point/host shape, and whether the
  referenced Telerik version even requires a license. Never mutates
  anything and never reads or echoes key content.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms License Detection

Read-only detection of a project's current Telerik licensing state. Every
other licensing lazy skill and the `telerik-licensing` scenario depend on this
skill's output — never assume the mechanism in use; always run this first.

## Inputs

- Solution/project list in scope (from the caller's own project discovery).
- Optionally, the Telerik version and reference style already known from
  `telerik-winforms-reference-detection` — if not supplied, this skill calls
  it itself rather than re-parsing `.csproj`/`.vbproj` files independently.

## Preconditions

None. Safe to call standalone, from the `telerik-licensing` scenario, or from any
other scenario/extension that needs these facts before deciding on a
licensing action.

## Step 0: MCP Server Prerequisite (Always Checked, Independent of Telerik Presence)

The `Telerik.WinForms.MCP` server requires a valid Telerik license to
operate, regardless of whether any in-scope project references Telerik at
all — a greenfield `telerik-control-conversion` run needs this key just as much as
an existing Telerik project does. Check this **first**, before Step 1, and
never gate it on Telerik presence or skip it because "there's nothing to
license yet."

Check whether a `telerik-license.txt` file exists at any of:
- Global, per-user (Windows): `%AppData%\Telerik\telerik-license.txt`
- Global, per-user (Mac/Linux): `~/.telerik/telerik-license.txt`
- Project or solution root: `telerik-license.txt` next to the
  `.csproj`/`.vbproj`/`.sln`

**Resolve the environment variable using the current shell's own syntax —
do not treat `%AppData%` as a literal path segment.** `%VAR%` is cmd.exe
syntax only; PowerShell does not expand it and will report the folder
missing even when the file exists there. Use whichever applies to the shell
actually running the check:
- PowerShell: `$env:APPDATA` (e.g. `Test-Path (Join-Path $env:APPDATA 'Telerik\telerik-license.txt')`)
- cmd.exe: `%APPDATA%`
- bash/zsh: `$HOME/.telerik`

If a direct existence check reports the file missing, list the resolved
`Telerik` folder's contents (case-insensitively) before concluding it's
absent — this catches a wrong-shell path-resolution bug (like the one
above) or a filename mismatch, instead of reporting a false negative.

Check existence only — never read, print, or echo the key content.

When the Telerik CLI is installed, also run its read-only license inspection:

  telerik license info

Use the result to confirm the exact license file the CLI is using and whether
`Telerik UI for WinForms` appears in the product table, including its license
type and expiry. A successful command is stronger evidence than file
existence alone; it can distinguish a usable file from a file that is
corrupted, expired, or does not cover WinForms. If the command is unavailable
or fails before evaluating the file, retain the direct existence result and
report CLI validation as unavailable rather than treating that command failure
alone as proof that the file is missing. Record only the resolved file path
and WinForms status — do not echo the audience, user ID, license ID, or any
key content printed by the command.

If, after a correctly-resolved check, no license file is found anywhere:
report the exact path(s) actually checked (with the environment variable
already resolved to its real value, not the placeholder), and offer to help
set it up right now via `telerik-winforms-license-key-setup` — do not only
point the user to their account and stop; the customer may be starting a
conversion or upgrade and wants the key installed as part of that, not as a
separate errand.

## Step 1: Does This Version Even Require a License?

Telerik UI for WinForms versions released before January 2025 do not
require a license key. Using `telerik-winforms-reference-detection`'s
reported version, record whether the project is subject to license
activation at all (2025.1.x / Q1 2025 or later) before treating anything
else here as a problem.

## Step 2: Reference Style and Entry Point

- Reuse `telerik-winforms-reference-detection` for reference style
  (assembly / NuGet / packages.config / mixed) and TFM — do not re-parse
  project files for this.
- Identify the project's entry point shape:
  - **Standard application**: a conventional `Program.cs`/`Main`/`Application.Run`
    startup exists.
  - **Add-in / plugin / host-constrained**: no standard application entry
    point — e.g. an Office VSTO add-in, or a class library hosted by another
    process. Look for project types/output types that indicate this (e.g. a
    library or add-in project template) rather than guessing from the name
    alone. This shape changes the fix in diagnostics.
  - **OpenEdge ABL host**: the project is driven by a `.p` procedure file /
    ABL runtime rather than a standard .NET entry point. **OpenEdge does not
    support NuGet at all** — this shape always means a NuGet-based
    mechanism is not an option, regardless of anything else detected. Only
    flag it when there is explicit evidence (`.p` files, OpenEdge project
    structure), never assume.

## Step 3: Locate License Artifacts

Check for, and record, each of the following **without reading their
contents** (existence/structure only — never print or echo key material):

**NuGet-based activation artifacts:**
- `Telerik.Licensing` NuGet package reference — explicit `PackageReference`,
  or transitively present because a Telerik control NuGet package was
  restored.
- `telerik-license.txt` at `%AppData%\Telerik\` (Windows) or
  `~/.telerik/` (Mac/Linux) — the global, per-user location.
- `telerik-license.txt` in the project root next to the `.csproj`/`.vbproj`
  — the project-specific location. **If both a global and a project-specific
  file exist, the project-specific one wins.**
- `TELERIK_LICENSE` environment variable — **wins over any `telerik-license.txt`
  file if both are present.**
- `TELERIK_LICENSE_PATH` environment variable (Azure DevOps secure-files
  pattern) pointing at a license file path.
- Additional file locations documented in one older KB but not in the
  primary article — `C:\inetpub\wwwroot\telerik-license.txt`,
  `C:\inetpub\telerik-license.txt`, `C:\telerik-license.txt`. Treat these as
  secondary/unconfirmed locations — report them if found, but do not
  recommend placing a *new* file there; prefer the two canonical locations
  above.

**Script-key activation artifacts:**
- A `TelerikLicense.cs`/`TelerikLicense.vb` (or similarly named) file
  containing `Telerik.Licensing.EvidenceAttribute`. Record the language —
  the C# and VB syntax are **not interchangeable**
  (`[assembly: global::Telerik.Licensing.EvidenceAttribute("...")]` in C# vs.
  `<Assembly: Telerik.Licensing.EvidenceAttribute("...")>` in VB) — a
  mismatched syntax is itself a documented build error.
- A manual `Telerik.Licensing.TelerikLicensing.Register(...)` call anywhere
  in source — used for add-in hosts and required for OpenEdge hosts.
- A direct `Telerik.Licensing.Runtime.dll` assembly reference (as opposed to
  one arriving via the `Telerik.Licensing` NuGet package) — relevant to a
  .NET Framework binding-redirect failure mode, and the only way OpenEdge
  hosts reference it at all, since they cannot use NuGet. Outside of
  OpenEdge, this reference shape always requires an `EvidenceAttribute` or a
  manual `Register(...)` call to activate — record whether one is present
  alongside it, since a direct reference with neither is a `none`-mechanism
  defect for `telerik-winforms-license-diagnostics` to route, not a variant
  of `script-key` to accept silently.
- For .NET Framework projects only: the `<AutoGenerateBindingRedirects>`
  setting in the project file.

## Step 4: Classify the Mechanism

Per project, classify as one of:
- `nuget-file` — `Telerik.Licensing` present + a `telerik-license.txt` resolvable per the precedence rules above.
- `nuget-envvar` — `Telerik.Licensing` present + `TELERIK_LICENSE`/`TELERIK_LICENSE_PATH` set.
- `script-key` — `EvidenceAttribute` present, no usable NuGet-based artifact.
- `hybrid-manual-registration` — an add-in/plugin host with **both** a
  NuGet-based artifact and an `EvidenceAttribute` + manual `Register()` call
  (expected there, not a defect).
- `openedge-manual-registration` — an OpenEdge host with a direct
  `Telerik.Licensing.Runtime.dll` reference and a manual `Register("key")`
  call in ABL code, and **no** NuGet artifact of any kind (expected there —
  OpenEdge cannot use NuGet, so this is never a defect either).
- `none` — no artifact of any kind found, and the version requires one.
- `not-applicable` — version predates Q1 2025; no license required.

## Step 5: Solution-Level Consistency Check

Across all in-scope projects, record whether every project uses the **same**
mechanism. Flag a mismatch (e.g. some projects `nuget-file`, others
`script-key`) as `mixed` — do not silently pick one; the caller decides how
to resolve it (see the `telerik-licensing` scenario's planning stage). Do not flag
`openedge-manual-registration` alongside other mechanisms as a defect on its
own — an OpenEdge project is never eligible for convergence onto NuGet.

## Step 6: Telerik CLI Availability

Check whether the Telerik CLI is installed (`dotnet tool list -g` includes
`Telerik.CLI`). If it is installed, use `telerik license info` during Step 0
to validate the local license file and report the WinForms product status.
Separately check whether it has an active login session (a stored session
token under `%AppData%\Telerik` on Windows or `~/.telerik` on Mac/Linux, or a
successful `telerik whoami`). A login is needed for commands that obtain or
refresh a key, but is not required to classify an already-present file when
`telerik license info` can inspect it. Neither CLI availability nor login
state changes the per-project licensing mechanism classification — they only
tell `telerik-winforms-license-key-setup` whether the automated setup path is
available instead of only the manual download/VS-extension routes.

## Output Shape

Per project:
- `licenseRequired`: Yes / No (with the version that decided it)
- `mechanism`: one of the Step 4 classifications
- `referenceStyle`, `tfm` (from `telerik-winforms-reference-detection`)
- `entryPointShape`: standard / add-in-or-plugin / openedge
- `artifactsFound`: list with location and precedence outcome (which one
  wins, if more than one is present)
- `evidenceAttributeLanguage`: C# / VB / n/a
- `directLicensingRuntimeReference`: Yes/No (.NET Framework relevance only)
- `autoGenerateBindingRedirects`: Yes/No/n/a (.NET Framework only)

Solution-level:
- `mcpLicensePresent`: Yes/No — the Step 0 check, always populated even
  when no project references Telerik
- `mcpLicenseCliValidation`: Confirmed / Reports no usable license /
  Unavailable — the optional `telerik license info` result
- `mcpLicensePath`: resolved file path reported or checked by Step 0, path
  only
- `winformsProductLicenseStatus`: Licensed / Not listed / Expired / Unknown
  — from `telerik license info` when available
- `consistent`: Yes/No — list of projects per mechanism if `No`
- `telerikCliInstalled`, `telerikCliLoggedIn`: Yes/No

## Notes

- Never read, print, log, or otherwise echo the contents of a license key,
  script key, or environment variable value. Report only existence, location,
  and non-secret CLI metadata such as the WinForms product status and expiry.
- This skill only reports. Setup, migration, CI/CD configuration, and fixes
  are separate skills (`telerik-winforms-license-key-setup`,
  `telerik-winforms-license-nuget-migration`,
  `telerik-winforms-license-cicd-setup`, `telerik-winforms-license-diagnostics`).

