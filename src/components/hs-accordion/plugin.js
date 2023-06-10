/*
 * Plugin - Accordion
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-accordion-active', [
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-accordion.active.${e(`hs-accordion-active${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-accordion.active > .hs-accordion-toggle .${e(`hs-accordion-active${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-accordion.active > .hs-accordion-toggle.${e(`hs-accordion-active${separator}${className}`)}`;
      });
    },
  ]);
});
