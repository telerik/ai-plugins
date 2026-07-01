# Kendo UI for Angular Version Upgrade Skill

## Purpose

This skill teaches agents how to **reason about Kendo UI for Angular version upgrades** — what changed, what to watch out for, and how to approach upgrades safely.

It helps agents explain why an upgrade might be risky or beneficial and what preparation is needed, rather than executing migrations directly. The skill provides guidance, not execution: actual code changes are handled by the Kendo CLI (`kendo migrate`) and the **Upgrade Assistant** in the Kendo UI for Angular MCP server, which combines codemods with AI-powered code analysis for end-to-end migration guidance.

This skill does not replace release notes, migration guides, or the official breaking changes documentation. It teaches agents how to interpret and apply that information in context.

## Reference files

- `references/breaking-changes-by-version.md` — Per-version summaries of breaking changes for v18 through v24. Read when the developer asks about a specific version or version-to-version path.
- `references/response-templates.md` — Ready-made response text for common upgrade scenarios.

---

## Scope Boundaries

This skill covers:

- Explaining the Kendo UI for Angular versioning model (semver, co-released packages, theme alignment, Angular framework dependency)
- Helping developers decide whether to upgrade, when, and how aggressively
- Identifying which versions introduce breaking changes and what kind
- Recommending safe upgrade paths (consecutive majors vs. version skipping)
- Flagging the Angular framework version constraint as a primary gating factor
- Flagging common upgrade pitfalls that lead to support tickets
- Explaining license implications of upgrading (perpetual coverage windows, TKL102)
- Distribution tags (`ng10`–`ng18`) for legacy Angular versions
- Bridging to the Kendo CLI and the Upgrade Assistant MCP tool for execution

This skill does not cover:

- First-time install or onboarding — route to `kendo-angular-getting-started`
- Licensing failures unrelated to version coverage — route to `kendo-angular-product-licensing`
- MCP entitlement failures — route to `kendo-angular-mcp-licensing`
- Executing code changes — defer to `kendo migrate` or the Upgrade Assistant MCP tool
- Upgrading the Angular framework itself — defer to https://angular.dev/update-guide
- Detailed component API changes — defer to the official changelogs

---

## Kendo UI for Angular Versioning Model

```yaml
versioning_rules:
    co_release: >
        All @progress/kendo-angular-* packages share the same version and are
        released together. You cannot mix v23 Grid with v24 DateInputs.
    semver:
        major: Breaking changes. Application code may need updates.
        minor: New features. Existing code continues to work.
        patch: Bug fixes only. No code changes needed.
    angular_framework_dependency:
        principle: >
            Kendo Angular major versions are tightly coupled to specific Angular
            framework versions. A Kendo major upgrade frequently bumps the minimum
            supported Angular version. v22.0.0 dropped support for Angular 18 —
            that was its sole breaking change.
        rule: Check supported Angular versions BEFORE planning a Kendo upgrade.
    distribution_tags:
        purpose: >
            For legacy Angular versions (v2–v18), Telerik publishes distribution
            tags (ng10, ng15, ng18 …) that pin to the last Kendo version
            compatible with that Angular version.
        example: npm install @progress/kendo-angular-grid@ng18
        rule: Apply the SAME tag to ALL @progress/kendo-angular-* packages — mixing is not supported.
    theme_alignment: >
        Update @progress/kendo-theme-* packages to the version listed in the
        changelog's 'Supported Themes' block for your target Kendo version.
    package_json_range: >
        Default caret range (^23.0.0) allows minor and patch updates but blocks
        major bumps. 'npm update' within a major is safe; crossing a major
        requires explicit version changes.
```

---

## Theme Compatibility

The `@progress/kendo-theme-*` packages (Default, Bootstrap, Material, Fluent, Meridian) are decoupled from the Kendo UI for Angular component packages. Kendo Angular and theme major versions do not track each other. The changelog is the authoritative source; every release lists its required theme version in a "Supported Themes" block.

### Kendo Angular → Theme Compatibility Matrix

