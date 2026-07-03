---
name: kendo-react-version-upgrade
description: Use when a developer asks about upgrading KendoReact between versions, whether an upgrade is safe, what broke in a specific version, how to approach a multi-version jump, or what preparation is needed before upgrading. This skill provides guidance and reasoning about upgrades — it does not execute migrations. For execution, it bridges to the Kendo CLI (`kendo migrate`) and the MCP server. Do NOT use for first-time install (route to kendo-react-getting-started) or for licensing failures unrelated to version coverage (route to kendo-react-product-licensing). Trigger on "Should I upgrade KendoReact?", "Is it safe to go from v12 to v15?", "What broke in v15?", "How do I upgrade KendoReact?", "kendo migrate", "breaking changes between versions", "my components broke after npm update", "themeColor dark light removed", "ref returns Handle instead of class", "icon names changed", "TKL102 version not covered", "perpetual license upgrade", "what changed in the latest release", "should I skip versions", "upgrade path", "codemod migration", "npm-check-updates kendo".
---

# KendoReact Version Upgrade Skill

## Purpose

This skill teaches agents how to **reason about KendoReact version upgrades** — what changed, what to watch out for, and how to approach upgrades safely.

It helps agents explain why an upgrade might be risky or beneficial and what preparation is needed, rather than executing migrations directly. The skill provides guidance, not execution: actual code changes are handled by the Kendo CLI (`kendo migrate`) and the MCP server's Component Assistant.

This skill does not replace release notes, migration guides, or the official breaking changes documentation. It teaches agents how to interpret and apply that information in context.

## Reference files

- `references/breaking-changes-by-version.md` — Per-version summaries of breaking changes for v9 through v15. Read when the developer asks about a specific version or a specific version-to-version upgrade path.
- `references/response-templates.md` — Ready-made response text for common upgrade scenarios.

---

## Scope Boundaries

This skill covers:

- Explaining the KendoReact versioning model (semver, co-released packages, theme alignment)
- Helping developers decide whether to upgrade, when, and how aggressively
- Identifying which versions introduce breaking changes and what kind
- Recommending safe upgrade paths (consecutive majors vs. version skipping)
- Flagging common upgrade pitfalls that lead to support tickets
- Explaining license implications of upgrading (perpetual coverage windows, TKL102)
- Bridging to the Kendo CLI and MCP for execution once the decision is made

This skill does not cover:

- First-time install or onboarding — route to `kendo-react-getting-started`
- Licensing failures unrelated to version coverage — route to `kendo-react-product-licensing`
- MCP entitlement failures — route to `kendo-mcp-licensing`
- Executing code changes — defer to `kendo migrate` or the MCP Component Assistant
- Detailed component API changes — defer to the official breaking changes docs

---

## KendoReact Versioning Model

Agents must understand these rules before giving upgrade advice.

```yaml
versioning_rules:
    co_release: >
        All @progress/kendo-react-* packages are released together and share
        the same version number. You cannot mix v14 Grid with v15 DateInputs.
    semver:
        major: Breaking changes in the API. Application code may need updates.
        minor: New features. Existing code continues to work.
        patch: Bug fixes only. No code changes needed.
    theme_alignment: >
        When upgrading KendoReact packages, you MUST also update the
        @progress/kendo-theme-* packages to the latest compatible version.
        Mismatched theme versions cause styling regressions.
    package_json_range: >
        The default caret range (^14.0.0) allows minor and patch updates
        but blocks major version bumps. Running 'npm update' within a major
        is safe. Crossing a major requires explicit version changes.
```

---

## Theme Compatibility

The `@progress/kendo-theme-*` packages (Default, Bootstrap, Material, Fluent) are **decoupled** from the KendoReact component packages and follow their own version numbering. KendoReact and theme major versions do not track each other (e.g., KendoReact v9 uses themes v10). The changelog is the authoritative source. All four themes always require the same version for any given KendoReact release.

