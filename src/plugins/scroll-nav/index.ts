/*
 * HSScrollNav
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { debounce } from '../../utils';

import { IScrollNavOptions, IScrollNav, IScrollNavCurrentState } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSScrollNav extends HSBasePlugin<IScrollNavOptions> implements IScrollNav {
	private readonly paging: boolean;
	private readonly autoCentering: boolean;

	private body: HTMLElement;
	private items: HTMLElement[];
	private prev: HTMLElement | null;
	private next: HTMLElement | null;

	private currentState: IScrollNavCurrentState;

	constructor(el: HTMLElement, options?: IScrollNavOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-scroll-nav');
		const dataOptions: IScrollNavOptions = data ? JSON.parse(data) : {};
		const defaultOptions: IScrollNavOptions = {
			paging: true,
			autoCentering: false,
		};
		const concatOptions: IScrollNavOptions = {
			...defaultOptions,
			...dataOptions,
			...options,
		};

		this.paging = concatOptions.paging ?? true;
		this.autoCentering = concatOptions.autoCentering ?? false;

		this.body = this.el.querySelector('.hs-scroll-nav-body') as HTMLElement;
		this.items = this.body ? Array.from(this.body.querySelectorAll(':scope > *')) : [];
		this.prev = this.el.querySelector('.hs-scroll-nav-prev') as HTMLElement || null;
		this.next = this.el.querySelector('.hs-scroll-nav-next') as HTMLElement || null;

		this.setCurrentState();

		this.init();
	}

	private init() {
		if (!this.body || !this.items.length) return false;

		this.createCollection(window.$hsScrollNavCollection, this);

		this.setCurrentState();

		if (this.paging) {
			if (this.prev) this.buildPrev();
			if (this.next) this.buildNext();
		} else {
			if (this.prev) this.buildPrevSingle();
			if (this.next) this.buildNextSingle();
		}

		if (this.autoCentering) this.scrollToActiveElement();

		this.body.addEventListener('scroll', debounce(() => this.setCurrentState(), 200));

		window.addEventListener('resize', debounce(() => {
			this.setCurrentState();
			if (this.autoCentering) this.scrollToActiveElement();
		}, 200));
	}

	private setCurrentState() {
		this.currentState = {
			first: this.getFirstVisibleItem(),
			last: this.getLastVisibleItem(),
			center: this.getCenterVisibleItem()
		};

		if (this.prev) this.setPrevToDisabled();
		if (this.next) this.setNextToDisabled();
	}

	private setPrevToDisabled() {
		if (this.currentState.first === this.items[0]) {
			this.prev.setAttribute('disabled', 'disabled');
			this.prev.classList.add('disabled');
		} else {
			this.prev.removeAttribute('disabled');
			this.prev.classList.remove('disabled');
		}
	}

	private setNextToDisabled() {
		if (this.currentState.last === this.items[this.items.length - 1]) {
			this.next.setAttribute('disabled', 'disabled');
			this.next.classList.add('disabled');
		} else {
			this.next.removeAttribute('disabled');
			this.next.classList.remove('disabled');
		}
	}

	private buildPrev() {
		if (!this.prev) return;

		this.prev.addEventListener('click', () => {
			const firstVisible = this.currentState.first;
			if (!firstVisible) return;

			const visibleCount = this.getVisibleItemsCount();
			let target: HTMLElement = firstVisible;

			for (let i = 0; i < visibleCount; i++) {
				if (target.previousElementSibling) {
					target = target.previousElementSibling as HTMLElement;
				} else {
					break;
				}
			}

			this.goTo(target);
		});
	}

	private buildNext() {
		if (!this.next) return;

		this.next.addEventListener('click', () => {
			const lastVisible = this.currentState.last;
			if (!lastVisible) return;

			const visibleCount = this.getVisibleItemsCount();
			let target: HTMLElement = lastVisible;

			for (let i = 0; i < visibleCount; i++) {
				if (target.nextElementSibling) {
					target = target.nextElementSibling as HTMLElement;
				} else {
					break;
				}
			}

			this.goTo(target);
		});
	}

	private buildPrevSingle() {
		this.prev?.addEventListener('click', () => {
			const firstVisible = this.currentState.first;
			if (!firstVisible) return;

			const prev = firstVisible.previousElementSibling as HTMLElement | null;

			if (prev) this.goTo(prev);
		});
	}

	private buildNextSingle() {
		this.next?.addEventListener('click', () => {
			const lastVisible = this.currentState.last;
			if (!lastVisible) return;

			const next = lastVisible.nextElementSibling as HTMLElement | null;

			if (next) this.goTo(next);
		});
	}

	private getCenterVisibleItem(): HTMLElement | null {
		const containerCenter = this.body.scrollLeft + this.body.clientWidth / 2;
		let closestItem: HTMLElement | null = null;
		let minDistance = Infinity;

		this.items.forEach((item: HTMLElement) => {
			const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
			const distance = Math.abs(itemCenter - containerCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestItem = item;
			}
		});

		return closestItem;
	}

	private getFirstVisibleItem(): HTMLElement | null {
		const containerRect = this.body.getBoundingClientRect();

		for (let item of this.items) {
			const itemRect = item.getBoundingClientRect();
			const isFullyVisible = (
				itemRect.left >= containerRect.left &&
				itemRect.right <= containerRect.right
			);

			if (isFullyVisible) {
				return item;
			}
		}

		return null;
	}

	private getLastVisibleItem(): HTMLElement | null {
		const containerRect = this.body.getBoundingClientRect();

		for (let i = this.items.length - 1; i >= 0; i--) {
			const item = this.items[i];
			const itemRect = item.getBoundingClientRect();
			const isPartiallyVisible = (
				itemRect.left < containerRect.right &&
				itemRect.right > containerRect.left
			);

			if (isPartiallyVisible) {
				return item;
			}
		}

		return null;
	}

	private getVisibleItemsCount(): number {
		const containerWidth = this.body.clientWidth;
		let count = 0;
		let totalWidth = 0;

		for (let item of this.items) {
			totalWidth += item.offsetWidth;

			if (totalWidth <= containerWidth) {
				count++;
			} else {
				break;
			}
		}

		return count;
	}

	private scrollToActiveElement() {
		const active = this.body.querySelector('.active') as HTMLElement;

		if (!active) return false;

		this.centerElement(active);
	}

	// Public methods
	public getCurrentState() {
		return this.currentState;
	}

	public goTo(el: Element, cb?: () => void) {
		(el as HTMLElement).scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'nearest'
		});

		const observer = new IntersectionObserver((entries, observerInstance) => {
			entries.forEach(entry => {
				if (entry.target === el && entry.isIntersecting) {
					if (typeof cb === 'function') cb();

					observerInstance.disconnect();
				}
			});
		}, {
			root: this.body,
			threshold: 1.0
		});

		observer.observe(el);
	}

	public centerElement(el: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
		if (!this.body.contains(el)) {
			return;
		}

		const elementCenter = el.offsetLeft + (el.offsetWidth / 2);
		const scrollTo = elementCenter - (this.body.clientWidth / 2);

		this.body.scrollTo({
			left: scrollTo,
			behavior: behavior
		});
	}

	public destroy() {
		if (this.paging) {
			if (this.prev) this.prev.removeEventListener('click', this.buildPrev);
			if (this.next) this.next.removeEventListener('click', this.buildNext);
		} else {
			if (this.prev) this.prev.removeEventListener('click', this.buildPrevSingle);
			if (this.next) this.next.removeEventListener('click', this.buildNextSingle);
		}

		window.removeEventListener('resize', debounce(() => this.setCurrentState(), 200));

		window.$hsScrollNavCollection = window.$hsScrollNavCollection.filter(({ element }) => element.el !== this.el);
	}

	// Static method
	static getInstance(target: HTMLElement, isInstance?: boolean) {
		const elInCollection = window.$hsScrollNavCollection.find(
			(el) => el.element.el === (typeof target === 'string' ? document.querySelector(target) : target) ||
				el.element.el === (typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsScrollNavCollection) window.$hsScrollNavCollection = [];

		if (window.$hsScrollNavCollection) window.$hsRemoveElementCollection = window.$hsRemoveElementCollection.filter(({ element }) => document.contains(element.el));

		document
			.querySelectorAll('[data-hs-scroll-nav]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (!window.$hsScrollNavCollection.find((elC) => (elC?.element?.el as HTMLElement) === el)) new HSScrollNav(el);
			});
	}
}

declare global {
	interface Window {
		HSScrollNav: typeof HSScrollNav;
		$hsScrollNavCollection: ICollectionItem<HSScrollNav>[];
	}
}

window.addEventListener('load', () => {
	HSScrollNav.autoInit();

	// Uncomment for debug
	// console.log('Scroll nav collection:', window.$hsScrollNavCollection);
});

if (typeof window !== 'undefined') {
	window.HSScrollNav = HSScrollNav;
}

export default HSScrollNav;
