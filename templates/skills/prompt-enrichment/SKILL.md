---
name: prompt-enrichment
description: Expand vague or minimal UI requests into rich, specific design briefs before generating {{family}} components. Trigger whenever a user asks to build ANY kind of user interface using {{family}}, and the request lacks specific layout, data, or component details — dashboards, apps, forms, portals, landing pages, e-commerce views, social feeds, chat interfaces, settings screens, onboarding flows, or any other UI. Skip when the user already provides a detailed spec. This skill decides WHAT to build; the {{family}} design/styling skill decides HOW to style it.
---

# Prompt Enrichment

Short or generic UI prompts produce bland, generic layouts with placeholder data. This skill expands any vague {{family}} UI request into a detailed design brief before code is written.

## Decision Table

This is the single source of truth for picking a pattern. Each row lists the trigger signals, the deliverable, the pattern name, and the reference to load for full instructions. Reference files do **not** repeat trigger criteria — they are loaded only after the pattern has been picked here.

| Pick this pattern when... | The deliverable is... | Pattern | Reference |
|---|---|---|---|
| The prompt is vague or generic (under ~30 words, no layout/data/component specifics, generic terms like "dashboard", "page", "app"). The user wants a UI but hasn't said what's in it. | A detailed design brief: user role, information architecture, spatial layout with dimensions, {{family}} component plan, realistic sample data, density/tone, and interaction spec. | Single-view enrichment | `references/enrichment-dimensions.md` |
| The prompt targets a multi-view application (signals: "app", "system", "platform", "portal", multiple features, workflows spanning screens). Multiple screens need shared architecture. | An app scaffold (identity, roles, view map, navigation, data model, visual identity) + a design brief for the first view. | App scaffolding | `references/app-scaffolding.md` |
| The prompt contains possessive references ("our team", "my data") or named entities without context ("for Acme Corp"). Real context exists but wasn't stated. | 1–2 targeted clarifying questions with tappable options + escape hatch, followed by enrichment or scaffolding. | Clarification triage | `references/clarification-triage.md` |
| The user already provides a detailed spec — specific components, data fields, layout instructions, and content. Nothing is vague. | No enrichment needed. Build directly. | Skip | — |
| You need to select a spatial layout pattern for any view (during enrichment or scaffolding). | A specific layout pattern with spatial structure, {{family}} components, and "when NOT to use" guidance. | Layout selection | `references/layout-patterns.md` |

If a prompt does not clearly match any row, **default to single-view enrichment** — it's the safest starting point. If both row 1 and row 2 match (vague prompt + app scope), run **app scaffolding** first, then enrich the primary view.

## Core Principles

1. **Specificity produces better UIs.** A concrete user role + realistic data + explicit spatial layout always outperforms a generic prompt — even when the scenario is fictional.
2. **Enrich any UI type.** This skill covers dashboards, e-commerce pages, chat interfaces, settings screens, onboarding wizards, social feeds, media galleries, landing pages — not only business dashboards.
3. **Layout must be spatially explicit.** Never just name a pattern ("List-Detail"). Describe panel widths, what's above/below the fold, column/row structure, fixed vs. scrollable regions.
4. **Data must be realistic.** Never use "[placeholder]" or "Data 1". Invent plausible names, amounts, dates, and cross-component relationships.
5. **Don't duplicate implementation.** Defer to {{family}} Agentic UI Generator assistants (`#{{assistantPrefix}}_component_assistant`, `#{{assistantPrefix}}_layout_assistant`, etc.) for API usage, code, and theming. This skill produces the design brief they consume.

## Brief Format

Every enrichment — whether single-view or per-view within an app — produces a brief in this shape:

```
## Design Brief: [Descriptive Title]

**User**: [Role + context, 1–2 sentences]
**Primary Task**: [What they do on this screen]
**Layout**: [Pattern name + spatial description with dimensions/ratios]
**Density**: [High/Medium/Low] | **Tone**: [Descriptor]

### Component Plan
1. [Name] — [{{family}} component] — [What it shows, with sample values]
2. ...

### Key Interactions
- [What happens on click/filter/selection]

### Sample Data
[Field names, types, 3–5 realistic rows per component]
```

The brief stays internal unless the user asks to see it. Present the plan conversationally, get confirmation, then build.
# SMOKE TEST MODIFICATION
# SMOKE TEST MODIFICATION
