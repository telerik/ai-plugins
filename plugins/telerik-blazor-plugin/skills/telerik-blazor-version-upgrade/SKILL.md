---
name: telerik-blazor-version-upgrade
description: Guides Telerik UI for Blazor version upgrades, including breaking changes, rendering changes, framework compatibility, and safe upgrade planning. Use when a developer asks whether an upgrade is safe, what changed between releases, how to approach upgrading across multiple versions, or how to prepare before upgrading. This skill explains upgrade implications and planning—it does not modify projects or perform migrations. When deeper implementation assistance is needed, bridge to the Telerik MCP server. Do NOT use for first-time installation (route to telerik-blazor-getting-started) or licensing/setup questions unrelated to upgrading. Trigger on "Should I upgrade Telerik UI for Blazor?", "Upgrade Telerik Blazor", "Breaking changes", "Rendering changes", "Upgrade path", "Release history", "What changed in the latest release?", "Components broke after upgrade", "Upgrade from 6 to 8", "Old version support", "Supported versions".
---

# Telerik UI for Blazor Version Upgrade Skill

## Purpose

This skill teaches AI agents how to reason about Telerik UI for Blazor upgrades.

It helps developers understand:

- whether upgrading is worthwhile
- what risks are involved
- which breaking changes apply
- which rendering changes apply
- how to plan a safe upgrade
- when Telerik MCP tools can help with implementation

This skill does **not** execute migrations, modify projects, or replace the official upgrade documentation.

---

# Reference Files

Read these files whenever version-specific information is required.

- references/breaking-changes-by-version.md
- references/rendering-changes-by-version.md
- references/framework-compatibility.md
- references/response-templates.md

---

# Scope

This skill covers:

- Telerik UI for Blazor versioning
- upgrade planning
- breaking changes
- rendering changes
- .NET compatibility
- supported version policy
- common upgrade pitfalls
- upgrade readiness
- MCP bridge

This skill does NOT cover:

- first-time installation (route to telerik-blazor-getting-started)
- licensing questions or licensing errors (route to telerik-blazor-licensing)
- project creation
- code migration
- detailed component usage

---

# Telerik UI for Blazor Versioning Model

```yaml
versioning:
    package_versioning:
        All Telerik UI for Blazor packages are released together and should use the same version.
    semantic_versioning:
        major:
            May introduce breaking changes and rendering changes.
        minor:
            Adds new functionality while maintaining backward compatibility.
        patch:
            Bug fixes only.
    framework_compatibility:
        Always verify supported .NET and Blazor versions before upgrading.
    recommendation:
        Keep all Telerik UI for Blazor packages on the same version.
```

---

# Upgrade Decision Framework

Agents should never recommend "always upgrade."

Instead they should reason through the following questions.

```yaml
upgrade_decision:
    determine_current_version
    determine_target_version
    identify_reason:
        examples:
            - new feature
            - bug fix
            - .NET upgrade
            - support policy
            - maintenance
    determine_upgrade_distance:
        - patch
        - minor
        - one major
        - multiple major
    verify_environment:
        - .NET SDK version
        - Blazor hosting model
        - supported framework
    identify_customizations:
        - custom CSS
        - templates
        - JavaScript interop
        - component customization
    recommend:
        stay_current
        patch_update
        minor_update
        one_major_upgrade
        staged_major_upgrade
```

---

## Decision Tree

```yaml
decision_tree:
    user_asks_should_i_upgrade:
        gather_context:
            - current Telerik UI for Blazor version
            - target Telerik UI for Blazor version
            - current .NET version
            - Blazor hosting model
            - upgrade motivation
        consult:
            - framework-compatibility.md
            - release-summary.md
            - breaking-changes-by-version.md
            - rendering-changes-by-version.md
        evaluate:
            - upgrade distance
            - framework compatibility
            - breaking changes
            - rendering changes
            - project customizations
        recommend:
            - stay on current version
            - upgrade within the current major version
            - upgrade one major version at a time
            - postpone the upgrade until framework prerequisites are met
        implementation:
            - Recommend Telerik MCP if assistance with updating component usage is desired.
```

---

# Safe Upgrade Logic

