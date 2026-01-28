#!/usr/bin/env node
/**
 * Preline Theme Generator
 * 
 * Generates a complete theme CSS file from a simple config.
 * 
 * Usage:
 *   node generate-theme.js config.json [output.css]
 *   node generate-theme.js config.yaml [output.css]
 * 
 * Or programmatically:
 *   const { generateTheme } = require('./generate-theme.js');
 *   const css = generateTheme(config);
 */

const fs = require('fs');
const path = require('path');

// ============================================
// COLOR CONVERSION UTILITIES
// ============================================

/**
 * Convert OKLCH to sRGB
 * Based on CSS Color Level 4 spec
 */
function oklchToRgb(l, c, h) {
  // Convert to OKLab first
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear sRGB via LMS
  const L = l + 0.3963377774 * a + 0.2158037573 * b;
  const M = l - 0.1055613458 * a - 0.0638541728 * b;
  const S = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_ = L * L * L;
  const m_ = M * M * M;
  const s_ = S * S * S;

  let rLinear = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let gLinear = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let bLinear = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  // Linear to sRGB gamma
  const gammaCorrect = (x) => {
    if (x >= 0.0031308) {
      return 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    }
    return 12.92 * x;
  };

  let r = Math.round(Math.max(0, Math.min(1, gammaCorrect(rLinear))) * 255);
  let g = Math.round(Math.max(0, Math.min(1, gammaCorrect(gLinear))) * 255);
  let bVal = Math.round(Math.max(0, Math.min(1, gammaCorrect(bLinear))) * 255);

  return { r, g, b: bVal };
}

/**
 * Convert OKLCH to hex color
 * @param {number} l - Lightness (0-100 as percentage, will be converted to 0-1)
 * @param {number} c - Chroma (0-0.4 typically)
 * @param {number} h - Hue (0-360)
 * @returns {string} Hex color string (e.g., "#2563eb")
 */
