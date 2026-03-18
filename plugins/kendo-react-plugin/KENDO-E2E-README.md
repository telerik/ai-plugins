# Kendo E2E MCP Server

Model Context Protocol (MCP) server for AI-powered test generation with kendo-e2e.

## Features

- **8 streamlined tools** for browser automation and test generation
- **Smart DOM snapshots** with intelligent filtering (excludes script/style tags)
- **Kendo component detection** via `data-role` attributes
- **Automatic waiting** built into all interactions
- **Screenshot capture** for visual context

## Installation

The MCP server is included with `@progress/kendo-e2e`:

```bash
npm install @progress/kendo-e2e --save-dev
```

## Usage with Claude Desktop / VS Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "kendo-e2e": {
      "command": "npx",
      "args": ["-p", "@progress/kendo-e2e", "kendo-e2e-mcp"]
    }
  }
}
```

Or if `@progress/kendo-e2e` is already installed in your project:

```bash
npx kendo-e2e-mcp
```

## Available Tools

### Browser Lifecycle (3 tools)

1. **`kendo-e2e.browser-navigate`** - Navigate to URL, auto-starts browser if needed
   - Parameters: `url`, optional `sessionId`, `mobileEmulation`
   - Returns: `sessionId` for subsequent operations

2. **`kendo-e2e.browser-close`** - Close browser session
   - Parameters: optional `sessionId` (closes all if omitted)

3. **`kendo-e2e.browser-execute-script`** - Execute JavaScript in browser
   - Parameters: `script`, `args`
   - Use for complex scenarios not covered by other tools

### DOM Context (3 tools)

4. **`kendo-e2e.dom-snapshot`** - Get filtered DOM tree with positioning & visibility
   - Returns: Smart-filtered HTML/JSON with element details
   - Includes: tags, ids, classes, roles, `data-role` (Kendo), aria-*, frame coordinates, hidden state
   - Parameters: `rootSelector` (optional), `format` (html/json), `includeScreenshot`
   - **Key tool for LLM context** - excludes noise, highlights structure

5. **`kendo-e2e.dom-test-selector`** - Test CSS/XPath selectors
   - Returns: Match count, matched elements with details
   - Auto-detects selector type
   - **Use before generating tests** to validate selectors

6. **`kendo-e2e.dom-page-info`** - Quick page context
   - Returns: title, URL, viewport, readyState, element counts
   - Fast alternative to full DOM snapshot

### Element Interaction (2 tools)

7. **`kendo-e2e.element-interact`** - Unified interaction tool
   - Actions: `click`, `type`, `clear`, `hover`, `scrollIntoView`
   - Parameters: `selector`, `action`, `value` (for type), `timeout`
   - **Automatic waiting built-in**

8. **`kendo-e2e.element-find`** - Find and query elements
   - Returns: element properties (text, attributes, visibility, enabled)
   - Parameters: `selector`, `multiple`, `properties`, `attributes`
   - Use for assertions and element state checks

## Example Workflow

```typescript
// 1. Start browser and navigate
await mcp.call('kendo-e2e.browser-navigate', { 
  url: 'https://demos.telerik.com/kendo-ui/grid'
});

// 2. Get DOM snapshot to understand structure
const snapshot = await mcp.call('kendo-e2e.dom-snapshot', {
  format: 'html',
  includeScreenshot: true
});

// 3. Test selector before generating code
const result = await mcp.call('kendo-e2e.dom-test-selector', {
  selector: '.k-grid[data-role="grid"]'
});

// 4. Interact with elements
await mcp.call('kendo-e2e.element-interact', {
  selector: '#grid .k-grid-content tr:first-child',
  action: 'click'
});

// 5. Verify element state
const info = await mcp.call('kendo-e2e.element-find', {
  selector: '.k-dialog',
  properties: ['text', 'visible']
});

// 6. Close when done
await mcp.call('kendo-e2e.browser-close');
```

## Generated Test Example

The MCP server enables Copilot to generate clean kendo-e2e tests:

```typescript
import { Browser } from '@progress/kendo-e2e';

describe('Kendo Grid', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = new Browser();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should filter grid rows', async () => {
    await browser.navigateTo('https://demos.telerik.com/kendo-ui/grid');
    
    // Click filter icon
    await browser.click('.k-grid-header .k-filterable');
    
    // Type in filter input
    await browser.type('.k-filter-menu input', 'John');
    
    // Click filter button
    await browser.click('.k-filter-menu button.k-primary');
    
    // Verify results
    await browser.expect('.k-grid tbody tr').toHaveCount(5);
  });
});
```

## Key Benefits

1. **Optimized for LLMs** - DOM snapshots exclude noise, focus on semantic structure
2. **Kendo-aware** - Detects Kendo widgets via `data-role` attributes
3. **No manual waits** - Automatic waiting built into all interactions
4. **Iterative development** - Test selectors, run code, refine based on results
5. **Clean implementation** - Directly in kendo-e2e package, no separate server needed

## Architecture

- **8 tools** (vs 15+ in other MCP servers) - focused on essential operations
- **Consolidated interactions** - One tool handles all element actions
- **ES modules** with CommonJS compatibility for selenium-webdriver
- **Minimal dependencies** - Only MCP SDK and zod externalized

## Development

Build the MCP server:

```bash
npm run build:mcp
```

Test locally:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | node dist/mcp/index.js
```

## License

Same as @progress/kendo-e2e - SEE LICENSE IN LICENSE.md