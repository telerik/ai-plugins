---
name: telerik-wpf-license-plugin-hosts
description: >
  Set up or fix Telerik UI for WPF license activation for add-in/plugin
  hosts (e.g. Office VSTO add-ins, Revit, AutoCAD, ArcGIS, Adobe plugins) —
  the entry-point shape with no standard application context, where the
  license cannot be evaluated automatically and needs an explicit
  `TelerikLicensing.Register(...)` call. Never handles, fabricates, or
  stores key content. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
---

# Telerik WPF Licensing for Add-In/Plugin Hosts

Covers the `entryPointShape` value `telerik-wpf-license-detection` reports
that needs more than file- or package-based activation alone: a host with
no conventional WPF `Application`/`App.xaml`/`Main` entry point and no
proper main window, so the licensing mechanism cannot evaluate
automatically before a Telerik control initializes. It requires an explicit
`Telerik.Licensing.TelerikLicensing.Register(...)` call.

For a standard application entry point, use
`telerik-wpf-license-key-setup` instead — these mechanics do not apply
there.

## Inputs

- `entryPointShape` from `telerik-wpf-license-detection`
  (`add-in-or-plugin`) — run detection first if not already run.
- Whether this is first-time setup or a script-key-to-NuGet migration for an
  add-in/plugin host already in the hybrid state — `telerik-wpf-license-nuget-migration`
  calls into this skill for the registration step either way.

## Preconditions

- `telerik-wpf-license-detection` reported `entryPointShape` as
  `add-in-or-plugin` for the project in scope. For any other shape, this
  skill does not apply.

## Add-In / Plugin Hosts (Hybrid — NuGet Package Plus Manual Registration)

**Both mechanisms are required together — this is not an either/or
choice**, and it is the documented correct state (`mechanism:
hybrid-manual-registration`), not a defect to resolve toward a single
mechanism:

1. Ensure `Telerik.Licensing` restores in every project library in the
   add-in. Any Telerik UI for WPF control NuGet package brings it in
   transitively; add an explicit `Telerik.Licensing` `PackageReference`
   (from NuGet.org) only to a project that has no Telerik control NuGet
   package.
2. Call `Telerik.Licensing.TelerikLicensing.Register()` as early as
   possible, before any Telerik control initializes — for example in the
   constructor of the add-in's WPF `UserControl`/`Window`, before
   `InitializeComponent()`. A small wrapper keeps the call-site simple and
   makes it easy to invoke from every entry point the host loads through:
   ```csharp
   public class TelerikHelper
   {
       public static void Register() => Telerik.Licensing.TelerikLicensing.Register();
   }
   ```
3. For the parameterless `Register()` overload to work, the project must
   still define an `EvidenceAttribute` with the product's script key — see
   `telerik-wpf-license-key-setup`'s Step 2 for obtaining it and the
   C#/VB syntax. The parameterless overload requires `Telerik.Licensing`
   1.6.7 or later. Alternatives to the parameterless overload, when the
   customer prefers not to add the attribute or the resolved
   `Telerik.Licensing` version is older:
   - Call `TelerikLicensing.Register("your-script-key")` directly, or
   - Enumerate `EvidenceAttribute`s reflectively and register each:
     ```csharp
     var evidenceAttributes = typeof(MyUserControl).Assembly.GetCustomAttributes().OfType<Telerik.Licensing.EvidenceAttribute>();
     foreach (var attribute in evidenceAttributes)
     {
         Telerik.Licensing.TelerikLicensing.Register(attribute.Value);
     }
     ```
   Do not fabricate the script-key value — the customer supplies it.
4. **Verify as a standalone app first.** Run the add-in's WPF UI as a
   standalone Visual Studio application (where one conventional entry point
   exists) to confirm no watermark appears there before testing inside the
   actual host process (e.g. Excel/Word/Revit). A watermark that persists
   only inside the host points at the `Register()` call running too late or
   not at all in that host's load sequence — not at an invalid license.
5. **Warn explicitly**: never publish the script key in a public repository.

## Output

- Host shape handled (add-in/plugin hybrid)
- Where `Register(...)` was called from, and what it registers (parameterless
  with `EvidenceAttribute`, inline key, or reflective enumeration)
- Whether verification was done as a standalone app
- Any secret-material warning issued

## Idempotency

Re-running when the registration call and the `Telerik.Licensing` package
are already correctly in place is a no-op — report the existing state rather
than adding a duplicate `Register()` call or package reference.
