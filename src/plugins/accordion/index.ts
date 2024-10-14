/*
 * HSAccordion
 * @version: 2.5.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch, afterTransition } from '../../utils';

import {
	IAccordionOptions,
	IAccordion,
	IAccordionTreeView,
	IAccordionTreeViewStaticOptions,
} from '../accordion/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSAccordion
	extends HSBasePlugin<IAccordionOptions>
	implements IAccordion
{
	private readonly toggle: HTMLElement | null;
	public content: HTMLElement | null;
	private group: HTMLElement | null;
	private isAlwaysOpened: boolean;

	static selectable: IAccordionTreeView[];

	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {}) {
		super(el, options, events);

		this.toggle = this.el.querySelector('.hs-accordion-toggle') || null;
		this.content = this.el.querySelector('.hs-accordion-content') || null;
		this.update();

		if (this.toggle && this.content) this.init();
	}

	private init() {
		this.createCollection(window.$hsAccordionCollection, this);

		this.toggle.addEventListener('click', (evt: Event) => {
			evt.stopPropagation();

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
			this.group.querySelector(':scope > .hs-accordion.active') &&
			this.group.querySelector(':scope > .hs-accordion.active') !== this.el
		) {
			const currentlyOpened = window.$hsAccordionCollection.find(
				(el) =>
					el.element.el ===
					this.group.querySelector(':scope > .hs-accordion.active'),
			);

			currentlyOpened.element.hide();
		}

		if (this.el.classList.contains('active')) return false;

		this.el.classList.add('active');
		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'true';

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
		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'false';

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

	public update() {
		this.group = this.el.closest('.hs-accordion-group') || null;

		if (!this.group) return false;

		this.isAlwaysOpened =
			this.group.hasAttribute('data-hs-accordion-always-open') || false;

		window.$hsAccordionCollection.map((el) => {
			if (el.id === this.el.id) {
				el.element.group = this.group;
				el.element.isAlwaysOpened = this.isAlwaysOpened;
			}

			return el;
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

	static treeView() {
		if (!document.querySelectorAll('.hs-accordion-treeview-root').length)
			return false;

		this.selectable = [];

		document
			.querySelectorAll('.hs-accordion-treeview-root')
			.forEach((el: HTMLElement) => {
				const data = el?.getAttribute('data-hs-accordion-options');
				const options: IAccordionTreeViewStaticOptions = data
					? JSON.parse(data)
					: {};

				this.selectable.push({
					el,
					options: { ...options },
				});
			});

		if (this.selectable.length)
			this.selectable.forEach((item) => {
				const { el } = item;

				el.querySelectorAll('.hs-accordion-selectable').forEach(
					(_el: HTMLElement) => {
						_el.addEventListener('click', (evt: Event) => {
							evt.stopPropagation();

							this.toggleSelected(item, _el);
						});
					},
				);
			});
	}

	static toggleSelected(root: IAccordionTreeView, item: HTMLElement) {
		if (item.classList.contains('selected')) item.classList.remove('selected');
		else {
			root.el
				.querySelectorAll('.hs-accordion-selectable')
				.forEach((el: HTMLElement) => el.classList.remove('selected'));
			item.classList.add('selected');
		}
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

	if (document.querySelectorAll('.hs-accordion-treeview-root').length)
		HSAccordion.treeView();

	// Uncomment for debug
	// console.log('Accordion collection:', window.$hsAccordionCollection);
});

if (typeof window !== 'undefined') {
	window.HSAccordion = HSAccordion;
}

export default HSAccordion;
