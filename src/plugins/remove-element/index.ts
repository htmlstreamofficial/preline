/*
 * HSRemoveElement
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { afterTransition } from '../../utils';

import {
	IRemoveElementOptions,
	IRemoveElement,
} from '../remove-element/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSRemoveElement
	extends HSBasePlugin<IRemoveElementOptions>
	implements IRemoveElement {
	private readonly removeTargetId: string | null;
	private readonly removeTarget: HTMLElement | null;
	private readonly removeTargetAnimationClass: string;

	private onElementClickListener: () => void;

	constructor(el: HTMLElement, options?: IRemoveElementOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-remove-element-options');
		const dataOptions: IRemoveElementOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.removeTargetId = this.el.getAttribute('data-hs-remove-element');
		this.removeTarget = document.querySelector(this.removeTargetId);
		this.removeTargetAnimationClass =
			concatOptions?.removeTargetAnimationClass || 'hs-removing';

		if (this.removeTarget) this.init();
	}

	private elementClick() {
		this.remove();
	}

	private init() {
		this.createCollection(window.$hsRemoveElementCollection, this);

		this.onElementClickListener = () => this.elementClick();

		this.el.addEventListener('click', this.onElementClickListener);
	}

	private remove() {
		if (!this.removeTarget) return false;

		this.removeTarget.classList.add(this.removeTargetAnimationClass);

		afterTransition(this.removeTarget, () =>
			setTimeout(() => this.removeTarget.remove()),
		);
	}

	// Public methods
	public destroy() {
		// Remove classes
		this.removeTarget.classList.remove(this.removeTargetAnimationClass);

		// Remove listeners
		this.el.removeEventListener('click', this.onElementClickListener);

		window.$hsRemoveElementCollection =
			window.$hsRemoveElementCollection.filter(
				({ element }) => element.el !== this.el,
			);
	}

	// Static method
	static getInstance(target: HTMLElement, isInstance?: boolean) {
		const elInCollection = window.$hsRemoveElementCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string'
					? document.querySelector(target)
					: target) ||
				el.element.el ===
				(typeof target === 'string'
					? document.querySelector(target)
					: target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsRemoveElementCollection)
			window.$hsRemoveElementCollection = [];

		if (window.$hsRemoveElementCollection)
			window.$hsRemoveElementCollection =
				window.$hsRemoveElementCollection.filter(({ element }) =>
					document.contains(element.el),
				);

		document
			.querySelectorAll('[data-hs-remove-element]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsRemoveElementCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSRemoveElement(el);
			});
	}
}

declare global {
	interface Window {
		HSRemoveElement: Function;
		$hsRemoveElementCollection: ICollectionItem<HSRemoveElement>[];
	}
}

window.addEventListener('load', () => {
	HSRemoveElement.autoInit();

	// Uncomment for debug
	// console.log('Remove element collection:', window.$hsRemoveElementCollection);
});

if (typeof window !== 'undefined') {
	window.HSRemoveElement = HSRemoveElement;
}

export default HSRemoveElement;
