---
name: telerik-winforms-license-nuget-migration
description: >
  Convert a Telerik UI for WinForms project from the script-key licensing
  model (compiled EvidenceAttribute) to the NuGet-based model
  (Telerik.Licensing package + telerik-license.txt), and clean up what the
  script-key model left behind. This only changes the licensing mechanism —
  it does not migrate the Telerik control assemblies themselves to NuGet;
  that is telerik-winforms-reference-migration's job. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Script Key → NuGet Licensing Migration

Moves a project off the script-key (`EvidenceAttribute`) licensing model and
onto the recommended `Telerik.Licensing` NuGet package + `telerik-license.txt`
model — cleanly, with no leftover script-key artifact and no half-migrated
state.

**Scope boundary**: this skill only changes *how the license is activated*.
It does not touch the Telerik *control* assemblies' delivery method — a
project can keep direct assembly references to the Telerik controls while
still moving its licensing onto the NuGet-based model, because
`Telerik.Licensing` can be added as its own package independent of the
control packages. If the customer also wants the control assemblies
migrated, that is `telerik-winforms-reference-migration`'s job — invoke it
separately.

## Inputs

- Per-project detection output from `telerik-winforms-license-detection`
  (must show `mechanism: script-key`).
- Explicit customer consent to migrate (this skill never runs unprompted —
  the calling scenario owns the recommend/consent decision).

## Preconditions

1. `telerik-winforms-license-detection` ran and reports `script-key` for the
   project.
2. **The exception does not apply** — confirm the project can actually use
   NuGet packages before proceeding:
   - **OpenEdge ABL hosts are always this exception.** OpenEdge does not
     support NuGet at all — never migrate an `openedge-manual-registration`
     project. Report this plainly rather than attempting it.
   - The project (or its build environment) can restore NuGet packages at
     all more generally. If it fundamentally cannot, **do not migrate** —
     report this and leave the script key in place.
   - Add-in/plugin hosts are **not** a blocking exception — they still
     adopt the NuGet package, they just also keep the `EvidenceAttribute`
     and manual `Register()` call. Do not treat "hybrid" as "cannot
     migrate."
3. Customer has consented (recommend, never force — the script-key model is
   fully supported).

## Step 1: Add the NuGet-Based Mechanism

Delegate to `telerik-winforms-license-key-setup`'s Step 1 (NuGet-based path)
for the project: ensure `Telerik.Licensing` restores, and have the customer
place `telerik-license.txt` at the recommended location. Do not duplicate
those steps here.

## Step 2: Remove the Script-Key Artifact

Only after Step 1's mechanism is in place (or in the same atomic change set
— never leave a window where neither mechanism is active for a project that
already had a working script key):

- Delete the `TelerikLicense.cs`/`TelerikLicense.vb` file containing the
  `EvidenceAttribute` for **this** product's script key. If the file also
  contains script keys for other Telerik products (WPF, Document Processing,
  Reporting), remove only the WinForms line, not the whole file.
- Remove any manual `Telerik.Licensing.TelerikLicensing.Register(...)` call
  that existed **solely** to work around the lack of file-based activation —
  but **keep** it if `telerik-winforms-license-detection` flagged the
  project as an add-in/plugin host (see Preconditions #2); those hosts keep
  both mechanisms, set up per `telerik-winforms-license-plugin-hosts`. This
  step never applies to OpenEdge, which is excluded from migration entirely.

## Step 3: .NET Framework Binding Redirect Check

For .NET Framework projects, adding the `Telerik.Licensing` NuGet package can
introduce a `Telerik.Licensing.Runtime` version that differs from what a
previously, manually-referenced copy provided, producing a `FileLoadException`
at runtime. This does not apply to modern .NET projects. If detection
recorded a direct `Telerik.Licensing.Runtime` reference or the build now
fails this way:

1. Ensure `<AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>`
   is set (or remove an explicit `false`).
2. Clean and rebuild; confirm the generated `<application>.exe.config`
   contains a binding redirect for `Telerik.Licensing.Runtime` to the
   installed version.
3. If binding redirects are managed manually, add the redirect explicitly
   with `oldVersion`/`newVersion` set to the installed
   `Telerik.Licensing.Runtime` version.

This same risk applies to a project setting up NuGet-based licensing for the
**first time**, not only a migration away from a script key —
`telerik-winforms-license-key-setup`'s Step 1a runs the identical check in
that case. Do not assume this check only matters during a migration.

## Step 4: Verify

Hand off to `telerik-winforms-license-verification`. Do not consider the
migration complete until it reports a clean build with no `TKL*` warnings.

## Output

- Mechanism before/after per project
- Files removed and files added
- Whether the binding-redirect fix was needed and applied (.NET Framework
  only)
- Verification result (delegated, not duplicated)

## Idempotency

Re-running when the project already shows `mechanism: nuget-file` (or
`nuget-envvar`) with no remaining `EvidenceAttribute` is a no-op.
