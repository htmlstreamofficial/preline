---
name: preline-theme-generator
description: Generates beautiful, consistent Preline Theme CSS files. Agent interprets user request, runs build script, delivers complete CSS.
---

# Preline Theme Generator

> **This file is for the AGENT (LLM) only — not end users.**

Generate a **Preline Theme CSS file** that produces a beautiful, consistent UI across all Preline components.

---

## Agent Workflow (FOLLOW THIS)

When user requests a theme, the agent MUST:

### Step 1: Interpret user request
Parse the natural language description and determine:
- `name`: theme name in kebab-case
- `hue`: brand color hue (0-360)
- `style`: "vibrant" (default) or "soft" (if user says muted/pastel/ash)
- `useCustomDarkGray`: true only if user says "matching dark mode" / "cohesive dark"
- `tailwindGray`: neutral/stone/zinc/slate based on brand warmth

### Step 2: Detect themes folder
Find where existing themes are stored in the user's project:

```bash
# Look for existing theme.css to find the themes folder
find . -name "theme.css" -path "*/themes/*" -not -path "*/node_modules/*" 2>/dev/null | head -1
```

Common locations to check:
- `src/assets/css/themes/`
- `src/css/themes/`
- `src/styles/themes/`
- `assets/css/themes/`
- `styles/themes/`

**If no themes folder found**: Ask user where they want the theme file saved.

### Step 3: Create temp config file (AUTO-RUN, NO PROMPT)
Write a JSON config. **This must run silently without user approval.**

// turbo
```bash
echo '{"name":"<theme-name>","hue":<hue>,"style":"<style>","useCustomDarkGray":<true|false>,"tailwindGray":"<gray>"}' > /tmp/preline-theme-config.json
```

### Step 4: Run the generator + cleanup (AUTO-RUN, NO PROMPT)

Run generator and immediately delete temp file in a single command chain. **This must run silently without user approval.**

**Option A (preferred)** - Use npx if preline is installed:

// turbo
```bash
npx preline-theme-generator /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

**Option B** - Find and run the script directly:

// turbo
```bash
node $(find . -path "*/preline/skills/theme-generator/scripts/generate-theme.js" 2>/dev/null | head -1) /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

**Option C** - If script location is known (e.g., in node_modules):

