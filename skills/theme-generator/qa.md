---
name: preline-theme-generator-qa
description: Self-check questions and failure-mode prevention for preline-theme-generator output (ensures no @theme inline mappings, correct selectors, and consistent token coverage).
---

# Theme Generator QA (Self-Check)

Use this checklist immediately before returning a generated theme.

---

## 1) Structural correctness

- Did I include BOTH imports at the top?
  - `@import "tailwindcss";`
  - `@import "./theme.css";`
- Did I use the correct theme name everywhere (`theme-<name>`)?
- Did I include the theme scoping block with custom palettes?
  - `@theme theme-<name> inline { /* brand + gray palettes */ }`
- Did I include BOTH selectors?
  - Light: `:root[data-theme="theme-<name>"], [data-theme="theme-<name>"]`
  - Dark: `[data-theme="theme-<name>"].dark`

---

## 2) Mapping / HTML safety (critical)

- Did I put ONLY custom color palettes inside `@theme` block?
  - The `@theme theme-<name> inline { }` block should ONLY contain:
    - Brand palette: `--color-<name>-*` (50-950)
    - Gray palette: `--color-<name>-gray-*` (50-950)
  - Semantic tokens (`--background`, `--primary`, etc.) go in SELECTOR blocks, NOT inside @theme.
  - Theme files must NOT change Tailwind mappings.
- Did I introduce any change that requires users to edit HTML utility classes?
  - If yes: remove it. Themes must activate via `data-theme` only.

---

## 3) Full theme coverage sanity

### 3.1 Global surfaces + text
- Did I define background tokens?
  - `--background`, `--background-1`, `--background-2`, `--background-plain`
- Did I define foreground tokens?
  - `--foreground`, `--foreground-inverse`, `--inverse`

### 3.2 Borders (full scale)
- Did I define the base border token?
  - `--border`
- Did I define the full border scale?
  - `--border-line-inverse`
  - `--border-line-1` through `--border-line-8`
- Is the border scale coherent and usable across different surfaces?

### 3.3 Primary ramp + states
- Did I define the full primary color ramp?
  - `--primary-50` through `--primary-950` (all 11 shades)
- Do the shades feel like one cohesive family?
- Did I define all primary state tokens?
  - `--primary`, `--primary-hover`, `--primary-focus`, `--primary-active`, `--primary-checked`
  - `--primary-line`, `--primary-foreground`
- Is `--primary-foreground` readable against `--primary`?

### 3.4 Secondary / Layer / Surface / Muted / Destructive
- Did I define secondary tokens?
  - `--secondary`, `--secondary-line`, `--secondary-foreground`
  - `--secondary-hover`, `--secondary-focus`, `--secondary-active`
- Did I define layer tokens?
  - `--layer`, `--layer-line`, `--layer-foreground`
  - `--layer-hover`, `--layer-focus`, `--layer-active`
- Did I define surface tokens?
  - `--surface`, `--surface-1` through `--surface-5`
  - `--surface-line`, `--surface-foreground`
  - `--surface-hover`, `--surface-focus`, `--surface-active`
- Did I define muted tokens?
  - `--muted`, `--muted-foreground`, `--muted-foreground-1`, `--muted-foreground-2`
  - `--muted-hover`, `--muted-focus`, `--muted-active`
- Did I define destructive tokens?
  - `--destructive`, `--destructive-foreground`
  - `--destructive-hover`, `--destructive-focus`
- Is destructive visually distinct from primary?

### 3.5 Component groups (all variants)
- Did I define navbar tokens (base + variants)?
  - `--navbar`, `--navbar-line`, `--navbar-divider`, `--navbar-inverse`
  - `--navbar-nav-foreground`, `--navbar-nav-hover`, `--navbar-nav-focus`, `--navbar-nav-active`
  - `--navbar-nav-list-divider`
  - Same pattern for `--navbar-1-*` and `--navbar-2-*`
