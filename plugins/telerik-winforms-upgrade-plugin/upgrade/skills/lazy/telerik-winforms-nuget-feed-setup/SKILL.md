---
name: telerik-winforms-nuget-feed-setup
description: >
  Determine which NuGet feed can resolve Telerik UI for WinForms packages for
  a given version, inspect existing NuGet configuration, validate that the
  feed actually resolves Telerik packages, and guide the user through
  Telerik NuGet server setup when required. Never handles or stores
  credentials.
metadata:
  discovery: lazy
  importance: high
  traits: .NET|CSharp|VisualBasic|DotNetCore|WinForms|WindowsForms
---

# Telerik WinForms NuGet Feed Setup

Determine, validate, and — only when needed — help configure the NuGet feed a
Telerik UI for WinForms package restore depends on.

## Step 1: Determine the Required Feed

- **Telerik version `2026.3.812` or later** → packages are available on
  [NuGet.org](https://www.nuget.org/); no special configuration is expected.
- **Telerik version before `2026.3.812`** → the Telerik NuGet server
  (`https://nuget.telerik.com/v3/index.json`) is required.

Determine the version **first** (see `telerik-winforms-reference-detection`)
— it decides which feed applies. A solution with projects on different
Telerik versions may need both feeds configured.

## Step 2: Inspect Existing Configuration

- Look for a `nuget.config`/`NuGet.Config` at the solution root, or any
  parent directory above it (project/solution-level scope).
- Inspect the global configuration: `%AppData%\NuGet\NuGet.Config` (Windows)
  or `~/.nuget/NuGet/NuGet.Config` (Mac/Linux).
- Enumerate every configured source, regardless of where it's defined:
  ```
  dotnet nuget list source
  ```

## Step 3: Validate Resolution

- **NuGet.org path**: confirm it isn't disabled in the `dotnet nuget list
  source` output — it's usually a default source, so this is normally
  already satisfied.
- **Telerik NuGet server path**: confirm a source pointing at
  `https://nuget.telerik.com/v3/index.json` is registered, then test that it
  actually resolves a Telerik package, e.g.:
  ```
  dotnet package search Telerik.UI.for.WinForms.Common --source https://nuget.telerik.com/v3/index.json
  ```
  Treat an authentication failure as "needs setup," and a missing/unreachable
  source as "needs configuration" — report the distinction to the user
  rather than a single generic failure.

Do not proceed to package installation while the required feed is unresolved.

## Step 4: Setup Guidance (Telerik NuGet Server Only)

When the Telerik NuGet server is required and not yet working, tell the user
explicitly **why**: their Telerik version predates `2026.3.812`, so NuGet.org
does not carry it.

- **Package source name**: any descriptive name (e.g. "Telerik NuGet Feed")
- **Package source URL**: `https://nuget.telerik.com/v3/index.json`
- **Authentication**: username `api-key`, password = their generated Telerik
  NuGet API key from the Telerik account **API Keys** page

**Never enter, fabricate, guess, or store the key on the user's behalf.**
Instruct the user to supply it themselves, and prefer the
environment-variable pattern over an inline credential: a `NuGet.Config`
`<packageSourceCredentials>` entry whose `ClearTextPassword` value is an
environment-variable placeholder (e.g. `%TELERIK_NUGET_API_KEY%`) rather than
the literal key, so the key is never written to a file that could reach
source control.

Reference for CI/CLI-specific setup:
<https://docs.telerik.com/devtools/winforms/visual-studio-integration/install-nuget-keys>

## Step 5: Report

State plainly: which feed is required, whether it's configured, whether it
resolves Telerik packages, and any action still needed from the user.

## Notes

- Detection and validation are read-only and safe to re-run at any time.
- Adding a package source that already exists should be a no-op — check
  first with `dotnet nuget list source` rather than adding a duplicate.
