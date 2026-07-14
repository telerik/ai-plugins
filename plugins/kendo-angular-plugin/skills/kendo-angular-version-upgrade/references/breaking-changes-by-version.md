# Breaking Changes by Version — Kendo UI for Angular

Read this file when the developer asks about a specific version or a specific version-to-version upgrade path. Each section covers one major version boundary.

For the complete, authoritative breaking changes list, always defer to:
- Changelog: https://www.telerik.com/kendo-angular-ui/components/changelogs/kendo-angular-ui
- Available codemods: https://www.telerik.com/kendo-angular-ui/components/available-codemods
- Rendering changes: https://www.telerik.com/kendo-angular-ui/components/changelogs/rendering-changes

---

## v24.0.0 (May 2026) — HIGH IMPACT

The headline major: themeColor cleanup, Icons v5.0.0, Meridian theme, WebMCP. **Codemods cover 8 packages** via `kendo migrate --from=23 --to=24`.

### themeColor 'light'/'dark' values removed (codemods available)

Across many components, the `'light'` and `'dark'` values are no longer valid for `themeColor`. Codemods remove the prop when its value is one of the unsupported values.

Affected components by package:
- **Buttons**: Button, FloatingActionButton — `'light'`, `'dark'` removed.
- **Icons**: Icon — `'light'`, `'dark'` removed.
- **Indicators**: Badge — `'light'`, `'dark'`, `'inverse'` removed. Loader — `'light'`, `'dark'`, `'success'`, `'warning'`, `'error'`, `'info'`, `'inverse'` removed.
- **Layout**: Avatar — `'light'`, `'dark'`, `'success'`, `'warning'`, `'error'`, `'info'`, `'inverse'` removed.
- **Navigation**: AppBar — `'light'`, `'dark'`, `'inherit'` removed. BottomNavigation — `'light'`, `'dark'`, `'success'`, `'warning'`, `'error'` removed.

### Type renames in Buttons (codemods available)

`ButtonSize` is renamed per-component: `DropDownButtonSize` (for DropDownButton), `FloatingActionButtonSize` (for FloatingActionButton), `SplitButtonSize` (for SplitButton). Similarly `ButtonThemeColor` → `FloatingActionButtonThemeColor` for FloatingActionButton.

### Dialog and Window themeColor deprecated (codemods available)

The `themeColor` input is removed entirely from `DialogComponent`, `WindowComponent`, `DialogSettings`, and `WindowSettings`.

### Chat sendButtonSettings → sendButton (codemod available)

Conversational UI's `sendButtonSettings` renamed to `sendButton`.

### Spreadsheet excel → excelExportSettings (codemod available)

Spreadsheet's `excel` input property renamed to `excelExportSettings`.

### Tooltip themeColor renamed (manual fix)

Tooltip's `themeColor` was renamed to `tooltipThemeColor`. No codemod — manual update.

### Icons v5.0.0 (codemod available)

SVG icons consolidated and renamed. The codemod handles import renames and icon string updates. Note: there's no codemod for font icon class names (use the Iconography changelog for the mapping).

### Meridian theme support added

A new theme (`@progress/kendo-theme-meridian`) is supported starting v24.0.0. Existing apps don't need to switch, but the theme is available for new designs.

### WebMCP support

Components are now agent-ready out of the box via WebMCP. This is additive — no breaking impact on existing code.

---

## v23.0.0 (February 2026) — VERY HIGH IMPACT

The widest-impact major in recent history. Appearance options redesign affects every component.

### Appearance options redesigned (NO codemod — manual review)

`fillMode`, `themeColor`, `rounded`, and `size` now default to `undefined`. The default style now comes from the Kendo themes unless explicitly set.

The `'none'` value is no longer valid for `fillMode`, `size`, or `themeColor`. It remains valid for `rounded`.

This change has **wide visual impact** across the entire application. Visual review is required. The codemod does not cover this — it must be handled by inspecting templates and either accepting the theme defaults or setting explicit values.

### Chat (codemods available)

- `enableFileSelect` → `fileSelectButton` (type changed to `FileSelectButtonSettings`)
- `enableSpeechToText` → `speechToTextButton`
- `FileSelectSettings` interface → `FileSelectButtonSettings`
- CustomMessagesComponent `send` → `actionButtonTitle`

### Theme upgrade required

v23 pairs with `@progress/kendo-theme-*` v13.0.0+. Themes v13 introduced the class-name restructuring (combined classes split into separate fill mode + theme color). Custom CSS targeting old combined class names will break.

