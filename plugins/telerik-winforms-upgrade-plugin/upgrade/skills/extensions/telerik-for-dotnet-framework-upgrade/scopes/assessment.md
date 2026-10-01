# Assessment — Telerik Rules for .NET Framework Version Upgrade

Run alongside the host's own assessment. Record findings under a Telerik
subsection so planning can read them.

## Step 0: Telerik Presence Gate

Before anything else, run a plain text search over the in-scope projects'
`.csproj`/`.vbproj` and `packages.config` files for the literal strings
`Telerik` and `UI.for.WinForms` (case-insensitive) — a grep-style match, not
a structured parse. The second pattern catches pre-`2026.3.812` package ids,
which don't carry the `Telerik.` prefix (see `telerik-winforms-assembly-mapping`).
This is the only step every run needs.

If neither pattern appears in any in-scope project, record `Telerik UI for
WinForms: not present` and **stop** — do not run Step 1 or Step 2, and do not
load `telerik-winforms-reference-detection` or consult the compatibility
matrix. There is nothing for this extension to contribute.

If either pattern appears in at least one project, proceed to Step 1 for the
full per-project classification.

## Step 1: Detect Reference Style and Version

Load `telerik-winforms-reference-detection` for every in-scope WinForms
project that referenced Telerik in Step 0. Record, per project:
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown")

If this fuller check also finds no Telerik reference in any project — the
Step 0 text match was a false positive (e.g. a comment, a string literal, or
an unrelated `Telerik`-named identifier) — record `Telerik UI for WinForms:
not present` and **stop** here. Do not run Step 2.

## Step 2: Verify net481 Compatibility

Consult the `telerik-winforms-dependency-management` compatibility matrix.
Do not assume a bump is needed just because the TFM is changing — net4xx →
net481 rarely requires one.

- **Current version already supports net481**: no Telerik version change
  needed. Record this plainly so planning doesn't invent one.
- **Current version does not support net481**: a Telerik version bump is
  required regardless of the NuGet decision below — record the minimum
  version that does.

## Step 3: Record for Planning

```markdown
### Telerik UI for WinForms
- **Reference style**: assembly / NuGet / packages.config / mixed
- **Current version**: {version or "unknown"}
- **Supports net481**: Yes / No (minimum compatible version: {version})
- **Assembly references present**: {list, or "none"}
```

Do not decide the NuGet question here — that is a customer choice made in
Planning, not a fact to assess.
