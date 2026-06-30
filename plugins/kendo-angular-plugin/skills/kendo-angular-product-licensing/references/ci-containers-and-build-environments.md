# CI, Containers & Build Environments — Kendo UI for Angular Licensing

Branches for environment-specific activation: CI/CD pipelines, Docker, pnpm/Yarn workspaces, SSR/Angular SSR builds, test runners (Jest/Vitest/Storybook), registry/proxy access, and CI secret-size limits. Read the branch matching the build environment.

### Registry Access Block Before Licensing

```yaml
strong_signals:
    - npm install @progress/kendo-licensing fails with E403 or private registry authorization block.
    - Corporate proxy or Artifactory strips @progress scoped packages.
    - Customer reports install works on personal machine but fails on corporate network.

recommended_resolution:
    - Route to registry/proxy allowlist configuration for the @progress npm scope.
    - Provide registry.npmjs.org allowlist instructions for corporate proxy.
    - Resume activation troubleshooting only after the install path is confirmed unblocked.
    - Advise verifying .npmrc configuration for proxy/registry overrides that may redirect @progress installs.

avoid:
    - Diagnosing license key validity before confirming package install succeeds.
    - Assuming registry block is always an authentication issue rather than allowlist/proxy configuration.
```

---

### Docker and Containerized Build Context

Use when activation succeeds locally but the watermark appears in a Docker build, staging, or cloud deployment.

```yaml
strong_signals:
    - License is valid locally but watermark appears in Docker-based builds or deployments.
    - Multi-stage Dockerfile: key injected in the build stage is not present in the final runtime stage.
    - License file not copied into the Docker image or CI build container.
    - CI pipeline uses a containerized build agent and the node_modules cache is restored — postinstall hooks do not re-run on cache restore, so activation state may be stale.

recommended_resolution:
    - Pass the license key as a build argument or environment variable to the Docker stage that runs npm install.
    - For multi-stage builds: ensure TELERIK_LICENSE is available in every stage that runs npm install or kendo-ui-license activate.
    - Do not COPY telerik-license.txt into the image — inject via ARG/ENV to avoid committing the key to the image.
    - If CI node_modules is cached: add an explicit 'npx kendo-ui-license activate' step after the cache restore step, not only in postinstall.

dockerfile_pattern:
    build_arg_injection: 'ARG TELERIK_LICENSE then ENV TELERIK_LICENSE=$TELERIK_LICENSE in the build stage'
    build_command: 'docker build --build-arg TELERIK_LICENSE=<secret_value> .'
    ci_pattern: Inject via CI platform secret as --build-arg value at container build time.

avoid:
    - Copying telerik-license.txt into the Docker image with a COPY instruction.
    - Assuming postinstall auto-activation re-runs when a cached node_modules layer is restored.
```

Safe response template:

```text
Docker and containerized builds require the license key to be available during the npm install and build steps inside the container. Pass TELERIK_LICENSE as a Docker build argument or environment variable — do not copy the license file into the image. For multi-stage builds, ensure each stage that installs or builds receives the variable. If your CI caches node_modules between runs, add an explicit 'npx kendo-ui-license activate' step after the cache restore rather than relying on postinstall alone.
```

---

### pnpm and Yarn Workspaces Hoisting

Use when activation fails or the watermark persists in a monorepo using pnpm or Yarn workspaces.

```yaml
strong_signals:
    - Project uses pnpm or Yarn workspaces (PnP or Yarn Berry).
    - 'npx kendo-ui-license activate' reports "no product references detected" despite @progress packages being present.
    - Watermark appears in one workspace package but not another.
    - pnpm strict hoisting is active (shamefully-hoist not set or set to false in .npmrc).

root_cause:
    - pnpm in strict mode does not hoist node_modules to the repo root; @progress packages are only visible under individual workspace package roots.
    - Yarn Plug'n'Play (PnP) virtualizes packages — the filesystem structure differs from standard node_modules.
    - '@progress/kendo-licensing' must find @progress packages in the node_modules visible from the activation working directory.

recommended_resolution:
    - For pnpm: run 'pnpm kendo-ui-license activate' from each workspace package that contains @progress packages.
    - For Yarn PnP: set 'nodeLinker: node-modules' in .yarnrc.yml or run activation from each package directory.
    - Alternatively: add 'shamefully-hoist=true' to .npmrc (pnpm only, accepts the hoisting trade-off).
    - Confirm '@progress/kendo-licensing' is v1.11.2 or later.

avoid:
    - Running activation only from the monorepo root when strict hoisting is active.
    - Assuming workspace root node_modules is shared with all sub-packages under pnpm strict mode.
```

