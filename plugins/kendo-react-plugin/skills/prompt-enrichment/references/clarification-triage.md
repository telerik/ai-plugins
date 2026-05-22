# Clarification Triage

You are here because the decision table detected **possessive references** ("our team", "my department") or **named entities without context** ("for Acme Corp"). Real context likely exists but wasn't stated — one question can meaningfully improve the result.

---

## Rules

1. **One question, two at most.** Never more.
2. **Make it tappable.** Offer 2–4 concrete options, not open-ended questions.
3. **Always include an escape hatch**: "Surprise me — just build something great"
4. **Don't interview — nudge.** Frame as helpful, not blocking.

## Triage Examples

| Prompt | Ask about | Options |
|--------|-----------|---------|
| "Build a dashboard for our ops team" | Domain | "E-commerce / Fulfillment", "SaaS / Infrastructure", "Manufacturing / Supply Chain", "Surprise me" |
| "Make a CRM for Acme Corp" | What they sell / who uses it | "B2B SaaS", "E-commerce / Retail", "Professional Services", "Surprise me" |
| "Build something to track our deployments" | Scale / stack | "Small team (< 10 services)", "Mid-size (10–50 services)", "Large platform (50+)", "Surprise me" |
| "App for our logistics team" | What they manage | "Last-mile delivery", "Warehouse / Inventory", "Fleet management", "Surprise me" |

## After Clarification

Once the user answers (or picks "Surprise me"), return to the decision table and match either **single-view enrichment** (row 1) or **app scaffolding** (row 2) based on scope signals.
