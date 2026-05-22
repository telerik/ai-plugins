# Layout Pattern Catalog

You are here because you need to select a spatial layout pattern. Pick the pattern that matches the user's **primary task**, not the domain. A CRM could be List-Detail, Command Center, or Kanban depending on what the user does on that screen.

## Pattern Selection Guide

| User's primary task | Pattern |
|---------------------|---------|
| Monitor real-time data, spot anomalies | Command Center |
| Explore/filter data, build reports | Analytical Workspace |
| Browse a list, view/edit one item's detail | List-Detail |
| Move items through stages | Kanban / Workflow |
| Enter or configure data | Form / Wizard |
| Get a quick high-level summary | Executive Summary |
| Browse a collection of visual items | Content Grid / Gallery |
| Read a stream of updates or posts | Content Feed |
| Search then drill into results | Search-First |
| Complete a multi-step process | Guided Flow |
| Have a conversation or messaging flow | Conversational |
| Present marketing/product info | Landing / Hero |

---

## Patterns

### Command Center
**Task**: Monitor, detect anomalies, respond
**Structure**: Fixed sidebar (220px) + top KPI strip (4–6 metrics) + dominant viz (60–70%) + supporting panel (30–40%) + secondary panels below fold
**Kendo**: Drawer + TileLayout + Charts + Grid
**Not for**: Editing data or browsing collections

### Analytical Workspace
**Task**: Explore data, compare, build reports
**Structure**: Filter panel (left 250px or collapsible top bar) + dominant chart/grid (70–80%) + tab toggle + export controls
**Kendo**: Splitter + Grid + Charts + DateRangePicker + MultiSelect
**Not for**: Real-time monitoring or record management

### List-Detail
**Task**: Browse a list, view/edit selected item
**Structure**: Left panel (30–40%): searchable Grid/ListView. Right panel (60–70%): detail with TabStrip. Row selection updates right panel.
**Kendo**: Splitter + Grid + TabStrip + Form
**Not for**: <20 items (inline detail) or side-by-side comparison

### Kanban / Workflow
**Task**: Track items through discrete stages
**Structure**: Horizontal columns per stage, drag-and-drop cards, column headers with count/aggregate, top filter bar
**Kendo**: Custom flex columns + Card + DropDownList
**Not for**: No discrete stages; >8 columns; primary need is reporting

### Form / Wizard
**Task**: Enter or configure data
**Structure**: Stepper wizard (one section at a time) OR sectioned form (all visible, scrollable). Inline validation. Summary step for wizards.
**Kendo**: Stepper + Form + TextBox + DropDownList + Switch
**Not for**: Read-heavy or monitoring views

### Executive Summary
**Task**: Quick high-level check, no exploration
**Structure**: 3–5 large hero metrics (32–48px) + 1–2 simple charts + expandable drill-down. Heavy whitespace.
**Kendo**: Custom metric cards + Area/Bar Chart + ExpansionPanel
**Not for**: Filtering, exploring, or editing data

### Content Grid / Gallery
**Task**: Browse visual items (products, media, projects)
**Structure**: Top filter/sort bar + responsive card grid (3–4 col desktop, 2 tablet, 1 mobile). Cards: image + title + metadata + action. Optional sidebar filters.
**Kendo**: ListView + card template + Pager + DropDownList + MultiSelect
**Not for**: Purely textual items (List-Detail) or sequential items (Content Feed)

### Content Feed
**Task**: Read a chronological stream
**Structure**: Single-column scrollable list (max-width 600–700px, centered). Items: author + timestamp + content + actions. Infinite scroll. Optional sidebar.
**Kendo**: ListView + custom template + Chip
**Not for**: Side-by-side comparison or spatial arrangement

### Search-First
**Task**: Find items from a large set, drill into results
**Structure**: Prominent search bar (hero position). Results populate below. Faceted filter sidebar (left 250px) appears with results.
**Kendo**: TextBox + Grid/ListView + MultiSelect/CheckBoxGroup
**Not for**: Small browsable datasets

### Guided Flow
**Task**: Multi-step process (onboarding, checkout)
**Structure**: Stepper at top. One step visible at a time. Back/Next fixed bottom. Optional summary sidebar.
**Kendo**: Stepper + Form + Button
**Not for**: Single-step forms or power users who prefer everything visible

### Conversational
**Task**: Messaging, chat, AI interaction
**Structure**: Message list (scrollable, bottom-anchored) + input bar fixed bottom. Optional sidebar (30%) for conversation list.
**Kendo**: ListView + TextArea + Button + Drawer
**Not for**: Form-based interactions

### Landing / Hero
**Task**: Present a product or value proposition
**Structure**: Full-width hero (60–80vh) + headline + CTA. Feature sections alternating text/image. Social proof strip. Final CTA. Sticky top nav.
**Kendo**: AppBar + Button + Card + Carousel
**Not for**: Internal tools or data-heavy applications
