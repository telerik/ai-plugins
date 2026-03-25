# telerik-blazor-plugin

A Claude Code plugin that enforces exclusive use of Telerik UI for Blazor and the Progress Design System in Blazor applications. Provides AI-powered development workflows covering component implementation, layout, theming, code auditing, accessibility, property validation, and compliance enforcement.

## Architecture

The plugin follows a 3-layer separation of concerns:

1. **Agents** (orchestration) — Own workflow gates, agent handoffs, and user interaction. Agents have zero built-in Telerik Blazor knowledge and load skills on demand.
2. **telerik-context-retriever** (knowledge gateway) — The single agent that calls `Telerik.Blazor.MCP` tools. All other agents delegate MCP queries to it.
3. **Skills** (domain patterns) — Pure reference knowledge: component patterns, selector maps, test templates, migration mappings. No workflow orchestration, no MCP tool calls.

Agents reference skills via body-text instructions (e.g., "Load `telerik-blazor-developer` skill when implementing components") rather than frontmatter declarations.

## Features

### Skills

| Skill | Purpose |
|-------|---------|
| **telerik-blazor-developer** | Implement Telerik Blazor components with correct API usage, C# types, and accessibility |
| **telerik-blazor-analyzer** | Audit existing Telerik Blazor code for parameter issues, performance anti-patterns, and accessibility gaps |
| **telerik-blazor-layout** | Build responsive layouts using Telerik layout components and the Progress Design System |
| **telerik-blazor-theme** | Apply and customize Telerik themes using CSS variables and Progress Design System tokens |
| **telerik-blazor-testing** | Testing patterns, setup guidance (bUnit), and component-specific test strategies for Telerik Blazor |
| **telerik-blazor-migration** | Migration knowledge — component mapping tables from any Blazor UI library (MudBlazor, Radzen, Syncfusion, etc.) to Telerik, parameter translations, wave planning |
| **telerik-blazor-advanced-styles** | DOM-aware advanced CSS customization — inspect live Telerik component DOM, target internal elements with surgical CSS, and verify visually |
| **telerik-blazor-validator** | Validate Razor files for invalid, deprecated, or misspelled Telerik component properties using `telerik_validator_assistant` |
| **telerik-blazor-getting-started** | Scaffold new Blazor projects with Telerik pre-configured or configure Telerik in existing projects via `telerik_getting_started_assistant` |

### Agents

| Agent | Purpose |
|-------|---------|
| **telerik-context-retriever** | Fetches authoritative Telerik Blazor API context from MCP tools — delegated by all other agents |
| **telerik-developer** | Senior development agent that orchestrates all Telerik skills and MCP tools to build production-quality features |
| **telerik-reviewer** | Reviews Telerik Blazor code for correctness, parameter usage, theming, accessibility, performance, and runs property validation |
| **telerik-tester** | QA agent that runs unit tests, accessibility checks, property validation, and browser-based visual verification on Telerik Blazor code; loops telerik-developer to fix failures |
| **telerik-custom-stylist** | Advanced styling agent that inspects live DOM, designs targeted CSS for Telerik component internals, and guides visual verification |
| **telerik-migrator** | Migration architect that conducts thorough discovery, analyzes source projects, plans wave-by-wave migration from any Blazor UI library to Telerik, executes and validates each wave |

### Commands

Commands are user-invokable entry points that hand off to the appropriate agent:

| Command | Hands off to | Purpose |
|---------|-------------|---------|
| `/telerik-audit [path]` | **telerik-reviewer** agent | Scan project for non-Telerik UI libraries and generate a compliance report |
| `/telerik-setup [theme]` | (inline setup) | Bootstrap Telerik UI for Blazor in an existing project (installs NuGet package, configures services, sets up theming) |
| `/telerik-ui [requirement]` | **telerik-developer** / **telerik-migrator** / **telerik-tester** / **telerik-custom-stylist** | Route to the right agent based on the requirement |
| `/telerik-test [path]` | **telerik-tester** agent | Run unit tests, accessibility checks, and property validation on Telerik Blazor components |
| `/telerik-migrate [path]` | **telerik-migrator** agent | Migrate a project from any Blazor UI library to Telerik |
| `/telerik-validate [path]` | (inline validation) | Validate Razor files for invalid Telerik component properties |

