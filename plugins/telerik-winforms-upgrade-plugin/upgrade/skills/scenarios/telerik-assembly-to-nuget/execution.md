# Execution Stage — Telerik WinForms Assembly-to-NuGet Migration

Execute the plan's tasks in order, validating after each project.

## Feed and Blocker Tasks

- **Feed setup task**: follow **telerik-winforms-nuget-feed-setup**'s setup
  guidance. Do not proceed to any reference-migration task until the feed is
  confirmed to resolve Telerik packages.
- **Unmapped assembly task**: present the assembly and ask the user how to
  proceed. Do not guess a package. Record the decision before migrating that
  project.

## Per-Project Migration Task

For each project task, load **telerik-winforms-reference-migration** and:
1. Add the resolved `PackageReference` entries (id + version) from the
   assessment's mapping, or update the version if the package is already
   referenced
2. Remove the superseded `<Reference>`/`HintPath` entries and any Telerik
   entries in `packages.config`
3. Remove Telerik-related assembly binding redirects
4. Confirm every added Telerik package uses the same version

Then load **telerik-winforms-migration-verification** for that project:
restore, build (using Visual Studio MSBuild instead of `dotnet build` for
Classic-style .NET Framework projects built outside Visual Studio), and fix
only reference-migration mistakes — a missing package, wrong version, or a
leftover `<Reference>`. Do not fix unrelated API breaking changes here; that
is out of scope (see `telerik-version-upgrade`).

## License Note

Adding Telerik NuGet packages brings `Telerik.Licensing` in transitively when
the target version is Q1 2025 or later. If the shared license file was found
during pre-initialization, that already covers application activation — no
separate licensing task is needed here. If it was missing, the migration
still proceeds; note in the summary that the application will need the
license file activated before it can run without warnings (see
`telerik-winforms-license-key-setup` for background).

## Final Verification

After every project's task is done, run
**telerik-winforms-migration-verification** once more for the whole solution
to confirm a clean restore and build, following that skill's **Warning
Policy** rather than the common `building-projects` skill's "fix every
warning" default — pre-existing or unrelated warnings don't need to be
resolved as part of this migration.
