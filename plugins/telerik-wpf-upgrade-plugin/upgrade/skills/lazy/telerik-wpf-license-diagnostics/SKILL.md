---
name: telerik-wpf-license-diagnostics
description: >
  Map an observed Telerik UI for WPF licensing symptom or a documented
  TKL error/warning code to its cause and the lazy skill that fixes it.
  Read-only — decides the fix, does not apply it.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Licensing Diagnostics

Given a symptom (watermark, banner, modal dialog, build error/warning text)
or an explicit `TKL*` code, identify the documented cause and route to the
skill that resolves it. This skill decides the fix; it does not perform
project edits itself.

## Inputs

- The observed symptom text, error/warning code, or build log excerpt.
- Detection output from `telerik-wpf-license-detection`, when
  available — narrows which rows below are even reachable for this project
  (e.g. a binding-redirect fix cannot apply to a modern-.NET project).

## Preconditions

None to run the lookup itself. Applying the resulting fix requires whichever
precondition that fix's own skill declares.

## Decision Table

| Symptom / Code | Cause | Fix skill |
|---|---|---|
| `TKL002` — No Telerik and Kendo UI License file found | No license artifact resolvable | `telerik-wpf-license-key-setup` |
| `TKL003` — Corrupted license content in file/env var | Truncated/incorrect file or env var content, or a **script key used where a full license key is expected** | `telerik-wpf-license-key-setup` (re-download); confirm key type first |
| `TKL004` — Unable to locate licenses for all products | License doesn't cover every referenced Telerik/Kendo product | `telerik-wpf-license-key-setup` (re-download after purchase) |
| `TKL101` — Telerik UI for WPF is not listed in your current license file | Package referenced that the license doesn't cover | Review purchased products; remove the unused package reference |
| `TKL102` — Current license has expired (perpetual) | Product version released after the perpetual license's validity window | Renew + `telerik-wpf-license-key-setup`, or pin to a version inside the license window |
| `TKL103` / `TKL104` — Subscription expired | Subscription term ended | Renew + `telerik-wpf-license-key-setup` |
| `TKL105` — Trial expired | 30-day trial period ended | Purchase a commercial license |
| `telerik license info` does not list `Telerik UI for WPF` | The local license file is validly readable but does not cover WPF | `telerik-wpf-license-key-setup` (obtain a key for the required product) |
| `telerik license info` reports an expired `Telerik UI for WPF` license | The WPF entitlement is outside its subscription or perpetual-license window | Renew, then `telerik-wpf-license-key-setup` |
| `TKL001` — No Telerik/Kendo product references detected | `Telerik.Licensing` present without a recognized product reference | Update `Telerik.Licensing` to **1.4.6+**, or remove it if the project truly has no Telerik reference |
| Watermark / banner / modal dialog at runtime | Missing, invalid, or expired license | Route by cause above, or `telerik-wpf-license-key-setup` if nothing is configured |
| "No license found" dialog/watermark in the application while Telerik UI for WPF is referenced only from a class library, license installed | The consuming application project has no `Telerik.Licensing` (NuGet) or `TelerikLicense.cs`/`.vb` (assembly references) | `telerik-wpf-license-key-setup` Step 1b (NuGet) or Step 2 item 3 (assembly references) |
| Build error: `Could not find assembly 'Telerik.Licensing.Runtime...'` | Missing reference after upgrading to 2025 Q1+ | Add `Telerik.Licensing.Runtime.dll` reference, or install the `Telerik.Licensing` NuGet package (not needed when a Telerik UI for WPF control package is referenced — it brings it transitively) |
| Runtime `FileNotFoundException`: `Could not load file or assembly 'Telerik.Licensing.Runtime, Version=...'` (direct assembly references) | `Telerik.Licensing.Runtime.dll` and the Telerik control assemblies come from different Telerik UI for WPF installations/versions | Reference every Telerik assembly, including `Telerik.Licensing.Runtime.dll`, from the same installation and version |
| Direct `Telerik.Licensing.Runtime.dll` reference present with no `EvidenceAttribute`/`Register()` call | Manual runtime reference has no activation mechanism | `telerik-wpf-license-key-setup` Step 2; if the customer cannot supply/know the script key and NuGet is usable, prefer its fallback — replace the direct reference with the `Telerik.Licensing` NuGet package (Step 1) assuming a valid `telerik-license.txt` |
| Runtime `FileLoadException` for `Telerik.Licensing.Runtime` (.NET Framework, non-SDK-style only) | Assembly version mismatch; no binding redirect, whether from a migration or a first-time setup | `telerik-wpf-license-nuget-migration` Step 3, or `telerik-wpf-license-key-setup` Step 1a for a first-time setup |
| "No license key found" + "No product references detected" in VS2019, .NET Framework, key present | Known cosmetic limitation in that specific VS/host combination | No fix needed — safe to ignore, or use VS2022 |
| VB build error `BC30034: Bracketed identifier is missing closing ']'` in `TelerikLicense.vb` | C# script-key syntax pasted into a `.vb` file | `telerik-wpf-license-key-setup` Step 2 (use VB `EvidenceAttribute` syntax) |
| "No license found" with a `TelerikLicense.cs`/`.vb` file in an application using several Telerik products | The file lacks an `EvidenceAttribute` line for one of the products | `telerik-wpf-license-key-setup` Step 2 item 4 (one line per product) |
| Watermark in an Add-in/Plugin project (e.g. VSTO, Revit, AutoCAD, ArcGIS) despite a valid license | No standard app context to evaluate the license automatically | `telerik-wpf-license-plugin-hosts` (hybrid: NuGet package + manual `Register()`) |
| CI/CD build needs activation but project has no NuGet | Non-NuGet build environment | `telerik-wpf-license-key-setup` Step 2 (script-key path); write the generated file at build time from a stored secret rather than committing it |
| Build works locally, fails on the build server | Build server runs under a different Windows account without the license file | `telerik-wpf-license-key-setup` Step 3 (Windows account caveat), or Step 1/Step 2 to place the file for that account |
| Shared `%AppData%\Telerik\telerik-license.txt` doesn't activate a non-NuGet project | File-based activation only works for NuGet-based projects | `telerik-wpf-license-key-setup` Step 2 (script key) |
| Both `TELERIK_LICENSE` and `telerik-license.txt` present, unexpected key used | Env var always wins over the file | Not a defect — confirm which one should actually apply and unset/remove the other |
| Both a global and a project-specific `telerik-license.txt` present, unexpected key used | Project-specific file always wins | Not a defect — confirm intent; remove the unintended one |

## Output

- Matched row (or "not covered by the documentation — do not guess")
- Cause, in plain language
- Which fix skill to invoke, and with what inputs
- Whether the fix applies to this project's TFM (.NET Framework only / modern
  .NET only / both) — cross-checked against detection output before handing
  off

## Notes

If a symptom does not match any row, say so plainly rather than inventing a
cause — this is a documented, closed list, not a general troubleshooting
guide.
