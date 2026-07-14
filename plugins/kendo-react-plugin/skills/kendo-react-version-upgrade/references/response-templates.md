# Safe Response Templates — KendoReact Version Upgrade

Paraphrase to fit the developer's situation.

---

## "Should I upgrade?"

```text
It depends on your motivation and current version. A few questions first:

1. What version are you currently on?
2. What's driving the upgrade — a specific bug fix, a new feature, compliance policy, or React version support?
3. How many KendoReact components does your project use?

If you need a specific fix that's available in a minor or patch release within your current major,
upgrade within the major first — that's zero-risk under semver and doesn't require any code changes.

If you need features from a newer major, I can walk you through the breaking changes at each
version boundary so you know exactly what's involved before you commit.
```

---

## "Is it safe to go from vX to vY?"

```text
KendoReact follows semver, so minor and patch upgrades within the same major are always safe.

Crossing a major version boundary may introduce breaking changes. The versions with documented
breaking changes are: 9, 10, 11, 12, 14, and 15. Notably, v13 has no breaking changes at all.

Going from v[X] to v[Y] crosses [N] major boundaries. I'd recommend walking through each one
sequentially rather than jumping directly. The Kendo CLI can help:

  kendo migrate --from=[X] --to=[X+1]

Would you like me to summarize the breaking changes for each step?
```

---

## "What broke in v15?"

```text
v15.0.0 (May 2026) is the most impactful major since v11. Three categories of changes:

1. Several components were converted to functional components — if you access refs to Calendar,
   Menu, Barcode, or QRCode, the ref type changed from a class instance to a Handle type
   (e.g., CalendarHandle instead of Calendar).

2. The 'dark' and 'light' themeColor values were removed from Button, Icon, Badge, AppBar, Loader,
   and several other components. Each component now has a standardized set of valid values.

3. SVG icons v5.0.0 renamed and consolidated several icons (e.g., caretAltDownIcon is now
   chevronDownIcon). Font icon aliases were removed entirely.

There's an icon codemod available to automate the icon migration. For the full list, see:
https://www.telerik.com/kendo-react-ui/components/updates/breaking-changes/15-0-0
```

---

## "My app broke after upgrading"

```text
Let's figure out what happened. A few things to check:

1. Did you cross a major version boundary? Check your package.json for the old version
   and compare with what's installed now (npm ls @progress/kendo-react-grid).

2. Are ALL @progress/kendo-react-* packages on the same version? Mixed versions cause
   unpredictable failures.

3. Did you also update the @progress/kendo-theme-* packages? Mismatched themes are the
   most common cause of post-upgrade styling issues.

If you crossed a major boundary, I can walk you through the breaking changes for that version
so we can identify which change caused the issue.
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

I can help you find the right version boundary for your coverage window.
```

---

## "How do I use kendo migrate?"

```text
The Kendo CLI provides automated codemods for major version migrations:

  # Install the CLI
  npm i -g @progress/kendo-cli

  # Run guided migration (prompts at each step)
  kendo migrate

  # Migrate a specific package between specific versions
  kendo migrate @progress/kendo-react-grid --from 10 --to 11

  # Quick mode — no prompts
  kendo migrate --force

The CLI handles package updates and code transformations. After each run, review any code
comments it adds — they flag areas needing manual adjustment.

Codemods are available for the v10→v11, v11→v12, v13→v14, and v14→v15 boundaries.
v12→v13 has no breaking changes and needs no codemods — it's a safe upgrade.

For the full CLI reference, see:
https://www.telerik.com/kendo-react-ui/components/migration/assisted-migration
```

---

## "I'm stuck on an old React version — can I still use KendoReact?"

> Note: Verified directly against the npm registry — `@progress/kendo-react-grid` publishes
> only `latest`, `next`, and `dev` dist-tags. There is no per-React-version tagged release
> line, so there's nothing to pin to for an older React version. The only path forward is
> upgrading React itself.

```text
KendoReact requires React v18.0.0 or higher. There's no legacy tier or pinned release line
for older React versions — KendoReact doesn't publish per-React-version tagged releases.

If you're on React 17 or earlier, you'll need to upgrade React itself before you can install
or upgrade KendoReact. Check the React upgrade guide: https://react.dev/blog

If Kendo is already installed and working on an older React version, staying on your current
KendoReact version is fine — you just won't be able to move to a newer Kendo major until React
is upgraded too. There's no pinned-but-compatible middle ground; it's upgrade React or stay put.
```

---

## "Which theme version goes with my KendoReact version?"

```text
KendoReact and theme version numbers don't track each other — for example,
KendoReact v14 uses themes v13, and KendoReact v9 uses themes v10.

Here's the compatibility matrix from the changelog:

  KendoReact v14.3–v14.4  →  themes ^13.1.1
  KendoReact v14.0–v14.2  →  themes ^13.0.0
  KendoReact v13.x        →  themes ^12.2.3
  KendoReact v12.x        →  themes ^12.0.0
  KendoReact v11.x        →  themes 11.0–11.3
  KendoReact v10.x        →  themes ^10.3–10.4
  KendoReact v9.x         →  themes ^10.0–10.2

After upgrading KendoReact, always check the "Supported Themes" block in the changelog
for your exact version, then upgrade themes to match:
  npx npm-check-updates --upgrade --filter "/@progress/kendo-theme.*/"
  npm install

Don't upgrade themes without also upgrading KendoReact — newer themes may expect
rendering changes from newer component versions.
```