# Step 2: Detect themes folder

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

If no themes folder found: ask user where they want the theme file saved.
