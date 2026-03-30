# KendoReact — Common Component Guidelines

## Application Architecture
- **Recommended**: Function components with Hooks (modern React)
- **Supported**: Class components for legacy codebases
- **Default**: When architecture is unclear, default to function components with Hooks

## Package Installation
- Always use **minimal, targeted** package installation
- Process: Identify components → determine specific packages → install
- Example: `npm install @progress/kendo-react-grid @progress/kendo-data-query`
- **Never** install `@progress/kendo-react-all` unless explicitly requested
