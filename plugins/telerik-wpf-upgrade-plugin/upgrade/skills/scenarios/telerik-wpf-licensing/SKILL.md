---
name: telerik-wpf-licensing
description: >
  Set up, fix, or migrate Telerik UI for WPF license activation,
  independent of any version change. Detects the current mechanism (NuGet-based
  or script-key), diagnoses TKL* errors and watermarks, sets up the recommended
  activation path, and migrates to the NuGet-based model when feasible. Not
  for version or reference-style changes — those scenarios call this one's
  lazy skills directly.
requires-extension: telerik-wpf-upgrade-plugin
metadata:
  discovery: scenario
  importance: high
  weight: 8600
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
  scenarioTraitsSet: [.NET, WPF, Telerik]
  post-completion:
    suggest-scenarios:
      - telerik-wpf-assembly-to-nuget
    suggest-actions:
      - generate-report
---

# Telerik WPF Licensing Scenario

Set up, fix, or migrate Telerik UI for WPF license activation — on its own,
independent of any Telerik version change or control-reference migration.

**Goal**: every in-scope project builds and runs with a valid, consistent
license activation, using the mechanism that is actually right for it.

**Also triggered by**: "set up my Telerik license", "I'm getting a Telerik
watermark", "TKL002 error" (or any TKL0xx/TKL1xx code), "no license key
found", "move my Telerik license to NuGet", or a Telerik license
dialog/banner at startup.

**Not this scenario**: for a Telerik version change, use
`telerik-wpf-version-upgrade` (it calls this scenario's lazy skills for its
own licensing needs rather than duplicating them); for reference-style
changes only, use `telerik-wpf-assembly-to-nuget`.

## Licensing Facts

- Telerik UI for WPF versions released before January 2025 (Q1 2025) do not
  require application license activation; Q1 2025 and later do.
- Every Telerik UI for WPF NuGet package brings `Telerik.Licensing` in
  transitively — never add it explicitly alongside a control package (see
  `telerik-wpf-dependency-management`).
- **Class libraries**: activation is evaluated in the consuming application,
  so the application project that consumes a Telerik-referencing class
  library also needs `Telerik.Licensing` (NuGet) or the script-key file
  (assembly references) — see `telerik-wpf-license-key-setup` Step 1b.

## MCP License Prerequisite — Handled, Not Skipped

Unlike this plugin's other scenarios, this scenario does not *require* the
MCP-server license as a blocking gate to start — its whole purpose can be
setting that key up in the first place. But it does not ignore it either:
`telerik-wpf-license-detection`'s Step 0 always checks the shared
MCP-prerequisite key, **independent of whether any project references
Telerik yet**. A project with no Telerik reference still needs that key
present before any other scenario can use the Telerik MCP tools
(`telerik-upgrade-assistant`, `telerik-wpf-assistant`) — this scenario is
exactly where that gets fixed when the customer asks for it, or when
detection finds it missing.

Do not tell the customer "there is nothing to license" just because no
project references Telerik. Only the **per-project application license**
portion of this scenario (mechanism detection and migration) requires a
Telerik reference to mean anything — the shared MCP key does not.

## Scenario Flow

1. **Detect first — never assume.** Run `telerik-wpf-license-detection`
   before anything else — this always includes the Step 0 MCP-prerequisite
   check, even when no project references Telerik yet.
2. **No project references Telerik** → the scope is just the shared MCP key:
   - Missing → set it up (`telerik-wpf-license-key-setup`), then
     re-verify. This is a complete, valid run of this scenario on its own —
     do not treat it as "nothing to do."
   - Present and confirmed usable by `telerik license info` → report that it
     is already active for the MCP server, and that there is no per-project
     application license to configure yet. Skip the branches below; there is
     nothing else in scope.
   - Present but `telerik license info` reports no usable license, or reports
     that WPF is not listed or expired → set up or refresh it through
     `telerik-wpf-license-key-setup`, then re-verify. A file being
     present is not enough when the CLI can validate its product status.
   - Present with CLI validation unavailable → retain the direct existence
     result, report that CLI validation could not run, and finish through
     `telerik-wpf-license-verification`.
