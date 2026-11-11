# Execution Stage — Telerik WPF Assembly-to-NuGet Migration

Execute the plan's tasks in order, validating after each project.

## Flavor, Feed, and Blocker Tasks

- **Flavor decision task**: present the conflicting references recorded in
  the assessment and ask the user which flavor to converge on. Do not choose
  one. Record the decision, then resolve the affected projects' package set
  with **telerik-wpf-assembly-mapping** for that flavor. No reference-migration
  task runs until this is recorded.
- **Feed setup task**: follow **telerik-wpf-nuget-feed-setup**'s setup
  guidance. Do not proceed to any reference-migration task until the feed is
  confirmed to resolve Telerik packages.
- **Unmapped assembly task**: present the assembly and ask the user how to
  proceed. Do not guess a package. Record the decision before migrating that
  project.

## Per-Project Migration Task

For each project task, load **telerik-wpf-reference-migration** and:
1. Add the resolved `PackageReference` entries (id + version) from the
   assessment's mapping, or update the version if the package is already
   referenced — every id matches the project's recorded flavor
2. For NoXaml, replace every `Telerik.Windows.Themes.<Theme>.dll` reference
   with its `Telerik.Windows.Themes.<Theme>.for.Wpf` package
3. Remove the superseded `<Reference>`/`HintPath` entries and any Telerik
   entries in `packages.config`
4. Remove Telerik-related assembly binding redirects
5. Confirm every added Telerik UI package uses the same version, and that
   flavor-neutral Document Processing packages use their paired version

Then load **telerik-wpf-migration-verification** for that project:
restore, build (using Visual Studio MSBuild instead of `dotnet build` for
Classic-style .NET Framework projects built outside Visual Studio), confirm
the flavor is unchanged, run the NoXaml theming checks
(`telerik-wpf-xaml-flavor` Step 4), and fix only reference-migration
mistakes — a missing package, wrong version, a package of the wrong flavor,
or a leftover `<Reference>`. Do not fix unrelated API breaking changes here;
that is out of scope (see `telerik-wpf-version-upgrade`).

The Telerik version does not change here, so copied `Themes.Implicit` XAML
in a NoXaml project needs no refresh; leave it untouched.

Pass the active scenario id (`telerik-wpf-assembly-to-nuget`), the recorded
Telerik version, and any already-reported missing-license finding to
verification so its scenario-specific warning exception can apply.

## Application License Verification

Use the Telerik version already recorded in the assessment:

- **Before Q1 2025**: no application license is required; do not add a
  license check or setup task.
- **Q1 2025 or later**: restored control packages bring `Telerik.Licensing`
  transitively. Use the build's licensing diagnostics to verify activation;
  finding a license file alone is not proof that activation succeeds.
- If the build reports a missing-license warning (e.g. `TKL002`), check
  whether an application license input is configured: a per-user or
  project-root `telerik-license.txt`, `TELERIK_LICENSE`, or
  `TELERIK_LICENSE_PATH`. Check existence and path resolution only; never
  read, print, or log key contents or secret environment-variable values.
  When the missing license is confirmed, notify the user once and record
  the affected project and warning codes in the task results as deferred.
  Apply the assembly-to-NuGet exception in
  `telerik-wpf-migration-verification`'s **Warning Policy**.
- Do not automatically start license setup, switch an existing activation
  mechanism, or invoke Telerik MCP tools. Deferred activation belongs to
  the `telerik-wpf-licensing` follow-up scenario. Licensing errors and other
  `TKL*` warnings remain subject to the shared policy.

## Final Verification

After every project's task is done, run
**telerik-wpf-migration-verification** once more for the whole solution
to confirm a successful restore and build, an unchanged flavor in every
project, and clean NoXaml theming checks, following that skill's **Warning
Policy** rather than the common `building-projects` skill's "fix every
warning" default — pre-existing or unrelated warnings don't need to be
resolved as part of this migration.

Carry the per-project deferred licensing findings into this verification
and the final summary. Do not describe a build with deferred warnings as
warning-free, or application activation as verified while it is deferred.
