---
name: telerik-wpf-for-dotnet-framework-upgrade
description: >
  Telerik UI for WPF rules for a .NET Framework version upgrade (net4xx
  to net481) — verify the referenced Telerik version still supports net481,
  offer (never force) the assembly-to-NuGet migration, preserve the
  Xaml/NoXaml flavor, and keep licensing consistent with whichever reference
  mechanism the customer keeps.
metadata:
  discovery: scenarioExtension
  extends-scenario: [dotnet-framework-version-upgrade]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
  order: 100
  scope: [Assessment, Planning, Execution, IntegrityReview]
  scopeInstructions:
    Assessment: scopes/assessment.md
    Planning: scopes/planning.md
    Execution: scopes/execution.md
---

# Telerik UI for WPF rules for the .NET Framework version upgrade

The platform's own compatibility data doesn't know about Telerik UI for
WPF, so a `dotnet-framework-version-upgrade` run must not decide anything
about it without this guidance.

**The rule that always holds**: net4xx → net481 is a minor TFM bump. Every
Telerik UI for WPF .NET Framework distribution runs on .NET Framework 4.8.1,
so it normally does **not** force a Telerik version change — verify against
the `telerik-wpf-dependency-management` compatibility matrix instead of
assuming one is needed. Direct Telerik assembly references are a fully
supported .NET Framework configuration; NuGet is a recommendation put to the
customer once, never a silent migration. The Xaml/NoXaml flavor is always
preserved (`telerik-wpf-xaml-flavor`), whichever reference mechanism the
customer keeps.

This extension stays on .NET Framework. Never suggest moving to modern .NET
— that is a different host scenario (`dotnet-version-upgrade`), not an
option of this one.

**Telerik presence is this extension's own responsibility to detect.** The
host scenario's traits (`.NET`, `WPF`) only say the repository is a .NET WPF
solution — they cannot say whether Telerik specifically is referenced.
Assessment checks for that, once, before any other step. If no project
references Telerik, Planning, Execution, and IntegrityReview all contribute
nothing and must not re-inspect the project themselves.

This body is what the `IntegrityReview` scope receives (it is declared in
`scope` but left out of `scopeInstructions`). When reviewing the resulting
change, confirm that:

- the referenced Telerik version supports `net481` (verified, or upgraded to
  one that does, if that was actually required);
- the Xaml/NoXaml flavor is unchanged — no package or assembly of the other
  flavor was added;
- if the customer accepted the NuGet migration, no `<Reference>`/`HintPath`
  or `packages.config` entry for Telerik survives, every added UI package
  shares one version, and the packages resolve from their `net462` asset
  group;
- if the customer declined NuGet, no assembly reference was touched except to
  repoint `HintPath` at a customer-supplied folder of the same flavor and
  framework build for a required version bump;
- if the version changed on a NoXaml project, the theming checks
  (`telerik-wpf-xaml-flavor` Step 4) passed or each failure — including
  copied theme XAML not yet refreshed — was reported;
- licensing (NuGet-transitive, explicit `Telerik.Licensing`, or Script Key)
  matches whichever reference mechanism is actually in use.

This skill is a **scenario extension**: no workflow of its own, never
user-selectable. It calls into `telerik-wpf-reference-detection`,
`telerik-wpf-xaml-flavor`, `telerik-wpf-dependency-management`,
`telerik-wpf-nuget-feed-setup`, `telerik-wpf-assembly-mapping`,
`telerik-wpf-reference-migration`, `telerik-wpf-reference-retargeting`,
`telerik-wpf-license-detection`, `telerik-wpf-license-key-setup`,
`telerik-wpf-license-nuget-migration`, and
`telerik-wpf-migration-verification` for the mechanics.
