# Breaking Changes by Version — Telerik UI for Blazor

Read this file when the developer asks about:

- a specific Telerik UI for Blazor version
- a version-to-version upgrade
- whether an upgrade requires code changes
- why compile errors appeared after upgrading

This file summarizes the most significant upgrade-impacting changes. It is intended to help AI agents reason about upgrade risk and identify the areas of an application that are most likely to require attention.

For the complete authoritative information, always defer to:

- Upgrade Overview
  https://www.telerik.com/blazor-ui/documentation/upgrade/overview

- Breaking Changes Index
  https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/list

- Release History
  https://www.telerik.com/support/whats-new/blazor-ui/release-history

---

# 14.0.0 (2026 Q2) — HIGH IMPACT

Upgrade Profile

```yaml
impact: High
likelihood: Medium
primary_risk:
    API changes
    appearance parameter changes
    chart template migration
affected_projects:
    Applications using Chart templates
    Applications using TabStrip state management
    Applications customizing ThemeColor
    Applications using PDFViewer callbacks
    Applications using Menu popup behavior
```

## Summary

Version 14.0.0 introduces several important API changes together with appearance-related breaking changes across multiple components.

The largest migration effort is typically required for applications that:

- customize component appearance through ThemeColor,
- use Chart templates,
- manage TabStrip state,
- integrate PDFViewer,
- or rely on previous Menu popup behavior.

Most applications will require targeted code updates rather than large architectural changes. :contentReference[oaicite:1]{index=1}

---

## Chart

### Breaking Change

Chart label and tooltip template syntax based on inline Razor expressions is deprecated.

Templates now reference JavaScript functions instead.

### Migration Considerations

Review every Chart template that uses inline template syntax.

This change is also related to improved Content Security Policy (CSP) compliance.

### Typical Symptoms

- Template compilation errors
- Labels no longer render
- Tooltip content missing

---

## Chat

### Breaking Change

The `OnLoadMoreMessages` event now returns the complete rendered message range instead of only the newly requested page.

### Migration Considerations

Applications implementing custom endless scrolling should review any paging logic that depends on the previous behavior.

### Typical Symptoms

- Incorrect paging calculations
- Duplicate or missing messages

---

## Menu

### Breaking Change

Using `HideOn="Click"` now closes child popups when a leaf item is clicked.

### Migration Considerations

Applications depending on the previous popup behavior should review custom navigation flows.

### Typical Symptoms

- Menus closing sooner than expected

---

## PDFViewer

### Breaking Changes

- Internal PDF.js upgraded to version 5.x.
- `ZoomChanged` callback now receives `object` instead of `decimal`.

### Migration Considerations

Review custom ZoomChanged handlers.

If the application also references PDF.js directly, ensure all dependencies use compatible versions.

### Typical Symptoms

- Compile errors
- Callback signature mismatch
- Runtime PDF integration issues

---

## TabStrip

### Breaking Change

`ActiveTabIndex`

and

`ActiveTabIndexChanged`

have been removed.

Use:

- ActiveTabId
- ActiveTabIdChanged

instead.

### Migration Considerations

Review any code that stores or restores selected tabs.

### Typical Symptoms

- Compile errors
- Selected tab no longer restored

---

## ThemeColor Changes

### Breaking Changes

Several ThemeColor values have been removed from multiple components.

Some components no longer expose a ThemeColor parameter at all.

Affected components include:

- Button
- SplitButton
- DropDownButton
- Badge
- Avatar
- Loader
- Notification
- AppBar
- Dialog
- Window
- Card
- Popup edit settings

### Migration Considerations

Review all ThemeColor usage.

Where ThemeColor has been removed, migrate to CSS classes or other supported styling approaches.

### Typical Symptoms

- Compile errors
- Appearance changes
- Missing theme colors

---

## Why Developers Notice This Release

Developers upgrading to 14.0.0 most commonly report:

