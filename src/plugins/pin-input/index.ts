/*
 * HSPinInput
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { dispatch } from '../../utils';

import { IPinInputOptions, IPinInput } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items: NodeListOf<HTMLElement> | null;
	private currentItem: HTMLInputElement | null;
	private currentValue: string[] | null;
	private readonly placeholders: string[] | null;
	private readonly availableCharsRE: RegExp | null;

	constructor(el: HTMLElement, options?: IPinInputOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-pin-input');
		const dataOptions: IPinInputOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.items = this.el.querySelectorAll('[data-hs-pin-input-item]');
		this.currentItem = null;
		this.currentValue = new Array(this.items.length).fill('');
		this.placeholders = [];
		this.availableCharsRE = new RegExp(
			concatOptions?.availableCharsRE || '^[a-zA-Z0-9]+$',
		); // '^[0-9]+$'

		this.init();
	}

	private init() {
		this.createCollection(window.$hsPinInputCollection, this);

		if (this.items.length) this.build();
	}

	private build() {
		this.buildInputItems();
	}

	private buildInputItems() {
		this.items.forEach((el, index) => {
			this.placeholders.push(el.getAttribute('placeholder') || '');

			if (el.hasAttribute('autofocus')) this.onFocusIn(index);

			el.addEventListener('input', (evt) => this.onInput(evt, index));
			el.addEventListener('paste', (evt) => this.onPaste(evt));
			el.addEventListener('keydown', (evt) => this.onKeydown(evt, index));
			el.addEventListener('focusin', () => this.onFocusIn(index));
			el.addEventListener('focusout', () => this.onFocusOut(index));
		});
	}

	private checkIfNumber(value: string) {
		return value.match(this.availableCharsRE);
	}

	private autoFillAll(text: string) {
		Array.from(text).forEach((n, i) => {
			if (!this?.items[i]) return false;

			(this.items[i] as HTMLInputElement).value = n;

			this.items[i].dispatchEvent(new Event('input', { bubbles: true }));
		});
	}

	private setCurrentValue() {
		this.currentValue = Array.from(this.items).map(
			(el) => (el as HTMLInputElement).value,
		);
	}

	private toggleCompleted() {
		if (!this.currentValue.includes('')) this.el.classList.add('active');
		else this.el.classList.remove('active');
	}

	private onInput(evt: Event, index: number) {
		const originalValue = (evt.target as HTMLInputElement).value;
		this.currentItem = evt.target as HTMLInputElement;
		this.currentItem.value = '';
		this.currentItem.value = originalValue[originalValue.length - 1];

		if (!this.checkIfNumber(this.currentItem.value)) {
			this.currentItem.value = this.currentValue[index] || '';

			return false;
		}

		this.setCurrentValue();

		if (this.currentItem.value) {
			if (index < this.items.length - 1) this.items[index + 1].focus();
			if (!this.currentValue.includes('')) {
				const payload = { currentValue: this.currentValue };

				this.fireEvent('completed', payload);
				dispatch('completed.hs.pinInput', this.el, payload);
			}

			this.toggleCompleted();
		} else {
			if (index > 0) this.items[index - 1].focus();
		}
	}

	private onKeydown(evt: KeyboardEvent, index: number) {
		if (evt.key === 'Backspace' && index > 0) {
			if ((this.items[index] as HTMLInputElement).value === '') {
				(this.items[index - 1] as HTMLInputElement).value = '';
				(this.items[index - 1] as HTMLInputElement).focus();
			} else {
				(this.items[index] as HTMLInputElement).value = '';
			}
		}

		this.setCurrentValue();
		this.toggleCompleted();
	}

	private onFocusIn(index: number) {
		this.items[index].setAttribute('placeholder', '');
	}

	private onFocusOut(index: number) {
		this.items[index].setAttribute('placeholder', this.placeholders[index]);
	}

	private onPaste(evt: ClipboardEvent) {
		evt.preventDefault();

		this.items.forEach((el) => {
			if (document.activeElement === el)
				this.autoFillAll(evt.clipboardData.getData('text'));
		});
	}

	// Static method
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsPinInputCollection.find(
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
		if (!window.$hsPinInputCollection) window.$hsPinInputCollection = [];

		document
			.querySelectorAll('[data-hs-pin-input]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsPinInputCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSPinInput(el);
			});
	}
}

declare global {
	interface Window {
		HSPinInput: Function;
		$hsPinInputCollection: ICollectionItem<HSPinInput>[];
	}
}

window.addEventListener('load', () => {
	HSPinInput.autoInit();

	// Uncomment for debug
	// console.log('PIN input collection:', window.$hsPinInputCollection);
});

if (typeof window !== 'undefined') {
	window.HSPinInput = HSPinInput;
}

export default HSPinInput;
