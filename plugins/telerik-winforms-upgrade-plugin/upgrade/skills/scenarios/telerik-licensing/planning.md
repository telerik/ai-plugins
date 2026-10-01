# Planning Stage — Telerik WinForms Licensing

Turn the assessment into a task list. Write `plan.md` in the workflow
folder.

## Branch on Assessment

For each project (or group of projects sharing a mechanism), pick exactly
one branch — do not run more than one for the same project:

| Assessment finding | Task | Skill |
|---|---|---|
| `mcpLicensePresent: No`, regardless of whether any project references Telerik | Set up the shared MCP-prerequisite key | `telerik-winforms-license-key-setup` |
| `mcpLicenseCliValidation: Reports no usable license`, or `winformsProductLicenseStatus: Not listed/Expired` | Refresh or replace the shared MCP-prerequisite key | `telerik-winforms-license-key-setup` |
| No project references Telerik, and `mcpLicensePresent: Yes` with no CLI report of an unusable WinForms license | Nothing to do — report it, skip every row below | — |
| `mechanism: none` and license required | Set up recommended activation | `telerik-winforms-license-key-setup` |
| A `TKL*` code, watermark, or other symptom was reported | Diagnose, then apply the matching fix | `telerik-winforms-license-diagnostics` → named fix skill |
| `mechanism: script-key` | Offer migration (see policy below) | `telerik-winforms-license-nuget-migration` if accepted; otherwise nothing |
| `mechanism: hybrid-manual-registration` (add-in/plugin) | Verify only — this is the documented correct state, not a defect | `telerik-winforms-license-verification` |
| `mechanism: openedge-manual-registration` (OpenEdge) | Verify only — OpenEdge cannot use NuGet, so this is the permanent, correct state, not a defect | `telerik-winforms-license-verification` |
| Solution-level `consistent: No` | Converge every eligible project onto the NuGet-based model; leave only documented-exception projects on script-key | `telerik-winforms-license-nuget-migration` per eligible project |
| CI/CD pipeline detected, or customer asked | Configure CI/CD activation | `telerik-winforms-license-cicd-setup` |
| Always | Final verification | `telerik-winforms-license-verification` |

## Migration Offer (State Once)

If any project has `mechanism: script-key` and no exception applies, state
the recommendation once, in the plan, before any edits:

> Moving to the NuGet-based licensing model is recommended: it activates
> automatically through the `Telerik.Licensing` package, needs no compiled
> script key per project, and simplifies future license renewals.

If the customer accepts, add the migration task. If they decline or don't
answer, do not add it, and do not repeat the offer later in the plan or in
post-completion — proceed with keeping the script key working correctly
instead.

## Confirm the Exception Before Skipping Migration

Before marking a script-key project as exempt from the migration offer,
confirm — do not assume — that it truly cannot use NuGet packages. OpenEdge
hosts are always exempt — OpenEdge does not support NuGet at all. Add-in and
plugin hosts are **not** exempt; they take the hybrid path (NuGet package +
kept `EvidenceAttribute`), which is a `telerik-winforms-license-key-setup`
task, not a "leave alone" outcome.

## CI/CD Task

Only add a CI/CD configuration task if assessment recorded a detected
pipeline, or the customer explicitly asked for it. Do not add it
speculatively.

## Ordering

1. Fix anything broken first (diagnostics → fix skill) — a broken mechanism
   should not be migrated on top of.
2. Set up anything missing.
3. Offer/perform migration.
4. Configure CI/CD, if applicable.
5. Verify — always last.

## Out of Scope

Do not add tasks for changing the Telerik product version or migrating
control assembly references to NuGet — those belong to `telerik-version-upgrade` and
`telerik-assembly-to-nuget` respectively.

## Plan Format

```markdown
# Telerik WinForms Licensing Plan

## Projects
- {list, with current mechanism per project}

## Tasks

1. **{task title}**
   - Description: {what this task does}
   - Done when: {acceptance criteria}
   - Related skill: {skill name}

2. **{task title}**
   ...
```
