/*
 * Plugin - Overlay
 * @version: 1.3.1
 * @author: HtmlStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
  addVariant('hs-overlay-open', [
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.open.${e(`hs-overlay-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.open .${e(`hs-overlay-open${separator}${className}`)}`;
      });
    },
  ]);
  addVariant('hs-overlay-backdrop-open', [
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-overlay-backdrop.${e(`hs-overlay-backdrop-open${separator}${className}`)}`;
      });
    },
    ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
        return `.hs-overlay-backdrop .${e(`hs-overlay-backdrop-open${separator}${className}`)}`;
      });
    },
  ]);
});