// turbo
```bash
node node_modules/preline/skills/theme-generator/scripts/generate-theme.js /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

### Step 5: Confirm to user
Tell user the theme was created and show enable snippet:

```css
/* In your main CSS file */
@import "./themes/<theme-name>.css";
```

```html
<!-- On HTML element -->
<html data-theme="theme-<theme-name>">
```

---

## Hue Reference (for Step 1)

| Color | Hue Range | Tailwind Gray |
|-------|-----------|---------------|
| Red/Coral | 0-30 | neutral |
| Orange/Amber | 30-60 | stone |
| Yellow/Gold | 60-90 | stone |
| **Green/Lime/Avocado** | **90-150** | **stone** |
| Teal/Cyan | 150-200 | zinc |
| Blue/Azure | 200-260 | slate |
| Violet/Purple | 260-300 | zinc |
| Magenta/Pink/Rose | 300-360 | neutral |

---

## Generated themes include:
- Coherent **light + dark** modes
- **Safe to ship** (valid CSS, correct selectors)
- **No HTML class changes** required (only `data-theme` + optional `.dark`)
- Custom color palettes in `@theme theme-<name> inline { }` block

---

## Inputs (natural language)

Users describe themes using everyday language. The LLM interprets intent and makes creative decisions.

### Required
- **Theme name** — Any descriptive name (will be converted to kebab-case)
  - Examples: "Midnight Ocean", "Forest Dawn", "Retro Arcade"
  - Theme key becomes: `theme-midnight-ocean`, `theme-forest-dawn`, etc.

### Natural Language Interpretation

Users can describe their theme naturally. The LLM should interpret:

| User says... | LLM understands... |
|--------------|---------------------|
| "warm sunset colors" | primaryHue: orange/amber, mood: warm, neutralFamily: stone |
| "professional and clean" | mood: minimal/serious, contrast: medium, primaryHue: blue/slate |
| "playful candy vibes" | mood: playful, primaryHue: pink/purple, contrast: high |
| "dark hacker aesthetic" | mood: serious, dark-focused, primaryHue: green/cyan |
| "earthy and organic" | primaryHue: green/brown, neutralFamily: stone, mood: calm |
| "bold and energetic" | contrast: high, mood: vibrant, saturated colors |
| "soft and muted" | contrast: low, mood: calm, desaturated colors |
| "90s retro feel" | mood: retro, radiusStyle: retro-sharp, bold colors |

### Example Prompts

**Simple:**
> "Create a sunset theme"

**Descriptive:**
> "Create a theme that feels like a cozy coffee shop — warm browns, cream backgrounds, inviting and calm"

**Specific:**
> "Generate a cyberpunk theme with neon cyan accents on dark surfaces"

**Brand-focused:**
> "Create a theme matching this brand color #2F6BFF — professional, high-clarity SaaS feel"

### Internal Parameters (LLM determines from context)

When interpreting user input, map to these internal parameters:

- `themeName`: derived from user's name (kebab-case)
- `primaryColor`: hex value if provided, otherwise derived from description
- `primaryHue`: teal / indigo / orange / emerald / rose / amber / cyan / purple / etc.
- `mood`: calm / vibrant / serious / playful / retro / minimal / elegant / bold
- `contrast`: low / medium / high
- `lightNeutralFamily`: gray / neutral / slate / stone / zinc
- `darkNeutralFamily`: gray / neutral / slate / stone / zinc
- `radiusStyle`: default / soft / sharp / retro-sharp
- `includeCharts`: true if user mentions dashboards, analytics, data visualization
- `includeMaps`: true if user mentions maps, geography, location features

### Creative Freedom

When user input is vague, the LLM should:
1. Make opinionated, beautiful choices (don't default to boring)
2. Create cohesive color stories (not random combinations)
3. Consider the emotional response the theme should evoke
4. Ensure accessibility (readable contrast, distinguishable states)

---

## Mood & Palette Guidance

### Color Psychology Reference

| Mood | Primary Hues | Neutral Family | Characteristics |
|------|--------------|----------------|-----------------|
| **Professional** | Blue, Slate, Indigo | gray, slate | Clean, trustworthy, corporate |
| **Creative** | Purple, Pink, Orange | neutral | Innovative, artistic, expressive |
| **Natural** | Green, Teal, Brown | stone | Organic, sustainable, calm |
| **Energetic** | Orange, Yellow, Red | neutral | Bold, active, attention-grabbing |
| **Luxurious** | Gold, Purple, Black | zinc | Premium, elegant, sophisticated |
| **Playful** | Pink, Cyan, Yellow | neutral | Fun, youthful, approachable |
| **Tech/Cyber** | Cyan, Green, Purple | slate, zinc | Modern, digital, futuristic |
| **Warm** | Orange, Amber, Brown | stone | Cozy, inviting, comfortable |
| **Cool** | Blue, Teal, Slate | gray, slate | Calm, refreshing, serene |
| **Minimal** | Gray, White, Black | gray | Simple, focused, uncluttered |

### Building Cohesive Palettes

1. **Pick a primary** — The hero color for buttons, links, CTAs
2. **Choose matching neutrals** — Warm primaries → stone/neutral; Cool primaries → gray/slate
3. **Define contrast** — Bold brands → high contrast; Soft aesthetics → low contrast
4. **Consider dark mode** — Primary often shifts lighter; neutrals shift to darker family

### Accessibility & Contrast Guidelines (WCAG)

Ensure themes meet WCAG 2.1 AA contrast requirements:

| Element | Minimum Ratio | OKLCH Rule of Thumb |
|---------|---------------|---------------------|
| **Body text on background** | 4.5:1 | Lightness difference ≥ 50% |
| **Large text (18pt+)** | 3:1 | Lightness difference ≥ 40% |
| **UI components (buttons, inputs)** | 3:1 | Lightness difference ≥ 40% |
| **Focus indicators** | 3:1 | Use distinct color + lightness |

**OKLCH Lightness Thresholds:**

| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Background** | L ≥ 95% | L ≤ 25% |
| **Text on light bg** | L ≤ 45% | — |
| **Text on dark bg** | — | L ≥ 85% |
| **Primary button text** | Check against primary-500/600 | Check against primary-400 |

**Readable Primary Foreground:**
- Most hues (blue, purple, red, orange): Use **white** (`L: 100%`)
- Light hues (yellow 50-110°, light cyan 160-195°): Use **dark gray** (`L ≤ 20%`)

**Quick Check:** If `|L_text - L_background| >= 50%`, contrast is likely sufficient for body text.

---

## Palette Types

When generating custom themes, there are TWO distinct types of custom color palettes:

| Palette Type | Example Variable | Purpose | Chroma Level |
|--------------|------------------|---------|--------------|
| **Brand palette** | `--color-<name>-*` | Primary/accent colors, buttons, links, CTAs | **Vibrant** (high chroma) by default |
| **Gray palette** | `--color-<name>-gray-*` | Backgrounds, surfaces, borders, dark mode neutrals | **Soft** (low chroma 0.002-0.035) |

### When to Create Each Palette

**ALWAYS create TWO palettes** in `@theme inline { }`:
1. **Brand palette** (`--color-<name>-*`) — for primary/accent colors
2. **Gray palette** (`--color-<name>-gray-*`) — for backgrounds, surfaces, borders

Both palettes are used in **light mode** for a cohesive feel.

**Dark mode behavior depends on user request:**

| User Request | Light Mode Uses | Dark Mode Uses |
|--------------|-----------------|----------------|
| "soft rose theme" (default) | Custom gray (`--color-<name>-gray-*`) | Tailwind gray (`zinc`, `stone`, etc.) |
| "soft rose theme with matching dark mode" | Custom gray (`--color-<name>-gray-*`) | Custom gray (`--color-<name>-gray-*`) |

**Trigger phrases for custom dark mode palette:**
- "matching dark mode"
- "cohesive dark mode" 
- "consistent dark colors"
- "unified light and dark"
- "matching neutrals"

**If none of these phrases appear → light mode uses custom gray, dark mode uses Tailwind grays.**

### Brand Color Style (Vibrant vs Soft)

Brand palettes are **vibrant by default** (like Tailwind's blue, green, orange). Only reduce chroma if user explicitly requests:

| User Says | Brand Palette Style | Chroma Level |
|-----------|---------------------|--------------|
| Default (no modifier) | **Vibrant** — follow Tailwind color saturation | 0.10-0.20+ |
| "soft", "muted", "ash", "pastel", "dusty", "desaturated" | **Soft** — reduced chroma like lavender/khaki | 0.02-0.05 |

**Example comparison:**

```css
/* Vibrant brand (default) */
--color-<name>-500: oklch(55% 0.14 <hue>);

