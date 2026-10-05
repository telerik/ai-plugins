---
name: telerik-for-dotnet-version-upgrade
description: >
  Telerik UI for WinForms rules for a .NET version upgrade to newer modern
  .NET — covers both modern-.NET-to-newer-modern-.NET (B1) and .NET
  Framework-to-modern-.NET (B2) sources. Determines which situation applies,
  verifies the Telerik version against the new target TFM, and mandatorily
  migrates Telerik direct assembly references to NuGet packages whenever found on a
  modern .NET target — the Visual Studio designer only supports Telerik
  controls via NuGet there, regardless of whether the project just arrived
  on modern .NET (B2) or was already on it (B1) — transitioning licensing
  accordingly.
metadata:
  discovery: scenarioExtension
  extends-scenario: [dotnet-version-upgrade]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  order: 100
  scope: [Assessment, Planning, Execution, IntegrityReview]
  scopeInstructions:
    Assessment: scopes/assessment.md
    Planning: scopes/planning.md
    Execution: scopes/execution.md
---

# Telerik UI for WinForms rules for the .NET version upgrade

`dotnet-version-upgrade` covers two different source situations, and this
extension serves both — determine which one applies before anything else;
never assume from the target alone.

- **B1 — Modern → newer modern** (e.g. net8.0 → net10.0): usually
  light-touch. Reference style is normally already NuGet, so the reference
  migration is typically a no-op — verify, don't assume. **Direct assembly
  references are not a legitimate end state here**: a project already on
  modern .NET has no excuse for missing NuGet, for the same designer-support
  reason that makes it mandatory on B2. If found, migrate unconditionally —
  do not offer it as a choice.
- **B2 — .NET Framework → modern .NET** (e.g. net472 → net10.0-windows):
  the heaviest path, and the one this update changes. Migrating direct
  Telerik assembly references to NuGet is **mandatory** — there is no
  assembly-reference outcome on this path. See *Why NuGet Is Mandatory on
  Modern .NET* below.

## Why NuGet Is Mandatory on Modern .NET (Both B1 and B2)

In modern .NET WinForms projects, the Visual Studio designer only supports
Telerik controls consumed via NuGet package references — direct assembly
references are not supported by the designer there. A project that kept
assembly references would compile and run but lose Telerik design-time
support in Visual Studio, which is a broken development experience, not a
style preference. This holds regardless of how the project reached modern
.NET, so migration is required unconditionally whenever assembly references
are found on either path — not just on B2, and not as a recommendation on
B1 (see `planning.md` for the exact user-facing wording, stated once at
plan time).

This reasoning applies to modern .NET WinForms projects specifically; it
does not apply to, and must not be cited for, .NET Framework projects.

**The rule that always holds**: the referenced Telerik version must support
the *resulting* TFM — verify against `telerik-winforms-dependency-management`
in both situations, never assume a bump is or isn't needed. Resolve NuGet
feed availability for the candidate version **before** finalizing it (see
`assessment.md`) — on B2 this gates the entire migration, since it cannot
proceed without a feed that serves the required version.

**Telerik presence is this extension's own responsibility to detect** — the
host's traits (`.NET`, `WinForms`) only say the repository is a .NET WinForms
solution, not that Telerik specifically is referenced. Assessment checks for
that, once, before determining B1 vs. B2 or anything else. If no project
references Telerik, Planning, Execution, and IntegrityReview all contribute
nothing and must not re-inspect the project themselves.

This body is what the `IntegrityReview` scope receives. When reviewing the
resulting change, confirm that:
- the Telerik version referenced supports the new target TFM, and the feed
  serving it was resolved before the version was finalized;
- every Telerik `<Reference>`/`HintPath` and `packages.config` entry is
  gone, on **either** path — migration to NuGet is unconditional whenever
  assembly references are found, so no such entry should survive under any
  circumstance, including customer preference; licensing uses transitive
  `Telerik.Licensing`, and any prior `EvidenceAttribute` was removed, not
  left in place;
- every added Telerik package shares one version;
- this extension's work landed inside the host's own stages — not as a
  separate, competing flow;
- a blocked migration was reported clearly (with the designer-support
  consequence) rather than silently left on assembly references or
  partially migrated.

This skill is a **scenario extension**: no workflow of its own, never
user-selectable. It calls into `telerik-winforms-reference-detection` (both
paths), `telerik-winforms-dependency-management` (both paths),
`telerik-winforms-nuget-feed-setup` (both paths, when NuGet applies),
`telerik-winforms-assembly-mapping` (both paths, when migrating),
`telerik-winforms-reference-migration` (both paths, when migrating),
`telerik-winforms-license-detection`, `telerik-winforms-license-key-setup`,
`telerik-winforms-license-nuget-migration` (both paths),
`telerik-winforms-breaking-changes` (both paths), and
`telerik-winforms-migration-verification` (both paths) for the mechanics.
