/*
 * HSAccordion
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { getClassProperty, stringToBoolean, dispatch, afterTransition } from '../../utils';

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
	implements IAccordion {
	private toggle: HTMLElement | null;
	public content: HTMLElement | null;
	private group: HTMLElement | null;
	private isAlwaysOpened: boolean;
	private keepOneOpen: boolean;
	private isToggleStopPropagated: boolean;

	private onToggleClickListener: (evt: Event) => void;

	static selectable: IAccordionTreeView[];

	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {}) {
		super(el, options, events);

		this.toggle = this.el.querySelector('.hs-accordion-toggle') || null;
		this.content = this.el.querySelector('.hs-accordion-content') || null;
		this.group = this.el.closest('.hs-accordion-group') || null;
		this.update();

		this.isToggleStopPropagated = stringToBoolean(
			getClassProperty(this.toggle, '--stop-propagation', 'false') || 'false',
		);
		this.keepOneOpen = this.group ? stringToBoolean(
			getClassProperty(this.group, '--keep-one-open', 'false') || 'false',
		) : false;

		if (this.toggle && this.content) this.init();
	}

	private init() {
		this.createCollection(window.$hsAccordionCollection, this);

		this.onToggleClickListener = (evt: Event) => this.toggleClick(evt);

		this.toggle.addEventListener('click', this.onToggleClickListener);
	}

	// Public methods
	public toggleClick(evt: Event) {
		if (this.el.classList.contains('active') && this.keepOneOpen) return false;

		if (this.isToggleStopPropagated) evt.stopPropagation();

		if (this.el.classList.contains('active')) {
			this.hide();
		} else {
			this.show();
		}
	}

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

		this.fireEvent('beforeOpen', this.el);
		dispatch('beforeOpen.hs.accordion', this.el, this.el);

		this.content.style.display = 'block';
		this.content.style.height = '0';
		setTimeout(() => {
			this.content.style.height = `${this.content.scrollHeight}px`;

			afterTransition(this.content, () => {
				this.content.style.display = 'block';
				this.content.style.height = '';

				this.fireEvent('open', this.el);
				dispatch('open.hs.accordion', this.el, this.el);
			});
		});
	}

	public hide() {
		if (!this.el.classList.contains('active')) return false;

		this.el.classList.remove('active');
		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'false';

		this.fireEvent('beforeClose', this.el);
		dispatch('beforeClose.hs.accordion', this.el, this.el);

		this.content.style.height = `${this.content.scrollHeight}px`;
		setTimeout(() => {
			this.content.style.height = '0';
		});

		afterTransition(this.content, () => {
			this.content.style.display = 'none';
			this.content.style.height = '';

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

	public destroy() {
		if (HSAccordion?.selectable?.length) {
			HSAccordion.selectable.forEach((item) => {
				item.listeners.forEach(({ el, listener }) => {
					el.removeEventListener('click', listener);
				});
			});
		}

		if (this.onToggleClickListener) {
			this.toggle.removeEventListener('click', this.onToggleClickListener);
		}

		this.toggle = null;
		this.content = null;
		this.group = null;

		this.onToggleClickListener = null;

		window.$hsAccordionCollection = window.$hsAccordionCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	private static findInCollection(target: HSAccordion | HTMLElement | string): ICollectionItem<HSAccordion> | null {
		return window.$hsAccordionCollection.find((el) => {
			if (target instanceof HSAccordion) return el.element.el === target.el;
			else if (typeof target === 'string') return el.element.el === document.querySelector(target);
			else return el.element.el === target;
		}) || null;
	}

	static autoInit() {
		if (!window.$hsAccordionCollection) window.$hsAccordionCollection = [];

		if (window.$hsAccordionCollection) {
			window.$hsAccordionCollection = window.$hsAccordionCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

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

	static show(target: HSAccordion | HTMLElement | string) {
		const instance = HSAccordion.findInCollection(target);

		if (
			instance &&
			instance.element.content.style.display !== 'block'
		) instance.element.show();
	}

	static hide(target: HSAccordion | HTMLElement | string) {
		const instance = HSAccordion.findInCollection(target);
		const style = instance ? window.getComputedStyle(instance.element.content) : null;

		if (
			instance &&
			style.display !== 'none'
		) instance.element.hide();
	}

	static onSelectableClick = (
		evt: Event,
		item: IAccordionTreeView,
		el: HTMLElement,
	) => {
		evt.stopPropagation();

		HSAccordion.toggleSelected(item, el);
	};

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
					listeners: [],
				});
			});

		if (this.selectable.length)
			this.selectable.forEach((item) => {
				const { el } = item;

				el.querySelectorAll('.hs-accordion-selectable').forEach(
					(_el: HTMLElement) => {
						const listener = (evt: Event) =>
							this.onSelectableClick(evt, item, _el);

						_el.addEventListener('click', listener);

						item.listeners.push({ el: _el, listener });
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
	static on(evt: string, target: HSAccordion | HTMLElement | string, cb: Function) {
		const instance = HSAccordion.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
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
