---
name: preline-theme-generator-token-reference
description: Complete reference of all Preline theme tokens, their purposes, naming patterns, and default values for both light and dark modes.
---

# Preline Theme Token Reference

This document provides the complete reference for all semantic tokens available in Preline themes. Use this when generating themes to ensure comprehensive coverage.

---

## Overview

Preline themes use CSS custom properties (variables) as semantic tokens. These tokens are:
- Defined in theme files under `:root` (light) and `.dark` selectors
- Mapped to Tailwind utilities via `@theme inline` in the base theme
- Consumed by Preline components for consistent styling

Important: Generated themes override token values only. Never redefine the Tailwind mappings.

---

## Core token groups

| Group | Tokens | Used for |
|-------|--------|----------|
| Brand | `--primary`, `--primary-*` | Primary actions (buttons, links) |
| Secondary | `--secondary`, `--secondary-*` | Secondary emphasis |
| Muted | `--muted`, `--muted-*` | Muted/subdued elements |
| Destructive | `--destructive`, `--destructive-*` | Destructive/danger actions |
| Background | `--background`, `--background-*` | App surfaces |
| Foreground | `--foreground`, `--foreground-*` | Default typography colors |
| Inverse | `--inverse` | Inverted color scheme |
| Border | `--border` | Default border color |
| Border line | `--border-line-*` | Border colors for different shades |
| Layer | `--layer`, `--layer-*` | Layered elements (e.g. white buttons on white panel) |
| Surface | `--surface`, `--surface-*` | Elevated surfaces |
| Navbar | `--navbar`, `--navbar-*` | Navigation bar (background, border, divider) |
| Navbar nav | `--navbar-nav-*` | Navigation bar items (foreground, hover, active) |
| Sidebar | `--sidebar`, `--sidebar-*` | Sidebar (background, border, divider) |
| Sidebar nav | `--sidebar-nav-*` | Sidebar items (foreground, hover, active) |
| Card | `--card`, `--card-*` | Card component (border, divider, header, footer) |
| Dropdown | `--dropdown`, `--dropdown-*` | Dropdown menus (items, hover, active) |
| Select | `--select`, `--select-*` | Select component (items, hover, active) |
| Overlay | `--overlay`, `--overlay-*` | Modal/overlay backgrounds |
| Popover | `--popover`, `--popover-*` | Popover component |
| Tooltip | `--tooltip`, `--tooltip-*` | Tooltip component |
| Table | `--table-line` | Table borders |
| Switch | `--switch` | Switch/toggle component |
| Footer | `--footer`, `--footer-*` | Footer component |
| Scrollbar | `--scrollbar-*` | Custom scrollbar (track, thumb) |
| Chart | `--chart-*` | Chart colors (Apexcharts) |
| Map | `--map-colors-*` | Map colors (jsvectormap) |

---

## Component preset patterns

Preline uses numbered variants for component groups to offer different ready-made looks:

| Pattern | Meaning |
|---------|---------|
| `--navbar-*` | Default navbar preset (base style) |
| `--navbar-1-*` | Variant 1 preset (typically subtle/tinted surface) |
| `--navbar-2-*` | Variant 2 preset (typically stronger tint or different border) |
| `*` (no suffix) | Background/surface color of the component |
| `*-line` | Border color for the component container |
| `*-divider` | Divider lines inside the component |
| `*-nav-*` | Nav item colors (foreground, hover, focus, active) |
| `*-nav-list-divider` | Divider used in nav dropdown/list layouts |
| `*-inverse` | Inverted/contrast variant |

This pattern applies to: navbar, sidebar, and similar navigation components.

---

## Full token reference by category

### 1. Global surfaces + text

```css
/* Background tokens */
--background          /* Main app background */
--background-1        /* Secondary background (slightly tinted) */
--background-2        /* Tertiary background (more tinted) */
--background-plain    /* Plain white/black background */

/* Foreground tokens */
--foreground          /* Default text color */
--foreground-inverse  /* Inverted text color (for dark backgrounds) */

/* Inverse */
--inverse             /* Inverted surface color */
```

### 2. Borders (full scale)

```css
--border              /* Default border color */
--border-line-inverse /* Inverse border color */
--border-line-1       /* Lightest border */
--border-line-2
--border-line-3
--border-line-4
--border-line-5
--border-line-6
--border-line-7
--border-line-8       /* Darkest border */
```

### 3. Primary ramp + states

