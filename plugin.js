/*
 * Plugin
 * @version: 2.5.0
 * @author: Preline Labs Ltd.
 * @requires: tailwindcss ^3.4.1
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
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
				return `.hs-dropdown.open > .hs-dropdown-toggle .${e(
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
				return `.hs-accordion.active > .${e(
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
				return `.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle .${e(
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
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-accordion-selected', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.hs-accordion .selected.${e(
				`hs-accordion-selected${separator}${className}`,
			)}`;
		});
	});

	addVariant('hs-tree-view-selected', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tree-view-item].selected > .${e(
					`hs-tree-view-selected${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tree-view-item].selected.${e(
					`hs-tree-view-selected${separator}${className}`,
				)}`;
			});
		}
	]);

	addVariant('hs-tree-view-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tree-view-item].disabled.${e(`hs-tree-view-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tree-view-item].disabled > .${e(`hs-tree-view-disabled${separator}${className}`)}`;
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
				return `[data-hs-tab].active.${e(
					`hs-tab-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tab].active .${e(
					`hs-tab-active${separator}${className}`,
				)}`;
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
					`hs-carousel-disabled${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(
					`hs-carousel-disabled${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-carousel-dragging', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dragging.${e(
					`hs-carousel-dragging${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dragging .${e(
					`hs-carousel-dragging${separator}${className}`,
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
				return `.disabled.${e(
					`hs-input-number-disabled${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(
					`hs-input-number-disabled${separator}${className}`,
				)}`;
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
				return `.completed.${e(
					`hs-stepper-completed${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.completed .${e(
					`hs-stepper-completed${separator}${className}`,
				)}`;
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
				return `.processed.${e(
					`hs-stepper-processed${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.processed .${e(
					`hs-stepper-processed${separator}${className}`,
				)}`;
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
		},
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

	addVariant('hs-combo-box-has-value', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.has-value .${e(`hs-combo-box-has-value${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.has-value.${e(`hs-combo-box-has-value${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-combo-box-selected', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected .${e(
					`hs-combo-box-selected${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.selected.${e(
					`hs-combo-box-selected${separator}${className}`,
				)}`;
			});
		},
	]);

	addVariant('hs-combo-box-tab-active', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.active.${e(
					`hs-combo-box-tab-active${separator}${className}`,
				)}`;
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
		},
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

	// Datatables.net
	addVariant('hs-datatable-ordering-asc', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-asc .${e(`hs-datatable-ordering-asc${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-asc.${e(`hs-datatable-ordering-asc${separator}${className}`)}`;
			});
		},
	]);

	addVariant('hs-datatable-ordering-desc', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-desc .${e(`hs-datatable-ordering-desc${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-desc.${e(`hs-datatable-ordering-desc${separator}${className}`)}`;
			});
		},
	]);

	// Sortable.js
	addVariant('hs-dragged', ({ modifySelectors, separator }) => {
		modifySelectors(({ className }) => {
			return `.dragged.${e(`hs-dragged${separator}${className}`)}`;
		});
	});

	// noUiSlider
	addVariant('hs-range-slider-disabled', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-range-slider-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-range-slider-disabled${separator}${className}`)}`;
			});
		},
	]);

	// Dropzone
	addVariant('hs-file-upload-complete', [
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.complete .${e(`hs-file-upload-complete${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }) => {
			modifySelectors(({ className }) => {
				return `.complete.${e(`hs-file-upload-complete${separator}${className}`)}`;
			});
		},
	]);

	// Modes
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
