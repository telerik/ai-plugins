# Planning Stage — Telerik WinForms Version Upgrade

Create the upgrade plan from the assessment findings. Write the task list to
`plan.md` in the workflow folder.

## Task Composition Rules

Tasks are ordered by dependency — earlier tasks must complete before later ones.
Skip any task whose additive concern was not flagged during assessment.

| Order | Task | Condition | Skill |
|-------|------|-----------|-------|
| 1 | Verify the target Telerik version supports the project's .NET target | Always | telerik-winforms-dependency-management |
| 2 | Present the NuGet option once, and record the customer's answer | Delivery method is direct assembly references (skip entirely — never ask — if already NuGet) | scenario-level prompt — see *Delivery Method Branch*, not a lazy skill |
| 3 | Upgrade the Telerik version via the resolved delivery-method branch | Always | branch-dependent — see *Delivery Method Branch* |
| 4 | Set up application license activation | Crossing the Q1 2025 boundary AND no working mechanism exists yet | telerik-winforms-license-key-setup / telerik-winforms-license-nuget-migration |
| 5 | Verify application license activation | Always, whenever the **target** version is Q1 2025 or later — regardless of whether Task 4 ran | telerik-winforms-license-verification |
| 6 | Detect breaking changes | Always | telerik-winforms-breaking-changes |
| 7 | Fix breaking changes — **batched by file or feature area** | Findings > 0 | telerik-winforms-breaking-changes, telerik-winforms-component-guidance |
| … | *(repeat task 7 per batch)* | | |
| N | Build, validate, and run tests | Always | telerik-winforms-migration-verification |

Task 4 applies on both branches: transitively via `Telerik.Licensing` on
NuGet, or by verifying (not replacing) an existing Script Key /
`EvidenceAttribute` on assembly references. If the assessment found an
existing `EvidenceAttribute`, preserve it unchanged.

**Task 5 is never skipped just because Task 4 didn't run.** A project that
was already past the Q1 2025 boundary before this upgrade (so Task 4 has
nothing to set up) still needs its activation confirmed against the
**target** version by an actual build — do not treat transitive
`Telerik.Licensing` delivery via NuGet as self-evidently working. Add Task 5
to the plan explicitly, even when its write-up is short, rather than folding
it silently into the final build task.

## Delivery Method Branch

Tasks 2 and 3 above resolve differently depending on the delivery method
recorded in assessment — this is the core branch for this scenario. Never
block Task 1 or Task 3's version resolution on how this branch resolves.

### Already on NuGet

Skip Task 2 entirely — do not ask about NuGet, there is nothing to ask. Task
3 is a plain package version bump: update the `Version` attribute on every
Telerik `PackageReference` to the target version.
Skill: `telerik-winforms-dependency-management`.

### On Direct Assembly References — Default: Upgrade In Place

Task 3's default is the **in-place retarget** — a complete, fully supported
path, not a degraded fallback. Delegate it to
`telerik-winforms-reference-retargeting`, which:
1. Asks the customer where the target version's DLLs are located (typically
   a `Bin` folder matching the project's target framework) — never guesses
   the path or assumes a default install location.
2. Validates the supplied path: the DLLs exist there, are the expected
   target Telerik version, and are the correct framework-specific build for
   the project's TFM.
3. Updates every referenced Telerik assembly and its `HintPath` to the new
   location — no mix of old- and new-version paths.
4. Leaves the existing Script Key / `EvidenceAttribute` licensing setup in
   place; Task 5 only verifies it still validates for the newly referenced
   assemblies. It does not alter the licensing mechanism.

See `execution.md` for how this task is invoked. This is the shared skill
also used by the `telerik-for-dotnet-framework-upgrade` and
`telerik-for-dotnet-version-upgrade` host extensions for the identical
retarget — do not re-implement these steps inline here.

### On Direct Assembly References — Optional: Move to NuGet

Task 2 mentions this **once**, briefly, framed as an optional improvement
available now or later — never as a precondition of the version upgrade:

> Moving to NuGet is available and generally preferable: simpler restore and
> version management, simpler licensing (the control packages bring in
> `Telerik.Licensing`), and no DLLs to track on disk or in source control.

If the customer **accepts**, Task 3 instead runs the existing migration
chain at the **target** version (not the current one — the version bump and
the delivery-method change land in one pass, never two): feed setup →
assembly mapping → `PackageReference` edits → licensing transition →
verification, via `telerik-winforms-nuget-feed-setup`,
`telerik-winforms-assembly-mapping`, `telerik-winforms-reference-migration`,
`telerik-winforms-license-key-setup` (or `telerik-winforms-license-nuget-migration`
if a Script Key already existed), `telerik-winforms-migration-verification`.

If the customer **declines or does not answer**, proceed with the in-place
retarget above. **Do not re-prompt, do not repeat the suggestion later in the
plan or in post-completion, and do not partially convert** — pick exactly one
delivery method for the whole project.

### Non-Interactive Runs

Never convert to NuGet. Take the in-place retarget path and note in the plan
that the NuGet option exists and was not applied.

### Prerequisite: .NET version upgrade

If the user also wants a different .NET target, the Microsoft
`dotnet-version-upgrade` scenario must complete **before** this plan is built —
the resulting .NET target determines the minimum Telerik version. Record it in
`plan.md` as a completed prerequisite; do not add .NET upgrade tasks here.

## Task Granularity

- **Breaking changes fixes**: use the finding count from the assessment. Create
  one task per file when findings are concentrated, or one task per logical
  group (e.g. all `RadGridView` usages) when findings span many files.
  Aim for batches small enough to build and validate in one pass.
- **High-risk findings** flagged by the upgrade assistant get their own task —
  never bundle them with routine renames.
- **Never bundle** the package version bump with breaking-change fixes. The bump
  must land and build (even with errors captured) before fixes begin, so the
  compiler surfaces the real API surface.

## .NET Framework Notes

.NET Framework projects work the same way, with two differences:
- Assembly references are the common case here, so the in-place retarget
  branch is the one most often exercised — plan for it as the default, not
  the NuGet branch.
- If an existing assembly-reference project already contains an
  `EvidenceAttribute`, preserve that customer configuration without
  suggesting or modifying it; only verify it still validates for the target
  version.

## Out of Scope

Do **not** add control conversion tasks to this plan, even when the assessment
detected standard Microsoft controls. Conversion is handled by the separate
`telerik-control-conversion` scenario, offered in post-completion.

## Plan Format

Write `plan.md` in the workflow folder:

```markdown
# Telerik WinForms Version Upgrade Plan

## Upgrade
- **Projects**: {list}
- **Telerik Version**: {from} → {to}
- **.NET Target**: {tfm} (unchanged)
- **Prerequisite .NET upgrade**: {completed / not applicable}
- **Breaking-change findings**: {count} across {file count} files

## Tasks

1. **{task title}**
   - Description: {what this task does}
   - Done when: {acceptance criteria}
   - Related skill: {skill name or "none"}

2. **{task title}**
   ...
```