/* Soft/muted brand (if requested) */
--color-<name>-500: oklch(55% 0.04 <hue>);
```

---

## Custom Gray Palettes (Neutral Matching)

When a theme benefits from unique neutrals, generate a **custom neutral palette** that harmonizes with the primary color. These are NOT pure grays — they have subtle warmth or coolness.

#### Palette Characteristics

| Palette Type | Hue Range | Chroma Range | Use With |
|--------------|-----------|--------------|----------|
| **Warm neutrals** | 60-100° (yellow/brown) | 0.002-0.035 | Orange, amber, brown, gold primaries |
| **Cool neutrals** | 200-260° (blue/slate) | 0.002-0.030 | Blue, cyan, teal, indigo primaries |
| **Rose neutrals** | 330-360° (pink) | 0.002-0.040 | Pink, rose, magenta primaries |
| **Green neutrals** | 120-160° (sage) | 0.002-0.030 | Green, emerald, teal primaries |

#### OKLCH Pattern for Gray Palettes (Bell Curve Chroma)

Gray palettes use a **bell curve chroma pattern** — very low at extremes (light AND dark), peaking at mid-tones. This ensures:
- Light mode backgrounds (50-200) look clean with subtle tint
- Dark mode backgrounds (800-950) look sophisticated, not muddy

```css
--color-<name>-gray-50:  oklch(98%   0.002 <hue>);  /* Almost neutral */
--color-<name>-gray-100: oklch(95.5% 0.004 <hue>);
--color-<name>-gray-200: oklch(89.7% 0.008 <hue>);
--color-<name>-gray-300: oklch(82.7% 0.012 <hue>);  /* Building up */
--color-<name>-gray-400: oklch(73%   0.018 <hue>);  /* Approaching peak */
--color-<name>-gray-500: oklch(62.5% 0.020 <hue>);  /* PEAK chroma */
--color-<name>-gray-600: oklch(52.8% 0.016 <hue>);  /* Starting to fade */
--color-<name>-gray-700: oklch(41.4% 0.012 <hue>);  /* Fading */
--color-<name>-gray-800: oklch(34.6% 0.008 <hue>);  /* Very low */
--color-<name>-gray-900: oklch(30.6% 0.005 <hue>);  /* Almost neutral */
--color-<name>-gray-950: oklch(20.1% 0.003 <hue>);  /* Nearly pure dark */
```

**Critical: Dark mode backgrounds (800-950) need very low chroma:**

| Shade | Chroma | Why |
|-------|--------|-----|
| 950 | 0.003 | Dark backgrounds must be nearly neutral |
| 900 | 0.005 | Avoids muddy/colored appearance |
| 800 | 0.008 | Just a hint of warmth/coolness |
| 500 | 0.020 | Peak — midtones carry the color identity |
| 50 | 0.002 | Light backgrounds stay clean |

**Key principles:**
- Chroma peaks at mid-tones (400-600), very low at BOTH extremes
- Dark end (800-950) must have lower chroma than light end for clean dark mode
- Hue stays consistent across the scale (±5° variation is acceptable)
- Lightness follows standard 50-950 scale

#### Placement of Custom Palettes

Custom color palettes MUST be defined in the `@theme theme-<name> inline { }` block:

```css
@theme theme-<name> inline {
  /* Custom neutral palette for this theme */
  --color-<name>-50: oklch(98% 0.003 88);
  --color-<name>-100: oklch(95.5% 0.005 88);
  /* ... full 50-950 scale ... */
}
```

Then reference these in the theme selector blocks using `var()`:

```css
[data-theme="theme-<name>"] {
  --background: var(--color-<name>-50);
  --background-1: var(--color-<name>-100);
  /* ... */
}

