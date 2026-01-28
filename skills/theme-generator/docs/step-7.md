# Step 7: Dark mode + optional overrides

## Dark mode overrides
- Override only what differs (inherit everything else)
- Ensure contrast and states remain readable

### Dark mode palette decision (CRITICAL)

```
ALWAYS: Create BOTH palettes in @theme inline { }:
  - Brand palette: --color-<name>-*
  - Gray palette: --color-<name>-gray-*

Light mode: ALWAYS uses custom gray palette (--color-<name>-gray-*)

Dark mode:
  IF user requested "matching dark mode" / "cohesive dark" / "consistent colors":
    -> Use custom gray palette: var(--color-<name>-gray-*) for dark mode neutrals

  ELSE (DEFAULT):
    -> Use Tailwind gray for dark mode: var(--color-zinc-*) or var(--color-stone-*)
    -> Choose based on brand warmth (warm brand -> stone, cool brand -> zinc)
```

Example:
- "soft rose theme" -> Light uses custom gray, Dark uses Tailwind gray (zinc/neutral)
- "soft rose theme with matching dark mode" -> Both use custom gray

DEFAULT (no matching dark mode requested):

| Brand Color | Tailwind Gray for Dark Mode |
|-------------|----------------------------|
| Warm (orange, amber, brown) | `stone` or `neutral` |
| Cool (blue, cyan, teal, indigo) | `zinc`, `slate`, or `gray` |
| Neutral (purple, green) | `zinc` or `neutral` |

```css
/* Single-palette: brand only, Tailwind gray for dark mode */
@theme theme-<name> inline {
  --color-<name>-50: oklch(...);
  /* ... brand palette only ... */
  --color-<name>-950: oklch(...);
}

[data-theme="theme-<name>"].dark {
  --background: var(--color-stone-950);  /* Tailwind gray */
  --background-1: var(--color-stone-900);
  /* ... */
}
```

DUAL-PALETTE MODE (when matching dark mode requested):

```css
/* Dual-palette: brand + custom gray */
@theme theme-<name> inline {
  /* Brand palette (vibrant) */
  --color-<name>-50: oklch(97% 0.08 <hue>);
  --color-<name>-100: oklch(94% 0.10 <hue>);
  /* ... */
  --color-<name>-950: oklch(20% 0.06 <hue>);

  /* Gray palette (bell curve chroma - low at dark end for clean dark mode) */
  --color-<name>-gray-50: oklch(98% 0.002 <hue>);
  --color-<name>-gray-100: oklch(95.5% 0.004 <hue>);
  /* ... midtones peak at 0.020 ... */
  --color-<name>-gray-800: oklch(34.6% 0.008 <hue>);  /* Very low */
  --color-<name>-gray-900: oklch(30.6% 0.005 <hue>);  /* Almost neutral */
  --color-<name>-gray-950: oklch(20% 0.003 <hue>);    /* Nearly pure dark */
}

[data-theme="theme-<name>"].dark {
  --background: var(--color-<name>-gray-950);  /* Custom gray */
  --background-1: var(--color-<name>-gray-900);
  --foreground: var(--color-<name>-gray-100);
  /* ... all neutrals use custom gray palette ... */
}
```

Always use CSS variables, never hardcoded oklch in dark mode:

```css
/* Good - readable and maintainable */
--background: var(--color-<name>-gray-900);

/* Bad - impossible to understand */
--background: oklch(21.1% 0.006 285.9);
```

## Optional typography tokens
- Only if requested; place inside the theme selector

## Optional behavior overrides
- Only if requested; must follow Rule 8
