# Validation checklist (must self-check before returning)

## Structure
- [ ] Imports present and ordered (`tailwindcss`, then `./theme.css`)
- [ ] `@theme theme-<name> inline { }` block present with custom palettes
- [ ] Theme key consistent: `theme-<name>` everywhere
- [ ] Light selector uses `:root[data-theme=...]`, `[data-theme=...]`
- [ ] Dark selector is `[data-theme="theme-<name>"].dark`
- [ ] Semantic token definitions are in selector blocks (NOT inside @theme block)
- [ ] No requirement to change HTML utility classes (only `data-theme`, optional `.dark`)

## Palettes (always create both)
- [ ] Brand palette created: `--color-<name>-*` (vibrant or soft based on request)
- [ ] Gray palette created: `--color-<name>-gray-*` (bell curve chroma, low at dark end)
- [ ] Light mode uses custom gray palette for backgrounds/surfaces/borders

## Dark mode palette choice (critical)
- [ ] Did user say "matching dark mode" / "cohesive dark" / "consistent colors"?
  - YES -> Dark mode uses `var(--color-<name>-gray-*)` (custom gray)
  - NO -> Dark mode uses `var(--color-zinc-*)` or `var(--color-stone-*)` (Tailwind gray)

## Brand color style
- [ ] Brand palette is VIBRANT (high chroma) by default
- [ ] Brand palette is SOFT (low chroma) only if user said "soft/muted/ash/pastel/dusty"

## Token coverage
- [ ] Full coverage present (Rule 6.1-6.5)
- [ ] CSS syntax valid (balanced braces, no broken comments)
- [ ] If behavior overrides exist, they are theme-scoped only (Rule 8)
- [ ] If charts/maps changed, `*-hex` tokens remain hex (Rule 10)
- [ ] Output discipline followed (Rule 12)

## Dark mode consistency
- [ ] Dark mode uses CSS variables (`var(--color-*)`) not hardcoded oklch values
- [ ] Dark mode uses ONE consistent grayscale family (not mixed)
- [ ] All custom palettes are defined in `@theme inline { }` and referenced via `var()`
- [ ] Gray palette uses bell curve chroma (low at extremes, peak at midtones)
- [ ] Gray palette dark end (800-950) has very low chroma (<=0.008) for clean dark backgrounds
