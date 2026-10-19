# Telerik UI for WPF — Version Compatibility Matrix

Source: https://docs.telerik.com/devtools/wpf/installation/distributions
(`installation/distributions.md` in the docs repository).

## Supported Distributions

| Telerik Distribution | First Release | End of Support | Supported Runtime |
|----------------------|---------------|----------------|-------------------|
| .NET Framework 4.6.2 | 2024 Q2 | — | .NET Framework 4.6.2 and later |
| .NET 8 | 2024 Q4 | — | .NET 8 and later |

## Out-of-Support Distributions

| Telerik Distribution | First Release | End of Support | Supported Runtime |
|----------------------|---------------|----------------|-------------------|
| .NET Framework 4.0 | Q2 2010 | 2024 Q2 | .NET Framework 4.0 and later |
| .NET Framework 4.5 | Q3 2012 | 2024 Q2 | .NET Framework 4.5 and later |
| .NET Core 3.1 | R1 2019 | 2024 Q2 | .NET Core 3.1 and later |
| .NET 5 | R2 2020 | R3 2022 SP2 | .NET 5 and later |
| .NET 7 | R3 2022 SP2 | 2024 Q4 | .NET 7, .NET 8 and later |
| .NET 6 | R3 2021 SP1 | 2025 Q2 | .NET 6 and later |

**End of Support** is the first release that **no longer** ships that
distribution — e.g. 2024 Q2 is the first release without .NET Framework 4.0
DLLs, so the last release with them is 2024 Q1.

## Quick Reference: Telerik Version by .NET Target

| .NET Target | Distribution used by current releases | Minimum Telerik Version | Notes |
|-------------|---------------------------------------|-------------------------|-------|
| .NET 10 (`net10.0-windows`) | .NET 8 | 2024 Q4 (2024.4.x) | .NET 8 DLLs run on .NET 8 and later |
| .NET 9 (`net9.0-windows`) | .NET 8 | 2024 Q4 (2024.4.x) | Same |
| .NET 8 (`net8.0-windows`) | .NET 8 | 2024 Q4 (2024.4.x) | Same |
| .NET Framework 4.8.1 / 4.8 / 4.7.x / 4.6.2 | .NET Framework 4.6.2 | 2024 Q2 (2024.2.x) | Older releases ship .NET Framework 4.0/4.5 DLLs, which also run on these runtimes |

The minimum versions above are the first releases that ship a distribution
**built for** that target. Older releases built against an earlier .NET
distribution (.NET 6/7, .NET Core 3.1) can run on newer runtimes per the
"and later" column, but are out of support — when a project moves to a newer
.NET target, prefer a Telerik version from the "Supported Distributions"
table rather than relying on an out-of-support distribution.

For a `net4xx → net481` upgrade, every listed .NET Framework distribution
runs on .NET Framework 4.8.1, so the Telerik version normally does **not**
need to change.

## NuGet Packages

Starting with release `2026.3.812` (Q3 2026), Telerik UI for WPF packages are
available on [NuGet.org](https://www.nuget.org/). Earlier versions are on the
Telerik NuGet server only — see `telerik-wpf-nuget-feed-setup`.

Every package id is **multi-targeted** — one id carries every shipped target
framework (`lib/net462` and `lib/net8.0-windows7.0` for `2026.3.1007`); NuGet
selects the matching assets automatically. The `Version` attribute is always
the plain release version (e.g. `2026.3.1007`); never append a
target-framework suffix to it.

Package ids differ by assembly flavor (see `telerik-wpf-xaml-flavor`):

| Flavor | Feature packages | Full meta-package |
|--------|------------------|-------------------|
| Xaml | `<Assembly>.for.Wpf.Xaml` (e.g. `Telerik.Windows.Controls.GridView.for.Wpf.Xaml`) | `Telerik.UI.for.Wpf.AllControls.Xaml` |
| NoXaml | `<Assembly>.for.Wpf` (e.g. `Telerik.Windows.Controls.GridView.for.Wpf`) plus theme packages `Telerik.Windows.Themes.<Theme>.for.Wpf` | `Telerik.UI.for.Wpf.AllControls.NoXaml` |

Document Processing, Zip, and AI packages (`Telerik.Windows.Documents.*`,
`Telerik.Windows.Zip*`, `Telerik.Documents.AI.*`) are flavor-neutral and can
ship with a different version number than the UI packages of the same release
(e.g. `2026.3.1006` with UI `2026.3.1007`).

## Retired Package Ids

Localization satellite assemblies are bundled in
`Telerik.Windows.Controls.for.Wpf[.Xaml]` starting with **Q2 2026**. Before
that release they shipped as separate per-language packages, e.g.
`Telerik.Windows.Controls.for.Wpf.de`, `Telerik.Windows.Controls.for.Wpf.fr`,
`Telerik.Windows.Controls.for.Wpf.es`. When upgrading to Q2 2026 or later,
remove those per-language packages.
