---
name: telerik-winforms-license-key-setup
description: >
  Guide a customer through obtaining and correctly placing a Telerik UI for
  WinForms license key for the recommended NuGet-based activation path, or
  the script-key path when NuGet-based activation genuinely is not
  applicable. Never handles, fabricates, or stores key content. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms License Key Setup

Sets up license activation for a project that currently has **no working
mechanism**, or completes/corrects a partially-set-up one. This is not the
migration skill — for converting an existing, working script-key project to
the NuGet model, use `telerik-winforms-license-nuget-migration` instead,
which calls into this skill's placement steps as part of that transition.

## Inputs

- Per-project `mechanism`/`artifactsFound` from
  `telerik-winforms-license-detection` (run it first if not already run).
- Which activation method applies (see *Choose the Method* below) — this
  skill decides it from the inputs above; the caller does not need to
  pre-decide, but may override for a documented exception.

## Preconditions

- `telerik-winforms-license-detection` has run for the project(s) in scope.
- For per-project setup, the project's Telerik version actually requires a
  license (Q1 2025+) — otherwise there is nothing to set up. For MCP-only
  setup, there may be no Telerik project version; the MCP server still
  requires a valid license key.

## Choose the Method

- **Recommended, default**: `telerik-license.txt` file + the
  `Telerik.Licensing` NuGet package. Use this whenever the project can
  install a NuGet package at all — this does **not** require the Telerik
  *control* assemblies themselves to be NuGet-referenced; `Telerik.Licensing`
  can be added on its own even if the project keeps direct assembly
  references for the controls.
- **Script key (alternative)**: only when the project cannot use NuGet
  packages at all, or has a special hosting/integration constraint.
  - **Add-in / plugin hosts** are **hybrid**, not script-key-only — see
    Step 4.
  - **OpenEdge ABL hosts are always script-key-only** — OpenEdge does not
    support NuGet at all, so the NuGet-based path never applies there,
    regardless of anything else about the project. See Step 5.

## Step 1: NuGet-Based Path (Default)

1. Ensure the `Telerik.Licensing` NuGet package restores in each in-scope
   project. **Any** Telerik UI for WinForms control NuGet package
   (`GridView`, `PivotGrid`, `AllControls`, etc.) brings `Telerik.Licensing`
   in transitively — this is not specific to `AllControls`. Only add
   `Telerik.Licensing` as its own explicit `PackageReference` when the
   project has **no** Telerik control NuGet package at all (i.e. its
   Telerik controls remain on direct assembly references). Never add it
   explicitly alongside a control package that already brings it in —
   confirm restore first rather than assuming it's missing.
1a. **.NET Framework, non-SDK-style projects only**: when this step adds an
    explicit `Telerik.Licensing` reference (or a control package is added
    for the first time and brings it in transitively), confirm
    `<AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>` is
    set (or an explicit `false` is removed) — the same binding-redirect
    risk `telerik-winforms-license-nuget-migration`'s Step 3 fixes for a
    migration applies equally to a first-time setup, since either can
    introduce a `Telerik.Licensing.Runtime` version that differs from one
    already present. Clean and rebuild, and confirm the generated
    `<application>.exe.config` carries the redirect if binding redirects
    are managed manually.
