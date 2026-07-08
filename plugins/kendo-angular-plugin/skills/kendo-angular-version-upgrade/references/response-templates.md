# Safe Response Templates — Kendo UI for Angular Version Upgrade

Paraphrase to fit the developer's situation.

---

## "Should I upgrade?"

```text
For Kendo UI for Angular, the first question is always: what Angular framework version are you on?

A few questions:

1. What Angular version is your project currently on?
2. What Kendo UI for Angular version are you currently on?
3. What's driving the upgrade — a specific bug fix, a new feature, compliance, or Angular framework support?
4. How many components does your project use?

If you need a specific fix that's available in a minor or patch within your current major,
upgrade within the major first — that's zero-risk under semver.

If you need features from a newer major, I can walk you through the breaking changes — and
critically, check whether your Angular version supports the target Kendo version. Kendo v22+
requires Angular 19+, for example.
```

---

## "Is it safe to go from vX to vY?"

```text
Kendo UI for Angular follows semver, so minor and patch upgrades within the same major are always safe.

Crossing a major version boundary may introduce breaking changes AND may require an Angular
framework upgrade. The versions with breaking changes are: 19, 20, 21, 22 (framework-only), 23, 24.

Going from v[X] to v[Y] crosses [N] major boundaries. I'd recommend:

  1. Confirm your Angular framework version supports v[Y]. If not, upgrade Angular first.
  2. Walk through each Kendo major sequentially, not directly.

The Kendo CLI can help:

  kendo migrate @progress/kendo-angular-grid --from=[X] --to=[X+1]

Or, if you have an active Trial or Subscription license, the Upgrade Assistant in the
Kendo UI for Angular MCP server can drive the entire migration end-to-end with AI assistance.

Would you like me to summarize the breaking changes for each step?
```

---

## "What broke in v24?"

```text
v24.0.0 (May 2026) is the headline themeColor cleanup release. Three categories of changes:

1. The 'light' and 'dark' themeColor values were removed across many components: Button,
   FloatingActionButton, Icon, Badge, Loader, Avatar, AppBar, BottomNavigation. Loader and
   Avatar also dropped 'success', 'warning', 'error', 'info', and 'inverse'.

2. Dialog and Window had their themeColor property removed entirely (no replacement).

3. Several type renames: ButtonSize became per-component (DropDownButtonSize, SplitButtonSize,
   FloatingActionButtonSize), and Tooltip's themeColor was renamed to tooltipThemeColor.

Plus: Icons v5.0.0 with consolidated names, the new Meridian theme, and WebMCP support
(no breaking impact for existing code).

Codemods cover 8 packages: Buttons, Icons, Indicators, Layout, Navigation, Dialog,
Conversational UI, and Spreadsheet. Run:

  kendo migrate --from=23 --to=24

For the full list: https://www.telerik.com/kendo-angular-ui/components/available-codemods
```

---

## "What broke in v23?"

```text
v23.0.0 (February 2026) has the widest visual impact of any recent major. The headline change:

Appearance options (fillMode, themeColor, rounded, size) now default to undefined. The default
style now comes from your Kendo theme instead of being set explicitly. The 'none' value was also
removed from fillMode, size, and themeColor (still valid for rounded).

This means every component using those options needs visual review after upgrade — even without
code changes, the rendering may differ. There's NO codemod for this change because it requires
human judgment about whether to accept the new theme defaults or set values explicitly.

Chat also had changes (enableFileSelect → fileSelectButton, enableSpeechToText → speechToTextButton)
with codemods available.

v23 also requires upgrading themes to v13.x — the matching theme version restructures
component class names (combined classes split into separate fill mode + theme color). Custom CSS
targeting old combined Kendo class names will break.
```

---

## "What broke in v22?"

```text
v22.0.0 (January 2026) has NO API breaking changes. The only change is that Angular 18 framework
support was dropped — projects must be on Angular 19+ to use Kendo Angular v22+.

If your project is on Angular 19 or later, upgrading Kendo Angular v21 → v22 requires zero
code changes. There are no codemods because there's nothing to codemod.

If you're on Angular 18, you'll need to upgrade Angular first using the official update guide
at https://angular.dev/update-guide. If you can't upgrade Angular (legacy constraints), stay on
Kendo v21.x or use a distribution tag (e.g. @ng18).
```

---

## "My app broke after upgrading"

