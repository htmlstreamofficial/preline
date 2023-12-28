/*
 * HSTabs
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { dispatch } from '../../utils';

import { ITabs } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { TABS_ACCESSIBILITY_KEY_SET } from '../../constants';

class HSTabs extends HSBasePlugin<{}> implements ITabs {
	public toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId: string | null;
	private readonly extraToggle: HTMLSelectElement | null;
	private current: HTMLElement | null;
	private currentContentId: string | null;
	public currentContent: HTMLElement | null;
	private prev: HTMLElement | null;
	private prevContentId: string | null;
	private prevContent: HTMLElement | null;

	constructor(el: HTMLElement, options?: {}, events?: {}) {
		super(el, options, events);

		this.toggles = this.el.querySelectorAll('[data-hs-tab]');
		this.extraToggleId = this.el.getAttribute('hs-data-tab-select');
		this.extraToggle = document.querySelector(this.extraToggleId);
		this.current = Array.from(this.toggles).find((el) =>
			el.classList.contains('active'),
		);
		this.currentContentId = this.current.getAttribute('data-hs-tab');
		this.currentContent = document.querySelector(this.currentContentId);
		this.prev = null;
		this.prevContentId = null;
		this.prevContent = null;

		this.init();
	}

	private init() {
		this.createCollection(window.$hsTabsCollection, this);

		this.toggles.forEach((el) => {
			el.addEventListener('click', () => this.open(el));
		});

		if (this.extraToggle) {
			this.extraToggle.addEventListener('change', (evt) => this.change(evt));
		}
	}

	private open(el: HTMLElement) {
		this.prev = this.current;
		this.prevContentId = this.currentContentId;
		this.prevContent = this.currentContent;

		this.current = el;
		this.currentContentId = this.current.getAttribute('data-hs-tab');
		this.currentContent = document.querySelector(this.currentContentId);

		this.prev.classList.remove('active');
		this.prevContent.classList.add('hidden');

		this.current.classList.add('active');
		this.currentContent.classList.remove('hidden');

		this.fireEvent('change', {
			el,
			prev: this.prevContentId,
			current: this.currentContentId,
		});
		dispatch('change.hs.tab', el, {
			el,
			prev: this.prevContentId,
			current: this.currentContentId,
		});
	}

	private change(evt: Event) {
		const toggle: HTMLElement = document.querySelector(
			`[data-hs-tab="${(evt.target as HTMLSelectElement).value}"]`,
		);

		if (toggle) toggle.click();
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsTabsCollection.find(
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
		if (!window.$hsTabsCollection) window.$hsTabsCollection = [];

		document
			.querySelectorAll(
				'[role="tablist"]:not(select):not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsTabsCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSTabs(el);
			});

		if (window.$hsTabsCollection)
			document.addEventListener('keydown', (evt) => HSTabs.accessibility(evt));
	}

	static open(target: HTMLElement) {
		const elInCollection = window.$hsTabsCollection.find((el) =>
			Array.from(el.element.toggles).includes(
				typeof target === 'string' ? document.querySelector(target) : target,
			),
		);
		const targetInCollection = Array.from(elInCollection.element.toggles).find(
			(el) =>
				el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (targetInCollection && !targetInCollection.classList.contains('active'))
			elInCollection.element.open(targetInCollection);
	}

	// Accessibility methods
	static accessibility(evt: KeyboardEvent) {
		const target = document.querySelector('[data-hs-tab]:focus');

		if (
			target &&
			TABS_ACCESSIBILITY_KEY_SET.includes(evt.code) &&
			!evt.metaKey
		) {
			const isVertical = target
				.closest('[role="tablist"]')
				.getAttribute('data-hs-tabs-vertical');

			evt.preventDefault();

			console.log('Key code:', evt.code);

			switch (evt.code) {
				case isVertical === 'true' ? 'ArrowUp' : 'ArrowLeft':
					this.onArrow();
					break;
				case isVertical === 'true' ? 'ArrowDown' : 'ArrowRight':
					this.onArrow(false);
					break;
				case 'Home':
					this.onStartEnd();
					break;
				case 'End':
					this.onStartEnd(false);
					break;
				default:
					break;
			}
		}
	}

	static onArrow(isOpposite = true) {
		const target = document
			.querySelector('[data-hs-tab]:focus')
			.closest('[role="tablist"]');
		const targetInCollection = window.$hsTabsCollection.find(
			(el) => el.element.el === target,
		);

		if (targetInCollection) {
			const toggles = isOpposite
				? Array.from(targetInCollection.element.toggles).reverse()
				: Array.from(targetInCollection.element.toggles);
			const focused = toggles.find((el) => document.activeElement === el);
			let focusedInd = toggles.findIndex((el: any) => el === focused);
			focusedInd = focusedInd + 1 < toggles.length ? focusedInd + 1 : 0;

			toggles[focusedInd].focus();
			toggles[focusedInd].click();
		}
	}

	static onStartEnd(isOpposite = true) {
		const target = document
			.querySelector('[data-hs-tab]:focus')
			.closest('[role="tablist"]');
		const targetInCollection = window.$hsTabsCollection.find(
			(el) => el.element.el === target,
		);

		if (targetInCollection) {
			const toggles = isOpposite
				? Array.from(targetInCollection.element.toggles)
				: Array.from(targetInCollection.element.toggles).reverse();

			if (toggles.length) {
				toggles[0].focus();
				toggles[0].click();
			}
		}
	}

	// Backward compatibility
	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsTabsCollection.find((el) =>
			Array.from(el.element.toggles).includes(
				typeof target === 'string' ? document.querySelector(target) : target,
			),
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSTabs: Function;
		$hsTabsCollection: ICollectionItem<HSTabs>[];
	}
}

window.addEventListener('load', () => {
	HSTabs.autoInit();

	// Uncomment for debug
	// console.log('Tabs collection:', window.$hsTabsCollection);
});

if (typeof window !== 'undefined') {
	window.HSTabs = HSTabs;
}

export default HSTabs;
