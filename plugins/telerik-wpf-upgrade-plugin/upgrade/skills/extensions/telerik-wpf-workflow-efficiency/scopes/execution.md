# Telerik WPF Execution Handoffs

Honor the host's research, decomposition, validation, and review gates. The
one Telerik-specific exception is the build gate: it is **0 errors (including
XAML compile errors) and no blocking `TKL*` diagnostics**, not a warning-free
build. Follow `telerik-wpf-migration-verification`'s **Warning Policy**, which
replaces the host's "fix every warning" and "warning-free" rules for Telerik
scenarios.

- Treat a build with warnings only as a pass with known issues. For a warning
  the policy classes as report-only (for example `MSB3277` after adding a
  Telerik package), never return `STATUS: blocked`, dispatch the error-fixer or
  BreakGlass, research a fix, or suppress it. Record it under **Known issues**
  in `progress-details.md` and return `STATUS: ready`. `blocked` is for a
  missing capability or a blocking error, not a warning.
- Read the assessment and latest relevant progress first. Reuse confirmed
  solution/project paths, Telerik version, Xaml/NoXaml flavor, license
  mechanism, and build tool. Verify facts the current task could invalidate;
  record corrections in `scenario-instructions.md` for later workers.
- Reuse a successful check only when its scope, configuration, toolchain, and
  build-relevant inputs match. Cite its command/result as reused evidence.
  Restore after package/configuration changes, not merely a new task. Theme
  dictionary or copied-XAML changes require fresh affected validation.
- Keep Q1 2025+ activation verification explicit. Reuse only a target-version
  build with unchanged license inputs and recorded TKL results; package
  presence or the MCP preflight alone does not prove activation.
- Load `telerik-wpf-component-guidance` once for uncertain Telerik APIs; do
  not repeat skill discovery for variants of the same XAML/compiler error.
- Include original file/backup paths, exact modified files, and concrete risks
  in the initial review dispatch. Request `review.md` even on a clean first
  pass; do not dispatch a second review while one is active.
- Append a compact handoff: changes, exact check commands/results, reused
  evidence, open runtime/theming checks, and review verdict/path. When blocked,
  name the exact operation/tool and error; waiting alone is not a failure.
- Workers do not call host lifecycle tools. Return the result so the host can
  complete the task; a passing build alone does not complete workflow state.
