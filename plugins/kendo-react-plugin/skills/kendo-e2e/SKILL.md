---
name: kendo-e2e
description: >
  Use this skill when an agent needs to perform browser-based inspection — navigating
  pages, taking DOM snapshots, capturing screenshots, validating selectors, interacting
  with live elements, or diagnosing rendering and interaction issues. Trigger on phrases
  like "inspect the DOM", "take a screenshot", "debug my component", "snapshot the page",
  "check selectors", or when any agent workflow requires live browser verification.
---

## Role

This skill teaches an agent how to use the `kendo-e2e` MCP tools for browser automation,
DOM inspection, screenshot capture, and live page interaction. It covers **only**
browser-level operations — it does not cover writing test files or test assertions.

---

## Step 0 — Detect Existing Browser Testing Tools

**Always run this before any browser-based operation.** Check whether another browser
testing tool is already present and available in this conversation.

**Decision logic:**

- **No other browser tool found** → proceed with the `kendo-e2e` MCP tools as documented below.
- **Another browser tool is found** → pause and ask the user:

  > "I found **[tool name]** already configured in this project. Which tool would you like to use for browser testing?
  > 1. **kendo-e2e** (MCP-based, integrated with this workflow)
  > 2. **[detected tool]** (already installed in the project)"

  Wait for the user's answer before proceeding.
  - If the user chooses `kendo-e2e` → proceed with this skill as normal.
  - If the user chooses the detected tool → use that tool's APIs for the browser testing steps
    and skip the `kendo-e2e` MCP tool calls below.

---

## Available MCP Tools

| Tool | Purpose |
|------|---------|
| `kendo-e2e.browser-navigate` | Open a URL in the browser |
| `kendo-e2e.browser-close` | Close the browser session |
| `kendo-e2e.dom-snapshot` | Capture a filtered DOM tree with optional screenshot |
| `kendo-e2e.dom-page-info` | Get lightweight page context (title, URL, element counts) |
| `kendo-e2e.dom-test-selector` | Test whether a CSS selector matches elements on the page |
| `kendo-e2e.element-find` | Find elements and read their properties/attributes |
| `kendo-e2e.element-interact` | Interact with elements (click, type, clear, hover, scrollIntoView) |

---

## Workflow — Page Inspection

### Step 1 — Navigate to the page

```
kendo-e2e.browser-navigate(
  url: "<URL of the page>"
)
```

### Step 2 — Snapshot the DOM

Take a full DOM snapshot with screenshot to understand the page structure:

```
kendo-e2e.dom-snapshot(
  format: "html",
  includeScreenshot: true
)
```

The snapshot returns a smart-filtered DOM tree that:
- Excludes script/style noise
- Includes `data-role` attributes for identifying Kendo widgets
  (e.g. `data-role="grid"`, `data-role="datepicker"`, `data-role="dropdownlist"`)
- Includes element coordinates, visibility, ARIA attributes

If only quick page context is needed (title, URL, element counts) use the lighter:
```
kendo-e2e.dom-page-info()
```

### Step 3 — Validate selectors

Before relying on any selector, verify it actually matches:

```
kendo-e2e.dom-test-selector(
  selector: ".k-grid[data-role='grid']"
)
```

This returns match count and matched element details. A selector that returns 0 matches
means the element does not exist on the page in that form.

### Step 4 — Inspect element properties

For detailed element state inspection:

```
kendo-e2e.element-find(
  selector: "<element to inspect>",
  properties: ["text", "visible", "enabled"],
  attributes: ["aria-expanded", "data-role", "class"]
)
```

### Step 5 — Interact with elements

For reproducing user flows or triggering state changes:

```
kendo-e2e.element-interact(
  selector: "<target element>",
  action: "click"
)
```

Supported actions: `click`, `type`, `clear`, `hover`, `scrollIntoView`.
All interactions have automatic waiting built in — no manual `sleep` calls needed.

After each interaction, re-run `kendo-e2e.dom-snapshot` to see the updated DOM state. This is
how to discover selectors for elements that appear after an action (e.g. a popup, dialog, or dropdown).

### Step 6 — Close the browser