---

## v22.0.0 (January 2026) — FRAMEWORK ONLY

**No API breaking changes.** The only breaking change is dropping Angular 18 framework support. There are no codemods for this boundary because there are no API changes to migrate.

### What this means in practice

- Projects on Angular 19+ can upgrade Kendo Angular v21 → v22 with zero code changes.
- Projects on Angular 18 MUST upgrade Angular first, using https://angular.dev/update-guide.
- If Angular cannot be upgraded, the project must stay on Kendo v21.x or use a distribution tag.

---

## v21.0.0 (2025) — MODERATE IMPACT

Grid AI interface renames and ListBox API changes. **Codemods cover 3 packages.**

### Grid AI interface renames (codemods available)

Six interface renames from `GridToolbarAI*` to `GridAIAssistant*`:
- `GridToolbarAIOpenEvent` → `GridAIAssistantOpenEvent`
- `GridToolbarAIRequestOptions` → `GridAIRequestOptions`
- `GridToolbarAIWindowSettings` → `GridAIAssistantWindowSettings`
- `GridToolbarAIPromptRequestEvent` → `GridAIAssistantRequestEvent`
- `GridToolbarAIResponseErrorEvent` → `GridAIAssistantResponseErrorEvent`
- `GridToolbarAIPromptSettings` → `GridAIAssistantPromptSettings`

**Manual fix required**: `GridAIAssistantResponseSuccessEvent.response` type changed to `any` — required manual update where the property is consumed.

### Chat deprecations (codemods available)

- `messageToolbarVisibility` input removed
- `pinnedByField` property removed from `ConversationalUIModelFields`

### ListBox (codemods available)

- `selectedIndex` field replaced with `selectedIndices` (supports multiple selection)
- `actionClick` event renamed to `action`
- `Toolbar` interface renamed to `ListBoxToolbarConfig`
- `toolbar` property type changed from `boolean` to `boolean | ListBoxToolbarConfig`

---

## v20.0.0 (2025) — LOW IMPACT

**Codemods cover 2 packages.**

### Grid (codemod available)

`kendoGridGroupBinding` directive renamed to `kendoGridBinding`. The original directive is no longer supported.

### Conversational UI (codemod available)

Chat's `user` input renamed to `authorId`. The codemod automatically extracts the current `id` value from the user object.

---

## v19.0.0 (2025) — LOW TO MODERATE IMPACT

The first version with codemod support. **Codemods cover 4 packages.**

### DropDowns (codemod available)

`subtitle` → `adaptiveSubtitle` and `title` → `adaptiveTitle` across AutoComplete, ComboBox, DropDownList, DropDownTree, MultiColumnComboBox, MultiSelect, MultiSelectTree.

### Date Inputs (codemod available)

Same `subtitle` → `adaptiveSubtitle` and `title` → `adaptiveTitle` renames across DatePicker, DateRangePopup, DateTimePicker, TimePicker.

### ToolBar (codemod available)

`showIcon` and `showText` values: `'overflow'` → `'menu'`, `'both'` → `'always'`.

### Layout (codemod available)

TabStrip `mouseScrollSpeed` property removed (was deprecated).

---

## Upgrade path quick reference

| From → To | Codemod? | Risk | Key concern |
|---|---|---|---|
| Any minor/patch within same major | N/A | None | Always safe |
| v18 → v19 | Yes | Low | Adaptive title/subtitle renames |
| v19 → v20 | Yes | Low | Grid directive, Chat user prop |
| v20 → v21 | Yes | Moderate | Grid AI renames, ListBox, Chat. Manual fix for `response: any` |
| v21 → v22 | N/A | Framework-only | **Angular 18 dropped — upgrade Angular first** |
| v22 → v23 | Partial (Chat only) | **Very high** | **Appearance options redesigned — wide visual review needed** |
| v23 → v24 | Yes | High | themeColor 'light'/'dark' removed across 8 packages, Icons v5 |
| Multi-major skip | Do not skip | Very high | Compound errors — walk each step |

## Angular framework compatibility quick reference

| Kendo Angular major | Minimum Angular version |
|---|---|
| v24 | Currently supported Angular versions |
| v23 | Currently supported Angular versions |
| v22 | Angular 19+ (Angular 18 dropped) |
| v21 | Angular 18 supported |
| v20 | Angular 18 supported |
| v19 | Earlier Angular versions supported |
| Legacy projects | Use distribution tags `@ng10` through `@ng18` |

