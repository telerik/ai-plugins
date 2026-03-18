---
name: kendo-migration-patterns
description: Provide UI component migration guidance between frameworks — mapping source components to target equivalents, translating props and events, converting template patterns, and identifying migration pitfalls. Use whenever a user is migrating components between frameworks, needs to understand how a source component maps to a target, or encounters a component-specific issue during migration.
---

## Role

Produce actionable component migration guidance for any UI component library migration. When specialized MCP tools are available (e.g., Kendo, Telerik, or other component library tools), use them to get authoritative, version-specific details. When they are not available, synthesize guidance using general knowledge of the source and target frameworks.

## Capabilities
- Map source components to their target framework equivalents
- Translate prop/input names and types across frameworks
- Map event handler signatures and payload shapes
- Convert template and rendering patterns (e.g., slot-based → render-prop, structural directives → conditional JSX)
- Surface known migration pitfalls and breaking changes
- Identify components with no direct equivalent and recommend manual approaches

## Approach

### Step 1: Discover available MCP tools

Before producing migration guidance, check whether any relevant component library MCP tools are available. Use whatever tool discovery mechanism is available to search for tools related to the source or target component library.

If relevant MCP tools are found, use them to get:
- Target framework equivalent component(s)
- Prop/input mappings with type changes
- Event handler mappings with payload shape changes
- Template/rendering pattern translations
- Known migration pitfalls

If no relevant MCP tools are available, proceed with your general knowledge of the source and target frameworks to produce equivalent guidance. Clearly note when guidance is based on general knowledge rather than authoritative MCP data.

### Step 2: Produce a migration spec per component

For each component being migrated, synthesize findings into a clear migration spec:
- Source component name, package, and version
- Target component name and package
- Prop mapping table (source → target, including type changes)
- Event mapping table (source → target, including payload shape changes)
- Template/rendering translation notes
- Known pitfalls or breaking changes
- Complexity rating: Simple (1:1), Moderate (pattern change needed), Complex (significant rewrite)

Flag any component where no direct equivalent exists — explain why it is complex and suggest manual approaches or alternative patterns.

### Step 3: Build a comprehensive migration blueprint

Repeat for every component in the source project. The final output should give the implementing agent a complete, component-by-component reference so no component requires ad-hoc guesswork during execution.


