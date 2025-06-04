/*
 * HSRangeSlider
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import type { cssClasses, target } from "nouislider";
import { htmlToElement } from "../../utils";

import {
	IRangeSlider,
	IRangeSliderCssClassesObject,
	IRangeSliderOptions,
} from "./interfaces";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";

class HSRangeSlider extends HSBasePlugin<IRangeSliderOptions>
	implements IRangeSlider {
	private readonly concatOptions: IRangeSliderOptions;
	private readonly wrapper: HTMLElement | null;
	private readonly currentValue: HTMLElement[] | null;
	private format: any | null;
	private readonly icons: {
		handle?: string;
	};

	constructor(el: HTMLElement, options?: IRangeSliderOptions, events?: {}) {
		super(el, options, events);

		const data = el.getAttribute("data-hs-range-slider");
		const dataOptions: IRangeSliderOptions = data ? JSON.parse(data) : {};

		this.concatOptions = {
			...dataOptions,
			...options,
			cssClasses: {
				...noUiSlider.cssClasses,
				...this.processClasses(dataOptions.cssClasses),
			},
		};

		this.wrapper = this.concatOptions.wrapper ||
			el.closest(".hs-range-slider-wrapper") || null;
		this.currentValue = this.concatOptions.currentValue
			? Array.from(this.concatOptions.currentValue)
			: Array.from(
				this.wrapper?.querySelectorAll(".hs-range-slider-current-value") ||
					[],
			);
		this.icons = this.concatOptions.icons || {};

		this.init();
	}

	get formattedValue() {
		const values: number | string | (string | number)[] = (
			this.el as target
		).noUiSlider.get();

		if (Array.isArray(values) && this.format) {
			const updateValues: (string | number)[] = [];

			values.forEach((val) => {
				updateValues.push(this.format.to(val));
			});

			return updateValues;
		} else if (this.format) {
			return this.format.to(values);
		} else {
			return values;
		}
	}

	private processClasses(cl: typeof cssClasses) {
		const mergedClasses: IRangeSliderCssClassesObject = {};

		Object.keys(cl).forEach((key: keyof typeof noUiSlider.cssClasses) => {
			if (key) mergedClasses[key] = `${noUiSlider.cssClasses[key]} ${cl[key]}`;
		});

		return mergedClasses as typeof cssClasses;
	}

	private init() {
		this.createCollection(window.$hsRangeSliderCollection, this);

		if (
			typeof this.concatOptions?.formatter === "object"
				? this.concatOptions?.formatter?.type ===
					"thousandsSeparatorAndDecimalPoints"
				: this.concatOptions?.formatter === "thousandsSeparatorAndDecimalPoints"
		) {
			this.thousandsSeparatorAndDecimalPointsFormatter();
		} else if (
			typeof this.concatOptions?.formatter === "object"
				? this.concatOptions?.formatter?.type === "integer"
				: this.concatOptions?.formatter === "integer"
		) {
			this.integerFormatter();
		} else if (
			typeof this.concatOptions?.formatter === "object" &&
			(this.concatOptions?.formatter?.prefix ||
				this.concatOptions?.formatter?.postfix)
		) {
			this.prefixOrPostfixFormatter();
		}

		noUiSlider.create(this.el, this.concatOptions);

		if (this.currentValue && this.currentValue.length > 0) {
			(this.el as target).noUiSlider.on(
				"update",
				(values: (string | number)[]) => {
					this.updateCurrentValue(values);
				},
			);
		}

		if (this.concatOptions.disabled) this.setDisabled();
		if (this.icons.handle) this.buildHandleIcon();
	}

	private formatValue(val: number | string) {
		let result = "";

		if (typeof this.concatOptions?.formatter === "object") {
			if (this.concatOptions?.formatter?.prefix) {
				result += this.concatOptions?.formatter?.prefix;
			}
			result += val;
			if (this.concatOptions?.formatter?.postfix) {
				result += this.concatOptions?.formatter?.postfix;
			}
		} else result += val;

		return result;
	}

	private integerFormatter() {
		this.format = {
			to: (val: number) => this.formatValue(Math.round(val)),
			from: (val: string) => Math.round(+val),
		};

		if (this.concatOptions?.tooltips) this.concatOptions.tooltips = this.format;
	}

	private prefixOrPostfixFormatter() {
		this.format = {
			to: (val: number) => this.formatValue(val),
			from: (val: string) => +val,
		};

		if (this.concatOptions?.tooltips) this.concatOptions.tooltips = this.format;
	}

	private thousandsSeparatorAndDecimalPointsFormatter() {
		this.format = {
			to: (val: number) =>
				this.formatValue(
					new Intl.NumberFormat("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(val),
				),
			from: (val: string) => parseFloat(val.replace(/,/g, "")),
		};

		if (this.concatOptions?.tooltips) this.concatOptions.tooltips = this.format;
	}

	private setDisabled() {
		this.el.setAttribute("disabled", "disabled");
		this.el.classList.add("disabled");
	}

	private buildHandleIcon() {
		if (!this.icons.handle) return false;

		const handle = this.el.querySelector(".noUi-handle");

		if (!handle) return false;

		handle.innerHTML = this.icons.handle;
	}

	private updateCurrentValue(values: (string | number)[]) {
		if (!this.currentValue || this.currentValue.length === 0) return;

		values.forEach((value, index) => {
			const element = this.currentValue?.[index];

			if (!element) return;

			const formattedValue = this.format
				? this.format.to(value).toString()
				: value.toString();

			if (element instanceof HTMLInputElement) {
				element.value = formattedValue;
			} else {
				element.textContent = formattedValue;
			}
		});
	}

	// Public methods
	public destroy() {
		(this.el as target).noUiSlider.destroy();

		this.format = null;

		window.$hsRangeSliderCollection = window.$hsRangeSliderCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance = false) {
		const elInCollection = window.$hsRangeSliderCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsRangeSliderCollection) window.$hsRangeSliderCollection = [];

		if (window.$hsRangeSliderCollection) {
			window.$hsRangeSliderCollection = window.$hsRangeSliderCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll("[data-hs-range-slider]:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsRangeSliderCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSRangeSlider(el);
				}
			});
	}
}

declare global {
	interface Window {
		HSRangeSlider: Function;
		$hsRangeSliderCollection: ICollectionItem<HSRangeSlider>[];
	}
}

window.addEventListener("load", () => {
	HSRangeSlider.autoInit();

	// Uncomment for debug
	// console.log('Range slider collection:', window.$hsRangeSliderCollection);
});

if (typeof window !== "undefined") {
	window.HSRangeSlider = HSRangeSlider;
}

export default HSRangeSlider;
