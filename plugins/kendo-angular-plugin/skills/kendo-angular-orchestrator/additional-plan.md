# Angular-Specific Project Analysis

Before generating any code, perform these two analysis steps to ensure all output matches the project's existing conventions.

---

## Step 1: Detect NgModule vs Standalone Setup

Search the project to determine which component architecture is in use:

1. `RegexSearch("@Component\s*\(\s*\{[^}]*standalone\s*:\s*(true|false)")` — If `true` → use **Standalone components**. If `false` → use **NgModule**.
2. `RegexSearch("bootstrapApplication\s*\(")` — If found → use **Standalone components**.
3. `RegexSearch("bootstrapModule\s*\(")` — If found → use **NgModule**.
4. If none of the above is found → default to **Standalone components**.

**Apply consistently:** All generated components must follow the detected pattern. Do not mix Standalone and NgModule within the same feature.

- **Standalone:** Use `imports: [...]` array inside `@Component`, no `NgModule` declarations.
- **NgModule:** Use `standalone: false` in `@Component`, declare in the module's `declarations` array, import the module in the appropriate `NgModule`.

---

## Step 2: Determine Existing Kendo Theme and Import Mechanism

Search the project to understand how Kendo themes are already imported:

1. **Read `angular.json`** — look for entries containing `@progress/kendo-theme-` in `projects.[project-name].architect.build.options.styles` array.
2. **Read `styles.css` or `styles.scss`** — look for `@import` or `@use` statements containing `@progress/kendo-theme-`.
3. **Read `index.html`** — look for `<link>` tags referencing Kendo theme CSS files.
4. **Look for `kendo-theme-utils`** — note whether it is already included and how (npm or CDN).

**Note:**
- Which theme is in use (`default`, `material`, `bootstrap`, or `fluent`)
- Whether `kendo-theme-utils` is already included
- Which import mechanism is used (angular.json styles array, @import in scss, or CDN link in index.html)

**Always use the same import mechanism** for any new Kendo theme/utils references unless the user explicitly requests otherwise. Never add a duplicate reference.

---

## Step 3: Match Existing Project Patterns

Before generating or modifying any code:

1. Identify existing patterns in the project:
   - Component naming conventions (e.g., `export class \w+Component`)
   - File naming patterns (e.g., `*.component.ts`, `*.service.ts`)
   - Import statement styles
   - TypeScript configuration (strict mode, decorators, etc.)
2. Match the discovered patterns in all generated code
3. Maintain consistent formatting, indentation, and code organization with existing files