2. Direct the customer to obtain `telerik-license.txt` themselves — **never
   fabricate, guess, or fill in a key**:
   - Automatic: Telerik VS extensions (`Extensions > Telerik > Licensing > Download Key`),
     Progress Control Panel, or the Telerik CLI (see *Telerik CLI* below) —
     all three write directly to `%AppData%\Telerik` for the current user.
   - Manual: the [License Keys](https://www.telerik.com/account/your-licenses/license-keys)
     page → **Download License Key**.
3. Instruct the customer to place the downloaded file at exactly one of:
   - `%AppData%\Telerik\telerik-license.txt` (Windows, per-user, all
     NuGet-based projects for that account)
   - `~/.telerik/telerik-license.txt` (Mac/Linux)
   - The project root next to the `.csproj`/`.vbproj` (per-project only)

   **Warn explicitly**: this is the customer's personal key — do not commit
   it to source control, and add it to `.gitignore` if placed in the project
   root.
4. Hand off to `telerik-winforms-license-verification` to confirm the build
   activates cleanly.

## Step 2: Script-Key Path (Only When the Exception Applies)

Confirm the exception first (project cannot use NuGet at all — see the
migration skill's *Exception* section for the exact test) before using this
path; do not default to it.

**A direct `Telerik.Licensing.Runtime.dll` assembly reference (as opposed to
one arriving via the `Telerik.Licensing` NuGet package) always needs one of
this path's mechanisms to activate** — an `EvidenceAttribute` script key, or
a manual `Register(...)` call — except on OpenEdge hosts (Step 5), which
always register manually. If the customer cannot supply or does not know the
script key, and the project **can** use NuGet, prefer moving off the direct
runtime reference entirely: remove it and add the `Telerik.Licensing` NuGet
package instead (Step 1), assuming a valid `telerik-license.txt` is already
present or can be obtained. This sidesteps the script-key requirement rather
than blocking on a key the customer cannot provide. Only continue with this
step when NuGet genuinely is not an option (the migration skill's exception
test) or the customer prefers to keep the direct reference and can supply
the key.

1. Direct the customer to **License Keys → View Script Keys → Progress® Telerik® UI for WinForms**
   in their Telerik account, and copy the code snippet shown there.
2. Create the language-correct file — **the two syntaxes are not
   interchangeable**:
   - C#: `TelerikLicense.cs` containing
     `[assembly: global::Telerik.Licensing.EvidenceAttribute("...")]`
   - VB: `TelerikLicense.vb` containing
     `<Assembly: Telerik.Licensing.EvidenceAttribute("...")>`

   Pasting the C# snippet into a `.vb` file produces build error
   `BC30034: Bracketed identifier is missing closing ']'` — if you see that
   error, this is the cause; fix by using the VB syntax above, not by
   editing brackets.
3. Add the file to **every** project that compiles Telerik assemblies
   directly. If several internal projects all need it, one shared file may
   be linked into each rather than duplicated.
4. If the app uses more than one Telerik product (WPF, Document Processing,
   Reporting, etc.), each product's script key gets its own
   `EvidenceAttribute` line in the same file.
5. **Warn explicitly**: never publish this file in a public repository —
   it contains the customer's personal license.

## Step 3: Windows CI/CD Placement (When Setting Up a Build Agent Directly)

The license file must exist for the **Windows account that runs the build**,
not the account used to configure the machine. For fuller CI/CD guidance
(secrets, environment variables, platform-specific setup), delegate to
`telerik-winforms-license-cicd-setup` rather than duplicating that guidance
here.

## Step 4: Add-in / Plugin Hosts (Hybrid — NuGet Package Plus Manual Registration)

When `telerik-winforms-license-detection` reported `entryPointShape` as
add-in/plugin, **both** mechanisms are required together — this is not an
either/or choice:

1. Ensure every project library in the add-in references the
   `Telerik.Licensing` NuGet package (from NuGet.org).
2. Call `Telerik.Licensing.TelerikLicensing.Register()` as early as
   possible, before any Telerik control (including `RadForm`) initializes.
3. For the parameterless `Register()` overload to work, the project must
   still define an `EvidenceAttribute` with the product's script key (Step
   2 above) — or call `TelerikLicensing.Register("your-script-key")`
   directly, or enumerate `EvidenceAttribute`s reflectively and register
   each. Do not fabricate the script key value — the customer supplies it.

## Step 5: OpenEdge ABL Hosts (Script-Key Only — No NuGet)

**OpenEdge does not support NuGet at all.** Do not run Step 1 or attempt any
NuGet-based setup for an OpenEdge project — go straight to a direct
assembly reference plus manual registration:

1. Add a direct reference to `Telerik.Licensing.Runtime.dll` — not the
   `Telerik.Licensing` NuGet package.
2. Direct the customer to **License Keys → View Script Keys → Progress® Telerik® UI for WinForms**
   and copy **only the key string** inside the first
   `Telerik.Licensing.EvidenceAttribute("key")` shown there.
3. Register the key explicitly in code, before any Telerik control
   initializes:
   - In the `Form` constructor, before `InitializeComponent()`:
     `Telerik.Licensing.TelerikLicensing:Register("Your License Key")`.
   - Or earlier, from a procedure file (`.p`), if the very first screen is
     itself a Telerik form — register there instead of in the form.
4. **Warn explicitly**: never publish the script key in a public repository.

## Output

- Method used per project (NuGet-based / script-key / hybrid / OpenEdge)
- File(s) placed or created, and their locations
- Any secret-material warning issued
- Remaining customer action items (they must supply the actual key/script
  key value themselves)

## Telerik CLI

The Telerik CLI is a .NET global tool that can automate several of the
manual steps above on a **standard, NuGet-capable** project (it does not
apply to OpenEdge):

- Install once: `dotnet tool install -g Telerik.CLI` (requires .NET SDK
  6.0+ and a valid Telerik account with an active subscription or trial).
- `telerik license info` is the read-only check for an existing key. It
  reports the file path the CLI is using and the license status for each
  Telerik product, including `Telerik UI for WinForms`; it does not print the
  key contents. Use it before setup to confirm an existing file, and again
  afterward to confirm that the downloaded key covers WinForms and has not
  expired. Summarize only the file path and WinForms status; do not retain or
  echo the audience, user ID, license ID, or other personal metadata.
- After the customer authenticates the CLI, `telerik license get-key`
  downloads the latest `telerik-license.txt` and saves it to
  `%AppData%\Telerik` for the current user — equivalent to the manual
  download in Step 1, without opening a browser. In PowerShell, the resolved
  location is `$env:APPDATA\Telerik\telerik-license.txt`.
- `telerik setup winforms` runs a full one-shot developer-machine setup:
  login, NuGet feed configuration, license key download, and MCP server
  registration, in one command. Use `--scope user|project` and
  `--nuget-path <path>` to control where the NuGet source is configured,
  and `--no-interactive` to run it in an automated/headless environment
  (it still writes the license file to the running account's profile, so
  the same Windows-account caveat from Step 3 still applies).
- When the customer wants the complete setup, prefer this command and then
  run `telerik license info` to verify the resulting file and WinForms
  product status. When only the license file is missing, use
  `telerik license get-key` instead and leave existing project/feed setup
  unchanged.
- `telerik login --no-browser` supports headless or network-restricted
  authentication via a device code, useful when the browser-based login
  the other commands rely on isn't available.
- `telerik whoami` / `telerik logout` check or clear the current CLI
  session.

Never run `telerik login` (or any command that could prompt for
credentials) on the customer's behalf without their explicit direction —
this skill only tells the customer these commands exist and what they do.

## Idempotency

Re-running when the artifact already exists in a valid location is a no-op —
report the existing state rather than re-creating files or re-issuing
instructions already satisfied.
