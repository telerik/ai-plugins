# Breaking Changes by Version — KendoReact

Read this file when the developer asks about a specific version or a specific version-to-version upgrade path. Each section covers one major version boundary.

For the complete, authoritative breaking changes list, always defer to:
- Breaking changes index: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes
- Available codemods: https://www.telerik.com/kendo-react-ui/components/migration/available-codemods
- Changelog: https://www.telerik.com/kendo-react-ui/components/changelogs/ui-for-react

---

## v15.0.0 (May 2026) — HIGH IMPACT

The most impactful major since v11. **Codemods available** for Buttons, Common/SVG Icons, Indicators, Layout, Tooltip, and Notification via `kendo migrate --from=14 --to=15`.

### Functional component conversions (ref type changes — NOT covered by codemods)

Several components were converted from class to functional. If the developer accesses refs to these components, the ref type has changed from a class instance to a Handle type. These require manual ref-type updates:

- Barcode → `BarcodeHandle`
- QRCode → `QRCodeHandle`
- Calendar → `CalendarHandle`
- MultiViewCalendar → `MultiViewCalendarHandle`
- CalendarCell — now `React.memo`-wrapped
- TodayCommand — now functional
- `CalendarChangeEvent`'s generic type parameter default changed from `Calendar` to `CalendarHandle`

### themeColor value cleanup (codemods available)

The `'dark'` and `'light'` themeColor values were removed from several components:

- Button, DropDownButton, SplitButton — no longer accept `'dark'`/`'light'`. Valid values: `'base' | 'primary' | 'secondary' | 'tertiary' | 'info' | 'success' | 'warning' | 'error' | 'inverse'`.
- FloatingActionButton — no longer accepts `'info'`, `'success'`, `'warning'`, `'error'`, `'dark'`, `'light'`, or `'inverse'`. Valid values: `'base' | 'primary' | 'secondary' | 'tertiary'`.

### Other changes

- Chat: `onLoadMoreMessages` now fires in both built-in and remote endless-scroll modes (previously remote-only). `startIndex`/`endIndex` in `ChatLoadMoreMessagesEvent` now represent the full range to render, not just the requested delta.
- Grid: `cells` prop on `GridColumn` now accepts `GridColumnCellsSettings` instead of `GridCellsSettings`.
- SVG icons v5.0.0: consolidated/renamed icons (e.g. `caretAltDownIcon` → `chevronDownIcon`). Font icon aliases removed entirely — use canonical class names.

For the full list: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/15-0-0

---

## v14.0.0 (Feb 2026) — MODERATE-HIGH IMPACT

**Codemods available** for Dropdowns (groupMode removal) and Chat/Conversational UI (sendButton, uploadConfig) via `kendo migrate --from=13 --to=14`.

- Button, Chip, DropDownButton, FloatingActionButton, SplitButton — no longer accept `null` for `size`, `rounded`, `fillMode`, `themeColor`, or `iconSize`. Defaults are now theme-controlled when the value is `undefined`.
- Chat: `sendButton` property removed from `messageBoxTemplate` render function — the send button now renders automatically as part of `PromptBox`.
- Chat: `uploadConfig` type changed from `boolean | UploadProps` to `boolean | UploadButtonProps` — only `multiple`, `accept`, and `restrictions` are now supported.
- `ColorPalette` type deprecated in favor of `ColorPaletteHandle`.
- AutoComplete, ComboBox, DropDownList, DropDownTree, MultiSelect, MultiSelectTree — no longer accept `null` for `size`, `rounded`, or `fillMode`.
- Deprecated `groupMode` prop removed from ComboBox, DropDownList, MultiSelect, MultiColumnComboBox, AutoComplete — modern grouping is now the only mode. Grouped list rendering now uses separate `<ul>` elements per group.
- `GridFilterCell` — no longer accepts `null` for `size`.
- Checkbox, ColorGradient, ColorPalette, ColorPicker, FlatColorPicker — no longer accept `null` for `size` or `rounded`.