```css
/* Full color ramp (11 shades) */
--primary-50
--primary-100
--primary-200
--primary-300
--primary-400
--primary-500
--primary-600
--primary-700
--primary-800
--primary-900
--primary-950

/* State tokens */
--primary             /* Base primary color */
--primary-line        /* Primary border (usually transparent) */
--primary-foreground  /* Text on primary background */
--primary-hover       /* Hover state */
--primary-focus       /* Focus state */
--primary-active      /* Active/pressed state */
--primary-checked     /* Checked state (checkboxes, radios) */
```

### 4. Secondary

```css
--secondary            /* Base secondary color */
--secondary-line       /* Secondary border */
--secondary-foreground /* Text on secondary background */
--secondary-hover      /* Hover state */
--secondary-focus      /* Focus state */
--secondary-active     /* Active state */
```

### 5. Layer

```css
--layer               /* Layer background */
--layer-line          /* Layer border */
--layer-foreground    /* Text on layer */
--layer-hover         /* Hover state */
--layer-focus         /* Focus state */
--layer-active        /* Active state */
```

### 6. Surface

```css
--surface             /* Base surface */
--surface-1           /* Surface variant 1 */
--surface-2           /* Surface variant 2 */
--surface-3           /* Surface variant 3 */
--surface-4           /* Surface variant 4 */
--surface-5           /* Surface variant 5 */
--surface-line        /* Surface border */
--surface-foreground  /* Text on surface */
--surface-hover       /* Hover state */
--surface-focus       /* Focus state */
--surface-active      /* Active state */
```

### 7. Muted

```css
--muted               /* Muted background */
--muted-foreground    /* Muted text (lightest) */
--muted-foreground-1  /* Muted text variant 1 */
--muted-foreground-2  /* Muted text variant 2 (darkest) */
--muted-hover         /* Hover state */
--muted-focus         /* Focus state */
--muted-active        /* Active state */
```

### 8. Destructive

```css
--destructive            /* Destructive/danger color */
--destructive-foreground /* Text on destructive background */
--destructive-hover      /* Hover state */
--destructive-focus      /* Focus state */
```

### 9. Navbar (base + 2 variants)

```css
/* Base navbar */
--navbar                /* Navbar background */
--navbar-line           /* Navbar border */
--navbar-divider        /* Navbar divider */
--navbar-nav-foreground /* Nav item text */
--navbar-nav-hover      /* Nav item hover */
--navbar-nav-focus      /* Nav item focus */
--navbar-nav-active     /* Nav item active */
--navbar-nav-list-divider /* Nav list divider */
--navbar-inverse        /* Inverse navbar background */

/* Navbar variant 1 (subtle/tinted) */
--navbar-1
--navbar-1-line
--navbar-1-divider
--navbar-1-nav-foreground
--navbar-1-nav-hover
--navbar-1-nav-focus
--navbar-1-nav-active
--navbar-1-nav-list-divider

/* Navbar variant 2 (stronger tint) */
--navbar-2
--navbar-2-line
--navbar-2-divider
--navbar-2-nav-foreground
--navbar-2-nav-hover
--navbar-2-nav-focus
--navbar-2-nav-active
--navbar-2-nav-list-divider
```

### 10. Sidebar (base + 2 variants)

```css
/* Base sidebar */
--sidebar
--sidebar-line
--sidebar-divider
--sidebar-nav-foreground
--sidebar-nav-hover
--sidebar-nav-focus
--sidebar-nav-active
--sidebar-nav-list-divider
--sidebar-inverse

/* Sidebar variant 1 */
--sidebar-1
--sidebar-1-line
--sidebar-1-divider
--sidebar-1-nav-foreground
--sidebar-1-nav-hover
--sidebar-1-nav-focus
--sidebar-1-nav-active
--sidebar-1-nav-list-divider

/* Sidebar variant 2 */
--sidebar-2
--sidebar-2-line
--sidebar-2-divider
--sidebar-2-nav-foreground
--sidebar-2-nav-hover
--sidebar-2-nav-focus
--sidebar-2-nav-active
--sidebar-2-nav-list-divider
```

### 11. Card

```css
--card                /* Card background */
--card-line           /* Card border */
--card-divider        /* Card divider */
--card-header         /* Card header background */
--card-footer         /* Card footer background */
--card-inverse        /* Inverse card background */
```

### 12. Dropdown

