---
version: alpha
name: Kendo Material
theme: material
description: The Kendo Design System — a Material Design–based visual identity for data-rich professional interfaces, built on perceptually uniform oklch color space. Uses Roboto typography together with Material Design elevation and shape conventions.
colors:
  app-surface: "#fefbff"
  on-app-surface: "#1d1b20"
  subtle: "#49454f"
  surface: "#f7f3fa"
  surface-alt: "#fffdff"
  border: "#1d1b201f"
  border-alt: "#1d1b2026"
  base: { base: "#eae5ec", on-base: "#4a4459", base-hover: "#e2dde4", base-active: "#ddd8df", base-subtle: "#ddd8df", base-subtle-hover: "#e2dde4", base-subtle-active: "#eae5ec", base-emphasis: "#736678", base-on-subtle: "#4a4459", base-on-surface: "#4a4459" }
  primary: { primary: "#65558f", on-primary: "#ffffff", primary-hover: "#6d5d98", primary-active: "#7767a2", primary-subtle: "#e6deff", primary-subtle-hover: "#dcd4f7", primary-subtle-active: "#d5cdf3", primary-emphasis: "#b3a7d9", primary-on-subtle: "#523689", primary-on-surface: "#65558f" }
  secondary: { secondary: "#e8def8", on-secondary: "#4a4459", secondary-hover: "#ded4ee", secondary-active: "#d8cee8", secondary-subtle: "#635b71", secondary-subtle-hover: "#70677e", secondary-subtle-active: "#776e85", secondary-emphasis: "#b7aec6", secondary-on-subtle: "#ffffff", secondary-on-surface: "#4a4459" }
  tertiary: { tertiary: "#7d5260", on-tertiary: "#ffffff", tertiary-hover: "#87606c", tertiary-active: "#8d6773", tertiary-subtle: "#ffd8e3", tertiary-subtle-hover: "#f5ceda", tertiary-subtle-active: "#efc8d4", tertiary-emphasis: "#8d6773", tertiary-on-subtle: "#633b48", tertiary-on-surface: "#633b48" }
  info: { info: "#2c6ddd", on-info: "#ffffff", info-hover: "#215fca", info-active: "#1a4ea7", info-subtle: "#c1d5f5", info-subtle-hover: "#afc8f2", info-subtle-active: "#95b6ee", info-emphasis: "#7ba4ea", info-on-subtle: "#133672", info-on-surface: "#1a4ea7" }
  success: { success: "#1b7e3f", on-success: "#ffffff", success-hover: "#196d37", success-active: "#155c2e", success-subtle: "#d9f4de", success-subtle-hover: "#c2eeca", success-subtle-active: "#abe9b8", success-emphasis: "#73db8e", success-on-subtle: "#114321", success-on-surface: "#196d37" }
  warning: { warning: "#f5ca47", on-warning: "#000000", warning-hover: "#f1c32b", warning-active: "#ecbd0a", warning-subtle: "#fdedc0", warning-subtle-hover: "#fce5a8", warning-subtle-active: "#fbde90", warning-emphasis: "#f8d46e", warning-on-subtle: "#705909", warning-on-surface: "#705909" }
  error: { error: "#b3261e", on-error: "#ffffff", error-hover: "#9b1e17", error-active: "#7f100c", error-subtle: "#f9deda", error-subtle-hover: "#f5c7bf", error-subtle-active: "#f0ada3", error-emphasis: "#e3706a", error-on-subtle: "#7f100c", error-on-surface: "#9b1e17" }
  inverse: { inverse: "#322f35", on-inverse: "#ffffff", inverse-hover: "#3a363e", inverse-active: "#4a454e", inverse-subtle: "#b1abb7", inverse-subtle-hover: "#cdc7d4", inverse-subtle-active: "#ddd8e1", inverse-emphasis: "#79747e", inverse-on-subtle: "#79747e", inverse-on-surface: "#322f35" }
  series-a: { series-a: "#9c27b0", series-a-bold: "#751d84", series-a-bolder: "#4e1458", series-a-subtle: "#b55dc5", series-a-subtler: "#cd93d7" }
  series-b: { series-b: "#2196f3", series-b-bold: "#1c71b6", series-b-bolder: "#134b7a", series-b-subtle: "#60aef8", series-b-subtler: "#96c9fc" }
  series-c: { series-c: "#009688", series-c-bold: "#007166", series-c-bolder: "#00584e", series-c-subtle: "#43b0a2", series-c-subtler: "#82cbc0" }
  series-d: { series-d: "#ffeb3b", series-d-bold: "#bfb02c", series-d-bolder: "#80761e", series-d-subtle: "#fff06c", series-d-subtler: "#fff59d" }
  series-e: { series-e: "#dd352c", series-e-bold: "#b3261f", series-e-bolder: "#85231c", series-e-subtle: "#e87a6c", series-e-subtler: "#f0aea4" }
  series-f: { series-f: "#4caf50", series-f-bold: "#39833c", series-f-bolder: "#265828", series-f-subtle: "#7bc37b", series-f-subtler: "#a8d7a7" }
