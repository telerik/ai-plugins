# Planning Stage — Telerik WinForms Assembly-to-NuGet Migration

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
| 1 | Confirm the project is committed to source control | Always | — |
| 2 | Set up the required NuGet feed | Feed not yet configured or not resolving | telerik-winforms-nuget-feed-setup |
| 3 | Resolve any unmapped assembly with the user | Unmapped assemblies present | telerik-winforms-assembly-mapping |
| 4 | Migrate project references — **one task per project** | Per assembly-referenced project | telerik-winforms-reference-migration |
| … | *(repeat task 4 for each project)* | | |
| N | Final solution-wide restore and build | Always | telerik-winforms-migration-verification |

Task 3 is a blocker task, not a code change: get an explicit decision from
the user (keep as a direct reference, map to a specific package, or include
it via `AllControls`) before task 4 touches that project.

## Task Granularity

- **One task per project** for the reference migration itself — do not split
  a single project's package additions and reference removals across tasks;
  they must land together so the project is never left half-migrated.
- **Never bundle the feed setup with a project migration task** — the feed
  must resolve before any package is added, or restore will fail for reasons
  unrelated to the edits just made.
- **Do not add telerik-version-upgrade or breaking-change tasks** — this scenario
  keeps the Telerik version fixed; that work belongs to `telerik-version-upgrade`.
