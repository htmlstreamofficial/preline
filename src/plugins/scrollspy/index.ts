/*
 * HSScrollspy
 * @version: 2.0.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { IScrollspy } from './interfaces';

import HSBasePlugin from '../base-plugin';

class HSScrollspy extends HSBasePlugin<{}> implements IScrollspy {
	private activeSection: HTMLElement | null;
	private readonly contentId: string | null;
	private readonly content: HTMLElement | null;
	private readonly links: NodeListOf<HTMLAnchorElement> | null;
	private readonly sections: HTMLElement[] | null;
	private readonly scrollableId: string | null;
	private readonly scrollable: HTMLElement | Document;
	
	constructor(el: HTMLElement, options = {}) {
		super(el, options);
		
		this.activeSection = null;
		this.contentId = this.el.getAttribute('data-hs-scrollspy');
		this.content = document.querySelector(this.contentId);
		this.links = this.el.querySelectorAll('[href]');
		// this.sections = this.content.children;
		this.sections = [];
		this.scrollableId = this.el.getAttribute(
			'data-hs-scrollspy-scrollable-parent',
		);
		this.scrollable = this.scrollableId
			? (document.querySelector(this.scrollableId) as HTMLElement)
			: (document as Document);
		
		this.init();
	}
	
	private init() {
		this.createCollection(window.$hsScrollspyCollection, this);
		
		this.links.forEach((el) => {
			this.sections.push(
				this.scrollable.querySelector(el.getAttribute('href')),
			);
		});
		
		Array.from(this.sections).forEach((section: HTMLElement) => {
			if (!section.getAttribute('id')) return false;
			
			this.scrollable.addEventListener('scroll', (evt) =>
				this.update(evt, section),
			);
		});
		
		this.links.forEach((el) => {
			el.addEventListener('click', (evt) => {
				evt.preventDefault();
				
				if (el.getAttribute('href') === 'javascript:;') return false;
				
				this.scrollTo(el);
			});
		});
	}
	
	private update(evt: Event, section: HTMLElement) {
		const globalOffset = parseInt(
			this.getClassProperty(this.el, '--scrollspy-offset', '0'),
		);
		const userOffset =
			parseInt(this.getClassProperty(section, '--scrollspy-offset')) ||
			globalOffset;
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
			this.getClassProperty(this.el, '--scrollspy-offset', '0'),
		);
		const userOffset =
			parseInt(this.getClassProperty(target, '--scrollspy-offset')) ||
			globalOffset;
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
		this.dispatch('beforeScroll.hs.scrollspy', this.el, this.el);
		
		if (beforeScroll instanceof Promise) beforeScroll.then(() => scrollFn());
		else scrollFn();
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
}

// Init all scrollspy
declare global {
	interface Window {
		$hsScrollspyCollection: {
			id: number;
			element: HSScrollspy;
		}[];
	}
}

window.addEventListener('load', () => {
	if (!window.$hsScrollspyCollection) window.$hsScrollspyCollection = [];
	
	document
	.querySelectorAll('[data-hs-scrollspy]:not(.--prevent-on-load-init)')
	.forEach((el: HTMLElement) => new HSScrollspy(el));
	
	// Uncomment for debug
	// console.log('Scrollspy collection:', window.$hsScrollspyCollection);
});

module.exports.HSScrollspy = HSScrollspy;

export default HSScrollspy;
