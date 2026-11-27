# KendoReact Version History Map

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
