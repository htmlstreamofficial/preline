# Step 6: Build the theme system

## Choose palette strategy
- Light: coherent backgrounds + readable foreground + quiet border scale
- Dark: coherent dark surfaces + readable text + borders that separate layers

## Build full primary ramp + states
- `50..950` must feel like one family
- `hover/focus/active/checked` must be incremental and consistent
- `--primary-foreground` must be readable

## Define border scale
- `--border-line-1..8` must be consistent and usable across surfaces

## Define secondary/muted/destructive
- Ensure destructive is clearly distinct from primary

## Define core component groups
- Ensure navbar/sidebar/card/dropdown/select/overlay feel like one system
