---
name: preline-documentation-guide
description: Guides agent to check Preline documentation when markup or component patterns are needed that aren't available in standard components.
---

# Preline Documentation Guide

> **This file is for the AGENT (LLM) only — not end users.**

This skill helps you understand when and how to access Preline documentation to find the right markup patterns, component variations, and implementation details.

---

## When to Check Documentation

You SHOULD check the Preline documentation when:

1. **User requests a component variant** not available in the standard component list
   - Example: "floating label input", "accordion with icons", "navbar with mega menu"
   - These variants often exist in documentation but aren't separate components

2. **User needs specific markup patterns** or HTML structure
   - Example: "how to structure a form", "proper card layout", "input group with button"
   - Documentation shows best practices and proper HTML structure

3. **User asks about component behavior or configuration**
   - Example: "how to make accordion open by default", "how to disable a dropdown"
   - Documentation contains data attributes and configuration options

4. **User mentions specific features or functionality**
   - Example: "auto-close on outside click", "keyboard navigation", "validation states"
   - These are often documented with specific HTML attributes and examples

5. **Component exists but user needs advanced usage**
   - Example: "nested navigation", "multi-step forms", "conditional rendering"
   - Documentation often has advanced examples and patterns

6. **You're unsure about the correct HTML structure or classes**
   - Always prefer documented patterns over making assumptions
   - Preline has specific conventions for semantic HTML and accessibility

---

## How to Access Documentation

### Primary Method: Use MCP Resources

Preline documentation is available through the MCP server. You can:

1. **List available documentation resources:**
   ```
   Use ListMcpResources tool to see all available Preline documentation
   ```

2. **Fetch specific component documentation:**
   ```
   Use FetchMcpResource tool with the appropriate URI to get detailed docs
   ```

### What to Look For in Documentation

When you access documentation, focus on:

1. **HTML Structure**
   - Exact element hierarchy
   - Required CSS classes
   - Data attributes for behavior
   - Accessibility attributes (aria-*, role, etc.)

2. **Variants and Options**
   - Different visual styles (outlined, filled, ghost, etc.)
   - Size variations (sm, md, lg, xl)
   - State variations (disabled, loading, error, success)
   - Layout variations (horizontal, vertical, inline)

3. **Configuration**
   - JavaScript initialization code
   - Data attribute options
   - Event handlers
   - Default values

4. **Integration Patterns**
   - How components work together
   - Common combinations (e.g., input + button in input-group)
   - Best practices for composition

---

## Example Workflows

### Example 1: User asks for a specific variant

**User:** "Add a floating label input for email"

**Agent workflow:**
1. Recognize this is a variant of the input component
2. Check if standard input component has this variant
3. If not in standard component, check documentation:
   - List MCP resources to find input documentation
   - Fetch input component documentation
   - Look for "floating label" variant
   - Extract the correct HTML structure and classes
4. Implement using the documented pattern

### Example 2: User needs component configuration

**User:** "Make the accordion stay open when clicking other items"

**Agent workflow:**
1. Recognize this is about accordion behavior configuration
2. Check documentation for accordion:
   - Fetch accordion documentation
   - Look for configuration options
   - Find data attributes for behavior control
   - Find the specific option (e.g., `data-hs-accordion-always-open`)
3. Apply the correct data attribute to the HTML

### Example 3: User asks about complex composition

**User:** "Create a search input with a button inside"

**Agent workflow:**
1. Recognize this might be an input-group pattern
2. Check documentation:
   - Check if input-group component exists
   - Fetch input-group documentation
   - Look for examples with buttons
   - Get the proper HTML structure
3. Implement using the documented pattern

---

## Key Preline Documentation Sections

Common documentation sections you should be aware of:

