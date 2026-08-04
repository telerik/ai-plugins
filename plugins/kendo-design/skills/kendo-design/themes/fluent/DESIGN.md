---
version: alpha
name: Kendo Fluent
theme: fluent
description: The Kendo Design System — Microsoft Fluent's design language for data-rich professional interfaces, pairing Segoe UI typography and layered depth with a perceptually uniform oklch color space.
colors:
  app-surface: "#fafafa"
  on-app-surface: "#242424"
  subtle: "#707070"
  surface: "#ffffff"
  surface-alt: "#ffffff"
  border: "#242424b8"
  border-alt: "#000000"
  base: { base: "#ffffff", on-base: "#242424", base-hover: "#f5f5f5", base-active: "#ebebeb", base-subtle: "#f5f5f5", base-subtle-hover: "#ebebeb", base-subtle-active: "#e0e0e0", base-emphasis: "#d1d1d1", base-on-subtle: "#242424", base-on-surface: "#242424" }
  primary: { primary: "#0f6cbd", on-primary: "#ffffff", primary-hover: "#125ea3", primary-active: "#17538d", primary-subtle: "#ebf3fc", primary-subtle-hover: "#d0e4fa", primary-subtle-active: "#97c6fa", primary-emphasis: "#add1f9", primary-on-subtle: "#102d4b", primary-on-surface: "#0f6cbd" }
  secondary: { secondary: "#ebebeb", on-secondary: "#616161", secondary-hover: "#f5f5f5", secondary-active: "#fafafa", secondary-subtle: "#f0f0f0", secondary-subtle-hover: "#fafafa", secondary-subtle-active: "#ffffff", secondary-emphasis: "#e0e0e0", secondary-on-subtle: "#616161", secondary-on-surface: "#616161" }
  tertiary: { tertiary: "#c239b3", on-tertiary: "#ffffff", tertiary-hover: "#af33a1", tertiary-active: "#962c8a", tertiary-subtle: "#fdf5fb", tertiary-subtle-hover: "#f6daf1", tertiary-subtle-active: "#efbbe5", tertiary-emphasis: "#efbbe5", tertiary-on-subtle: "#af33a1", tertiary-on-surface: "#c239b3" }
  info: { info: "#3a96dd", on-info: "#242424", info-hover: "#3991d5", info-active: "#51a1e2", info-subtle: "#f6fafe", info-subtle-hover: "#ddecfb", info-subtle-active: "#c0dcf6", info-emphasis: "#c0dcf6", info-on-subtle: "#21547c", info-on-surface: "#3487c7" }
  success: { success: "#107c10", on-success: "#ffffff", success-hover: "#0e700e", success-active: "#0c5e0c", success-subtle: "#f2faf1", success-subtle-hover: "#cbeac7", success-subtle-active: "#a1d79d", success-emphasis: "#a1d79d", success-on-subtle: "#0e700e", success-on-surface: "#107c10" }
  warning: { warning: "#f7630c", on-warning: "#242424", warning-hover: "#de590d", warning-active: "#bc4b0c", warning-subtle: "#fff9f6", warning-subtle-hover: "#ffe4da", warning-subtle-active: "#ffcdb9", warning-emphasis: "#ffcdb9", warning-on-subtle: "#8a370b", warning-on-surface: "#8a370b" }
  error: { error: "#c50f1f", on-error: "#ffffff", error-hover: "#b10e1b", error-active: "#960b16", error-subtle: "#fdf3f2", error-subtle-hover: "#f7d2cd", error-subtle-active: "#efada6", error-emphasis: "#efada6", error-on-subtle: "#b10e1b", error-on-surface: "#c50f1f" }
  inverse: { inverse: "#242424", on-inverse: "#ffffff", inverse-hover: "#424242", inverse-active: "#333333", inverse-subtle: "#616161", inverse-subtle-hover: "#8a8a8a", inverse-subtle-active: "#707070", inverse-emphasis: "#707070", inverse-on-subtle: "#ffffff", inverse-on-surface: "#616161" }
  series-a: { series-a: "#2aa0a4", series-a-bold: "#20787b", series-a-bolder: "#155052", series-a-subtle: "#5fb8bb", series-a-subtler: "#94cfd1" }
  series-b: { series-b: "#ae8c00", series-b-bold: "#836900", series-b-bolder: "#584600", series-b-subtle: "#c7a73f", series-b-subtler: "#dac480" }
  series-c: { series-c: "#e3008c", series-c-bold: "#aa0068", series-c-bolder: "#730044", series-c-subtle: "#ef3d9b", series-c-subtler: "#f87eb5" }
  series-d: { series-d: "#13a10e", series-d-bold: "#0e790b", series-d-bolder: "#095107", series-d-subtle: "#4fb949", series-d-subtler: "#8bd085" }
  series-e: { series-e: "#637cef", series-e-bold: "#4a5db3", series-e-bolder: "#313e78", series-e-subtle: "#c3b1db", series-e-subtler: "#a58bca" }
  series-f: { series-f: "#ca5010", series-f-bold: "#973c0e", series-f-bolder: "#65280b", series-f-subtle: "#d97a54", series-f-subtler: "#e7a58c" }