- Did I define sidebar tokens (base + variants)?
  - Same pattern as navbar for `--sidebar-*`, `--sidebar-1-*`, `--sidebar-2-*`
- Did I define card tokens?
  - `--card`, `--card-line`, `--card-divider`, `--card-header`, `--card-footer`, `--card-inverse`
- Did I define dropdown tokens?
  - `--dropdown`, `--dropdown-1`, `--dropdown-line`, `--dropdown-divider`
  - `--dropdown-header`, `--dropdown-footer`
  - `--dropdown-item-foreground`, `--dropdown-item-hover`, `--dropdown-item-focus`, `--dropdown-item-active`
  - `--dropdown-inverse`
- Did I define select tokens?
  - `--select`, `--select-1`, `--select-line`
  - `--select-item-foreground`, `--select-item-hover`, `--select-item-focus`, `--select-item-active`
  - `--select-inverse`
- Did I define overlay tokens?
  - `--overlay`, `--overlay-line`, `--overlay-divider`
  - `--overlay-header`, `--overlay-footer`, `--overlay-inverse`
- Did I define popover, tooltip, table, switch, footer tokens?
  - `--popover`, `--popover-line`
  - `--tooltip`, `--tooltip-foreground`, `--tooltip-line`
  - `--table-line`
  - `--switch`
  - `--footer`, `--footer-line`, `--footer-inverse`
- Did I define scrollbar tokens?
  - `--scrollbar-track`, `--scrollbar-thumb`
  - `--scrollbar-track-inverse`, `--scrollbar-thumb-inverse`

---

## 4) Chart / Map token safety

- If I included chart tokens, did I keep `-hex` variants as valid hex values?
  - Apexcharts does NOT support oklch format
- Did I include the comment warning about oklch incompatibility?
- Did I define chart tokens coherently?
  - `--chart-primary`, `--chart-1` through `--chart-10`
  - `--chart-colors-*` variants with `-hex` and `-inverse` where needed
- If I included map tokens, are they using compatible color formats?
  - `--map-colors-primary`, `--map-colors-default`, `--map-colors-highlight`, `--map-colors-border`
  - Plus `-inverse` variants

---

## 5) Dark mode completeness

- Did I override all tokens that need different values in dark mode?
- Did I maintain readable contrast in dark mode?
  - Text on backgrounds
  - Primary foreground on primary background
- Are hover/focus/active states still distinguishable in dark mode?
- Did I use appropriate dark neutral family (e.g., `stone`, `neutral`, `slate`)?

---

## 6) CSS syntax validation

- Are all braces balanced?
- Are all selectors valid?
- Are there any broken or unclosed comments?
- Are there any duplicate conflicting selectors?
- Did I properly close both the light mode and dark mode selector blocks?

---

## 7) Behavior overrides (if any)

- If I added radius or other behavior overrides, are they theme-scoped?
  - Must be inside `@layer utilities` with theme selector
- Did I avoid global overrides that affect non-theme pages?

---

## Quick validation summary

Before returning, confirm all are true:

- [ ] Imports present and ordered correctly
- [ ] Theme key is `theme-<name>` everywhere
- [ ] `@theme theme-<name> inline { }` block contains brand + gray palettes
- [ ] Light selector: `:root[data-theme="theme-<name>"], [data-theme="theme-<name>"]`
- [ ] Dark selector: `[data-theme="theme-<name>"].dark`
- [ ] Only color palettes inside @theme block (NO semantic tokens)
- [ ] Full coverage: backgrounds, foregrounds, borders, primary ramp, states
- [ ] Full coverage: secondary, layer, surface, muted, destructive
- [ ] Full coverage: navbar (3 variants), sidebar (3 variants), card, dropdown, select, overlay
- [ ] Full coverage: popover, tooltip, table, switch, footer, scrollbar
- [ ] Chart/map tokens use hex for `-hex` variants (if included)
- [ ] Dark mode overrides are complete and readable
- [ ] CSS syntax is valid
- [ ] No HTML utility class changes required
