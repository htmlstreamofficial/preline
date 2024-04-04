/*
 * HSInputNumber
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { dispatch } from '../../utils';

import { IInputNumberOptions, IInputNumber } from './interfaces';

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

	constructor(el: HTMLElement, options?: IInputNumberOptions) {
		super(el, options);

		this.input = this.el.querySelector('[data-hs-input-number-input]') || null;
		this.increment =
			this.el.querySelector('[data-hs-input-number-increment]') || null;
		this.decrement =
			this.el.querySelector('[data-hs-input-number-decrement]') || null;

		if (this.input) {
			this.inputValue = !isNaN(parseInt(this.input.value))
				? parseInt(this.input.value)
				: 0;
		}

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

	private init() {
		this.createCollection(window.$hsInputNumberCollection, this);

		if (this.input && this.increment) this.build();
	}

	private build() {
		if (this.input) this.buildInput();
		if (this.increment) this.buildIncrement();
		if (this.decrement) this.buildDecrement();

		if (this.inputValue <= 0 && this.minInputValue === 0) {
			this.inputValue = 0;
			this.input.value = '0';
		}

		if (this.inputValue <= 0 || this.minInputValue < 0) this.changeValue();

		if (this.input.hasAttribute('disabled')) this.disableButtons();
	}

	private buildInput() {
		this.input.addEventListener('input', () => this.changeValue());
	}

	private buildIncrement() {
		this.increment.addEventListener('click', () => {
			this.changeValue('increment');
		});
	}

	private buildDecrement() {
		this.decrement.addEventListener('click', () => {
			this.changeValue('decrement');
		});
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
