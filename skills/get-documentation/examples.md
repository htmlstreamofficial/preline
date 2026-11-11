# Documentation Access Examples

This file contains practical examples of when and how to use the Preline documentation.

---

## Example 1: Finding a Component Variant

### User Request
> "I need an input with a floating label"

### Agent Response Flow

1. **Recognize the pattern**: This is a variant of the input component
2. **Check standard components first**: Input component exists, but does it have floating label variant?
3. **Access documentation**:
   ```
   ListMcpResources → Find input documentation resource
   FetchMcpResource → Get input component documentation
   ```
4. **Search for variant**: Look for "floating label" in the documentation
5. **Extract pattern**: Get HTML structure, classes, and required attributes
6. **Implement**: Use the documented pattern exactly as shown

### Expected Documentation Content
```html
<!-- Floating label input -->
<div class="relative">
  <input 
    type="email" 
    id="email" 
    class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
    placeholder="you@email.com"
  />
  <label 
    for="email"
    class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
  >
    Email
  </label>
</div>
```

---

## Example 2: Component Configuration

### User Request
> "Make the dropdown open on hover instead of click"

### Agent Response Flow

1. **Recognize the need**: This requires configuration change
2. **Access documentation**:
   ```
   ListMcpResources → Find dropdown documentation
   FetchMcpResource → Get dropdown configuration docs
   ```
3. **Find configuration option**: Look for hover/trigger options
4. **Apply data attribute**: Add the configuration to HTML

### Expected Documentation Content
```html
<!-- Hover trigger dropdown -->
<div class="hs-dropdown relative inline-flex" data-hs-dropdown-trigger="hover">
  <button type="button" class="hs-dropdown-toggle ...">
    Dropdown
  </button>
  
  <div class="hs-dropdown-menu ...">
    <!-- Dropdown content -->
  </div>
</div>
```

### Configuration Options from Docs
```javascript
{
  "trigger": "click" | "hover" | "focus",
  "delay": 300,
  "autoClose": true,
  "placement": "bottom-start" | "top-start" | "right-start" | ...
}
```

---

## Example 3: Complex Component Composition

### User Request
> "Create a navbar with a mega menu"

### Agent Response Flow

1. **Recognize complexity**: This is a specific pattern that combines navbar + mega menu
2. **Access documentation**:
   ```
   ListMcpResources → Find navbar and mega-menu documentation
   FetchMcpResource → Get both documentation resources
   ```
3. **Find integration pattern**: Look for examples of navbar with mega menu
4. **Extract complete structure**: Get the full HTML hierarchy
5. **Implement**: Use the documented pattern with all necessary elements

### Expected Documentation Pattern
```html
<header class="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
  <nav class="relative max-w-[66rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <div class="flex items-center justify-between">
      <a class="flex-none font-semibold text-xl" href="#">Brand</a>
    </div>
    
    <!-- Navigation with Mega Menu -->
    <div class="hs-collapse overflow-hidden transition-all duration-300 basis-full grow md:block">
      <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-3">
        
        <!-- Regular nav item -->
        <a class="p-2 flex items-center text-sm text-gray-800 hover:text-gray-500" href="#">
          Link
        </a>
        
        <!-- Mega menu dropdown -->
        <div class="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none]">
          <button type="button" class="hs-dropdown-toggle p-2 flex items-center text-sm text-gray-800">
            Mega Menu
            <svg class="..." />
          </button>
          
          <!-- Mega menu content -->
          <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative md:w-48 hidden z-10 top-full ps-7 md:ps-0 md:bg-white md:rounded-lg md:shadow-md before:absolute before:-top-4 before:start-0 before:w-full before:h-5 md:after:hidden after:absolute after:top-1 after:start-[18px] after:w-0.5 after:h-[calc(100%-0.25rem)] after:bg-gray-100">
            <div class="py-1 md:px-1 space-y-0.5">
              <a class="p-2 flex items-center text-sm text-gray-800 rounded-lg hover:bg-gray-100" href="#">
                About
              </a>
              <!-- More items -->
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </nav>
</header>
```

---

## Example 4: Form Validation Patterns

### User Request
> "Add validation states to the form inputs"

### Agent Response Flow

1. **Recognize the pattern**: Need validation markup and classes
2. **Access documentation**:
   ```
   ListMcpResources → Find form validation documentation
   FetchMcpResource → Get validation patterns
   ```
3. **Find state patterns**: Success, error, warning states
4. **Extract markup**: Get HTML structure for each state
5. **Implement**: Apply validation patterns to form

### Expected Documentation Content

#### Error State
```html
<div>
  <label for="email" class="block text-sm font-medium mb-2">Email</label>
  <input 
    type="email" 
    id="email"
    class="py-3 px-4 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500"
    aria-describedby="email-error"
  />
  <p class="text-sm text-red-600 mt-2" id="email-error">Please enter a valid email address</p>
</div>
```

#### Success State
```html
<div>
  <label for="email" class="block text-sm font-medium mb-2">Email</label>
  <input 
    type="email" 
    id="email"
    class="py-3 px-4 block w-full border-green-500 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
  />
  <p class="text-sm text-green-600 mt-2">Looks good!</p>
</div>
```

---

## Example 5: Accessibility Patterns

### User Request
> "Make the modal accessible with keyboard navigation"

