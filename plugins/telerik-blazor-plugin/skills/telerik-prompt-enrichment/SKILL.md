---
name: kendo-prompt-enrichment
description: Expand vague or minimal UI requests into rich, specific design briefs before generating Kendo/Telerik components. Trigger this skill whenever the user asks to build a dashboard, admin panel, data grid, form, reporting interface, or any business application using Kendo, Telerik, or KendoReact — especially when the prompt is short, generic, or lacks design specifics. Also trigger when the user says things like "create a dashboard", "build me an admin page", "make a CRM view", "sales overview", "create a project management app", "build an HR system", or any brief business-UI request that would benefit from elaboration before code generation. Handles both single-view requests (a dashboard, a page) and full multi-view app scaffolding (an app, a system, a platform). This skill runs BEFORE the Kendo design/styling skill — it decides WHAT to build; the design skill decides HOW to style it.
---

# Kendo Prompt Enrichment

When a user gives a short or generic prompt for a Kendo-based interface (e.g., "create a business dashboard" or "build a project management app"), the default output tends to be a bland, generic layout with placeholder data and no clear design intent. This skill fixes that by expanding the prompt into a detailed design brief before any code is written. It handles two scopes: **single-view** requests (a dashboard, a page, a form) and **multi-view app** requests (a full application with navigation, multiple screens, and shared data models).

## When to Enrich

Enrich the prompt when ANY of these are true:
- The request is under ~30 words
- No specific data types, metrics, or content are mentioned
- No layout structure is described
- No user role or workflow context is given
- The request uses generic terms like "dashboard", "admin panel", "overview", "report"

Skip enrichment when the user has already provided a detailed spec with specific components, data fields, layout instructions, and content.

## Step 0: Clarify or Invent?

Before enriching, make a quick triage decision: would asking the user 1–2 targeted questions produce a meaningfully better result, or can you invent a compelling scenario entirely on your own?

### When to ask (briefly)

Ask when the user has **hinted at specifics without providing them** — signals that real context exists but wasn't stated. Look for:

- **Possessive references**: "our team", "my department", "the company's data" — implies a real domain you can't guess well
- **Named entities without context**: "for Acme Corp", "for the marketing team" — a name without enough to go on
- **Ambiguous scope**: "inventory management" could mean 50 SKUs in a boutique or 2M SKUs in a warehouse — and the UI pattern changes drastically

When you do ask, follow these rules:

1. **One question, two at most.** Never more.
2. **Make it tappable.** Use the `ask_user_input` tool with 2–4 concrete options so the user can answer with a single tap, not a paragraph. Example: "What kind of data does your team track?" → options: "Sales & Revenue", "Engineering & DevOps", "HR & People", "Something else"
3. **Always include an escape hatch.** One option should be something like "Surprise me — just build something great" so the user can skip the question entirely.
4. **Don't interview — nudge.** The question should feel like a helpful suggestion, not a blocker. Frame it as: "Quick question so I can tailor this — or I can just build something great if you'd prefer."

### When to just invent

Invent the full scenario when:

- The prompt is **purely generic** with no personal context clues: "create a dashboard", "make an admin panel", "build a reporting page" — there's nothing to clarify, just pick a compelling domain and go
- The user has **explicitly asked you to decide**: "surprise me", "whatever looks good", "you choose"
- The prompt already contains **enough domain signal** to infer the rest: "create a sales dashboard" — you know the domain, invent the details

When inventing, be bold and specific. Don't create a "generic business dashboard" — create a "VP of Operations at a pet supply e-commerce company checking yesterday's fulfillment performance." Specificity produces better UIs even when the scenario is fictional.

### Triage examples

