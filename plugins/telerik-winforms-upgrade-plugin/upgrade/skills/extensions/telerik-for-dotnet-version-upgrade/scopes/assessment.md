# Assessment — Telerik Rules for the .NET Version Upgrade

## Step 0: Telerik Presence Gate

Before determining B1 vs. B2 or anything else, run a plain text search over
the in-scope projects' `.csproj`/`.vbproj` and `packages.config` files for
the literal strings `Telerik` and `UI.for.WinForms` (case-insensitive) — a
grep-style match, not a structured parse. The second pattern catches
pre-`2026.3.812` package ids, which don't carry the `Telerik.` prefix (see
`telerik-winforms-assembly-mapping`).

If neither pattern appears in any in-scope project, record `Telerik UI for
WinForms: not present` and **stop** — do not run Step 1 through Step 3, and
do not load `telerik-winforms-reference-detection`. There is nothing for
this extension to contribute, regardless of which situation the host's
upgrade is otherwise in.

If either pattern appears in at least one project, proceed to Step 1.

## Step 1: Determine the Situation — Do Not Assume

Load `telerik-winforms-reference-detection` and read the **source** project's
current TFM and project style:

- **B1 — source is already modern .NET** (net6.0+): the light-touch path.
- **B2 — source is .NET Framework**: the heavy path.

Record which situation applies; every later step branches on it.

This same call also reports reference style. If it finds no Telerik
reference in any project — the Step 0 text match was a false positive (e.g.
a comment, a string literal, or an unrelated `Telerik`-named identifier) —
record `Telerik UI for WinForms: not present` and **stop** here. Do not run
Step 2 or Step 3.

## Step 2: Detect Reference Style and Version (Both Situations)

For every in-scope WinForms project that referenced Telerik in Step 0,
record:
- Reference style: assembly, NuGet, packages.config, or mixed
- Current Telerik version (or "unknown")

**B1 expectation**: usually already NuGet. A project can still legally carry
direct assembly references via `HintPath` — check anyway, don't assume.

**B2 expectation**: direct assembly references and/or `packages.config` are
the common case.

## Step 3: Verify Telerik Support for the New Target TFM

Consult the `telerik-winforms-dependency-management` compatibility matrix
against the **resulting** TFM (from the host's own target-framework
decision), not the source one. On B2 the resulting TFM commonly carries an
OS-specific suffix (e.g. `net10.0-windows`) — use the full resulting TFM
string, not just the numeric version, when checking compatibility and later
selecting packages.

- **B1**: this is the dominant concern — the currently referenced version may
  not support the newer modern TFM even though nothing else about the
  reference style needs to change.
- **B2**: treat a version change as **likely**, not incidental — older
  Telerik versions typically do not support a modern-.NET TFM. Verify rather
  than assume, but expect to find one.

If the current version supports the resulting TFM, keep it. Otherwise select
the **lowest** version that supports it — prefer the minimal viable jump over
"latest" so the delta stays reviewable. If no version supports the resulting
TFM, stop and report; do not guess a version number.

## Step 4: Resolve Feed Availability for the Chosen Version

Before finalizing the candidate version from Step 3, confirm the feed that
would serve it is actually usable — load `telerik-winforms-nuget-feed-setup`:

- Version `2026.3.812` or later → NuGet.org, normally already available.
- Version before `2026.3.812` → the Telerik NuGet server is required;
  confirm it actually resolves the specific package(s) needed, not just that
  a source is registered.

If the candidate version's feed can't be resolved (unreachable, failing
auth, and no fix available now), treat that version as **not obtainable**
and re-check Step 3 for a higher obtainable version that still meets the TFM
requirement. If none exists, this is a blocker — record it plainly.

**On B2**, this check is doubly load-bearing: the whole migration is
blocked, not just deferred, if no obtainable version can be served. Surface
that now rather than letting it appear only during execution.

## Step 5: Record for Planning

```markdown
### Telerik UI for WinForms
- **Situation**: B1 (modern → newer modern) / B2 (Framework → modern)
- **Reference style**: assembly / NuGet / packages.config / mixed
- **Current version**: {version or "unknown"}
- **Resulting target TFM**: {tfm, including OS-specific suffix if any}
- **Supports target TFM**: Yes / No (minimum compatible version: {version})
- **Chosen version**: {current, unchanged / lowest obtainable version that supports the target TFM}
- **Feed required for chosen version**: NuGet.org / Telerik NuGet server — resolved: {Yes/No}
- **Assembly references present**: {list, or "none"}
- **On B2, migration to NuGet**: mandatory — not a decision point
```

Do not decide the NuGet question here on B1 — Planning contributes it as an
upgrade option there. On B2 there is no question to defer; Planning turns
this record directly into mandatory tasks.
