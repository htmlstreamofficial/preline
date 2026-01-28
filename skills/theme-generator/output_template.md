---
name: preline-theme-generator-output-template
description: A strict output template for generated Preline theme files (full token set, comprehensive coverage, data-theme activation only).
---

# Output Template (Full Theme)

Use this skeleton for every generated theme. Replace `<name>` with the theme name (kebab-case). Fill in ALL token values for a complete theme.

> **Note:** The generate-theme.js script produces output matching this template automatically. See [SKILL.md](./SKILL.md) for interpretive guidance and [docs/token-reference.md](./docs/token-reference.md) for complete token documentation.

---

## Required Structure

```css
@import "./theme.css";

/* ------------------------------ */
/* --------- Theme: <name> ------ */
/* ------------------------------ */

/* ============================================== */
/* OPTIONAL: THEME-SCOPED BEHAVIOR OVERRIDES      */
/* ============================================== */

/* Only include if the theme needs behavior changes (e.g., different border radius, shadows etc.) */
/*
@layer utilities {
  :is(:root[data-theme="theme-<name>"], [data-theme="theme-<name>"]) .rounded {
    border-radius: var(--radius-ui);
  }
}
*/

@theme theme-<name> inline {
  /* ============================================ */
  /* CUSTOM COLOR PALETTES                        */
  /* ============================================ */
  
  /* 
   * ALWAYS create BOTH palettes:
   *   1. Brand palette (--color-<name>-*) — for primary/accent colors
   *   2. Gray palette (--color-<name>-gray-*) — for backgrounds, surfaces, borders
   *
   * Light mode: ALWAYS uses custom gray palette
   *
   * Dark mode behavior:
   *   - DEFAULT: Use Tailwind grays (zinc/stone) — see dark mode section below
   *   - If user says "matching dark mode": Use custom gray palette
   */
  
  /* -------------------------------------------- */
  /* BRAND PALETTE (always required)              */
  /* -------------------------------------------- */
  /* Vibrant by default, soft only if user says "muted/ash/soft" */
  
  --color-<name>-50:  oklch(97%  0.08 <hue>);
  --color-<name>-100: oklch(94%  0.10 <hue>);
  --color-<name>-200: oklch(88%  0.12 <hue>);
  --color-<name>-300: oklch(80%  0.14 <hue>);
  --color-<name>-400: oklch(70%  0.16 <hue>);
  --color-<name>-500: oklch(58%  0.14 <hue>);
  --color-<name>-600: oklch(50%  0.12 <hue>);
  --color-<name>-700: oklch(42%  0.10 <hue>);
  --color-<name>-800: oklch(35%  0.08 <hue>);
  --color-<name>-900: oklch(28%  0.06 <hue>);
  --color-<name>-950: oklch(20%  0.05 <hue>);
  
  /* -------------------------------------------- */
  /* GRAY PALETTE (always required for light mode)*/
  /* -------------------------------------------- */
  /* Used in light mode for cohesive backgrounds, surfaces, borders.
   * Uses bell curve chroma: very low at extremes, peak at midtones.
   * Dark end (800-950) has very low chroma for clean dark mode (if used).
   */
  
  --color-<name>-gray-50:  oklch(98%   0.002 <hue>);  
  --color-<name>-gray-100: oklch(95.5% 0.004 <hue>);
  --color-<name>-gray-200: oklch(89.7% 0.008 <hue>);
  --color-<name>-gray-300: oklch(82.7% 0.012 <hue>);
  --color-<name>-gray-400: oklch(73%   0.018 <hue>);
  --color-<name>-gray-500: oklch(62.5% 0.020 <hue>);
  --color-<name>-gray-600: oklch(52.8% 0.016 <hue>);
  --color-<name>-gray-700: oklch(41.4% 0.012 <hue>);
  --color-<name>-gray-800: oklch(26.9% 0.006 <hue>);
  --color-<name>-gray-900: oklch(20.5% 0.004 <hue>);
  --color-<name>-gray-950: oklch(14.1% 0.002 <hue>);
}

:root[data-theme="theme-<name>"],
[data-theme="theme-<name>"] {
  
  /* ============================================== */
  /* THEME-SPECIFIC OVERRIDES (optional)            */
  /* ============================================== */
  /* Place non-default customizations HERE at top:
   * - Radius overrides (retro sharp corners)
   * - Font overrides
   * - Any theme-specific behavior changes
   * 
   * Example for retro sharp corners:
   * --radius-sm: 0px;
   * --radius-md: 2px;
   * --radius-lg: 4px;
   * --radius-xl: 4px;
   * --radius-2xl: 6px;
   * --radius-3xl: 6px;
   */
  
  /* ============================================ */
  /* GLOBAL SURFACES + TEXT                       */
  /* ============================================ */
  
  --background-1: ...;
  --background-2: ...;
  --foreground: ...;
  
  --inverse: ...;
  
  /* ============================================ */
  /* BORDERS (Full Scale)                         */
  /* ============================================ */
  
  --border: ...;
  --border-line-1: ...;
  --border-line-2: ...;
  --border-line-3: ...;
  --border-line-4: ...;
  --border-line-5: ...;
  --border-line-6: ...;
  --border-line-7: ...;
  --border-line-8: ...;
  
  /* ============================================ */
  /* PRIMARY RAMP (Full 11-shade scale)           */
  /* ============================================ */
  
  --primary-50: ...;
  --primary-100: ...;
  --primary-200: ...;
  --primary-300: ...;
  --primary-400: ...;
  --primary-500: ...;
  --primary-600: ...;
  --primary-700: ...;
  --primary-800: ...;
  --primary-900: ...;
  --primary-950: ...;
  
  /* PRIMARY STATES */
  --primary: ...;
  --primary-hover: ...;
  --primary-focus: ...;
  --primary-active: ...;
  --primary-checked: ...;
  
  /* ============================================ */
  /* SECONDARY                                    */
  /* ============================================ */
  
  --secondary: ...;
  --secondary-hover: ...;
  --secondary-focus: ...;
  --secondary-active: ...;
  
  /* ============================================ */
  /* LAYER                                        */
  /* ============================================ */
  
  --layer-line: ...;
  --layer-foreground: ...;
  --layer-hover: ...;
  --layer-focus: ...;
  --layer-active: ...;
  
  /* ============================================ */
  /* SURFACE                                      */
  /* ============================================ */
  
  --surface: ...;
  --surface-1: ...;
  --surface-2: ...;
  --surface-3: ...;
  --surface-4: ...;
  --surface-5: ...;
  --surface-foreground: ...;
  --surface-hover: ...;
  --surface-focus: ...;
  --surface-active: ...;
  
  /* ============================================ */
  /* MUTED                                        */
  /* ============================================ */
  
  --muted: ...;
  --muted-foreground: ...;
  --muted-foreground-1: ...;
  --muted-foreground-2: ...;
  --muted-hover: ...;
  --muted-focus: ...;
  --muted-active: ...;
  
  /* ============================================ */
  /* NAVBAR (Base)                                */
  /* ============================================ */
  
  --navbar-line: ...;
  --navbar-divider: ...;
  --navbar-nav-foreground: ...;
  --navbar-nav-hover: ...;
  --navbar-nav-focus: ...;
  --navbar-nav-active: ...;
  --navbar-nav-list-divider: ...;
  --navbar-inverse: ...;
  
  /* NAVBAR-1 (Subtle/tinted variant) */
  --navbar-1: ...;
  --navbar-1-line: ...;
  --navbar-1-divider: ...;
  --navbar-1-nav-foreground: ...;
  --navbar-1-nav-hover: ...;
  --navbar-1-nav-focus: ...;
  --navbar-1-nav-active: ...;
  --navbar-1-nav-list-divider: ...;
  
  /* NAVBAR-2 (Stronger tint variant) */
  --navbar-2: ...;
  --navbar-2-divider: ...;
  --navbar-2-nav-foreground: ...;
  --navbar-2-nav-hover: ...;
  --navbar-2-nav-focus: ...;
  --navbar-2-nav-active: ...;
  --navbar-2-nav-list-divider: ...;
  
  /* ============================================ */
  /* SIDEBAR (Base)                               */
  /* ============================================ */
  
  --sidebar-line: ...;
  --sidebar-divider: ...;
  --sidebar-nav-foreground: ...;
  --sidebar-nav-hover: ...;
  --sidebar-nav-focus: ...;
  --sidebar-nav-active: ...;
  --sidebar-nav-list-divider: ...;
  --sidebar-inverse: ...;
  
  /* SIDEBAR-1 */
  --sidebar-1: ...;
  --sidebar-1-line: ...;
  --sidebar-1-divider: ...;
  --sidebar-1-nav-foreground: ...;
  --sidebar-1-nav-hover: ...;
  --sidebar-1-nav-focus: ...;
  --sidebar-1-nav-active: ...;
  --sidebar-1-nav-list-divider: ...;
  
  /* SIDEBAR-2 */
  --sidebar-2: ...;
  --sidebar-2-divider: ...;
  --sidebar-2-nav-foreground: ...;
  --sidebar-2-nav-hover: ...;
  --sidebar-2-nav-focus: ...;
  --sidebar-2-nav-active: ...;
  --sidebar-2-nav-list-divider: ...;
  
  /* ============================================ */
  /* CARD                                         */
  /* ============================================ */
  
  --card-line: ...;
  --card-divider: ...;
  --card-header: ...;
  --card-footer: ...;
  --card-inverse: ...;
  
  /* ============================================ */
  /* DROPDOWN                                     */
  /* ============================================ */
  
  --dropdown-divider: ...;
  --dropdown-header: ...;
  --dropdown-footer: ...;
  --dropdown-item-foreground: ...;
  --dropdown-item-hover: ...;
  --dropdown-item-focus: ...;
  --dropdown-item-active: ...;
  --dropdown-inverse: ...;
  
  /* ============================================ */
  /* SELECT                                       */
  /* ============================================ */
  
  --select-item-foreground: ...;
  --select-item-hover: ...;
  --select-item-focus: ...;
  --select-item-active: ...;
  --select-inverse: ...;
  
  /* ============================================ */
  /* OVERLAY                                      */
  /* ============================================ */
  
  --overlay-divider: ...;
  --overlay-header: ...;
  --overlay-footer: ...;
  --overlay-inverse: ...;
  
  /* ============================================ */
  /* POPOVER, TOOLTIP, TABLE, FOOTER              */
  /* ============================================ */
  
  --popover-line: ...;
  
  --tooltip: ...;
  
  --table-line: ...;
  
  --footer-line: ...;
  --footer-inverse: ...;
  
  /* ============================================ */
  /* SCROLLBAR                                    */
  /* ============================================ */
  
  --scrollbar-track: ...;
  --scrollbar-thumb: ...;
  
  /* ============================================ */
  /* CHARTS (Apexcharts)                          */
  /* ============================================ */
  
  /* IMPORTANT: Avoid using Tailwind's default color variables for gradient Apexcharts colors.
  The Apexcharts plugin does not support the oklch color format, so these colors may not render correctly. */
  
  --chart-colors-background-inverse: ...;
  --chart-colors-foreground: ...;
  --chart-primary: ...;
  --chart-colors-primary: ...;
  --chart-colors-primary-inverse: ...;
  --chart-colors-primary-hex: #......; /* Must be valid hex */
  --chart-colors-primary-hex-inverse: #......; /* Must be valid hex */
  
  --chart-1: ...;
  --chart-colors-chart-1: ...;
  --chart-colors-chart-1-inverse: ...;
  --chart-colors-chart-1-hex: #......;
  --chart-colors-chart-1-hex-inverse: #......;
  
  --chart-2: ...;
  --chart-colors-chart-2: ...;
  --chart-colors-chart-2-inverse: ...;
  --chart-colors-chart-2-hex: #......;
  --chart-colors-chart-2-hex-inverse: #......;
  
  --chart-3: ...;
  --chart-colors-chart-3: ...;
  --chart-colors-chart-3-inverse: ...;
  --chart-colors-chart-3-hex: #......;
  --chart-colors-chart-3-hex-inverse: #......;
  
  --chart-4: ...;
  --chart-colors-chart-4: ...;
  --chart-colors-chart-4-inverse: ...;
  --chart-colors-chart-4-hex: #......;
  --chart-colors-chart-4-hex-inverse: #......;
  
  --chart-5: ...;
  --chart-colors-chart-5: ...;
  --chart-colors-chart-5-inverse: ...;
  --chart-colors-chart-5-hex: #......;
  --chart-colors-chart-5-hex-inverse: #......;
  
  --chart-6: ...;
  --chart-colors-chart-6: ...;
  --chart-colors-chart-6-inverse: ...;
  --chart-colors-chart-6-hex: #......;
  --chart-colors-chart-6-hex-inverse: #......;
  
  --chart-7: ...;
  --chart-colors-chart-7: ...;
  --chart-colors-chart-7-inverse: ...;
  --chart-colors-chart-7-hex: #......;
  --chart-colors-chart-7-hex-inverse: #......;
  
  --chart-8: ...;
  --chart-colors-chart-8: ...;
  --chart-colors-chart-8-inverse: ...;
  --chart-colors-chart-8-hex: #......;
  --chart-colors-chart-8-hex-inverse: #......;
  
  --chart-9: ...;
  --chart-colors-chart-9: ...;
  --chart-colors-chart-9-inverse: ...;
  --chart-colors-chart-9-hex: #......;
  --chart-colors-chart-9-hex-inverse: #......;
  
  --chart-10: ...;
  --chart-colors-chart-10: ...;
  --chart-colors-chart-10-inverse: ...;
  --chart-colors-chart-10-hex: #......;
  --chart-colors-chart-10-hex-inverse: #......;
  
  --chart-colors-candlestick-upward: ...;
  --chart-colors-candlestick-upward-inverse: ...;
  --chart-colors-candlestick-downward: ...;
  --chart-colors-candlestick-downward-inverse: ...;
  
  --chart-colors-labels: ...;
  --chart-colors-labels-inverse: ...;
  --chart-colors-xaxis-labels: ...;
  --chart-colors-xaxis-labels-inverse: ...;
  --chart-colors-yaxis-labels: ...;
  --chart-colors-yaxis-labels-inverse: ...;
  
  --chart-colors-grid-border: ...;
  --chart-colors-grid-border-inverse: ...;
  --chart-colors-bar-ranges: ...;
  --chart-colors-bar-ranges-inverse: ...;
  
  /* ============================================ */
  /* MAPS (jsvectormap)                           */
  /* ============================================ */
  
  --map-colors-primary: ...;
  --map-colors-primary-inverse: ...;
  --map-colors-default: ...;
  --map-colors-default-inverse: ...;
  --map-colors-highlight: ...;
  --map-colors-highlight-inverse: ...;
  --map-colors-border: ...;
  --map-colors-border-inverse: ...;
}

/* ============================================== */
/* DARK MODE OVERRIDES                            */
/* ============================================== */

[data-theme="theme-<name>"].dark {
  
  /* ============================================ */
  /* DARK MODE OVERRIDES                          */
  /* ============================================ */
  
  /* 
   * CRITICAL: Choose correct mode based on user request
   *
   * DEFAULT (no "matching dark mode" requested):
   *   Use Tailwind grayscale (stone/zinc/slate) based on brand warmth:
   *   - Warm brands (orange/amber/brown/rose) → stone or neutral
   *   - Cool brands (blue/cyan/teal/indigo) → zinc or slate
   *
   * IF USER REQUESTED "matching dark mode":
   *   Use custom gray palette: var(--color-<name>-gray-*)
   *   (uncomment the dual-palette section below and comment out Tailwind section)
   */
  
  /* -------------------------------------------- */
  /* DEFAULT: Use Tailwind gray for dark mode     */
  /* -------------------------------------------- */
  
  /* BACKGROUNDS - dark end of scale (800-950) */
  --background: var(--color-stone-950);
  --background-1: var(--color-stone-900);
  --background-2: var(--color-stone-800);
  --foreground: var(--color-stone-200);
  
  --inverse: var(--color-stone-50);
  
  /* BORDERS - mid-dark range (700-900) */
  --border: var(--color-stone-800);
  --border-line-inverse: var(--color-stone-200);
  --border-line-1: var(--color-stone-900);
  --border-line-2: var(--color-stone-850);
  --border-line-3: var(--color-stone-800);
  --border-line-4: var(--color-stone-750);
  --border-line-5: var(--color-stone-700);
  --border-line-6: var(--color-stone-650);
  --border-line-7: var(--color-stone-600);
  --border-line-8: var(--color-stone-550);
  
  /* -------------------------------------------- */
  /* DUAL-PALETTE: Use custom gray (uncomment)    */
  /* -------------------------------------------- */
  /*
  --background: var(--color-<name>-gray-950);
  --background-1: var(--color-<name>-gray-900);
  --background-2: var(--color-<name>-gray-800);
  
  --foreground: var(--color-<name>-gray-200);
  
  --inverse: var(--color-<name>-gray-50);
  
  --border: var(--color-<name>-gray-800);
  --border-line-inverse: var(--color-<name>-gray-200);
  --border-line-1: var(--color-<name>-gray-900);
  --border-line-2: var(--color-<name>-gray-850);
  ... etc ...
  */
  
  /* PRIMARY STATES (adjust for dark backgrounds) */
  --primary: var(--color-<name>-400);
  /* 
   * --primary-foreground: DYNAMIC based on brand lightness
   *   Light brands (yellow/lime/cyan hue 50-110 or 160-195): var(--color-<gray>-900)
   *   Dark brands (most colors): var(--color-white)
   */
  --primary-foreground: var(--color-white); /* or var(--color-<gray>-900) for light brands */
  --primary-hover: var(--color-<name>-500);
  --primary-focus: var(--color-<name>-500);
  --primary-active: var(--color-<name>-500);
  --primary-checked: var(--color-<name>-400);
  
  /* SECONDARY */
  --secondary: var(--color-white);
  --secondary-hover: var(--color-stone-100);
  --secondary-focus: var(--color-stone-100);
  --secondary-active: ...;
  
  /* LAYER */
  --layer: ...;
  --layer-line: ...;
  --layer-foreground: ...;
  --layer-hover: ...;
  --layer-focus: ...;
  --layer-active: ...;
  
  /* SURFACE */
  --surface: ...;
  --surface-1: ...;
  --surface-2: ...;
  --surface-3: ...;
  --surface-4: ...;
  --surface-5: ...;
  --surface-foreground: ...;
  --surface-hover: ...;
  --surface-focus: ...;
  --surface-active: ...;
  
  /* MUTED */
  --muted: ...;
  --muted-foreground: ...;
  --muted-foreground-1: ...;
  --muted-foreground-2: ...;
  --muted-hover: ...;
  --muted-focus: ...;
  --muted-active: ...;
  
  /* NAVBAR (all variants) */
  --navbar: ...;
  --navbar-line: ...;
  --navbar-divider: ...;
  --navbar-nav-foreground: ...;
  --navbar-nav-hover: ...;
  --navbar-nav-focus: ...;
  --navbar-nav-active: ...;
  --navbar-nav-list-divider: ...;
  --navbar-inverse: ...;
  
  --navbar-1: ...;
  --navbar-1-line: ...;
  --navbar-1-divider: ...;
  --navbar-1-nav-foreground: ...;
  --navbar-1-nav-hover: ...;
  --navbar-1-nav-focus: ...;
  --navbar-1-nav-active: ...;
  --navbar-1-nav-list-divider: ...;
  
  --navbar-2: ...;
  --navbar-2-divider: ...;
  --navbar-2-nav-foreground: ...;
  --navbar-2-nav-hover: ...;
  --navbar-2-nav-focus: ...;
  --navbar-2-nav-active: ...;
  --navbar-2-nav-list-divider: ...;
  
  /* SIDEBAR (all variants) */
  --sidebar: ...;
  --sidebar-line: ...;
  --sidebar-divider: ...;
  --sidebar-nav-foreground: ...;
  --sidebar-nav-hover: ...;
  --sidebar-nav-focus: ...;
  --sidebar-nav-active: ...;
  --sidebar-nav-list-divider: ...;
  --sidebar-inverse: ...;
  
  --sidebar-1: ...;
  --sidebar-1-line: ...;
  --sidebar-1-divider: ...;
  --sidebar-1-nav-foreground: ...;
  --sidebar-1-nav-hover: ...;
  --sidebar-1-nav-focus: ...;
  --sidebar-1-nav-active: ...;
  --sidebar-1-nav-list-divider: ...;
  
  --sidebar-2: ...;
  --sidebar-2-divider: ...;
  --sidebar-2-nav-foreground: ...;
  --sidebar-2-nav-hover: ...;
  --sidebar-2-nav-focus: ...;
  --sidebar-2-nav-active: ...;
  --sidebar-2-nav-list-divider: ...;
  
  /* CARD */
  --card: ...;
  --card-line: ...;
  --card-divider: ...;
  --card-header: ...;
  --card-footer: ...;
  --card-inverse: ...;
  
  /* DROPDOWN */
  --dropdown: ...;
  --dropdown-1: ...;
  --dropdown-divider: ...;
  --dropdown-header: ...;
  --dropdown-footer: ...;
  --dropdown-item-foreground: ...;
  --dropdown-item-hover: ...;
  --dropdown-item-focus: ...;
  --dropdown-item-active: ...;
  --dropdown-inverse: ...;
  
  /* SELECT */
  --select: ...;
  --select-1: ...;
  --select-item-foreground: ...;
  --select-item-hover: ...;
  --select-item-focus: ...;
  --select-item-active: ...;
  --select-inverse: ...;
  
  /* OVERLAY */
  --overlay: ...;
  --overlay-divider: ...;
  --overlay-header: ...;
  --overlay-footer: ...;
  --overlay-inverse: ...;
  
  /* POPOVER, TOOLTIP, TABLE */
  --popover: ...;
  --popover-line: ...;
  
  --tooltip: ...;
  --tooltip-foreground: ...;
  
  --table-line: ...;
  
  /* SWITCH */
  --switch: ...;
  
  /* FOOTER */
  --footer: ...;
  --footer-line: ...;
  --footer-inverse: ...;
  
  /* SCROLLBAR */
  --scrollbar-track: ...;
  --scrollbar-thumb: ...;
  --scrollbar-track-inverse: ...;
  --scrollbar-thumb-inverse: ...;
  
  /* CHARTS (dark mode adjustments) */
  --chart-primary: ...;
  --chart-5: ...; /* Often needs adjustment */
  --chart-6: ...; /* Often needs adjustment */
  --chart-8: ...;
  --chart-9: ...;
  --chart-10: ...;
}

```

