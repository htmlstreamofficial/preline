# Advanced Datepicker

Create visually appealing and interactive datepickers in combination with the Datepicker JavaScript plugin.

[![npm](https://img.shields.io/badge/npm-v4.2.0-blue)](https://www.npmjs.com/package/@preline/datepicker) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://preline.co/plugins/advanced-datepicker.html)

## Contents

- [Overview](#overview)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [JavaScript API](#javascript-api)
- [Events](#events)
- [Common Patterns](#common-patterns)
- [License](#license)

## Overview

The Advanced Datepicker component provides a comprehensive date selection interface with support for custom templates, multiple date formats, time selection, and integration with Vanilla Calendar Pro. It offers flexible configuration options for styling and behavior.

**Key Features:**
- Date and time selection
- Custom select inputs for months, years, and time
- Multiple date formats and locales
- Custom templates for arrows and time display
- Integration with Vanilla Calendar Pro
- Programmatic control via JavaScript API
- Utility classes support

## Installation

To get started, install Datepicker plugin via npm, else you can skip this step if you are already using Preline UI as a package.

```bash
npm i @preline/select @preline/datepicker
```

### CSS

Use [`@source`](https://tailwindcss.com/docs/functions-and-directives#source-directive) to register the plugin's JavaScript path for Tailwind CSS scanning, then [`@import`](https://tailwindcss.com/docs/functions-and-directives#import-directive) the plugin's CSS files into your Tailwind CSS file.

Use `styles.css` with `theme.css` for the default themed appearance:

```css
@import "tailwindcss";

/* @preline/select */
@source "../node_modules/@preline/select/*.js";
@import "./node_modules/@preline/select/variants.css";

/* @preline/datepicker */
@source "../node_modules/@preline/datepicker/*.js";
@import "./node_modules/@preline/datepicker/variants.css";
@import "./node_modules/@preline/datepicker/styles.css";
@import "./node_modules/@preline/datepicker/theme.css";
```

Use `styles-utility.css` instead when you plan to style the datepicker entirely with Tailwind utility classes. In this case `theme.css` is not needed:

```css
@import "tailwindcss";

/* @preline/select */
@source "../node_modules/@preline/select/*.js";
@import "./node_modules/@preline/select/variants.css";
@import "./node_modules/@preline/select/theme.css";

/* @preline/datepicker */
@source "../node_modules/@preline/datepicker/*.js";
@import "./node_modules/@preline/datepicker/variants.css";
@import "./node_modules/@preline/datepicker/styles-utility.css";
```

`@preline/select` is required for styling the embedded select dropdowns used in `custom-select` mode.

### JavaScript

Include the JavaScript that powers the interactive elements near the end of your `</body>` tag:

```html
<script src="./node_modules/@preline/datepicker/index.js"></script>
```

### Manual Initialization

Use the `non-auto` entry if you need manual initialization. In this mode, automatic initialization on page load is not included, so the component should be initialized explicitly.

```html
<script type="module">
  import HSDatepicker from "@preline/datepicker/non-auto.mjs";

  new HSDatepicker(document.querySelector("#datepicker"));
</script>
```

### Via Bundler

When using a bundler (Vite, webpack, etc.), import the plugin directly as an ES module. `vanilla-calendar-pro` and the Advanced Select plugin are bundled inside `@preline/datepicker`, so no separate imports are needed.

`@preline/datepicker` is the auto-init entry: it scans the DOM and initializes matching elements automatically.

```js
import "@preline/datepicker";
```

`@preline/datepicker/non-auto` is the manual entry: use it when you want explicit control over when initialization happens, either via `autoInit()` or by creating a specific instance yourself.

```js
import HSDatepicker from "@preline/datepicker/non-auto";

HSDatepicker.autoInit();

// Or initialize a specific element manually
const el = document.querySelector("#datepicker");
if (el) new HSDatepicker(el);
```

### TypeScript

This package ships with TypeScript type definitions. No additional `@types/` package is needed.

## Basic usage

The following example demonstrates the minimal HTML structure required for an advanced datepicker component. This is a base template without custom styling - you can apply your own CSS classes and styles as needed. The datepicker appears when the input is focused.

```html
<input
  class="hs-datepicker"
  type="text" placeholder="" 
  readonly
  data-hs-datepicker='{
    "type": "default",
    "dateMax": "2050-12-31",
    "styles": {
      "week": "vc-week",
      "weekDay": "vc-week__day",
      "dates": "vc-dates",
      "date": "vc-date",
      "arrowPrev": "vc-arrow vc-arrow_prev",
      "arrowNext": "vc-arrow vc-arrow_next"
    },
    "mode": "custom-select"
  }'>
```

**Structure Requirements:**
- `hs-datepicker`: Required class on the input element
- `data-hs-datepicker`: Required attribute containing configuration options as JSON
- `readonly` attribute on the input to prevent manual editing
- `type="text"` on the input element

**Initial State:**
- Input field is empty by default
- Datepicker appears when input is focused or clicked

## Configuration Options

### Data Options

> **Note:** This component requires the use of the [Vanilla Calendar Pro](https://vanilla-calendar.pro/) plugin. Most options available in the plugin are available in our wrapper. Check [Vanilla Calendar Pro Options](https://vanilla-calendar.pro/docs/reference/settings/) for more details.

Data options are specified in the `data-hs-datepicker` attribute as a JSON object.

| Option | Target Element | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `data-hs-datepicker` | Input element | - | - | Activate a Datepicker by specifying on an element. Should be added to the element itself. |
| `:mode` | Inside `data-hs-datepicker` | `"default"` \| `"custom-select"` | `"default"` | This option allows you to specify the operational mode of the datepicker. `default` uses standard layout provided by Vanilla Calendar Pro. `custom-select` activates custom select inputs for months, years and time elements. |
| `:applyUtilityClasses` | Inside `data-hs-datepicker` | boolean | `false` | Specifies whether to apply utility classes to the datepicker. If set to `true`, the datepicker receives utility classes based on the `primary` theme. |
| `:inputModeOptions.dateSeparator` | Inside `data-hs-datepicker` | string | `"."` | Specifies the character used to separate the year, month, and day in the date format displayed in the input field. E.g., `/` produces a date format like `2024/01/22`. |
| `:inputModeOptions.itemsSeparator` | Inside `data-hs-datepicker` | string | `", "` | Specifies the character or string used to separate multiple date entries in the input field when multiple dates are selected. E.g., `\|` produces a format like `2024-01-22 \| 2024-01-23`. |
| `:inputModeOptions.closeOnSelect` | Inside `data-hs-datepicker` | boolean | `false` | Closes the calendar once a date is picked. Applies to single-date selection without time; ranges, multiple dates and time pickers stay open. |
| `:styles.customSelect.shared` | Inside `data-hs-datepicker` | object | - | Defines shared styling configurations for Advanced Custom Select components. These styles are consistently applied to all instances of the Advanced Custom Select within the wrapper. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:styles.customSelect.months` | Inside `data-hs-datepicker` | object | - | Defines additional styling configurations specifically for the "months" instance of the Advanced Custom Select. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:styles.customSelect.years` | Inside `data-hs-datepicker` | object | - | Defines additional styling configurations specifically for the "years" instance of the Advanced Custom Select. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:styles.customSelect.hours` | Inside `data-hs-datepicker` | object | - | Defines additional styling configurations specifically for the "hours" instance of the Advanced Custom Select. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:styles.customSelect.minutes` | Inside `data-hs-datepicker` | object | - | Defines additional styling configurations specifically for the "minutes" instance of the Advanced Custom Select. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:styles.customSelect.meridiem` | Inside `data-hs-datepicker` | object | - | Defines additional styling configurations specifically for the "meridiem" instance of the Advanced Custom Select. See [Advanced Select Options](advanced-select.md#js-data-options) for available options. |
| `:templates.time` | Inside `data-hs-datepicker` | string | - | Allows to define a custom HTML template for rendering the time selection interface within the datepicker. |
| `:templates.arrowPrev` | Inside `data-hs-datepicker` | string | - | Allows to define a custom HTML template for the "previous" navigation arrow in the datepicker. |
| `:templates.arrowNext` | Inside `data-hs-datepicker` | string | - | Allows to define a custom HTML template for the "next" navigation arrow in the datepicker. |
| `:dateFormat` | Inside `data-hs-datepicker` | string | - | Allows to define a custom date format. |
| `:dateLocale` | Inside `data-hs-datepicker` | string | - | Allows to define the locale for the datepicker. |
| `:replaceTodayWithText` | Inside `data-hs-datepicker` | boolean | - | Replace the current day name with the text "Today". |

**Example:**
```html
<input
  class="hs-datepicker"
  type="text"
  readonly
  data-hs-datepicker='{
    "mode": "custom-select",
    "dateFormat": "YYYY-MM-DD",
    "dateLocale": "en",
    "inputModeOptions": {
      "dateSeparator": "/"
    }
  }'>
```

### Tailwind Modifiers

| Name | Description |
| --- | --- |
| `hs-vc-date-today:*` | A modifier that applies Tailwind classes to the current date (marked as "today") using the attribute `data-vc-date-today`. |
| `hs-vc-date-selected:*` | A modifier that applies Tailwind classes to the selected dates using the attribute `data-vc-date-selected`. |
| `hs-vc-date-weekend:*` | A modifier that applies Tailwind classes to weekend dates using the attribute `data-vc-date-weekend`. |
| `hs-vc-week-day-off:*` | A modifier that applies Tailwind classes to weekdays marked as "day off" using the attribute `data-vc-week-day-off`. |
| `hs-vc-date-month-prev:*` | A modifier that applies Tailwind classes to dates belonging to the previous month using the class `data-vc-date-month="prev"`. |
| `hs-vc-date-month-next:*` | A modifier that applies Tailwind classes to dates belonging to the next month using the attribute `data-vc-date-month="next"`. |
| `hs-vc-calendar-selected-middle:*` | A modifier that applies Tailwind classes to dates that are in the middle of a selected range using the attribute `data-vc-date-selected="middle"`. |
| `hs-vc-calendar-selected-first:*` | A modifier that applies Tailwind classes to the first date in a selected range using the attribute `data-vc-date-selected="first"`. |
| `hs-vc-calendar-selected-last:*` | A modifier that applies Tailwind classes to the last date in a selected range using the attribute `data-vc-date-selected="last"`. |
| `hs-vc-months-month-selected:*` | A modifier that applies Tailwind classes to the currently selected month using the attribute `data-vc-months-month-selected`. |
| `hs-vc-years-year-selected:*` | A modifier that applies Tailwind classes to the currently selected year using the attribute `data-vc-years-year-selected`. |

## JavaScript API

> **Note:** This component requires the use of the [Vanilla Calendar Pro](https://vanilla-calendar.pro/) plugin. Most methods available in the plugin are available through our wrapper. Check [Vanilla Calendar Pro Methods](https://vanilla-calendar.pro/docs/reference/methods/) for more details.

The `HSDatepicker` object is available in the global `window` object after the plugin is loaded. Most methods from Vanilla Calendar Pro are available through the wrapper.

### Instance Methods

These methods are called on a datepicker instance.

| Method | Parameters | Return Type | Description |
| --- | --- | --- | --- |
| `getCurrentState()` | None | `{ selectedDates: DatesArr, selectedTime: string }` | Returns the current state of the datepicker including selected dates and time. |
| `formatDate(date, format)` | `date`: `string \| number \| Date`<br>`format`: `string` (optional) | `string` | Formats a date according to the specified format or the datepicker's default format. |
| `destroy()` | None | `void` | Destroys the datepicker instance, removes all generated markup, classes, and event listeners. Use when removing datepicker from DOM. |

### Static Methods

These methods are called directly on the `HSDatepicker` class.

| Method | Parameters | Return Type | Description |
| --- | --- | --- | --- |
| `HSDatepicker.getInstance(target, isInstance)` | `target`: `HTMLElement \| string` (CSS selector)<br>`isInstance`: `boolean` (optional) | `HTMLElement \| { id: string \| number, element: HSDatepicker } \| null` | Returns the datepicker instance or element associated with the target. If `isInstance` is `true`, returns collection item object `{ id, element }` where `element` is the `HSDatepicker` instance. If `isInstance` is `false` or omitted, returns the DOM element (`HTMLElement`). Returns `null` if datepicker instance is not found. |

### Usage Examples

**Example 1: Getting current state**
```javascript
// Get the datepicker instance
const instance = HSDatepicker.getInstance('.hs-datepicker', true);

if (instance) {
  const { element } = instance;
  // Get current state
  const state = element.getCurrentState();

  console.log('Selected dates:', state.selectedDates);
  console.log('Selected time:', state.selectedTime);
}
```

**Example 2: Formatting dates**
```javascript
const instance = HSDatepicker.getInstance('.hs-datepicker', true);

if (instance) {
  const { element } = instance;
  // Format a date
  const formatted = element.formatDate(new Date(), 'YYYY-MM-DD');

  console.log('Formatted date:', formatted);
}
```

**Example 3: Destroying datepicker instance**
```javascript
const instance = HSDatepicker.getInstance('.hs-datepicker', true);

if (instance) {
  const { element } = instance;
  const removeBtn = document.querySelector('#hs-remove-btn');

  removeBtn.addEventListener('click', () => {
    // Clean up before removing from DOM
    element.destroy();
    // Now safe to remove the element
    document.querySelector('.hs-datepicker').remove();
  });
}
```

## Events

Datepicker instances emit events that can be listened to for date selection lifecycle hooks.

| Event Name | When Fired | Callback Parameter | Description |
| --- | --- | --- | --- |
| `on:change` | When the selected date or time changes | `{ selectedDates: string[], selectedTime: string }` (current selection state) | Fires after the user picks a date or changes the time. The payload matches the shape returned by `getCurrentState()`. |

### Event Usage Example

```javascript
// Get datepicker instance
const instance = HSDatepicker.getInstance('.hs-datepicker', true);

if (instance) {
  const { element } = instance;

  // Listen for date or time changes
  element.on('change', ({ selectedDates, selectedTime }) => {
    console.log('Selected dates:', selectedDates);
    console.log('Selected time:', selectedTime);
    // Update dependent fields, validate form, etc.
  });
}
```

## Common Patterns

### Pattern 1: Custom Select Mode

Use custom select inputs for months, years, and time.

```html
<input
  class="hs-datepicker"
  type="text"
  readonly
  data-hs-datepicker='{
    "mode": "custom-select"
  }'>
```

### Pattern 2: Custom Date Format

Set a custom date format and separator.

```html
<input
  class="hs-datepicker"
  type="text"
  readonly
  data-hs-datepicker='{
    "dateFormat": "YYYY-MM-DD",
    "inputModeOptions": {
      "dateSeparator": "/"
    }
  }'>
```

## License

Copyright (c) 2024 Htmlstream.

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
