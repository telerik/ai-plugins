# KendoReact Plugin — Uncommitted Changes Analysis

> **Scope**: `plugins/kendo-react-plugin/`
> **Files changed**: 20 (6 deleted, 6 new, 8 modified, + 3 new reference directories)
> **Net impact**: −993 lines removed, +1408 lines added across agents, commands, and skills

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Agents — Rename and Redesign](#2-agents--rename-and-redesign)
3. [Commands — Orchestration Overhaul](#3-commands--orchestration-overhaul)
4. [Skills — Decoupling and Reference Extraction](#4-skills--decoupling-and-reference-extraction)
5. [Architectural Decisions](#5-architectural-decisions)
6. [File-by-File Change Matrix](#6-file-by-file-change-matrix)

---

## 1. Executive Summary

The kendo-react-plugin underwent a comprehensive redesign affecting all three component layers — agents, commands, and skills. The changes enforce a strict separation of concerns:

- **Agents** are renamed from `kendo-*` to `kr-*`, rewritten to declare "zero built-in knowledge," and now load skills explicitly rather than having skills wired into them.
- **Commands** are rewritten from simple delegation stubs into full orchestration workflows with phased execution, per-gate reasoning checkpoints, skip/reduce criteria, and persistent workflow continuity.
- **Skills** are decoupled from agents and commands — they no longer reference specific agent names, remove "Context Sources" tables that assumed a specific retrieval path, and gain local `references/` directories for static reference material.

### Design Principles Driving the Changes

| Principle | What it means |
|-----------|---------------|
| **Zero built-in knowledge** | Agents declare they have no KendoReact API knowledge; all context is injected at runtime via `kr-context-retriever` |
| **Commands are orchestrators** | Commands do not implement — they plan, decompose, delegate to agents, and validate |
| **Skills are teachable knowledge** | Skills contain patterns and reference material; they do not reference specific agents or commands |
| **Never assume, always reason** | Every phase and gate has explicit skip/reduce criteria; deviations must be justified |
| **Single context gateway** | `kr-context-retriever` is the only agent that calls MCP tools; all others receive injected context |

---

## 2. Agents — Rename and Redesign

### 2.1 Naming Convention Change

All 6 agents were renamed from `kendo-*` to `kr-*`:

| Old Name (deleted) | New Name (created) | Color |
|---------------------|--------------------|-------|
| `kendo-developer` | `kr-developer` | green |
| `kendo-tester` | `kr-tester` | yellow |
| `kendo-reviewer` | `kr-reviewer` | cyan |
| `kendo-migrator` | `kr-migrator` | orange |
| `kendo-context-retriever` | `kr-context-retriever` | blue |
| `kendo-custom-stylist` | `kr-custom-stylist` | purple |

The old files were moved to `.BAK` backups and the new files created with the new names.

### 2.2 Structural Changes Across All Agents

**Before**: Agents contained "WORKFLOW GATES" — rigid, numbered steps with "Complete All Before Responding to User" instructions. They referenced the `kendo-context-retriever` agent by name as the mandatory first step, and embedded skill-loading decisions within the workflow gates.

**After**: Agents follow a uniform structure:

1. **Role declaration** with "zero built-in knowledge" disclaimer
2. **Skill Loading section** — explicit list of which skills to load and when
3. **Process section** — numbered steps for the agent's workflow (understand → context → plan → implement → audit → security → self-check)
4. **Implementation Rules** — bullet list of constraints
5. **Quality Bar** — one-paragraph definition of "done"

### 2.3 Key Changes Per Agent

#### kr-developer (was kendo-developer)
- **Before**: 5 workflow gates (context retrieval → implement → test → fix → style), directly invoked `kendo-context-retriever`, included a "Test Gate" that called `kendo-tester`
- **After**: 7-step development process focused purely on implementation. Does NOT invoke other agents. Loads 4 skills (developer, getting-started, theme, e2e) based on need. Browser verification is part of self-check, not delegated to tester.
- **Reasoning**: The developer agent should own implementation end-to-end. Test orchestration belongs in commands.

#### kr-tester (was kendo-tester)
- **Before**: 4 test modes (unit, E2E, accessibility, visual regression)
- **After**: 5 test modes — added **browser verification** mode for ad-hoc visual and interaction checks without producing test files. Loads 2 skills (testing, e2e). Explicit rule: "never modify application source code."
- **Reasoning**: Browser verification was previously unowned. kr-tester is the natural owner since it already loads the kendo-e2e skill.

#### kr-reviewer (was kendo-reviewer)
- **Before**: 7 review dimensions with workflow gates
- **After**: Same 7 review dimensions, restructured into a 7-step review process. Added explicit security review step. Fix-or-report severity model: Critical → fix directly; Warning/Suggestion → report only.
- **Reasoning**: Consistent with the new agent template. Security review was missing.

#### kr-migrator (was kendo-migrator)
- **Before**: Discovery interview, wave-based migration with embedded context retrieval
- **After**: 9-step migration process. No longer conducts discovery interviews (that's the command's job). Focuses on wave execution with per-wave validation. Added security review step.
- **Reasoning**: The command orchestrates the workflow; the agent executes.

#### kr-context-retriever (was kendo-context-retriever)
- **Before**: Same MCP tools, similar structure
- **After**: Refined execution rules — "one component per call," "complete over terse," "never fabricate." Streamlined output format with explicit structure (Heading → Props table → Events → Code example → Accessibility → Notes).
- **Reasoning**: Minor refinement for consistency; core role unchanged.

#### kr-custom-stylist (was kendo-custom-stylist)
- **Before**: 6 workflow gates with DOM inspection loop
- **After**: 7-step process. Loads kendo-e2e skill for live DOM inspection. Removed the automatic fix-and-verify loop (now handled by command orchestration).
- **Reasoning**: The command controls the fix loop; the agent executes one pass.

---

## 3. Commands — Orchestration Overhaul

### 3.1 Before → After Overview

All 5 commands were rewritten from simple delegation stubs (15–26 lines) into full orchestration workflows (123–207 lines).

| Command | Before (lines) | After (lines) | Change |
|---------|----------------|---------------|--------|
| `kendo-ui` | 26 | 207 | +697% |
| `kendo-audit` | 16 | 123 | +669% |
| `kendo-migrate` | 23 | 202 | +778% |
| `kendo-test` | 15 | 148 | +887% |
| `kendo-setup` | 130 | 186 | +43% |

### 3.2 Common Patterns Introduced

Every command now follows this structure:

1. **"Never assume" preamble** — instruction to reason at each step
2. **Phased execution** — numbered phases (Explore → Plan → Execute → Report)
3. **Gate-level reasoning** — each gate within a phase has:
   - A clear purpose and agent delegation
   - `> **When to skip:**` block with explicit criteria
   - `> **When to reduce:**` block for partial execution
   - `> **Always required when:**` block for mandatory cases
4. **Persistent Workflow section** — rules for how the workflow applies to subsequent requests in the same conversation
5. **Agent references use `kr-*` names** — no skill references in commands; commands only delegate to agents

### 3.3 Per-Command Analysis

#### kendo-ui (primary orchestrator)

**Before**: 5 rigid gates — CHECK SETUP → INVOKE kendo-developer → INVOKE kendo-tester → FIX ISSUES → INVOKE kendo-custom-stylist. "Never skip a gate."

**After**: 4 phases with 6 gates per task:
- **Phase 0** — Prerequisite check (KendoReact installed?)
- **Phase 1** — Explore codebase (project structure, patterns, state, styling, tests, build)
- **Phase 2** — Plan & decompose with 4 variants: Build, Extend, Style, Composite
- **Phase 3** — Execute tasks with 6 gates:
  - Gate 1: Retrieve context (kr-context-retriever) — skip if reused
  - Gate 2: Implement (kr-developer or kr-custom-stylist based on variant)
  - Gate 3: Browser verification (kr-tester browser mode) — skip for non-renderable
  - Gate 4: Test (kr-tester test mode) — scope varies by variant
  - Gate 5: Fix loop (conditional, up to 3 iterations)
  - Gate 6: Review (kr-reviewer, final task only) — skip for trivial
- **Phase 4** — Report with screenshots
- **Persistent Workflow** — 6 rules for continuation

**Key design decisions**:
- Variant-based routing (Build/Extend/Style/Composite) determines which agents are invoked and which gates apply
- kr-custom-stylist is invoked ONLY for Style-variant tasks, never for Build/Extend
- Browser verification is always required when JSX/CSS changes, always skipped for non-renderable code
- Tests must be created, updated, or fixed to match new requirements — never skipped entirely
- Review is only on the final task, not every task

#### kendo-audit (compliance auditor)

**Before**: 4-line delegation — "Hand off to kendo-reviewer with compliance scope."

**After**: 5 phases:
- **Phase 1** — Explore (scan package.json, all source imports, styling, tests)
- **Phase 2** — Plan (determine which audit tasks apply, skip those with no findings)
- **Phase 3** — Retrieve context (kr-context-retriever for KendoReact equivalents)
- **Phase 4** — Review (kr-reviewer with compliance focus)
- **Phase 5** — Report with remediation table
- Remediation is offered but NEVER auto-executed

**Key design decisions**:
- On follow-up audits, re-scan only new or changed files
- Context retrieval is skipped if the project is fully compliant (nothing to map)
- Review can be skipped if zero violations found AND no KendoReact code exists

#### kendo-migrate (migration orchestrator)

**Before**: 5-line delegation — "Hand off to kendo-migrator."

**After**: 5 phases with 5 gates per wave:
- **Phase 1** — Explore (full project inventory: packages, imports, complexity, styling, state, tests, config)
- **Phase 2** — Plan waves (Wave 0 Foundation → Waves 1–N Components → Final Cleanup)
- **Phase 3** — Execute waves, each with:
  - Gate 1: Context retrieval — skip for Wave 0/Final, reuse across waves
  - Gate 2: Migrate (kr-migrator) — skip for Wave 0/Final (direct execution)
  - Gate 3: Browser verification — skip for Wave 0/Final, required for component waves
  - Gate 4: Validate (build + type check + kr-tester tests + compliance check)
  - Gate 5: Fix loop (conditional, up to 3 iterations)
- **Phase 4** — Final audit (kr-reviewer for cross-wave review)
- **Phase 5** — Report with before/after screenshots

**Key design decisions**:
- Wave 0 (Foundation) skips migration agent, browser verification, and component tests
- Final wave (Cleanup) skips context retrieval and migration agent
- Context is accumulated across waves and reused — only new components trigger fresh retrieval
- Test expectations: migrated → new tests, existing → update, broken → fix

#### kendo-test (test orchestrator)

**Before**: 4-line delegation — "Hand off to kendo-tester with full test suite."

**After**: 4 phases with 3 gates per test task:
- **Phase 1** — Explore test landscape (components, existing coverage, framework, patterns)
- **Phase 2** — Plan with 4 variants: Full suite, Gap fill, Regression, Targeted
- **Phase 3** — Execute tasks:
  - Gate 1: Context retrieval — skip for re-runs, pure re-runs, simple wrappers
  - Gate 2: Test (kr-tester) — always required, scope varies by variant
  - Gate 3: Assess results — always required
- **Phase 4** — Report with defect table; remediation offered but not auto-executed

**Key design decisions**:
- The command does NOT fix application code, only reports defects
- Defect remediation (invoke kr-developer) is always offered, never auto-executed
- For re-runs of unchanged code, exploration and context retrieval can be fully skipped
- Browser verification column added to the report table

#### kendo-setup (bootstrap orchestrator)

**Before**: 9 linear steps — assess → retrieve context → determine theme → install → configure → licensing → TypeScript → example → report.

**After**: 4 phases with per-step reasoning:
- **Phase 1** — Explore & Assess (same scan, but with skip criteria for follow-ups)
- **Phase 2** — Retrieve setup guidance (kr-context-retriever) — skip if adding packages only
- **Phase 3** — Execute Steps 3–8, each with explicit skip criteria:
  - Step 3: Theme — skip if already installed
  - Step 4: Install — skip already-installed packages
  - Step 5: Theme import — skip if exists, replace if different
  - Step 6: Licensing — skip if configured
  - Step 7: TypeScript — skip if not TS or already correct
  - Step 8: Example — skip on package-add-only scenarios
- **Phase 4** — Verify & Report
  - Build check: always required when packages/imports changed
  - Browser verification (kr-tester): required for initial setup and theme changes, skip for package-only additions

**Key design decisions**:
- Agent name updated from `kendo-context-retriever` to `kr-context-retriever`, `kendo-developer` to `kr-developer`, `kendo-reviewer` to `kr-reviewer`
- Browser verification added via kr-tester (was absent before)
- Each step has a "Skip if" condition — first setup runs everything, follow-ups run only what's needed
- Persistent Workflow added for subsequent setup requests

---

## 4. Skills — Decoupling and Reference Extraction

### 4.1 Summary of Changes

| Skill | Lines (before → after) | Nature of Change |
|-------|----------------------|------------------|
| `kendo-e2e` | 320 → 195 | Major — removed test generation, kept DOM inspection core |
| `kendo-react-advanced-styles` | 233 → 233 | Minor — role wording, kendo-tester → kendo-e2e reference |
| `kendo-react-analyzer` | 87 → 81 | Minor — role wording, removed Context Sources table |
| `kendo-react-developer` | 83 → 133 | Major — added Reference Loading section, expanded patterns |
| `kendo-react-getting-started` | 123 → 114 | Minor — role wording, removed Integration section |
| `kendo-react-layout` | 151 → 153 | Minor — added Reference Loading section |
| `kendo-react-migration` | 143 → 133 | Minor — role wording, removed Context Sources table |
| `kendo-react-testing` | 237 → 227 | Moderate — de-branded examples, fixed theme mock patterns |
| `kendo-react-theme` | 195 → 200 | Moderate — added Reference Loading section |

### 4.2 Common Changes Across All Skills

1. **Role → Purpose**: Skills that said "You are a KendoReact [role]" were rewritten to "This skill teaches [what]." This reflects that skills are knowledge packages loaded by agents, not autonomous actors.

2. **Removed "Context Sources" tables**: Tables like `| Context | Covers |` that listed MCP tool capabilities were removed. Skills don't know about MCP tools — that's kr-context-retriever's domain.

3. **Removed "Integration with Other Skills and Agents" sections**: Cross-references like "hand off to kendo-developer" or "kendo-migrator uses this skill" were removed. Skills are standalone knowledge; the wiring is the command's responsibility.

4. **Removed agent-specific references**: References to `kendo-context-retriever` or `kendo-tester` within skills were replaced with generic references like "from injected context" or "via the kendo-e2e skill."

### 4.3 Per-Skill Deep Dive

#### kendo-e2e (DOM inspection & browser automation)

**Before**: A full E2E test generation workflow — 6 steps from "Navigate → Snapshot → Validate selectors → Interact → Generate test file → Deliver test." Included complete test file templates with `@progress/kendo-e2e` imports and `Browser` API usage.

**After**: Stripped down to a pure DOM inspection and interaction toolkit — 6 steps from "Navigate → Snapshot → Validate selectors → Inspect properties → Interact → Close browser." No test generation, no test file templates, no `npm install` instructions.

**Reasoning**: Test generation is kr-tester's responsibility (via the kendo-react-testing skill). The kendo-e2e skill provides browser-level primitives that any agent can use: navigate, snapshot, validate selectors, interact, inspect. The debugging workflow was simplified but retained.

#### kendo-react-developer (implementation patterns)

**Before**: 83-line skill with a brief role, responsibilities list, 4 code examples, and a Context Sources table.

**After**: 133-line skill with:
- **Reference Loading section** — explicit instructions to read files from `references/`:
  - `common-guidelines.md` — architecture and package rules (always)
  - `component-registry.md` — full component list and aliases (always)
  - `datagrid-deprecated.md` — deprecated Grid properties (when using DataGrid)
  - `editor-tools.md` — Editor tool import pattern (when using Editor)
  - `smart-grid.md` — AI Grid setup (when using Smart Grid)
- Expanded implementation patterns (function components, controlled state, TypeScript interfaces, specific imports, data operations, theme import)
- Added Accessibility Rules section
- Added Quality Checklist (6 items)
- Removed Context Sources table

**Reasoning**: The developer skill becomes self-contained with local reference files. Agents loading this skill get everything they need without calling MCP tools for basic component information.

#### kendo-react-testing (test patterns)

**Before**: Examples used KendoReact component names directly (`<Grid>`, `<DropDownList>`, `<Dialog>`, `<Input>`, `<Form>`). Theme imports referenced `@progress/kendo-theme-default`.

**After**: Examples use generic placeholders (`<MyGrid>`, `<MyComponent>`, `<MyDropdown>`, `<MyDialog>`, `<MyInput>`, `<MyForm>`). Theme imports reference `'your-theme-or-css-file.css'`. Partial module mock uses `'some-library'` instead of `'@progress/kendo-react-grid'`.

**Reasoning**: The testing skill is framework-agnostic test patterns that an agent applies with injected context. Hardcoded KendoReact imports in examples could mislead agents into using those exact imports without verifying against current API context.

#### kendo-react-theme (theming)

**Before**: Context Sources table pointing to MCP tools.

**After**: Reference Loading section pointing to local files:
- `references/suite-identity.md` — available themes and package names (always)
- `references/styling-theming.md` — 4 CSS variable application methods (when applying variables)
- `references/icons.md` — SVG/font icon packages and reference (when using icons)

**Reasoning**: Same pattern as developer skill — local reference files replace MCP tool dependencies.

#### kendo-react-layout (layout patterns)

**Before**: Context Sources table.

**After**: Reference Loading section pointing to `references/layout-utilities.md` for CSS utility classes, installation methods, and Card component conventions.

### 4.4 New Reference Files

Three skills gained `references/` directories with static reference material:

| Skill | Reference Files |
|-------|-----------------|
| `kendo-react-developer` | `common-guidelines.md`, `component-registry.md`, `datagrid-deprecated.md`, `editor-tools.md`, `smart-grid.md` |
| `kendo-react-layout` | `layout-utilities.md` |
| `kendo-react-theme` | `suite-identity.md`, `styling-theming.md`, `icons.md` |

These files are loaded by agents at skill-loading time, providing authoritative reference material without requiring MCP tool calls.

---

## 5. Architectural Decisions

### 5.1 Why Rename Agents from `kendo-*` to `kr-*`?

The old naming (`kendo-developer`, `kendo-tester`) was ambiguous — it could refer to agents, skills, or commands since all used the `kendo-` prefix. The `kr-` prefix clearly identifies agents, avoiding confusion with commands (`kendo-*`) and skills (`kendo-react-*`).

### 5.2 Why Remove Skill References from Commands?

Commands previously referenced skills directly (e.g., "The agent uses the **kendo-react-testing skill**"). This creates tight coupling — if a skill is renamed or restructured, commands break. The new model: commands delegate to agents, agents load skills. Commands never mention skills.

### 5.3 Why Add Browser Verification to kr-tester?

Browser verification (navigate → screenshot → DOM snapshot → visual assessment) was previously unowned. Three options were considered:
1. kr-developer does it → mixes implementation and verification concerns
2. A new agent owns it → unnecessary agent proliferation
3. kr-tester owns it → natural fit since kr-tester already loads the kendo-e2e skill

kr-tester gained "browser verification" as a 5th test mode that produces a verification report (not test files).

### 5.4 Why "Never Assume, Always Reason"?

The original commands said "Never skip a gate." In practice, this caused unnecessary work — e.g., retrieving context for components already retrieved, running browser verification on TypeScript-only changes, or reviewing a single CSS property change. The "reason at each step" model:
- Defines explicit skip/reduce criteria at every gate
- Requires documented justification when skipping
- Preserves the workflow as the default path — deviations are exceptions, not the norm

### 5.5 Why Persistent Workflow?

Commands are conversation-scoped. Without explicit continuation rules, a second user request within the same conversation would re-run the entire workflow from scratch. The Persistent Workflow section tells the orchestrating command to:
- Carry forward prior exploration, context, and created files
- Skip already-completed steps
- Continue task numbering
- Reason about what needs re-execution vs. what can be reused

### 5.6 Why Enforce Explicit Subagent Delegation? (Fix A + B + C)

**Problem observed**: When the `kendo-ui` command was executed, the orchestrator performed styling and testing work inline instead of delegating to `kr-custom-stylist` and `kr-tester` as separate subagents. Three root causes were identified:

1. **Language ambiguity** — Commands used "Invoke the kr-tester agent" which the LLM interpreted as "do what that agent would do" rather than "spawn a separate subagent." Without explicit delegation language, the orchestrator absorbed the work.

2. **Capability overlap in kr-developer** — The kr-developer agent's self-check step included browser verification (loading `kendo-e2e` skill, navigating, taking screenshots). This gave the orchestrator a reason to skip kr-tester's browser verification gate ("kr-developer already did this"). Similarly, kr-developer loaded the `kendo-react-theme` skill, overlapping with kr-custom-stylist's domain.

3. **No orchestrator boundary** — The command said "you are the orchestrator" but never prohibited the orchestrator from doing implementation, testing, or styling work directly. Without an explicit constraint, the LLM optimized for efficiency by doing work inline.

**Three fixes applied**:

- **Fix A — Delegate-only constraint**: Added to all 5 commands: *"You are strictly an orchestrator. You MUST delegate all implementation, testing, styling, and review work to the appropriate subagent. You never write code, tests, or CSS yourself. You never load skills directly."*

- **Fix B — Explicit delegation language**: Replaced all "Invoke the **kr-X** agent" with "Delegate to the **kr-X** subagent." Replaced all "Re-invoke" with "Re-delegate." The word "delegate" combined with "subagent" makes the spawning mechanism unambiguous.

- **Fix C — Scoped browser verification in kr-developer**: Changed kr-developer's self-check step 7 from unconditional browser verification to: *"Browser verification (standalone only) — When invoked directly by a user (not as a subagent of a command workflow like kendo-ui), perform browser verification. When invoked as a subagent by a command, skip this step — browser verification is handled separately by kr-tester."* This eliminates the overlap that let the orchestrator skip kr-tester.

---

## 6. File-by-File Change Matrix

### Agents

| File | Status | Key Changes |
|------|--------|-------------|
| `agents/kendo-developer.md` | **Deleted** | Replaced by `developer.md` |
| `agents/kendo-tester.md` | **Deleted** | Replaced by `tester.md` |
| `agents/kendo-reviewer.md` | **Deleted** | Replaced by `reviewer.md` |
| `agents/kendo-migrator.md` | **Deleted** | Replaced by `migrator.md` |
| `agents/kendo-context-retriever.md` | **Deleted** | Replaced by `context-retriever.md` |
| `agents/kendo-custom-stylist.md` | **Deleted** | Replaced by `custom-stylist.md` |
| `agents/developer.md` | **New** | `kr-developer` — skill loading, 7-step process, security review, browser verification scoped to standalone-only (Fix C) |
| `agents/tester.md` | **New** | `kr-tester` — 5 test modes (added browser verification), test-only scope |
| `agents/reviewer.md` | **New** | `kr-reviewer` — 7-step review, security review, severity-based fix model |
| `agents/migrator.md` | **New** | `kr-migrator` — 9-step migration, per-wave validation, security review |
| `agents/context-retriever.md` | **New** | `kr-context-retriever` — refined output format, stricter execution rules |
| `agents/custom-stylist.md` | **New** | `kr-custom-stylist` — loads kendo-e2e skill, 7-step process |
| `agents/*.BAK` | **New** | Backup copies of original agents |

### Commands

| File | Status | Key Changes |
|------|--------|-------------|
| `commands/kendo-ui.md` | **Modified** | 26→209 lines. 4-phase orchestrator with 6 gates, 4 variants, reasoning checkpoints, delegate-only constraint (Fix A), subagent delegation language (Fix B) |
| `commands/kendo-audit.md` | **Modified** | 16→125 lines. 5-phase compliance auditor, remediation offered not auto-executed, delegate-only + subagent language |
| `commands/kendo-migrate.md` | **Modified** | 23→204 lines. 5-phase wave-based migration, per-wave gates, before/after screenshots, delegate-only + subagent language |
| `commands/kendo-test.md` | **Modified** | 15→150 lines. 4-phase test orchestrator, 4 variants, defect reporting, delegate-only + subagent language |
| `commands/kendo-setup.md` | **Modified** | 130→188 lines. 4-phase setup with per-step skip criteria, browser verification, delegate-only + subagent language |

### Skills

| File | Status | Key Changes |
|------|--------|-------------|
| `skills/kendo-e2e/SKILL.md` | **Modified** | 320→195 lines. Removed test generation; retained DOM inspection + debugging |
| `skills/kendo-react-advanced-styles/SKILL.md` | **Modified** | Role → Purpose wording; `kendo-tester` → `kendo-e2e` reference |
| `skills/kendo-react-analyzer/SKILL.md` | **Modified** | Role → Purpose; removed Context Sources table |
| `skills/kendo-react-developer/SKILL.md` | **Modified** | 83→133 lines. Added Reference Loading; expanded patterns and checklist |
| `skills/kendo-react-getting-started/SKILL.md` | **Modified** | Role → Purpose; removed Integration section |
| `skills/kendo-react-layout/SKILL.md` | **Modified** | Added Reference Loading; removed Context Sources |
| `skills/kendo-react-migration/SKILL.md` | **Modified** | Role → Purpose; removed Context Sources table |
| `skills/kendo-react-testing/SKILL.md` | **Modified** | De-branded examples; generic component/theme placeholders |
| `skills/kendo-react-theme/SKILL.md` | **Modified** | Added Reference Loading with 3 reference files |

### New Reference Files

| File | Parent Skill | Content |
|------|-------------|---------|
| `references/common-guidelines.md` | kendo-react-developer | Architecture and package installation rules |
| `references/component-registry.md` | kendo-react-developer | Full component list with package mappings and aliases |
| `references/datagrid-deprecated.md` | kendo-react-developer | Deprecated DataGrid properties and modern replacements |
| `references/editor-tools.md` | kendo-react-developer | Editor tool import pattern |
| `references/smart-grid.md` | kendo-react-developer | AI-powered Grid (GridToolbarAIAssistant) setup |
| `references/layout-utilities.md` | kendo-react-layout | CSS utility classes, installation, Card conventions |
| `references/suite-identity.md` | kendo-react-theme | Available themes and package names |
| `references/styling-theming.md` | kendo-react-theme | 4 methods for CSS variable application |
| `references/icons.md` | kendo-react-theme | SVG/font icon packages and common icon reference |
