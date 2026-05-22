# Single-View Enrichment — The 7 Dimensions

You are here because the decision table matched **single-view enrichment**. Expand the user's request across all seven dimensions below, then produce the design brief.

If the prompt is generic with no personal context clues, **invent** a bold, specific scenario. Not "generic business dashboard" — "VP of Operations at a pet supply e-commerce company checking yesterday's fulfillment performance." Specificity produces better UIs even when fictional.

---

## 1. User Role & Context

- **Who**: Job title, expertise level, workflow moment
- **Primary task**: The single most important thing they do on this screen
- **Decision this enables**: What action follows

## 2. Information Architecture

- **Hero content**: 1–3 elements visible within 0.5 seconds (metrics, search bar, hero image, primary CTA, status indicator — depends on UI type)
- **Primary content**: What the user spends 80% of their time on
- **Supporting content**: Context for the primary task (filters, related items, summaries)
- **Peripheral content**: Tertiary — activity feeds, tips, quick links

Be specific with values. Not "show products" — "12 product cards, 3 columns: image, name, price ($24.99–$189.00), rating (4.2★), Add to Cart button."

## 3. Layout Pattern

Pick from `layout-patterns.md` and describe the spatial arrangement explicitly:

- Panel widths/ratios (e.g., "Left 35% / Right 65%")
- What's above vs. below the fold
- Column/row structure for grids (e.g., "3 columns desktop, 2 tablet, 1 mobile")
- Fixed vs. scrollable regions

## 4. Kendo Component Selection

Map each content element to a specific Kendo component. Be precise — "Column Chart (grouped, 4 series)" not "a chart."

**Rules:**
- Time series → Line/Area Chart; Comparison → Bar/Column; Part-of-whole → Donut (≤6 segments, else use Bar)
- Grid: virtual scrolling for >100 rows; InCell editing only when inline edit is the primary workflow
- Binary choices → Switch or RadioGroup, not DropDownList
- Single date → DatePicker; ranges → DateRangePicker

Include 4–10 components depending on view complexity.

## 5. Data Specification

For each component: field names/types, 3–5 sample rows with realistic values, and cross-component relationships (clicking row X filters component Y). Never use placeholders.

## 6. Visual Density & Tone

**Density:**

| Level | Spacing | Font | Audience |
|-------|---------|------|----------|
| High | Compact, dense mode | 12–13px | Power users, all-day screens |
| Medium | Default | 14–15px | Daily/weekly users |
| Low | Generous | 16px+, large heroes | Executives, glancers, mobile-first |

**Tone:**

| Tone | Visual cues | Best for |
|------|-------------|----------|
| Authoritative | Dark bg, high contrast, monospace numbers | Finance, security, ops |
| Clean & Professional | Light bg, muted accents, structured | SaaS, corporate, B2B |
| Warm & Approachable | Off-white, rounded corners, warm colors | Customer portals, HR, onboarding |
| Urgent & Action-Oriented | Status colors dominant, alert badges | Monitoring, incident response |
| Playful & Engaging | Bright accents, illustrations, animations | Consumer apps, social, gamification |
| Minimal & Content-First | Max whitespace, typography-driven | Blogs, reading apps, portfolios |

## 7. Interaction & State

- **Filtering**: Which filters affect which components? Global vs. local?
- **Selection/Navigation**: Row click → detail pane? Card click → new view?
- **Empty states**: Illustration + explanation + action. Never blank space.
- **Loading**: Skeleton matching expected content shape, not just spinner.
- **Responsive**: Sidebar collapses at 768px; grids reflow; what hides on mobile?

---

## Examples

**"Create a business dashboard"** → Invent: VP of Ops at mid-size e-commerce. Layout: Command Center — top KPI strip (4 cards: $142K revenue ↑8%, 1,847 orders, $76.90 AOV, 94.2% fulfillment). Main area: Line Chart (revenue trend, 60%) + Donut Chart (categories, 40%). Below fold: Grid (fulfillment pipeline) + Grid (recent returns). Global DateRangePicker. Density: Medium | Tone: Clean & Professional.

**"Build a product page"** → Invent: Outdoor gear shopper. Layout: Landing/Hero variant — 50/50 split: left Carousel (5 images), right product info stack (title, $189.99, 4.6★, color/size selectors, Add to Cart CTA). Below fold: TabStrip (Description, Specs Grid, Reviews ListView with rating filter). Bottom: Content Grid (4 related products). Density: Low | Tone: Warm & Approachable.
