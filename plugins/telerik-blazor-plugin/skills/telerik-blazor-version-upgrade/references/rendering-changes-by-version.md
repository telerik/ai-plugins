# Rendering Changes by Version — Telerik UI for Blazor

Read this file when the developer reports that:

- the application builds successfully after upgrading,
- but the UI looks different,
- custom CSS stopped working,
- component layout or spacing changed,
- HTML or CSS selectors no longer match.

Rendering changes affect generated HTML, CSS classes, accessibility attributes, or visual behavior. They typically **do not produce compile errors**, but they can require updates to custom styling or DOM-dependent code.

For the complete authoritative information, always defer to:

- Upgrade Overview  
  https://www.telerik.com/blazor-ui/documentation/upgrade/overview

- Rendering Changes Index  
  https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/list

- Release History  
  https://www.telerik.com/support/whats-new/blazor-ui/release-history

---

# 14.0.0 (2026 Q2) — HIGH IMPACT

Upgrade Profile

```yaml
impact: High
likelihood: High
primary_risk:
    HTML structure updates
    CSS selector changes
    Theme rendering improvements
affected_projects:
    Applications with custom CSS
    Applications using CSS isolation
    Applications relying on generated HTML
    Applications using JavaScript to inspect component DOM
```

## Summary

Version 14.0.0 introduces the largest rendering refresh since the introduction of the rendering-changes documentation.

Most changes improve accessibility, consistency, and alignment with the latest Kendo Design System, but applications that customize Telerik components through CSS or DOM inspection should carefully validate their UI after upgrading.

---

## General Rendering Changes

### Rendering Updates

Several components now render updated HTML structures and CSS class combinations.

The generated markup better aligns with current accessibility recommendations and design system conventions.

### Typical Symptoms

- Custom CSS no longer applies.
- Margins or spacing appear different.
- Alignment changes.
- Automated UI tests fail because DOM structure has changed.

### Migration Considerations

Avoid targeting internal Telerik HTML whenever possible.

Prefer:

- component parameters,
- ThemeBuilder,
- CSS variables,
- documented CSS classes.

---

## Accessibility Improvements

Several components now emit improved accessibility attributes.

Examples include updated ARIA attributes and more consistent semantic markup.

### Typical Symptoms

- Accessibility snapshots change.
- UI automation selectors require updates.

---

## Component Rendering Updates

Multiple components receive rendering refinements, including improvements to:

- layout consistency,
- keyboard navigation,
- visual alignment,
- focus handling.

Applications using CSS overrides should verify affected components after upgrading.

---

## Why Developers Notice This Release

Developers most commonly report:

- custom CSS stopped working
- spacing differences
- alignment changes
- UI tests failing
- CSS isolation selectors no longer matching

---

## What to Review First

- Custom CSS
- CSS isolation (.razor.css)
- ::deep selectors
- JavaScript DOM queries
- UI automation tests

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/14-0-0

---

# 13.0.0 (2026 Q1) — LOW IMPACT

Upgrade Profile

```yaml
impact: Low
likelihood: Low
primary_risk:
    Minor rendering refinements
affected_projects:
    Applications with heavily customized component styling
```

## Summary

Version 13.0.0 introduces only minor rendering refinements.

Most applications should not require CSS changes, although customized layouts should still be validated during regression testing.

---

## Typical Symptoms

- Minor spacing adjustments
- Slight visual refinements

---

## Migration Considerations

Perform normal visual regression testing.

No widespread HTML changes are expected.

---

## What to Review First

- Customized component styling
- Regression screenshots

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/13-0-0

---

# 12.0.0 (2025 Q4) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: Medium
primary_risk:
    Pager rendering
    Toolbar rendering
affected_projects:
    Applications with customized Pager styling
    Applications overriding ToolBar CSS
```

## Summary

Rendering updates in 12.0.0 primarily support the associated API modernization.

Most applications continue to function normally, but customized styling around Pager and ToolBar should be verified.

---

## Pager

Rendering has been updated to support the newer responsive behavior and associated configuration changes.

### Typical Symptoms

- Pager layout differs slightly.
- Custom CSS selectors require updates.

---

## ToolBar

Toolbar rendering has been updated to better support overflow behavior.

### Typical Symptoms

- Overflow items appear differently.
- Toolbar spacing changes.

---

## Why Developers Notice This Release

Most developers only notice rendering changes when custom CSS targets Pager or ToolBar internals.

---

## What to Review First

- Pager CSS
- ToolBar CSS
- Responsive layouts

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/12-0-0

---

# 11.0.0 (2025 Q4) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: Medium
primary_risk:
    Theme rendering updates
    CSS customization changes
affected_projects:
    Applications using Fluent theme
    Applications with custom component CSS
    Applications with pixel-perfect layouts
```

## Summary

