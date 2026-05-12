# Accessibility Guidelines: WCAG 2.2 Level AA Compliance

## Core Principles

1. Use semantic HTML and ARIA correctly
2. Ensure WCAG 2.2 AA compliance
3. Follow W3C ARIA Authoring Practices
4. Provide standards-based accessibility fixes

---

## 1. Form Control Labels (WCAG 1.3.1, 3.3.2, 4.1.2)

Every input must have an associated label.

✅ CORRECT: `<input type="search" aria-label="Search products" placeholder="Search...">`
✅ CORRECT: `<label for="qty">Quantity</label><input type="number" id="qty">`
❌ WRONG: `<span>Email</span><input type="email">` (no association)
❌ WRONG: `<input type="email" placeholder="Email">` (placeholder as label)

---

## 2. Button Accessibility (WCAG 4.1.2, 2.4.6, 2.5.3)

All buttons need accessible names describing their purpose.

✅ CORRECT: `<button type="button">Save Changes</button>`
✅ CORRECT: `<button aria-label="Close dialog"><svg aria-hidden="true" focusable="false">...</svg></button>`
❌ WRONG: `<button><svg>...</svg></button>` (no accessible name)
❌ WRONG: `<button>Click here</button>` (generic text)

---

## 3. Popup/Menu Triggers (WCAG 4.1.2, 1.3.1)

Indicate popup purpose and state using `aria-haspopup`, `aria-expanded`, `aria-controls`.

✅ CORRECT: `<button aria-expanded="false" aria-haspopup="menu" aria-controls="menu-id">Settings</button>`

---

## 4. Image Accessibility (WCAG 1.1.1)

✅ Informative: `<img src="chart.png" alt="Sales increased 25% in Q4 2024">`
✅ Functional: `<a href="/home"><img src="logo.png" alt="Company Name Home"></a>`
✅ Decorative: `<img src="border.png" alt="" role="presentation">`
✅ Complex: `<img src="chart.png" alt="Sales data" aria-describedby="desc-id">`
❌ WRONG: Missing alt, filename as alt, generic alt for decorative images

---

## 5. Link Accessibility (WCAG 2.4.4, 2.4.6)

Links must be descriptive and understandable out of context.

✅ CORRECT: `<a href="/products">View All Products</a>`
✅ CORRECT: `<a href="/article" aria-label="Read more about New Product Launch">Read more</a>`
❌ WRONG: "Click here", "Read more", "Learn more" without context

---

## 6. Form Validation (WCAG 3.3.1, 3.3.2, 3.3.3)

Errors must be identified, associated with inputs, and provide suggestions. Use `aria-describedby`, `aria-invalid="true"`, and `role="alert"`.

---

## 7. Heading Structure (WCAG 1.3.1, 2.4.6)

Each page must have an `<h1>` that describes its content. Use hierarchical, descriptive headings with no skipped levels (h1→h2→h3).

✅ CORRECT: `<h1>Dashboard</h1> <h2>Sales</h2> <h3>By Region</h3>`
❌ WRONG: No `<h1>` on the page, or skipping levels (h1→h3)

If a heading should look smaller than its semantic level, use CSS: `<h2 class="text-sm">Subtitle</h2>`

---

## 8. Page Component Landmark Rules (WCAG 1.3.1, 4.1.2)

Page components (route components) may be rendered inside a layout that already provides `<main>`, `<header>`, or `<footer>`. Since the layout configuration is unknown, avoid using these landmarks in page components to prevent potential duplication and nesting violations.

- Avoid adding `<main>`, `role="main"`, `<header>`, or `<footer>` in page components — the layout typically provides them. Duplicating them can cause `landmark-no-duplicate-main` and `landmark-main-is-top-level` violations.
- Avoid adding `role="banner"` or using a semantic `<header>` element in page components — the layout's `<header>` already claims the banner landmark.
- Avoid adding `role="contentinfo"` to elements inside page components — the contentinfo landmark should be a top-level landmark, not nested inside `<main>` or other landmarks.
- When multiple `<section>` or `<nav>` elements exist on a page, give each a unique `aria-label` to avoid `landmark-unique` violations.

