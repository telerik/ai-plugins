# Planning Stage — Telerik WPF Assembly-to-NuGet Migration

Create the task list from the assessment. Write it to `plan.md` in the
workflow folder.

## Source of Truth

The plan is derived entirely from the assessment — do not re-run detection,
feed validation, or mapping during planning; they already ran once in
assessment.

If every in-scope project was already NuGet-based, there is nothing to plan —
report that and stop.

## Task Composition

| Order | Task | Condition | Skill |
|-------|------|-----------|-------|
| 1 | Ask the user which flavor (Xaml or NoXaml) to converge on | Mixed or unknown flavor recorded | telerik-wpf-xaml-flavor |
| 2 | Confirm the project is committed to source control | Always | — |
| 3 | Set up the required NuGet feed | Feed not yet configured or not resolving | telerik-wpf-nuget-feed-setup |
| 4 | Resolve any unmapped assembly with the user | Unmapped assemblies present | telerik-wpf-assembly-mapping |
| 5 | Migrate project references — **one task per project** | Per assembly-referenced project | telerik-wpf-reference-migration |
| … | *(repeat task 5 for each project)* | | |
| N | Final solution-wide restore and build | Always | telerik-wpf-migration-verification |

Task 1 is a blocker task, not a code change: list the conflicting references
and get an explicit decision from the user. Do not choose a flavor, and do
not start any migration task until it is resolved. Converging on one flavor
is the user's decision about their existing setup; this scenario never
offers or performs a flavor switch on its own. Once the user decides, run
the assessment's mapping step for the affected projects with that flavor.

Task 4 is also a blocker task, not a code change: get an explicit decision
from the user (keep as a direct reference, map to a specific package, or
include it via the flavor-matching `AllControls` meta-package) before task 5
touches that project.

## Task Granularity

- **One task per project** for the reference migration itself — do not split
  a single project's package additions and reference removals across tasks;
  they must land together so the project is never left half-migrated. For
  NoXaml, the theme packages land in the same task as the control packages.
- **Never bundle the feed setup with a project migration task** — the feed
  must resolve before any package is added, or restore will fail for reasons
  unrelated to the edits just made.
- **Do not add version-upgrade or breaking-change tasks** — this scenario
  keeps the Telerik version fixed; that work belongs to
  `telerik-wpf-version-upgrade`.
