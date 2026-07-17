# Framework Compatibility

This file helps AI agents reason about Telerik UI for Blazor upgrades in the context of supported .NET and Blazor versions.

Use this file whenever the developer asks:

- Can I upgrade Telerik UI for Blazor without upgrading .NET?
- Does Telerik UI for Blazor support .NET X?
- Which .NET version should I use?
- Can I stay on my current framework?
- Should I upgrade .NET first or Telerik first?

This file complements the official compatibility documentation and should be used together with the release summaries and upgrade documentation.

---

# Agent Guidance

Framework compatibility is an important part of every upgrade recommendation.

Before recommending an upgrade, determine:

1. Current Telerik UI for Blazor version.
2. Target Telerik UI for Blazor version.
3. Current .NET version.
4. Target .NET version.
5. Blazor hosting model (Server, WebAssembly, or Blazor Web App).

Do not assume that every Telerik release supports every .NET version.

Always verify compatibility before recommending an upgrade.

---

# Recommended Upgrade Order

When both Telerik UI for Blazor and .NET must be upgraded:

1. Review the supported framework versions for the target Telerik release.
2. Upgrade the .NET SDK and project if required.
3. Upgrade Telerik UI for Blazor packages.
4. Review breaking changes.
5. Review rendering changes.
6. Perform regression testing.

---

# Compatibility Matrix

> Keep this table updated as new Telerik releases become available.

| Telerik UI for Blazor | Supported .NET Versions | Notes |
|------------------------|-------------------------|-------|
| Latest | See official compatibility documentation | Preferred version for new development |
| Previous major | See official compatibility documentation | Supported according to Telerik support policy |
| Older versions | Refer to old version support policy | May no longer receive fixes |

---

# Hosting Models

When discussing upgrades, identify the hosting model because behavior and project structure may differ.

Supported hosting models include:

- Blazor Server
- Blazor WebAssembly
- Blazor Web App

Framework compatibility recommendations apply to all supported hosting models unless explicitly documented otherwise.

---

# Common Compatibility Pitfalls

## Unsupported .NET Version

Symptoms

- Build errors
- Runtime issues
- Missing APIs

Recommendation

Verify that the Telerik UI for Blazor version officially supports the target .NET version.

---

## Upgrading Telerik Without .NET

Symptoms

- Package installation succeeds.
- Build or runtime failures occur.

Recommendation

Check whether the target Telerik version requires a newer .NET release.

---

## Upgrading .NET Without Telerik

Symptoms

- Obsolete API warnings.
- Runtime inconsistencies.
- Missing fixes or compatibility improvements.

Recommendation

Evaluate upgrading Telerik UI for Blazor after upgrading .NET.

---

## End-of-Support Versions

Older Telerik UI for Blazor releases eventually leave active support.

Recommendation

If the application depends on an unsupported version, recommend planning an upgrade to a supported release before introducing new development.

---

# Related References

- release-summary.md
- breaking-changes-by-version.md
- rendering-changes-by-version.md
