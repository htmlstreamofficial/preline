/*
 * HSScrollspy
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { getClassProperty, dispatch } from '../../utils';

import { IScrollspy } from '../scrollspy/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSScrollspy extends HSBasePlugin<{}> implements IScrollspy {
	private activeSection: HTMLElement | null;
	private readonly contentId: string | null;
	private readonly content: HTMLElement | null;
	private readonly links: NodeListOf<HTMLAnchorElement> | null;
	private readonly sections: HTMLElement[] | null;
	private readonly scrollableId: string | null;
	private readonly scrollable: HTMLElement | Document;

	private onScrollableScrollListener: (evt: Event) => void;
	private onLinkClickListener:
		| {
				el: HTMLAnchorElement;
				fn: (evt: Event) => void;
		  }[]
		| null;

	constructor(el: HTMLElement, options = {}) {
		super(el, options);

		this.activeSection = null;
		this.contentId = this.el.getAttribute('data-hs-scrollspy');
		this.content = document.querySelector(this.contentId);
		this.links = this.el.querySelectorAll('[href]');
		this.sections = [];
		this.scrollableId = this.el.getAttribute(
			'data-hs-scrollspy-scrollable-parent',
		);
		this.scrollable = this.scrollableId
			? (document.querySelector(this.scrollableId) as HTMLElement)
			: (document as Document);

		this.onLinkClickListener = [];

		this.init();
	}

	private scrollableScroll(evt: Event) {
		Array.from(this.sections).forEach((section: HTMLElement) => {
			if (!section.getAttribute('id')) return false;

			this.update(evt, section);
		});
	}

	private linkClick(evt: Event, el: HTMLAnchorElement) {
		evt.preventDefault();

		if (el.getAttribute('href') === 'javascript:;') return false;

		this.scrollTo(el);
	}

	private init() {
		this.createCollection(window.$hsScrollspyCollection, this);

		this.links.forEach((el) => {
			this.sections.push(
				this.scrollable.querySelector(el.getAttribute('href')),
			);
		});

		this.onScrollableScrollListener = (evt) => this.scrollableScroll(evt);

		this.scrollable.addEventListener('scroll', this.onScrollableScrollListener);

		this.links.forEach((el) => {
			this.onLinkClickListener.push({
				el,
				fn: (evt: Event) => this.linkClick(evt, el),
			});

			el.addEventListener(
				'click',
				this.onLinkClickListener.find((link) => link.el === el).fn,
			);
		});
	}

	private update(evt: Event, section: HTMLElement) {
		const globalOffset = parseInt(
			getClassProperty(this.el, '--scrollspy-offset', '0'),
		);
		const userOffset =
			parseInt(getClassProperty(section, '--scrollspy-offset')) || globalOffset;
		const scrollableParentOffset =
			evt.target === document
				? 0
				: parseInt(
						String((evt.target as HTMLElement).getBoundingClientRect().top),
					);
		const topOffset =
			parseInt(String(section.getBoundingClientRect().top)) -
			userOffset -
			scrollableParentOffset;
		const height = section.offsetHeight;

		if (topOffset <= 0 && topOffset + height > 0) {
			if (this.activeSection === section) return false;

			this.links.forEach((el) => {
				el.classList.remove('active');
			});

			const current = this.el.querySelector(
				`[href="#${section.getAttribute('id')}"]`,
			);

			if (current) {
				current.classList.add('active');

				const group = current.closest('[data-hs-scrollspy-group]');

				if (group) {
					const parentLink = group.querySelector('[href]');

					if (parentLink) parentLink.classList.add('active');
				}
			}

			this.activeSection = section;
		}
	}

	private scrollTo(link: HTMLAnchorElement) {
		const targetId = link.getAttribute('href');
		const target: HTMLElement = document.querySelector(targetId);
		const globalOffset = parseInt(
			getClassProperty(this.el, '--scrollspy-offset', '0'),
		);
		const userOffset =
			parseInt(getClassProperty(target, '--scrollspy-offset')) || globalOffset;
		const scrollableParentOffset =
			this.scrollable === document
				? 0
				: (this.scrollable as HTMLElement).offsetTop;
		const topOffset = target.offsetTop - userOffset - scrollableParentOffset;
		const view = this.scrollable === document ? window : this.scrollable;
		const scrollFn = () => {
			window.history.replaceState(null, null, link.getAttribute('href'));

			if ('scrollTo' in view) {
				view.scrollTo({
					top: topOffset,
					left: 0,
					behavior: 'smooth',
				});
			}
		};

		const beforeScroll = this.fireEvent('beforeScroll', this.el);
		dispatch('beforeScroll.hs.scrollspy', this.el, this.el);

		if (beforeScroll instanceof Promise) beforeScroll.then(() => scrollFn());
		else scrollFn();
	}

	// Public methods
	public destroy() {
		// Remove classes
		const activeLink = this.el.querySelector('[href].active');
		activeLink.classList.remove('active');

		// Remove listeners
		this.scrollable.removeEventListener(
			'scroll',
			this.onScrollableScrollListener,
		);
		if (this.onLinkClickListener.length)
			this.onLinkClickListener.forEach(({ el, fn }) => {
				el.removeEventListener('click', fn);
			});

		window.$hsScrollspyCollection = window.$hsScrollspyCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement, isInstance = false) {
		const elInCollection = window.$hsScrollspyCollection.find(
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

	static autoInit() {
		if (!window.$hsScrollspyCollection) window.$hsScrollspyCollection = [];

		if (window.$hsScrollspyCollection)
			window.$hsScrollspyCollection = window.$hsScrollspyCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('[data-hs-scrollspy]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsScrollspyCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSScrollspy(el);
			});
	}
}

declare global {
	interface Window {
		HSScrollspy: Function;
		$hsScrollspyCollection: ICollectionItem<HSScrollspy>[];
	}
}

window.addEventListener('load', () => {
	HSScrollspy.autoInit();

	// Uncomment for debug
	// console.log('Scrollspy collection:', window.$hsScrollspyCollection);
});

if (typeof window !== 'undefined') {
	window.HSScrollspy = HSScrollspy;
}

export default HSScrollspy;
