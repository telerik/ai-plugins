---
name: kendo-angular-validation
description: Canonical Pre-Build API Verification source-and-brief grep checklist and unified Quality Audit checklist (Structure & API + Accessibility + Behavior & Quality) for Kendo UI for Angular code review.
---

# Kendo UI for Angular — Validation & Audit Reference

This skill is the single source of truth for what to validate and audit in generated Kendo UI for Angular code.

There are **two checklists** in this file:

1. **Pre-Build API Verification** — source-and-brief grep checks to run before `ng build`. Catches API-level mistakes that the provided context brief documented correctly.
2. **Quality Audit** — checklist to run after the build is green, organized into three sections (Structure & API / Accessibility / Behavior & Quality).

Each checklist is self-contained — apply only the subsections whose dimension is in scope for the code under review.

---

## Part 1 — Pre-Build API Verification

All grep checks below MUST be emitted as parallel tool calls in a single assistant turn.

### Search scope

Include only:

- Changed/generated application source files and relevant first-party app files.
- Context briefs and addenda provided by the orchestrator.
- Developer, tester, and audit reports produced by the pipeline.
- `package.json`, lockfiles, `angular.json`, root styles, and `index.html` when validating dependency presence, theme setup, or project configuration.

Exclude:

- `node_modules`, dependency package source, package `.d.ts` declarations, source maps, generated declaration bundles, `.angular`, `dist`, and package caches.

Cross-checking against the component reference means cross-checking against the component facts in the provided context brief or explicit handoff facts. Do not grep `node_modules/@progress/**/**/*.d.ts` or other dependency declarations to recover missing Kendo API facts. If a required reference fact is absent, report a context-required gap instead of filling it from package internals.

### A. Import verification

For each generated file:
- Grep `^import` lines.
- Compare results to the imports specified in the context brief component reference (`Kendo package` and `Module / standalone symbol` entries) character-for-character.
- Flag every line not in the reference, every reference-required import missing from the file, and any package-name typos.

### B. Component API verification

For each Kendo component referenced in any generated file (look for `<kendo-*>` tags):
- Grep the component tag and binding usage (e.g. `<kendo-grid` and `\[height\]`, `\[data\]`).
- Cross-reference each binding/event against the per-component context brief reference (Key inputs / Key outputs).
- Flag bindings used in code that are NOT in the reference, required bindings missing from the code, and wrong binding syntax (`[height]="500"` when reference says `[height]="'500px'"`; missing `[]` or `()` brackets).

### C. Framework pattern verification

- Grep `standalone:` across generated component files; confirm every match aligns with the project's detected component style (Standalone vs NgModule).
- Grep `style="` (inline-style anti-pattern) — should be 0 matches.
- Grep the theme import path — confirm exactly one occurrence (no duplicate / conflicting theme).
- Grep `[height]` on every `<kendo-grid>` and `<kendo-chart>` usage; confirm explicit height present.
- **Layout prerequisite (run only when the layout dimension is active for this run):** validate `@progress/kendo-theme-utils` in two places. First, confirm `package.json` lists `@progress/kendo-theme-utils` in `dependencies` or `devDependencies`. Second, grep `@progress/kendo-theme-utils` across `angular.json`, `**/styles.{scss,css}`, and `**/index.html`; there must be **at least one** CSS reference using the project's existing theme import mechanism (see the Prerequisites block in the supplied layout facts). Missing package dependency or missing CSS reference = missing prerequisite. Skip both checks entirely if layout was not active.

### D. Component-decorator + binding shape verification

- Grep `imports:\s*\[` in each `@Component`-decorated file. For every standalone component, confirm `imports: [...]` contains every Kendo module the file actually uses.
- Grep `@ViewChild\(` and `@Output\(` declarations. Verify type generics match the documented payload types (no `<any>`).
- Grep input bindings `\[(\w+)\]=` and output bindings `\((\w+)\)=` on Kendo component tags. Cross-check each name against the context brief component reference.
- For any `<kendo-*>` tag found, confirm the component's `imports[]` array (Standalone) or NgModule `imports` array includes the corresponding Kendo module.

---

## Part 2 — Quality Audit

Three labeled sections. Apply only the subsections whose dimension is in scope for the code under review.