Always close the browser when done:
```
kendo-e2e.browser-close()
```

---

## Workflow — Debugging

Use this workflow when diagnosing rendering problems, interaction bugs, or style issues.

### Debug Step 1 — Navigate and snapshot

Navigate to the problem page and take a DOM snapshot with screenshot.

Analyze the snapshot for:
- **Missing elements** — Is the component rendered? Check for `data-role` attributes.
- **Wrong structure** — Are child elements in the expected order? Are containers present?
- **State issues** — Are state classes like `k-selected`, `k-focus`, `k-disabled` applied correctly?
- **Missing attributes** — Are ARIA attributes, `data-role`, and event bindings present?

### Debug Step 2 — Test specific selectors

For targeted investigation, test whether specific elements exist using `kendo-e2e.dom-test-selector`. If expected selectors return 0 matches, the component may not be rendering correctly or may have a different structure.

### Debug Step 3 — Interact and observe

Reproduce the user's steps with `kendo-e2e.element-interact` and re-snapshot after each interaction. Compare the DOM before and after to identify:
- Elements that should appear but don't
- State classes that should toggle but don't
- Event handlers that don't produce visible effects

### Debug Step 4 — Compare pages (migration/regression)

When comparing two versions of a page:

1. Navigate to the **original** page → snapshot DOM and screenshot
2. Navigate to the **updated** page → snapshot DOM and screenshot
3. Compare: component structure, data rendering, interactive behavior, visual appearance

### Debug Step 5 — Report findings

Present a structured diagnosis:
```
## Debug Report

### Issue
[What was reported]

### Root Cause
[What DOM inspection revealed]

### Evidence
[Selector results, screenshots, DOM diff]

### Fix
[Recommended change]
```

---

## Key Principles

- **Snapshot first, act second.** Never assume selectors from memory. Always inspect the live DOM with `kendo-e2e.dom-snapshot` and validate with `kendo-e2e.dom-test-selector` before relying on any selector.
- **Use `data-role` for Kendo components.** These are more stable than class names because they reflect the widget type, not internal styling. Prefer `[data-role="grid"]` over fragile structural paths.
- **No manual waits.** `kendo-e2e.element-interact` has automatic waiting built in. Do not add `setTimeout` or manual sleep calls.
- **Always close the browser.** Call `kendo-e2e.browser-close()` at the end of every session.

**Iterate via snapshots.** For multi-step flows (e.g. open dropdown → select item →
verify result), take a fresh `kendo-e2e.dom-snapshot` after each interaction to see the updated
DOM state before writing the next step.

**Close the browser.** Always call `kendo-e2e.browser-close` when the session is complete to
free resources, especially when multiple sessions could be open.

## Tool Reference

| Tool | Parameters | When to use |
|------|-----------|-------------|
| `kendo-e2e.browser-navigate` | `url` (string), `sessionId` (optional), `mobileEmulation` (optional) | Start a browser session and navigate to the page under test |
| `kendo-e2e.browser-close` | `sessionId` (optional) | Close the browser session when done |
| `kendo-e2e.browser-execute-script` | `script` (string), `args` (optional), `sessionId` (optional) | Run custom JavaScript for complex scenarios not covered by other tools |
| `kendo-e2e.dom-snapshot` | `format` (html/json), `rootSelector` (optional), `includeScreenshot` (bool), `sessionId` (optional) | Get the full filtered DOM tree with Kendo `data-role` attributes |
| `kendo-e2e.dom-test-selector` | `selector` (string), `selectorType` (css/xpath), `sessionId` (optional) | Validate a CSS or XPath selector before using it in generated tests |
| `kendo-e2e.dom-page-info` | `sessionId` (optional) | Fast page context (title, URL, viewport) without a full snapshot |
| `kendo-e2e.element-interact` | `selector` (string), `action` (click/type/clear/hover/scrollIntoView), `value` (optional), `timeout` (optional) | Click, type, hover, or scroll elements (automatic waiting built in) |
| `kendo-e2e.element-find` | `selector` (string), `properties` (optional array), `attributes` (optional array), `multiple` (bool), `timeout` (optional) | Query element properties and state for assertions |
