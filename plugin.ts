/*
 * Plugin
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @requires: tailwindcss ^3.4.1
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

export type TStringFunc = () => string;

export interface IModifySelectors {
	className: string;
}

export interface IAddVariantOptions {
	modifySelectors: (callback: (options: IModifySelectors) => string) => string;
	separator: string;
}

import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';

export default plugin(function ({ addVariant, e }: PluginAPI) {
	addVariant('hs-dropdown-open', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open .hs-dropdown-toggle .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .hs-dropdown-menu > .${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown-menu.open.${e(
					`hs-dropdown-open${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-dropdown-item-disabled', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.hs-dropdown.open > .hs-dropdown-menu .disabled.${e(
				`hs-dropdown-item-disabled${separator}${className}`,
			)}`;
		});
	}) as TStringFunc);

	addVariant('hs-dropdown-item-checked', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .hs-dropdown-menu [aria-checked="true"].${e(
					`hs-dropdown-item-checked${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-dropdown.open > .hs-dropdown-menu [aria-checked="true"] .${e(
					`hs-dropdown-item-checked${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-removing', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.hs-removing.${e(`hs-removing${separator}${className}`)}`;
		});
	}) as TStringFunc);

	addVariant('hs-tooltip-shown', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.hs-tooltip.show .${e(
				`hs-tooltip-shown${separator}${className}`,
			)}`;
		});
	}) as TStringFunc);

	addVariant('hs-accordion-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-toggle .${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle .${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-toggle.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-accordion.active .hs-accordion-force-active.${e(
					`hs-accordion-active${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-accordion-selected', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.hs-accordion .selected.${e(
				`hs-accordion-selected${separator}${className}`,
			)}`;
		});
	}) as TStringFunc);

	addVariant('hs-collapse-open', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse.open .${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse.open.${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse-toggle.open .${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-collapse-toggle.open.${e(
					`hs-collapse-open${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-tab-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tab].active.${e(
					`hs-tab-active${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `[data-hs-tab].active .${e(
					`hs-tab-active${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-overlay-open', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.open.${e(`hs-overlay-open${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.open .${e(`hs-overlay-open${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-overlay-layout-open', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-body-open.${e(
					`hs-overlay-layout-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-body-open .${e(
					`hs-overlay-layout-open${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-overlay-backdrop-open', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-backdrop.${e(
					`hs-overlay-backdrop-open${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.hs-overlay-backdrop .${e(
					`hs-overlay-backdrop-open${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-scrollspy-active', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.active.${e(`hs-scrollspy-active${separator}${className}`)}`;
		});
	}) as TStringFunc);

	addVariant('hs-carousel-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-carousel-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-carousel-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-carousel-disabled', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-carousel-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(
					`hs-carousel-disabled${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-carousel-dragging', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dragging.${e(`hs-carousel-dragging${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dragging .${e(
					`hs-carousel-dragging${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-selected', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.selected.${e(`hs-selected${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.selected .${e(`hs-selected${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-select-disabled', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-select-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-select-disabled${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-select-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-select-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-select-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-input-number-disabled', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(
					`hs-input-number-disabled${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(
					`hs-input-number-disabled${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-pin-input-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-pin-input-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-pin-input-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-select-opened', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.opened.${e(`hs-select-opened${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-password-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-password-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-password-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-stepper-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-stepper-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-success', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.success.${e(`hs-stepper-success${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.success .${e(`hs-stepper-success${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-completed', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.completed.${e(
					`hs-stepper-completed${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.completed .${e(
					`hs-stepper-completed${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-error', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.error.${e(`hs-stepper-error${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.error .${e(`hs-stepper-error${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-processed', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.processed.${e(
					`hs-stepper-processed${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.processed .${e(
					`hs-stepper-processed${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-disabled', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-stepper-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-stepper-disabled${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-stepper-skipped', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.skipped.${e(`hs-stepper-skipped${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.skipped .${e(`hs-stepper-skipped${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-strong-password', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.passed.${e(`hs-strong-password${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.passed .${e(`hs-strong-password${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-strong-password-accepted', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.accepted.${e(
					`hs-strong-password-accepted${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.accepted .${e(
					`hs-strong-password-accepted${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-strong-password-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(
					`hs-strong-password-active${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-combo-box-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active .${e(`hs-combo-box-active${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(`hs-combo-box-active${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-combo-box-has-value', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.has-value .${e(`hs-combo-box-has-value${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.has-value.${e(`hs-combo-box-has-value${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-combo-box-selected', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.selected .${e(
					`hs-combo-box-selected${separator}${className}`,
				)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.selected.${e(
					`hs-combo-box-selected${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-combo-box-tab-active', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.active.${e(
					`hs-combo-box-tab-active${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-apexcharts-tooltip-dark', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dark.${e(
					`hs-apexcharts-tooltip-dark${separator}${className}`,
				)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-success', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.success .${e(`hs-success${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.success.${e(`hs-success${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-error', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.error .${e(`hs-error${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.error.${e(`hs-error${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-layout-splitter-dragging', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dragging .${e(`hs-layout-splitter-dragging${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dragging.${e(`hs-layout-splitter-dragging${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-layout-splitter-prev-limit-reached', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.prev-limit-reached .${e(`hs-layout-splitter-prev-limit-reached${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.prev-limit-reached.${e(`hs-layout-splitter-prev-limit-reached${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-layout-splitter-next-limit-reached', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.next-limit-reached .${e(`hs-layout-splitter-next-limit-reached${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.next-limit-reached.${e(`hs-layout-splitter-next-limit-reached${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-layout-splitter-prev-pre-limit-reached', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.prev-pre-limit-reached .${e(`hs-layout-splitter-prev-pre-limit-reached${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.prev-pre-limit-reached.${e(`hs-layout-splitter-prev-pre-limit-reached${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-layout-splitter-next-pre-limit-reached', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.next-pre-limit-reached .${e(`hs-layout-splitter-next-pre-limit-reached${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.next-pre-limit-reached.${e(`hs-layout-splitter-next-pre-limit-reached${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	// Datatables.net
	addVariant('hs-datatable-ordering-asc', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-asc .${e(`hs-datatable-ordering-asc${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-asc.${e(`hs-datatable-ordering-asc${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	addVariant('hs-datatable-ordering-desc', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-desc .${e(`hs-datatable-ordering-desc${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.dt-ordering-desc.${e(`hs-datatable-ordering-desc${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	// noUiSlider
	addVariant('hs-range-slider-disabled', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled .${e(`hs-range-slider-disabled${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.disabled.${e(`hs-range-slider-disabled${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	// Dropzone
	addVariant('hs-file-upload-complete', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.complete .${e(`hs-file-upload-complete${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.complete.${e(`hs-file-upload-complete${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	// Toastify
	addVariant('hs-toastify-on', [
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.toastify.on .${e(`hs-toastify-on${separator}${className}`)}`;
			});
		},
		({ modifySelectors, separator }: IAddVariantOptions) => {
			modifySelectors(({ className }) => {
				return `.toastify.on.${e(`hs-toastify-on${separator}${className}`)}`;
			});
		},
	] as TStringFunc[]);

	// Modes
	addVariant('hs-default-mode-active', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.default .${e(`hs-default-mode-active${separator}${className}`)}`;
		});
	}) as TStringFunc);

	addVariant('hs-dark-mode-active', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.dark .${e(`hs-dark-mode-active${separator}${className}`)}`;
		});
	}) as TStringFunc);

	addVariant('hs-auto-mode-active', (({
		modifySelectors,
		separator,
	}: IAddVariantOptions) => {
		modifySelectors(({ className }) => {
			return `.auto .${e(`hs-auto-mode-active${separator}${className}`)}`;
		});
	}) as TStringFunc);
});