1. **Components** - Individual UI components with variants
2. **Forms** - Form elements and validation patterns
3. **Navigation** - Navigation patterns and menu structures
4. **Layout** - Grid systems, containers, spacing
5. **Utilities** - Helper classes and utilities
6. **JavaScript** - Initialization and API documentation
7. **Accessibility** - ARIA patterns and keyboard navigation
8. **Examples** - Real-world usage examples and templates

---

## Documentation Priority Rules

When implementing components, follow this priority:

1. **FIRST**: Check if a standard component exists in the component list
   - Use single_component or batch_components tools
   - This is the fastest and most reliable method

2. **SECOND**: If the request is for a variant or pattern not in standard components:
   - Check Preline documentation via MCP resources
   - Look for the exact pattern or variant
   - Use documented HTML structure and classes

3. **THIRD**: If documentation doesn't have the exact pattern:
   - Look for similar patterns and adapt them
   - Follow Preline conventions and naming patterns
   - Maintain consistency with existing components

4. **LAST RESORT**: If truly custom implementation is needed:
   - Build on top of existing Preline components
   - Follow Preline's design system and conventions
   - Use Preline utility classes and tokens
   - Ensure accessibility and responsiveness

---

## Common Patterns in Preline Documentation

Understanding these patterns helps you navigate documentation more efficiently:

### Data Attributes for Behavior
```html
<!-- Component identification -->
data-hs-[component-name]

<!-- Configuration options -->
data-hs-[component-name]-options='{"key": "value"}'

<!-- Trigger elements -->
data-hs-[component-name]-trigger

<!-- Target elements -->
data-hs-[component-name]-target="#element-id"
```

### State Classes
```html
<!-- Active/selected state -->
.active, .selected, [aria-selected="true"]

<!-- Disabled state -->
.disabled, [disabled], [aria-disabled="true"]

<!-- Focus/hover states -->
.focus, .hover, :focus, :hover

<!-- Open/closed states -->
.open, [aria-expanded="true"]
```

### Size Variations
```html
<!-- Small -->
.hs-[component]-sm, .text-sm, .p-2

<!-- Medium (default) -->
.hs-[component]-md, .text-base, .p-3

<!-- Large -->
.hs-[component]-lg, .text-lg, .p-4

<!-- Extra large -->
.hs-[component]-xl, .text-xl, .p-5
```

---

## Integration with Other Skills

This skill works together with other Preline skills:

- **preline-theme-generator**: Documentation shows how themes affect component appearance
- **Component tools** (single_component, batch_components): Use these first, fall back to documentation for variants
- **Browser testing**: Test documented patterns to ensure they work correctly

---

## Best Practices

1. **Always prefer documented patterns** over custom implementations
2. **Use exact HTML structure** from documentation for accessibility
3. **Include all required data attributes** for JavaScript functionality
4. **Maintain semantic HTML** as shown in documentation
5. **Follow naming conventions** for classes and IDs
6. **Test component behavior** after implementation
7. **Keep documentation patterns up to date** with the current Preline version

---

## Agent Response Pattern

When you need to check documentation, inform the user:

**Good:**
> "Let me check the Preline documentation for the floating label input variant to ensure I use the correct HTML structure and classes."

**Also Good:**
> "I'll look up the accordion configuration options in the documentation to find the right data attribute for keeping items open."

**Avoid:**
> "I'm not sure how to do this." (Instead, check documentation first)

**Avoid:**
> "Let me just try this..." (Don't guess when documentation exists)

---

## Summary

**When to use this skill:**
- User requests component variants not in standard components
- User needs specific markup patterns or HTML structure
- User asks about component behavior or configuration
- You need to verify correct implementation patterns
- You're implementing advanced or complex component compositions

**How to use this skill:**
1. Use ListMcpResources to see available documentation
2. Use FetchMcpResource to get specific documentation
3. Extract the relevant HTML structure, classes, and attributes
4. Implement using documented patterns
5. Test the implementation

**Key principle:**
Always prefer documented patterns over assumptions. Preline documentation is your source of truth for correct HTML structure, classes, and behavior configuration.