typography:
  font-family:
    sans: Arial, Verdana, Tahoma, "Trebuchet MS", Helvetica, Impact, Gill Sans
    serif: '"Times New Roman", Georgia, Garamond, Palatino, Baskerville'
    sans-serif: Roboto, "Helvetica Neue", sans-serif
    monospace: Consolas, "Ubuntu Mono", "Lucida Console", "Courier New", monospace
  font-size: { xxs: 0.5rem, xs: 0.625rem, sm: 0.75rem, md: 0.875rem, lg: 1rem, xl: 1.25rem }
  font-weight: { thin: 100, extra-light: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extra-bold: 800, black: 900 }
  line-height: { xs: 1, sm: 1.33, md: 1.4286, lg: 1.5 }
  letter-spacing:
    base: null
    tightest: -0.5px
    tighter: -0.25px
    tight: -0.1px
    normal: 0.25px
    wide: 0.1px
    wider: 0.25px
    widest: 0.5px
  variants:
    heading-xl: { family: sans-serif, size: xl, weight: semibold, line-height: md }
    heading-lg: { family: sans-serif, size: lg, weight: semibold, line-height: md }
    heading-md: { family: sans-serif, size: md, weight: semibold, line-height: md }
    heading-sm: { family: sans-serif, size: sm, weight: semibold, line-height: sm }
    body-md: { family: sans-serif, size: md, weight: normal, line-height: md }
    body-sm: { family: sans-serif, size: sm, weight: normal, line-height: sm }
    body-xs: { family: sans-serif, size: xs, weight: normal, line-height: sm }
    label-lg: { family: sans-serif, size: md, weight: medium, line-height: md }
    label-md: { family: sans-serif, size: sm, weight: medium, line-height: sm }
    label-sm: { family: sans-serif, size: xs, weight: medium, line-height: sm }
    code: { family: monospace, size: md, weight: normal, line-height: sm }
rounded:
  base: 0.25rem
  none: 0px
  xs: 0.0625rem
  sm: 0.125rem
  md: 0.25rem
  lg: 0.5rem
  xl: 0.75rem
  xxl: 1rem
  xxxl: 1.25rem
  full: calc(0.25rem * 9999)
spacing:
  base: 0.25rem
  0: 0px
  1px: 1px
  0.5: 0.125rem
  1: 0.25rem
  1.5: 0.375rem
  2: 0.5rem
  2.5: 0.625rem
  3: 0.75rem
  3.5: 0.875rem
  4: 1rem
  4.5: 1.125rem
  5: 1.25rem
  5.5: 1.375rem
  6: 1.5rem
  6.5: 1.625rem
  7: 1.75rem
  7.5: 1.875rem
  8: 2rem
  9: 2.25rem
  10: 2.5rem
  11: 2.75rem
  12: 3rem
  13: 3.25rem
  14: 3.5rem
  15: 3.75rem
  16: 4rem
  17: 4.25rem
  18: 4.5rem
  19: 4.75rem
  20: 5rem
  21: 5.25rem
  22: 5.5rem
  23: 5.75rem
  24: 6rem
