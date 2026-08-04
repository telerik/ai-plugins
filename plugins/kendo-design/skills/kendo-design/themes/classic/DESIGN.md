---
version: alpha
name: Kendo Classic
theme: classic
description: The Kendo Design System — a modern, balanced visual identity for data-rich professional interfaces, built on perceptually uniform oklch color space.
colors:
  app-surface: "#ffffff"
  on-app-surface: "#262626"
  subtle: "#666666"
  surface: "#f0f0f0"
  surface-alt: "#ffffff"
  border: "#cacaca"
  border-alt: "#b6b6b6"
  base: { base: "#ebebeb", on-base: "#262626", base-hover: "#dddddd", base-active: "#d6d6d6", base-subtle: "#f0f0f0", base-subtle-hover: "#ebebeb", base-subtle-active: "#dddddd", base-emphasis: "#cacaca", base-on-subtle: "#262626", base-on-surface: "#262626" }
  primary: { primary: "#f35800", on-primary: "#ffffff", primary-hover: "#e05102", primary-active: "#cc4a04", primary-subtle: "#fff1ec", primary-subtle-hover: "#ffe4d9", primary-subtle-active: "#ffd6c7", primary-emphasis: "#ff8758", primary-on-subtle: "#3e1505", primary-on-surface: "#f35800" }
  secondary: { secondary: "#b6b6b6", on-secondary: "#000000", secondary-hover: "#a3a3a3", secondary-active: "#8f8f8f", secondary-subtle: "#cacaca", secondary-subtle-hover: "#b6b6b6", secondary-subtle-active: "#a3a3a3", secondary-emphasis: "#7a7a7a", secondary-on-subtle: "#262626", secondary-on-surface: "#8f8f8f" }
  tertiary: { tertiary: "#03a9f4", on-tertiary: "#ffffff", tertiary-hover: "#049be0", tertiary-active: "#078ecd", tertiary-subtle: "#a3dcff", tertiary-subtle-hover: "#7dceff", tertiary-subtle-active: "#58c1ff", tertiary-emphasis: "#3cb9ff", tertiary-on-subtle: "#06354f", tertiary-on-surface: "#0873a7" }
  info: { info: "#007bc3", on-info: "#ffffff", info-hover: "#0371b3", info-active: "#0267a4", info-subtle: "#cfe3f5", info-subtle-hover: "#accfee", info-subtle-active: "#75afe0", info-emphasis: "#4e99d6", info-on-subtle: "#052a45", info-on-surface: "#065485" }
  success: { success: "#3ea44e", on-success: "#ffffff", success-hover: "#399748", success-active: "#358a42", success-subtle: "#bddfbf", success-subtle-hover: "#a1d1a3", success-subtle-active: "#85c48a", success-emphasis: "#71bb78", success-on-subtle: "#16391b", success-on-surface: "#2a7035" }
  warning: { warning: "#ffa41f", on-warning: "#000000", warning-hover: "#fb9c00", warning-active: "#e78f00", warning-subtle: "#ffdbaf", warning-subtle-hover: "#ffd39c", warning-subtle-active: "#ffc275", warning-emphasis: "#ffaf45", warning-on-subtle: "#593500", warning-on-surface: "#ffa41f" }
  error: { error: "#d92800", on-error: "#ffffff", error-hover: "#c82501", error-active: "#b62203", error-subtle: "#f4c3b8", error-subtle-hover: "#f2b4a7", error-subtle-active: "#ec8e7a", error-emphasis: "#e35d45", error-on-subtle: "#4c0d04", error-on-surface: "#941b03" }
  inverse: { inverse: "#404040", on-inverse: "#ffffff", inverse-hover: "#333333", inverse-active: "#272727", inverse-subtle: "#cacaca", inverse-subtle-hover: "#b6b6b6", inverse-subtle-active: "#a3a3a3", inverse-emphasis: "#7a7a7a", inverse-on-subtle: "#000000", inverse-on-surface: "#333333" }
  series-a: { series-a: "#ff6358", series-a-bold: "#bf4a42", series-a-bolder: "#80322c", series-a-subtle: "#ffb2a8", series-a-subtler: "#ff8b7e" }
  series-b: { series-b: "#ffd246", series-b-bold: "#bf9d35", series-b-bolder: "#806923", series-b-subtle: "#ffe8a2", series-b-subtler: "#ffdc74" }
  series-c: { series-c: "#78d237", series-c-bold: "#599d29", series-c-bolder: "#3c691d", series-c-subtle: "#b8ea9e", series-c-subtler: "#96de6c" }
  series-d: { series-d: "#28b4c8", series-d-bold: "#1e8796", series-d-bolder: "#145a64", series-d-subtle: "#93d9e5", series-d-subtler: "#5fc7d8" }
  series-e: { series-e: "#2d73f5", series-e-bold: "#2156b8", series-e-bolder: "#173a7b", series-e-subtle: "#95b9fa", series-e-subtler: "#6196f7" }
  series-f: { series-f: "#9d40b0", series-f-bold: "#7f358f", series-f-bolder: "#55235f", series-f-subtle: "#d5a2df", series-f-subtler: "#bf74ce" }
typography:
  font-family:
    sans: Arial, Verdana, Tahoma, "Trebuchet MS", Helvetica, Impact, Gill Sans
    serif: '"Times New Roman", Georgia, Garamond, Palatino, Baskerville'
    sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
    monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Roboto Mono", "Ubuntu Mono", "Lucida Console", "Courier New", monospace
  font-size: { xxs: 0.5rem, xs: 0.625rem, sm: 0.75rem, md: 0.875rem, lg: 1rem, xl: 1.25rem }
  font-weight: { thin: 100, extra-light: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extra-bold: 800, black: 900 }
  line-height: { xs: 1, sm: 1.25, md: 1.4286, lg: 1.5 }
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
  1: "0 2px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.12)"
  2: "0 4px 6px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.12)"
  3: "0 6px 8px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.12)"
  4: "0 8px 10px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.12)"
  5: "0 14px 16px rgba(0,0,0,.24), 0 4px 16px rgba(0,0,0,.12)"
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
- **line-height** — `xs` (1), `sm` (1.25), `md` (1.4286), `lg` (1.5).
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

Classic does not yet have a dedicated published kit; it shares its visual lineage with the [Default UI kit for Figma](https://www.figma.com/community/file/1661041195763763612/telerik-kendo-ui-kit-for-default-4-0).