typography:
  font-family:
    sans: Arial, Verdana, Tahoma, "Trebuchet MS", Helvetica, Impact, Gill Sans
    serif: '"Times New Roman", Georgia, Garamond, Palatino, Baskerville'
    sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
    monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Roboto Mono", "Ubuntu Mono", "Lucida Console", "Courier New", monospace
  font-size: { xxs: 0.5rem, xs: 0.625rem, sm: 0.75rem, md: 0.875rem, lg: 1rem, xl: 1.25rem }
  font-weight: { thin: 100, extra-light: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extra-bold: 800, black: 900 }
  line-height: { xs: 1, sm: 1.25, md: 1.4286, lg: 1.33 }
  letter-spacing:
    base: null
    tightest: -0.15px
    tighter: -0.10px
    tight: -0.5px
    normal: 0px
    wide: 0.5px
    wider: 0.10px
    widest: 0.15px
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
  lg: 0.375rem
  xl: 0.5rem
  xxl: 0.75rem
  xxxl: 1rem
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
  1: "0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)"
  2: "0px 4px 8px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)"
  3: "0px 8px 16px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)"
  4: "0px 14px 28px 0px rgba(0,0,0,0.24), 0px 0px 8px 0px rgba(0,0,0,0.2)"
  5: "0px 32px 64px 0px rgba(0,0,0,0.24), 0px 0px 8px 0px rgba(0,0,0,0.2)"
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

- **font-family** — `sans-serif` for all UI text (the default family); `monospace` for code and technical content. `sans` (Arial-based) and `serif` families are also defined but unused by the variants.
- **font-size** — `xxs` `xs` `sm` `md` `lg` `xl`, a compact six-step scale.
- **font-weight** — full scale `thin` (100) through `black` (900); variants use `normal` (400), `medium` (500), and `semibold` (600).
- **line-height** — `xs` (1), `sm` (1.25), `md` (1.4286), `lg` (1.33).
- **letter-spacing** — fine tracking from `tightest` to `widest`; `normal` tracking by default.

### Variant families

- **Headings** (`heading-sm` through `heading-xl`) — Semibold for structural hierarchy: `heading-xl` for page titles, `heading-lg` for section headings, `heading-md` for card/panel titles, `heading-sm` for sub-headings and group labels.
- **Body** (`body-xs` through `body-md`) — Normal weight (400) with generous line height: `body-md` for primary body text, `body-sm` for secondary body text and descriptions, `body-xs` for captions and footnotes.
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
- **Transition** (`prompt`, `timely`, `moderate`, `measured`) — Overlay transitions, deliberate reveals, full-screen transitions, layout transitions.
- **Ambient** (`steady`, `leisurely`, `slow`, `languid`, `sluggish`) — Large panel motion, expansive transitions, background animations, ambient low-priority motion.

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
| gentle     | Soft exits                         |
| enter      | Elements appearing                 |
| exit       | Elements leaving                   |
| settle     | Elements settling into place       |
| scale-out  | Size out (transform)               |
| scale-in   | Size in (transform)                |
| fade-out   | Opacity out                        |
| fade-in    | Opacity in                         |
| slide-out  | Positional out (transform)         |
| slide-in   | Positional in (transform)          |
| emphasis   | Snappy attention changes           |
| collapse   | Sections collapsing                |
| expand     | Sections expanding                 |
| shrink     | Shrinking elements                 |
| grow       | Growing elements                   |
| pulse      | Pulsing attention                  |
| smooth     | Smooth continuous motion           |
| flip       | Flip transitions                   |
| fluid      | Fluid large-surface motion         |
| deliberate | Deliberate, slow motion            |

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

The official Fluent UI kit for Figma: [Telerik & Kendo UI Kit 3.0 for MS Fluent](https://www.figma.com/community/file/1661069740577053346/telerik-kendo-ui-kit-3-0-for-ms-fluent).