---

## 9. ARIA Role and Attribute Restrictions (WCAG 4.1.2)

Only use ARIA roles that are valid for the given HTML element. Avoid adding `aria-label` or `aria-labelledby` to elements that do not permit naming.

- `<article>` has an implicit `article` role. Do NOT override it with `role="listitem"`, `role="button"`, `role="link"`, or any other role. Use `<li>` for list items, `<button>` for interactive cards, or `<a>` for clickable cards instead.
- `<button>` already has an implicit `button` role. Do NOT add `role="listitem"` or other incompatible roles.
- `<span>` and `<div>` without roles are generic elements. Do NOT add `aria-label` to them — it is a prohibited attribute on elements with no accessible role and can cause `aria-prohibited-attr` violations. Instead, use `role="img"` + `aria-label` for visual indicators, or use visually hidden text.
- Do NOT add `aria-label` to non-interactive `<div>` wrappers — it has no effect and triggers violations.
- `aria-pressed` is only valid on elements with `role="button"`, `role="checkbox"`, `role="menuitemcheckbox"`, `role="option"`, `role="radio"`, or `role="switch"`. Do NOT use `aria-pressed` on elements with `role="listitem"` or other roles.

✅ CORRECT: `<ul role="list"><li className="product-card">...</li></ul>` (listitem inside list)
✅ CORRECT: `<span role="img" aria-label="Status: pending" className="status-dot"></span>` (role added before aria-label)
✅ CORRECT: `<span className="status-dot" aria-hidden="true"></span><span className="visually-hidden">Pending</span>` (hidden text alternative)
❌ WRONG: `<article role="listitem">` (listitem not allowed on article)
❌ WRONG: `<article role="button">` (button not allowed on article — use `<button>` or `<div role="button">`)
❌ WRONG: `<span aria-label="pending" className="status-dot"></span>` (aria-label prohibited on generic span)
❌ WRONG: `<div aria-label="Product badges" className="badges"></div>` (aria-label prohibited on generic div)

---

## Quick Checklist

- **Forms:** Associated labels, `aria-required` on required fields, autocomplete attributes, `aria-describedby` for errors, `aria-invalid` for invalid fields, fieldsets with legends
- **Buttons/Links:** Accessible names, `aria-label` for icon buttons, `aria-hidden` on decorative icons, descriptive link text
- **Popups/Dialogs:** `aria-haspopup`, `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape to close
- **Images:** `alt` on all images, descriptive alt for informative, empty alt for decorative, `aria-describedby` for complex
- **Structure:** One h1, logical heading hierarchy, avoid `<main>`, `<header>`, `<footer>`, `role="main"`, `role="contentinfo"`, `role="banner"` in page/route components (the layout may already provide them), use `<section>` or `<div>` as page-level wrappers, unique `aria-labels` on duplicate landmark types
- **ARIA Rules:** Avoid adding `aria-label` to generic `<span>`/`<div>` without a role, avoid using `role="listitem"` or `role="button"` on `<article>`, add `role="img"` before `aria-label` on visual indicators, `aria-pressed` only on button-like roles
- **Scrollable Regions:** Any scrollable container must have `tabindex="0"` or contain keyboard-interactive children
- **Nested Interactive:** Do not add interactive role/tabindex to a container that already has focusable children
- **List Roles:** `role="list"` containers must have `role="listitem"` children — prefer `<ul>`/`<li>` natively
- **Dynamic Content:** `role="status"`/`aria-live="polite"` for updates, `role="alert"`/`aria-live="assertive"` for critical alerts
- **Keyboard/Focus:** All interactive elements keyboard accessible, logical focus order, visible focus indicators, no keyboard traps (except modals)
- **Color/Contrast:** 4.5:1 text contrast (3:1 large text), 3:1 UI component contrast, no color-only information, 3:1 focus indicator contrast
