---
name: telerik-winforms-workflow-efficiency
description: >
  Scoped execution handoffs and evidence-based review for Telerik WinForms
  scenarios. Reuses valid checks without weakening error, licensing, or review
  gates; non-blocking warnings are reported as known issues, not a gate.
metadata:
  discovery: scenarioExtension
  extends-scenario: [telerik-winforms-control-conversion, telerik-winforms-version-upgrade, telerik-winforms-assembly-to-nuget, telerik-winforms-licensing]
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
  order: 110
  scope: [Execution, IntegrityReview]
  scopeInstructions:
    Execution: scopes/execution.md
---

# Telerik WinForms Review Scope

This body supplies the IntegrityReview scope. The host still owns review,
model selection, lifecycle, and continuation; this extension replaces none of
those rules.

- Review the actual changed source/configuration and its callers in one
  complete pass. Use the supplied original/converter backups when there is no
  Git repository; do not require Git initialization.
- Start with the changed references and resolved NuGet assets for exact
  package/version/TFM facts. A successful restore is evidence of resolution,
  not proof that runtime behavior is correct. Investigate concrete binding,
  API, licensing, or behavior risks in the change, not the entire dependency
  graph merely because a package was added.
- For an unresolved Telerik API question, use
  `telerik-winforms-component-guidance`. Do not delegate a lookup solely to
  re-prove facts already established by the restored metadata. If another
  investigator is necessary, give it one bounded, unresolved question.
- Review implementation correctness, not research-note ordering or whether
  an otherwise complete handoff could be longer. Missing lookup evidence is
  not proof that an API or dependency is invented.
- Do not raise a finding, or return CHANGES NEEDED, because the build has
  warnings. Under `telerik-winforms-migration-verification`'s **Warning
  Policy**, only errors, blocking `TKL*` diagnostics, and an actual
  suppression (`NoWarn`, `#pragma`, a changed warning severity) are findings.
  A dependency-graph warning such as `MSB3277` recorded under **Known issues**
  is reported, not silenced; flag it only when it is missing from the record.
- Write the initial verdict, including a clean PASS, to the task's supplied
  `review.md` during this same review. The host permits a clean review record;
  creating it now avoids a second agent solely to record the verdict.
- Return all findings together and state runtime/Designer limits explicitly.
  A static PASS must not claim interactive checks were run.