- ThemeColor compile errors
- Chart template failures
- TabStrip API changes
- Visual differences after appearance updates
- PDFViewer callback signature changes

---

## What to Review First

- Chart templates
- ThemeColor usage
- TabStrip state management
- PDFViewer event handlers
- Menu navigation logic

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/14-0-0

---

# 13.0.0 (2026 Q1) — LOW IMPACT

Upgrade Profile

```yaml
impact: Low
likelihood: Low
primary_risk:
    Behavioral adjustments
affected_projects:
    Projects using newly updated components
```

## Summary

Version 13.0.0 introduces very few documented breaking changes.

Most applications can upgrade with minimal code changes.

Developers should still review the release notes because behavioral refinements may affect customized applications. :contentReference[oaicite:2]{index=2}

---

## Migration Considerations

- Review the release notes.
- Validate customized components.
- Run regression tests.

---

## Typical Symptoms

- Minor behavioral differences
- Component-specific regressions in customized scenarios

---

## What to Review First

- Customized components
- Templates
- Integration tests

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/13-0-0

---

# 12.0.0 (2025 Q4) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: Medium
primary_risk:
    Parameter renames
    API deprecations
affected_projects:
    Applications using Chat
    Filter
    Pager
    ToolBar
```

## Summary

Version 12.0.0 focuses primarily on API modernization through parameter renames and deprecations.

Most upgrades are straightforward but may require small source-code updates where renamed parameters or events are used. :contentReference[oaicite:3]{index=3}

---

## Chat

### Breaking Changes

- `MessageTemplate` is renamed to `MessageContentTemplate`.
- `MessageTemplate` now replaces the entire message bubble.

### Typical Symptoms

- Compile errors
- Unexpected message rendering

---

## Filter

### Breaking Change

`ValueChanged`

is deprecated.

Use:

`OnUpdate`

instead.

---

## Pager

### Breaking Changes

`Adaptive`

is deprecated.

Use:

`Responsive`

instead.

This also applies to pager settings in components such as Grid and TreeList.

---

## ToolBar

### Breaking Change

`Adaptive`

is deprecated.

Use:

`OverflowMode`

instead.

---

## What to Review First

- Chat templates
- Pager configuration
- ToolBar configuration
- Filter event handlers

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/12-0-0

---

# 11.0.0 (2025 Q4) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: Medium
primary_risk:
    Theme updates
    Data binding validation
affected_projects:
    Applications upgrading themes
    Applications that accidentally configure both Data and OnRead
```

## Summary

Version 11.0.0 contains relatively few API breaking changes, but introduces an important validation rule together with a Fluent theme refresh.

The validation change prevents unsupported component configurations that previously could lead to unpredictable runtime behavior.

---

## Common

### Breaking Change

Components now throw an exception when both

- Data

and

- OnRead

are configured simultaneously.

This combination has never been supported, but previous releases could allow it in some scenarios.

### Migration Considerations

Review all data-bound Telerik components.

Applications should use either:

- Data

or

- OnRead

depending on whether data is supplied locally or loaded on demand.

### Typical Symptoms

- Runtime exceptions after upgrading
- Components failing during initialization

---

## Fluent Theme

### Breaking Change

The Fluent theme has been updated to align with Microsoft's Fluent 2 design language.

### Migration Considerations

Applications using:

- custom Fluent CSS
- CSS overrides
- pixel-perfect layouts

should verify their UI after upgrading.

### Typical Symptoms

- Visual differences
- Updated spacing
- Different typography
- Slight layout shifts

---

## Why Developers Notice This Release

Developers typically notice:

- runtime exceptions caused by invalid Data/OnRead configuration
- visual differences after the Fluent theme update

---

## What to Review First

- Components using OnRead
- Components using Data
- Custom Fluent CSS
- Layout regression tests

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/11-0-0

---

# 10.0.0 (2025 Q3) — LOW TO MODERATE IMPACT

