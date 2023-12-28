/*
 * HSAccordion
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { dispatch, afterTransition } from '../../utils';

import { IAccordion } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSAccordion extends HSBasePlugin<{}> implements IAccordion {
	private readonly toggle: HTMLElement | null;
	public content: HTMLElement | null;
	private readonly group: HTMLElement | null;
	private readonly isAlwaysOpened: boolean;

	constructor(el: HTMLElement, options?: {}, events?: {}) {
		super(el, options, events);

		this.toggle = this.el.querySelector('.hs-accordion-toggle') || null;
		this.content = this.el.querySelector('.hs-accordion-content') || null;
		this.group = this.el.closest('.hs-accordion-group') || null;
		this.isAlwaysOpened =
			this.group.hasAttribute('data-hs-accordion-always-open') || false;

		if (this.toggle && this.content) this.init();
	}

	private init() {
		this.createCollection(window.$hsAccordionCollection, this);

		this.toggle.addEventListener('click', () => {
			if (this.el.classList.contains('active')) {
				this.hide();
			} else {
				this.show();
			}
		});
	}

	// Public methods
	public show() {
		if (
			this.group &&
			!this.isAlwaysOpened &&
			this.group.querySelector('.hs-accordion.active') &&
			this.group.querySelector('.hs-accordion.active') !== this.el
		) {
			const currentlyOpened = window.$hsAccordionCollection.find(
				(el) =>
					el.element.el === this.group.querySelector('.hs-accordion.active'),
			);

			currentlyOpened.element.hide();
		}

		if (this.el.classList.contains('active')) return false;

		this.el.classList.add('active');

		this.content.style.display = 'block';
		this.content.style.height = '0';
		setTimeout(() => {
			this.content.style.height = `${this.content.scrollHeight}px`;
		});

		afterTransition(this.content, () => {
			this.content.style.display = 'block';
			this.content.style.height = '';

			this.fireEvent('open', this.el);
			dispatch('open.hs.accordion', this.el, this.el);
		});
	}

	public hide() {
		if (!this.el.classList.contains('active')) return false;

		this.el.classList.remove('active');

		this.content.style.height = `${this.content.scrollHeight}px`;
		setTimeout(() => {
			this.content.style.height = '0';
		});

		afterTransition(this.content, () => {
			this.content.style.display = '';
			this.content.style.height = '0';

			this.fireEvent('close', this.el);
			dispatch('close.hs.accordion', this.el, this.el);
		});
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsAccordionCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static show(target: HTMLElement) {
		const elInCollection = window.$hsAccordionCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (
			elInCollection &&
			elInCollection.element.content.style.display !== 'block'
		)
			elInCollection.element.show();
	}

	static hide(target: HTMLElement) {
		const elInCollection = window.$hsAccordionCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (
			elInCollection &&
			elInCollection.element.content.style.display === 'block'
		)
			elInCollection.element.hide();
	}

	static autoInit() {
		if (!window.$hsAccordionCollection) window.$hsAccordionCollection = [];

		document
			.querySelectorAll('.hs-accordion:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsAccordionCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSAccordion(el);
			});
	}

	// Backward compatibility
	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsAccordionCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSAccordion: Function;
		$hsAccordionCollection: ICollectionItem<HSAccordion>[];
	}
}

window.addEventListener('load', () => {
	HSAccordion.autoInit();

	// Uncomment for debug
	// console.log('Accordion collection:', window.$hsAccordionCollection);
});

if (typeof window !== 'undefined') {
	window.HSAccordion = HSAccordion;
}

export default HSAccordion;
