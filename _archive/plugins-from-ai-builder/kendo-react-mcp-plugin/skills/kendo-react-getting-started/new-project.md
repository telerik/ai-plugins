# Getting Started with KendoReact — New Project

This guide walks you through creating a new React project using the Kendo CLI and setting up KendoReact.

Execute the following steps **in order**. Run all provided commands automatically.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or later** installed on your machine
- If Node.js is not available, install the latest Node.js automatically as a preliminary step before running any `npx` commands

---

## Step 1: Ensure Kendo CLI is Installed

Install the Kendo CLI tool globally:

```bash
npm i -g @progress/kendo-cli@latest
```

This CLI handles the entire project setup including all necessary dependencies and configurations.

---

## Step 2: Create the Project

Create a new KendoReact project using the CLI:

```bash
npx kendo react create vite <project-name> --theme=<theme>
```

This command creates a complete KendoReact project with Vite, including:
- All necessary KendoReact packages
- Proper licensing configuration
- Theme setup (`<theme-display>` theme)
- Project structure

Navigate to the project directory:

```bash
cd <project-name>
```

---

## Step 3: Remove Dark Color Scheme from index.css

Open `src/index.css` and remove the dark color scheme from the first `:root` style block. Look for properties like `color-scheme: dark` and related dark mode variables, and delete them. Keep only the light theme configuration.

---

## Step 4: Activate Kendo License

This step is required to use KendoReact components without watermarks and with access to all features:

```bash
npx kendo license activate
```

---

## Step 5: Run the Application

The Kendo CLI has set up everything you need. Start the development server:

**Verification:** Automatically run the application. Do not just inform the user — execute the following command and keep the application running:

```bash
cd <project-name> && npm run dev
```

The application should start and open your browser to see your KendoReact application.

---

## Step 6: Create Sample Page

Before adding new content to the homepage, clear all existing CSS on the page. Remove or reset any custom styles that might conflict with the new content.

Replace the content of `src/Home.tsx` with the following to showcase KendoReact features and verify components are working correctly:

```tsx
import { Card, CardHeader, CardTitle, CardBody } from '@progress/kendo-react-layout';
import './Home.css';

function Home() {
  return (
    <div className="k-d-flex k-flex-col k-gap-5 k-p-6 k-container">
      <div className="k-d-flex k-flex-col k-align-items-center k-gap-3 k-py-4">
        <h1 className="k-h2 k-text-center">KendoReact</h1>
        <p className="k-h5 k-text-center k-color-subtle k-font-weight-normal k-max-w-3xl">
          Create sophisticated React UIs with AI-powered agents using natural language prompts
        </p>
      </div>

      <div className="k-text-center k-py-2">
        <p className="k-font-size-lg k-font-weight-bold k-mb-4">
          😊 Ready to build? Copy any prompt below directly into your coding agent to get started
        </p>
        <div className="k-d-grid k-grid-cols-3 k-gap-4 k-max-w-screen-xl k-mx-auto">
          <div className="prompt-box k-p-4 k-rounded-md">
            <p className="k-font-family-monospace k-text-base k-m-0">
              '#kendo_ui_generator Create a dashboard with sales charts, revenue KPIs, and a recent orders grid'
            </p>
          </div>
          <div className="prompt-box k-p-4 k-rounded-md">
            <p className="k-font-family-monospace k-text-base k-m-0">
              '#kendo_ui_generator Create an ecommerce product details page with product images, specifications, reviews, and an add to cart button'
            </p>
          </div>
          <div className="prompt-box k-p-4 k-rounded-md">
            <p className="k-font-family-monospace k-text-base k-m-0">
              '#kendo_ui_generator Build a registration form with email and password inputs, where did you learn about us text area, and agreement checkbox'
            </p>
          </div>
        </div>
      </div>

      <div className="k-text-center">
        <p className="k-font-size-lg k-font-weight-bold k-mb-0 k-mt-4">
          🛠 Explore the tools available to help you build faster
        </p>
      </div>

      <div className="k-d-grid k-grid-cols-3 k-gap-5 k-max-w-screen-xl k-mx-auto">
        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">🎨 UI Generator</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Build complete pages and sections from a plain-language description, combining the right tools automatically.</p>
            <p className="k-font-size-lg"><strong>Examples:</strong> Dashboards, landing pages, admin panels</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">🧩 Component Assistant</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Generate React components with the necessary configuration tailored to your specific requirements.</p>
            <p className="k-font-size-lg"><strong>Components:</strong> Grid, Chart, Scheduler, Form, Navigation</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">📐 Layout Assistant</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Build and arrange layouts, spacing your UI elements precisely for any screen size without writing custom CSS.</p>
            <p className="k-font-size-lg"><strong>Utilities:</strong> Flexbox, Grid, Spacing, Typography</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">🎯 Icon Assistant</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Find the right icon for any action or concept and get it wired up with the correct React syntax.</p>
            <p className="k-font-size-lg"><strong>Features:</strong> Suggests the best icons based on your scenario</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">♿ Accessibility Assistant</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Ensure your components meet modern accessibility standards and best practices for inclusive design.</p>
            <p className="k-font-size-lg"><strong>Checks:</strong> ARIA attributes, keyboard navigation, color contrast, screen reader support</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="k-py-2">
            <CardTitle><span className="card-title k-font-weight-bold">🎨 Style Assistant</span></CardTitle>
          </CardHeader>
          <CardBody>
            <p className="k-mb-3 k-font-size-lg">Apply a custom color scheme or brand identity consistently across all components in one step.</p>
            <p className="k-font-size-lg"><strong>Customization:</strong> Color schemes, branding, appearance</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
```

Add the following styles to `src/Home.css`:

```css
.prompt-box {
  position: relative;
  border-radius: var(--kendo-border-radius-lg, 0.375rem);
  border: 2px solid transparent;
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(105deg, #c158e4 11.99%, #0bf 49.33%, #001dff 88.12%) border-box;
  box-shadow: var(--kendo-elevation-4);
}

.card-title {
  font-size: 1.2rem;
  letter-spacing: 0.01em;
}
```
