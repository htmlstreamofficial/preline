/*
 * HSInputNumber
 * @version: 2.0.3
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

	constructor(el: HTMLElement, options?: IInputNumberOptions) {
		super(el, options);

		this.input = this.el.querySelector('[data-hs-input-number-input]') || null;
		this.increment =
			this.el.querySelector('[data-hs-input-number-increment]') || null;
		this.decrement =
			this.el.querySelector('[data-hs-input-number-decrement]') || null;
		this.inputValue = this.input ? parseInt(this.input.value) : 0;

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

		if (this.inputValue <= 0) {
			this.inputValue = 0;
			this.input.value = '0';

			this.changeValue();
		}

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

		switch (event) {
			case 'increment':
				this.inputValue += 1;
				this.input.value = this.inputValue.toString();
				break;
			case 'decrement':
				this.inputValue -= this.inputValue <= 0 ? 0 : 1;
				this.input.value = this.inputValue.toString();
				break;
			default:
				this.inputValue =
					parseInt(this.input.value) <= 0 ? 0 : parseInt(this.input.value);
				if (this.inputValue <= 0) this.input.value = this.inputValue.toString();
				break;
		}

		payload.inputValue = this.inputValue;

		if (this.inputValue === 0) {
			this.el.classList.add('disabled');
			if (this.decrement) this.disableButtons('decrement');
		} else {
			this.el.classList.remove('disabled');
			if (this.decrement) this.enableButtons('decrement');
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