---

## Enable Theme Snippet

Provide this snippet to users for enabling the theme:

### CSS (in tailwind.css or main entry)

```css
@import "tailwindcss";
@import "./themes/theme.css";
@import "./themes/<name>.css";
```

### HTML

```html
<html data-theme="theme-<name>">
  ...
</html>
```

For dark mode, add the `.dark` class:

```html
<html data-theme="theme-<name>" class="dark">
  ...
</html>
```

---

## Notes

**Palette Rules:**
1. `@theme theme-<name> inline { }` ALWAYS contains TWO palettes: brand + gray
2. Light mode ALWAYS uses custom gray palette for backgrounds/surfaces/borders
3. Dark mode DEFAULT: Use Tailwind gray (stone/zinc) based on brand warmth
4. Dark mode if "matching dark mode" requested: Use custom gray palette
5. Brand palette is VIBRANT by default; only use soft/low-chroma if user says "muted/ash/soft"
6. Gray palette uses bell curve chroma (low at 800-950 for clean dark mode)

**Token Rules:**
7. All semantic tokens (`--background`, `--primary`, etc.) go in selector blocks, NOT in @theme block
8. Replace all `...` with actual color values using `var(--color-<family>-<shade>)` format
9. Chart `-hex` tokens MUST contain valid hex values (e.g., `#2563eb`), not CSS variables
10. Dark mode MUST use CSS variables for readability - never hardcode oklch values
11. Use ONE consistent grayscale family throughout dark mode (don't mix)
12. Dark mode only needs to override tokens that differ from light mode