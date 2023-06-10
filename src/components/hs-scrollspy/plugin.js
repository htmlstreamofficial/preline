/*
 * Plugin - Scrollspy
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-scrollspy-active', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.active.${e(`hs-scrollspy-active${separator}${className}`)}`;
    });
  });
});
