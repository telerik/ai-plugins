# Kendo UI for Angular — Common Component Guidelines

## Package Installation

Always use minimal, targeted package installation.

**Process:**
1. Identify the required components
2. Determine the specific Kendo UI for Angular packages needed
3. Use `ng add <package>` for the primary package (this handles schematic setup)
4. Use `npm install` for supplementary packages

**Example:**
```bash
ng add @progress/kendo-angular-grid@latest
```

Always include `@angular/localize` when required by Kendo schematics.

Do not install packages that are not needed for the components being implemented.

### Component Package Map

Use `ng add <package>` for the package that corresponds to the component being used:

| Component | Package |
|---|---|
| Grid | `@progress/kendo-angular-grid` |
| TreeList | `@progress/kendo-angular-treelist` |
| ListView | `@progress/kendo-angular-listview` |
| Scheduler | `@progress/kendo-angular-scheduler` |
| Chart / Sparkline / StockChart / Sankey | `@progress/kendo-angular-charts` |
| DatePicker / DateTimePicker / TimePicker / DateRangePicker / Calendar | `@progress/kendo-angular-dateinputs` |
| DropDownList / ComboBox / MultiSelect / AutoComplete / DropDownTree / MultiSelectTree / MultiColumnComboBox | `@progress/kendo-angular-dropdowns` |
| Button / ButtonGroup / SplitButton / DropDownButton / Chip / ChipList / FloatingActionButton | `@progress/kendo-angular-buttons` |
| Dialog / Window | `@progress/kendo-angular-dialog` |
| Editor | `@progress/kendo-angular-editor` |
| Form / FormField / NumericTextBox / TextBox / TextArea / MaskedTextBox / Slider / RangeSlider / Switch / ColorPicker / Signature | `@progress/kendo-angular-inputs` |
| Card / Drawer / ExpansionPanel / GridLayout / PanelBar / StackLayout / Splitter / Stepper / TabStrip / TileLayout / Timeline | `@progress/kendo-angular-layout` |
| Menu / ContextMenu / AppBar / ActionSheet / BottomNavigation / BreadCrumb | `@progress/kendo-angular-navigation` |
| Gauges (Arc / Circular / Linear / Radial) | `@progress/kendo-angular-gauges` |
| Notification | `@progress/kendo-angular-notification` |
| Upload / FileSelect | `@progress/kendo-angular-upload` |
| Tooltip / Popover | `@progress/kendo-angular-tooltip` |
| ProgressBar / ChunkProgressBar / CircularProgressBar | `@progress/kendo-angular-progressbar` |
| Badge / Loader / Skeleton | `@progress/kendo-angular-indicators` |
| Barcode / QRCode | `@progress/kendo-angular-barcodes` |
| Icon / SVGIcon | `@progress/kendo-angular-icons` |
| Label / FloatingLabel | `@progress/kendo-angular-label` |
| PDFViewer | `@progress/kendo-angular-pdfviewer` |
| PivotGrid | `@progress/kendo-angular-pivotgrid` |
| Gantt | `@progress/kendo-angular-gantt` |
| Diagram | `@progress/kendo-angular-diagrams` |
| Spreadsheet | `@progress/kendo-angular-spreadsheet` |
| ScrollView | `@progress/kendo-angular-scrollview` |
| Map | `@progress/kendo-angular-map` |
| AIPrompt / ConversationalUI / PromptBox / InlineAIPrompt | `@progress/kendo-angular-conversational-ui` |
| ChartWizard | `@progress/kendo-angular-chart-wizard` |
| Filter | `@progress/kendo-angular-filter` |
| ListBox | `@progress/kendo-angular-listbox` |
| Sortable | `@progress/kendo-angular-sortable` |
| Pager | `@progress/kendo-angular-pager` |
| Ripple | `@progress/kendo-angular-ripple` |
| TreeView | `@progress/kendo-angular-treeview` |
| ToolBar | `@progress/kendo-angular-toolbar` |
| Typography | `@progress/kendo-angular-typography` |

## Types and Interfaces

Always use the correct Kendo UI for Angular types for component inputs, outputs, and event handler parameters.

Do not substitute plain strings, plain objects, or `any` for a typed union, enum, or interface provided by the library. Import all required types from the appropriate Kendo UI for Angular package.

## Component Naming Awareness

Whenever a component name is mentioned — regardless of how it's written (all lowercase, all uppercase, mixed case, separate words, or with minor typos) — always look up the correct component documentation.

Match component names case-insensitively and robustly to minor variations. After matching, use the documentation and examples associated with that component.
