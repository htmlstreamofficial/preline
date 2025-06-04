/*
 * HSInputNumber
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from '../../utils';

import { IInputNumberOptions, IInputNumber } from '../input-number/interfaces';

import HSBasePlugin from '../base-plugin';

class HSInputNumber
	extends HSBasePlugin<IInputNumberOptions>
	implements IInputNumber
{
	private readonly input: HTMLInputElement | null;
	private readonly increment: HTMLElement | null;
	private readonly decrement: HTMLElement | null;
	private inputValue: number | null;
	private readonly minInputValue: number | null;
	private readonly maxInputValue: number | null;
	private readonly step: number;

	private onInputInputListener: () => void;
	private onIncrementClickListener: () => void;
	private onDecrementClickListener: () => void;

	constructor(el: HTMLElement, options?: IInputNumberOptions) {
		super(el, options);

		this.input = this.el.querySelector('[data-hs-input-number-input]') || null;
		this.increment =
			this.el.querySelector('[data-hs-input-number-increment]') || null;
		this.decrement =
			this.el.querySelector('[data-hs-input-number-decrement]') || null;

		if (this.input) this.checkIsNumberAndConvert();

		const data = this.el.dataset.hsInputNumber;
		const dataOptions: IInputNumberOptions = data
			? JSON.parse(data)
			: { step: 1 };
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.minInputValue = 'min' in concatOptions ? concatOptions.min : 0;
		this.maxInputValue = 'max' in concatOptions ? concatOptions.max : null;
		this.step =
			'step' in concatOptions && concatOptions.step > 0
				? concatOptions.step
				: 1;

		this.init();
	}

	private inputInput() {
		this.changeValue();
	}

	private incrementClick() {
		this.changeValue('increment');
	}

	private decrementClick() {
		this.changeValue('decrement');
	}

	private init() {
		this.createCollection(window.$hsInputNumberCollection, this);

		if (this.input && this.increment) this.build();
	}

	private checkIsNumberAndConvert() {
		const value = this.input.value.trim();
		const cleanedValue = this.cleanAndExtractNumber(value);

		if (cleanedValue !== null) {
			this.inputValue = cleanedValue;
			this.input.value = cleanedValue.toString();
		} else {
			this.inputValue = 0;
			this.input.value = '0';
		}
	}

	private cleanAndExtractNumber(value: string): number | null {
		const cleanedArray: string[] = [];
		let decimalFound = false;

		value.split('').forEach((char) => {
			if (char >= '0' && char <= '9') cleanedArray.push(char);
			else if (char === '.' && !decimalFound) {
				cleanedArray.push(char);
				decimalFound = true;
			}
		});

		const cleanedValue = cleanedArray.join('');
		const number = parseFloat(cleanedValue);

		return isNaN(number) ? null : number;
	}

	private build() {
		if (this.input) this.buildInput();
		if (this.increment) this.buildIncrement();
		if (this.decrement) this.buildDecrement();

		if (this.inputValue <= this.minInputValue) {
			this.inputValue = this.minInputValue;
			this.input.value = `${this.minInputValue}`;
		}

		if (this.inputValue <= this.minInputValue) this.changeValue();

		if (this.input.hasAttribute('disabled')) this.disableButtons();
	}

	private buildInput() {
		this.onInputInputListener = () => this.inputInput();

		this.input.addEventListener('input', this.onInputInputListener);
	}

	private buildIncrement() {
		this.onIncrementClickListener = () => this.incrementClick();

		this.increment.addEventListener('click', this.onIncrementClickListener);
	}

	private buildDecrement() {
		this.onDecrementClickListener = () => this.decrementClick();

		this.decrement.addEventListener('click', this.onDecrementClickListener);
	}

	private changeValue(event = 'none') {
		const payload = { inputValue: this.inputValue };
		const minInputValue = this.minInputValue ?? Number.MIN_SAFE_INTEGER;
		const maxInputValue = this.maxInputValue ?? Number.MAX_SAFE_INTEGER;

		this.inputValue = isNaN(this.inputValue) ? 0 : this.inputValue;

		switch (event) {
			case 'increment':
				const incrementedResult = this.inputValue + this.step;
				this.inputValue =
					incrementedResult >= minInputValue &&
					incrementedResult <= maxInputValue
						? incrementedResult
						: maxInputValue;
				this.input.value = this.inputValue.toString();
				break;
			case 'decrement':
				const decrementedResult = this.inputValue - this.step;
				this.inputValue =
					decrementedResult >= minInputValue &&
					decrementedResult <= maxInputValue
						? decrementedResult
						: minInputValue;
				this.input.value = this.inputValue.toString();
				break;
			default:
				const defaultResult = isNaN(parseInt(this.input.value))
					? 0
					: parseInt(this.input.value);
				this.inputValue =
					defaultResult >= maxInputValue
						? maxInputValue
						: defaultResult <= minInputValue
							? minInputValue
							: defaultResult;
				if (this.inputValue <= minInputValue)
					this.input.value = this.inputValue.toString();
				break;
		}

		payload.inputValue = this.inputValue;

		if (this.inputValue === minInputValue) {
			this.el.classList.add('disabled');
			if (this.decrement) this.disableButtons('decrement');
		} else {
			this.el.classList.remove('disabled');
			if (this.decrement) this.enableButtons('decrement');
		}
		if (this.inputValue === maxInputValue) {
			this.el.classList.add('disabled');
			if (this.increment) this.disableButtons('increment');
		} else {
			this.el.classList.remove('disabled');
			if (this.increment) this.enableButtons('increment');
		}

		this.fireEvent('change', payload);
		dispatch('change.hs.inputNumber', this.el, payload);
	}

	private disableButtons(mode = 'all') {
		if (mode === 'all') {
			if (
				this.increment.tagName === 'BUTTON' ||
				this.increment.tagName === 'INPUT'
			)
				this.increment.setAttribute('disabled', 'disabled');
			if (
				this.decrement.tagName === 'BUTTON' ||
				this.decrement.tagName === 'INPUT'
			)
				this.decrement.setAttribute('disabled', 'disabled');
		} else if (mode === 'increment') {
			if (
				this.increment.tagName === 'BUTTON' ||
				this.increment.tagName === 'INPUT'
			)
				this.increment.setAttribute('disabled', 'disabled');
		} else if (mode === 'decrement') {
			if (
				this.decrement.tagName === 'BUTTON' ||
				this.decrement.tagName === 'INPUT'
			)
				this.decrement.setAttribute('disabled', 'disabled');
		}
	}

	private enableButtons(mode = 'all') {
		if (mode === 'all') {
			if (
				this.increment.tagName === 'BUTTON' ||
				this.increment.tagName === 'INPUT'
			)
				this.increment.removeAttribute('disabled');
			if (
				this.decrement.tagName === 'BUTTON' ||
				this.decrement.tagName === 'INPUT'
			)
				this.decrement.removeAttribute('disabled');
		} else if (mode === 'increment') {
			if (
				this.increment.tagName === 'BUTTON' ||
				this.increment.tagName === 'INPUT'
			)
				this.increment.removeAttribute('disabled');
		} else if (mode === 'decrement') {
			if (
				this.decrement.tagName === 'BUTTON' ||
				this.decrement.tagName === 'INPUT'
			)
				this.decrement.removeAttribute('disabled');
		}
	}

	// Public methods
	public destroy() {
		// Remove classes
		this.el.classList.remove('disabled');

		// Remove attributes
		this.increment.removeAttribute('disabled');
		this.decrement.removeAttribute('disabled');

		// Remove listeners
		this.input.removeEventListener('input', this.onInputInputListener);
		this.increment.removeEventListener('click', this.onIncrementClickListener);
		this.decrement.removeEventListener('click', this.onDecrementClickListener);

		window.$hsInputNumberCollection = window.$hsInputNumberCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Global method
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsInputNumberCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element
			: null;
	}

	static autoInit() {
		if (!window.$hsInputNumberCollection) window.$hsInputNumberCollection = [];

		if (window.$hsInputNumberCollection)
			window.$hsInputNumberCollection = window.$hsInputNumberCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('[data-hs-input-number]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsInputNumberCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSInputNumber(el);
			});
	}
}

declare global {
	interface Window {
		HSInputNumber: Function;
		$hsInputNumberCollection: {
			id: number;
			element: HSInputNumber;
		}[];
	}
}

window.addEventListener('load', () => {
	HSInputNumber.autoInit();

	// Uncomment for debug
	// console.log('Input number collection:', window.$hsInputNumberCollection);
});

if (typeof window !== 'undefined') {
	window.HSInputNumber = HSInputNumber;
}

export default HSInputNumber;