Safe response template:

```text
Package managers that restrict hoisting (pnpm in strict mode, Yarn PnP) may prevent 'kendo-ui-license activate' from detecting @progress packages unless it is run from within each workspace package that contains them. Try running activation from the individual package directory rather than the monorepo root.
```

---

### Repository Visibility and npm Metadata Mismatch

```yaml
strong_signals:
    - npm repository URL is inaccessible to customers but visible internally.
    - Customer notes that npm metadata points to an internal repository URL.

recommended_resolution:
    - Clarify this is a metadata visibility or policy scope issue, not an activation failure.
    - Route public-visibility requests as product/repository feedback to the appropriate team.
    - Do not attempt activation troubleshooting for this path.
```

---

### CI Secret Size Limits (Azure DevOps Library)

Use when CI variable storage cannot hold the full license key content.

```yaml
strong_signals:
    - Customer reports newer key length exceeds CI variable field limits (approximately 4.5K characters in Azure DevOps Library).
    - Prior key fit in variable storage but the new key does not.
    - Build pipeline fails because full license content cannot be injected via plain variable.
    - Customer explicitly mentions Azure DevOps secret variable size or variable group limit.

recommended_resolution:
    - Use CI secure-file workflow for license key delivery instead of plain variable fields.
    - Keep key as a file artifact in the pipeline and activate from file-based location.
    - Share official CI secure-file documentation in the response.

command_sequence:
    - Refresh/download key to file: npx -y @progress/kendo-licensing refresh --output telerik-license.txt
    - Install licensing tool: npm i @progress/kendo-licensing
    - Activate from file: npx kendo-ui-license activate

avoid:
    - Promising key-size reduction as a technical workaround.
    - Blocking customer on variable-only injection when the secure-file path is available and recommended.
    - Treating key-length limit as a licensing entitlement issue.

secure_file_workflow_azure_devops:
    - Set TELERIK_LICENSE_PATH to the path of a downloaded secure file instead of injecting full key content as a variable.
    - Requires @progress/kendo-licensing v1.5.0 or later.
    - Reference: DownloadSecureFile@1 task downloads the file; set TELERIK_LICENSE_PATH: $(DownloadTelerikLicenseFile.secureFilePath).
```

---

### SSR and Angular Universal Build Context

Use when the watermark appears in a Angular SSR, Remix, or other SSR framework production build but not during local development.

```yaml
strong_signals:
    - Watermark does not appear in 'ng serve' but appears after 'ng build' or in production deployment.
    - Activation was run before 'ng serve' but not before 'ng build'.
    - License key is present in a local '.env.local' file but not injected into the CI/CD build environment.

key_behaviors:
    - '@progress/kendo-licensing' embeds activation state at build time; it does not re-read the key at server request time or on page load.
    - 'npx kendo-ui-license activate' must be run before 'ng build', not only before 'ng serve'.
    - '.env.local' is not committed and is not available in CI unless the variable is also set as a CI secret.

recommended_resolution:
    - Add 'npx kendo-ui-license activate' as a distinct CI step before the 'ng build' step.
    - Inject TELERIK_LICENSE into the build stage as an environment variable via CI secret management.
    - Do NOT prefix the variable with NEXT_PUBLIC_ — this would embed the key content in the browser bundle.

avoid:
    - Assuming 'ng serve' activation covers 'ng build' in the same session.
    - Using NEXT_PUBLIC_TELERIK_LICENSE — key would be exposed in the public JS bundle.
```

Safe response template:

```text
For Angular SSR and SSR projects, license activation must occur before each production build ('ng build'), not only before the dev server ('ng serve'). Please add 'npx kendo-ui-license activate' as a dedicated step before your build step in CI, and ensure TELERIK_LICENSE is injected as an environment variable — do not use the NEXT_PUBLIC_ prefix, as that would embed the key in the browser bundle.
```

---

## CI Setup Reference

General rules for all CI/CD environments:

```yaml
ci_general_rules:
    - Step order is mandatory: install dependencies first, then activate license, then build.
    - '@progress/kendo-licensing' must be installed before running kendo-ui-license activate.
    - Do NOT hardcode the license key value in pipeline scripts or committed files.
    - Use TELERIK_LICENSE as the variable name. KENDO_UI_LICENSE is the pre-2025 Q1 legacy name.
    - npx kendo-ui-license activate returns a non-zero exit code on failure, suitable as a CI gate step.
```

Platform setup summaries:

```yaml
github_actions:
    secret_name: TELERIK_LICENSE
    step_order: npm_install → kendo_ui_license_activate → build
    env_injection: 'env: TELERIK_LICENSE: ${{ secrets.TELERIK_LICENSE }}'
    setup: Create as Repository Secret or Organization Secret in GitHub repository settings.

vercel:
    variable_name: TELERIK_LICENSE
    setup: Project Settings → Environment Variables → add TELERIK_LICENSE.
    install_command_override: Set Install Command to include npm install and npx kendo-ui-license activate.

azure_pipelines_yaml:
    variable_name: TELERIK_LICENSE
    step_order: npm_install → activate → build
    env_injection: 'env: TELERIK_LICENSE: $(TELERIK_LICENSE)'
    windows_agent_command: call npx kendo-ui-license activate
    linux_agent_command: npx kendo-ui-license activate

azure_devops_secure_files:
    use_when: license key exceeds Azure DevOps Library variable size limit (approximately 4.5K characters)
    task: DownloadSecureFile@1
    env_var: TELERIK_LICENSE_PATH set to $(DownloadTelerikLicenseFile.secureFilePath)
    requires: '@progress/kendo-licensing v1.5.0 or later'
    note: Secure files do not have the size limitations of plain variable fields.
```

---

## Test and Storybook Environment Warnings

Use when the customer sees console licensing warnings only during unit tests (Jest, Vitest) or Storybook builds, not in the running application.

```yaml
strong_signals:
    - Licensing warnings appear in test output or Storybook build but not in the app dev server or production build.
    - TELERIK_LICENSE is set in the developer shell but not in the test runner environment.
    - Customer did not change any Kendo code and warnings appeared after adding tests or Storybook.

root_cause:
    - Test runners (Jest, Vitest) and Storybook run in isolated processes that do not inherit the developer shell environment unless explicitly configured.
    - '@progress/kendo-licensing' validates on every component render; if the runner process has no key source, every test that renders a licensed component will log a warning.
    - This does not indicate a licensing problem — it indicates the test process has no key source.

recommended_resolution:
    - For Vitest or Jest: add TELERIK_LICENSE to the test environment block in vitest.config.ts or jest.config.js, or load from .env.test using dotenv.
    - For Storybook: add TELERIK_LICENSE to the Storybook process env in .env.storybook or via storybook.main.js env config.
    - CI: ensure TELERIK_LICENSE is injected into the CI step that runs tests, not only the build step.
    - Local: add 'TELERIK_LICENSE=$(cat telerik-license.txt)' before the test command, or add a .env.test file (not committed).

avoid:
    - Treating test environment warnings as account or key validity failures.
    - Asking the customer to re-download or renew their key when the issue is runner process isolation.
    - Suppressing warnings by downgrading @progress/kendo-licensing.
```

Safe response template:

```text
Licensing warnings in test or Storybook output indicate that the test runner process does not have TELERIK_LICENSE available — they do not mean your license is invalid. Test runners are isolated processes that do not inherit your shell environment automatically. Please add TELERIK_LICENSE to your test environment configuration (vitest.config.ts, jest.config.js, or .env.test) so the runner process can access it.
```