Version 11.0.0 includes rendering updates primarily related to theme modernization and improved component consistency.

Applications using default Telerik themes usually upgrade smoothly. Applications that override Telerik styles or depend on specific generated markup should validate the UI after upgrading.

---

## Fluent Theme

### Rendering Updates

The Fluent theme receives updates to align with Microsoft's Fluent design language.

Changes may affect:

- spacing
- typography
- colors
- component dimensions
- visual hierarchy

### Typical Symptoms

- Buttons appear slightly different.
- Input heights change.
- Component spacing changes.
- Custom Fluent CSS overrides no longer match.

### Migration Considerations

Review:

- custom theme overrides
- CSS variables
- component-specific selectors

Avoid relying on hardcoded pixel values for Telerik component internals.

---

## Component Markup

### Rendering Updates

Some components receive internal markup refinements.

Applications that rely on generated HTML structure should validate their selectors.

### Typical Symptoms

- JavaScript selectors no longer find elements.
- Automated UI tests fail.
- CSS selectors stop matching.

---

## Why Developers Notice This Release

Most reported issues are not caused by component functionality changes, but by:

- custom styling assumptions,
- theme overrides,
- DOM dependencies.

---

## What to Review First

- Fluent theme customizations
- CSS isolation files
- ::deep selectors
- JavaScript DOM access
- Visual regression tests

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/11-0-0

---

# 10.0.0 (2025 Q3) — LOW IMPACT

Upgrade Profile

```yaml
impact: Low
likelihood: Low
primary_risk:
    Component-specific markup updates
affected_projects:
    Applications using custom CSS
```

## Summary

Version 10.0.0 contains limited rendering changes.

Most applications should not require visual updates unless they customize Telerik component rendering through CSS selectors or HTML structure assumptions.

---

## Component Rendering

### Rendering Updates

Some components received internal markup improvements.

These changes are intended to improve consistency and accessibility.

### Typical Symptoms

- CSS overrides no longer apply.
- Minor spacing differences.

---

## Migration Considerations

Review only customized components.

Applications using Telerik themes without overrides typically require no changes.

---

## What to Review First

- Custom CSS
- CSS isolation
- UI screenshots

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/10-0-0

---

# 9.0.0 (2025 Q2) — MODERATE IMPACT

Upgrade Profile

```yaml
impact: Moderate
likelihood: Medium
primary_risk:
    CSS class changes
    Theme updates
affected_projects:
    Applications with custom styling
    Applications migrating to the unified package model
```

## Summary

Version 9.0.0 introduces important visual updates as part of the broader product modernization.

The main rendering considerations are related to updated themes, CSS classes, and component consistency.

---

## Theme Rendering

### Rendering Updates

Updated themes may introduce changes to:

- generated CSS classes
- spacing
- component dimensions
- visual states

### Typical Symptoms

- Existing CSS selectors stop working.
- Components look slightly different.
- Custom colors are not applied.

---

## Component HTML Structure

### Rendering Updates

Some components received internal markup improvements.

Applications should avoid relying on undocumented DOM structures.

### Typical Symptoms

- JavaScript interop selectors fail.
- UI tests require selector updates.

---

## Migration Considerations

Review:

- custom CSS
- CSS isolation files
- JavaScript integrations
- automated UI tests

If licensing errors appear after upgrading, route to:

`telerik-blazor-licensing`

Do not treat licensing issues as rendering issues.

---

## Why Developers Notice This Release

Developers commonly notice:

- CSS overrides failing
- theme differences
- visual regressions

---

## What to Review First

- Custom styles
- Theme configuration
- DOM-dependent code
- UI automation

Official documentation

https://www.telerik.com/blazor-ui/documentation/upgrade/rendering-changes/9-0-0

---

# Rendering Changes Quick Reference

| From → To | Risk | Primary concern |
|---|---|---|
| Same major version | Low | Normal visual regression testing |
| One major version | Moderate | Review rendering changes and custom CSS |
| Multiple major versions | High | Review every major version individually |
| Custom CSS-heavy application | Higher | Validate selectors and component markup |

---

# Agent Guidance

When discussing rendering changes:

- First determine whether the issue is visual or functional.
- If the application does not compile, check breaking changes first.
- If the application compiles but the UI changed, check rendering changes.
- Ask whether the application uses:
  - custom CSS,
  - CSS isolation,
  - ::deep selectors,
  - JavaScript DOM manipulation,
  - automated UI tests.
- Do not recommend changing Telerik component source markup.
- Prefer supported customization mechanisms:
  - component parameters,
  - CSS variables,
  - ThemeBuilder,
  - documented CSS selectors.
- Treat browser updates separately:
  newer browser versions may introduce issues that are addressed in later Telerik UI for Blazor releases.
- Route licensing-related issues to `telerik-blazor-licensing`, even if they appear after an upgrade.