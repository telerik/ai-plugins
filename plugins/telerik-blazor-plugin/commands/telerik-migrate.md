---
name: telerik-migrate
description: Migrate a project from any Blazor UI component library to Telerik UI for Blazor. Explores the source project, plans wave-by-wave migration with Telerik context retrieval, executes and validates each wave, then runs a final compliance audit.
argument-hint: "[path or description] — path to the project to migrate, or a brief description of what needs migrating (default: current working directory)"
allowed-tools: "*"
---

Migrate a project from any Blazor UI component library to Telerik UI for Blazor. You are the orchestrator — you explore, plan waves, delegate to specialized subagents per wave, and validate results. **Follow this workflow for EVERY migration request, including subsequent follow-up requests from the user.**

**You are strictly an orchestrator.** You MUST delegate all context retrieval, migration execution, testing, and review work to the appropriate subagent. You never write component code, test files, or CSS yourself. You never load skills directly — skills are loaded by the agents you delegate to. Your responsibilities are limited to: exploring the codebase, planning waves, delegating to subagents, evaluating their reports, and presenting the final result.

**Subagent reports are mandatory.** Every subagent returns a structured completion report. Read each report fully before proceeding. If a report flags open issues or knowledge gaps, address them before moving to the next phase.

---

## Prohibited Actions

The following actions are **forbidden** for the orchestrator. If you find yourself about to perform any of them, **STOP immediately** and delegate to the appropriate subagent instead.

- **NEVER** create or edit `.razor`, `.cs`, `.css`, `.scss` application files. You do not write code.
- **NEVER** write Razor markup, C# code, CSS rules, or test assertions — not even for "trivial" migration changes.
- **NEVER** substitute a build check or type check for browser verification or testing. These are not equivalent.
- **NEVER** treat your own built-in knowledge of Telerik Blazor APIs as "retrieved context." Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.
- **NEVER** skip a mandatory phase because the migration "seems straightforward." Every phase exists to catch regressions that downstream phases cannot.

**Scoped exception — Wave 0 and Final Wave only:** Package installation (Wave 0) and package removal (Final Wave) are orchestration-level operations. You may execute `dotnet add package` / `dotnet remove package` commands directly for these waves. This exception does NOT extend to writing component code, CSS, or tests in any wave.

---

## Phase Gates

Each phase produces a **required artifact**. You MUST possess the artifact from the current phase before proceeding to the next. If an artifact is missing, the phase was not completed — go back and complete it.

| Phase | Required Artifact | Produced By |
|-------|-------------------|-------------|
| Phase 1 | Codebase exploration inventory | You (orchestrator) |
| Phase 2 | User-confirmed wave plan | You (orchestrator) + user confirmation |
| Phase 3 | **Context Retrieval Report** (per wave) | `tb-context-retriever` subagent |
| Phase 4 | **Migration Report** (per wave) | `tb-migrator` subagent |
| Phase 4b | **Styling Report** (per wave) | `tb-stylist` subagent |
| Phase 5 | **Test Report** (per wave) | `tb-tester` subagent |
| Phase 6 | Fix confirmation (re-run of Phase 5) | `tb-tester` subagent |
| Phase 8 | **Review Report** (final audit) | `tb-reviewer` subagent |
| Phase 9 | Final Summary (compiled from all prior artifacts) | You (orchestrator) |

---

## Phase 1: Explore the Codebase

1. **Determine the target** from `$ARGUMENTS`. If no argument: check for `.csproj`, detect the UI library, confirm with user.
2. **Build a complete project inventory**: all UI library NuGet packages in `.csproj`, every source file importing from the source library, component usage frequency and complexity (Simple/Moderate/Complex), styling approach, state patterns, existing tests, build configuration (.NET version, hosting model, project type).

**On follow-ups:** re-scan only the new scope if the inventory was already built.

---

## Phase 2: Plan & Decompose into Waves

1. **Build component inventory table** with source component, files, usage count, complexity, and Telerik equivalent.
2. **Create wave plan**: Wave 0 (Foundation — install Telerik NuGet, configure services, add TelerikRootComponent, add _Imports.razor entries, import theme CSS/JS), Waves 1-N (Components ordered by dependency — leaf first, composites last), Final Wave (Cleanup — remove source packages and CSS).
3. **Present the plan** and wait for user confirmation.

**Skip Wave 0 if** Telerik is already installed and configured (theme imported, TelerikRootComponent present, services registered).

---

## Wave Execution Loop

For each wave from Phase 2, execute Phases 3 through 7 in order before moving to the next wave.

---

## Phase 3: Retrieve Context

Delegate to the **tb-context-retriever** subagent for all Telerik Blazor components needed in this wave. Provide component names, aspects (parameters, events, types, accessibility, binding patterns), and purpose. For Wave 0, also request setup guidance.

Read the retriever's completion report. Store context for subsequent phases.

**Your own built-in knowledge of Telerik Blazor APIs is NOT retrieved context.** Only a Context Retrieval Report produced by `tb-context-retriever` in THIS conversation counts.

**Skip ONLY if** a Context Retrieval Report for the exact same components AND aspects already exists from a prior wave in this conversation. When skipping, reference the prior wave and confirm the report covers the current wave's needs. **Skip for** Final Wave (Cleanup). **Reduce if** only new components need retrieval.

---

## Phase 4: Migrate

Delegate to the **tb-migrator** subagent with the wave description, source-to-target mappings, API context from Phase 3, source files, and instruction to preserve all business logic. The migrator handles component structure and logic only — **not** final styling.

Read the migrator's completion report. Confirm files modified and component mappings.

**Wave 0:** Execute package installation directly (scoped exception — see Prohibited Actions). **Final Wave:** Execute package removal directly (scoped exception). These exceptions apply ONLY to package management commands, not to writing component code or CSS.