| User prompt | Decision | Reasoning |
|---|---|---|
| "Create a dashboard" | **Invent** | Purely generic — no clues to ask about |
| "Create a dashboard for our team" | **Ask** | "our team" implies real context worth one question |
| "Build a sales dashboard" | **Invent** | Domain is clear, invent the role and metrics |
| "Make a CRM for Acme Corp" | **Ask** | Named company — worth asking what they sell or who uses it |
| "Build an inventory page, we have about 500 products" | **Invent** | Enough context already — mid-size catalog, proceed |
| "HR admin panel" | **Invent** | Domain is clear, invent a plausible HR workflow |
| "Build something to track our deployments" | **Ask** | "our deployments" — worth asking about scale/stack |
| "Create a project management app" | **Invent** | Generic but domain is clear — invent a team type and workflow |
| "Build an app for our logistics team" | **Ask** | "our logistics team" — worth asking about what they manage |
| "Build a complete HR system" | **Invent** | Domain is clear, scaffold standard HR modules |

After the triage — whether the user answered a question or you decided to invent — determine the scope, then proceed to enrichment.

## Step 1: Determine Scope — Single View or Multi-View App

Determine whether the user is asking for a **single view** or a **multi-view app**. This changes the enrichment process significantly.

### Scope signals

**Multi-view app** — the user is asking for a full application with multiple screens:
- Words like "app", "application", "system", "platform", "tool", "portal"
- Multiple distinct features in one request: "with project tracking, team management, and reporting"
- Implied workflows that span screens: "manage the full hiring pipeline"
- Broad domain references: "an HR system", "a CRM", "an inventory management system"

**Single view** — the user is asking for one screen:
- Words like "dashboard", "page", "panel", "form", "view", "screen", "table"
- A single focused task: "show me sales by region", "build a data grid for users"
- No mention of navigation or multiple sections

**When in doubt, default to single view** — it's easier to expand later than to overscope.

### For single-view requests

Proceed directly to the Enrichment Process (the seven dimensions) below. This is the default path.

### For multi-view app requests

Run the App Scaffolding process first (next section), which produces an app-level architecture. Then enrich the primary/landing view using the seven dimensions and build it. Offer to build subsequent views after the user reviews the first one.

## App Scaffolding (Multi-View Apps Only)

When the scope is a multi-view app, define the application architecture before enriching individual views. This ensures consistency across screens — shared navigation, coherent data models, and a unified tone.

### A. App Identity

Give the app a working name and define its purpose in one sentence.

Example:
> **PipelineHQ** — A sales pipeline management tool for B2B SaaS teams to track deals from lead to close.

### B. User Roles

Define 1–3 user roles. Most apps have at least two: a primary user and an admin/manager. For each role, state what they primarily do in the app.

Example:
> - **Sales Rep**: Manages their own pipeline — adds deals, updates stages, logs activities
> - **Sales Manager**: Reviews team performance, forecasts revenue, reassigns leads
> - **Admin**: Configures pipeline stages, manages team members, sets quotas

For the initial build, pick one primary role and design for them. Mention the others so the architecture accounts for them.

### C. View Map

Define 3–6 main views. More than 6 means the scope is too broad — narrow it or phase it. For each view, state its purpose, its layout archetype (from the layout archetypes list in section 3 of the enrichment process), and which role uses it most.

Example:
> 1. **Dashboard** (landing) — Command Center — Pipeline health at a glance: KPIs, deal velocity chart, upcoming tasks. Used by: Sales Manager
> 2. **Pipeline Board** — Kanban/Workflow — Deals as cards across stages (Lead → Qualified → Proposal → Negotiation → Closed). Used by: Sales Rep
> 3. **Deal Detail** — Form-Heavy + List-Detail — Full deal record with contacts, activity timeline, documents, notes. Used by: Sales Rep
> 4. **Team Performance** — Analytical Workspace — Rep leaderboard, quota attainment, win/loss analysis. Used by: Sales Manager
> 5. **Settings** — Form-Heavy — Pipeline stage configuration, team management, integrations. Used by: Admin

### D. Navigation Model

Choose how users move between views:

- **Sidebar** (most common for business apps): Persistent left sidebar with icons + labels, collapsible on mobile. Best for 4–8 views.
- **Top navigation**: Horizontal tab bar. Best for 3–5 views with equal importance.
- **Bottom tabs** (mobile-first): Fixed bottom bar. Best for 3–5 views on mobile.
- **Hamburger/Drawer**: Hidden menu behind a toggle. Best when content area needs maximum width.

Also define the **shared chrome** — elements that persist across all views:
- App logo and name in the nav header
- User avatar/menu with profile, settings, logout
- Notification bell or badge
- Global search (if applicable)
- Breadcrumbs (if views have sub-views)

### E. Data Model Relationships

Define the core entities and how they connect. This ensures data consistency across views — the "deals" on the Pipeline Board are the same "deals" in the Deal Detail view.

Keep it simple — 3–5 entities with their key fields and relationships:

```
Entities:
- Deal: { id, name, value, stage, owner, company, closeDate, probability }
- Contact: { id, name, email, role, company }
- Activity: { id, type, date, notes, dealId, contactId }
- Company: { id, name, industry, size, revenue }

Relationships:
- Deal → belongs to Company, owned by User (Sales Rep)
- Contact → belongs to Company
- Activity → linked to Deal and/or Contact
```

### F. Shared Visual Identity

Define the app-level visual decisions that apply to every view:

- **Density & Tone**: Pick from section 6 of the enrichment process — this applies globally
- **Accent color**: One primary action color used for CTAs, active nav items, and key highlights
- **Status palette**: Consistent colors for states that appear across views (e.g., deal stages, health indicators)

Example:
> **Density**: Medium | **Tone**: Clean & Professional
> **Accent**: #2E7D32 (forest green — signals growth/money for a sales tool)
> **Status colors**: Lead=#90CAF9, Qualified=#42A5F5, Proposal=#FFA726, Negotiation=#FF7043, Won=#66BB6A, Lost=#EF5350

### G. Build Order

State which view to build first (usually the landing/dashboard view or the most complex core view) and present the plan to the user before building.

Format:
> "Here's how I'd structure this app — 5 views with sidebar navigation. I'll start with the **Dashboard** since it gives the best overview of the whole system. After you review it, I can build the next view. Sound good?"

Then enrich and build the first view using the full seven-dimension enrichment process below, carrying forward the app scaffold context (data model, navigation, visual identity) into every view.

## The Enrichment Process (Single View or Per-View for Apps)

Expand the user's request across these seven dimensions. If the user answered a clarification question, incorporate their answer. Otherwise, make opinionated decisions and commit to specifics. Either way, the output is a fully fleshed-out design brief.

### 1. User Role & Context

Define who is using this interface and why. This drives every other decision.

- **Who**: Job title, expertise level, daily workflow (e.g., "Regional Sales Manager reviewing weekly pipeline", "DevOps engineer monitoring deployment health")
- **Primary task**: The single most important thing they do on this screen (e.g., "Identify underperforming accounts", "Spot anomalies in server response times")
- **Decision this enables**: What action follows from using this screen (e.g., "Reallocate budget to top-performing channels", "Roll back a deployment")

Example — if the user says "create a sales dashboard":
> User: Sales Director reviewing Q2 pipeline. Primary task: Compare rep performance across regions to decide where to send reinforcement. This is checked every Monday morning with coffee — it needs to load fast, show the big picture first, and let her drill into a specific region.

### 2. Information Architecture

Define the content hierarchy — what information matters most, second-most, and least.

- **Hero metric(s)**: 1–3 numbers that should be visible within 0.5 seconds (e.g., "Total Revenue: $4.2M", "Pipeline Coverage: 3.1x", "Win Rate: 34%")
- **Primary data**: The main analytical content — the chart or grid the user spends 80% of their time on
- **Supporting data**: Secondary panels that provide context (trends, breakdowns, comparisons)
- **Peripheral info**: Tertiary content — recent activity, alerts, quick links

Be specific with numbers. Don't write "show revenue" — write "Total Revenue: $4.2M (↑12% vs. last quarter)". Realistic sample data transforms the output quality.

