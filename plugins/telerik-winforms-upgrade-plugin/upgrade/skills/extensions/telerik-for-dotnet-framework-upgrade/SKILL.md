---
name: telerik-for-dotnet-framework-upgrade
description: >
  Telerik UI for WinForms rules for a .NET Framework version upgrade (net4xx
  to net481) — verify the referenced Telerik version still supports net481,
  offer (never force) the assembly-to-NuGet migration, and keep licensing
  consistent with whichever reference mechanism the customer keeps.
metadata:
  discovery: scenarioExtension
  extends-scenario: [dotnet-framework-version-upgrade]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  order: 100
  scope: [Assessment, Planning, Execution, IntegrityReview]
  scopeInstructions:
    Assessment: scopes/assessment.md
    Planning: scopes/planning.md
    Execution: scopes/execution.md
---

# Telerik UI for WinForms rules for the .NET Framework version upgrade

The platform's own compatibility data doesn't know about Telerik UI for
WinForms, so a `dotnet-framework-version-upgrade` run must not decide
anything about it without this guidance.

**The rule that always holds**: net4xx → net481 is a minor TFM bump. It
usually does **not** force a Telerik version change — verify against the
`telerik-winforms-dependency-management` compatibility matrix instead of
assuming one is needed. Direct Telerik assembly references are a fully
supported .NET Framework configuration; NuGet is a recommendation put to the
customer, never a silent conversion.

**Telerik presence is this extension's own responsibility to detect.** The
host scenario's traits (`.NET`, `WinForms`) only say the repository is a .NET
WinForms solution — they cannot say whether Telerik specifically is
referenced. Assessment checks for that, once, before any other step. If no
project references Telerik, Planning, Execution, and IntegrityReview all
contribute nothing and must not re-inspect the project themselves.

This body is what the `IntegrityReview` scope receives (it is declared in
`scope` but left out of `scopeInstructions`). When reviewing the resulting
change, confirm that:

- the referenced Telerik version supports `net481` (verified, or upgraded to
  one that does, if that was actually required);
- if the customer accepted the NuGet migration, no `<Reference>`/`HintPath`
  or `packages.config` entry for Telerik survives, and every added package
  shares one version;
- if the customer declined NuGet, no assembly reference was touched except to
  repoint `HintPath` at a customer-supplied path for a required version bump;
- licensing (NuGet-transitive vs. Script Key) matches whichever reference
  mechanism is actually in use.

This skill is a **scenario extension**: no workflow of its own, never
user-selectable. It calls into `telerik-winforms-reference-detection`,
`telerik-winforms-dependency-management`, `telerik-winforms-assembly-mapping`,
`telerik-winforms-reference-migration`, `telerik-winforms-reference-retargeting`,
`telerik-winforms-license-detection`, `telerik-winforms-license-key-setup`,
`telerik-winforms-license-nuget-migration`, and
`telerik-winforms-migration-verification` for the mechanics.