---

## Full pitfall catalog

Beyond the top three surfaced in the body (Angular framework version mismatch, theme version mismatch, perpetual license TKL102), these pitfalls appear less frequently but are consulted when the developer reports the specific symptom:

```yaml
appearance_options_undefined_default_v23:
    symptom: Components look different after upgrading to v23.0.0 even without code changes.
    cause: >
        v23 changed fillMode, themeColor, rounded, size defaults to undefined.
        The default style now comes from the Kendo theme instead of being set explicitly.
    resolution: >
        Visual review of affected components. If the previous explicit defaults
        are required, set them explicitly in templates.

none_value_removed_v23:
    symptom: TypeScript errors on fillMode='none', size='none', themeColor='none' after v23 upgrade.
    cause: 'none' value was removed from fillMode, size, and themeColor in v23 (still valid for 'rounded').
    resolution: Use undefined or a valid value. The codemod does not cover this — manual fix.

themecolor_light_dark_removed_v24:
    symptom: TypeScript errors or missing visual styles on Buttons, Icons, Badge, AppBar, etc. after v24 upgrade.
    cause: 'light' and 'dark' themeColor values removed across many components in v24.
    resolution: Run `kendo migrate --from=23 --to=24` for the affected packages. Codemods remove invalid values.

icon_renames_v24:
    symptom: Icons not rendering or showing wrong icon after v24 upgrade.
    cause: SVG icons consolidated in @progress/kendo-icons v5.0.0.
    resolution: Run the icons codemod or check the Iconography changelog for the mapping.

mixed_major_versions:
    symptom: Runtime errors, missing inputs, broken renders.
    cause: Some @progress/kendo-angular-* packages on v23, others on v24.
    resolution: All packages must be on the same major. Run 'npx npm-check-updates --upgrade --filter "/@progress/kendo-angular.*/"'.

mixed_distribution_tags:
    symptom: Peer dependency conflicts with seemingly correct package versions.
    cause: Some packages installed with @ng18 tag, others without — they resolve to different Kendo majors.
    resolution: Apply the SAME distribution tag to all @progress/kendo-angular-* packages.

skipped_version_compound_errors:
    symptom: Multiple unrelated errors after a multi-major jump.
    cause: Developer upgraded from v20 to v24 directly, compounding 4 majors of changes (including v23's wide visual impact).
    resolution: Roll back and upgrade one major at a time using 'kendo migrate' or the Upgrade Assistant.

npm_update_surprise:
    symptom: App breaks after routine 'npm install' on a fresh clone.
    cause: package.json used tilde (~) or star (*) ranges allowing unexpected major bumps.
    resolution: Pin to caret (^) ranges. Use package-lock.json consistently.

rendering_changes_not_checked:
    symptom: Subtle visual differences after upgrade despite no breaking change reports.
    cause: Kendo UI for Angular maintains a separate Rendering Changes list — styling-only changes not documented in breaking changes.
    resolution: Check https://www.telerik.com/kendo-angular-ui/components/changelogs/rendering-changes for the target version.
```

---

## Theme breaking changes by theme major

Kendo Angular and theme major versions don't track each other. When crossing theme majors, these breaking changes apply *in addition* to the Kendo Angular component changes:

```yaml
themes_v14:
    era: May 2026
    impact: moderate
    change: New theme major paired with Kendo Angular v24.0.0. Includes Meridian theme support.
    paired_with: Kendo Angular v24.0.0+

themes_v13:
    era: February 2026
    impact: high
    change: >
        Paired with Kendo Angular v23.0.0. Component option classes (size, roundness,
        fill mode, theme color) are no longer rendered in HTML when they match defaults.
        Defaults are now controlled via SCSS variables. Theme color classes separated
        from fill mode classes. Custom CSS selectors targeting the old combined class
        names will break.
    paired_with: Kendo Angular v23.0.0 – v23.4.0

themes_v12:
    era: mid-2025 to January 2026
    impact: moderate
    change: >
        Material theme aligned to Material 3 (no longer Material 2 for metrics, layout,
        fonts, elevation, typography). Legacy color system dropped entirely.
    paired_with: Kendo Angular v22.0.0 – v22.0.1

multi_major_theme_upgrade_warning: >
    A developer upgrading Kendo Angular from v20 to v24 is also crossing themes
    approximately v10 → v14 — Color System change, Material 3 shift, class-name
    restructuring, and Meridian theme availability all at once.
```
