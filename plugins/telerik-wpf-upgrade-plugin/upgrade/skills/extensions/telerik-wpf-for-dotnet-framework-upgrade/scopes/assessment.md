# Assessment — Telerik Rules for .NET Framework Version Upgrade

Run alongside the host's own assessment. Record findings under a Telerik
subsection so planning can read them.

## Step 0: Telerik Presence Gate

Before anything else, run a plain text search over the in-scope projects'
`.csproj`/`.vbproj` and `packages.config` files for the literal string
`Telerik` (case-insensitive) — a grep-style match, not a structured parse.
Every Telerik UI for WPF assembly name and package id carries the
`Telerik.` prefix (see `telerik-wpf-reference-detection`). This is the only
step every run needs.

If the pattern does not appear in any in-scope project, record `Telerik UI
for WPF: not present` and **stop** — do not run Step 1 or Step 2, and do not
load `telerik-wpf-reference-detection` or consult the compatibility matrix.
There is nothing for this extension to contribute.

If the pattern appears in at least one project, proceed to Step 1 for the
full per-project classification.

## Step 1: Detect Reference Style, Version, and Flavor

Load `telerik-wpf-reference-detection` for every in-scope WPF project that
referenced Telerik in Step 0. Record, per project:
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown")
- Flavor: Xaml, NoXaml, mixed, or unknown — from `telerik-wpf-xaml-flavor`,
  including whether a NoXaml project merges theme XAML copied from
  `Themes.Implicit`

A mixed or unknown flavor is a blocker: record every conflicting reference so
planning can ask the user which flavor to converge on. Do not choose one.

If this fuller check also finds no Telerik reference in any project — the
Step 0 text match was a false positive (e.g. a comment, a string literal, or
an unrelated `Telerik`-named identifier) — record `Telerik UI for WPF: not
present` and **stop** here. Do not run Step 2.

## Step 2: Verify net481 Compatibility

Consult the `telerik-wpf-dependency-management` compatibility matrix.
Do not assume a bump is needed just because the TFM is changing — every
Telerik UI for WPF .NET Framework distribution (4.0, 4.5, 4.6.2) runs on
.NET Framework 4.8.1, so net4xx → net481 rarely requires one.

- **Current version already supports net481**: no Telerik version change
  needed. Record this plainly so planning doesn't invent one.
- **Current version does not support net481**: a Telerik version bump is
  required regardless of the NuGet decision below — record the minimum
  version that does.

## Step 3: Record for Planning

```markdown
### Telerik UI for WPF
- **Reference style**: assembly / NuGet / packages.config / mixed
- **Flavor**: Xaml / NoXaml / mixed (blocker) / unknown (blocker)
- **Copied theme XAML (NoXaml)**: Yes / No
- **Current version**: {version or "unknown"}
- **Supports net481**: Yes / No (minimum compatible version: {version})
- **Assembly references present**: {list, or "none"}
```

Do not decide the NuGet question here — that is a customer choice made in
Planning, not a fact to assess.