```text
Let's figure out what happened. A few things to check:

1. Did your Angular framework version change too? Mismatched Angular+Kendo versions cause
   peer dependency errors. Run 'ng version' and 'npm ls @progress/kendo-angular-grid'.

2. Did you cross a major version boundary? Check your package.json git history.

3. Are ALL @progress/kendo-angular-* packages on the same major version? Mixed versions
   cause unpredictable failures.

4. Did you also update the @progress/kendo-theme-* packages? Check the changelog's
   'Supported Themes' block for your target Kendo Angular version.

5. If you upgraded to v23, did you visually review components using fillMode, themeColor,
   rounded, or size? Their defaults changed to undefined.

If you crossed a major boundary, I can walk you through the breaking changes for that
version so we can identify which change caused the issue.
```

---

## "I have a perpetual license — can I upgrade?"

```text
Perpetual licenses cover only package versions released before the license expiry date.
If you upgrade to a version released after that date, you'll see TKL102 at activation.

Before upgrading, check your license coverage date and compare it against the target version's
release date. If the target version is outside your coverage window, you'll need to either:
  - Renew your license to extend coverage
  - Stay on the last covered version

For Kendo UI for Angular, this is a SEPARATE constraint from the Angular framework requirement —
an upgrade can be blocked by either one independently, or both at once. Check both before
committing to a target version:
  1. Is the target version within your license coverage window?
  2. Does the target version support your current Angular framework version?

I can help you find the right version boundary that satisfies both. For anything beyond
finding that boundary — renewal, coverage extension, TKL102 specifics — that's handled by
license support rather than this upgrade guidance.
```

---

## "I'm stuck on Angular 18 — can I still use Kendo?"

```text
Yes — use a distribution tag to pin to the last Kendo version compatible with Angular 18:

  npm install @progress/kendo-angular-grid@ng18

You must apply the SAME tag to ALL @progress/kendo-angular-* packages — mixing tags is not
supported. Distribution tags are available for Angular v2 through v18.

You'll be staying on a pinned Kendo version (no new features), but you'll have a stable,
compatible setup. When you're ready to upgrade Angular, you can then upgrade Kendo to a
newer major.

To add a package to a legacy Angular project, use ng add:

  ng add @progress/kendo-angular-buttons@ng18
```

---

## "Which theme version goes with my Kendo Angular version?"

```text
Kendo Angular and theme version numbers don't track each other — for example,
Kendo Angular v24 uses themes ^14.1.0, and Kendo Angular v23 uses themes ^13.x.

Here's the recent compatibility from the changelog:

  Kendo Angular v24.0.x  →  themes ^14.1.0 (Meridian theme available)
  Kendo Angular v23.3+   →  themes 13.1.1
  Kendo Angular v23.0–v23.2  →  themes 13.0.0 / 13.0.1
  Kendo Angular v22.x    →  themes 12.3.0

For older versions, check the changelog's "Supported Themes" block at:
https://www.telerik.com/kendo-angular-ui/components/changelogs/kendo-angular-ui

After upgrading Kendo Angular, upgrade themes to match:
  npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
  npm install

Don't upgrade themes without also upgrading Kendo Angular — newer themes may expect
rendering changes from newer component versions.
```

---

## "How do I use the Upgrade Assistant?"

```text
The Upgrade Assistant is an AI-powered tool in the Kendo UI for Angular MCP server that
combines Kendo CLI codemods with AI code analysis. It runs codemods automatically AND uses
AI reasoning to resolve remaining compilation errors in one continuous flow.

Requirements:
- Active Trial or Subscription license (perpetual licenses don't include MCP tools)
- @progress/kendo-angular-mcp configured in your IDE (VS Code, Cursor, JetBrains)

To use it, invoke the Upgrade Assistant handle in your IDE's AI chat and describe your upgrade.
For example: "I'm on Kendo Angular v20 and want to go to v22 — guide me through it."

If you don't have an eligible license, the alternative is the Kendo CLI directly:

  kendo migrate @progress/kendo-angular-grid --from=20 --to=21

Both approaches use the same underlying codemods. The Upgrade Assistant adds AI-driven
error resolution on top of automated transformations.
```

---

## "How do I use kendo migrate?"

```text
The Kendo CLI provides automated codemods for Kendo UI for Angular major version migrations:

  # Install the CLI globally
  npm i -g @progress/kendo-cli

  # Run guided migration (prompts at each step)
  kendo migrate

  # Migrate a specific package between specific versions
  kendo migrate @progress/kendo-angular-grid --from=23 --to=24

  # Migrate all packages
  kendo migrate

The CLI handles package updates and code transformations. After each run, review any code
comments — they flag areas needing manual adjustment.

Codemods are available for v18→v19, v19→v20, v20→v21, v22→v23, and v23→v24. v21→v22 has
no codemods because the only breaking change is dropping Angular 18 framework support.

For the full codemod list per version: https://www.telerik.com/kendo-angular-ui/components/available-codemods
For the full CLI reference: https://www.telerik.com/kendo-angular-ui/components/assisted-migration
```