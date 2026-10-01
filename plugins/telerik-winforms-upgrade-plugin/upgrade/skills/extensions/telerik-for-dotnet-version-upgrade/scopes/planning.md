# Planning — Telerik Rules for the .NET Version Upgrade

If Assessment recorded `Telerik UI for WinForms: not present`, contribute
nothing here — stop immediately. Do not re-inspect the project; rely on the
Assessment record.

Otherwise, contribute Telerik-specific tasks and, on B1 only, an upgrade
option. Read the recorded situation (B1/B2) from assessment first — the two
branches share every underlying skill and differ in applicability and, on
B2, in whether NuGet migration is even a decision point (it isn't).

## Version Decision (Both Paths)

State plainly, as a prominent, early item in the plan — not left implicit or
folded into a later task:
- Current Telerik version, the chosen target version, and why a change is
  required (if it is).
- That breaking changes are possible at the new version.
- That the feed serving the chosen version was already confirmed in
  assessment (Step 4 there).

On B2 a version change is near-certain — treat it accordingly rather than as
a late surprise during execution.

## B1 — Modern → Newer Modern

- **Already NuGet, version already supports the target TFM**: nothing to
  add. This is the common case — often the whole contribution is "no action
  needed."
- **Already NuGet, version does not support the target TFM**: add one task —
  a Telerik version bump (`telerik-winforms-breaking-changes` for the API
  impact, `telerik-winforms-reference-migration` for the version string).
  No package-id changes are needed; the project is already on the right
  packages.
- **Unexpected direct assembly references found**: offer the migration as a
  choice via the *Upgrade Option* below — this is the only path where that
  option exists.

### Upgrade Option — B1 Only

**Telerik UI for WinForms migration** — choose `Migrate to NuGet packages`
(recommended) or `Keep direct assembly references` (a supported outcome on
B1). This consent gate — and the `telerik-winforms-reference-retargeting`
fallback it leads to when declined — applies **only to B1**; see the
asymmetry note in `SKILL.md`.

Recommended-path wording (state once if assembly references are found; do
not repeat):

> Moving to NuGet is recommended here: in modern .NET WinForms projects, the
> Visual Studio designer only supports Telerik controls consumed via NuGet,
> so keeping assembly references means no design-time support for them. You
> can keep assembly references if you prefer — this stays optional on this
> path.

**Plan impact**:
- `Migrate to NuGet packages` adds: feed setup (already resolved in
  assessment; execute if not yet configured), assembly → package mapping,
  `PackageReference` edits with `packages.config` removal, and the
  `Telerik.Licensing` transition — via `telerik-winforms-nuget-feed-setup`,
  `telerik-winforms-assembly-mapping`, `telerik-winforms-reference-migration`,
  `telerik-winforms-license-key-setup` (or `telerik-winforms-license-nuget-migration`
  if a Script Key already existed).
- `Keep direct assembly references` still needs the version bump when
  required: retarget the assembly references to the new version via
  `telerik-winforms-reference-retargeting`, and set up Script Key licensing
  if the bump crosses Q1 2025 — see Execution.

## B2 — Framework → Modern: Mandatory Migration, No Upgrade Option

There is **no upgrade option** here — do not present a choice, do not add a
consent-gate task, and do not invoke `telerik-winforms-reference-retargeting`
on this path. Migrating to NuGet is a required part of reaching a working
modern .NET project, exactly like any other mandatory step the host
scenario performs — not a recommendation, not a question, not opt-in.

State the reason exactly once, in the plan, before any project edits are
made:

> Migrating your direct Telerik assembly references to NuGet packages is
> required as part of this upgrade, not optional: in modern .NET WinForms
> projects, the Visual Studio designer only supports Telerik controls
> consumed via NuGet, so this migration is what keeps Telerik controls
> usable in the designer after the .NET upgrade.

Do not repeat this at every later task or in execution reporting — say it
once, here.

**Tasks added, all mandatory** (feed into the host's own task list at the
appropriate points; none is conditional on customer choice):
1. Confirm feed availability for the chosen version (already resolved in
   assessment; execute setup here if not yet configured) —
   `telerik-winforms-nuget-feed-setup`.
2. Resolve the minimal package set from the assembly reference map —
   `telerik-winforms-assembly-mapping`, following
   `telerik-winforms-dependency-management`'s package-selection policy
   (map-driven minimal set by default; `AllControls` only under its own
   criteria — do not override that policy here).
3. Convert `packages.config`/assembly references to `PackageReference` —
   `telerik-winforms-reference-migration` (this also removes the superseded
   assembly references and `packages.config` entries).
4. Transition licensing to the NuGet-based mechanism —
   `telerik-winforms-license-nuget-migration`. If an existing Script Key /
   `EvidenceAttribute` is present, this task replaces it; do not leave it in
   place alongside the new `Telerik.Licensing` dependency.
5. Fix API-level breaking changes for the resolved version —
   `telerik-winforms-breaking-changes`.
6. Verify — folded into the host's own restore/build verification (see
   Execution).

### If the Migration Cannot Be Completed

If no obtainable Telerik version supports the resulting TFM (assessment
Steps 3–4), or a referenced assembly has no mapping and can't be resolved
another way, **stop and report** — include the designer-support consequence
of not completing it. Do not fall back to leaving assembly references in
place, and do not partially migrate (e.g. converting some packages but not
others, or switching delivery method without transitioning licensing). A
blocked B2 migration is a reportable failure for the user to resolve (e.g.
supply Telerik NuGet server credentials, or confirm how to handle an
unmapped assembly) — it is not a reason to downgrade the outcome to "kept
assembly references."

## Contribute, Don't Compete

The host scenario is already performing a substantial migration here (TFM
change, project-style conversion, package updates). Add Telerik tasks into
its plan at the appropriate points — do not propose a separate Telerik
migration phase that runs outside the host's own task list.