function oklchToHex(l, c, h) {
  // Convert percentage to 0-1 if needed
  const lightness = l > 1 ? l / 100 : l;

  const { r, g, b } = oklchToRgb(lightness, c, h);

  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex color to hue (0-360)
 * @param {string} hex - Hex color (e.g., "#2F6BFF" or "2F6BFF")
 * @returns {number} Hue in degrees (0-360)
 */
function hexToHue(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return h;
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate config and return error messages if invalid
 * @param {Object} config
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateConfig(config) {
  const errors = [];

  // Required: name
  if (!config.name || typeof config.name !== 'string') {
    errors.push('Missing required field: "name" (string, kebab-case theme name)');
  } else if (!/^[a-z][a-z0-9-]*$/.test(config.name)) {
    errors.push(`Invalid name "${config.name}": must be kebab-case (lowercase letters, numbers, hyphens, starting with letter)`);
  }

  // Required: hue OR primaryColor
  const hasHue = typeof config.hue === 'number';
  const hasPrimaryColor = typeof config.primaryColor === 'string';

  if (!hasHue && !hasPrimaryColor) {
    errors.push('Missing required field: "hue" (number 0-360) or "primaryColor" (hex string like "#2F6BFF")');
  }

  if (hasHue && (config.hue < 0 || config.hue > 360)) {
    errors.push(`Invalid hue ${config.hue}: must be between 0 and 360`);
  }

  if (hasPrimaryColor && !/^#?[0-9A-Fa-f]{6}$/.test(config.primaryColor)) {
    errors.push(`Invalid primaryColor "${config.primaryColor}": must be 6-digit hex (e.g., "#2F6BFF")`);
  }

  // Optional: style
  if (config.style && !['vibrant', 'soft'].includes(config.style)) {
    errors.push(`Invalid style "${config.style}": must be "vibrant" or "soft"`);
  }

  // Optional: tailwindGray
  const validGrays = ['neutral', 'stone', 'zinc', 'slate', 'gray'];
  if (config.tailwindGray && !validGrays.includes(config.tailwindGray)) {
    errors.push(`Invalid tailwindGray "${config.tailwindGray}": must be one of ${validGrays.join(', ')}`);
  }

  return errors;
}

// ============================================
// PALETTE GENERATION
// ============================================

/**
 * Calculate lightness for a shade using a formula-based approach
 * @param {number} shade - Shade number (50-950)
 * @returns {number} Lightness percentage
 */
function calculateLightness(shade) {
  // Use a polynomial curve that matches Tailwind's visual rhythm
  // 50 = ~97%, 500 = ~60%, 950 = ~20%
  const shadeNormalized = shade / 1000;
  const lightness = 97 - (shadeNormalized * 85) + (Math.pow(shadeNormalized, 2) * 10);
  return Math.round(Math.max(15, Math.min(98, lightness)) * 10) / 10;
}

/**
 * Generate brand color palette (vibrant or soft)
 */
function generateBrandPalette(name, hue, style = 'vibrant') {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Chroma values - vibrant vs soft
  const chromaVibrant = {
    50: 0.08, 100: 0.10, 200: 0.12, 300: 0.14, 400: 0.16,
    500: 0.14, 600: 0.12, 700: 0.10, 800: 0.08, 900: 0.06, 950: 0.05
  };

  const chromaSoft = {
    50: 0.012, 100: 0.020, 200: 0.035, 300: 0.055, 400: 0.075,
    500: 0.085, 600: 0.080, 700: 0.070, 800: 0.055, 900: 0.040, 950: 0.030
  };

  const chroma = style === 'soft' ? chromaSoft : chromaVibrant;

  return shades.map(shade => {
    const l = calculateLightness(shade);
    const c = chroma[shade];
    return `  --color-${name}-${shade}: oklch(${l}% ${c} ${hue});`;
  }).join('\n');
}

/**
 * Generate gray palette with bell curve chroma
 * Low at extremes (for clean light/dark backgrounds), peak at midtones
 */
function generateGrayPalette(name, hue) {
  const shades = [
    { shade: 50, l: 98, c: 0.002 },
    { shade: 100, l: 95.5, c: 0.004 },
    { shade: 200, l: 89.7, c: 0.008 },
    { shade: 300, l: 82.7, c: 0.012 },
    { shade: 400, l: 73, c: 0.018 },
    { shade: 500, l: 62.5, c: 0.020 },  // Peak chroma
    { shade: 600, l: 52.8, c: 0.016 },
    { shade: 700, l: 41.4, c: 0.012 },
    { shade: 800, l: 26.9, c: 0.006 },  // Darker - matches Tailwind neutral-800
    { shade: 900, l: 20.5, c: 0.004 },  // Darker - matches Tailwind neutral-900
    { shade: 950, l: 14.1, c: 0.002 },  // Darker - matches Tailwind neutral-950
  ];

  return shades.map(({ shade, l, c }) =>
    `  --color-${name}-gray-${shade}: oklch(${l}% ${c} ${hue});`
  ).join('\n');
}

// ============================================
// CHART & MAP TOKEN GENERATION
// ============================================

/**
 * Generate harmonious chart colors based on primary hue
 * Returns array of {hue, lightness, chroma} for 10 chart colors
 */
function generateChartColorScheme(primaryHue) {
  // Use color theory: analogous + complementary + split-complementary
  return [
    { hue: primaryHue, l: 55, c: 0.14 },                    // Primary
    { hue: (primaryHue + 30) % 360, l: 60, c: 0.12 },       // Analogous 1
    { hue: (primaryHue + 330) % 360, l: 58, c: 0.12 },      // Analogous 2
    { hue: (primaryHue + 180) % 360, l: 55, c: 0.13 },      // Complementary
    { hue: (primaryHue + 150) % 360, l: 60, c: 0.11 },      // Split-comp 1
    { hue: (primaryHue + 210) % 360, l: 58, c: 0.11 },      // Split-comp 2
    { hue: (primaryHue + 60) % 360, l: 62, c: 0.10 },       // Triadic 1
    { hue: (primaryHue + 300) % 360, l: 56, c: 0.10 },      // Triadic 2
    { hue: (primaryHue + 90) % 360, l: 60, c: 0.09 },       // Tetradic 1
    { hue: (primaryHue + 270) % 360, l: 58, c: 0.09 },      // Tetradic 2
  ];
}

/**
 * Generate chart tokens for light mode
 */
function generateChartTokensLight(name, hue) {
  const g = `--color-${name}-gray`;
  const b = `--color-${name}`;
  const colors = generateChartColorScheme(hue);

  let tokens = `
  /* ============================================ */
  /* CHARTS (Apexcharts)                          */
  /* ============================================ */
  /* NOTE: -hex tokens use valid hex for Apexcharts compatibility */
  
  --chart-colors-background-inverse: var(${g}-900);
  --chart-colors-foreground: var(${g}-700);
  
  --chart-primary: var(${b}-500);
  --chart-colors-primary: var(${b}-500);
  --chart-colors-primary-inverse: var(${b}-300);
  --chart-colors-primary-hex: ${oklchToHex(55, 0.14, hue)};
  --chart-colors-primary-hex-inverse: ${oklchToHex(75, 0.12, hue)};
`;

  // Generate chart-1 through chart-10
  colors.forEach((color, i) => {
    const num = i + 1;
    const hex = oklchToHex(color.l, color.c, color.hue);
    const hexInverse = oklchToHex(color.l + 20, color.c * 0.9, color.hue);

    tokens += `
  --chart-${num}: oklch(${color.l}% ${color.c} ${color.hue});
  --chart-colors-chart-${num}: oklch(${color.l}% ${color.c} ${color.hue});
  --chart-colors-chart-${num}-inverse: oklch(${color.l + 20}% ${color.c * 0.9} ${color.hue});
  --chart-colors-chart-${num}-hex: ${hex};
  --chart-colors-chart-${num}-hex-inverse: ${hexInverse};`;
  });

  tokens += `
  
  --chart-colors-candlestick-upward: var(--color-green-500);
  --chart-colors-candlestick-upward-inverse: var(--color-green-400);
  --chart-colors-candlestick-downward: var(--color-red-500);
  --chart-colors-candlestick-downward-inverse: var(--color-red-400);
  
  --chart-colors-labels: var(${g}-600);
  --chart-colors-labels-inverse: var(${g}-400);
  --chart-colors-xaxis-labels: var(${g}-500);
  --chart-colors-xaxis-labels-inverse: var(${g}-400);
  --chart-colors-yaxis-labels: var(${g}-500);
  --chart-colors-yaxis-labels-inverse: var(${g}-400);
  
  --chart-colors-grid-border: var(${g}-200);
  --chart-colors-grid-border-inverse: var(${g}-700);
  --chart-colors-bar-ranges: var(${g}-200);
  --chart-colors-bar-ranges-inverse: var(${g}-700);`;

  return tokens;
}

/**
 * Generate map tokens
 */
function generateMapTokens(name, hue) {
  const b = `--color-${name}`;
  const g = `--color-${name}-gray`;

  return `
  /* ============================================ */
  /* MAPS (jsvectormap)                           */
  /* ============================================ */
  
  --map-colors-primary: var(${b}-500);
  --map-colors-primary-inverse: var(${b}-400);
  --map-colors-default: var(${g}-200);
  --map-colors-default-inverse: var(${g}-700);
  --map-colors-highlight: var(${b}-300);
  --map-colors-highlight-inverse: var(${b}-500);
  --map-colors-border: var(${g}-300);
  --map-colors-border-inverse: var(${g}-600);`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if brand hue is in the "light" range that needs dark foreground for contrast
 * Light brand colors: yellow, lime, light cyan
 */
function isLightBrandHue(hue) {
  const lightBrandHues = [
    [50, 110],   // Yellow to lime range
    [160, 195],  // Light cyan/teal range
  ];
  return lightBrandHues.some(([min, max]) => hue >= min && hue <= max);
}

/**
 * Determine switch color for dark mode based on brand lightness
 */
function getSwitchColorForDarkMode(hue, grayVar) {
  if (isLightBrandHue(hue)) {
    return `var(${grayVar}-800)`;
  }
  return `var(--color-white)`;
}

/**
 * Determine primary foreground color for dark mode based on brand lightness
 */
function getPrimaryForegroundForDarkMode(hue, grayVar) {
  if (isLightBrandHue(hue)) {
    return `var(${grayVar}-900)`;
  }
  return `var(--color-white)`;
}

// ============================================
// THEME SECTION GENERATORS
// ============================================

function generateLightModeTokens(name, hue) {
  const g = `--color-${name}-gray`;
  const b = `--color-${name}`;

  return `
  /* ============================================ */
  /* GLOBAL SURFACES + TEXT                       */
  /* ============================================ */
  
  --background: var(--color-white);
  --background-1: var(${g}-50);
  --background-2: var(${g}-100);
  --background-plain: var(--color-white);
  --foreground: var(${g}-800);
  --foreground-inverse: var(--color-white);
  
  --inverse: var(${g}-800);
  
  /* ============================================ */
  /* BORDERS (Full Scale)                         */
  /* ============================================ */
  
  --border: var(${g}-200);
  --border-line-inverse: var(--color-white);
  --border-line-1: var(${g}-100);
  --border-line-2: var(${g}-200);
  --border-line-3: var(${g}-300);
  --border-line-4: var(${g}-400);
  --border-line-5: var(${g}-500);
  --border-line-6: var(${g}-600);
  --border-line-7: var(${g}-700);
  --border-line-8: var(${g}-800);
  
  /* ============================================ */
  /* PRIMARY RAMP (Full 11-shade scale)           */
  /* ============================================ */
  
  --primary-50: var(${b}-50);
  --primary-100: var(${b}-100);
  --primary-200: var(${b}-200);
  --primary-300: var(${b}-300);
  --primary-400: var(${b}-400);
  --primary-500: var(${b}-500);
  --primary-600: var(${b}-600);
  --primary-700: var(${b}-700);
  --primary-800: var(${b}-800);
  --primary-900: var(${b}-900);
  --primary-950: var(${b}-950);
  
  /* PRIMARY STATES */
  --primary: var(--color-primary-600);
  --primary-line: transparent;
  --primary-foreground: var(--color-white);
  --primary-hover: var(--color-primary-700);
  --primary-focus: var(--color-primary-700);
  --primary-active: var(--color-primary-700);
  --primary-checked: var(--color-primary-600);
  
  /* ============================================ */
  /* SECONDARY                                    */
  /* ============================================ */
  
  --secondary: var(${g}-900);
  --secondary-line: transparent;
  --secondary-foreground: var(--color-white);
  --secondary-hover: var(${g}-800);
  --secondary-focus: var(${g}-800);
  --secondary-active: var(${g}-800);
  
  /* ============================================ */
  /* LAYER                                        */
  /* ============================================ */
  
  --layer: var(--color-white);
  --layer-line: var(${g}-200);
  --layer-foreground: var(${g}-800);
  --layer-hover: var(${g}-50);
  --layer-focus: var(${g}-50);
  --layer-active: var(${g}-50);
  
  /* ============================================ */
  /* SURFACE                                      */
  /* ============================================ */
  
  --surface: var(${g}-100);
  --surface-1: var(${g}-200);
  --surface-2: var(${g}-300);
  --surface-3: var(${g}-400);
  --surface-4: var(${g}-500);
  --surface-5: var(${g}-600);
  --surface-line: transparent;
  --surface-foreground: var(${g}-800);
  --surface-hover: var(${g}-200);
  --surface-focus: var(${g}-200);
  --surface-active: var(${g}-200);
  
  /* ============================================ */
  /* MUTED                                        */
  /* ============================================ */
  
  --muted: var(${g}-50);
  --muted-foreground: var(${g}-500);
  --muted-foreground-1: var(${g}-600);
  --muted-foreground-2: var(${g}-700);
  --muted-hover: var(${g}-100);
  --muted-focus: var(${g}-100);
  --muted-active: var(${g}-100);
  
  /* ============================================ */
  /* DESTRUCTIVE                                  */
  /* ============================================ */
  
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-white);
  --destructive-hover: var(--color-red-600);
  --destructive-focus: var(--color-red-600);
  
  /* ============================================ */
  /* NAVBAR                                       */
  /* ============================================ */
  
  --navbar: var(--color-white);
  --navbar-line: var(${g}-200);
  --navbar-divider: var(${g}-200);
  --navbar-nav-foreground: var(${g}-800);
  --navbar-nav-hover: var(${g}-100);
  --navbar-nav-focus: var(${g}-100);
  --navbar-nav-active: var(${g}-100);
  --navbar-nav-list-divider: var(${g}-200);
  --navbar-inverse: var(--color-primary-950);
  
  --navbar-1: var(${g}-50);
  --navbar-1-line: var(${g}-200);
  --navbar-1-divider: var(${g}-200);
  --navbar-1-nav-foreground: var(${g}-800);
  --navbar-1-nav-hover: var(${g}-200);
  --navbar-1-nav-focus: var(${g}-200);
  --navbar-1-nav-active: var(${g}-200);
  --navbar-1-nav-list-divider: var(${g}-200);
  
  --navbar-2: var(${g}-100);
  --navbar-2-line: transparent;
  --navbar-2-divider: var(${g}-300);
  --navbar-2-nav-foreground: var(${g}-800);
  --navbar-2-nav-hover: var(${g}-200);
  --navbar-2-nav-focus: var(${g}-200);
  --navbar-2-nav-active: var(${g}-200);
  --navbar-2-nav-list-divider: var(${g}-200);
  
  /* ============================================ */
  /* SIDEBAR                                      */
  /* ============================================ */
  
  --sidebar: var(--color-white);
  --sidebar-line: var(${g}-200);
  --sidebar-divider: var(${g}-200);
  --sidebar-nav-foreground: var(${g}-800);
  --sidebar-nav-hover: var(${g}-100);
  --sidebar-nav-focus: var(${g}-100);
  --sidebar-nav-active: var(${g}-100);
  --sidebar-nav-list-divider: var(${g}-200);
  --sidebar-inverse: var(--color-primary-950);
  
  --sidebar-1: var(${g}-50);
  --sidebar-1-line: var(${g}-200);
  --sidebar-1-divider: var(${g}-200);
  --sidebar-1-nav-foreground: var(${g}-800);
  --sidebar-1-nav-hover: var(${g}-200);
  --sidebar-1-nav-focus: var(${g}-200);
  --sidebar-1-nav-active: var(${g}-200);
  --sidebar-1-nav-list-divider: var(${g}-200);
  
  --sidebar-2: var(${g}-100);
  --sidebar-2-line: transparent;
  --sidebar-2-divider: var(${g}-200);
  --sidebar-2-nav-foreground: var(${g}-800);
  --sidebar-2-nav-hover: var(${g}-200);
  --sidebar-2-nav-focus: var(${g}-200);
  --sidebar-2-nav-active: var(${g}-200);
  --sidebar-2-nav-list-divider: var(${g}-200);
  
  /* ============================================ */
  /* CARD                                         */
  /* ============================================ */
  
  --card: var(--color-white);
  --card-line: var(${g}-200);
  --card-divider: var(${g}-200);
  --card-header: var(${g}-200);
  --card-footer: var(${g}-200);
  --card-inverse: var(--color-primary-950);
  
  /* ============================================ */
  /* DROPDOWN                                     */
  /* ============================================ */
  
  --dropdown: var(--color-white);
  --dropdown-1: var(--color-white);
  --dropdown-line: transparent;
  --dropdown-divider: var(${g}-200);
  --dropdown-header: var(${g}-200);
  --dropdown-footer: var(${g}-200);
  --dropdown-item-foreground: var(${g}-800);
  --dropdown-item-hover: var(${g}-100);
  --dropdown-item-focus: var(${g}-100);
  --dropdown-item-active: var(${g}-100);
  --dropdown-inverse: var(${g}-900);
  
  /* ============================================ */
  /* SELECT                                       */
  /* ============================================ */
  
  --select: var(--color-white);
  --select-1: var(--color-white);
  --select-line: transparent;
  --select-item-foreground: var(${g}-800);
  --select-item-hover: var(${g}-100);
  --select-item-focus: var(${g}-100);
  --select-item-active: var(${g}-100);
  --select-inverse: var(${g}-900);
  
  /* ============================================ */
  /* OVERLAY                                      */
  /* ============================================ */
  
  --overlay: var(--color-white);
  --overlay-line: transparent;
  --overlay-divider: var(${g}-200);
  --overlay-header: var(${g}-200);
  --overlay-footer: var(${g}-200);
  --overlay-inverse: var(${g}-900);
  
  /* ============================================ */
  /* POPOVER                                      */
  /* ============================================ */
  
  --popover: var(--color-white);
  --popover-line: var(${g}-100);
  
  /* ============================================ */
  /* TOOLTIP                                      */
  /* ============================================ */
  
  --tooltip: var(${g}-900);
  --tooltip-foreground: var(--color-white);
  --tooltip-line: transparent;
  
  /* ============================================ */
  /* TABLE                                        */
  /* ============================================ */
  
  --table-line: var(${g}-200);
  
  /* ============================================ */
  /* SWITCH                                       */
  /* ============================================ */
  
  --switch: var(--color-white);
  
  /* ============================================ */
  /* FOOTER                                       */
  /* ============================================ */
  
  --footer: var(--color-white);
  --footer-line: var(${g}-200);
  --footer-inverse: var(${g}-900);
  
  /* ============================================ */
  /* SCROLLBAR                                    */
  /* ============================================ */
  
  --scrollbar-track: var(${g}-100);
  --scrollbar-thumb: var(${g}-300);
  --scrollbar-track-inverse: transparent;
  --scrollbar-thumb-inverse: var(--color-white);` +
    generateChartTokensLight(name, hue) +
    generateMapTokens(name, hue);
}

function generateDarkModeTokens(name, tailwindGray, useCustomGray = false, hue = 0) {
  const g = useCustomGray ? `--color-${name}-gray` : `--color-${tailwindGray}`;
  const b = `--color-${name}`;
  const switchColor = getSwitchColorForDarkMode(hue, g);
  const primaryForeground = getPrimaryForegroundForDarkMode(hue, g);

  return `
  /* ============================================ */
  /* DARK MODE - ${useCustomGray ? 'Custom Gray' : 'Tailwind ' + tailwindGray} */
  /* ============================================ */
  
  /* BACKGROUNDS */
  --background: var(${g}-800);
  --background-1: var(${g}-900);
  --background-2: var(${g}-900);
  --background-plain: var(${g}-800);
  
  /* TEXT */
  --foreground: var(${g}-200);
  
  --inverse: var(${g}-950);
  
  /* BORDERS */
  --border: var(${g}-700);
  --border-line-inverse: var(${g}-200);
  --border-line-1: var(${g}-800);
  --border-line-2: var(${g}-700);
  --border-line-3: var(${g}-600);
  --border-line-4: var(${g}-500);
  --border-line-5: var(${g}-400);
  --border-line-6: var(${g}-300);
  --border-line-7: var(${g}-200);
  --border-line-8: var(${g}-100);
  
  /* PRIMARY STATES */
  --primary: var(${b}-400);
  --primary-foreground: ${primaryForeground};
  --primary-hover: var(${b}-500);
  --primary-focus: var(${b}-500);
  --primary-active: var(${b}-500);
  --primary-checked: var(${b}-400);
  
  /* SECONDARY */
  --secondary: var(--color-white);
  --secondary-foreground: var(${g}-800);
  --secondary-hover: var(${g}-100);
  --secondary-focus: var(${g}-100);
  --secondary-active: var(${g}-100);
  
  /* LAYER */
  --layer: var(${g}-800);
  --layer-line: var(${g}-700);
  --layer-foreground: var(--color-white);
  --layer-hover: var(${g}-700);
  --layer-focus: var(${g}-700);
  --layer-active: var(${g}-700);
  
  /* SURFACE */
  --surface: var(${g}-700);
  --surface-1: var(${g}-600);
  --surface-2: var(${g}-500);
  --surface-3: var(${g}-600);
  --surface-4: var(${g}-500);
  --surface-5: var(${g}-400);
  --surface-foreground: var(${g}-200);
  --surface-hover: var(${g}-600);
  --surface-focus: var(${g}-600);
  --surface-active: var(${g}-600);
  
  /* MUTED */
  --muted: var(${g}-800);
  --muted-foreground: var(${g}-500);
  --muted-foreground-1: var(${g}-400);
  --muted-foreground-2: var(${g}-300);
  --muted-hover: var(${g}-700);
  --muted-focus: var(${g}-700);
  --muted-active: var(${g}-700);
  
  /* DESTRUCTIVE */
  --destructive: var(--color-red-500);
  --destructive-foreground: var(--color-white);
  --destructive-hover: var(--color-red-600);
  --destructive-focus: var(--color-red-600);
  
  /* NAVBAR */
  --navbar: var(${g}-800);
  --navbar-line: var(${g}-700);
  --navbar-divider: var(${g}-700);
  --navbar-nav-foreground: var(${g}-200);
  --navbar-nav-hover: var(${g}-700);
  --navbar-nav-focus: var(${g}-700);
  --navbar-nav-active: var(${g}-700);
  --navbar-nav-list-divider: var(${g}-700);
  --navbar-inverse: var(${b}-950);
  
  --navbar-1: var(${g}-900);
  --navbar-1-line: var(${g}-700);
  --navbar-1-divider: var(${g}-700);
  --navbar-1-nav-foreground: var(${g}-200);
  --navbar-1-nav-hover: var(${g}-700);
  --navbar-1-nav-focus: var(${g}-700);
  --navbar-1-nav-active: var(${g}-700);
  --navbar-1-nav-list-divider: var(${g}-700);
  
  --navbar-2: var(${g}-900);
  --navbar-2-line: transparent;
  --navbar-2-divider: var(${g}-700);
  --navbar-2-nav-foreground: var(${g}-200);
  --navbar-2-nav-hover: var(${g}-800);
  --navbar-2-nav-focus: var(${g}-800);
  --navbar-2-nav-active: var(${g}-800);
  --navbar-2-nav-list-divider: var(${g}-800);
  
  /* SIDEBAR */
  --sidebar: var(${g}-800);
  --sidebar-line: var(${g}-700);
  --sidebar-divider: var(${g}-700);
  --sidebar-nav-foreground: var(${g}-200);
  --sidebar-nav-hover: var(${g}-700);
  --sidebar-nav-focus: var(${g}-700);
  --sidebar-nav-active: var(${g}-700);
  --sidebar-nav-list-divider: var(${g}-700);
  --sidebar-inverse: var(${b}-950);
  
  --sidebar-1: var(${g}-900);
  --sidebar-1-line: var(${g}-700);
  --sidebar-1-divider: var(${g}-700);
  --sidebar-1-nav-foreground: var(${g}-200);
  --sidebar-1-nav-hover: var(${g}-700);
  --sidebar-1-nav-focus: var(${g}-700);
  --sidebar-1-nav-active: var(${g}-700);
  --sidebar-1-nav-list-divider: var(${g}-700);
  
  --sidebar-2: var(${g}-900);
  --sidebar-2-line: transparent;
  --sidebar-2-divider: var(${g}-800);
  --sidebar-2-nav-foreground: var(${g}-200);
  --sidebar-2-nav-hover: var(${g}-800);
  --sidebar-2-nav-focus: var(${g}-800);
  --sidebar-2-nav-active: var(${g}-800);
  --sidebar-2-nav-list-divider: var(${g}-800);
  
  /* CARD */
  --card: var(${g}-800);
  --card-line: var(${g}-700);
  --card-divider: var(${g}-700);
  --card-header: var(${g}-700);
  --card-footer: var(${g}-700);
  --card-inverse: var(${g}-900);
  
  /* DROPDOWN */
  --dropdown: var(${g}-900);
  --dropdown-1: var(${g}-950);
  --dropdown-line: transparent;
  --dropdown-divider: var(${g}-800);
  --dropdown-header: var(${g}-700);
  --dropdown-footer: var(${g}-700);
  --dropdown-item-foreground: var(${g}-200);
  --dropdown-item-hover: var(${g}-800);
  --dropdown-item-focus: var(${g}-800);
  --dropdown-item-active: var(${g}-800);
  --dropdown-inverse: var(${g}-900);
  
  /* SELECT */
  --select: var(${g}-900);
  --select-1: var(${g}-950);
  --select-line: transparent;
  --select-item-foreground: var(${g}-200);
  --select-item-hover: var(${g}-800);
  --select-item-focus: var(${g}-800);
  --select-item-active: var(${g}-800);
  --select-inverse: var(${g}-900);
  
  /* OVERLAY */
  --overlay: var(${g}-800);
  --overlay-line: transparent;
  --overlay-divider: var(${g}-700);
  --overlay-header: var(${g}-700);
  --overlay-footer: var(${g}-700);
  --overlay-inverse: var(${g}-900);
  
  /* POPOVER */
  --popover: var(${g}-900);
  --popover-line: var(${g}-700);
  
  /* TOOLTIP */
  --tooltip: var(--color-white);
  --tooltip-foreground: var(${g}-800);
  --tooltip-line: transparent;
  
  /* TABLE */
  --table-line: var(${g}-700);
  
  /* SWITCH */
  --switch: ${switchColor};
  
  /* FOOTER */
  --footer: var(${g}-800);
  --footer-line: var(${g}-700);
  --footer-inverse: var(${g}-900);
  
  /* SCROLLBAR */
  --scrollbar-track: var(${g}-700);
  --scrollbar-thumb: var(${g}-500);
  --scrollbar-track-inverse: var(${g}-500);
  --scrollbar-thumb-inverse: var(${g}-700);
  
  /* CHARTS - dark mode adjustments */
  --chart-colors-background-inverse: var(${g}-100);
  --chart-colors-foreground: var(${g}-300);
  --chart-colors-labels: var(${g}-400);
  --chart-colors-xaxis-labels: var(${g}-400);
  --chart-colors-yaxis-labels: var(${g}-400);
  --chart-colors-grid-border: var(${g}-700);
  --chart-colors-bar-ranges: var(${g}-700);
  
  /* MAPS - dark mode adjustments */
  --map-colors-default: var(${g}-700);
  --map-colors-border: var(${g}-600);`;
}

// ============================================
// FONT SUPPORT
// ============================================

function generateFontTokens(config) {
  const fonts = [];

  if (config.fontSans) {
    fonts.push(`  /* Typography */`);
    fonts.push(`  --font-sans: ${config.fontSans};`);
  }
  if (config.fontSerif) {
    fonts.push(`  --font-serif: ${config.fontSerif};`);
  }
  if (config.fontMono) {
    fonts.push(`  --font-mono: ${config.fontMono};`);
  }

  if (fonts.length > 0) {
    return '\n' + fonts.join('\n') + '\n';
  }
  return '';
}

// ============================================
// MAIN GENERATOR
// ============================================

/**
 * Generate a complete theme CSS file from config
 * 
 * @param {Object} config - Theme configuration
 * @param {string} config.name - Theme name (kebab-case)
 * @param {number} [config.hue] - Brand color hue (0-360) - required if no primaryColor
 * @param {string} [config.primaryColor] - Brand color as hex (e.g., "#2F6BFF") - converts to hue
 * @param {string} [config.style='vibrant'] - 'vibrant' or 'soft'
 * @param {boolean} [config.useCustomDarkGray=false] - Use custom gray for dark mode
 * @param {string} [config.tailwindGray='neutral'] - Tailwind gray for dark mode
 * @param {string} [config.fontSans] - Optional custom sans-serif font stack
 * @param {string} [config.fontSerif] - Optional custom serif font stack
 * @param {string} [config.fontMono] - Optional custom monospace font stack
 * @returns {string} Complete CSS theme file
 */
function generateTheme(config) {
  // Validate config
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error('Invalid config:\n  - ' + errors.join('\n  - '));
  }

  // Resolve hue from primaryColor if provided
  let hue = config.hue;
  if (config.primaryColor && typeof hue !== 'number') {
    hue = hexToHue(config.primaryColor);
  }

  const {
    name,
    style = 'vibrant',
    useCustomDarkGray = false,
    tailwindGray = 'neutral',
  } = config;

  const themeName = `theme-${name}`;
  const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Choose Tailwind gray based on warmth if not specified
  const darkGray = tailwindGray || (hue > 30 && hue < 200 ? 'stone' : 'neutral');

  const brandPalette = generateBrandPalette(name, hue, style);
  const grayPalette = generateGrayPalette(name, hue);
  const fontTokens = generateFontTokens(config);
  const lightTokens = generateLightModeTokens(name, hue);
  const darkTokens = generateDarkModeTokens(name, darkGray, useCustomDarkGray, hue);

  // Generate timestamp
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];

  return `@import "tailwindcss";
@import "./theme.css";

/* ============================================== */
/* Theme: ${displayName}                          */
/* Generated: ${timestamp}                        */
/* Hue: ${hue} | Style: ${style}                  */
/* ============================================== */

@theme ${themeName} inline {
  /* ============================================ */
  /* CUSTOM COLOR PALETTES                        */
  /* ============================================ */
  
  /* -------------------------------------------- */
  /* BRAND PALETTE (${style})                     */
  /* -------------------------------------------- */
  
${brandPalette}
  
  /* -------------------------------------------- */
  /* GRAY PALETTE (bell curve chroma)             */
  /* -------------------------------------------- */
  
${grayPalette}
}

:root[data-theme="${themeName}"],
[data-theme="${themeName}"] {
${fontTokens}${lightTokens}
}

/* ============================================== */
/* DARK MODE OVERRIDES                            */
/* ============================================== */

[data-theme="${themeName}"].dark {
${darkTokens}
}
`;
}

// ============================================
// CLI INTERFACE
// ============================================

function parseConfig(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const ext = path.extname(filepath).toLowerCase();

  if (ext === '.json') {
    const parsed = JSON.parse(content);
    // Remove comment fields
    delete parsed._comment;
    return parsed;
  } else if (ext === '.yaml' || ext === '.yml') {
    // Improved YAML parser with better error handling
    const config = {};
    const lines = content.split('\n');
    let currentSection = null;
    let lineNum = 0;

    for (const line of lines) {
      lineNum++;
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check for section (no leading space, ends with colon, no value)
      if (!line.startsWith(' ') && trimmed.endsWith(':') && !trimmed.includes(': ')) {
        currentSection = trimmed.slice(0, -1);
        config[currentSection] = {};
        continue;
      }

      // Parse key: value
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) {
        console.warn(`Warning: Line ${lineNum} has no colon, skipping: ${trimmed}`);
        continue;
      }

      const key = trimmed.slice(0, colonIndex).trim();
      let value = trimmed.slice(colonIndex + 1).trim();

      // Remove inline comments
      const commentIndex = value.indexOf('#');
      if (commentIndex > 0) {
        value = value.slice(0, commentIndex).trim();
      }

      // Parse value type
      const parsedValue = parseYamlValue(value);

      // Add to config
      if (line.startsWith('  ') && currentSection) {
        config[currentSection][key] = parsedValue;
      } else {
        currentSection = null;
        config[key] = parsedValue;
      }
    }

    // Flatten nested config to expected format
    return {
      name: config.name,
      hue: config.brand?.hue ?? config.hue,
      primaryColor: config.brand?.primaryColor ?? config.primaryColor,
      style: config.brand?.style ?? config.style ?? 'vibrant',
      useCustomDarkGray: config.darkMode?.useCustomGray ?? config.useCustomDarkGray ?? false,
      tailwindGray: config.darkMode?.tailwindGray ?? config.tailwindGray ?? 'neutral',
      fontSans: config.typography?.fontSans ?? config.fontSans,
      fontSerif: config.typography?.fontSerif ?? config.fontSerif,
      fontMono: config.typography?.fontMono ?? config.fontMono,
    };
  }

  throw new Error(`Unsupported config format: ${ext}. Use .json or .yaml`);
}

function parseYamlValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '' || value === 'null') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  // Remove surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Preline Theme Generator v1.0

Usage:
  node generate-theme.js <config-file> [output-file]
  npx preline-theme-generator <config-file> [output-file]

Arguments:
  config-file    JSON or YAML config file (required)
  output-file    Output CSS file path (optional, prints to stdout if omitted)

Config format (JSON):
{
  "name": "my-theme",
  "hue": 200,                    // OR "primaryColor": "#2F6BFF"
  "style": "vibrant",            // or "soft"
  "useCustomDarkGray": false,
  "tailwindGray": "neutral",     // neutral, stone, zinc, slate
  "fontSans": "Inter, sans-serif"  // optional
}

Config format (YAML):
name: my-theme
brand:
  hue: 200                       # OR primaryColor: "#2F6BFF"
  style: vibrant
darkMode:
  useCustomGray: false
  tailwindGray: neutral
typography:
  fontSans: Inter, sans-serif    # optional

Examples:
  node generate-theme.js config.json
  node generate-theme.js ocean.yaml ../themes/ocean.css
`);
    process.exit(0);
  }

  const configPath = args[0];
  const outputPath = args[1];

  try {
    if (!fs.existsSync(configPath)) {
      console.error(`Error: Config file not found: ${configPath}`);
      process.exit(1);
    }

    const config = parseConfig(configPath);
    const css = generateTheme(config);

    if (outputPath) {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, css);
      console.log(`✓ Generated theme: ${outputPath}`);
      console.log(`  Name: theme-${config.name}`);
      console.log(`  Hue: ${config.hue || hexToHue(config.primaryColor)}`);
      console.log(`  Style: ${config.style || 'vibrant'}`);
    } else {
      console.log(css);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  generateTheme,
  generateBrandPalette,
  generateGrayPalette,
  oklchToHex,
  hexToHue,
  validateConfig
};