```css
--dropdown                /* Dropdown background */
--dropdown-1              /* Dropdown variant background */
--dropdown-line           /* Dropdown border */
--dropdown-divider        /* Dropdown divider */
--dropdown-header         /* Dropdown header background */
--dropdown-footer         /* Dropdown footer background */
--dropdown-item-foreground /* Item text */
--dropdown-item-hover     /* Item hover */
--dropdown-item-focus     /* Item focus */
--dropdown-item-active    /* Item active */
--dropdown-inverse        /* Inverse dropdown */
```

### 13. Select

```css
--select                /* Select background */
--select-1              /* Select variant background */
--select-line           /* Select border */
--select-item-foreground /* Item text */
--select-item-hover     /* Item hover */
--select-item-focus     /* Item focus */
--select-item-active    /* Item active */
--select-inverse        /* Inverse select */
```

### 14. Overlay

```css
--overlay             /* Overlay/modal background */
--overlay-line        /* Overlay border */
--overlay-divider     /* Overlay divider */
--overlay-header      /* Overlay header background */
--overlay-footer      /* Overlay footer background */
--overlay-inverse     /* Inverse overlay */
```

### 15. Popover, tooltip, table, switch

```css
/* Popover */
--popover             /* Popover background */
--popover-line        /* Popover border */

/* Tooltip */
--tooltip             /* Tooltip background */
--tooltip-foreground  /* Tooltip text */
--tooltip-line        /* Tooltip border */

/* Table */
--table-line          /* Table border */

/* Switch */
--switch              /* Switch knob color */
```

### 16. Footer

```css
--footer              /* Footer background */
--footer-line         /* Footer border */
--footer-inverse      /* Inverse footer */
```

### 17. Scrollbar

```css
--scrollbar-track         /* Scrollbar track */
--scrollbar-thumb         /* Scrollbar thumb */
--scrollbar-track-inverse /* Inverse track */
--scrollbar-thumb-inverse /* Inverse thumb */
```

### 18. Charts (Apexcharts)

Important: Apexcharts does NOT support oklch color format. Keep `-hex` tokens as valid hex values.

```css
/* Primary chart color */
--chart-primary
--chart-colors-primary
--chart-colors-primary-inverse
--chart-colors-primary-hex          /* Must be hex */
--chart-colors-primary-hex-inverse  /* Must be hex */

/* Chart palette (1-10) */
--chart-1 through --chart-10
--chart-colors-chart-1 through --chart-colors-chart-10
--chart-colors-chart-1-inverse through --chart-colors-chart-10-inverse
--chart-colors-chart-1-hex through --chart-colors-chart-10-hex           /* Must be hex */
--chart-colors-chart-1-hex-inverse through --chart-colors-chart-10-hex-inverse /* Must be hex */

/* Chart backgrounds */
--chart-colors-background
--chart-colors-background-inverse
--chart-colors-chart-inverse

/* Chart foregrounds */
--chart-colors-foreground
--chart-colors-foreground-inverse

/* Chart labels */
--chart-colors-labels
--chart-colors-labels-inverse
--chart-colors-xaxis-labels
--chart-colors-xaxis-labels-inverse
--chart-colors-yaxis-labels
--chart-colors-yaxis-labels-inverse

/* Chart grid */
--chart-colors-grid-border
--chart-colors-grid-border-inverse

/* Chart special */
--chart-colors-bar-ranges
--chart-colors-bar-ranges-inverse
--chart-colors-candlestick-upward
--chart-colors-candlestick-upward-inverse
--chart-colors-candlestick-downward
--chart-colors-candlestick-downward-inverse
```

### 19. Maps (jsvectormap)

```css
--map-colors-primary
--map-colors-primary-inverse
--map-colors-default
--map-colors-default-inverse
--map-colors-highlight
--map-colors-highlight-inverse
--map-colors-border
--map-colors-border-inverse
```

---

## Custom color palettes

The base theme defines custom color palettes that themes can use:

### Khaki (earthy/warm neutral)

```css
--color-khaki-50 through --color-khaki-950
```

### Lavender (soft purple/mauve neutral)

```css
--color-lavender-50 through --color-lavender-950
```

These are useful for creating warm or soft-toned themes instead of using standard gray/neutral.

---

## Default values reference

### Light mode defaults (:root)

