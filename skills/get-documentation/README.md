# Preline Documentation Guide Skill

A skill that guides AI agents to check Preline documentation when markup or component patterns are needed that aren't available in standard components.

---

## Purpose

This skill helps AI agents understand:
- **When** to check Preline documentation
- **How** to access documentation via MCP resources
- **What** to look for in the documentation
- **How** to implement documented patterns correctly

---

## Problem This Solves

Without this skill, agents might:
- ❌ Guess HTML structure instead of using documented patterns
- ❌ Miss important data attributes that enable JavaScript behavior
- ❌ Omit accessibility attributes (ARIA, role, etc.)
- ❌ Use incorrect class combinations
- ❌ Implement custom solutions when documented patterns exist

With this skill, agents will:
- ✅ Check documentation for component variants and patterns
- ✅ Use correct HTML structure and classes
- ✅ Include all required data attributes
- ✅ Maintain accessibility standards
- ✅ Follow Preline conventions consistently

---

## Use Cases

### 1. Component Variants
When user requests specific component variations not in standard components:
- "floating label input"
- "accordion with icons"
- "outlined button"
- "mega menu navbar"

### 2. Behavior Configuration
When user needs to configure component behavior:
- "open dropdown on hover"
- "keep accordion items open"
- "auto-close modal on outside click"
- "disable keyboard navigation"

### 3. Complex Patterns
When user needs advanced component compositions:
- "nested navigation with dropdowns"
- "multi-step form wizard"
- "searchable select with custom options"
- "card with tabs inside"

### 4. Markup Verification
When agent is unsure about correct HTML structure:
- "proper form layout"
- "accessible modal structure"
- "responsive sidebar pattern"
- "input group with button"

---

## File Structure

```
get-documentation/
├── skill.md              # Main skill instructions for the agent
├── examples.md           # Detailed examples of documentation usage
├── quick-reference.md    # Fast lookup guide for common scenarios
└── README.md            # This file (human-readable overview)
```

---

## How It Works

### For AI Agents

1. **Detection**: Agent recognizes a request that needs documentation
2. **Access**: Agent uses MCP tools to list and fetch documentation
3. **Extraction**: Agent extracts HTML structure, classes, and attributes
4. **Implementation**: Agent implements using documented patterns
5. **Verification**: Agent ensures all required elements are included

### For Developers

This skill is automatically available to agents working with Preline. No manual setup required.

---

## Key Features

### 🎯 Smart Detection
Identifies when documentation lookup is necessary vs when standard components are sufficient.

### 📚 MCP Integration
Uses MCP resources to access Preline documentation directly.

### 🔍 Pattern Extraction
Guides agents to extract the right information from documentation:
- HTML structure
- CSS classes
- Data attributes
- ARIA attributes
- Configuration options

### ✅ Best Practices
Ensures agents follow Preline conventions and maintain code quality.

### ♿ Accessibility First
Emphasizes including proper ARIA attributes and semantic HTML.

---

## Documentation Priority Flow

```
User Request
    ↓
┌─────────────────────────────┐
│ Is it a standard component? │
└─────────────────────────────┘
    ↓ YES                ↓ NO
Use Component Tools    Check Documentation
    ↓                        ↓
single_component/      ListMcpResources
batch_components           ↓
                      FetchMcpResource
                           ↓
                   Extract Pattern
                           ↓
                      Implement
```

---

## MCP Integration

### List Available Documentation
```typescript
Tool: ListMcpResources
Purpose: See all available Preline documentation resources
```

### Fetch Specific Documentation
```typescript
Tool: FetchMcpResource
Parameters:
  - server: MCP server name
  - uri: Documentation resource URI
Purpose: Get detailed documentation content
```

---

## Examples

### Example 1: Simple Variant Lookup
**User:** "Add a floating label input"

**Agent Process:**
1. Recognizes "floating label" as a variant
2. Lists MCP resources → finds input docs
3. Fetches input documentation
4. Extracts floating label HTML pattern
5. Implements with correct classes and structure

### Example 2: Configuration Change
**User:** "Make accordion items stay open when clicking others"

**Agent Process:**
1. Recognizes need for configuration
2. Fetches accordion documentation
3. Finds `data-hs-accordion-always-open` attribute
4. Applies attribute to accordion container
5. Verifies behavior works correctly

### Example 3: Complex Pattern
**User:** "Create a navbar with mega menu and search"

**Agent Process:**
1. Recognizes complex composition
2. Fetches navbar and mega-menu docs
3. Extracts complete HTML structure
4. Identifies integration points
5. Implements full pattern with all elements

---

## When Documentation Isn't Enough

If documentation doesn't have the exact pattern:

1. **Look for similar patterns** in related components
2. **Adapt existing patterns** to match requirements
3. **Follow Preline conventions** for naming and structure
4. **Maintain consistency** with documented patterns
5. **Ensure accessibility** standards are met
6. **Document the approach** for the user

---

## Benefits

### For AI Agents
- Clear guidelines on when to check documentation
- Efficient access to Preline documentation via MCP
- Reduced errors in component implementation
- Consistent code quality

### For Users
- Correct implementation of Preline components
- Proper accessibility attributes included
- Working JavaScript behavior out of the box
- Maintainable code that follows Preline conventions

### For Projects
- Consistent use of Preline patterns
- Reduced debugging time
- Better code maintainability
- Improved accessibility

---

## Integration with Other Skills

### Works With
- **preline-theme-generator**: Documentation shows how themes affect components
- **Component tools** (single_component, batch_components): Use components first, docs for variants
- **Browser testing**: Test documented patterns to ensure they work

### Complements
- Standard component generation
- Custom theme creation
- Responsive design implementation
- Accessibility improvements

---

## Best Practices

### For Agents
1. ✅ Always check documentation before guessing
2. ✅ Use exact HTML structure from docs
3. ✅ Include all data attributes
4. ✅ Preserve accessibility attributes
5. ✅ Follow Preline naming conventions
6. ✅ Test implementation after applying

### For Users
1. Be specific about variant needs
2. Mention if accessibility is important
3. Describe desired behavior clearly
4. Indicate responsive requirements
5. Specify any customization needs

---

## Maintenance

This skill is maintained as part of the Preline project. Updates include:
- New component patterns
- Updated documentation URIs
- Additional examples
- Improved detection patterns

---

## Related Documentation

- **Main skill instructions**: `skill.md`
- **Detailed examples**: `examples.md`
- **Quick lookup guide**: `quick-reference.md`
- **Preline docs**: Available via MCP resources

---

## Support

For issues with this skill:
1. Check examples in `examples.md`
2. Verify MCP connection is working
3. Ensure Preline documentation is available
4. Review quick-reference for common scenarios

---

## Version

Current version: 1.0.0
Last updated: 2026-01-21

---

## Summary

This skill ensures AI agents:
- **Know when** documentation is needed
- **Know how** to access documentation efficiently
- **Know what** to extract from documentation
- **Know how** to implement patterns correctly

Result: Better Preline implementations with correct HTML structure, proper accessibility, and working JavaScript behavior.