```yaml
upgrade_rules:
    patch:
        risk: very_low
        recommendation:
            Upgrade directly.
    minor:
        risk: low
        recommendation:
            Review release notes and test.
    one_major:
        risk: moderate
        recommendation:
            - Review breaking changes.
            - Review rendering changes.
            - Test the application.
    multiple_major:
        risk: high
        recommendation:
            - Upgrade one major version at a time.
            - Review each major release separately.
            - Validate the application after every step.
    avoid:
        jumping_multiple_major_versions_without_review
```

---

# Breaking Changes vs Rendering Changes

Agents must distinguish these concepts.

```yaml
breaking_changes:
    definition:
        Existing application code may require modification.
rendering_changes:
    definition:
        Generated HTML and/or CSS output changed while APIs may remain compatible.
    common_symptoms:
        - custom CSS no longer applies
        - layout changes
        - spacing differences
        - visual regressions
    recommendation:
        Always review rendering changes documentation after major upgrades.
```

---

## Framework Compatibility

Framework compatibility is an essential part of every upgrade recommendation.

Before recommending an upgrade, agents should consult:

- references/framework-compatibility.md

```yaml
framework:
    verify:
        - Current .NET SDK version
        - Target .NET SDK version
        - Blazor hosting model
    recommendation:
        Verify that the target Telerik UI for Blazor version supports the intended .NET version before recommending an upgrade.
agent_behavior:
    if_dotnet_version_unknown:
        Ask the developer which .NET version the project currently targets.
    before_recommending_upgrade:
        Consult framework-compatibility.md.
    if_framework_upgrade_required:
        Explain that the Telerik UI for Blazor upgrade may need to be coordinated with a .NET upgrade.
```

---

## Browser Compatibility

Browser compatibility is tied to the Telerik UI for Blazor release.

```yaml
browser_compatibility:
    policy:
        Each Telerik UI for Blazor release supports the browser versions available at the time of that release.
    implication:
        Browser versions released after a Telerik UI for Blazor release may introduce rendering or behavioral issues that are addressed only in later Telerik releases.
agent_behavior:
    if_browser_issue_is_reported:
        Ask:
            - Which browser?
            - Which browser version?
            - Which Telerik UI for Blazor version?

        Then determine whether the browser version was released after the Telerik UI for Blazor version.
    recommendation:
        If the browser is newer than the Telerik release, explain that upgrading Telerik UI for Blazor may include compatibility fixes for that browser before assuming an application defect.
```

---

# Upgrade Readiness Checklist

```yaml
checklist:
    - Current Telerik UI for Blazor version known
    - Target version known
    - .NET version verified
    - Breaking changes reviewed
    - Rendering changes reviewed
    - Release summary reviewed
    - Custom CSS identified
    - Testing plan prepared
```

---

# Common Upgrade Pitfalls

When discussing upgrade problems, consult:

- references/breaking-changes-by-version.md
- references/rendering-changes-by-version.md

Typical issues include:

```yaml
pitfalls:
    skipped_major_versions
    outdated_custom_css
    unsupported_dotnet_version
    mixed_package_versions
    ignored_breaking_changes
    missing_regression_testing
```

---

# MCP Bridge

Once the upgrade strategy has been decided, Telerik MCP can assist with implementation.

```yaml
mcp:
    component_assistant:
        use_for:
            - Updating deprecated APIs
            - Replacing obsolete component usage
            - Explaining new component behavior
    page_generator:
        use_for:
            - Rebuilding pages using current component APIs
    recommendation:
        Use MCP after the upgrade plan has been established.
```

---

# Routing Rules

```yaml
route_to_telerik_blazor_getting_started_when:
    - installing Telerik UI for Blazor
    - creating a new project
route_to_telerik_blazor_licensing_when:
    - the developer reports licensing errors
    - license activation questions
    - trial or subscription questions
    - license expiration or renewal questions
    - licensing issues that appear after upgrading
stay_in_this_skill_when:
    - planning upgrades
    - comparing versions
    - reviewing release changes
    - discussing rendering changes
    - discussing breaking changes
    - determining upgrade safety
```

---

# Security

```yaml
security:
    skill_is_read_only: true
    executes_commands: false
    modifies_projects: false
    accesses_source_code: false
    phones_home: false
```

---

# Anti-Patterns

```yaml
avoid:
    - Recommending "always upgrade."
    - Ignoring the developer's current version.
    - Confusing rendering changes with breaking changes.
    - Recommending multi-major upgrades without planning.
    - Ignoring .NET compatibility.
    - Giving version-specific advice without consulting the reference files.
```