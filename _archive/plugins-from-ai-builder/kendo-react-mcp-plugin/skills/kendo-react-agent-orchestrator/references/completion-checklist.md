# Completion Checklist Reference

Use this reference before final response.

## Checklist

- [ ] All active shards retrieved; `BLOCKED` shards recorded as warnings.
- [ ] React static guidance is represented in context briefs or dispatch notes: UX guidelines, common component guidelines, DataGrid/Editor/Smart Grid guidance when relevant, layout conventions, theme application methods, WCAG baseline, and validation rules.
- [ ] `layout-contract.md` written with prompt requirements and referenced from `dispatch-plan.md`.
- [ ] `dispatch-plan.md` written with brief index, section hints, static guidance index, layout contract summary, and autonomous developer acceptance criteria.
- [ ] Developer dispatched with an autonomous task contract; leading JSON status block and `Developer self-check` present for every developer report.
- [ ] Developer non-green states and batched loop requests resolved or recorded as explicit non-blocking warnings before validation.
- [ ] `files_to_check` and `developer_self_check` built from execution outputs before tester.
- [ ] Tester consumed developer self-check data and skipped duplicate source/static/build checks only when final and passed; runtime smoke, a11y smoke, browser checks, and tests remained tester-owned.
- [ ] Tester returned `GREEN` before audit was dispatched for each required scope.
- [ ] Audit returned `DONE` for all required scopes, or an explicit audit-skip caveat was recorded.
- [ ] Fix loop closed all tester `BLOCKED` states and post-green audit findings with targeted tester-first reruns.
- [ ] Any `BLOCKED` shards, external blockers, or unresolved `NEEDS_CONTEXT` states surfaced in final answer.

## Final Report Guidance

Keep the final answer short. Include what changed, whether tester/audit completed cleanly, warnings, accepted non-blocking concerns, and unresolved follow-up.