Upgrade Profile

```yaml
impact: Low
likelihood: Low
primary_risk:
    AI Prompt API changes
affected_projects:
    Applications using AIPrompt
```

## Summary

Version 10.0.0 contains a focused breaking change affecting the AIPrompt component.

Applications that do not use AIPrompt will typically experience a straightforward upgrade.

---

## AIPrompt

### Breaking Changes

The following API has been removed:

- OnOutputRate
- ShowOutputRating

Output rating is now implemented through OutputActions together with the OnOutputActionClick event.

Retry and Copy remain built-in actions but must now be configured through the OutputActions collection.

### Migration Considerations

Review every AIPrompt implementation.

If the application previously relied on output rating, migrate that functionality to output actions.

### Typical Symptoms

- Compile errors
- Missing output rating UI
- Event handlers no longer firing

---

## Why Developers Notice This Release

Most developers only encounter this release if they have adopted AIPrompt.

---

## What to Review First

- AIPrompt configuration
- OutputActions
- OutputActionClick handlers

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/10-0-0

---

# 9.0.0 (2025 Q2) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: High
primary_risk:
    Framework requirements
    Licensing
    Window API
affected_projects:
    All applications upgrading from .NET 6 or .NET 7
    Applications using Window positioning
```

## Summary

Version 9.0.0 introduces several foundational changes.

The most significant changes are:

- migration to the unified licensing model
- updated .NET support requirements
- Window positioning API changes

Many applications can continue working with minimal component changes, but project configuration may require updates. :contentReference[oaicite:1]{index=1}

---

## Common

### Unified Package Distribution

Trial and commercial packages are now unified into a single distribution.

Licensing is controlled through a Telerik license key instead of separate package feeds.

### Migration Considerations

If licensing issues occur after upgrading, route to:

telerik-blazor-licensing

Do not troubleshoot licensing inside this skill.

### Typical Symptoms

- License warnings
- Application startup licensing errors

---

## .NET Support

### Breaking Change

Version 9.0.0 supports .NET 8.

Support for:

- .NET 6

- .NET 7

has been removed. :contentReference[oaicite:2]{index=2}

### Migration Considerations

Verify framework compatibility before planning the Telerik upgrade.

Projects targeting unsupported .NET versions must upgrade the framework first.

### Typical Symptoms

- Build failures
- NuGet compatibility errors

---

## Window

### Breaking Change

The

Centered

parameter has been removed.

Windows are now centered automatically whenever Top and Left are not explicitly specified.

### Migration Considerations

Applications that previously toggled Centered programmatically should instead update Top and Left.

### Typical Symptoms

- Compile errors
- Different initial Window positioning

---

## Why Developers Notice This Release

Developers commonly report:

- framework compatibility issues

- licensing questions

- Window positioning changes

---

## What to Review First

- Target Framework
- Telerik licensing
- Window configuration

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/breaking-changes/9-0-0

---

# Upgrade Path Quick Reference

| From → To | Risk | Primary concern |
|------------|------|-----------------|
| Minor / Patch within same major | Low | Bug fixes and new features only |
| One major version | Moderate | Review breaking changes and rendering changes for the target version |
| Two major versions | High | Review each major version individually and validate after each upgrade |
| Three or more major versions | Very High | Upgrade sequentially across each major release; do not treat as a single jump |

---

# Agent Guidance

When discussing breaking changes:

- Focus only on the versions involved in the requested upgrade.
- Explain the practical impact before listing API changes.
- Distinguish breaking changes from rendering changes.
- Mention rendering changes separately if the application builds successfully but the UI looks different.
- Recommend reviewing the official documentation for the target version before upgrading.
- If licensing questions or licensing errors arise during or after the upgrade, route the conversation to **telerik-blazor-licensing**.
- If the project targets an unsupported .NET version, recommend upgrading the framework before upgrading Telerik UI for Blazor.