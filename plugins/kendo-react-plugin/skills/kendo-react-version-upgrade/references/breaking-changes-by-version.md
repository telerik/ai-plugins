# Breaking Changes by Version — KendoReact

Read this file when the developer asks about a specific version or a specific version-to-version upgrade path. Each section covers one major version boundary.

For the complete, authoritative breaking changes list, always defer to: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes

---

## v15.0.0 (May 2026) — HIGH IMPACT

The most impactful major since v11. Three categories of breaking changes across 10+ component packages. **Codemods available** for Buttons, Common/SVG Icons, Indicators, Layout, Tooltip, and Notification via `kendo migrate --from=14 --to=15`.

### Functional component conversions (ref type changes)

Multiple components were converted from class to functional. If the developer accesses refs to any of these components, the ref type has changed from the class instance to a Handle type. Note: these conversions do NOT have codemods — they require manual ref type updates.

Affected components: Barcode (→ BarcodeHandle), QRCode (→ QRCodeHandle), Calendar (→ CalendarHandle), MultiViewCalendar (→ MultiViewCalendarHandle), CalendarCell (now React.memo wrapped), TodayCommand, Menu (→ MenuHandle).

CalendarChangeEvent generic type parameter default changed from Calendar to CalendarHandle. MenuSelectEvent and MenuCloseEvent target type changed from Menu to MenuHandle.

### themeColor value cleanup (codemods available)

The `dark` and `light` themeColor values were removed across many components. The codemod removes unsupported values and adds TODO comments. Valid values are now standardized per component.

Affected components: Button, DropDownButton, SplitButton, FloatingActionButton, Icon, SvgIcon, Badge, Loader, AppBar, Avatar, BottomNavigation, Notification.

### Icons v5.0.0 (codemod available)

SVG icons: 167 icons renamed or consolidated (e.g., caretAltDownIcon → chevronDownIcon, starOutlineIcon → starIcon). The codemod handles import renames and icon string prop updates. 6 icons removed without replacement — codemod adds TODO comments for those. Default icon variant changed to outline.

Font icons: aliases removed. Use canonical class names (e.g., k-i-arrow-rotate-ccw instead of k-i-reset). No codemod for font icons.

### Other (codemods available for Tooltip)

Grid: `cells` prop on GridColumn now accepts GridColumnCellsSettings (no codemod — manual change). Chat: onLoadMoreMessages behavior change (no codemod). Tooltip: handleMouseEnter → handleMouseOver, handleMouseOut → handleMouseLeave (codemod available).

---

## v14.0.0 (2025) — MODERATE IMPACT

**Codemods available** for Dropdowns and Chat via `kendo migrate --from=13 --to=14`.

Dropdowns: `groupMode` prop removed from ComboBox, DropDownList, MultiSelect, MultiColumnComboBox, AutoComplete. Modern grouping is now the only mode. Codemod removes the prop.

Chat: `sendButton` removed from messageBoxTemplate render function. `uploadConfig` prop type changed from UploadProps to UploadButtonProps (only `multiple`, `accept`, `restrictions` supported). Codemod handles both.

Consult the official breaking changes page for full details: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/14-0-0

---

## v12 to v13 — NO BREAKING CHANGES

v13 does not introduce breaking changes. Upgrading from v12 to v13 requires no code changes and no codemods — it is equivalent to a minor/patch upgrade in terms of risk.

---

## v12.0.0 (2024) — LOW IMPACT

Only the Chat component was affected. Codemod available via `kendo migrate`.

---

## v11.0.0 (2024) — MODERATE IMPACT

Grid, DateInputs, Dialogs, and TreeList had breaking changes. This was the first version with codemod support via the Kendo CLI.

Codemod available: `kendo migrate --from 10 --to 11`

---

## v10.0.0 (2024) — MODERATE

Component API refinements. Consult: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/10-0-0

---

## v9.0.0 (2023) — MODERATE

Early major with API standardization. Consult: https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/9-0-0

---

## Upgrade path quick reference

| From → To | Codemod? | Risk | Key concern |
|---|---|---|---|
| Any minor/patch within same major | N/A | None | Always safe |
| v10 → v11 | Yes | Moderate | Grid, DateInputs, Dialogs, TreeList |
| v11 → v12 | Yes | Low | Chat only |
| v12 → v13 | N/A | None | No breaking changes — safe upgrade |
| v13 → v14 | Yes | Moderate | Dropdowns (groupMode), Chat (sendButton, uploadConfig) |
| v14 → v15 | Yes | High | Buttons, Icons (167 renames), Indicators, Layout, Tooltip, Notification. Ref type changes (Calendar, Menu, Barcode) need manual fix. |
| Multi-major skip | Do not skip | Very high | Compound errors — walk each step |
