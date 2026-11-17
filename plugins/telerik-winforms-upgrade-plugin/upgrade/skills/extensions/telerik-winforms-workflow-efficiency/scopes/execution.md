# Telerik WinForms Execution Handoffs

Honor the host's research, decomposition, validation, and review gates. The
one Telerik-specific exception is the build gate: it is **0 errors and no
blocking `TKL*` diagnostics**, not a warning-free build. Follow
`telerik-winforms-migration-verification`'s **Warning Policy**, which replaces
the host's "fix every warning" and "warning-free" rules for Telerik scenarios.

- Treat a build with warnings only as a pass with known issues. For a warning
  the policy classes as report-only (for example `MSB3277` after adding a
  Telerik package), never return `STATUS: blocked`, dispatch the error-fixer or
  BreakGlass, research a fix, or suppress it. Record it under **Known issues**
  in `progress-details.md` and return `STATUS: ready`. `blocked` is for a
  missing capability or a blocking error, not a warning.
- Read the assessment and latest relevant progress first. Reuse confirmed
  solution/project paths, package versions, license mechanism, and build tool;
  verify only facts that the current task could have invalidated. Record any
  correction in `scenario-instructions.md` so later workers see it.
- Before running checks, compare existing evidence with this task's scope,
  configuration, toolchain, and build-relevant inputs. Reuse a matching
  successful check, citing its command/result; never describe reuse as a new
  run. Restore after package/configuration changes, not merely a new task.
- Keep Q1 2025+ activation verification explicit. Reuse only a build against
  the target packages with unchanged license inputs and recorded TKL results.
  Package presence or the MCP license preflight alone does not prove activation.
- Load `telerik-winforms-component-guidance` once for uncertain Telerik APIs;
  do not repeat skill discovery for variants of the same compiler error.
  Keep the converter's required per-item queries sequential.
- Include original file/backup paths, exact modified files, and any concrete
  risk in the initial review dispatch. Request a `review.md` record even on a
  clean first pass; do not dispatch a second review while one is still active.
- Append a compact handoff: changes, exact check commands/results, reused
  evidence, open runtime checks, and review verdict/path. Report the exact
  operation/tool and error when blocked; elapsed waiting alone is not a failure.
- Workers do not call host lifecycle tools. Return the result so the host can
  complete the task; a passing build alone does not complete workflow state.
