---
name: kendo-react-testing
description: >
  Use this skill when writing tests for KendoReact components, setting up a
  KendoReact test environment, selecting the right testing library, or applying
  test patterns for specific KendoReact components. Trigger when the user mentions
  "unit test KendoReact", "how to test KendoReact Grid", "set up testing for my
  Kendo app", "test a KendoReact form", "mock KendoReact components", "add
  accessibility tests for Kendo", or asks about testing patterns for any
  @progress/kendo-react-* component. Also trigger when kendo-tester needs
  component-specific guidance on assertions or test structure.
---

## Role

You are a KendoReact testing expert. You provide authoritative guidance on test
setup, patterns, and strategies specifically for `@progress/kendo-react-*` components.

---

## Test Environment Setup

### Recommended Stack

| Tool | Purpose |
|------|---------|
| `vitest` | Test runner (preferred for Vite projects) |
| `jest` | Test runner (for CRA or non-Vite projects) |
| `@testing-library/react` | Component rendering and querying |
| `@testing-library/user-event` | Realistic user interaction simulation |
| `@testing-library/jest-dom` | Extended DOM matchers |
| `jest-axe` or `axe-core` | Accessibility assertions |
| `jsdom` | Browser environment emulation |

### Install (Vite + Vitest)

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom jest-axe
```

### `vitest.config.ts` baseline

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

### `src/test-setup.ts`

```ts
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

### Theme in tests

KendoReact components require a theme to render without warnings. Import in `test-setup.ts`:

```ts
import '@progress/kendo-theme-default/dist/all.css';
```

Or mock CSS imports if they cause issues:

```ts
vi.mock('@progress/kendo-theme-default/dist/all.css', () => ({}));
```

---

## Universal Test Patterns

### Render without crashing

```tsx
it('renders without crashing', () => {
  const { container } = render(<MyKendoComponent />);
  expect(container).toBeTruthy();
});
```

### Controlled value round-trip

```tsx
it('calls onChange with the new value', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<Input value="" onChange={onChange} />);
  await user.type(screen.getByRole('textbox'), 'Hello');
  expect(onChange).toHaveBeenCalled();
});
```

### Accessibility assertion (every interactive component)

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(
    <DropDownList data={['Option A', 'Option B']} value="Option A" onChange={() => {}} />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Component-Specific Patterns

> **IMPORTANT**: The patterns below are structural examples for illustration purposes only.
> Exact prop names, event signatures, and event object shapes **must** be verified via
> kendo-context-retriever before writing any assertions.

### Data Grid

```tsx
it('renders all data rows', () => {
  render(
    <Grid data={data}>
      <GridColumn field="name" title="Name" />
    </Grid>
  );
  expect(screen.getByText('Product A')).toBeInTheDocument();
});
```

Notes: Use fixed height for virtualisation tests. Check state change events on filter/sort/page.

### Form & Input

```tsx
it('shows validation error on invalid submit', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(
    <Form onSubmit={onSubmit} render={(formRenderProps) => (
      <FormElement>
        <Field name="email" component={Input} validator={(v) => v ? '' : 'Required'} />
        <button type="submit" disabled={!formRenderProps.allowSubmit}>Submit</button>
      </FormElement>
    )} />
  );
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByText('Required')).toBeInTheDocument();
});
```

### Selection/Dropdown

```tsx
it('calls onChange with the selected value', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<DropDownList data={sports} value={sports[0]} onChange={onChange} />);
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByText('Basketball'));
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'Basketball' }));
});
```

### Date/Time Input

Some date/time components render multiple segmented inputs. Target specific segments
with `getByRole` + `name`.

### Dialog/Overlay

```tsx
it('calls onClose when escape key is pressed', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<Dialog title="Test" onClose={onClose}><p>Content</p></Dialog>);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});
```

### Chart/Visualization

Charts render SVG. Use `container.querySelector('svg')` to verify rendering.
Charts may render asynchronously — use `waitFor` or `findByRole`.

---

## Mocking Patterns

### Mock server-side data fetch

```tsx
vi.mock('../api/products', () => ({
  fetchProducts: vi.fn().mockResolvedValue({ data: mockProducts, total: 2 }),
}));
```

### Mock KendoReact module (partial)

Only mock the minimum. Prefer real renders:

```tsx
vi.mock('@progress/kendo-react-grid', async () => {
  const actual = await vi.importActual('@progress/kendo-react-grid');
  return { ...actual };
});
```

---

## Test Organization

- **Co-locate unit tests**: `src/components/MyComponent/MyComponent.test.tsx`
- **E2E tests in dedicated dir**: `src/e2e/my-component.e2e.ts`
- **One `describe` block per component, one `it` per behavior**
- **Descriptive test names**: "renders 3 rows when data has 3 items" not "test 1"
- **Avoid implementation details**: test what users see, not internal state

---

## Coverage Targets

| Layer | Minimum Target |
|-------|---------------|
| Unit (statements) | 80% |
| Unit (branches) | 70% |
| E2E (critical user flows) | 100% of defined flows |
| Accessibility (axe) | 0 violations on all interactive components |
