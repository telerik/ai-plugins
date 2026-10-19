---
name: telerik-wpf-for-dotnet-version-upgrade
description: >
  Telerik UI for WPF rules for a .NET version upgrade to newer modern
  .NET — covers both modern-.NET-to-newer-modern-.NET (B1) and .NET
  Framework-to-modern-.NET (B2) sources. Determines which situation applies,
  verifies the Telerik version against the new target TFM, and mandatorily
  migrates Telerik direct assembly references to NuGet packages whenever found on a
  modern .NET target — Visual Studio Toolbox and design-time support for
  Telerik controls on .NET require the Telerik NuGet packages, regardless of
  whether the project just arrived on modern .NET (B2) or was already on it
  (B1) — preserving the Xaml/NoXaml flavor and transitioning licensing
  accordingly.
metadata:
  discovery: scenarioExtension
  extends-scenario: [dotnet-version-upgrade]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
  order: 100
  scope: [Assessment, Planning, Execution, IntegrityReview]
  scopeInstructions:
    Assessment: scopes/assessment.md
    Planning: scopes/planning.md
    Execution: scopes/execution.md
---

# Telerik UI for WPF rules for the .NET version upgrade

`dotnet-version-upgrade` covers two different source situations, and this
extension serves both — determine which one applies before anything else;
never assume from the target alone.

- **B1 — Modern → newer modern** (e.g. net8.0-windows → net10.0-windows):
  usually light-touch. Reference style is normally already NuGet, so the
  reference migration is typically a no-op — verify, don't assume. **Direct
  assembly references are not a legitimate end state here**: a project
  already on modern .NET has no excuse for missing NuGet, for the same
  design-time-support reason that makes it mandatory on B2. If found, migrate
  unconditionally — do not offer it as a choice.
- **B2 — .NET Framework → modern .NET** (e.g. net472 → net10.0-windows):
  the heaviest path. Migrating direct Telerik assembly references to NuGet is
  **mandatory** — there is no assembly-reference outcome on this path. On top
  of the reference migration, B2 also replaces .NET Framework-only assemblies
  and refreshes copied NoXaml theme XAML. See *Why NuGet Is Mandatory on
  Modern .NET* and *B2-Only Changes* below.

## Why NuGet Is Mandatory on Modern .NET (Both B1 and B2)

In modern .NET WPF projects, dragging Telerik controls from the Visual Studio
Toolbox and the Telerik design-time support in Visual Studio are available
only for projects that reference the Telerik NuGet packages. A project that
kept assembly references would compile and run but lose the Telerik Toolbox
and design-time experience, which is a broken development experience, not a
style preference. The NuGet packages also bring in the third-party packages
several controls rely on under .NET (`System.Data.OleDb`,
`System.Drawing.Common`, `System.ServiceModel.Http`), which direct
references would have to add manually. This holds regardless of how the
project reached modern .NET, so migration is required unconditionally
whenever assembly references are found on either path — not just on B2, and
not as a recommendation on B1 (see `planning.md` for the exact user-facing
wording, stated once at plan time).

This reasoning applies to modern .NET WPF projects specifically; it does not
apply to, and must not be cited for, .NET Framework projects.

**The rule that always holds**: the referenced Telerik version must support
the *resulting* TFM — verify against `telerik-wpf-dependency-management`
in both situations, never assume a bump is or isn't needed. For
`net8.0-windows`, `net9.0-windows`, and `net10.0-windows` that means a
release that ships the .NET 8 distribution (2024 Q4 or later). Resolve NuGet
feed availability for the candidate version **before** finalizing it (see
`assessment.md`) — on B2 this gates the entire migration, since it cannot
proceed without a feed that serves the required version.

**The flavor is always preserved**: a Xaml project stays Xaml and a NoXaml
project stays NoXaml, on both paths (`telerik-wpf-xaml-flavor`). A mixed
flavor is a blocker to report — the migration does not run, not even
partially, until the user decides which flavor to converge on.

## B2-Only Changes

- **.NET Framework-only assemblies**: replaced per
  `telerik-wpf-assembly-mapping` Step 2 — `Telerik.Windows.Documents`,
  `Telerik.Windows.Controls.RichTextBoxUI`, and the
  `Telerik.Windows.Documents.FormatProviders.*` assemblies map to the
  `Telerik.Windows.Controls.RichTextBox` package of the project's flavor;
  `Telerik.Windows.Controls.EntityFramework60` has no .NET package and is a
  blocker; `Telerik.Windows.Documents.Proofing.Dictionaries.En-US` has no
  .NET package and is reported to the user.
- **Copied NoXaml theme XAML**: XAML files copied from `Themes.Implicit` must
  be replaced with the ones from the `Themes.Implicit\NET` folder of the
  target version, from a folder the user supplies — per
  `telerik-wpf-xaml-flavor` Step 4. Never guess the path and never hand-edit
  theme XAML.
- **Licensing**: moves to the transitive `Telerik.Licensing` dependency; the
  Telerik UI for WPF `EvidenceAttribute` line is removed.

**Telerik presence is this extension's own responsibility to detect** — the
host's traits (`.NET`, `WPF`) only say the repository is a .NET WPF
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
  `Telerik.Licensing`, and any prior Telerik UI for WPF `EvidenceAttribute`
  line was removed, not left in place;
- every added Telerik UI package shares one version;
- the Xaml/NoXaml flavor is unchanged — no package of the other flavor was
  added;
- on B2, every .NET Framework-only assembly was replaced per
  `telerik-wpf-assembly-mapping` Step 2, or reported as a blocker;
- the NoXaml theming checks (`telerik-wpf-xaml-flavor` Step 4) passed, or
  each failure — including copied theme XAML not yet refreshed — was
  reported as an open item;
- this extension's work landed inside the host's own stages — not as a
  separate, competing flow;
- a blocked migration was reported clearly (with the Toolbox and
  design-time-support consequence) rather than silently left on assembly
  references or partially migrated.

This skill is a **scenario extension**: no workflow of its own, never
user-selectable. It calls into `telerik-wpf-reference-detection` (both
paths), `telerik-wpf-xaml-flavor` (both paths),
`telerik-wpf-dependency-management` (both paths),
`telerik-wpf-nuget-feed-setup` (both paths, when NuGet applies),
`telerik-wpf-assembly-mapping` (both paths, when migrating),
`telerik-wpf-reference-migration` (both paths, when migrating),
`telerik-wpf-license-detection`, `telerik-wpf-license-key-setup`,
`telerik-wpf-license-nuget-migration` (both paths),
`telerik-wpf-breaking-changes` (both paths), and
`telerik-wpf-migration-verification` (both paths) for the mechanics.
