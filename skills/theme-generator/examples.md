---
name: preline-theme-generator-examples
description: Example inputs and expected outputs for generating Preline themes (full token coverage, data-theme activation only).
---

# Examples — Preline Theme Generator

These examples define what "good output" looks like.

## Example 1 — Calm teal SaaS theme (full theme, clean)

**Input**
- themeName: `seafoam`
- mood: calm, modern SaaS
- primaryHue: teal (180)
- contrast: medium
- style: vibrant
- darkNeutralFamily: zinc

**Expected Structure**
- `@theme theme-seafoam inline { }` contains brand + gray palettes
- Light mode selector: `:root[data-theme="theme-seafoam"], [data-theme="theme-seafoam"]`
- Dark mode selector: `[data-theme="theme-seafoam"].dark`
- Full coverage: global surfaces, borders, primary ramp, states, components
- Dark mode uses Tailwind zinc for neutrals (no matching dark requested)

### Output (truncated)

```css
@import "./theme.css";

/* ------------------------------ */
/* -------- Seafoam ------------- */
/* ------------------------------ */

@theme theme-seafoam inline {
  /* BRAND PALETTE (vibrant) */
  --color-seafoam-50: oklch(97% 0.08 180);
  --color-seafoam-100: oklch(94% 0.10 180);
  --color-seafoam-200: oklch(88% 0.12 180);
  --color-seafoam-300: oklch(80% 0.14 180);
  --color-seafoam-400: oklch(70% 0.16 180);
  --color-seafoam-500: oklch(60% 0.14 180);
  --color-seafoam-600: oklch(52% 0.12 180);
  --color-seafoam-700: oklch(44% 0.10 180);
  --color-seafoam-800: oklch(36% 0.08 180);
  --color-seafoam-900: oklch(28% 0.06 180);
  --color-seafoam-950: oklch(20% 0.05 180);
  
  /* GRAY PALETTE (bell curve chroma) */
  --color-seafoam-gray-50: oklch(98% 0.002 180);
  --color-seafoam-gray-100: oklch(95.5% 0.004 180);
  --color-seafoam-gray-200: oklch(89.7% 0.008 180);
  /* ... 300-700 ... */
  --color-seafoam-gray-800: oklch(34.6% 0.008 180);
  --color-seafoam-gray-900: oklch(30.6% 0.005 180);
  --color-seafoam-gray-950: oklch(20.1% 0.003 180);
}

:root[data-theme="theme-seafoam"],
[data-theme="theme-seafoam"] {
  /* Global */
  --background: var(--color-white);
  --background-1: var(--color-seafoam-gray-50);
  --foreground: var(--color-seafoam-gray-800);
  
  /* Primary ramp */
  --primary-50: var(--color-seafoam-50);
  --primary-100: var(--color-seafoam-100);
  /* ... full ramp ... */
  
  /* Primary states */
  --primary: var(--color-primary-600);
  --primary-foreground: var(--color-white);
  --primary-hover: var(--color-primary-700);
  
  /* Components use custom gray */
  --navbar: var(--color-white);
  --navbar-line: var(--color-seafoam-gray-200);
  /* ... */
}

[data-theme="theme-seafoam"].dark {
  /* Dark mode uses Tailwind zinc */
  --background: var(--color-zinc-800);
  --background-1: var(--color-zinc-900);
  --foreground: var(--color-zinc-200);
  
  --primary: var(--color-seafoam-400);
  --primary-foreground: var(--color-zinc-900); /* Light brand = dark foreground */
  /* ... */
}
```

---

## Example 2 — Retro sharp corners (behavior change must be scoped)

**Input**
- themeName: `arcade`
- mood: retro 90s
- primaryHue: magenta (320)
- contrast: high
- radiusStyle: `retro-sharp`

**Expected Structure**
- Full token coverage
- Theme sets radius tokens in theme selector (NOT in @theme block)
- Any "rounded" behavior override inside `@layer utilities` scoped to theme

### Output (radius section only)

```css
:root[data-theme="theme-arcade"],
[data-theme="theme-arcade"] {
  /* RETRO SHARP CORNERS */
  --radius-sm: 0px;
  --radius-md: 2px;
  --radius-lg: 4px;
  --radius-xl: 4px;
  --radius-2xl: 6px;
  --radius-3xl: 6px;
  
  /* ... rest of tokens ... */
}

/* Optional: Override rounded utility if needed */
@layer utilities {
  :is(:root[data-theme="theme-arcade"], [data-theme="theme-arcade"]) .rounded {
    border-radius: var(--radius-md);
  }
}
```

---

## Example 3 — Theme-scoped font token (no mapping changes)

**Input**
- themeName: `leafy-modern`
- mood: organic, clean
- primaryHue: emerald (145)
- fontSans: `"Roboto", ui-sans-serif, system-ui, sans-serif`

**Expected Structure**
- Theme sets `--font-sans` inside theme selector (NOT in @theme block)
- Theme does NOT import Google Fonts (font loading is separate)
- User enables via `data-theme="theme-leafy-modern"` only

### Output (font section only)

```css
:root[data-theme="theme-leafy-modern"],
[data-theme="theme-leafy-modern"] {
  /* TYPOGRAPHY */
  --font-sans: "Roboto", ui-sans-serif, system-ui, sans-serif;
  
  /* ... rest of tokens ... */
}
```

---

## Example 4 — Brand match with exact primary color

**Input**
- themeName: `brand-x`
- primaryColor: `#2F6BFF` (converts to hue ~225)
- mood: confident, high clarity
- contrast: medium-high

**Expected Structure**
- Script converts hex to hue automatically
- Primary ramp derived coherently from the brand hue
- `--primary-foreground` readable (white on this blue)
- Chart tokens include hex values: `--chart-colors-primary-hex: #2F6BFF;`

### Output (chart section showing hex tokens)

```css
:root[data-theme="theme-brand-x"],
[data-theme="theme-brand-x"] {
  /* ... other tokens ... */
  
  /* CHARTS */
  --chart-primary: var(--color-brand-x-500);
  --chart-colors-primary: var(--color-brand-x-500);
  --chart-colors-primary-hex: #2F6BFF;
  --chart-colors-primary-hex-inverse: #5A8FFF;
  
  --chart-1: var(--color-brand-x-500);
  --chart-colors-chart-1-hex: #2F6BFF;
  /* ... */
}
```
