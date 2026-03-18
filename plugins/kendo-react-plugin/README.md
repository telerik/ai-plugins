# kendo-react-plugin

A Claude Code plugin that enforces exclusive use of KendoReact and the Progress Design System in React applications. Provides AI-powered development workflows covering component implementation, layout, theming, code auditing, accessibility, E2E testing, and compliance enforcement.

## Features

### Skills

| Skill | Purpose |
|-------|---------|
| **kendo-react-developer** | Implement KendoReact components with correct API usage, TypeScript types, and accessibility |
| **kendo-react-analyzer** | Audit existing KendoReact code for prop issues, performance anti-patterns, and accessibility gaps |
| **kendo-react-layout** | Build responsive layouts using KendoReact layout components and the Progress Design System |
| **kendo-react-theme** | Apply and customize KendoReact themes using CSS variables and Progress Design System tokens |
| **kendo-e2e** | Generate and run E2E tests for KendoReact components using browser automation |
| **kendo-react-testing** | Testing patterns, setup guidance, and component-specific test strategies for KendoReact |
| **kendo-react-advanced-styles** | DOM-aware advanced CSS customization — inspect live Kendo component DOM, target internal elements with surgical CSS, and verify visually |
| **kendo-react-migration** | Migration knowledge — component mapping tables from any UI library (MUI, Ant Design, Chakra, etc.) to KendoReact, prop/event translations, styling migration, wave planning |

### Agents

| Agent | Purpose |
|-------|---------|
| **kendo-reviewer** | Reviews KendoReact code for correctness, prop usage, theming, accessibility, and performance |
| **kendo-developer** | Senior development agent that orchestrates all KendoReact skills and MCP tools to build production-quality features |
| **kendo-tester** | QA agent that runs unit, E2E, accessibility, and visual regression tests on KendoReact code; loops kendo-developer to fix failures |
| **kendo-custom-stylist** | Advanced styling agent that inspects live DOM, designs targeted CSS for Kendo component internals, and self-verifies with screenshots in an automated loop |
| **kendo-migrator** | Migration architect that conducts thorough discovery, analyzes source projects, plans wave-by-wave migration from any UI library to KendoReact, executes and validates each wave |

### Commands

Commands are user-invokable entry points that hand off to the appropriate agent:

| Command | Hands off to | Purpose |
|---------|-------------|---------|
| `/kendo-audit [path]` | **kendo-reviewer** agent | Scan project for non-KendoReact UI libraries and generate a compliance report |
| `/kendo-setup [theme]` | (inline setup) | Bootstrap KendoReact in an existing React project (installs packages, configures theme, sets up licensing) |
| `/kendo-ui [requirement]` | **kendo-developer** / **kendo-migrator** / **kendo-tester** / **kendo-custom-stylist** | Route to the right agent based on the requirement |
| `/kendo-test [path]` | **kendo-tester** agent | Run a full test suite (unit, E2E, accessibility, visual regression) on KendoReact components |
| `/kendo-migrate [path]` | **kendo-migrator** agent | Migrate a project from any UI library to KendoReact |

## Prerequisites

- Node.js ≥ 18 (required to run the MCP servers via `npx`)
- A KendoReact commercial license

## Installation

```bash
claude plugin install /path/to/kendo-react-plugin
```

Or for local development:

```bash
claude --plugin-dir /path/to/kendo-react-plugin
```

## Usage

### Getting started with a new project

```
/kendo-setup
```

Installs KendoReact packages, configures the theme, and sets up licensing.

### Building UI

```
/kendo-ui Build a data grid with search and column filters
```

Routes to the **kendo-developer** agent, which uses the right skills and MCP tools to implement the feature end-to-end.

### Auditing compliance

```
/kendo-audit
```

Hands off to the **kendo-reviewer** agent, which scans `package.json` and source files for third-party UI libraries and generates a remediation report.

### Migrating from another UI library

```
/kendo-migrate
```

Hands off to the **kendo-migrator** agent, which conducts a thorough discovery interview, creates a migration plan, and executes the migration wave by wave with validation at each step.

### Skills trigger automatically

Skills activate based on context — no manual invocation needed:

- Ask "add a KendoReact Grid" → **kendo-react-developer** skill triggers
- Ask "review my KendoReact components" → **kendo-react-analyzer** skill triggers
- Ask "customize my KendoReact theme" → **kendo-react-theme** skill triggers
- Ask "build a dashboard layout" → **kendo-react-layout** skill triggers
- Ask "add E2E tests for my Kendo Grid" → **kendo-e2e** skill triggers
- Ask "deeply customize the grid header styling" → **kendo-react-advanced-styles** skill triggers
- Ask "migrate my MUI app to KendoReact" → **kendo-react-migration** skill triggers

## MCP Servers

### kendo-react-mcp (`@progress/kendo-react-mcp`)

| Tool | Purpose |
|------|---------|
| `kendo_component_assistant` | API docs, prop reference, and code examples for all KendoReact components |
| `kendo_style_assistant` | Theme generation and CSS variable customization |
| `kendo_icon_assistant` | Find Telerik SVG icons by purpose or keyword |
| `kendo_accessibility_assistant` | WCAG 2.1 AA compliance, ARIA roles, keyboard navigation guidance |
| `kendo_layout_assistant` | Layout patterns and responsive design with KendoReact layout components |

### kendo-e2e (`@progress/kendo-e2e`)

| Tool | Purpose |
|------|---------|
| `kendo-e2e.browser-navigate` | Navigate to a URL in the headless browser |
| `kendo-e2e.browser-close` | Close the browser session |
| `kendo-e2e.browser-execute-script` | Run JavaScript in the browser context |
| `kendo-e2e.dom-snapshot` | Capture the current DOM state |
| `kendo-e2e.dom-test-selector` | Verify selectors work against the live DOM |
| `kendo-e2e.dom-page-info` | Get page title, URL, and metadata |
| `kendo-e2e.element-interact` | Click, type, or interact with elements |
| `kendo-e2e.element-find` | Find elements by selector, text, or `data-role` |

## Policy

This plugin enforces a **KendoReact-only** component library policy:

- Only `@progress/kendo-react-*` packages may be used for UI components
- All custom styling must use `--kendo-*` CSS variables or `kendo-theme-utils` utility classes
- Third-party UI libraries (MUI, Ant Design, Chakra UI, Shadcn, etc.) are not permitted
- Run `/kendo-audit` to detect non-KendoReact usage and get remediation guidance from the **kendo-reviewer** agent