elevation:
  1: "0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
  2: "0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)"
  3: "0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
  4: "0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
  5: "0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)"
motion:
  global: null
  durations:
    instant: 0ms
    immediate: 50ms
    brief: 100ms
    quick: 150ms
    rapid: 200ms
    swift: 250ms
    speedy: 300ms
    brisk: 350ms
    prompt: 400ms
    timely: 450ms
    moderate: 500ms
    measured: 550ms
    steady: 600ms
    leisurely: 700ms
    slow: 800ms
    languid: 900ms
    sluggish: 1000ms
  easings:
    linear: cubic-bezier(0, 0, 1, 1)
    accelerate: cubic-bezier(0.42, 0, 1, 1)
    decelerate: cubic-bezier(0, 0, 0.58, 1)
    standard: cubic-bezier(0.42, 0, 0.58, 1)
    sharp: cubic-bezier(0.75, 0, 0.25, 1)
    bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
    elastic: cubic-bezier(0.5, -0.5, 0.5, 1.5)
    stretchy: cubic-bezier(0.07, 1.81, 0.3, 0.81)
  transitions:
    instant: { duration: instant, easing: linear }
    rapid: { duration: quick, easing: decelerate }
    snappy: { duration: swift, easing: decelerate }
    energetic: { duration: swift, easing: elastic }
    bouncy: { duration: speedy, easing: bounce }
    subtle: { duration: brisk, easing: standard }
    gentle: { duration: prompt, easing: accelerate }
    enter: { duration: speedy, easing: decelerate }
    exit: { duration: rapid, easing: accelerate }
    settle: { duration: brisk, easing: decelerate }
    scale-out: { duration: quick, easing: accelerate }
    scale-in: { duration: rapid, easing: decelerate }
    fade-out: { duration: rapid, easing: standard }
    fade-in: { duration: swift, easing: standard }
    slide-out: { duration: swift, easing: accelerate }
    slide-in: { duration: speedy, easing: decelerate }
    emphasis: { duration: quick, easing: sharp }
    collapse: { duration: speedy, easing: accelerate }
    expand: { duration: prompt, easing: standard }
    shrink: { duration: brisk, easing: accelerate }
    grow: { duration: prompt, easing: standard }
    pulse: { duration: brisk, easing: standard }
    smooth: { duration: moderate, easing: standard }
    flip: { duration: measured, easing: standard }
    fluid: { duration: steady, easing: standard }
    deliberate: { duration: slow, easing: standard }
icons:
  base-px: 16px
  sizing:
    xs: { scale: 75%, default-px: 12px }
    sm: { scale: 87.5%, default-px: 14px }
    md: { scale: 100%, default-px: 16px, default: true }
    lg: { scale: 125%, default-px: 20px }
    xl: { scale: 150%, default-px: 24px }
    xxl: { scale: 200%, default-px: 32px }
    xxxl: { scale: 300%, default-px: 48px }
---

# Kendo Design System

## Overview

Kendo Design System is a balanced, precise, and quietly confident design system for modern enterprise applications. It is optimized for data-rich interfaces, complex components, and multi-panel layouts, while still scaling to marketing pages.

Its visual language combines tonal surfaces, clean geometry, generous whitespace, deliberate elevation, rounded corners, and a semantic accent system. The result is an interface that feels modern, readable, and approachable.

Prioritize clarity, hierarchy, consistency, and accessibility. Use color to communicate state and function, not ornamentation.

## Colors

The color system is built on **semantic tokens** — named roles that carry intent rather than raw hue.

