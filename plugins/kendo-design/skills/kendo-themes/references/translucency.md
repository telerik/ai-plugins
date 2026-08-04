# Translucency

The translucency system layers semi-transparent, blurred backgrounds onto elevated and overlapping surfaces for a frosted-glass depth effect.

## Available Tokens

| CSS Variable | Description |
|---|---|
| `--kendo-translucency-base` | Base strength of the effect (opacity/blur). `0%` disables it — surfaces stay fully opaque until set. |

## Usage Guidelines

- Scale the value with a surface's elevation — pair it with the matching `--kendo-elevation-*` level so blur and shadow reinforce the same depth cue.
- Apply it to both the backdrop and the floating surface together so the layering reads correctly.
- Keep it at `0%` for surfaces holding dense text or data, where legibility matters more than the effect.

## Customization

### CSS Override

```css
:root {
    --kendo-translucency-base: 50%;
}
```

### Sass Override

```scss
@use "@progress/kendo-theme-meridian/scss/index.scss" as * with (
    $kendo-translucency-base: 50%
);
```

### Using Translucency in Custom Components

```css
.my-panel {
    background: color-mix(in srgb, var(--kendo-color-surface) calc(100% - var(--kendo-translucency-base)), transparent);
    backdrop-filter: blur(calc(var(--kendo-translucency-base) * 0.2px));
}
```
