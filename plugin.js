/*
 * Plugin
 * @version: 2.1.0
 * @author: HTMLStream
 * @requires: tailwindcss ^3.1.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addVariant, e }) {
	addVariant('hs-dropdown-open', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open .hs-dropdown-toggle .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .hs-dropdown-menu > .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-removing', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.hs-removing.${e(`hs-removing${separator}${className}`)}`;
		});
	});

	addVariant('hs-tooltip-shown', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.hs-tooltip.show .${e(
				`hs-tooltip-shown${separator}${className}`,
			)}`;
		});
	});

	addVariant('hs-accordion-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-toggle .${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-toggle.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-collapse-open', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse.open .${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse.open.${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse-toggle.open .${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse-toggle.open.${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-tab-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tab].active.${e(`hs-tab-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tab].active .${e(`hs-tab-active${separator}${className}`)}`;
			});
		},
	]);

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

	addVariant('hs-overlay-layout-open', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-body-open.${e(
					`hs-overlay-layout-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-body-open .${e(
					`hs-overlay-layout-open${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-overlay-backdrop-open', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-backdrop.${e(
					`hs-overlay-backdrop-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-backdrop .${e(
					`hs-overlay-backdrop-open${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-scrollspy-active', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.active.${e(`hs-scrollspy-active${separator}${className}`)}`;
		});
	});

	addVariant('hs-carousel-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-carousel-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-carousel-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-carousel-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(
					`hs-carousel${separator}disabled${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(
					`hs-carousel${separator}disabled${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-selected', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected.${e(`hs-selected${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected .${e(`hs-selected${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-select-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-select-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-select-disabled${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-select-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-select-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-select-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-input-number-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-input-number-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-input-number-disabled${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-pin-input-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-pin-input-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-pin-input-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-select-opened', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.opened.${e(`hs-select-opened${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-password-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-password-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-password-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-stepper-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-stepper-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-success', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.success.${e(`hs-stepper-success${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.success .${e(`hs-stepper-success${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-completed', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.completed.${e(`hs-stepper-completed${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.completed .${e(`hs-stepper-completed${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-error', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.error.${e(`hs-stepper-error${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.error .${e(`hs-stepper-error${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-processed', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.processed.${e(`hs-stepper-processed${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.processed .${e(`hs-stepper-processed${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-stepper-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-stepper-disabled${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-stepper-skipped', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.skipped.${e(`hs-stepper-skipped${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.skipped .${e(`hs-stepper-skipped${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-strong-password', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.passed.${e(`hs-strong-password${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.passed .${e(`hs-strong-password${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-strong-password-accepted', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.accepted.${e(
					`hs-strong-password-accepted${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.accepted .${e(
					`hs-strong-password-accepted${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-strong-password-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(
					`hs-strong-password-active${separator}${className}`,
				)}`;
			});
		}
	]);

	addVariant('hs-combo-box-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-combo-box-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-combo-box-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-combo-box-selected', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected .${e(`hs-combo-box-selected${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected.${e(`hs-combo-box-selected${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-combo-box-tab-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-combo-box-tab-active${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-apexcharts-tooltip-dark', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dark.${e(
					`hs-apexcharts-tooltip-dark${separator}${className}`,
				)}`;
			});
		}
	]);

	addVariant('hs-success', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.success .${e(`hs-success${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.success.${e(`hs-success${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-error', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.error .${e(`hs-error${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.error.${e(`hs-error${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-default-mode-active', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.default .${e(`hs-default-mode-active${separator}${className}`)}`;
		});
	});

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
});
