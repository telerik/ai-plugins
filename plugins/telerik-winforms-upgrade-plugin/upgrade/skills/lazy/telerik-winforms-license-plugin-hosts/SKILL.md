---
name: telerik-winforms-license-plugin-hosts
description: >
  Set up or fix Telerik UI for WinForms license activation for add-in/plugin
  hosts (e.g. Office VSTO add-ins) and OpenEdge ABL hosts — the two
  entry-point shapes with no standard application context, where the
  license cannot be evaluated automatically and needs an explicit
  `TelerikLicensing.Register(...)` call. Never handles, fabricates, or
  stores key content. Idempotent.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms Licensing for Add-In/Plugin and OpenEdge Hosts

Covers the two `entryPointShape` values `telerik-winforms-license-detection`
reports that need more than file- or package-based activation alone: a host
with no conventional `Program.cs`/`Main`/`Application.Run` entry point, so
the licensing mechanism cannot evaluate automatically before a Telerik
control initializes. Both require an explicit
`Telerik.Licensing.TelerikLicensing.Register(...)` call; they differ in
whether NuGet is available at all.

For a standard application entry point, use
`telerik-winforms-license-key-setup` instead — these mechanics do not apply
there.

## Inputs

- `entryPointShape` from `telerik-winforms-license-detection`
  (`add-in-or-plugin` or `openedge`) — run detection first if not already
  run.
- Whether this is first-time setup or a script-key-to-NuGet migration for an
  add-in/plugin host already in the hybrid state — `telerik-winforms-license-nuget-migration`
  calls into this skill's add-in section for the registration step either
  way.

## Preconditions

- `telerik-winforms-license-detection` reported `entryPointShape` as
  `add-in-or-plugin` or `openedge` for the project in scope. For any other
  shape, this skill does not apply.

## Add-In / Plugin Hosts (Hybrid — NuGet Package Plus Manual Registration)

**Both mechanisms are required together — this is not an either/or
choice**, and it is the documented correct state (`mechanism:
hybrid-manual-registration`), not a defect to resolve toward a single
mechanism:

1. Ensure every project library in the add-in references the
   `Telerik.Licensing` NuGet package (from NuGet.org).
2. Call `Telerik.Licensing.TelerikLicensing.Register()` as early as
   possible, before any Telerik control (including `RadForm`) initializes.
   A small wrapper keeps the call-site simple and makes it easy to invoke
   from every entry point the host loads through:
   ```csharp
   public class TelerikHelper
   {
       public static void Register() => Telerik.Licensing.TelerikLicensing.Register();
   }
   ```
3. For the parameterless `Register()` overload to work, the project must
   still define an `EvidenceAttribute` with the product's script key — see
   `telerik-winforms-license-key-setup`'s Step 2 for obtaining it and the
   C#/VB syntax. Alternatives to the parameterless overload, when the
   customer prefers not to add the attribute:
   - Call `TelerikLicensing.Register("your-script-key")` directly, or
   - Enumerate `EvidenceAttribute`s reflectively and register each:
     ```csharp
     var evidenceAttributes = typeof(MyForm).Assembly.GetCustomAttributes().OfType<Telerik.Licensing.EvidenceAttribute>();
     foreach (var attribute in evidenceAttributes)
     {
         Telerik.Licensing.TelerikLicensing.Register(attribute.Value);
     }
     ```
   Do not fabricate the script-key value — the customer supplies it.
4. **Verify as a standalone app first.** Run the add-in as a standalone
   Visual Studio application (where one conventional entry point exists) to
   confirm no watermark appears there before testing inside the actual host
   process (e.g. Excel/Word). A watermark that persists only inside the host
   points at the `Register()` call running too late or not at all in that
   host's load sequence — not at an invalid license.

## OpenEdge ABL Hosts (Script-Key Only — No NuGet)

**OpenEdge does not support NuGet at all.** Never attempt NuGet-based setup
or recommend migrating an `openedge-manual-registration` project — go
straight to a direct assembly reference plus manual registration:

1. Add a direct reference to `Telerik.Licensing.Runtime.dll` — not the
   `Telerik.Licensing` NuGet package.
2. Direct the customer to **License Keys → View Script Keys → Progress® Telerik® UI for WinForms**
   and copy **only the key string** inside the first
   `Telerik.Licensing.EvidenceAttribute("key")` shown there.
3. Register the key explicitly in code, before any Telerik control
   initializes:
   - In the `Form` constructor, before `InitializeComponent()`:
     `Telerik.Licensing.TelerikLicensing:Register("Your License Key")`.
   - Or earlier, from a procedure file (`.p`), if the very first screen is
     itself a Telerik form — register there instead of in the form.
     OpenEdge GUI applications always start from a procedure file, not a
     class, so there is always a non-GUI entry point available for this
     even when every screen is Telerik-based.
4. **Warn explicitly**: never publish the script key in a public repository.

## Output

- Host shape handled (add-in/plugin hybrid, or OpenEdge)
- Where `Register(...)` was called from, and what it registers (parameterless
  with `EvidenceAttribute`, inline key, or reflective enumeration)
- Whether verification was done as a standalone app (add-in/plugin only)
- Any secret-material warning issued

## Idempotency

Re-running when the registration call and (for add-in/plugin hosts) the
NuGet package are already correctly in place is a no-op — report the
existing state rather than adding a duplicate `Register()` call or package
reference.