For the full list: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/14-0-0

---

## v13.0.0 (2025) — LOW IMPACT

No codemod needed — the two changes are narrow:

- `thumbnailUrl` property removed from the `ChatFile` interface.
- `onRowClick` / `onRowDoubleClick` now work with custom cells (behavior fix, not a removal).

For the full list: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/13-0-0

---

## v12.0.0 (2025) — LOW IMPACT

**Codemod available** for Chat/Conversational UI via `kendo migrate --from=11 --to=12`.

- Chat: `user` attribute renamed to `authorId`.
- Chat: `onMessageSend` handler renamed to `onSendMessage`.
- Chat: `message` attribute replaced with `messageTemplate`.
- Chat: `ChatMessageSendEvent` type renamed to `ChatSendMessageEvent`.
- Chat: `showToolbar`, `toolbar`, and `onToolbarActionExecute` attributes removed.
- TreeList: deprecated `k-alt` class on alternate rows replaced with `k-table-alt-row` (rendering-only, no prop change).
- Grid: deprecated `k-alt` CSS class removed from row/detail-row rendering for alternate rows (rendering-only).

For the full list: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/12-0-0

---

## v11.0.0 (2024) — MODERATE-HIGH IMPACT

The first version with codemod support. **Codemods available** for Grid, DateInputs, Dialogs, and TreeList via `kendo migrate --from=10 --to=11`.

- DateInputs: `DatePicker` type deprecated → `DatePickerHandle`. `DateInput` type deprecated → `DateInputHandle`.
- Dialog: `Dialog` type deprecated → `DialogHandle`.
- DropDownTree: removed `k-list-container` and `k-list k-list-lg` elements (rendering-only).
- Grid: `selectedField` removed in favor of the `select` state property.
- Grid: `editField` removed in favor of the `edit` state property.
- Grid: `expandedField` removed in favor of the `detailExpand` state property.
- Grid: `onExpandChange` removed — split into `onDetailExpandChange` (detail rows) and `onGroupExpandChange` (groups).
- Grid: `cellRender`, `rowRender`, `filterCellRender`, `headerCellRender` removed in favor of `cells` / `rows` props. `column.cell`, `column.headerCell`, `column.filterCell`, `column.footerCell` removed in favor of `column.cells`.
- Grid: Column Menu Filter's Input replaced with Textbox.
- Grid: `scrollable` prop now defaults to `'virtual'`. Virtual scrolling no longer applies `height` by default.
- Pager: `responsive: true` behavior changed — elements now hide based on available space rather than fixed breakpoints.
- TreeList: `TreeListToolbar` type deprecated → `TreeListToolbarHandle`.

For the full list: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/11-0-0

---

## v10.0.0 (2024) — MODERATE

No codemod (pre-dates codemod support, introduced in v11). Consult the official page for details: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/10-0-0

---

## v9.0.0 (2023) — MODERATE

No codemod (pre-dates codemod support). Consult the official page for details: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/9-0-0

---

## Upgrade path quick reference

| From → To | Codemod? | Risk | Key concern |
|---|---|---|---|
| Any minor/patch within same major | N/A | None | Always safe |
| v9 → v10 | ❌ No | Moderate | No codemod support yet — manual review |
| v10 → v11 | ✅ Yes | Moderate-High | Grid, DateInputs, Dialogs, TreeList — several ref-type deprecations |
| v11 → v12 | ✅ Yes | Low | Chat/Conversational UI only |
| v12 → v13 | N/A | Low | No breaking changes needing a codemod — narrow Chat/Grid changes |
| v13 → v14 | ✅ Yes | Moderate-High | Dropdowns (groupMode removal), Chat (sendButton, uploadConfig), null no longer accepted across many appearance props |
| v14 → v15 | ✅ Yes | High | Buttons/themeColor, Icons (renames), functional-component ref types (Calendar, Barcode, QRCode — NOT covered by codemod) |
| Multi-major skip | Do not skip | Very high | Compound errors — walk each step |