Extracted from the Kendo UI for Angular changelog (https://www.telerik.com/kendo-angular-ui/components/changelogs/kendo-angular-ui).

```yaml
theme_matrix:
    v24.0.0_to_v24.0.x:    '^14.1.0'           # Meridian theme added
    v23.3.0_to_v23.4.0:    '13.1.1'
    v23.0.1_to_v23.2.2:    '13.0.0 to 13.0.1'
    v23.0.0:               '13.0.0'
    v22.0.0_to_v22.0.1:    '12.3.0'
    # v21 and earlier: check the changelog 'Supported Themes' block per release

meridian_availability: 'v24.0.0+ only'

theme_rules:
    - Kendo Angular and theme major versions do NOT track each other (e.g., v23 uses themes v13).
    - After every Kendo Angular upgrade, check the changelog's 'Supported Themes' block, then run:
      npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
    - Do NOT upgrade themes without also upgrading Kendo Angular packages.
    - If using a CDN, pin the theme version explicitly.
```

For the historical theme breaking changes (Color System, Material 3, class-name restructuring across v12/v13/v14), see `references/breaking-changes-by-version.md`.

---

## Version History Map

Versions with documented breaking changes. For per-version detail (specific renames, affected components, codemod tables), consult `references/breaking-changes-by-version.md`.

```yaml
breaking_change_versions:
    v19: {risk: low_to_moderate, codemods: true,  focus: 'Adaptive title/subtitle renames across DropDowns, DateInputs, ToolBar, Layout'}
    v20: {risk: low,             codemods: true,  focus: 'Grid kendoGridGroupBinding → kendoGridBinding, Chat user → authorId'}
    v21: {risk: moderate,        codemods: true,  focus: 'Grid AI interface renames, ListBox API, Chat deprecations'}
    v22: {risk: framework_only,  codemods: false, focus: 'Angular 18 dropped — NO API changes'}
    v23: {risk: very_high,       codemods: partial, focus: 'Appearance options default to undefined, ''none'' value removed. Wide visual impact. NO codemod for headline change.'}
    v24: {risk: high,            codemods: true,  focus: 'themeColor ''light''/''dark'' removed across 8 packages, Icons v5.0.0, Meridian theme, Dialog/Window themeColor deprecated'}
```

---

## Upgrade Decision Framework

When a developer asks "should I upgrade?", the agent should work through this checklist rather than defaulting to "always upgrade to latest."

```yaml
upgrade_decision:
    1_check_angular_framework_version:
        questions:
            - What Angular version is the project currently on?
            - Is the team able to upgrade Angular if needed?
        guidance: >
            This is the FIRST question for Kendo Angular upgrades.
            Kendo v22+ requires Angular 19+. Kendo v24 is constrained to
            currently supported Angular versions.
            If the project is locked to a legacy Angular version, the developer
            may need a distribution tag (ng10–ng18) instead of a major upgrade.

    2_why_upgrade:
        questions:
            - What motivates the upgrade? (new feature, bug fix, security, policy, Angular version)
            - Is there a specific component fix or feature in the target version?
            - Is the team being asked to stay current for compliance or support reasons?
        guidance: >
            If the motivation is a specific bug fix available in a patch or minor,
            upgrade within the current major first — that's zero-risk under semver.

    3_what_version_are_they_on:
        questions:
            - What is their current @progress/kendo-angular-* version?
            - How many major versions behind are they?
        guidance: >
            A developer on v20 wanting v24 is crossing 4 major boundaries.
            Each boundary may have breaking changes AND may require an Angular
            framework upgrade. Walk through each major sequentially.

    4_how_big_is_the_surface:
        questions:
            - How many Kendo UI for Angular components are used in the project?
            - Are any of the components in the "affected" list for each version boundary?
            - Do they use fillMode, themeColor, rounded, size with the 'none' value?
            - Do they have custom CSS targeting Kendo class names?
        guidance: >
            If the project uses many components with custom appearance settings,
            v23 will require thorough visual review.
            If the project uses Buttons, Icons, or Layout components with
            themeColor='dark'/'light', v24 will require code changes (codemods cover most).

    5_license_implications:
        questions:
            - Does the developer have a perpetual license?
            - If so, what is the coverage window expiry date?
        guidance: >
            Perpetual licenses cover only package versions released before
            the expiry date. Upgrading past the coverage window triggers
            TKL102. The developer must renew or purchase a subscription
            before upgrading. Route to kendo-angular-product-licensing if
            TKL102 appears.

    6_recommend_path:
        output: >
            Based on the answers, recommend one of:
            (a) Stay on current version — the risk/effort isn't justified.
            (b) Use a distribution tag (e.g. @ng18) — pinned to legacy Angular.
            (c) Upgrade within current major (minor/patch) — zero breaking changes.
            (d) Upgrade one major at a time using 'kendo migrate'.
            (e) Use the Upgrade Assistant MCP tool for AI-driven migration.
            (f) Upgrade directly to latest — only if current version is one major behind
                AND on a compatible Angular version.
```

---

## Safe Upgrade Path Logic

```yaml
upgrade_path_rules:
    within_same_major:
        risk: none
        action: 'npm update (within caret range) or npx npm-check-updates --upgrade --filter "/@progress/kendo-angular.*/"'
        notes: No breaking changes. Always safe.

    one_major_ahead:
        risk: low to high (depends on version)
        action: >
            1. Verify Angular framework compatibility for the target version.
            2. Read the breaking changes for the target version (references/breaking-changes-by-version.md).
            3. Run 'kendo migrate' if codemods are available for that boundary.
            4. Review any code comments added by the codemod.
            5. Update theme packages to match the 'Supported Themes' block in the changelog.
            6. Test.
        notes: This is the recommended upgrade unit.

    multiple_majors_ahead:
        risk: very high
        action: >
            Do NOT jump directly. Walk through each major boundary one at a time.
            For example, v19 → v20 → v21 → v22 → v23 → v24.
            At each step, run 'kendo migrate' and resolve breaking changes before
            proceeding to the next.

            Pay special attention to v22 — if the developer is on Angular 18,
            they MUST upgrade Angular first before crossing v21→v22.
        notes: >
            The Kendo CLI's 'kendo migrate' handles consecutive boundaries, but
            the developer should review and test at each step. Alternatively,
            the Upgrade Assistant MCP tool can drive this end-to-end with AI
            error resolution.

    skipping_versions:
        risk: very high
        do_not_recommend: true
        notes: >
            Skipping versions (e.g., v20 straight to v24) compounds breaking
            changes and makes it impossible to isolate which change broke what.
            v23's appearance-options redesign alone has wide visual impact and
            should be addressed in isolation, not bundled with other changes.

    legacy_angular_constraint:
        action: >
            If the project cannot upgrade Angular (legacy enterprise constraints),
            recommend using a distribution tag:
            npm install @progress/kendo-angular-grid@ng18
            This pins to the last Kendo version compatible with Angular 18.
        notes: >
            Distribution tags are available for Angular v2 to v18. Apply the same
            tag to ALL Kendo Angular packages — mixing tags is not supported.

    theme_package_rule: >
        After every major upgrade, check the changelog's 'Supported Themes' block
        for your target version, then run:
        npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
        npm install
        Mismatched themes are a top cause of "upgrade broke my styling" tickets.
```

---

## Assisted Migration Tooling

Kendo UI for Angular has two assisted migration paths: the Kendo CLI for direct codemods, and the Upgrade Assistant in the MCP server for AI-driven end-to-end migration.

### Kendo CLI

```bash
# Install and run guided migration
npm i -g @progress/kendo-cli
kendo migrate

# Or migrate a specific package between specific versions
kendo migrate @progress/kendo-angular-grid --from=23 --to=24
```

Codemods available for boundaries: v18→v19, v19→v20, v20→v21, v22→v23, v23→v24. v21→v22 has no codemods (framework-only major). For the per-boundary codemod list (which packages, which transformations), see `references/breaking-changes-by-version.md`.

Best practices: migrate consecutive majors (not multi-major jumps); review codemod code comments — they flag areas needing manual review.

Docs: https://www.telerik.com/kendo-angular-ui/components/assisted-migration

### Upgrade Assistant (MCP)

Available in `@progress/kendo-angular-mcp`, the Upgrade Assistant combines Kendo CLI codemods with AI-powered code analysis to provide end-to-end guidance: it runs codemods automatically AND uses AI reasoning to resolve remaining compilation errors in one continuous flow.

Recommend the Upgrade Assistant when the developer is crossing multiple majors, when codemods alone leave residual compilation errors, or when the developer wants a guided experience.

Requires an active Trial or Subscription license — perpetual licenses do not include MCP tools. If MCP is not available, fall back to the Kendo CLI.

---

## MCP Bridge

The MCP server provides multiple assistants for the upgrade workflow.

```yaml
mcp_upgrade_assistance:
    upgrade_assistant:
        use_for: End-to-end automated migration with AI-powered error resolution.
        handle: 'Upgrade Assistant'
        license: Trial or Subscription only.
    kendo_component_assistant:
        use_for: >
            Help updating specific component usage after a major version upgrade.
            The Component Assistant knows the current API and can suggest correct
            input/output names, event handlers, and import paths for the target version.
        license: Trial or Subscription only.
    kendo_getting_started_assistant:
        use_for: >
            Setting up the MCP server if the developer doesn't have it configured.
            Available to all license types including free.
        license: All tiers (no key required).
```

---

## Common Upgrade Pitfalls

The three highest-frequency pitfalls the agent should surface proactively:

```yaml
top_pitfalls:
    angular_framework_version_mismatch:
        symptom: 'ng update' or 'npm install' fails with peer dependency errors after Kendo upgrade.
        cause: Target Kendo version requires a newer Angular framework than the project has.
        resolution: Upgrade Angular first (https://angular.dev/update-guide), OR use a distribution tag (@ng18 etc.) to pin to a legacy-compatible Kendo version.
        frequency: Very common — the #1 Angular-specific upgrade ticket.

    theme_version_mismatch:
        symptom: Components look broken or unstyled after upgrade.
        cause: Kendo Angular packages upgraded but @progress/kendo-theme-* left on the old version.
        resolution: Check the 'Supported Themes' block in the changelog. Upgrade theme packages to match.

    perpetual_license_version_wall:
        symptom: TKL102 after upgrading — version not covered by license.
        cause: Perpetual license covers only versions released before the expiry date.
        resolution: Renew the license or downgrade to a covered version. Route to kendo-angular-product-licensing.
```

For the full pitfall catalog — v23 appearance-options review, `'none'` value removed, v24 themeColor `light`/`dark` removed, icon renames, mixed distribution tags, mixed major versions, skipped-version compound errors, npm-update surprise, unchecked rendering changes — see `references/breaking-changes-by-version.md`.

---

## Routing Rules

```yaml
route_to_kendo_angular_getting_started_when:
    - Developer is installing Kendo UI for Angular for the first time (not upgrading)
    - Developer asks about trial or onboarding

route_to_kendo_angular_product_licensing_when:
    - TKL102 appears (version not covered by perpetual license)
    - Any licensing issue unrelated to version coverage

route_to_kendo_angular_mcp_licensing_when:
    - MCP tools (including Upgrade Assistant) return PERMISSION_DENIED

stay_in_this_skill_when:
    - Developer asks "should I upgrade?"
    - Developer asks what broke in a specific version
    - Developer asks how to approach a multi-version jump
    - Developer reports errors after an upgrade and needs to understand what changed
    - Developer asks about the Kendo CLI migrate command or the Upgrade Assistant MCP tool
    - Developer asks about safe upgrade paths
    - Developer asks about distribution tags (ng10, ng18, etc.)
    - Developer asks about theme compatibility for a specific Kendo Angular version
```

---

## Security

This skill is a static, read-only knowledge layer. It does not execute commands, modify code, or access the developer's file system. All migration execution is deferred to the Kendo CLI, the Upgrade Assistant MCP tool, and the developer's own terminal.

```yaml
security_model:
    skill_is_read_only: true
    skill_does_not_execute: true
    skill_does_not_phone_home: true
    skill_does_not_access_code: true
    skill_does_not_modify_package_json: true
```

For distribution integrity and threat-surface analysis, see the security section in `kendo-angular-getting-started`.

---

## Anti-Patterns

```yaml
avoid:
    - Recommending "always upgrade to latest" without assessing the developer's situation.
    - Recommending a Kendo upgrade without first checking Angular framework compatibility.
    - Recommending a multi-major jump (e.g., v20 → v24) without sequential migration.
    - Listing all breaking changes from all versions when the developer only needs one boundary.
    - Running or suggesting 'npm update' when a major version boundary is involved.
    - Treating TKL102 as a setup bug — it is a license coverage boundary.
    - Suggesting the developer suppress TypeScript errors caused by API changes rather than fixing them.
    - Providing upgrade guidance without confirming the developer's current Kendo Angular AND Angular framework versions.
    - Recommending the Upgrade Assistant MCP tool to a perpetual license holder (it's entitlement-gated).
    - Mixing upgrade guidance with first-time onboarding or licensing troubleshooting.
    - Assuming Kendo Angular and theme major versions track each other — they don't.
```