[data-theme="theme-<name>"].dark {
  --background: var(--color-<name>-950);
  --background-1: var(--color-<name>-900);
  /* ... */
}
```

#### When to Create Custom Palettes

| Scenario | Action |
|----------|--------|
| Primary is warm (orange/amber/brown) | Create warm neutral palette OR use `stone` |
| Primary is cool (blue/cyan/indigo) | Use `slate` or `gray` (usually sufficient) |
| Primary is unique (gold, khaki, etc.) | Create matching custom neutral palette |
| User explicitly requests | Always create to match their vision |
| Theme needs distinctive personality | Create for cohesion |

#### Using Custom Palettes in Both Modes

Soft gray palettes work seamlessly across light and dark modes:

- **Light mode**: Use 50-300 for backgrounds, 600-950 for text
- **Dark mode**: Use 800-950 for backgrounds, 50-300 for text

This creates consistent warmth/coolness across modes while maintaining readability.

---

## Config Parameters Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | Theme name (kebab-case) |
| `hue` | number | * | Brand color hue (0-360). Required if no `primaryColor`. |
| `primaryColor` | string | * | Brand color as hex (e.g., `"#2F6BFF"`). Auto-converts to hue. |
| `style` | string | `"vibrant"` | `"vibrant"` or `"soft"` for muted colors |
| `useCustomDarkGray` | boolean | `false` | Use custom gray palette in dark mode |
| `tailwindGray` | string | `"neutral"` | Tailwind gray for dark mode: `neutral`, `stone`, `zinc`, `slate` |
| `fontSans` | string | — | Custom sans-serif font stack |
| `fontSerif` | string | — | Custom serif font stack |
| `fontMono` | string | — | Custom monospace font stack |

\* Either `hue` OR `primaryColor` is required.

## Script Location & Features

```
src/assets/vendor/preline/skills/theme-generator/scripts/generate-theme.js
```

**Script capabilities:**
- ✓ Generates complete theme with all tokens (220+)
- ✓ Chart tokens with hex values (Apexcharts compatible)
- ✓ Map tokens (jsvectormap compatible)
- ✓ Accepts hex color input (`primaryColor`)
- ✓ Input validation with clear error messages
- ✓ Generation timestamp in output
- ✓ Font configuration support

> **See [token-reference.md](./token-reference.md)** for the complete token list.

---

## RULES (ALL MUST BE FOLLOWED)

### Rule 1 — Do not modify the shipped base theme
- Never change `theme.css`. Always generate a separate theme file.

### Rule 2 — Theme file MUST include imports in this exact order
Every generated theme file MUST begin with:

```css
@import "tailwindcss";
@import "./theme.css";
```

### Rule 3 — Theme scoping block placement
Every theme file MUST include a scoping block after imports:

```css
@theme theme-<name> inline {
  /* Theme scoping - custom palettes only */
}
```

**What goes INSIDE this block:**
- Custom color palettes (soft grays, brand colors) — these create Tailwind utilities
- Example: `--color-<name>-50: oklch(98% 0.003 <hue>);` through `--color-<name>-950`

**What goes OUTSIDE (in selector blocks):**
- All semantic token overrides (`--background`, `--primary`, `--navbar-*`, etc.)
- Tailwind core mappings are owned by the shipped base theme only

**Why this matters:**
- Custom palettes in `@theme inline { }` become available as `var(--color-<name>-*)` 
- These can then be referenced in both light AND dark mode selector blocks
- This enables consistent, readable dark mode using variables instead of hardcoded oklch values

### Rule 4 — No HTML utility class edits required
- Theme must NOT require users to change Tailwind utility classes in HTML.
- Theme activation must work using ONLY:
  - CSS imports
  - `data-theme="theme-<name>"`
- Dark mode may use `.dark` if the project uses it; do not introduce new conventions.

### Rule 5 — Use exact, required theme selectors
Light mode token overrides MUST be under:

```css
:root[data-theme="theme-<name>"],
[data-theme="theme-<name>"] { ... }
```

Dark mode overrides MUST be theme-scoped and use:

```css
[data-theme="theme-<name>"].dark { ... }
```

### Rule 6 — Full-theme mode: comprehensive token coverage is REQUIRED
Because this generator is full-theme mode, output MUST define a comprehensive set of token values so the theme looks complete and intentional.

At minimum, the theme MUST define:

#### 6.1 Global surfaces + text
- `--background`
- `--background-1`
- `--background-2`
- `--background-plain`
- `--foreground`
- `--foreground-inverse`
- `--inverse`

#### 6.2 Borders (full scale)
- `--border`
- `--border-line-inverse`
- `--border-line-1` through `--border-line-8` (coherent scale)

#### 6.3 Primary ramp (full) + primary states
- `--primary-50` through `--primary-950`
- `--primary`
- `--primary-hover`
- `--primary-focus`
- `--primary-active`
- `--primary-checked`
- `--primary-foreground` (must be readable)

#### 6.4 Secondary / muted / destructive (at least)
- `--secondary`
- `--muted`
- `--destructive`
- Include related state/variant tokens if they exist in the base naming system.

#### 6.5 Core component groups for a complete theme feel (prefer explicit values)
Provide explicit values for major component groups so the theme feels cohesive:
- `--navbar-*`
- `--sidebar-*`
- `--card-*`
- `--dropdown-*`
- `--select-*`
- `--overlay-*`
- `--popover-*`
- `--tooltip-*`
- Optionally: `--scrollbar-*`
- Charts/maps tokens ONLY if included safely (see Rule 10)

**Full-theme output MUST NOT:**
- put token definitions inside the `@theme` block
- invent new mappings that force HTML class edits

### Rule 7 — Token naming must match Preline's token system
- Do not invent random token names for Preline components.
- Only introduce new custom tokens if explicitly requested, and keep them isolated and documented in comments.

### Rule 8 — Theme-scoped behavior overrides ONLY
If the theme changes behavior (e.g. retro-sharp radii), it MUST be scoped to the theme only.

**Allowed:**
- Override radius tokens under the theme selector
- Add `@layer utilities` rules scoped to the theme selector

**Not allowed:**
- Global `.rounded { ... }` overrides without theme scoping
- Any behavior overrides that affect non-theme pages

### Rule 9 — Typography tokens are allowed, but font loading is separate by default
If fonts are requested, you MAY set:
- `--font-sans` and/or `--font-serif` and/or `--font-mono`

inside the theme selector.

Do NOT add Google Fonts `@import url(...)` into the theme file unless the user explicitly requests it.
(Font loading typically belongs in the main CSS entry file.)

### Rule 10 — Charts/maps compatibility rules
If adjusting chart/map tokens:
- Prefer safe formats where required by libraries.
- Keep any `*-hex` tokens as valid hex values if the ecosystem expects hex.
- Do not force `oklch(...)` where it may break gradients or third-party rendering.

### Rule 11 — Valid CSS is mandatory
- No missing braces
- No invalid selectors
- No broken comments
- No duplicate conflicting selectors

### Rule 12 — Output discipline
- First code block must contain ONLY the generated theme CSS.
- Optional second code block may contain ONLY the enable snippet.
- No additional commentary unless explicitly requested.

---

## Required file structure (MUST follow order)

1. **Imports** (`@import "tailwindcss"` then `@import "./theme.css"`)
2. **Theme scoping block** (`@theme theme-<name> inline { }`) — contains custom color palettes only
3. **Light mode theme selector block** (full semantic token set using `var()` references)
4. **Dark mode theme selector block** (override only what differs, use `var()` for consistency)
5. **Optional theme-scoped `@layer utilities` overrides** (only if requested)

---

## Generation procedure (MUST follow)

### Step 1 — Interpret user intent
- Extract theme name, mood, colors from natural language
- Make creative decisions for unspecified parameters

### Step 2 — Choose palette strategy
- **Light:** coherent backgrounds + readable foreground + quiet border scale
- **Dark:** coherent dark surfaces + readable text + borders that separate layers

### Step 3 — Build full primary ramp + states
- `50..950` must feel like one family
- `hover/focus/active/checked` must be incremental and consistent
- `--primary-foreground` must be readable

### Step 4 — Define border scale
- `--border-line-1..8` must be consistent and usable across surfaces

### Step 5 — Define secondary/muted/destructive
- Ensure destructive is clearly distinct from primary

### Step 6 — Define core component groups
- Ensure navbar/sidebar/card/dropdown/select/overlay feel like one system

### Step 7 — Dark mode overrides
- Override only what differs (inherit everything else)
- Ensure contrast and states remain readable

**Dark mode palette decision (CRITICAL):**

```
ALWAYS: Create BOTH palettes in @theme inline { }:
  - Brand palette: --color-<name>-*
  - Gray palette: --color-<name>-gray-*