```css
:root {
  /* Backgrounds */
  --background: var(--color-white);
  --background-1: var(--color-gray-50);
  --background-2: var(--color-gray-100);
  --background-plain: var(--color-white);

  /* Foregrounds */
  --foreground: var(--color-gray-800);
  --foreground-inverse: var(--color-white);
  --inverse: var(--color-gray-800);

  /* Borders */
  --border: var(--color-gray-200);
  --border-line-inverse: var(--color-white);
  --border-line-1: var(--color-gray-100);
  --border-line-2: var(--color-gray-200);
  --border-line-3: var(--color-gray-300);
  --border-line-4: var(--color-gray-400);
  --border-line-5: var(--color-gray-500);
  --border-line-6: var(--color-gray-600);
  --border-line-7: var(--color-gray-700);
  --border-line-8: var(--color-gray-800);

  /* Primary (blue by default) */
  --primary-50: var(--color-blue-50);
  --primary-100: var(--color-blue-100);
  --primary-200: var(--color-blue-200);
  --primary-300: var(--color-blue-300);
  --primary-400: var(--color-blue-400);
  --primary-500: var(--color-blue-500);
  --primary-600: var(--color-blue-600);
  --primary-700: var(--color-blue-700);
  --primary-800: var(--color-blue-800);
  --primary-900: var(--color-blue-900);
  --primary-950: var(--color-blue-950);

  --primary: var(--color-primary-600);
  --primary-line: transparent;
  --primary-foreground: var(--color-white);
  --primary-hover: var(--color-primary-700);
  --primary-focus: var(--color-primary-700);
  --primary-active: var(--color-primary-700);
  --primary-checked: var(--color-primary-600);

  /* Secondary */
  --secondary: var(--color-gray-900);
  --secondary-line: transparent;
  --secondary-foreground: var(--color-white);
  --secondary-hover: var(--color-gray-800);
  --secondary-focus: var(--color-gray-800);
  --secondary-active: var(--color-gray-800);

  /* Layer */
  --layer: var(--color-white);
  --layer-line: var(--color-gray-200);
  --layer-foreground: var(--color-gray-800);
  --layer-hover: var(--color-gray-50);
  --layer-focus: var(--color-gray-50);
  --layer-active: var(--color-gray-50);

  /* Surface */
  --surface: var(--color-gray-100);
  --surface-1: var(--color-gray-200);
  --surface-2: var(--color-gray-300);
  --surface-3: var(--color-gray-400);
  --surface-4: var(--color-gray-500);
  --surface-5: var(--color-gray-600);
  --surface-line: transparent;
  --surface-foreground: var(--color-gray-800);
  --surface-hover: var(--color-gray-200);
  --surface-focus: var(--color-gray-200);
  --surface-active: var(--color-gray-200);

  /* Muted */
  --muted: var(--color-gray-50);
  --muted-foreground: var(--color-gray-400);
  --muted-foreground-1: var(--color-gray-500);
  --muted-foreground-2: var(--color-gray-600);
  --muted-hover: var(--color-gray-100);
  --muted-focus: var(--color-gray-100);
  --muted-active: var(--color-gray-100);

  /* Destructive */
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-white);
  --destructive-hover: var(--color-red-600);
  --destructive-focus: var(--color-red-600);

  /* Navbar (base) */
  --navbar: var(--color-white);
  --navbar-line: var(--color-gray-200);
  --navbar-divider: var(--color-gray-200);
  --navbar-nav-foreground: var(--color-gray-800);
  --navbar-nav-hover: var(--color-gray-100);
  --navbar-nav-focus: var(--color-gray-100);
  --navbar-nav-active: var(--color-gray-100);
  --navbar-nav-list-divider: var(--color-gray-200);
  --navbar-inverse: var(--color-primary-950);

  /* Navbar-1 */
  --navbar-1: var(--color-gray-50);
  --navbar-1-line: var(--color-gray-200);
  --navbar-1-divider: var(--color-gray-200);
  --navbar-1-nav-foreground: var(--color-gray-800);
  --navbar-1-nav-hover: var(--color-gray-200);
  --navbar-1-nav-focus: var(--color-gray-200);
  --navbar-1-nav-active: var(--color-gray-200);
  --navbar-1-nav-list-divider: var(--color-gray-200);

  /* Navbar-2 */
  --navbar-2: var(--color-gray-100);
  --navbar-2-line: transparent;
  --navbar-2-divider: var(--color-gray-300);
  --navbar-2-nav-foreground: var(--color-gray-800);
  --navbar-2-nav-hover: var(--color-gray-200);
  --navbar-2-nav-focus: var(--color-gray-200);
  --navbar-2-nav-active: var(--color-gray-200);
  --navbar-2-nav-list-divider: var(--color-gray-200);

  /* Sidebar follows same pattern as navbar */
  /* Card, Dropdown, Select, Overlay, Popover, Tooltip, Table, Switch, Footer, Scrollbar */
  /* See theme.css for complete default values */
}
```

