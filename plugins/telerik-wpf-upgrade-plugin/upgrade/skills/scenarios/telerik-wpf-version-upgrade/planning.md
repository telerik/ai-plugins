# Planning Stage — Telerik WPF Version Upgrade

Create the upgrade plan from the assessment findings. Write the task list to
`plan.md` in the workflow folder.

## Task Composition Rules

Tasks are ordered by dependency — earlier tasks must complete before later ones.
Skip any task whose additive concern was not flagged during assessment.

| Order | Task | Condition | Skill |
|-------|------|-----------|-------|
| 0 | Ask the user which flavor (Xaml or NoXaml) to converge on | Mixed or unknown flavor recorded — blocks every later task | telerik-wpf-xaml-flavor |
| 1 | Verify the target Telerik version supports the project's .NET target | Always | telerik-wpf-dependency-management |
| 2 | Present the NuGet option once, and record the customer's answer | Delivery method is direct assembly references (skip entirely — never ask — if already NuGet) | scenario-level prompt — see *Delivery Method Branch*, not a lazy skill |
| 3 | Upgrade the Telerik version via the resolved delivery-method branch, keeping the flavor | Always | branch-dependent — see *Delivery Method Branch* |
| 4 | Refresh copied theme XAML from the target version's `Themes.Implicit` folder (user supplies the folder) | NoXaml project with copied theme XAML | telerik-wpf-xaml-flavor |
| 5 | Set up application license activation | Crossing the Q1 2025 boundary AND no working mechanism exists yet | telerik-wpf-license-key-setup / telerik-wpf-license-nuget-migration |
| 6 | Verify application license activation | Always, whenever the **target** version is Q1 2025 or later — regardless of whether Task 5 ran | telerik-wpf-license-verification |
| 7 | Detect breaking changes | Always | telerik-wpf-breaking-changes |
| 8 | Fix breaking changes — **batched by file or feature area** | Findings > 0 | telerik-wpf-breaking-changes, telerik-wpf-component-guidance |
| … | *(repeat task 8 per batch)* | | |
| N | Build, validate, and run tests | Always | telerik-wpf-migration-verification |

Task 0 is a blocker task, not a code change: list the conflicting references
and get an explicit decision from the user. Do not choose a flavor, and do
not start any upgrade task until it is resolved. This scenario never offers
or performs a flavor switch on its own.

Task 4 never guesses the folder and never hand-edits theme XAML. If the user
defers it, keep it in the plan as an open item with its risk (missing or
stale styles at run time).

Task 5 applies on both branches: transitively via `Telerik.Licensing` on
NuGet, or by verifying (not replacing) an existing Script Key /
`EvidenceAttribute` on assembly references. If the assessment found an
existing `EvidenceAttribute`, preserve it unchanged. For a class library,
the task covers the consuming application too.

**Task 6 is never skipped just because Task 5 didn't run.** A project that
was already past the Q1 2025 boundary before this upgrade (so Task 5 has
nothing to set up) still needs its activation confirmed against the
**target** version by an actual build — do not treat transitive
`Telerik.Licensing` delivery via NuGet as self-evidently working. Add Task 6
to the plan explicitly, even when its write-up is short, rather than folding
it silently into the final build task.

## Delivery Method Branch

Tasks 2 and 3 above resolve differently depending on the delivery method
recorded in assessment — this is the core branch for this scenario. Never
block Task 1 or Task 3's version resolution on how this branch resolves.

### Already on NuGet

Skip Task 2 entirely — do not ask about NuGet, there is nothing to ask. Task
3 is a plain package version bump: update the `Version` attribute on every
Telerik UI `PackageReference` (feature, theme, and `AllControls` packages of
the project's flavor) to the target version, and every flavor-neutral
Document Processing package to the version the target UI packages depend
on. Confirm the feed the target version needs resolves.
Skills: `telerik-wpf-dependency-management`, `telerik-wpf-nuget-feed-setup`.

### On Direct Assembly References — Default: Upgrade In Place

Task 3's default is the **in-place retarget** — a complete, fully supported
path, not a degraded fallback. Delegate it to
`telerik-wpf-reference-retargeting`, which:
1. Asks the customer where the target version's DLLs are located — the
   folder matching the project's flavor (`Binaries\` for Xaml,
   `Binaries.NoXaml\` for NoXaml) and target framework (e.g. `WPF462` or
   `WPF80` for `2026.3.1007`) — never guesses the path or assumes a default
   install location.
2. Validates the supplied path: the DLLs exist there, are the expected
   target Telerik version, are the project's flavor, and are the correct
   framework-specific build for the project's TFM; for NoXaml, every
   referenced theme DLL exists there.
3. Updates every referenced Telerik assembly and its `HintPath`, including
   theme assemblies, to the new location — no mix of old- and new-version
   paths.
4. Leaves the existing Script Key / `EvidenceAttribute` licensing setup in
   place; Task 6 only verifies it still validates for the newly referenced
   assemblies. It does not alter the licensing mechanism.

See `execution.md` for how this task is invoked. This is the shared skill
also used by the `telerik-wpf-for-dotnet-framework-upgrade` and
`telerik-wpf-for-dotnet-version-upgrade` host extensions for the identical
retarget — do not re-implement these steps inline here.

### On Direct Assembly References — Optional: Move to NuGet

Task 2 mentions this **once**, briefly, framed as an optional improvement
available now or later — never as a precondition of the version upgrade:

> Moving to NuGet is available and generally preferable: simpler restore and
> version management, simpler licensing (the control packages bring in
> `Telerik.Licensing`), and no DLLs to track on disk or in source control.

When the project targets modern .NET, add one sentence to that same mention:

> On .NET, Visual Studio Toolbox and design-time support for Telerik UI for
> WPF require the NuGet packages.

If the customer **accepts**, Task 3 instead runs the existing migration
chain at the **target** version (not the current one — the version bump and
the delivery-method change land in one pass, never two), with packages of
the project's flavor: feed setup → assembly mapping → `PackageReference`
edits → licensing transition → verification, via
`telerik-wpf-nuget-feed-setup`, `telerik-wpf-assembly-mapping`,
`telerik-wpf-reference-migration`, `telerik-wpf-license-key-setup` (or
`telerik-wpf-license-nuget-migration` if a Script Key already existed),
`telerik-wpf-migration-verification`.

If the customer **declines or does not answer**, proceed with the in-place
retarget above. **Do not re-prompt, do not repeat the suggestion later in the
plan or in post-completion, and do not partially migrate** — pick exactly one
delivery method for the whole project.

### Non-Interactive Runs

Never move to NuGet. Take the in-place retarget path and note in the plan
that the NuGet option exists and was not applied.

### Prerequisite: .NET version upgrade

If the user also wants a different .NET target, the Microsoft
`dotnet-version-upgrade` (or `dotnet-framework-version-upgrade`) scenario
must complete **before** this plan is built — the resulting .NET target
determines the minimum Telerik version. Record it in `plan.md` as a
completed prerequisite; do not add .NET upgrade tasks here, and never change
the target framework.

## Task Granularity

- **Breaking changes fixes**: use the finding count from the assessment. Create
  one task per file when findings are concentrated, or one task per logical
  group (e.g. all `RadGridView` usages) when findings span many files.
  Keep a view's `.xaml` and its code-behind in the same batch.
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

## Plan Format

Write `plan.md` in the workflow folder:

```markdown
# Telerik WPF Version Upgrade Plan

## Upgrade
- **Projects**: {list}
- **Telerik Version**: {from} → {to}
- **Flavor**: {Xaml / NoXaml per project} (unchanged)
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
