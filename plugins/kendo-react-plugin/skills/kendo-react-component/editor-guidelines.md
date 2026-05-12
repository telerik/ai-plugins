# KendoReact Editor — Tools Import Pattern

## Required Import Pattern

For the Editor component, always use the proper `EditorTools` import structure. **Never define tools as strings.**

Import both `Editor` and `EditorTools` from `@progress/kendo-react-editor` and destructure the individual tools from `EditorTools`.

```tsx
import { Editor, EditorTools } from '@progress/kendo-react-editor';

const {
    Bold, Italic, Underline, Strikethrough,
    Subscript, Superscript, ForeColor, BackColor,
    CleanFormatting, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Indent, Outdent, OrderedList, UnorderedList,
    NumberedList, BulletedList, Undo, Redo,
    FontSize, FontName, FormatBlock, Link, Unlink,
    InsertImage, ViewHtml, InsertTable, InsertFile,
    SelectAll, Print, Pdf, TableProperties, TableCellProperties,
    AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter,
    DeleteRow, DeleteColumn, DeleteTable, MergeCells, SplitCell
} = EditorTools;
```

## Rules

- Always import both `Editor` and `EditorTools` from `@progress/kendo-react-editor`
- Destructure individual tools from the `EditorTools` object
- Use the destructured tool references directly in the `tools` array
- **Never define tools as strings** (e.g., `'bold'`, `'italic'`)
- Group related tools in sub-arrays for better organization

**Correct:**
```tsx
tools={[[Bold, Italic, Underline], [AlignLeft, AlignCenter]]}
```

**Incorrect:**
```tsx
tools={[['bold', 'italic', 'underline'], ['alignLeft', 'alignCenter']]}
```