### KendoReact-to-Theme Compatibility Matrix

Extracted from the KendoReact changelog (https://www.telerik.com/kendo-react-ui/components/changelogs/ui-for-react).

```yaml
theme_matrix:
    # KendoReact version range → required theme version (all four themes)
    v14.3.0_to_v14.4.x: '^13.1.1'
    v14.2.0_to_v14.2.1: '^13.0.1'
    v14.0.0_to_v14.1.1: '^13.0.0'
    v13.0.0_to_v13.3.0: '^12.2.3'
    v12.0.0_to_v12.2.0: '^12.0.0'
    v11.0.0_to_v11.4.0: '11.0.2 to 11.3.2'
    v10.0.0_to_v10.2.0: '^10.3.1 to ^10.4.0'
    v9.0.0_to_v9.5.0:   '^10.0.1 to ^10.2.0'

    # v15 is not yet on the changelog page — check the changelog after the next update.
    # Until then, use the latest theme version with v15.

theme_compatibility_rules:
    version_mismatch_warning: >
        KendoReact and theme major versions DO NOT track each other.
        Do not assume KendoReact v14 uses themes v14 — it uses themes v13.
        Always check the matrix or the changelog's "Supported Themes" block.
    upgrade_rule: >
        After every KendoReact upgrade, check the "Supported Themes" block in the
        changelog for your target version and upgrade themes to match.
        Command: npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
    downgrade_risk: >
        Do NOT upgrade themes without also upgrading KendoReact packages —
        newer themes may expect rendering changes from newer component versions.
    cdn_rule: >
        If using a CDN link for themes, pin the theme version explicitly.
        Never use an unpinned CDN URL in production.

theme_breaking_changes:
    themes_v13:
        era: February 2026
        impact: high
        change: >
            Component option classes (size, roundness, fill mode, theme color) are no
            longer rendered in HTML when they match defaults. Defaults are now controlled
            via SCSS variables. Theme color classes separated from fill mode classes
            (e.g., 'k-button-solid k-button-primary' instead of 'k-button-solid-primary').
            Custom CSS selectors targeting the old combined class names will break.
        paired_with: KendoReact v14.0.0+

    themes_v12:
        era: mid-2025
        impact: moderate
        change: >
            Material theme aligned to Material 3 (no longer Material 2 for metrics,
            layout, fonts, elevation, typography). Legacy color system dropped entirely.
            A Material 2 color swatch is available for visual continuity.
        paired_with: KendoReact v12.0.0 – v13.3.0

    themes_v10_v11:
        era: 2024–2025
        impact: varies
        change: >
            Themes v8.0.0 introduced the new Color System (enabled by default).
            Rendering changes across many components. KendoReact v9.4.0+
            includes rendering improvements to handle v10 theme layout.
        paired_with: KendoReact v9.0.0 – v11.4.0

    practical_impact: >
        A developer upgrading KendoReact from v10 to v14 is also crossing from
        themes ^10.3 to ^13.0, which means hitting the Color System change,
        the Material 3 shift, and the class-name restructuring all at once.
        These theme breaking changes are SEPARATE from the KendoReact component
        breaking changes and must be addressed independently.
```

---

## Version History Map

Versions with documented breaking changes. Agent should consult `references/breaking-changes-by-version.md` for the specific changes in each version.

```yaml
breaking_change_versions:
    v9:
        release_era: 2023
        risk_level: moderate
        summary: Early major with API standardization changes.
    v10:
        release_era: 2024
        risk_level: moderate
        summary: Component API refinements.
    v11:
        release_era: 2024
        risk_level: moderate
        summary: Grid, DateInputs, Dialogs, TreeList changes. First version with codemod support.
        codemods_available: true
    v12:
        release_era: 2024
        risk_level: low
        summary: Chat component changes only. Codemod available.
        codemods_available: true
    v14:
        release_era: 2025
        risk_level: moderate
        summary: Dropdowns groupMode removal, Chat sendButton and uploadConfig changes.
        codemods_available: true
        codemods_for: Dropdowns (ComboBox, DropDownList, MultiSelect, AutoComplete), Chat
    v15:
        release_era: 2026
        risk_level: high
        summary: >
            Large-scale breaking changes: functional component conversions
            (ref returns Handle instead of class), themeColor value cleanup
            across 10+ components, SVG icon v5.0.0 renames/removals, font
            icon alias removal, Grid cells prop type change. Most impactful
            major since v11.
        codemods_available: true
        codemods_for: Buttons, Common/SVG Icons (167 icon renames), Indicators, Layout, Tooltip, Notification

non_breaking_versions:
    note: >
        Versions not listed above do not introduce breaking changes.
        Notably, v13 (2025) has no breaking changes — upgrading from v12 to v13
        is safe with no code changes required (same as a minor/patch upgrade).
        Minor and patch releases within any major are always non-breaking.
```

---

## Upgrade Decision Framework

When a developer asks "should I upgrade?", the agent should work through this checklist rather than defaulting to "always upgrade to latest."

```yaml
upgrade_decision:
    1_why_upgrade:
        questions:
            - What motivates the upgrade? (new feature, bug fix, security, policy, React version)
            - Is there a specific component fix or feature in the target version?
            - Is the team being asked to stay current for compliance or support reasons?
        guidance: >
            If the motivation is a specific bug fix available in a patch or minor,
            upgrade within the current major first — that's zero-risk under semver.

    2_what_version_are_they_on:
        questions:
            - What is their current @progress/kendo-react-* version?
            - How many major versions behind are they?
        guidance: >
            A developer on v12 wanting v15 is crossing 3 major boundaries.
            Each boundary may have breaking changes. Do not skip — walk through
            each major sequentially.

    3_how_big_is_the_surface:
        questions:
            - How many KendoReact components are used in the project?
            - Are any of the components in the "affected" list for each version boundary?
            - Do they use custom cell renderers, refs to component instances, or themeColor props?
        guidance: >
            If the project uses Grid with custom cells, Calendar refs, or
            themeColor='dark'/'light', v15 will require code changes.
            If the project uses only free components with no ref access,
            v15 may be low-friction.

    4_license_implications:
        questions:
            - Does the developer have a perpetual license?
            - If so, what is the coverage window expiry date?
        guidance: >
            Perpetual licenses cover only package versions released before
            the expiry date. Upgrading past the coverage window triggers
            TKL102. The developer must renew or purchase a subscription
            before upgrading. Route to kendo-react-product-licensing if
            TKL102 appears.

    5_recommend_path:
        output: >
            Based on the answers, recommend one of:
            (a) Stay on current version — the risk/effort isn't justified.
            (b) Upgrade within current major (minor/patch) — zero breaking changes.
            (c) Upgrade one major at a time using 'kendo migrate'.
            (d) Upgrade directly to latest — only if current version is one major behind.
```

---

## Safe Upgrade Path Logic

```yaml
upgrade_path_rules:
    within_same_major:
        risk: none
        action: 'npm update (within caret range) or npx npm-check-updates --upgrade --filter "/@progress/kendo-react.*/"'
        notes: No breaking changes. Always safe.

    one_major_ahead:
        risk: low to moderate
        action: >
            1. Read the breaking changes for the target version (references/breaking-changes-by-version.md).
            2. Run 'kendo migrate' if codemods are available for that boundary.
            3. Review any code comments added by the codemod.
            4. Update theme packages to match.
            5. Test.
        notes: This is the recommended upgrade unit.

    multiple_majors_ahead:
        risk: high
        action: >
            Do NOT jump directly. Walk through each major boundary one at a time.
            For example, v10 → v11 → v12 → v13 → v14 → v15.
            At each step, run 'kendo migrate' and resolve breaking changes before
            proceeding to the next.
        notes: >
            The Kendo CLI's 'kendo migrate --from X --to Y' handles this
            sequentially, but the developer should review and test at each step.

    skipping_versions:
        risk: very high
        do_not_recommend: true
        notes: >
            Skipping versions (e.g., v10 straight to v15) compounds breaking
            changes and makes it impossible to isolate which change broke what.
            The only exception is if the project uses very few components with
            no ref access, no themeColor customization, and no icon usage.

    theme_package_rule: >
        After every major upgrade, run:
        npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
        npm install
        Mismatched themes are the #1 cause of "upgrade broke my styling" tickets.
```

---

## Assisted Migration Tooling

The Kendo CLI provides automated codemods for major version migrations.

```yaml
kendo_migrate:
    command: 'kendo migrate'
    alternative: 'npx @progress/kendo-cli migrate'
    available_since: KendoReact 11 + Kendo CLI 1.9.0
    what_it_does:
        - Checks for available updates (including peer dependencies)
        - Applies codemods that transform JSX, imports, props, and event handlers
        - Adds code comments where manual review is needed
    codemods_available:
        v10_to_v11: Grid, DateInputs, Dialogs, TreeList
        v11_to_v12: Chat
        v13_to_v14: Dropdowns (groupMode removal), Chat (sendButton, uploadConfig)
        v14_to_v15: Buttons (themeColor), Common/SVG Icons (167 renames + themeColor), Indicators (Badge + Loader themeColor), Layout (AppBar + Avatar + BottomNavigation themeColor), Tooltip (method renames), Notification (type.style)
    note_v12_to_v13: No breaking changes in v13 — no codemods needed. Upgrading v12 to v13 is safe.
    codemods_reference: 'https://www.telerik.com/kendo-react-ui/components/migration/available-codemods'
    best_practices:
        - Migrate between consecutive major versions, not across multiple.
        - Migrate one package at a time for finer control.
        - Review code comments added by codemods — they flag areas needing manual adjustment.
        - Run 'kendo migrate --no-codemods' to only update packages without transformations.
        - Run 'kendo migrate --no-install' to only run codemods without updating packages.
    docs_url: 'https://www.telerik.com/kendo-react-ui/components/migration/assisted-migration'
```

---

## MCP Bridge

Once the developer has decided to upgrade and understands the scope, the MCP server can assist with execution.

```yaml
mcp_upgrade_assistance:
    kendo_component_assistant:
        use_for: >
            Help updating specific component usage after a major version upgrade.
            The Component Assistant knows the current API and can suggest correct
            prop names, event handlers, and import paths for the target version.
        handle: '#kendo_component_assistant'
    kendo_ui_generator:
        use_for: >
            Regenerating a page or component from scratch using the latest API
            when the upgrade delta is too large to patch incrementally.
        handle: '#kendo_ui_generator'
    kendo_getting_started_assistant:
        use_for: >
            Setting up the MCP server if the developer doesn't have it configured.
            Available to all license types including free.
        handle: '#kendo_getting_started_assistant'
    requirement: >
        MCP tools require an active Trial or Subscription license.
        Perpetual licenses do not include MCP tools.
```

---

## Common Upgrade Pitfalls

```yaml
pitfalls:
    theme_version_mismatch:
        symptom: Components look broken or unstyled after upgrade.
        cause: KendoReact packages upgraded but @progress/kendo-theme-* left on the old version.
        resolution: Always upgrade theme packages alongside component packages.
        frequency: Very common — the #1 upgrade-related support ticket.

    custom_css_selectors_broken_by_theme_upgrade:
        symptom: Custom styles stop applying after theme upgrade.
        cause: >
            Themes R1 2026 restructured class names — fill mode and theme color are
            now separate classes (k-button-solid k-button-primary instead of
            k-button-solid-primary). Custom CSS targeting the old combined names breaks.
        resolution: >
            Audit custom CSS for combined Kendo class selectors. Update to the new
            two-class pattern. See the Design System docs for the full mapping.

    ref_type_change:
        symptom: TypeScript errors or runtime failures when accessing component refs.
        cause: Components converted from class to functional in v15 — ref returns Handle, not class instance.
        affected_versions: v15+
        resolution: Update ref types (e.g., Calendar → CalendarHandle). Check references/breaking-changes-by-version.md.

    theme_color_removal:
        symptom: TypeScript errors or missing visual styles on Buttons, Icons, Badge, AppBar, etc.
        cause: 'dark' and 'light' themeColor values removed in v15.
        resolution: Use valid values ('base', 'primary', 'secondary', 'tertiary', etc.).

    icon_renames:
        symptom: Icons not rendering or showing wrong icon after upgrade to v15.
        cause: SVG icon names consolidated in @progress/kendo-svg-icons v5.0.0.
        resolution: Run the icon codemod or check the Iconography changelog for the mapping.

    perpetual_license_version_wall:
        symptom: TKL102 after upgrading — version not covered by license.
        cause: Perpetual license covers only versions released before the expiry date.
        resolution: Renew the license or downgrade to a covered version. Route to kendo-react-product-licensing.

    mixed_major_versions:
        symptom: Runtime errors, missing props, broken renders.
        cause: Some @progress/kendo-react-* packages on v14, others on v15.
        resolution: All packages must be on the same major version. Run 'npx npm-check-updates --upgrade --filter "/@progress/kendo-react.*/"'.

    skipped_version_compound_errors:
        symptom: Multiple unrelated errors after a multi-major jump.
        cause: Developer upgraded from v10 to v15 directly, compounding 5 majors of breaking changes.
        resolution: Roll back and upgrade one major at a time using 'kendo migrate'.

    npm_update_surprise:
        symptom: App breaks after routine 'npm install' on a fresh clone.
        cause: package.json used tilde (~) or star (*) ranges allowing unexpected major bumps.
        resolution: Pin to caret (^) ranges. Use package-lock.json consistently.
```

---

## Routing Rules

```yaml
route_to_kendo_react_getting_started_when:
    - Developer is installing KendoReact for the first time (not upgrading)
    - Developer asks about tiers, trials, or onboarding

route_to_kendo_react_product_licensing_when:
    - TKL102 appears (version not covered by perpetual license)
    - Any licensing issue unrelated to version coverage

route_to_kendo_mcp_licensing_when:
    - MCP tools return PERMISSION_DENIED (entitlement, not version)

stay_in_this_skill_when:
    - Developer asks "should I upgrade?"
    - Developer asks what broke in a specific version
    - Developer asks how to approach a multi-version jump
    - Developer reports errors after an upgrade and needs to understand what changed
    - Developer asks about the Kendo CLI migrate command
    - Developer asks about safe upgrade paths
```

---

## Security

This skill is a static, read-only knowledge layer. It does not execute commands, modify code, or access the developer's file system. All migration execution is deferred to the Kendo CLI and the developer's own terminal.

```yaml
security_model:
    skill_is_read_only: true
    skill_does_not_execute: true
    skill_does_not_phone_home: true
    skill_does_not_access_code: true
    skill_does_not_modify_package_json: true
```

For distribution integrity and threat-surface analysis, see the security section in `kendo-react-getting-started`.

---

## Anti-Patterns

```yaml
avoid:
    - Recommending "always upgrade to latest" without assessing the developer's situation.
    - Recommending a multi-major jump (e.g., v10 → v15) without sequential migration.
    - Listing all breaking changes from all versions when the developer only needs one boundary.
    - Running or suggesting 'npm update' when a major version boundary is involved.
    - Treating TKL102 as a setup bug — it is a license coverage boundary.
    - Suggesting the developer suppress TypeScript errors caused by API changes rather than fixing them.
    - Providing upgrade guidance without confirming the developer's current version first.
    - Mixing upgrade guidance with first-time onboarding or licensing troubleshooting.
```