Colors are defined in OKLCH for perceptual uniformity. Semantic variants (hover, active, subtle, emphasis, on-color) are derived automatically from base tokens.

### Surfaces & structure

- `app-surface` — The root application background.
- `surface` — A color used for surfaces, headers, canvases, and containers. A delicate tint distinguishes it from the page.
- `surface-alt` — The alternative surface color, used inside components that already sit on a `surface` fill to create a secondary level of contrast.
- `border` — Default border color, tuned to blend naturally with any interface surface.
- `border-alt` — Border color used for hover-state emphasis.
- `base` — Neutral fill for interactive UI elements that use theme color variants (secondary button, chip).
- `subtle` — Muted text for placeholders, captions, and disabled labels.
- `inverse` — Deep near-black for high-contrast inverted contexts. It is used for overlay-style UI surfaces (overlay background, tooltip).

### Semantic colors

- `primary` — Used for the single most important action on a view and as the anchoring text color for headings.
- `secondary` — Used for secondary actions, active states, and accent elements.
- `tertiary` — Used for decorative highlights, tertiary actions, and badges.
- `info` — Used for informational messages, links, and focus indicators.
- `success` — Used for positive outcomes, confirmations, and valid states.
- `warning` — Used for caution messages and states requiring attention.
- `error` — Used for destructive actions, validation errors, and critical alerts.

### Derived tokens

Every semantic family (`base`, `primary`, `secondary`, `tertiary`, `info`, `success`, `warning`, `error`) expands into the same set of tokens. Same hue and chroma as the family's base token throughout — only lightness (and occasionally chroma) shifts. Compute each value in OKLCH from its family's base color; use the exact token name below, never an invented alternative:

- **Fills** — `-hover` (one step darker), `-active` (two steps darker), `-emphasis` (higher chroma, slightly darker; for accents/borders).
- **Subtle backgrounds** — `-subtle` (much lighter, reduced chroma), `-subtle-hover`, `-subtle-active` (each one step darker than the last).
- **Text/icon pairings** — `on-{family}` (on the fill itself), `{family}-on-subtle` (on `-subtle`), `{family}-on-surface` (on `surface`/`app-surface`) — each lightened or darkened until it clears WCAG AA against its background.

### Data visualization (series)

Chart colors derive from a single `series` base that generates six evenly distributed hues, `series-a` through `series-f`. `series-a` equals the base; `series-b`–`series-f` are hue-rotated from it around the wheel. Override the `series` base color token to re-hue the entire palette at once.

Each of the six hues produces five variants:

| Variant | Token                | Role                             |
| ------- | -------------------- | -------------------------------- |
| Base    | `series-{x}`         | Primary series fill              |
| Bold    | `series-{x}-bold`    | Darker shade (emphasis, borders) |
| Bolder  | `series-{x}-bolder`  | Darkest shade                    |
| Subtle  | `series-{x}-subtle`  | Lighter shade (fills, bands)     |
| Subtler | `series-{x}-subtler` | Lightest shade (backgrounds)     |

That yields the full **6 × 5 = 30-color** chart palette, all reflowing from the one `series` base.

### Guidelines

- Keep the interface visually calm — prioritize neutral palettes and restrained saturation so content stays the focus.
- Build a clear color hierarchy — use color to indicate priority: reserve primary for top actions, while surfaces and core content remain mostly neutral.
- Use color to communicate meaning — apply semantic colors consistently (success, warning, error, info) so users learn and trust their meaning.
- Respect color relationships — use the same ramp or semantic family for related states; mix unrelated hues only when intentionally signaling different meanings.

## Typography

Typography is defined in two tiers. **Axes** (`font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`) are the primitive scales every text style draws from. **Variants** (`typography.variants.*`) are the named, ready-to-use roles that compose those axes — this is the layer product UI should reference. Because each variant references axes by alias, adjusting one axis (for example `font-size.md`) reflows every variant that uses it.