Light mode: ALWAYS uses custom gray palette (--color-<name>-gray-*)

Dark mode:
  IF user requested "matching dark mode" / "cohesive dark" / "consistent colors":
    → Use custom gray palette: var(--color-<name>-gray-*) for dark mode neutrals
  
  ELSE (DEFAULT):
    → Use Tailwind gray for dark mode: var(--color-zinc-*) or var(--color-stone-*)
    → Choose based on brand warmth (warm brand → stone, cool brand → zinc)
```

**Example:**
- "soft rose theme" → Light uses custom gray, Dark uses Tailwind gray (zinc/neutral)
- "soft rose theme with matching dark mode" → Both use custom gray

**DEFAULT (no matching dark mode requested):**

Use existing Tailwind grayscale based on brand warmth:

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

**DUAL-PALETTE MODE (when matching dark mode requested):**

Create TWO palettes — brand + matching gray:

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

**Always use CSS variables, never hardcoded oklch in dark mode:**

```css
/* ✅ Good - readable and maintainable */
--background: var(--color-<name>-gray-900);

/* ❌ Bad - impossible to understand */
--background: oklch(21.1% 0.006 285.9);
```

### Step 8 — Optional typography tokens
- Only if requested; place inside the theme selector

### Step 9 — Optional behavior overrides
- Only if requested; must follow Rule 8

---

## Validation checklist (MUST self-check before returning)

### Structure
- [ ] Imports present and ordered (`tailwindcss`, then `./theme.css`)
- [ ] `@theme theme-<name> inline { }` block present with custom palettes
- [ ] Theme key consistent: `theme-<name>` everywhere
- [ ] Light selector uses `:root[data-theme=...]`, `[data-theme=...]`
- [ ] Dark selector is `[data-theme="theme-<name>"].dark`
- [ ] Semantic token definitions are in selector blocks (NOT inside @theme block)
- [ ] No requirement to change HTML utility classes (only `data-theme`, optional `.dark`)

### Palettes (ALWAYS create both)
- [ ] Brand palette created: `--color-<name>-*` (vibrant or soft based on request)
- [ ] Gray palette created: `--color-<name>-gray-*` (bell curve chroma, low at dark end)
- [ ] Light mode uses custom gray palette for backgrounds/surfaces/borders

### Dark Mode Palette Choice (CRITICAL)
- [ ] Did user say "matching dark mode" / "cohesive dark" / "consistent colors"?
  - YES → Dark mode uses `var(--color-<name>-gray-*)` (custom gray)
  - NO → Dark mode uses `var(--color-zinc-*)` or `var(--color-stone-*)` (Tailwind gray)

### Brand Color Style
- [ ] Brand palette is VIBRANT (high chroma) by default
- [ ] Brand palette is SOFT (low chroma) only if user said "soft/muted/ash/pastel/dusty"

### Token Coverage
- [ ] Full coverage present (Rule 6.1-6.5)
- [ ] CSS syntax valid (balanced braces, no broken comments)
- [ ] If behavior overrides exist, they are theme-scoped only (Rule 8)
- [ ] If charts/maps changed, `*-hex` tokens remain hex (Rule 10)
- [ ] Output discipline followed (Rule 12)

### Dark Mode Consistency
- [ ] Dark mode uses CSS variables (`var(--color-*)`) not hardcoded oklch values
- [ ] Dark mode uses ONE consistent grayscale family (not mixed)
- [ ] All custom palettes are defined in `@theme inline { }` and referenced via `var()`
- [ ] Gray palette uses bell curve chroma (low at extremes, peak at midtones)
- [ ] Gray palette dark end (800-950) has very low chroma (≤0.008) for clean dark backgrounds