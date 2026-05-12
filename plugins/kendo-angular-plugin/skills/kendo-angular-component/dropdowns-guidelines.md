# Kendo UI for Angular — Dropdowns Guidelines

## ComboBox, DropDownList, MultiSelect

When implementing or updating these components, always follow these rules for `textField` and `valueField`.

### Primitive Data
If the data is an array of primitives (e.g., `[data]="['A', 'B']"`), never set `textField` or `valueField`:

```html
<kendo-dropdownlist [data]="['A', 'B']"></kendo-dropdownlist>
```

### Complex Data
If the data is an array of objects (e.g., `[data]="[{ id, name }]"`), always set both `textField` and `valueField`:
- `textField` is the property to display (e.g., `"name"`)
- `valueField` is the property for value binding (e.g., `"id"`)

```html
<kendo-dropdownlist
    [data]="[{ id: 1, name: 'A' }, { id: 2, name: 'B' }]"
    textField="name"
    valueField="id">
</kendo-dropdownlist>
```

If `valuePrimitive` is `true`, the value must be a primitive and `valueField` is required:

```html
<kendo-dropdownlist
    [data]="items"
    textField="name"
    valueField="id"
    [valuePrimitive]="true"
    [(ngModel)]="selectedValue">
</kendo-dropdownlist>
```
```typescript
public selectedValue = 2;
```

If `valuePrimitive` is `false` (the default), the value must be an object:

```typescript
public selectedValue = { id: 2, name: 'B' };
```

---

## AutoComplete

### Primitive Data
If the data is an array of primitives, never set `valueField`.

### Complex Data
If the data is an array of objects, always set `valueField` to a string property for value binding (e.g., `"id"`).

---

## DropDownTree

Always set both `textField` and `valueField`:
- `textField` is the property to display (e.g., `"name"`)
- `valueField` is the property for value binding (e.g., `"id"`)

When `valueField` and `textField` are `string[]`, always specify `valueDepth`.

### Primitive `value`
If the `value` is of a primitive type, `valuePrimitive` must be `true` and `dataItem` is required. The `value` property of the `dataItem` will be associated with the `valueField`.

---

## MultiSelectTree

Always set both `textField` and `valueField`. When `valueField` and `textField` are `string[]`, always specify `valueDepth`.

### Primitive `value`
If the `value` is of a primitive type, `valuePrimitive` must be `true` and `dataItems` is required. The `value` property of the `dataItems` will be associated with the `valueField`.

---

## MultiColumnComboBox

Always set both `textField` and `valueField`:
- `textField` is the property to display (e.g., `"name"`)
- `valueField` is the property for value binding (e.g., `"id"`)

### Primitive `value`
If the `value` is of a primitive type, `valuePrimitive` must be `true`.
