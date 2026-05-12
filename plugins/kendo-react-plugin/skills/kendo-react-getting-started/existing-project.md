# Getting Started with KendoReact — Existing Project

This guide walks you through adding KendoReact to an existing React project.

Execute the following steps **in order**. Run all provided commands automatically.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or later** installed on your machine
- An existing React project open in your editor

---

## Step 1: Install KendoReact Packages

Install all required KendoReact packages and dependencies:

```bash
npm i @progress/kendo-data-query @progress/kendo-react-buttons @progress/kendo-react-excel-export @progress/kendo-react-grid @progress/kendo-react-layout @progress/kendo-react-pdf @progress/kendo-svg-icons @progress/kendo-drawing @progress/kendo-licensing @progress/kendo-react-animation @progress/kendo-react-charts @progress/kendo-react-common @progress/kendo-react-conversational-ui @progress/kendo-react-data-tools @progress/kendo-react-dateinputs @progress/kendo-react-dialogs @progress/kendo-react-dropdowns @progress/kendo-react-editor @progress/kendo-react-form @progress/kendo-react-gantt @progress/kendo-react-gauges @progress/kendo-react-indicators @progress/kendo-react-inputs @progress/kendo-react-intl @progress/kendo-react-labels @progress/kendo-react-listbox @progress/kendo-react-listview @progress/kendo-react-map @progress/kendo-react-notification @progress/kendo-react-orgchart @progress/kendo-react-pivotgrid @progress/kendo-react-popup @progress/kendo-react-progressbars @progress/kendo-react-ripple @progress/kendo-react-scheduler @progress/kendo-react-scrollview @progress/kendo-react-sortable @progress/kendo-react-spreadsheet @progress/kendo-react-tooltip @progress/kendo-react-treelist @progress/kendo-react-treeview @progress/kendo-react-upload @progress/kendo-react-pdf-viewer @progress/kendo-react-taskboard
```

---

## Step 2: Install and Import the Theme

Install the `<theme-display>` theme package:

```bash
npm i <theme-package>
```

Import the CSS file in your main entry file (e.g., `src/index.tsx` or `src/main.tsx`) **before** your existing CSS imports:

```typescript
import '<theme-package>/dist/all.css';
```

Also add the Kendo CSS utilities CDN link in your `index.html` `<head>`:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

Add global body/html styles to prevent dark theme on a white page. Add to your global CSS file (e.g., `src/index.css`):

```css
html, body {
  background-color: var(--kendo-body-bg);
  color: var(--kendo-body-text);
}
```

---

## Step 3: Activate Kendo License

This step is required to use KendoReact components without watermarks and with access to all features:

```bash
npx kendo license activate
```

---

## Step 4: Run the Application

Build and run the application:

**Verification:** Automatically run the application. Do not just inform the user — execute the following command and keep the application running:

```bash
npm run dev
```

The application should start and open in your browser. Verify that the KendoReact components are rendering correctly with the `<theme-display>` theme applied.
