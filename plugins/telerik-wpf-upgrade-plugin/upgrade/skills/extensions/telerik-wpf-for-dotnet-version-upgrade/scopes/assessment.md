# Assessment — Telerik Rules for the .NET Version Upgrade

## Step 0: Telerik Presence Gate

Before determining B1 vs. B2 or anything else, run a plain text search over
the in-scope projects' `.csproj`/`.vbproj` and `packages.config` files for
the literal string `Telerik` (case-insensitive) — a grep-style match, not a
structured parse. Every Telerik UI for WPF assembly name and package id
carries the `Telerik.` prefix (see `telerik-wpf-reference-detection`).

If the pattern does not appear in any in-scope project, record `Telerik UI
for WPF: not present` and **stop** — do not run Step 1 through Step 5, and
do not load `telerik-wpf-reference-detection`. There is nothing for this
extension to contribute, regardless of which situation the host's upgrade is
otherwise in.

If the pattern appears in at least one project, proceed to Step 1.

## Step 1: Determine the Situation — Do Not Assume

Load `telerik-wpf-reference-detection` and read the **source** project's
current TFM and project style:

- **B1 — source is already modern .NET** (`net5.0-windows` and later, or
  `netcoreapp3.1`): the light-touch path.
- **B2 — source is .NET Framework**: the heavy path.

Record which situation applies; every later step branches on it.

This same call also reports reference style and flavor. If it finds no
Telerik reference in any project — the Step 0 text match was a false
positive (e.g. a comment, a string literal, or an unrelated `Telerik`-named
identifier) — record `Telerik UI for WPF: not present` and **stop** here. Do
not run Step 2 through Step 5.

## Step 2: Detect Reference Style, Version, and Flavor (Both Situations)

For every in-scope WPF project that referenced Telerik in Step 0, record:
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown")
- Flavor: Xaml, NoXaml, mixed, or unknown — from `telerik-wpf-xaml-flavor`,
  including its theming setup for NoXaml projects (theme assemblies or
  packages, and whether theme XAML was copied from `Themes.Implicit`)

**B1 expectation**: should already be NuGet — check anyway, don't assume.
Direct assembly references found here are not a legitimate end state; record
them the same way B2 does, since they trigger the identical mandatory
migration (see Planning).

**B2 expectation**: direct assembly references and/or `packages.config` are
the common case. Also record every .NET Framework-only assembly referenced
(see `telerik-wpf-assembly-mapping` Step 2) — RichTextBox-related
assemblies to be replaced, `Telerik.Windows.Controls.EntityFramework60`
(blocker), `Telerik.Windows.Documents.Proofing.Dictionaries.En-US` (no .NET
package).

**Mixed or unknown flavor** is a blocker on either path: record every
conflicting reference. The migration does not run — not even partially —
until the user decides which flavor to converge on; do not choose one.

## Step 3: Verify Telerik Support for the New Target TFM

Consult the `telerik-wpf-dependency-management` compatibility matrix
against the **resulting** TFM (from the host's own target-framework
decision), not the source one. The resulting TFM carries the `-windows` suffix
(e.g. `net10.0-windows`) — use the full resulting TFM string, not just the
numeric version, when checking compatibility and later selecting packages.

- **B1**: this is the dominant concern — the currently referenced version may
  not support the newer modern TFM even though nothing else about the
  reference style needs to change. A version built for an out-of-support
  distribution (.NET 6/7, .NET Core 3.1) is not an acceptable result; use
  one from the supported .NET 8 distribution.
- **B2**: treat a version change as **likely**, not incidental — older
  Telerik versions typically do not ship a supported .NET distribution.
  Verify rather than assume, but expect to find one.

For `net8.0-windows`, `net9.0-windows`, and `net10.0-windows` the minimum is
the first release with the .NET 8 distribution (2024 Q4). If the current
version supports the resulting TFM, keep it. Otherwise select the **lowest**
version that supports it — prefer the minimal viable jump over "latest" so
the delta stays reviewable. If no version supports the resulting TFM, stop
and report; do not guess a version number.

## Step 4: Resolve Feed Availability for the Chosen Version

Before finalizing the candidate version from Step 3, confirm the feed that
would serve it is actually usable — load `telerik-wpf-nuget-feed-setup`:

- Version `2026.3.812` or later → NuGet.org, normally already available.
- Version before `2026.3.812` → the Telerik NuGet server is required;
  confirm it actually resolves the specific package(s) needed, for the
  project's flavor, not just that a source is registered.

If the candidate version's feed can't be resolved (unreachable, failing
auth, and no fix available now), treat that version as **not obtainable**
and re-check Step 3 for a higher obtainable version that still meets the TFM
requirement. If none exists, this is a blocker — record it plainly.

**On B2**, this check is doubly load-bearing: the whole migration is
blocked, not just deferred, if no obtainable version can be served. Surface
that now rather than letting it appear only during execution.

## Step 5: Record for Planning

```markdown
### Telerik UI for WPF
- **Situation**: B1 (modern → newer modern) / B2 (Framework → modern)
- **Reference style**: assembly / NuGet / packages.config / mixed
- **Flavor**: Xaml / NoXaml / mixed (blocker) / unknown (blocker)
- **NoXaml theming**: theme assemblies or packages / copied `Themes.Implicit` XAML: {list, or "n/a"}
- **Current version**: {version or "unknown"}
- **Resulting target TFM**: {tfm, including the `-windows` suffix}
- **Supports target TFM**: Yes / No (minimum compatible version: {version})
- **Chosen version**: {current, unchanged / lowest obtainable version that supports the target TFM}
- **Feed required for chosen version**: NuGet.org / Telerik NuGet server — resolved: {Yes/No}
- **Assembly references present**: {list, or "none"}
- **.NET Framework-only assemblies (B2)**: {list with replacement / blocker / no package, or "none"}
- **Migration to NuGet**: mandatory if assembly references are present — on
  either B1 or B2 — not a decision point
```

Planning turns this record directly into mandatory tasks on either path —
there is no upgrade option to contribute for Telerik's delivery method on
B1 or B2.
