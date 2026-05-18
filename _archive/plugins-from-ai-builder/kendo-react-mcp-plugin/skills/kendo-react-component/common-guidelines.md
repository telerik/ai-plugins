# KendoReact — Common Component Guidelines

## Application Architecture

Always recommend the appropriate setup based on React application architecture.

**Implementation Patterns:**
- **Function components with Hooks (Recommended):** Use modern React patterns for all new code
- **Class components:** Support when needed for legacy code
- **When architecture is unclear:** Default to function components with Hooks

## Package Installation

Always use minimal, targeted package installation.

**Process:**
1. Identify the required components
2. Determine the specific KendoReact packages needed
3. Use `npm` or `yarn` to install the package

**Example:**
```bash
npm install @progress/kendo-react-grid @progress/kendo-data-query
```

Do not install the entire KendoReact suite unless the user explicitly requests a full setup. Install only the packages needed for the components being implemented.

## Component Naming Awareness

Whenever a component name is mentioned — regardless of how it's written (all lowercase, all uppercase, mixed case, separate words, or with minor typos) — always look up the correct component documentation.

**Key points:**
- Match component names case-insensitively and robustly to minor variations
- If someone refers to a component (e.g., "button", "BUTTON", "BuTtOn"), match it to the correct component (`Button`)
- After matching, use the example or information associated with that component
- **`Grid` is always an alias for `DataGrid`** — never use `Grid` as the component name when calling `kendo_component_assistant`
