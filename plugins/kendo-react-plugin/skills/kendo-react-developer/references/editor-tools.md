# KendoReact Editor — Tool Import Pattern

**Critical:** Editor tools must use the proper import structure. Never define tools as strings.

## Required Pattern

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
- Use destructured references directly in the `tools` array
- Group related tools in sub-arrays: `tools={[[Bold, Italic, Underline], [AlignLeft, AlignCenter]]}`
- **Never** define tools as strings: ~~`tools={[['bold', 'italic']]}`~~
