/*
 * Plugin - Collapse
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-collapse-open', [
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-collapse.open .${e(`hs-collapse-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-collapse.open.${e(`hs-collapse-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-collapse-toggle.open .${e(`hs-collapse-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-collapse-toggle.open.${e(`hs-collapse-open${separator}${className}`)}`;
      });
    },
  ]);
});
