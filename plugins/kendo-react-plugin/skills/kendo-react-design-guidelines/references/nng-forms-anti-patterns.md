# Forms Anti-Patterns

> Source: Nielsen Norman Group research on form design, input usability, and error handling.
> Cross-check against these during Phase B (Design Review).

---

## ❌ No Required Field Indicators

**Why it's wrong:** Users cannot tell which fields must be filled before submission.
They attempt to submit incomplete forms and only discover validation errors after the
round-trip, increasing frustration and abandonment.

**Correct approach:** Mark required fields visibly — an asterisk (*) next to the label
is the universally understood convention. Add a legend near the form: "* Required field".

---

## ❌ Including a Reset / Clear Form Button

**Why it's wrong:** A single accidental click destroys all entered data with no undo.
Users almost never intentionally reset an entire form, but they frequently mis-click
buttons that are adjacent to "Submit" or "Save".

**Correct approach:** Remove reset buttons from all forms. If clearing is a genuine
workflow requirement, require explicit confirmation:

```
Clear form? This will remove all entered data.
[Clear form]   [Cancel]
```

---

## ❌ Error Messages Positioned Far From the Offending Input

**Why it's wrong:** When an error is surfaced only at the top of a long form after
submission, users must scroll and cross-reference to identify which field is wrong.
This significantly increases the perceived cost of correcting mistakes.

**Correct approach:** Show inline validation errors directly below the offending field
(within 8px), in error-state color paired with an error icon. Use `aria-describedby`
to programmatically associate the error message with the input for screen readers.

---

## ❌ Overloading Forms With Excessive Fields

**Why it's wrong:** Each additional field reduces completion rates. Users abandon forms
that appear long or complex, especially on mobile. Fields that are not immediately
necessary undermine the perceived simplicity of the task.

**Correct approach:** Show only the fields required for the current step. Use progressive
disclosure — reveal optional or contextually relevant fields only when needed. Split very
long forms into clearly labelled multi-step flows with a step indicator.
