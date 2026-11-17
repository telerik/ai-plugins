---
name: telerik-wpf-workflow-efficiency
description: >
  Scoped execution handoffs and evidence-based review for Telerik WPF
  scenarios. Reuses valid checks without weakening error, licensing, or review
  gates; non-blocking warnings are reported as known issues, not a gate.
metadata:
  discovery: scenarioExtension
  extends-scenario: [telerik-wpf-version-upgrade, telerik-wpf-assembly-to-nuget, telerik-wpf-licensing]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WPF
  order: 110
  scope: [Execution, IntegrityReview]
  scopeInstructions:
    Execution: scopes/execution.md
---

# Telerik WPF Review Scope

This body supplies the IntegrityReview scope. The host still owns review,
model selection, lifecycle, and continuation; this extension replaces none of
those rules.

- Review the actual changed source/XAML/configuration and its callers in one
  complete pass. Use supplied original backups when there is no Git repository;
  do not require Git initialization.
- Start with changed references and resolved NuGet assets for exact
  package/version/TFM facts. A successful restore proves resolution, not
  runtime behavior. Check concrete API, binding, licensing, and theme risks,
  not the whole transitive graph merely because a package was added.
- Preserve the recorded Xaml/NoXaml flavor. Check changed theme references
  and dictionaries, including copied XAML refresh/defer decisions.
- For an unresolved Telerik API question, use `telerik-wpf-component-guidance`.
  Do not delegate a lookup solely to re-prove restored metadata. If another
  investigator is necessary, give it one bounded, unresolved question.
- Review implementation correctness, not research-note ordering or handoff
  verbosity. Missing lookup evidence is not proof of an invented dependency.
- Do not raise a finding, or return CHANGES NEEDED, because the build has
  warnings. Under `telerik-wpf-migration-verification`'s **Warning Policy**,
  only errors (including XAML compile errors), blocking `TKL*` diagnostics, and
  an actual suppression (`NoWarn`, `#pragma`, a changed warning severity) are
  findings. A dependency-graph warning such as `MSB3277` recorded under
  **Known issues** is reported, not silenced; flag it only when it is missing
  from the record.
- Write the initial verdict, including a clean PASS, to the task's supplied
  `review.md` during this same review. The host permits a clean review record;
  creating it now avoids a second agent solely to record the verdict.
- Return all findings together and state runtime/Designer limits explicitly;
  a static PASS must not claim interactive checks were run.
