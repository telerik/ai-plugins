# Navigation & Wayfinding

> Source: Nielsen Norman Group research on navigation design, breadcrumbs, search placement, and wayfinding.
> Apply during Phase A (Pre-Implementation) when designing navigation structure, search, and empty states.

---

## Search Placement

If the application includes search, the search input must be visible from every page —
not hidden behind a menu or placed only on a dedicated search page.

- **Placement**: top-right of the page header
- **Width**: minimum 200px — a narrow search field signals low confidence in search
- **Behavior**: submit on Enter and on the search icon click

---

## Breadcrumbs

Add breadcrumb navigation on any page that is more than 2 levels deep in the site hierarchy.

```jsx
// Use Kendo Breadcrumb for deep content pages
<Breadcrumb data={breadcrumbItems} />
```

Rules:
- Always show the full path from home to the current page
- Make all ancestor items links — the current page should not be a link
- Place breadcrumbs above the page title, not below it

---

## Navigation Structure

- **Top-level items**: maximum 7. Beyond this, users cannot hold the menu in working memory.
- **Labels**: use plain, descriptive nouns and verbs. Avoid product-team jargon or internal
  naming conventions that users will not recognize.
- Use **left-aligned vertical navigation** for complex applications with many sections — it
  scales better than horizontal menus and does not truncate under translated strings.
- On **mobile** (< 640px): a collapsed navigation (hamburger) is acceptable, but ensure
  critical actions remain accessible without opening the menu. On desktop, navigation must
  always be visible without an extra interaction.

---

## "No Results" States

A search or filter that returns zero results is a navigation failure. Never show a blank list.
Always provide:

1. A clear statement that no results were found
2. The context of what was searched or filtered
3. A corrective action (e.g., "Clear filters", "Try a different search", "Browse all items")

```
No results for "invoice 2024"
Try adjusting your search or clear the date filter.
[Clear filters]   [Browse all invoices]
```
