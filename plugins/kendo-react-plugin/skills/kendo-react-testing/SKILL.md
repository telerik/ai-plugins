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

## IMPORTANT — Verify Props via MCP Before Asserting

Before writing assertions on component props, event handler arguments, or rendered
output, always call `kendo_component_assistant` for the component under test. Training
knowledge of prop names and event signatures is unreliable. Ground every assertion in
the MCP tool's response.

## Role

You are a KendoReact testing expert. You provide authoritative guidance on test setup, patterns, and strategies specifically for `@progress/kendo-react-*` components. You know the quirks of testing controlled KendoReact inputs, how to assert on Grid row data, how to trigger KendoReact date pickers in tests, and how to validate accessibility with axe.

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
| `@progress/kendo-e2e` | E2E browser automation for KendoReact |

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

KendoReact components require a theme to render without warnings. Import it in `test-setup.ts`:

```ts
import '@progress/kendo-theme-default/dist/all.css';
```

Or use `vi.mock` to suppress CSS imports if they cause issues:

```ts
vi.mock('@progress/kendo-theme-default/dist/all.css', () => ({}));
```

---

## Universal Test Patterns

### Render without crashing

Every component test must start with a smoke test:

```tsx
it('renders without crashing', () => {
  const { container } = render(<MyKendoComponent />);
  expect(container).toBeTruthy();
});
```

### Controlled value round-trip

KendoReact inputs are typically controlled. Test the full value/onChange cycle:

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

> **IMPORTANT**: The test patterns below are structural scaffolding examples. Exact
> prop names, event signatures, and event object shapes **must** be verified by calling
> `kendo_component_assistant(component: "<name>", query: "...")` before use. Do not
> assume the API shown here is current — always ground assertions in MCP tool output.

### Grid

```tsx
import { Grid, GridColumn } from '@progress/kendo-react-grid';

const data = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
];

it('renders all data rows', () => {
  render(
    <Grid data={data}>
      <GridColumn field="name" title="Name" />
      <GridColumn field="price" title="Price" />
    </Grid>
  );
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();
});

it('displays correct number of rows', () => {
  const { container } = render(
    <Grid data={data}>
      <GridColumn field="name" title="Name" />
    </Grid>
  );
  // Data rows have tr role; exclude header row
  const rows = container.querySelectorAll('tbody tr');
  expect(rows).toHaveLength(data.length);
});
```

**Grid gotchas:**
- Always wrap Grid in a container with a fixed height for virtualisation tests
- `onDataStateChange` fires on filter/sort/page — test it receives a `DataState` argument
- For server-side paging tests, mock API calls and assert loading states

### Form & Inputs

```tsx
import { Form, FormElement, Field } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';

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
  expect(onSubmit).not.toHaveBeenCalled();
});
```

### DropDownList / ComboBox

```tsx
import { DropDownList } from '@progress/kendo-react-dropdowns';

const sports = ['Baseball', 'Basketball', 'Football'];

it('calls onChange with the selected value', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<DropDownList data={sports} value={sports[0]} onChange={onChange} />);
  // Open the dropdown
  await user.click(screen.getByRole('combobox'));
  // Select an option
  await user.click(screen.getByText('Basketball'));
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
    value: 'Basketball',
  }));
});
```

### DatePicker

```tsx
import { DatePicker } from '@progress/kendo-react-dateinputs';

it('calls onChange when a date is typed', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  render(<DatePicker value={null} onChange={onChange} />);
  const input = screen.getByRole('spinbutton', { name: /month/i });
  await user.click(input);
  await user.keyboard('01012025');
  expect(onChange).toHaveBeenCalled();
});
```

**DatePicker gotcha:** The `DatePicker` renders multiple `spinbutton` inputs (month, day, year). Use `{ name: /month/i }` or `{ name: /day/i }` to target the right segment.

### Dialog / Window

```tsx
import { Dialog } from '@progress/kendo-react-dialogs';

it('renders dialog content when open', () => {
  render(
    <Dialog title="Confirm Delete" onClose={() => {}}>
      <p>Are you sure?</p>
    </Dialog>
  );
  expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  expect(screen.getByText('Are you sure?')).toBeInTheDocument();
});

it('calls onClose when escape key is pressed', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<Dialog title="Test" onClose={onClose}><p>Content</p></Dialog>);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});
```

### Chart

```tsx
import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';

it('renders chart without crashing with series data', () => {
  const { container } = render(
    <Chart>
      <ChartSeries>
        <ChartSeriesItem type="bar" data={[10, 20, 30]} />
      </ChartSeries>
    </Chart>
  );
  // Charts render SVG — check the SVG root is present
  expect(container.querySelector('svg')).toBeInTheDocument();
});
```

**Chart gotcha:** KendoReact Charts render SVG asynchronously. Use `waitFor` or `findByRole` if asserting on specific SVG elements.

---

## Mocking Patterns

### Mock server-side data fetch in Grid

```tsx
vi.mock('../api/products', () => ({
  fetchProducts: vi.fn().mockResolvedValue({ data: mockProducts, total: 2 }),
}));
```

### Mock KendoReact module (partial)

Only mock the minimum. Prefer real renders unless the component has heavy side effects:

```tsx
vi.mock('@progress/kendo-react-grid', async () => {
  const actual = await vi.importActual('@progress/kendo-react-grid');
  return { ...actual };
});
```

---

## Test Organization

- **Co-locate unit tests**: `src/components/ProductGrid/ProductGrid.test.tsx`
- **E2E tests in dedicated dir**: `src/e2e/product-grid.e2e.ts`
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
