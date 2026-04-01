# Navigation Anti-Patterns

> Source: Nielsen Norman Group research on navigation design, wayfinding, and menu usability.
> Cross-check against these during Phase B (Design Review).

---

## ❌ Using a Hamburger Menu as the Only Navigation on Desktop

**Why it's wrong:** Hides navigation behind an extra click on a device where screen
space is not limited. Desktop users expect navigation to be visible without interaction.
Hidden navigation reduces content discovery significantly compared to visible navigation.

**Correct approach:** On desktop (≥ 1024px), show navigation items directly — sidebar,
top nav, or tab bar. Reserve collapsed/hamburger patterns for mobile viewports (< 640px) only.

---

## ❌ No Breadcrumbs on Deep Content Pages

**Why it's wrong:** Users lose context of where they are in the application hierarchy.
The browser back button is an unreliable substitute — it navigates to the previous URL,
which may have been an external page or a filtered state the user does not want to return to.

**Correct approach:** Add a Kendo `<Breadcrumb>` component to any page that is more than
2 levels deep in the navigation hierarchy. Place it above the page title.

---

## ❌ "No Results" Pages That Are Empty Dead Ends

**Why it's wrong:** Users have no recovery path. A blank list with no message or action
leaves users unsure whether the application failed or their search was genuinely empty.

**Correct approach:** Always show an explanation, the context of what was searched, and
a corrective action:

```
No results for "invoice 2024"
Try adjusting your search or clear the date filter.
[Clear filters]   [Browse all invoices]
```

---

## ❌ Inconsistent Link and Navigation Styling

**Why it's wrong:** Users learn to recognize interactive elements by their visual pattern.
Changing link colors, underlines, or navigation item styles across sections forces users
to re-learn the interface in every new area, increasing cognitive load and reducing trust.

**Correct approach:** Establish a single link style across the application and apply it
consistently. Use Kendo's semantic color tokens for interactive text
(`var(--kendo-color-primary)`).

---

## ❌ More Than 7 Top-Level Navigation Items

**Why it's wrong:** Exceeds working memory limits. Users cannot hold more than ~7 items
in short-term memory, so excess navigation entries compete for attention and effectively
become invisible.

**Correct approach:** Group related items under a parent label. A maximum of 7 top-level
navigation entries is the practical upper limit for effective wayfinding.