3. **One or more projects reference Telerik** → branch per project on what
   was found:
   - **Nothing configured** → set up the recommended activation path
     (`telerik-wpf-license-key-setup`). For a class library, the setup
     covers its consuming application too.
   - **Configured but broken** → `telerik-wpf-license-diagnostics`,
     then the fix skill it names.
   - **Script-key based** → offer the migration
     (`telerik-wpf-license-nuget-migration`) per the policy below.
   - **Hybrid (add-in/plugin host)** → verify only; the NuGet package plus a
     kept `EvidenceAttribute` and manual `Register(...)` call is the
     documented correct state (`telerik-wpf-license-plugin-hosts`).
   - **Mixed mechanisms across the solution** → converge on one consistent
     model rather than leaving both — prefer the NuGet-based model for
     every project that can use it, keep script-key only where a project's
     own exception applies.
4. **Always finish** with `telerik-wpf-license-verification`.

## Script Key → NuGet Migration Policy

- Where a project **can** use the NuGet-based model, recommend migrating and
  explain why using the documentation's own reasoning: simpler restore and
  version management, and `Telerik.Licensing` arrives automatically with the
  package rather than needing a compiled script key per project.
- **Recommend; do not force.** If the customer declines, help them keep the
  script-key model working correctly (`telerik-wpf-license-key-setup`)
  and do not re-prompt.
- **Exception**: when a project genuinely cannot use NuGet packages, do not
  recommend migrating — confirm the constraint first (see
  `telerik-wpf-license-nuget-migration`'s preconditions). Add-in/plugin
  hosts are **not** this exception; they still adopt the NuGet package
  alongside a kept `EvidenceAttribute` (hybrid, not blocked).
- When migrating, perform the full transition and remove what the script-key
  model left behind — never leave a project half-migrated.

## Workflow Stages

0. **Pre-Initialization** — identify in-scope projects, confirm flow mode
   and source-control parameters.
1. **Assessment** — Load [assessment.md](assessment.md).
2. **Planning** — Load [planning.md](planning.md).
3. **Execution** — Load [execution.md](execution.md).
4. **Post-Completion** — Load [post-completion.md](post-completion.md).

## Pre-Initialization

- Call `get_solution_path()` and scan `.csproj`/`.vbproj` files for WPF
  projects and any Telerik reference (assembly or NuGet) — reuse
  `telerik-wpf-reference-detection`'s own presence check rather than
  re-implementing a text scan here.
- If no project references Telerik at all, that's fine — it only limits the
  scope to the shared MCP-prerequisite key (see *MCP License Prerequisite*
  above); do not stop the scenario or tell the customer there is nothing to
  license.
- Confirm the in-scope project list, Flow Mode (Automatic or Guided), and
  source control parameters (git only) with the user. Include the
  application projects that consume Telerik-referencing class libraries.

## Success Criteria

- [ ] The shared MCP-prerequisite key was checked, regardless of whether any
      project references Telerik — and set up if missing and requested
- [ ] Every in-scope project's licensing mechanism was detected, not assumed
- [ ] Every project has exactly one consistent, working mechanism — no mix
      of script-key and NuGet-based within the same solution unless a
      documented exception applies to specific projects
- [ ] Every application that consumes a Telerik-referencing class library
      has its own working activation
- [ ] The NuGet migration offer, if made, was stated once and not repeated
- [ ] The solution builds with no `TKL*` warnings or errors
- [ ] No license key, script key, or credential was fabricated, read, or
      echoed by the agent

## Notes

- Ground every factual claim in the licensing documentation
  (`installation/licensing/*.md`, the linked knowledge-base articles) — if a
  customer's situation is not covered there, say so rather than inventing
  guidance.
- Never write secret material (a real key or script key value) into a
  location that could reach a public repository without warning the
  customer first.
- Licensing never changes the Xaml/NoXaml flavor of any reference
  (`telerik-wpf-xaml-flavor`).
