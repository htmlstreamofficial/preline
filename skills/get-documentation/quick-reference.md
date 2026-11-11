# Quick Reference: When to Check Documentation

A rapid-access guide for agents to know when documentation lookup is essential.

---

## Decision Tree

```
User Request
    |
    v
Is it a standard component?
    |
    +-- YES --> Use single_component or batch_components
    |
    +-- NO --> Continue
         |
         v
Is it a component variant/pattern?
    |
    +-- YES --> CHECK DOCUMENTATION
    |
    +-- NO --> Continue
         |
         v
Does it need specific configuration?
    |
    +-- YES --> CHECK DOCUMENTATION
    |
    +-- NO --> Continue
         |
         v
Is it about behavior/interaction?
    |
    +-- YES --> CHECK DOCUMENTATION
    |
    +-- NO --> Continue
         |
         v
Uncertain about implementation?
    |
    +-- YES --> CHECK DOCUMENTATION
    |
    +-- NO --> Proceed with implementation
```

---

## Red Flags: MUST Check Documentation

🚩 **Immediate documentation lookup required when user mentions:**

### Component Variants
- "floating label"
- "outlined", "filled", "ghost"
- "with icon", "with avatar"
- "inline", "stacked", "horizontal"
- "multi-select", "searchable"
- "nested", "collapsible"

### Behavior Configuration
- "open on hover"
- "auto-close"
- "keyboard navigation"
- "prevent default"
- "custom trigger"
- "animation timing"

### Complex Patterns
- "mega menu"
- "multi-step form"
- "nested navigation"
- "grouped items"
- "hierarchical structure"
- "wizard flow"

### Accessibility
- "screen reader"
- "keyboard accessible"
- "ARIA"
- "focus management"
- "tab order"

### Responsive Behavior
- "mobile collapse"
- "breakpoint"
- "responsive"
- "adaptive"
- "hide on mobile"

---

## Green Flags: Standard Component Sufficient

✅ **Standard component tools are enough when user requests:**

- "Add a button" → single_component
- "Create a modal" → single_component
- "Add dropdown and tabs" → batch_components
- "Insert a card component" → single_component
- "Basic input field" → single_component
- "Simple navigation" → single_component

---

## Yellow Flags: Consider Documentation

⚠️ **Documentation might be helpful when:**

- User mentions specific attributes or properties
- Request includes "custom" or "specific"
- Multiple components need to work together
- User references Preline website or examples
- Unsure about exact class names or structure
- Need to verify best practices

---

## MCP Commands Quick Reference

### List Available Documentation
```typescript
// Use ListMcpResources tool
// Returns: List of all available Preline documentation resources
```

### Fetch Specific Documentation
```typescript
// Use FetchMcpResource tool with:
// - server: "preline-mcp-server" (or appropriate server name)
// - uri: Resource URI from ListMcpResources
```

---

## Common Documentation URIs Pattern

Typical documentation resource URI patterns:

```
preline://docs/components/[component-name]
preline://docs/forms/[form-element]
preline://docs/navigation/[nav-type]
preline://docs/layout/[layout-type]
preline://docs/utilities/[utility-name]
```

*Note: Actual URIs may vary. Use ListMcpResources to see exact URIs.*

---

## Priority Checklist

Before implementing ANY Preline component or pattern:

- [ ] 1. Is it a standard component? → Use component tools
- [ ] 2. Is it a variant or pattern? → Check documentation
- [ ] 3. Is configuration needed? → Check documentation
- [ ] 4. Is HTML structure uncertain? → Check documentation
- [ ] 5. Are accessibility requirements mentioned? → Check documentation
- [ ] 6. Is it responsive behavior? → Check documentation
- [ ] 7. Are data attributes needed? → Check documentation
- [ ] 8. Custom implementation required? → Review documentation for patterns

---

## What to Extract from Documentation

When you access documentation, extract:

### 1. HTML Structure (Priority: CRITICAL)
```html
<!-- Exact element hierarchy -->
<!-- Required classes -->
<!-- Data attributes -->
<!-- ARIA attributes -->
```

### 2. CSS Classes (Priority: HIGH)
```
Base classes
Variant classes
State classes (hover, focus, active)
Responsive classes
Dark mode classes
```

### 3. Data Attributes (Priority: HIGH)
```
data-hs-[component-name]
data-hs-[component-name]-options
data-hs-[component-name]-trigger
data-hs-[component-name]-target
```

### 4. Configuration Options (Priority: MEDIUM)
```javascript
{
  "option1": "value",
  "option2": true,
  "option3": 300
}
```

### 5. JavaScript Initialization (Priority: LOW)
```javascript
// Usually auto-initialized by Preline
// Only needed for custom scenarios
```

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Guess HTML structure when documentation exists
- Mix component patterns from different sources
- Omit accessibility attributes
- Skip data attributes (breaks JavaScript behavior)
- Use non-Preline classes for core functionality
- Implement custom solutions before checking docs

✅ **DO:**
- Use exact HTML structure from documentation
- Include all required attributes
- Follow Preline naming conventions
- Test component behavior after implementation
- Maintain semantic HTML
- Preserve accessibility features

---

## Response Templates

### When Checking Documentation
```
"Let me check the Preline documentation for [specific pattern] 
to ensure I use the correct implementation."
```

### When Found in Documentation
```
"I found the [pattern] in the documentation. I'll implement it 
using the documented HTML structure and classes."
```

### When Not Found in Documentation
```
"I couldn't find this exact pattern in the documentation. 
I'll adapt the similar [related pattern] while following 
Preline's conventions."
```

### When Unsure
```
"Let me verify the correct approach in the Preline documentation 
before implementing this."
```

---

## Performance Tips

1. **List once**: Cache the result of ListMcpResources mentally
2. **Fetch precisely**: Know which documentation resource you need
3. **Extract completely**: Get all needed info in one fetch
4. **Implement once**: Use documented pattern correctly first time

---

## Signal Words Reference

### Variant Indicators
- "version", "type", "style"
- "size", "color", "theme"
- "simple", "advanced", "complex"
- "basic", "detailed", "full"

### Configuration Indicators
- "enable", "disable", "toggle"
- "set", "configure", "customize"
- "behavior", "action", "event"
- "option", "setting", "parameter"

### Pattern Indicators
- "layout", "structure", "composition"
- "combine", "integrate", "nest"
- "flow", "sequence", "hierarchy"
- "pattern", "template", "example"

### Accessibility Indicators
- "accessible", "accessibility", "a11y"
- "keyboard", "screen reader", "assistive"
- "ARIA", "WAI", "WCAG"
- "semantic", "focus", "navigation"

---

## Summary

**Golden Rule**: When in doubt, check the documentation. It's faster and more reliable than guessing.

**Fast Path**:
1. Standard component? → Use component tools
2. Everything else? → Check documentation first
3. Not in docs? → Follow Preline conventions

**Remember**: Documentation is your source of truth for correct HTML structure, classes, attributes, and behavior configuration.
