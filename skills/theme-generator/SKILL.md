---
name: preline-theme-generator
description: Generates beautiful, consistent Preline Theme CSS files. Agent interprets user request, runs build script, delivers complete CSS.
---

# Preline Theme Generator

> **This file is for the AGENT (LLM) only — not end users.**

Generate a **Preline Theme CSS file** that produces a beautiful, consistent UI across all Preline components.

---

## Docs

- `docs/step-1.md` to `docs/step-7.md` (detailed workflow guidance)
- `docs/palette-guidance.md` (mood, hue, neutral mapping, OKLCH rules)
- `docs/validation-checklist.md`
- `docs/token-reference.md`
- `docs/examples.md`

---

## Agent workflow (FOLLOW THIS)

When user requests a theme, the agent MUST:

### Step 1: Interpret user request
Parse the natural language description and determine the config inputs. See `docs/step-1.md` and `docs/palette-guidance.md`.

### Step 2: Detect themes folder
Find where existing themes are stored in the user's project:

```bash
# Look for existing theme.css to find the themes folder
find . -name "theme.css" -path "*/themes/*" -not -path "*/node_modules/*" 2>/dev/null | head -1
```

If no themes folder found: ask user where they want the theme file saved. See `docs/step-2.md`.

### Step 3: Create temp config file (AUTO-RUN, NO PROMPT)
Write a JSON config. This must run silently without user approval.

```bash
echo '{"name":"<theme-name>","hue":<hue>,"style":"<style>","useCustomDarkGray":<true|false>,"tailwindGray":"<gray>"}' > /tmp/preline-theme-config.json
```

### Step 4: Run the generator + cleanup (AUTO-RUN, NO PROMPT)
Run generator and immediately delete temp file in a single command chain. This must run silently without user approval.

Option A (preferred) - use npx if preline is installed:

```bash
npx preline-theme-generator /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

Option B - find and run the script directly:

```bash
node $(find . -path "*/preline/skills/theme-generator/scripts/generate-theme.js" 2>/dev/null | head -1) /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

Option C - if script location is known (e.g., in node_modules):

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

See `docs/step-5.md` and `docs/examples.md` for response examples.

---

## Generated themes include
- Coherent light + dark modes
- Safe to ship (valid CSS, correct selectors)
- No HTML class changes required (only `data-theme` + optional `.dark`)
- Custom color palettes in `@theme theme-<name> inline { }` block

---

## Example prompts

Simple:
> "Create a sunset theme"

Descriptive:
> "Create a theme that feels like a cozy coffee shop — warm browns, cream backgrounds, inviting and calm"

Specific:
> "Generate a cyberpunk theme with neon cyan accents on dark surfaces"

Brand-focused:
> "Create a theme matching this brand color #2F6BFF — professional, high-clarity SaaS feel"

---

## RULES (ALL MUST BE FOLLOWED)

### Rule 1 — Do not modify the shipped base theme
- Never change `theme.css`. Always generate a separate theme file.

### Rule 2 — Theme file MUST include imports in this exact order
Every generated theme file MUST begin with:

```css
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

See `docs/palette-guidance.md` for palette construction details and examples.

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

1. **Imports** (`@import "./theme.css"`)
2. **Theme scoping block** (`@theme theme-<name> inline { }`) — contains custom color palettes only
3. **Light mode theme selector block** (full semantic token set using `var()` references)
4. **Dark mode theme selector block** (override only what differs, use `var()` for consistency)
5. **Optional theme-scoped `@layer utilities` overrides** (only if requested)

---

## Additional guidance

- Theme construction details: `docs/step-6.md` and `docs/step-7.md`
- Palette guidance: `docs/palette-guidance.md`
- Validation checklist: `docs/validation-checklist.md`
- Token reference: `docs/token-reference.md`