### Section: Structure & API

#### Angular component validation
- Proper `@Component` decorator configuration.
- If using NgModule setup, `@Component` declares `standalone: false` and the component is in the NgModule `declarations` array.
- Selector follows kebab-case naming convention.
- Template and style file organization is appropriate.

#### Kendo UI for Angular setup
- Modules / standalone imports correct for every Kendo component used.
- Exactly **one** Kendo theme is referenced across `angular.json` and styles files — never mix theme packages.
- Theme import mechanism is consistent with existing project setup.
- Animations configured: `provideAnimations()` (Standalone) or `BrowserAnimationsModule` (NgModule).
- Globalization / localization providers configured when used.
- Required Kendo dependencies present in import statements.
- Kendo UI for Angular license activated (`npx kendo-ui-license activate` has been run for the project).

#### Grid-specific validation
- Grid uses `kendoGridBinding` for standard data binding (or correct manual binding with event handlers).
- Grid has an explicit height binding, e.g. `[height]="'500px'"` or `flex: 1; min-height: 0` inside a flex column. Without it the Grid renders all rows and grows unbounded.
- No `kendoButton` combined with Grid command directives on the same element.

#### Theme & styling
- Layout uses Kendo Design System utilities (`k-*` classes) — not Tailwind, Bootstrap, or custom CSS frameworks.
- No inline `style=""` attributes.
- Custom colors use Kendo CSS variables, not hardcoded hex.
- `html, body` set `background-color: var(--kendo-body-bg)` and `color: var(--kendo-body-text)` for dark-theme completeness.
- Theme application is consistent across all generated components (no per-component theme overrides).

### Section: Accessibility

#### Cross-cutting accessibility rules
- WCAG 2.2 AA contrast ratios met.
- Focus indicators visible; keyboard navigation works for every interactive control.
- ARIA labels present on icon-only controls and dynamic regions.
- Per-component a11y rules (ARIA / keyboard / focus) are reflected in template markup, not just comments.
- Semantic landmarks (`<main>`, `<nav>`, `<aside>`) used where appropriate.
- Heading hierarchy is monotonic (no skipped levels).

(Per-component ARIA / keyboard / focus specifics come from the context brief component reference being audited against.)

### Section: Behavior & Quality

#### Performance
- `OnPush` change detection where appropriate; minimize unnecessary change-detection cycles.
- `trackBy` functions on `*ngFor` over Kendo collections.
- Virtualization enabled for large datasets in Grid / ListView / similar components.
- Lazy loading of Kendo UI for Angular components / routes where appropriate.
- Only required Kendo modules / standalone imports — tree-shaken.
- Chart data bound to class properties, never to getter methods (getters re-run every change-detection cycle).
- Chart has explicit height (e.g. `style="height: 300px"` or container with fixed height).

#### Behavior
- NgModule vs Standalone choice consistent across all generated files (must match the project's detected component style).
- Responsive breakpoints applied where the user goal requires multi-viewport behavior.
- No getter-bound Chart data; no inline lambda bindings inside hot template paths.
- Interactive elements (buttons, links, form controls) have stable focus and keyboard handlers — no `(click)` on non-interactive elements.

#### File organization
- Components, services, and styles live in conventional Angular folders (`src/app/<feature>/...`).
- File names match selectors and class names (kebab-case file → PascalCase class → kebab-case selector).
- Routes registered in the appropriate `app.routes.ts` / lazy route file rather than hard-wired in `main.ts`.

#### Error handling & security
- User-facing errors handled via Kendo `Notification` / `Dialog` or framework-level error interceptors — not silent `console.log`.
- Forms use Angular validators (`Validators.required`, `Validators.email`, etc.) where the field semantics call for them.
- No template binding of unsanitized HTML via `[innerHTML]` without `DomSanitizer`.
- Secrets / API keys never inlined into client code.

---

## Severity ranking (audit only)

- **Critical** — blocks task completion (security flaw, crash, missing required ARIA on interactive control, build-breaking pattern).
- **Important** — should be fixed before declaring done (missing `trackBy` on a long list, wrong heading hierarchy, single-theme rule violated).
- **Minor / Suggestion** — nice to have (variable-name clarity, optional `OnPush` opportunity).