`body-md` is the primary body text style — a highly legible UI sans-serif optimized for clarity at small sizes. `code` is used for code, data, and technical content.

The type scale is intentionally compact — six steps from `font-size.xxs` to `font-size.xl` — suited for data-dense professional interfaces. Larger display sizes are left to the consumer's brand typography.

### Axes

- **font-family** — `sans-serif` (Roboto) is the base family for all UI text; `monospace` for code and technical content. `sans` and `serif` alternatives are also available.
- **font-size** — `xxs` `xs` `sm` `md` `lg` `xl`, a compact six-step scale.
- **font-weight** — full nine-step scale from `thin` (100) through `normal` (400), `medium` (500), `semibold` (600), to `black` (900).
- **line-height** — `xs` (1) for single-line text, `sm` (1.33) and `md` (1.4286) for reading text, `lg` (1.5) for roomy text.
- **letter-spacing** — fine tracking from `tightest` to `widest`; `normal` tracking by default.

### Variant families

- **Headings** (`heading-sm` through `heading-xl`) — Semibold for structural hierarchy: `heading-xl` for page titles, `heading-lg` for section headings, `heading-md` for card/panel titles, `heading-sm` for sub-headings and group labels.
- **Body** (`body-xs` through `body-md`) — Regular weight with generous line height: `body-md` for primary body text, `body-sm` for secondary body text and descriptions, `body-xs` for captions and footnotes.
- **Labels** (`label-sm` through `label-lg`) — Medium weight for single-line scannable text: `label-lg` for prominent labels and navigation, `label-md` for form labels, table headers, and buttons, `label-sm` for compact labels, badges, and chips.
- **Code** — Monospace for inline code, data cells, and technical identifiers.

### Guidelines

- Establish a clear hierarchy — differentiate headings, body text, labels, and captions through size, weight, and spacing.
- Limit text styles — reuse a small set of styles to improve readability and maintain cohesion.
- Use weight before size — adjust font weight for emphasis before adding more font sizes.
- Apply styles by semantic role — use Heading, Body, Label, Caption, and Code as intended, not by appearance alone.
- Don't rely on typography alone — pair type with icons, color, or layout to communicate status or meaning.

## Layout

Spacing follows a proportional scale with a **0.25rem base unit**. Every spacing token is a multiplier of this base, so changing the spacing base token rescales the entire system proportionally.

The same scale serves two roles at once: it defines a component's own internal structure — its edges, and the breathing room between those edges and its content — and it defines the external rhythm between components — how far siblings, sections, and groups sit from one another. These aren't separate systems; a component's density is expressed as much by the space inside it as by the space around it.

### Spacing

The 34-step scale provides granular control:

- **Micro** (0–2): Icon gaps, borders, tight padding.
- **Small** (2.5–4): Input padding, chip spacing, compact layouts.
- **Medium** (4.5–8): Card padding, section gaps, form field spacing.
- **Large** (9–16): Section separators, panel margins, hero padding.
- **Extra-large** (17–24): Page-level margins, major layout divisions.

The half-step tokens (0.5, 1.5, 2.5, etc.) exist for micro-adjustments where whole steps are too coarse.

### Rhythm guidelines

- Use `spacing-2` for a component's own tight internal structure — compact padding, icon-to-label gaps — as much as for tight grouping between siblings.
- Use `spacing-4` between related components, or as a component's padding in a standard-density layout.
- Use `spacing-8` between sections or logical groups.
- Use `spacing-12` or larger for major layout divisions.

Never use arbitrary pixel values. If `spacing-4` is too small and `spacing-8` is too large, use `spacing-6` — do not invent a value outside the scale.

### Guidelines

