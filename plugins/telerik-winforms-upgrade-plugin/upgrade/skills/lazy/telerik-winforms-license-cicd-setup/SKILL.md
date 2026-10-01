---
name: telerik-winforms-license-cicd-setup
description: >
  Configure Telerik UI for WinForms license activation for a build pipeline —
  deployment keys, environment variables, secure-file approaches, and the
  script-key-as-build-step fallback for pipelines that cannot use NuGet.
  Never handles or stores actual secret values; only wires up the
  indirection (variable/secret names, file paths).
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms CI/CD Licensing Configuration

Sets up license activation for a build pipeline. Only invoked when a
pipeline is detected or the customer asks — never assume one exists.

## Inputs

- Per-project `mechanism` from `telerik-winforms-license-detection`
  (NuGet-based vs. script-key — determines which of Step 1/Step 3 below
  applies).
- The CI/CD platform in use, if known (GitHub Actions, Azure Pipelines,
  other). If unknown, ask rather than guessing a platform-specific syntax.

## Preconditions

- A pipeline definition was found in the repository, or the customer
  explicitly asked for CI/CD licensing setup.
- The project's licensing mechanism is already known (run
  `telerik-winforms-license-detection` first if not).

## Key Type: Deployment Keys, Not Personal Keys

CI/CD activation uses a **deployment key** — a distinct key type tied to a
specific application and its set of products, obtained from the
[Deployment Keys](https://www.telerik.com/account/downloads/deployment-keys)
page (**Add Application** → name, public/private, product set). Deployment
keys **cannot be used for local application development**, and a personal
developer license key is not a substitute for one in CI. Do not conflate the
two key types — mixing them up is itself a documented cause of activation
failures.

## Step 1: NuGet-Based Projects (Recommended, Default)

1. Confirm `Telerik.Licensing` restores for the projects being built.
2. Recommend the **environment-variable** approach: an env var/secret named
   exactly `TELERIK_LICENSE` set to the deployment key value.
   - **GitHub Actions**: a repository or organization *Secret* named
     `TELERIK_LICENSE`; reference it as
     `env: TELERIK_LICENSE: ${{ secrets.TELERIK_LICENSE }}` on the build step.
   - **Azure Pipelines**: a secret pipeline variable named `TELERIK_LICENSE`.
     Variable Groups have a size limit that a license key can exceed — for
     long values, link the group to Azure Key Vault, use a normal (non-group)
     pipeline variable, or use the secure-files approach below instead.
3. **Never write the literal key value into pipeline YAML in plain text** —
   always reference it through a secret/variable.

## Step 2: Azure DevOps Secure Files (Alternative, No Size Limit)

Use when the license key would exceed a Variable Group's size limit, or the
team prefers file-based secrets. Requires `Telerik.Licensing` **1.4.10 or
later**.

- Set the `TELERIK_LICENSE_PATH` variable to the secure file's resolved
  path, **or** copy the secure file to `telerik-license.txt` in the project
  or a parent directory.
- **YAML pipeline**: `DownloadSecureFile@1` task (give it a `name`), then set
  `TELERIK_LICENSE_PATH: $(<name>.secureFilePath)` as a build-step env var.
- **Classic pipeline**: a "Download secure file" task, then either a
  PowerShell step that sets `TELERIK_LICENSE_PATH` via
  `##vso[task.setvariable variable=TELERIK_LICENSE_PATH;]$(<name>.secureFilePath)`,
  or a PowerShell step that copies the file to
  `$(Build.Repository.LocalPath)/telerik-license.txt`.

## Step 3: Non-NuGet Pipelines (Script-Key Build Step)

Only when the project genuinely cannot use NuGet packages:

1. From **License Keys → View key (SCRIPT KEY column) → Progress® Telerik® UI for WinForms**,
   have the customer copy the script key.
2. Store it as an environment variable or repository secret (never a plain
   pipeline literal).
3. Add a build task that writes a new `TelerikLicense.cs` file at build time,
   embedding the script key from that environment variable.
4. Ensure a reference to `Telerik.Licensing.Runtime.dll` is present.
5. **Warn explicitly**: never publish the generated file or the raw key in
   logs or in a public repository.

## Step 4: Self-Hosted / Windows Agent Caveat

The license file (or the environment) must be available to the **Windows
account that actually executes the build**, not the account used to
configure the agent. This is the most common cause of "works locally, fails
on the build server."

## Telerik CLI in Automated Environments

`telerik setup winforms --scope project --nuget-path . --force --no-interactive`
(after `dotnet tool install -g Telerik.CLI`) can configure the Telerik NuGet
feed and download the license key in one non-interactive command instead of
Steps 1–2 above. It still writes `telerik-license.txt` to the profile of the
account running the command, so the Step 4 Windows-account caveat still
applies — the CLI does not bypass it. `telerik login --no-browser` supports
authenticating on agents without interactive browser access.

## Output

- Which key type is being configured (deployment key, confirmed distinct
  from a personal key)
- Which approach was set up (env var / secure file / script-key build step)
  and the exact variable/secret name(s) used
- Platform-specific steps still required from the customer (creating the
  actual secret in their CI system — this skill cannot do that for them)

## Idempotency

If the pipeline already references `TELERIK_LICENSE` or `TELERIK_LICENSE_PATH`
correctly, report that and make no changes.
