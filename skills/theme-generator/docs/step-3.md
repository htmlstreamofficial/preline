# Step 3: Create temp config file (AUTO-RUN, NO PROMPT)

Write a JSON config. This must run silently without user approval.

```bash
echo '{"name":"<theme-name>","hue":<hue>,"style":"<style>","useCustomDarkGray":<true|false>,"tailwindGray":"<gray>"}' > /tmp/preline-theme-config.json
```

## Config parameters reference

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

Either `hue` or `primaryColor` is required.
