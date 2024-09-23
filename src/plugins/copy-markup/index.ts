/*
 * HSCopyMarkup
 * @version: 2.5.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from '../../utils';

import {
	ICopyMarkupOptions,
	ICopyMarkup,
} from '../copy-markup/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSCopyMarkup
	extends HSBasePlugin<ICopyMarkupOptions>
	implements ICopyMarkup
{
	private readonly targetSelector: string | null;
	private readonly wrapperSelector: string | null;
	private readonly limit: number | null;

	private target: HTMLElement | null;
	private wrapper: HTMLElement | null;
	private items: HTMLElement[] | null;

	constructor(el: HTMLElement, options?: ICopyMarkupOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-copy-markup');
		const dataOptions: ICopyMarkupOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.targetSelector = concatOptions?.targetSelector || null;
		this.wrapperSelector = concatOptions?.wrapperSelector || null;
		this.limit = concatOptions?.limit || null;
		this.items = [];

		if (this.targetSelector) this.init();
	}

	private init() {
		this.createCollection(window.$hsCopyMarkupCollection, this);

		this.setTarget();
		this.setWrapper();
		this.addPredefinedItems();
		this.el.addEventListener('click', () => this.copy());
	}

	private copy() {
		if (this.limit && this.items.length >= this.limit) return false;

		if (this.el.hasAttribute('disabled')) this.el.setAttribute('disabled', '');

		const copiedElement = this.target.cloneNode(true) as HTMLElement;

		this.addToItems(copiedElement);

		if (this.limit && this.items.length >= this.limit)
			this.el.setAttribute('disabled', 'disabled');

		this.fireEvent('copy', copiedElement);
		dispatch('copy.hs.copyMarkup', copiedElement, copiedElement);
	}

	private addPredefinedItems() {
		Array.from(this.wrapper.children)
			.filter(
				(el: HTMLElement) => !el.classList.contains('[--ignore-for-count]'),
			)
			.forEach((el: HTMLElement) => {
				this.addToItems(el);
			});
	}

	private setTarget() {
		const target: HTMLElement =
			typeof this.targetSelector === 'string'
				? (document
						.querySelector(this.targetSelector)
						.cloneNode(true) as HTMLElement)
				: ((this.targetSelector as HTMLElement).cloneNode(true) as HTMLElement);

		target.removeAttribute('id');

		this.target = target;
	}

	private setWrapper() {
		this.wrapper =
			typeof this.wrapperSelector === 'string'
				? document.querySelector(this.wrapperSelector)
				: this.wrapperSelector;
	}

	private addToItems(item: HTMLElement) {
		const deleteItemButton = item.querySelector(
			'[data-hs-copy-markup-delete-item]',
		);

		if (this.wrapper) this.wrapper.append(item);
		else this.el.before(item);

		if (deleteItemButton)
			deleteItemButton.addEventListener('click', () => this.delete(item));

		this.items.push(item);
	}

	// Public methods
	public delete(target: HTMLElement) {
		const index = this.items.indexOf(target);

		if (index !== -1) this.items.splice(index, 1);

		target.remove();

		this.fireEvent('delete', target);
		dispatch('delete.hs.copyMarkup', target, target);
	}

	// Static method
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsCopyMarkupCollection.find(
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
		if (!window.$hsCopyMarkupCollection) window.$hsCopyMarkupCollection = [];

		document
			.querySelectorAll('[data-hs-copy-markup]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsCopyMarkupCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const data = el.getAttribute('data-hs-copy-markup');
					const options: ICopyMarkupOptions = data ? JSON.parse(data) : {};

					new HSCopyMarkup(el, options);
				}
			});
	}
}

declare global {
	interface Window {
		HSCopyMarkup: Function;
		$hsCopyMarkupCollection: ICollectionItem<HSCopyMarkup>[];
	}
}

window.addEventListener('load', () => {
	HSCopyMarkup.autoInit();

	// Uncomment for debug
	// console.log('Copy markup collection:', window.$hsCopyMarkupCollection);
});

if (typeof window !== 'undefined') {
	window.HSCopyMarkup = HSCopyMarkup;
}

export default HSCopyMarkup;
