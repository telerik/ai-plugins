# Telerik UI for WinForms — Version Compatibility Matrix

Source: https://www.telerik.com/products/winforms/documentation/installation-and-upgrades/distributions

## .NET Framework Distributions

| Telerik Distribution | Telerik Versions | Supported Runtime |
|----------------------|------------------|-------------------|
| .NET Framework 2.0 | Q3 2006 – R3 2022 | .NET Framework 2.0 and later |
| .NET Framework 4.0 | Q1 2012 – R1 2024 | .NET Framework 4.0 and later |
| .NET Framework 4.6.2 | 2024 Q2 – present | .NET Framework 4.6.2 and later |
| .NET Framework 4.8 | R3 2022 – present | .NET Framework 4.8 and later |

## .NET Distributions

| Telerik Distribution | Telerik Versions | Supported Runtime |
|----------------------|------------------|-------------------|
| .NET Core 3.0 | R1 2019 – R3 2019 SP1 | .NET Core 3.0 |
| .NET Core 3.1 | R1 2020 – R1 2024 | .NET Core 3.1 and later |
| .NET 5 | R2 2020 – R3 2022 SP2 | .NET 5 and later |
| .NET 6 | R3 2021 SP1 – 2025 Q1 | .NET 6 and later |
| .NET 7 | R3 2022 SP2 – 2024 Q3 | .NET 7 and later |
| .NET 8 | 2024 Q2 – present | .NET 8 and later |
| .NET 9 | 2024 Q4 – present | .NET 9 / .NET 10 and later |

> .NET 6 distribution is discontinued in 2025 Q2.

## Quick Reference: Minimum Telerik Version by .NET Target

| .NET Target | Minimum Telerik Version | Notes |
|-------------|------------------------|-------|
| .NET 10 | 2024 Q4 (2024.4.x) | Via the .NET 9 distribution |
| .NET 9 | 2024 Q4 (2024.4.x) | |
| .NET 8 | 2024 Q2 (2024.2.x) | |
| .NET 7 | R3 2022 SP2 (2022.3.x) | .NET 7 distribution ended 2024 Q3 |
| .NET 6 | R3 2021 SP1 (2021.3.x) | Distribution discontinued 2025 Q2 |
| .NET Framework 4.8 | R3 2022 (2022.3.x) | |
| .NET Framework 4.6.2 | 2024 Q2 (2024.2.x) | |
| .NET Framework 4.0 | Q1 2012 (2012.1.x) | Distribution ended R1 2024 |

## NuGet Package

The recommended NuGet package is `Telerik.UI.for.WinForms.AllControls` — a
unified package that auto-detects the project's target framework and brings
`Telerik.Licensing` as a transitive dependency.

The following framework-specific packages are retired:
- `UI.for.WinForms.AllControls.Net462`
- `UI.for.WinForms.AllControls.Net48`
- `UI.for.WinForms.AllControls.Net80`
- `UI.for.WinForms.AllControls.Net90`

These were separate package ids, not a `Version` suffix — the unified
package multi-targets all four frameworks itself. Its `Version` is always
the plain release version (e.g. `2026.3.812`); never append
`.Net462`/`.Net48`/`.Net80`/`.Net90` to `Version`.

Starting **Q3 2026**, all Telerik UI for WinForms NuGet packages are also
available on [NuGet.org](https://www.nuget.org/).