### 3. Layout Blueprint

Choose a concrete layout pattern. Do not default to "cards in a grid."

**Layout archetypes for Kendo interfaces:**

- **Command Center**: Fixed sidebar nav + top KPI strip + large primary viz + supporting panels below. Best for monitoring/operations dashboards.
- **Analytical Workspace**: Tabbed sections with a dominant chart/grid area and a filter panel (sidebar or top bar). Best for data exploration and reporting.
- **List-Detail (Master-Detail)**: Left panel with a filterable list/grid, right panel showing detail of the selected item. Best for CRM, ticket management, inventory.
- **Kanban/Workflow**: Column-based layout with drag-and-drop cards. Best for project management, pipeline stages.
- **Form-Heavy**: Stepped wizard or sectioned form with inline validation and contextual help. Best for data entry, onboarding, configuration.
- **Executive Summary**: Minimal, large-type hero metrics with expandable detail sections below. Best for C-level overviews, investor dashboards.

Pick one and describe the spatial arrangement:
> Layout: Command Center. Fixed 220px left sidebar (collapsed on mobile). Top strip with 4 KPI cards. Main area splits 60/40: left is a stacked bar chart (revenue by region by month), right is a leaderboard grid (top 10 reps). Below the fold: two half-width panels — pipeline funnel (left) and recent deals table (right).

### 4. Kendo Component Selection

Map the content to specific Kendo components. Be precise — don't just say "a chart," say which chart type and why.

**Common mappings:**

| Content Need | Kendo Component | When to Use |
|---|---|---|
| KPI display | TileLayout or custom card | Hero metrics with trend indicators |
| Trend over time | Line/Area Chart | Revenue, user growth, time series |
| Part-of-whole | Donut/Pie Chart | Market share, budget allocation (≤6 segments) |
| Comparison | Bar/Column Chart | Rep performance, regional comparison |
| Distribution | Heatmap or Histogram | Activity by hour, score distribution |
| Data table | Grid with sorting/filtering | Any tabular data requiring interaction |
| Pipeline/funnel | Funnel Chart or custom SVG | Sales funnel, conversion stages |
| Navigation | Drawer or PanelBar | Sidebar or hierarchical menu |
| Filtering | DateRangePicker, DropDownList, MultiSelect | Dashboard-level filters |
| Progress | ProgressBar, ArcGauge | Quota attainment, health scores |
| Scheduling | Scheduler or Gantt | Time-based planning views |

Include 5–8 specific components for a typical dashboard. State what data each one shows.

### 5. Data Specification

Define realistic sample data — this is critical for output quality. Generic `[Data 1]` placeholders produce generic layouts.

For each component, specify:
- **Data shape**: Field names, types, and 3–5 sample rows
- **Realistic values**: Use plausible names, dollar amounts, dates, percentages
- **Relationships**: How data connects across components (e.g., clicking a region in the chart filters the grid)

Example:
```
Revenue by Region Chart:
  - { region: "Northeast", q1: 1420000, q2: 1680000, target: 1500000 }
  - { region: "Southeast", q1: 980000, q2: 1150000, target: 1200000 }
  - { region: "West", q1: 2100000, q2: 1950000, target: 2000000 }
  - { region: "Midwest", q1: 760000, q2: 890000, target: 900000 }

Top Reps Grid:
  - { name: "Sarah Chen", region: "West", revenue: 892000, deals: 14, winRate: 0.42 }
  - { name: "Marcus Johnson", region: "Northeast", revenue: 734000, deals: 11, winRate: 0.38 }
  ...
```

### 6. Visual Density & Tone

Choose the right density for the audience and use case:

- **High density** (operations/analytics): Compact spacing, smaller fonts, data-forward, lots of info above the fold. Kendo's Dense mode. Suited for power users who live in this screen.
- **Medium density** (management/review): Balanced whitespace, clear hierarchy, comfortable reading. Default Kendo spacing. Suited for daily check-ins.
- **Low density** (executive/presentation): Generous whitespace, large hero numbers, minimal secondary data. Suited for quick glances and board presentations.