## Prerequisites

- .NET 8.0 or later
- Node.js ≥ 18 (required to run the MCP server)
- A Telerik UI for Blazor commercial license
- Telerik NuGet source configured

## Installation

```bash
claude plugin install /path/to/telerik-blazor-plugin
```

Or for local development:

```bash
claude --plugin-dir /path/to/telerik-blazor-plugin
```

## Usage

### Getting started with a new project

```
/telerik-setup
```

Installs the Telerik NuGet package, registers services, configures the theme, and sets up `TelerikRootComponent`.

### Building UI

```
/telerik-ui Build a data grid with search and column filters
```

Routes to the **telerik-developer** agent, which uses the right skills and MCP tools to implement the feature end-to-end.

### Auditing compliance

```
/telerik-audit
```

Hands off to the **telerik-reviewer** agent, which scans `.csproj` and source files for third-party UI libraries and generates a remediation report.

### Validating Razor files

```
/telerik-validate
```

Runs `telerik_validator_assistant` on all Razor files containing Telerik components and reports invalid properties.

### Migrating from another Blazor UI library

```
/telerik-migrate
```

Hands off to the **telerik-migrator** agent, which conducts a thorough discovery interview, creates a migration plan, and executes the migration wave by wave with validation at each step.

### Skills trigger automatically

Skills activate based on context — no manual invocation needed:

- Ask "add a TelerikGrid" → **telerik-blazor-developer** skill triggers
- Ask "review my Telerik components" → **telerik-blazor-analyzer** skill triggers
- Ask "customize my Telerik theme" → **telerik-blazor-theme** skill triggers
- Ask "build a dashboard layout" → **telerik-blazor-layout** skill triggers
- Ask "validate my Razor files" → **telerik-blazor-validator** skill triggers
- Ask "migrate my MudBlazor app to Telerik" → **telerik-blazor-migration** skill triggers

## MCP Servers

### Telerik.Blazor.MCP

| Tool | Purpose |
|------|---------|
| `telerik_component_assistant` | API docs, parameter reference, and code examples for all Telerik Blazor components |
| `telerik_style_assistant` | Theme generation and CSS variable customization |
| `telerik_icon_assistant` | Find Telerik SVG icons by purpose or keyword |
| `telerik_accessibility_assistant` | WCAG 2.2 AA compliance, ARIA roles, keyboard navigation guidance |
| `telerik_layout_assistant` | Layout patterns and responsive design with Telerik layout components |
| `telerik_getting_started_assistant` | Scaffold new Blazor projects with Telerik pre-configured, setup guidance |
| `telerik_validator_assistant` | Validate Razor files for invalid Telerik component properties |

### kendo-e2e

| Tool | Purpose |
|------|---------|
| `kendo-e2e.browser-navigate` | Open a running Blazor app in a browser session for live inspection |
| `kendo-e2e.browser-close` | Close an open browser session |
| `kendo-e2e.browser-execute-script` | Execute JavaScript in the browser context |
| `kendo-e2e.dom-snapshot` | Capture the rendered HTML structure and/or a screenshot |
| `kendo-e2e.dom-test-selector` | Validate that a CSS selector matches elements in the live DOM |
| `kendo-e2e.dom-page-info` | Get current page URL and title |
| `kendo-e2e.element-interact` | Trigger interactions (click, hover, focus) to expose state-specific classes |
| `kendo-e2e.element-find` | Inspect specific element properties and attributes in the live DOM |

> **Note**: kendo-e2e is used exclusively for **browser-based DOM inspection and visual verification** — not for writing automated E2E tests or unit tests.

## Policy

This plugin enforces a **Telerik-only** component library policy:

- Only `Telerik.UI.for.Blazor` may be used for UI components
- All custom styling must use `--kendo-*` CSS variables or `kendo-theme-utils` utility classes
- Third-party Blazor UI libraries (MudBlazor, Radzen, Syncfusion, Blazorise, etc.) are not permitted
- Run `/telerik-audit` to detect non-Telerik usage and get remediation guidance from the **telerik-reviewer** agent
- Run `/telerik-validate` to catch invalid component properties before runtime