### Agent Response Flow

1. **Recognize accessibility need**: Need proper ARIA attributes and keyboard handling
2. **Access documentation**:
   ```
   ListMcpResources → Find modal accessibility documentation
   FetchMcpResource → Get accessibility patterns
   ```
3. **Find ARIA patterns**: role, aria-labelledby, aria-modal, etc.
4. **Find keyboard handlers**: Escape key, focus trap, etc.
5. **Implement**: Use documented accessibility pattern

### Expected Documentation Content
```html
<div 
  class="hs-overlay hidden ..."
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div class="hs-overlay-open:mt-7 ...">
    <div class="flex justify-between items-center py-3 px-4 border-b">
      <h3 id="modal-title" class="font-bold text-gray-800">
        Modal title
      </h3>
      <button 
        type="button" 
        class="..."
        data-hs-overlay="#modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="p-4">
      <!-- Modal content -->
    </div>
  </div>
</div>
```

### Keyboard Navigation Documentation
- **ESC**: Close modal
- **Tab**: Navigate through focusable elements inside modal
- **Shift + Tab**: Navigate backwards
- **Focus trap**: Focus stays within modal when open
- **Auto-focus**: First focusable element receives focus on open
- **Return focus**: Focus returns to trigger element on close

---

## Example 6: Responsive Patterns

### User Request
> "Make the sidebar collapse on mobile"

### Agent Response Flow

1. **Recognize responsive behavior**: Need responsive classes and collapse behavior
2. **Access documentation**:
   ```
   ListMcpResources → Find sidebar responsive documentation
   FetchMcpResource → Get responsive patterns
   ```
3. **Find breakpoint patterns**: Mobile, tablet, desktop behaviors
4. **Extract implementation**: Get HTML structure with responsive classes
5. **Implement**: Apply responsive pattern

### Expected Documentation Content
```html
<!-- Mobile toggle button -->
<button 
  type="button" 
  class="md:hidden p-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border"
  data-hs-overlay="#sidebar"
  aria-controls="sidebar"
  aria-label="Toggle navigation"
>
  <svg class="w-4 h-4" />
  Menu
</button>

<!-- Sidebar -->
<div 
  id="sidebar"
  class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto md:block md:translate-x-0 md:end-auto md:bottom-0"
>
  <!-- Sidebar content -->
</div>
```

### Responsive Classes Documentation
- **Mobile first**: Hidden by default, shown via overlay
- **md:block**: Visible on medium screens and up
- **md:translate-x-0**: No transform on desktop
- **hs-overlay**: Mobile overlay behavior
- **data-hs-overlay**: Toggle trigger

---

## Example 7: Dark Mode Patterns

### User Request
> "Add dark mode support to the card"

### Agent Response Flow

1. **Recognize dark mode need**: Need dark mode classes
2. **Access documentation**:
   ```
   ListMcpResources → Find dark mode documentation
   FetchMcpResource → Get dark mode patterns
   ```
3. **Find dark mode classes**: bg, text, border variations
4. **Extract pattern**: Get class combinations for dark mode
5. **Implement**: Apply dark mode classes

### Expected Documentation Content
```html
<div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
  <div class="p-4 md:p-5">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white">
      Card title
    </h3>
    <p class="mt-1 text-gray-500 dark:text-neutral-400">
      Card description
    </p>
    <button class="mt-3 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
      Button
    </button>
  </div>
</div>
```

### Dark Mode Class Patterns
- **Backgrounds**: `bg-white dark:bg-neutral-900`
- **Borders**: `border-gray-200 dark:border-neutral-700`
- **Text**: `text-gray-800 dark:text-white`
- **Muted text**: `text-gray-500 dark:text-neutral-400`
- **Primary**: `bg-blue-600 dark:bg-blue-500`

---

## Best Practices Summary

1. **Always check documentation** before implementing custom solutions
2. **Use exact class names** from documentation for consistency
3. **Include all ARIA attributes** for accessibility
4. **Follow responsive patterns** from documentation
5. **Apply dark mode classes** consistently
6. **Use data attributes** for JavaScript behavior
7. **Maintain semantic HTML** structure
8. **Test keyboard navigation** for interactive components
9. **Verify focus states** are visible and accessible
10. **Keep markup minimal** - don't add unnecessary elements

---

## Quick Reference: Common Documentation Lookups

| User Need | Documentation to Check | Key Sections |
|-----------|----------------------|--------------|
| Component variant | Component docs | Variants, Examples |
| Behavior configuration | Component docs | Configuration, Data Attributes |
| Form validation | Forms docs | Validation, States |
| Accessibility | Component docs | Accessibility, Keyboard |
| Responsive behavior | Component docs | Responsive, Breakpoints |
| Dark mode | Component docs | Dark Mode, Theming |
| Custom styling | Component docs | Customization, Classes |
| JavaScript API | Component docs | API, Events, Methods |

---

## When Documentation Is Missing

If you can't find the pattern in documentation:

1. **Look for similar patterns** in related components
2. **Follow Preline conventions** for naming and structure
3. **Use Preline utility classes** and design tokens
4. **Maintain accessibility** standards (WCAG 2.1)
5. **Test thoroughly** before delivering
6. **Document your approach** for the user
7. **Suggest checking official Preline website** for updates