Also define the emotional tone:
- **Authoritative**: Dark backgrounds, sharp contrasts, data-heavy (financial trading, ops center)
- **Clean & Professional**: Light backgrounds, muted palette, structured (corporate reporting, SaaS admin)
- **Warm & Approachable**: Rounded corners, softer colors, friendly copy (customer-facing portal, HR dashboard)
- **Urgent & Action-Oriented**: Status colors, alert badges, real-time indicators (monitoring, incident response)

### 7. Interaction & State

Define what happens when the user interacts:

- **Filtering**: Which filters affect which components? Global date range? Per-component filters?
- **Selection**: Does clicking a chart segment filter a grid? Does row selection open a detail pane?
- **Empty/loading states**: What shows while data loads? What if a section has no data?
- **Responsive behavior**: Does the sidebar collapse? Do cards reflow? Which components hide on mobile?

## Output Format

### For single-view requests

After enriching, produce a structured brief in this format, then proceed directly to code generation:

```
## Design Brief: [Descriptive Title]

**User**: [Role and context in 1-2 sentences]
**Primary Task**: [What they're doing on this screen]
**Layout**: [Archetype name + spatial description]
**Density**: [High/Medium/Low] | **Tone**: [Descriptor]

### Component Plan
1. [Component Name] — [Kendo component] — [What it shows]
2. [Component Name] — [Kendo component] — [What it shows]
...

### Key Interactions
- [Interaction 1]
- [Interaction 2]

### Sample Data
[Inline data definitions for each component]
```

### For multi-view app requests

Produce the app scaffold brief first, then the per-view brief for the first view:

```
## App Brief: [App Name]

**Purpose**: [One-sentence description]
**Primary User**: [Role building for first]
**Views**: [Numbered list of views with layout archetype]
**Navigation**: [Sidebar/Top/Bottom + shared chrome description]
**Data Model**: [Core entities and relationships]
**Visual Identity**: Density: [H/M/L] | Tone: [Descriptor] | Accent: [Color]

---

## View 1 Brief: [View Name] (Building This First)

[Standard single-view brief format above]
```

The brief stays in your thinking — you don't need to show it to the user unless they ask. Present the app structure conversationally ("Here's how I'd organize this..."), get a thumbs up, then build the first view. Offer to build subsequent views after the user reviews.

## Enrichment Examples

### Example 1: Generic → Enriched

**User prompt**: "Create a business dashboard"

**Enriched to**:
> **User**: VP of Operations at a mid-size e-commerce company, reviewing daily performance at 8am.
> **Primary Task**: Confirm yesterday's revenue hit target and spot any fulfillment bottlenecks.
> **Layout**: Command Center. Top KPI strip (4 metrics: Revenue, Orders, Avg Order Value, Fulfillment Rate). Main area: Revenue trend line chart (last 30 days) left, Orders by category donut chart right. Below: Fulfillment pipeline grid with status indicators, Recent returns table.
> **Density**: Medium | **Tone**: Clean & Professional
> **Components**: TileLayout (KPIs), Line Chart (revenue), Donut Chart (categories), Grid (fulfillment), Grid (returns), DateRangePicker (global filter)

### Example 2: Generic → Enriched

**User prompt**: "Make a CRM page"

**Enriched to**:
> **User**: Account Manager at a B2B SaaS company, managing 40 active accounts.
> **Primary Task**: Identify which accounts need attention this week — upcoming renewals, declining engagement, or open support tickets.
> **Layout**: List-Detail. Left panel (35% width): searchable, sortable grid of accounts with health score badges. Right panel (65% width): selected account detail with tabbed sections (Overview, Activity Timeline, Contacts, Contracts).
> **Density**: Medium-High | **Tone**: Authoritative
> **Components**: Grid with row selection (accounts), TabStrip (detail sections), Timeline/ListView (activity), Badge (health scores), Chart (engagement sparkline), DropDownList + TextBox (filters)