- Use a consistent spacing scale — define and reuse a limited set of spacing tokens to create rhythm and improve visual cohesion.
- Use spacing to create hierarchy — increase spacing between unrelated groups and reduce spacing within related groups.
- Maintain consistent padding — a component's padding is drawn from the same spacing scale as the gaps around it; choose it deliberately to match the density of its surroundings, not as a browser default or an arbitrary value.
- Preserve alignment — align component, text, and icon edges consistently to improve visual order and readability.

## Elevation

Hierarchy is conveyed primarily through tonal surfaces and borders. Shadows are reserved for elements that genuinely float above the page.

Levels progress from `1` (cards, inputs, inline surfaces) through `2` (popovers, dropdown menus), `3` (floating panels, tooltips), and `4` (drawers, side panels), up to `5` (modals, dialogs). Each theme tunes its shadow color and opacity to its own elevation character, and levels increase progressively in spread and softness to convey physical depth and reinforce hierarchy.

### Guidelines

- Tie elevation to interaction state — keep resting content flat, and raise overlays/modals to higher levels.
- Reserve the highest elevation for blocking overlays — use top depth only for interruptive modals/dialogs.
- Keep sibling floating elements at the same elevation — change levels only for clear parent-child relationships.

## Shapes

The border-radius system derives from a single **base value of `0.25rem` (4px)**. All radius tokens are computed as multipliers of this base, so adjusting the radius base token rescales every corner consistently.

### Scale

Corners scale from `none` (sharp corners — tables, toolbars, dividers) through `xs` (checkboxes, micro-elements) and `sm` (chips, tags, compact controls), up to `md` — the everyday default for buttons, inputs, and cards. Larger steps increase in prominence: `lg` for menus and dialog corners, `xl` for modal containers and large cards, `xxl` for feature panels and hero sections, `xxxl` for full-bleed sections, and `full` for pills, avatars, and circular elements.

### Guidelines

- **Default:** Components use `md` unless they have a specific reason for a different radius.
- **Consistency:** Keep one radius family per context. Do not mix sharp and rounded corners in the same toolbar or card group.
- **Nesting:** Inner elements should use a radius smaller than their container radius.
- **Nested-elements formula for rounded corners:** For visually balanced nested corners, `outer radius = inner radius + padding`. Do not apply this rule above `xxl` to avoid overly oblique containers.

## Motion

Motion is functional. It clarifies transitions and maintains spatial awareness. It should never be decorative by default.

Motion is defined in two tiers, like typography. **Axes** (`durations`, `easings`) are the primitive scales. **Transition presets** (`motion.transitions.*`) are the named, ready-to-use variants that compose one duration alias with one easing alias — this is the layer product UI should reference. Because each preset references axes by alias, retuning an axis (for example `durations.speedy`) reflows every preset that uses it.

### Durations

All durations respect the `motion.global` override token (`null`/unset by default). When set — or automatically, when `prefers-reduced-motion` is active — every duration resolves to that single value instead of its own. Set it to `0.01ms` to effectively disable all motion.

- **Micro-feedback** (`instant`, `immediate`, `brief`) — Immediate state changes, checkbox/radio feedback, button press, focus ring.
- **Interaction** (`quick`, `rapid`, `swift`, `speedy`, `brisk`) — Hover states, menu/tooltip reveals, panel slides, popover entry, drawer/card expansion, complex reveals.
- **Transition** (`prompt`, `timely`, `moderate`, `measured`) — Overlay transitions, deliberate overlay reveals, full-screen transitions, large layout shifts.
- **Ambient** (`steady`, `leisurely`, `slow`, `languid`, `sluggish`) — Sustained layout motion, long relaxed transitions, background animations, very slow ambient motion.

### Easings

- `linear` — Progress bars, continuous motion.
- `accelerate` — Exit animations.
- `decelerate` — Enter animations.
- `standard` — General purpose transitions.
- `sharp` — Snappy state changes.
- `bounce` — Playful emphasis (use sparingly).
- `elastic` — Spring-like motion.
- `stretchy` — Exaggerated physics (use rarely).