### Dark mode defaults (.dark)

```css
.dark {
  /* Backgrounds */
  --background: var(--color-neutral-800);
  --background-1: var(--color-neutral-900);
  --background-2: var(--color-neutral-900);
  --foreground: var(--color-neutral-200);
  --inverse: var(--color-neutral-950);

  /* Borders */
  --border: var(--color-neutral-700);
  --border-line-1: var(--color-neutral-800);
  --border-line-2: var(--color-neutral-700);
  --border-line-3: var(--color-neutral-600);
  --border-line-4: var(--color-neutral-500);
  --border-line-5: var(--color-neutral-400);
  --border-line-6: var(--color-neutral-300);
  --border-line-7: var(--color-neutral-200);
  --border-line-8: var(--color-neutral-100);

  /* Primary (shifts to 500 in dark mode) */
  --primary: var(--color-primary-500);
  --primary-line: transparent;
  --primary-foreground: var(--color-white);
  --primary-hover: var(--color-primary-600);
  --primary-focus: var(--color-primary-600);
  --primary-active: var(--color-primary-600);
  --primary-checked: var(--color-primary-500);

  /* Secondary */
  --secondary: var(--color-white);
  --secondary-line: transparent;
  --secondary-foreground: var(--color-neutral-800);
  --secondary-hover: var(--color-neutral-100);
  --secondary-focus: var(--color-neutral-100);
  --secondary-active: var(--color-neutral-100);

  /* Layer */
  --layer: var(--color-neutral-800);
  --layer-line: var(--color-neutral-700);
  --layer-foreground: var(--color-white);
  --layer-hover: var(--color-neutral-700);
  --layer-focus: var(--color-neutral-700);
  --layer-active: var(--color-neutral-700);

  /* Surface */
  --surface: var(--color-neutral-700);
  --surface-1: var(--color-neutral-600);
  --surface-2: var(--color-neutral-500);
  --surface-3: var(--color-neutral-600);
  --surface-4: var(--color-neutral-500);
  --surface-5: var(--color-neutral-400);
  --surface-line: transparent;
  --surface-foreground: var(--color-neutral-200);
  --surface-hover: var(--color-neutral-600);
  --surface-focus: var(--color-neutral-600);
  --surface-active: var(--color-neutral-600);

  /* Muted */
  --muted: var(--color-neutral-800);
  --muted-foreground: var(--color-neutral-500);
  --muted-foreground-1: var(--color-neutral-400);
  --muted-foreground-2: var(--color-neutral-300);
  --muted-hover: var(--color-neutral-700);
  --muted-focus: var(--color-neutral-700);
  --muted-active: var(--color-neutral-700);

  /* Destructive (same red, readable in dark) */
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-white);
  --destructive-hover: var(--color-red-600);
  --destructive-focus: var(--color-red-600);

  /* Components shift to neutral-800/900 backgrounds */
  /* Nav items shift to neutral-700 hover states */
  /* See theme.css for complete dark mode values */
}
```

---

## Theme-scoped overrides

When creating a theme, override values under theme-scoped selectors:

```css
/* Light mode */
:root[data-theme="theme-<name>"],
[data-theme="theme-<name>"] {
  /* Override tokens here */
}

/* Dark mode */
[data-theme="theme-<name>"].dark {
  /* Override dark-specific tokens here */
}
```

---

## Color format guidelines

- For most tokens: use Tailwind color variables `var(--color-<color>-<shade>)`
- For oklch colors: acceptable for standard tokens
- For chart `-hex` tokens: MUST use valid hex values (for example, `#2563eb`)
- For custom colors: can use hex, rgb, hsl, or oklch

---

## Quick token count summary

| Category | Token Count |
|----------|-------------|
| Global surfaces + text | 7 |
| Borders | 10 |
| Primary (ramp + states) | 18 |
| Secondary | 6 |
| Layer | 6 |
| Surface | 11 |
| Muted | 7 |
| Destructive | 4 |
| Navbar (3 variants) | 27 |
| Sidebar (3 variants) | 27 |
| Card | 6 |
| Dropdown | 11 |
| Select | 8 |
| Overlay | 6 |
| Popover | 2 |
| Tooltip | 3 |
| Table, Switch, Footer | 5 |
| Scrollbar | 4 |
| Charts | ~50+ |
| Maps | 8 |
| Total | ~220+ tokens
