/*
 * Plugin - Dropdown
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-dropdown-open', [
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-dropdown.open > .${e(`hs-dropdown-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-dropdown.open > .hs-dropdown-menu > .${e(`hs-dropdown-open${separator}${className}`)}`;
      });
    },
  ]);
});
