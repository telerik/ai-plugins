# Getting Started with Kendo UI for Angular — New Project

This guide walks you through creating a new Angular project and setting up Kendo UI for Angular.

Execute the following steps **in order**. Run all provided commands automatically.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or later** installed on your machine
- If Node.js is not available, install the latest Node.js automatically as a preliminary step before installing the Angular CLI

---

## Step 1: Install Angular CLI

Ensure the Angular CLI is installed globally:

```bash
npm install -g @angular/cli@latest
```

---

## Step 2: Create the Project

Create a new Angular project using the Angular CLI:

```bash
ng new <project-name> --style=css --ai-config=none --no-ssr --routing --zoneless=false --minimal=true
```

Navigate to the project directory:

```bash
cd <project-name>
```

---

## Step 3: Configure Animations

This ensures animations that Kendo UI for Angular components rely on are configured correctly.

Open `src/app/app.config.ts` and add `provideAnimations`:

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

## Step 4: Install Kendo UI for Angular Packages

Use the Angular CLI to install the grid package. While installing, confirm that you also want to install the underlying npm package with the suggested version from the ng tool:

```bash
ng add @progress/kendo-angular-grid@latest --skip-confirmation --theme=<theme>
```

Use npm to install additional required Kendo UI for Angular packages:

```bash
npm install @progress/kendo-angular-barcodes @progress/kendo-angular-chart-wizard @progress/kendo-angular-charts @progress/kendo-angular-dateinputs @progress/kendo-angular-diagrams @progress/kendo-angular-editor @progress/kendo-angular-filter @progress/kendo-angular-gantt @progress/kendo-angular-gauges @progress/kendo-angular-icons @progress/kendo-angular-listbox @progress/kendo-angular-listview @progress/kendo-angular-map @progress/kendo-angular-pdfviewer @progress/kendo-angular-pivotgrid @progress/kendo-angular-ripple @progress/kendo-angular-scheduler @progress/kendo-angular-scrollview @progress/kendo-angular-sortable @progress/kendo-angular-spreadsheet @progress/kendo-angular-tooltip @progress/kendo-angular-treelist @progress/kendo-angular-typography @progress/kendo-file-saver
```

---

## Step 5: Activate Kendo License

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

## Step 6: Install the Kendo Utils Package

Add the following to `index.html` to include the Kendo theme utils, which are required for the themes to work correctly:

```html
<link rel="stylesheet" href="https://unpkg.com/@progress/kendo-theme-utils/dist/all.css" />
```

---

## Step 7: Run the Application

Start the development server:

```bash
ng serve --open
```

The application should start and open your browser to see your Kendo UI for Angular application.

---

## Step 8: Create Sample Page

Replace the content of `src/app/app.ts` with the following to verify everything is working correctly:

```typescript
import { Component } from '@angular/core';
import { KENDO_CARD } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KENDO_CARD],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
```

Create `src/app/app.html` with the following content:

```html
<div class="k-d-flex k-flex-col k-gap-5 k-p-6">
  <div class="k-d-flex k-flex-col k-align-items-center k-gap-3 k-py-4">
    <h1 class="k-h2 k-text-center">Kendo UI for Angular</h1>
    <p class="k-h5 k-text-center k-color-subtle k-font-weight-normal k-max-w-3xl">
      Create sophisticated Angular UIs with AI-powered agents using natural language prompts
    </p>
  </div>

  <div class="k-text-center k-py-2">
    <p class="k-font-size-lg k-font-weight-bold k-mb-4">😊 Ready to build? Copy any prompt below directly into your coding agent to get started</p>
    <div class="k-d-grid k-grid-cols-3 k-gap-4">
      <div class="k-p-4 k-rounded-md" style="background: var(--kendo-component-bg)">
        <p class="k-font-family-monospace k-text-base k-m-0">'#kendo_ui_generator Create a dashboard with sales charts, revenue KPIs, and a recent orders grid'</p>
      </div>
      <div class="k-p-4 k-rounded-md" style="background: var(--kendo-component-bg)">
        <p class="k-font-family-monospace k-text-base k-m-0">'#kendo_ui_generator Create an ecommerce product details page with product images, specifications, reviews, and an add to cart button'</p>
      </div>
      <div class="k-p-4 k-rounded-md" style="background: var(--kendo-component-bg)">
        <p class="k-font-family-monospace k-text-base k-m-0">'#kendo_ui_generator Build a registration form with email and password inputs, a "where did you hear about us" text area, and an agreement checkbox'</p>
      </div>
    </div>
  </div>

  <div class="k-d-grid k-grid-cols-3 k-gap-5">
    <kendo-card width="100%">
      <kendo-card-header>
        <span kendoCardTitle class="k-font-weight-bold">🎨 UI Generator</span>
      </kendo-card-header>
      <kendo-card-body>
        <p class="k-mb-3">Build complete pages and sections from a plain-language description, combining the right tools automatically.</p>
        <p><strong>Examples:</strong> Dashboards, landing pages, admin panels</p>
      </kendo-card-body>
    </kendo-card>

    <kendo-card width="100%">
      <kendo-card-header>
        <span kendoCardTitle class="k-font-weight-bold">🧩 Component Assistant</span>
      </kendo-card-header>
      <kendo-card-body>
        <p class="k-mb-3">Generate Angular components with the necessary configuration tailored to your specific requirements.</p>
        <p><strong>Components:</strong> Grid, Chart, Scheduler, Form, Navigation</p>
      </kendo-card-body>
    </kendo-card>

    <kendo-card width="100%">
      <kendo-card-header>
        <span kendoCardTitle class="k-font-weight-bold">📐 Layout Assistant</span>
      </kendo-card-header>
      <kendo-card-body>
        <p class="k-mb-3">Build and arrange layouts, spacing your UI elements precisely for any screen size without writing custom CSS.</p>
        <p><strong>Utilities:</strong> Flexbox, Grid, Spacing, Typography</p>
      </kendo-card-body>
    </kendo-card>
  </div>
</div>
```