### Example 3: Clarify First, Then Enrich

**User prompt**: "Build a dashboard for our ops team"

**Triage**: "our ops team" hints at real context — worth one question.

**Clarification** (via `ask_user_input`):
> "Quick question so I can tailor this to your team:"
> - "E-commerce / Fulfillment"
> - "SaaS / Infrastructure"
> - "Manufacturing / Supply Chain"
> - "Surprise me — just build something great"

**User taps**: "SaaS / Infrastructure"

**Enriched to**:
> **User**: SaaS Platform Ops Lead monitoring service health across 12 microservices.
> **Primary Task**: Spot degraded services before customers notice — check error rates, p99 latency, and deployment status.
> **Layout**: Command Center. Top strip: 4 gauges (Uptime, Error Rate, p99 Latency, Active Incidents). Main area: Service health heatmap (services × time) left, Incident timeline right. Below: Deployment log grid, On-call roster panel.
> **Density**: High | **Tone**: Urgent & Action-Oriented
> **Components**: ArcGauge (uptime/latency), Heatmap Chart (service health), Timeline (incidents), Grid (deployments), Badge (severity), DateRangePicker (time window)

### Example 4: Multi-View App — Full Scaffolding

**User prompt**: "Create a project management app"

**Triage**: Purely generic — invent.
**Scope**: Multi-view app ("app" keyword, broad domain).

**App scaffold**:
> **App**: TaskForge — A lightweight project management tool for small engineering teams (8–15 people) shipping software in 2-week sprints.
> **Primary User**: Engineering Team Lead
>
> **Views**:
> 1. **Sprint Board** (landing) — Kanban/Workflow — Current sprint's tasks as draggable cards across columns: Backlog → In Progress → In Review → Done
> 2. **Project Overview** — Command Center — KPIs (velocity, burndown, blockers), sprint progress chart, team workload heatmap
> 3. **Task Detail** — List-Detail — Full task view with description, subtasks, comments, attachments, activity log
> 4. **Team** — Analytical Workspace — Team member grid with current assignments, capacity bars, and availability calendar
> 5. **Settings** — Form-Heavy — Project config, sprint setup, labels, integrations
>
> **Navigation**: Sidebar (220px, collapsible). Icons + labels. App logo top, user menu bottom. Notification badge on Sprint Board icon when blockers exist.
> **Shared chrome**: Global search bar in top header, breadcrumbs for Task Detail sub-view.
>
> **Data model**:
> - Task: { id, title, status, priority, assignee, storyPoints, sprint, labels, dueDate }
> - Sprint: { id, name, startDate, endDate, goal, tasks[] }
> - TeamMember: { id, name, avatar, role, capacity }
> - Comment: { id, taskId, author, text, timestamp }
>
> **Visual Identity**: Density: Medium-High | Tone: Clean & Professional | Accent: #1565C0 (deep blue)
> **Status colors**: Backlog=#B0BEC5, In Progress=#42A5F5, In Review=#FFA726, Done=#66BB6A, Blocked=#EF5350

**First view built**: Sprint Board (Kanban) — enriched with full seven dimensions, then coded.

### Example 5: Already Specific — Skip Enrichment

**User prompt**: "Build a Kendo grid with these columns: Name, Email, Role, Status (active/inactive), Last Login. Add inline editing, a search bar that filters across all text columns, and export to Excel. Use the default theme with a blue header."

→ This prompt is already specific. Skip enrichment, go straight to building.

## Interaction with Other Skills

This skill produces the WHAT — the design brief. If a Kendo styling/design skill is also available, it handles the HOW — theme customization, color palettes, typography, spacing refinements. The two are complementary:

1. **This skill** runs first → produces a detailed component plan with layout, data, and interactions
2. **The Kendo design skill** runs during code generation → applies visual polish, theme overrides, and aesthetic refinements

If no separate design skill exists, apply the Visual Density & Tone guidelines from section 6 directly during code generation.
