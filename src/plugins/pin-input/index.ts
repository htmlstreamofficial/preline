/*
 * HSPinInput
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from '../../utils';

import { IPinInputOptions, IPinInput } from '../pin-input/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items: NodeListOf<HTMLElement> | null;
	private currentItem: HTMLInputElement | null;
	private currentValue: string[] | null;
	private readonly placeholders: string[] | null;
	private readonly availableCharsRE: RegExp | null;

	private onElementInputListener:
		| {
				el: HTMLElement;
				fn: (evt: Event) => void;
		  }[]
		| null;
	private onElementPasteListener:
		| {
				el: HTMLElement;
				fn: (evt: Event) => void;
		  }[]
		| null;
	private onElementKeydownListener:
		| {
				el: HTMLElement;
				fn: (evt: Event) => void;
		  }[]
		| null;
	private onElementFocusinListener:
		| {
				el: HTMLElement;
				fn: () => void;
		  }[]
		| null;
	private onElementFocusoutListener:
		| {
				el: HTMLElement;
				fn: () => void;
		  }[]
		| null;

	private elementInput(evt: Event, index: number) {
		this.onInput(evt, index);
	}

	private elementPaste(evt: ClipboardEvent) {
		this.onPaste(evt);
	}

	private elementKeydown(evt: KeyboardEvent, index: number) {
		this.onKeydown(evt, index);
	}

	private elementFocusin(index: number) {
		this.onFocusIn(index);
	}

	private elementFocusout(index: number) {
		this.onFocusOut(index);
	}

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

		this.onElementInputListener = [];
		this.onElementPasteListener = [];
		this.onElementKeydownListener = [];
		this.onElementFocusinListener = [];
		this.onElementFocusoutListener = [];

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

			this.onElementInputListener.push({
				el,
				fn: (evt: Event) => this.elementInput(evt, index),
			});
			this.onElementPasteListener.push({
				el,
				fn: (evt: ClipboardEvent) => this.elementPaste(evt),
			});
			this.onElementKeydownListener.push({
				el,
				fn: (evt: KeyboardEvent) => this.elementKeydown(evt, index),
			});
			this.onElementFocusinListener.push({
				el,
				fn: () => this.elementFocusin(index),
			});
			this.onElementFocusoutListener.push({
				el,
				fn: () => this.elementFocusout(index),
			});

			el.addEventListener(
				'input',
				this.onElementInputListener.find((elI) => elI.el === el).fn,
			);
			el.addEventListener(
				'paste',
				this.onElementPasteListener.find((elI) => elI.el === el).fn,
			);
			el.addEventListener(
				'keydown',
				this.onElementKeydownListener.find((elI) => elI.el === el).fn,
			);
			el.addEventListener(
				'focusin',
				this.onElementFocusinListener.find((elI) => elI.el === el).fn,
			);
			el.addEventListener(
				'focusout',
				this.onElementFocusoutListener.find((elI) => elI.el === el).fn,
			);
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

	// Public methods
	public destroy() {
		// Remove classes
		this.el.classList.remove('active');

		// Remove listeners
		if (this.items.length)
			this.items.forEach((el) => {
				el.removeEventListener(
					'input',
					this.onElementInputListener.find((elI) => elI.el === el).fn,
				);
				el.removeEventListener(
					'paste',
					this.onElementPasteListener.find((elI) => elI.el === el).fn,
				);
				el.removeEventListener(
					'keydown',
					this.onElementKeydownListener.find((elI) => elI.el === el).fn,
				);
				el.removeEventListener(
					'focusin',
					this.onElementFocusinListener.find((elI) => elI.el === el).fn,
				);
				el.removeEventListener(
					'focusout',
					this.onElementFocusoutListener.find((elI) => elI.el === el).fn,
				);
			});

		this.items = null;
		this.currentItem = null;
		this.currentValue = null;

		window.$hsPinInputCollection = window.$hsPinInputCollection.filter(
			({ element }) => element.el !== this.el,
		);
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

		if (window.$hsPinInputCollection)
			window.$hsPinInputCollection = window.$hsPinInputCollection.filter(
				({ element }) => document.contains(element.el),
			);

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