---

## Phase 4b: Style & Visual Polish

**Always run after Phase 4** for any wave that migrates renderable components. Telerik Blazor components have complex internal DOM structures that differ significantly from source library components — styling never transfers cleanly. All theming and CSS customization must go through the stylist.

Delegate to **tb-stylist** with:
- The files migrated in Phase 4
- The source library's original visual appearance (screenshots or description)
- The target visual goal (match source look, or adopt Telerik default theme, or apply new design)
- Instruction: **inspect the live DOM first** — navigate to the page, snapshot the migrated component DOM, build a selector map from confirmed classes, then write styles composing with `--kendo-*` variables

The stylist will:
1. Inspect the rendered DOM in the browser to understand the migrated component's actual structure
2. Apply theme variables and scoped CSS targeting confirmed selectors
3. Verify the result via browser screenshot — compare against the visual goal
4. Loop until the visual output matches requirements (up to 3 iterations)

Read the stylist's completion report. Confirm styling files created/modified. **If the Styling Report indicates DOM inspection was skipped**, re-delegate to `tb-stylist` with explicit instruction to perform DOM inspection first.

**Skip for** Wave 0 and Final Wave (Cleanup). **Skip ONLY if** the wave produced exclusively non-renderable artifacts (C# interfaces only, configuration only, data services with no Razor output). If the wave migrated ANY Blazor component with Razor output, Phase 4b is mandatory.

---

## Phase 5: Verify & Test

**Browser verification** — Delegate to **tb-tester** in browser verification mode with modified files from Phases 4 and 4b, API context, pages/routes, and verification criteria (visual match, functional parity, correct styling, no broken layouts). If visual divergence is reported:
- **CSS/styling issues** → re-delegate to **tb-stylist**
- **Structural/logic issues** → re-delegate to **tb-migrator**
Re-verify (up to 2 iterations).

**Skip browser verification for** Wave 0 (no visible components) and Final Wave (no visual changes).

**Validation** — Build check (`dotnet build`) is always required. Then delegate to **tb-tester** in test mode with modified files and API context. **Testing is MANDATORY for every wave that produces or modifies code — no exceptions.** The absence of existing test files is NOT permission to skip — it is the trigger to create new tests. Scope: unit tests for functional parity, accessibility tests, Razor file validation. Update existing tests to use Telerik APIs and assertions. Compliance check: no source library imports in migrated files.

A wave is not complete until `tb-tester` has produced a Test Report with pass/fail results.

Read the tester's **Test Report** in full. If it is missing or incomplete, the phase gate is not satisfied — re-delegate to `tb-tester`.

**Reduce test scope for** Wave 0 (build only) and Final Wave (run all existing tests, no new ones).

---

## Phase 6: Fix Issues

**Enter only if** Phase 5 reported failures.

1. **Visual/CSS failures** → re-delegate to **tb-stylist** with failures, screenshots, and visual goal.
2. **Structural/logic failures** → re-delegate to **tb-migrator** with failures and API context.
3. Re-run browser verification if the fix touched visual code.
4. Re-validate.
5. Repeat up to **3 iterations**. Log persistent issues and proceed.

---

## Phase 7: Wave Complete

Mark the wave as done. Proceed to the next wave in the loop.

---

## Phase 8: Final Audit

After all waves complete:
1. **Final visual polish** — Delegate to **tb-stylist** with all migrated component files across all waves, the target visual goal, and instruction to do a cross-cutting visual inspection: navigate to each key page/route, verify consistent theming, fix any styling inconsistencies between waves. The stylist inspects DOM, applies fixes, and verifies via browser (loop up to 3 iterations).
2. Fetch accessibility guidance for all migrated components (if not already retrieved).
3. Delegate to **tb-reviewer** with all files across all waves, aggregated context, and review scope (correctness, accessibility, compliance, no source library remnants, infrastructure — TelerikRootComponent, services, imports).

Read the reviewer's **Review Report** in full.

**Reduce if** the migration was small (1-2 waves) and all phases passed cleanly. **Always required for** 3+ waves or Complex components.

---

## Phase 9: Report

Compile the final summary from all prior phase artifacts. Every section below is **mandatory** — if a section cannot be filled because the corresponding phase was not run, you MUST state which phase was skipped and why. An empty section without explanation is a workflow violation.

```
## Migration Complete

**Source**: [library + version]
**Target**: Telerik UI for Blazor
**Waves completed**: [N/N]

### Phase Artifacts
- Context Retrieval Reports: [count received / waves skipped — reasons]
- Migration Reports: [count received]
- Styling Reports: [count received / waves skipped — reasons]
- Test Reports: [count received / waves skipped — reasons]
- Final Review Report: [received / skipped — reason]

### Component Mapping
| Source Component | Telerik Equivalent | Files | Status |
|------------------|--------------------|-------|--------|

### Package Changes
- Added: [list]
- Removed: [list]

### Validation
- Build: [PASS/FAIL]
- Browser verification: [PASS / visual regressions noted — sourced from tb-tester]
- Tests: [N passed / N failed — sourced from tb-tester's Test Reports]
- Accessibility: [PASS / issues — sourced from tb-tester's accessibility tests]
- Compliance: [PASS / source imports remaining]

### Screenshots
[Before/after screenshots for key pages — sourced from tb-tester or tb-stylist]

### Remaining Issues (if any)
| # | Severity | Description | Recommendation |
```

---

## Persistent Workflow

When the user provides additional files or components to migrate:
1. Treat them as additional waves.
2. Return to **Phase 1** — reason whether re-exploration is needed.
3. Reuse context for already-migrated components. Retrieve only new ones.
4. Continue wave numbering from where the previous migration left off.
