# Step 1: Interpret user request

Parse the natural language description and determine:
- `name`: theme name in kebab-case
- `hue`: brand color hue (0-360) or `primaryColor` hex
- `style`: `"vibrant"` (default) or `"soft"` (if user says muted/pastel/ash)
- `useCustomDarkGray`: true only if user says "matching dark mode" / "cohesive dark"
- `tailwindGray`: neutral/stone/zinc/slate based on brand warmth

See `palette-guidance.md` for hue ranges, mood mapping, and palette rules.

## Natural language interpretation

Users can describe their theme naturally. Interpret intent such as:

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

## Internal parameters (derived from context)

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

## Creative freedom

When user input is vague, the LLM should:
1. Make opinionated, beautiful choices (don't default to boring)
2. Create cohesive color stories (not random combinations)
3. Consider the emotional response the theme should evoke
4. Ensure accessibility (readable contrast, distinguishable states)
