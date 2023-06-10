/*
 * Plugin - Mode
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-dark-mode-active', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.dark .${e(`hs-dark-mode-active${separator}${className}`)}`;
    });
  });
  addVariant('hs-auto-mode-active', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.auto .${e(`hs-auto-mode-active${separator}${className}`)}`;
    });
  });
  addVariant('hs-default-mode-active', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.default .${e(`hs-default-mode-active${separator}${className}`)}`;
    });
  });
});
