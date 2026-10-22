# Execution Stage — Telerik WinForms Licensing

Execute the plan's tasks by delegating to the named lazy skills. Do not
inline their logic here.

## General Rules

1. Never fabricate, guess, or fill in a license key, script key, or account
   credential — every task that needs one directs the customer to their
   Telerik account.
2. Warn before writing any secret material (a real key, script key value, or
   generated file containing one) into a location that could reach a public
   repository (project root without `.gitignore` coverage, a committed
   pipeline file, etc.).
3. Do not invoke `telerik-winforms-license-nuget-migration` unless the plan
   actually added that task — skip inapplicable steps rather than running
   them as no-ops.

## Task-Specific Guidance

### Setup Tasks

Delegate to `telerik-winforms-license-key-setup` with the project list and
detected entry-point shape. It decides NuGet-based vs. script-key vs. hybrid
per its own *Choose the Method* logic — do not pre-decide this here.

### Diagnostics Tasks

Delegate to `telerik-winforms-license-diagnostics` with the exact symptom or
code text. Apply only the fix skill it names — do not improvise a fix for an
unmatched symptom; report it as undocumented instead.

### Migration Tasks

Delegate to `telerik-winforms-license-nuget-migration` only for projects
where the customer accepted the offer and the exception check passed. Run
its full sequence (add NuGet mechanism → remove script-key artifact →
binding-redirect check → verify) — do not stop partway.

### Verification

Always run `telerik-winforms-license-verification` last, regardless of which
other tasks ran — including when assessment found nothing to do, to confirm
that "nothing to do" was actually correct.

## Error Handling

If a build still fails or shows a `TKL*` code after a task completes,
re-run `telerik-winforms-license-diagnostics` with the new symptom rather
than guessing at a second fix.