### Transition presets

Presets are the **variant** layer of motion: each composes a `duration` axis token with an `easing` axis token, however the implementation resolves those tokens (CSS custom property, JSON design token, platform constant, etc.). Reference a preset rather than a raw duration/easing pair so motion stays consistent. The animated CSS property (opacity, transform) is chosen by the consuming component — presets carry only timing.

Each preset's duration/easing composition is defined in `motion.transitions` in the frontmatter; the use cases below are the guidance layer on top of it.

| **Preset** | **Use**                            |
| ---------- | ----------------------------------- |
| instant    | Immediate, no perceptible motion   |
| rapid      | Hover, focus changes               |
| snappy     | Toggles, selections                |
| energetic  | Spring-like emphasis               |
| bouncy     | Attention, success (use sparingly) |
| subtle     | Slow reveals                       |
| gentle     | Soft, unhurried exits              |
| enter      | Elements appearing                 |
| exit       | Elements leaving                   |
| settle     | Elements coming to rest            |
| scale-out  | Size out (transform)               |
| scale-in   | Size in (transform)                |
| fade-out   | Opacity out                        |
| fade-in    | Opacity in                         |
| slide-out  | Positional out (transform)         |
| slide-in   | Positional in (transform)          |
| emphasis   | Snappy attention cues              |
| collapse   | Collapsing regions                 |
| expand     | Expanding regions                  |
| shrink     | Shrinking elements                 |
| grow       | Growing elements                   |
| pulse      | Repeating attention pulse          |
| smooth     | Smooth, sustained transitions      |
| flip       | Flip/rotate transforms             |
| fluid      | Long, fluid motion                 |
| deliberate | Slowest, most deliberate motion    |

### Guidelines

- Use motion to communicate state, hierarchy, and spatial change — not decoration.
- Keep default motion calm, subtle, and responsive; use expressive motion sparingly.
- Use short durations for micro-interactions and longer durations for overlays or layout changes.

## Iconography

The icon system separates **styling** (defined by the design system) from **content** (defined by the `@progress/kendo-svg-icons` package). Icons inherit text color via `fill: currentColor` and scale proportionally.

### Sizing

All icon sizes derive from a single base (`base-px` = 16px, exposed as an icon-size base token), so changing the base rescales every icon proportionally. Each level in the `icons.sizing` map is a `scale` multiplier applied to that base — the scale and pixel values live in the frontmatter; usage guidance follows:

- `xs` — Dense toolbars, inline affordances.
- `sm` — Compact inline icons.
- `md` — **Default**, used inline with body text.
- `lg` — Standalone actions.
- `xl` — Prominent / decorative.
- `xxl` — Feature icons.
- `xxxl` — Empty-state / hero glyphs.

### Guidelines

- Icons inherit their parent's text color — use semantic color tokens to tint them.
- Use `md` as the default inline icon size. Step up to `lg` or `xl` for standalone or decorative icons.

## Do's and don'ts

- Do use the semantic color system — reference `primary`, `error`, and `surface` rather than hard-coding oklch values.
- Do change one base token (for example `primary`) to rebrand all components that reference it at once.
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI elements).
- Do use the spacing scale consistently — avoid arbitrary pixel values that break rhythm.
- Do keep one border-radius family per view context.
- Do ensure focus indicators are always visible and never removed without an equivalent replacement.
- Do pair state colors with icons or text labels — never signal state with color alone.
- Don't use `surface` and `app-surface` interchangeably — they serve different elevation roles.
- Don't override derived color variants (hover, active, etc.) unless you need precise control — let the relative oklch system compute them.
- Don't rely on an icon alone for meaning — pair it with a text label or provide a tooltip description.

## Figma Kit

The official Material UI kit for Figma: [Telerik & Kendo UI Kit 4.0 for Material](https://www.figma.com/community/file/1661057120855022127/telerik-kendo-ui-kit-4-0-for-material).
