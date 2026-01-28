# Step 4: Run generator + cleanup (AUTO-RUN, NO PROMPT)

Run generator and immediately delete temp file in a single command chain. This must run silently without user approval.

## Option A (preferred)

Use npx if preline is installed:

```bash
npx preline-theme-generator /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

## Option B

Find and run the script directly:

```bash
node $(find . -path "*/preline/skills/theme-generator/scripts/generate-theme.js" 2>/dev/null | head -1) /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

## Option C

If script location is known (e.g., in node_modules):

```bash
node node_modules/preline/skills/theme-generator/scripts/generate-theme.js /tmp/preline-theme-config.json <themes-folder>/<theme-name>.css && rm /tmp/preline-theme-config.json
```

## Script location & features

```
src/assets/vendor/preline/skills/theme-generator/scripts/generate-theme.js
```

Script capabilities:
- Generates complete theme with all tokens (220+)
- Chart tokens with hex values (Apexcharts compatible)
- Map tokens (jsvectormap compatible)
- Accepts hex color input (`primaryColor`)
- Input validation with clear error messages
- Generation timestamp in output
- Font configuration support

See `token-reference.md` for the complete token list.
