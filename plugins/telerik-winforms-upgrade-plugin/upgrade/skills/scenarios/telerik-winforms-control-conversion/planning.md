# Planning Stage — Telerik WinForms Control Conversion

Create the conversion plan from the assessment findings. Write the task list to
`plan.md` in the workflow folder.

## Source of Truth

The plan is derived **entirely from the assessment**:

- **Migration Playbook → task structure.** The `telerik_get_migration_plan`
  output recorded in the assessment defines the canonical step order
  (analyze → add references → convert per class → build → theme → verify).
  Follow it; do not invent a different sequence.
- **Project Analysis → setup tasks.** `hasAllControlsPackage`, `projectStyle`,
  `hasPackagesConfig`, and `windowsFormsEnabled` decide which setup tasks exist.
- **Conversion Units → conversion tasks.** Each form/user-control class pair
  becomes exactly one task.
- **Critical rules → task constraints.** Anything the playbook forbids must not
  appear as a task or a task step.

Do **not** re-run `telerik_get_migration_plan` or `telerik_analyze_project`
during planning, and do not add them as plan tasks. The playbook's critical
rules state both run **once at the start of the session** — they already did, in
assessment.

If no conversion units were found, there is nothing to plan — report that and
stop.

## Task Composition Rules

The rows below are ordered **checkpoints**, not one host task per row.
Preserve the playbook's order and every check, but group one project's related
setup checkpoints into one task and its finalization checkpoints into one task.
Skip setup actions whose trigger was not flagged during assessment.

| Order | Task | Condition | Skill |
|-------|------|-----------|-------|
| 1 | Add `Telerik.UI.for.WinForms.AllControls` via the project-mutating `telerik_add_package_reference`, then restore | `hasAllControlsPackage` is false | telerik-winforms-dependency-management |
| 2 | Verify application license activation from the setup build | Telerik version is Q1 2025+ | telerik-winforms-license-verification |
| 3 | Build baseline — confirm the project compiles before converting | Always | — |
| 4 | Convert class — **one task per conversion unit** (`.Designer.cs` + `.cs` pair) | Per in-scope unit | telerik-winforms-conversion |
| … | *(repeat task 4 for each conversion unit)* | | |
| N-2 | Full build — resolve cross-form errors | Always | — |
| N-1 | Apply Telerik theme (`telerik_get_theme_setup`) | Always | telerik-winforms-conversion |
| N | Final verification build | Always | — |

Checkpoint 2 verifies that restoring `Telerik.UI.for.WinForms.AllControls`
resolves its transitive `Telerik.Licensing` dependency and the build has no
blocking licensing diagnostics. Do not add an explicit `Telerik.Licensing`
package reference. Use the same build to establish checkpoint 3's baseline;
package presence alone is not activation evidence.

Checkpoint 3 is a compile check: it passes with 0 errors and no blocking
`TKL*` diagnostics, even when the build has warnings. Write its "Done when"
that way. Record warnings (for example an `MSB3277` conflict from the
package's dependency graph) as known issues; they are not a reason to fail the
setup task or hold back conversion. See `telerik-winforms-migration-verification`'s
**Warning Policy**.

Where the migration playbook's workflow adds steps not listed above, insert them
in the position it specifies.

## Task Granularity

The playbook mandates a "Divide and Conquer" strategy. Encode it in the plan:

- **One setup task per project**: any missing package reference, restore,
  activation verification, and the baseline build. List all checkpoints as
  explicit done conditions with the relevant skills; do not create a separate
  license task or baseline-build task for checks the setup build covers.
  If nothing needs changing, cite fresh, matching build/license evidence.
- **One task per class pair.** Each task converts `{Name}.Designer.cs` first,
  then `{Name}.cs`, then builds and fixes errors in that pair only.
- **Never batch.** Do not create a task that converts several classes, and never
  a task that converts all `.Designer.cs` files followed by all `.cs` files —
  the playbook lists that explicitly as an anti-pattern.
- **Do not pre-size conversion tasks by control count.** The assessment has no
  per-control detail by design; a task's scope is the file pair, nothing finer.
- **Do not split a class pair across tasks.** The designer file and code file
  must be converted and built together.
- **Order by dependency, then simplicity**: base/shared forms before the forms
  that derive from them; otherwise start with a small, self-contained form to
  validate the pipeline before the complex ones.
- **`itemsToReview` follow-up is part of each conversion task**, not a separate
  task — the converter only reports it per file.
- **One finalization task per project**: full build before theming, theme setup,
  then final build and required tests. These are ordered acceptance checkpoints,
  not three new workers. Reuse an existing full build only when its scope,
  configuration, toolchain, and build-relevant inputs match; a theme/config
  change requires post-change validation.

A one-project, one-form plan therefore normally has three tasks: prepare the
project, convert its class pair, and finalize. Add tasks only for actual
independent work or a prerequisite the playbook explicitly requires as a
separate task. These groupings must not remove or reorder playbook checkpoints.
Do not add a Git-initialization task when the customer declined Git; honor
their approved recovery/backup approach.

## Scope

Honor the **Conversion Scope** confirmed during pre-initialization:
- *All forms* — one task per conversion unit in the assessment.
- *Selected subset* — tasks only for the units the user picked. Record the
  skipped ones in `plan.md` so post-completion can offer them as follow-ups.

**Trial accounts** are capped at 20 conversions, and each class pair costs two.
If the assessment flagged this risk, prioritize the highest-value forms, state
the cap in `plan.md`, and warn the user before execution begins.

## Build Method

Carry the assessment's build-method decision into every task that builds:
- SDK-style projects → `dotnet build`
- Classic-style .NET Framework projects built outside Visual Studio →
  **Visual Studio MSBuild**, per the playbook's `errorHandling.classicProjectBuild`

## Plan Format

Write `plan.md` in the workflow folder:

```markdown
# Telerik WinForms Control Conversion Plan

## Scope
- **Projects**: {list}
- **Telerik Version**: {version} ({installed now / already referenced})
- **Conversion units in scope**: {count} of {total}
- **Units deferred**: {list or "none"}
- **Build method**: `dotnet build` / Visual Studio MSBuild
- **Trial cap risk**: {yes — details / no}

## Tasks

1. **{task title}**
   - Description: {what this task does}
   - Files: {Form1.Designer.cs, Form1.cs} *(conversion tasks only)*
   - Done when: {acceptance criteria — converted, builds with 0 errors and no blocking `TKL*` diagnostics (other warnings reported as known issues), itemsToReview resolved}
   - Related skill: {skill name or "none"}

2. **{task title}**
   ...
```
