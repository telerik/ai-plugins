---
name: kendo-react-testing
description: >
  Use this skill when writing unit tests or E2E tests for React components,
  setting up a test environment, selecting the right testing library, or applying
  test patterns for specific component types. Trigger when the user mentions
  "unit test", "E2E test", "write tests", "test setup", "mock components",
  "accessibility tests", or when an agent needs guidance on test structure,
  assertions, and patterns for React components. This skill covers test writing
  only — for browser automation and DOM inspection, load the `kendo-e2e` skill.
---

## Role

This skill teaches an agent how to write unit tests and E2E tests for React
components. It covers test environment setup, component-specific test patterns,
mocking strategies, and test organization.

For browser-level operations (DOM snapshotting, screenshot capture, selector
validation, live page interaction), load the `kendo-e2e` skill instead.

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

### CSS/Theme imports in tests

If components require CSS or theme imports to render without warnings, add them to `test-setup.ts`:

```ts
import 'your-theme-or-css-file.css';
```

Or mock CSS imports if they cause issues:

```ts
vi.mock('your-theme-or-css-file.css', () => ({}));
```

---

## Universal Test Patterns

### Render without crashing

```tsx
it('renders without crashing', () => {
  const { container } = render(<MyComponent />);
  expect(container).toBeTruthy();
});
```

### Controlled value round-trip

```tsx
it('calls onChange with the new value', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<MyInput value="" onChange={onChange} />);
  await user.type(screen.getByRole('textbox'), 'Hello');
  expect(onChange).toHaveBeenCalled();
});
```

### Accessibility assertion (every interactive component)

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Component-Specific Patterns

> **IMPORTANT**: The patterns below are structural examples. Exact prop names, event
> signatures, and event object shapes **must** be verified against the component's
> API reference (from injected context) before writing any assertions.

### Data Grid / Table

```tsx
it('renders all data rows', () => {
  render(<MyGrid data={data} />);
  expect(screen.getByText('Product A')).toBeInTheDocument();
});
```

Notes: Use fixed height for virtualization tests. Check state change events on filter/sort/page.

### Form & Input

```tsx
it('shows validation error on invalid submit', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<MyForm onSubmit={onSubmit} />);
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByText('Required')).toBeInTheDocument();
});
```

### Selection / Dropdown

```tsx
it('calls onChange with the selected value', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<MyDropdown data={items} value={items[0]} onChange={onChange} />);
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByText('Option B'));
  expect(onChange).toHaveBeenCalled();
});
```

### Date/Time Input

Some date/time components render multiple segmented inputs. Target specific segments
with `getByRole` + `name`.

### Dialog / Overlay

```tsx
it('calls onClose when escape key is pressed', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<MyDialog title="Test" onClose={onClose}><p>Content</p></MyDialog>);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});
```

### Chart / Visualization

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

### Partial module mock

Only mock the minimum. Prefer real renders:

```tsx
vi.mock('some-library', async () => {
  const actual = await vi.importActual('some-library');
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
