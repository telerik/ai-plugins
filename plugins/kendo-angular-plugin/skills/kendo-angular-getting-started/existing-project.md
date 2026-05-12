# Getting Started with Kendo UI for Angular — Existing Project

This guide walks you through adding Kendo UI for Angular to an existing Angular project.

Execute the following steps **in order**. Run all provided commands automatically.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or later** installed on your machine
- An existing Angular project open in your editor

---

## Step 1: Configure Animations

This ensures animations that Kendo UI for Angular components rely on are configured correctly.

Open `src/app/app.config.ts` and add `provideAnimations`. If using NgModule, add `BrowserAnimationsModule` to the imports array instead.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    // ... other providers
  ]
};
```

---

## Step 2: Install Kendo UI for Angular Packages

Use the Angular CLI to install the grid package. While installing, confirm that you also want to install the underlying npm package with the suggested version from the ng tool.

The `--theme=<theme>` flag also sets up the `<theme-display>` theme:

```bash
ng add @progress/kendo-angular-grid@latest --skip-confirmation --theme=<theme>
```

Use npm to install additional required Kendo UI for Angular packages:

```bash
npm install @progress/kendo-angular-barcodes @progress/kendo-angular-chart-wizard @progress/kendo-angular-charts @progress/kendo-angular-dateinputs @progress/kendo-angular-diagrams @progress/kendo-angular-editor @progress/kendo-angular-filter @progress/kendo-angular-gantt @progress/kendo-angular-gauges @progress/kendo-angular-icons @progress/kendo-angular-listbox @progress/kendo-angular-listview @progress/kendo-angular-map @progress/kendo-angular-pdfviewer @progress/kendo-angular-pivotgrid @progress/kendo-angular-ripple @progress/kendo-angular-scheduler @progress/kendo-angular-scrollview @progress/kendo-angular-sortable @progress/kendo-angular-spreadsheet @progress/kendo-angular-tooltip @progress/kendo-angular-treelist @progress/kendo-angular-typography @progress/kendo-file-saver
```

---

## Step 3: Activate Kendo License

This step is required to use Kendo UI for Angular components without watermarks and with access to all features.

1. Activate your license using the local Kendo licensing CLI. Use `npx kendo-ui-license` (not `npx kendo`) to ensure the license is activated in the local project:

```bash
npx kendo-ui-license activate
```

2. Clean the Angular cache to remove any cached license from a previous activation:

```bash
ng cache clean
```

---

## Step 4: Install the Kendo Utils Package

Add the following to `index.html` to include the Kendo theme utils, which are required for the themes to work correctly. Check that this reference does not already exist before adding it:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

Also add global body/html styles to prevent dark theme rendering on a white page. Add to your global CSS file (`styles.css` or `styles.scss`):

```css
html, body {
  background-color: var(--kendo-body-bg);
  color: var(--kendo-body-text);
}
```

---

## Step 5: Run the Application

Build and run the application to verify everything is working:

```bash
ng serve --open
```

The application should start and open in your browser. Verify that the Kendo UI for Angular components are rendering correctly with the `<theme-display>` theme applied.
