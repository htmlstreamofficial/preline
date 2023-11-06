/*
 * HSBasePlugin
 * @version: 2.0.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { IBasePlugin } from './interfaces';

export default class HSBasePlugin<O, E = HTMLElement>
	implements IBasePlugin<O, E> {
	constructor(
		public el: E,
		public options: O,
		public events?: any,
	) {
		this.el = el;
		this.options = options;
		this.events = {};
	}
	
	public isIOS() {
		if (/iPad|iPhone|iPod/.test(navigator.platform)) {
			return true;
		} else {
			return (
				navigator.maxTouchPoints &&
				navigator.maxTouchPoints > 2 &&
				/MacIntel/.test(navigator.platform)
			);
		}
	}
	
	public isIpadOS() {
		return (
			navigator.maxTouchPoints &&
			navigator.maxTouchPoints > 2 &&
			/MacIntel/.test(navigator.platform)
		);
	}
	
	public createCollection(collection: any[], element: any) {
		collection.push({
			id: element?.el?.id || collection.length + 1,
			element,
		});
	}
	
	public fireEvent(evt: string, payload: any = null) {
		if (this.events.hasOwnProperty(evt)) return this.events[evt](payload);
	}
	
	public dispatch(evt: string, element: any, payload: any = null) {
		const event = new CustomEvent(evt, {
			detail: { payload },
			bubbles: true,
			cancelable: true,
			composed: false,
		});
		
		element.dispatchEvent(event);
	}
	
	public on(evt: string, cb: Function) {
		this.events[evt] = cb;
	}
	
	public afterTransition(el: HTMLElement, callback: Function) {
		const handleEvent = () => {
			callback();
			
			el.removeEventListener('transitionend', handleEvent, true);
		};
		
		if (
			window.getComputedStyle(el, null).getPropertyValue('transition') !==
			'all 0s ease 0s'
		) {
			el.addEventListener('transitionend', handleEvent, true);
		} else {
			callback();
		}
	}
	
	public onTransitionEnd(el: HTMLElement, cb: Function) {
		function transitionEndHandler(evt: Event) {
			if (evt.target === el) {
				el.removeEventListener('transitionend', transitionEndHandler);
				
				cb();
			}
		}
		
		el.addEventListener('transitionend', transitionEndHandler);
	}
	
	public getClassProperty(el: HTMLElement, prop: string, val = '') {
		return (window.getComputedStyle(el).getPropertyValue(prop) || val).replace(
			' ',
			'',
		);
	}
	
	public getClassPropertyAlt(el: HTMLElement, prop?: string, val: string = '') {
		let targetClass = '';
		
		el.classList.forEach((c) => {
			if (c.includes(prop)) {
				targetClass = c;
			}
		});
		
		return targetClass.match(/:(.*)]/) ? targetClass.match(/:(.*)]/)[1] : val;
	}
	
	public htmlToElement(html: string) {
		const template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		
		return template.content.firstChild as HTMLElement;
	}
	
	public classToClassList(
		classes: string,
		target: HTMLElement,
		splitter = ' ',
	) {
		const classesToArray = classes.split(splitter);
		classesToArray.forEach((cl) => target.classList.add(cl));
	}
	
	public debounce(func: Function, timeout = 200) {
		let timer: any;
		
		return (...args: any[]) => {
			clearTimeout(timer);
			
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}
	
	public checkIfFormElement(target: HTMLElement) {
		return (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement
		);
	}
	
	static isEnoughSpace(
		el: HTMLElement,
		toggle: HTMLElement,
		preferredPosition: 'top' | 'bottom' | 'auto' = 'auto',
		space = 10,
		wrapper: HTMLElement | null = null,
	) {
		const referenceRect = toggle.getBoundingClientRect();
		const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : null;
		const viewportHeight = window.innerHeight;
		const spaceAbove = wrapperRect
			? referenceRect.top - wrapperRect.top
			: referenceRect.top;
		const spaceBelow =
			(wrapper ? wrapperRect.bottom : viewportHeight) - referenceRect.bottom;
		const minimumSpaceRequired = el.clientHeight + space;
		
		if (preferredPosition === 'bottom') {
			return spaceBelow >= minimumSpaceRequired;
		} else if (preferredPosition === 'top') {
			return spaceAbove >= minimumSpaceRequired;
		} else {
			return (
				spaceAbove >= minimumSpaceRequired || spaceBelow >= minimumSpaceRequired
			);
		}
	}
	
	static isParentOrElementHidden(element: any): any {
		if (!element) return false;
		
		const computedStyle = window.getComputedStyle(element);
		
		if (computedStyle.display === 'none') return true;
		
		return this.isParentOrElementHidden(element.parentElement);
	}
}

// Init all dropdowns
declare global {
	interface Window {
		HSStaticMethods: {
			afterTransition(el: HTMLElement, cb: Function): void;
			getClassPropertyAlt(el: HTMLElement, prop?: string, val?: string): string;
			getClassProperty(el: HTMLElement, prop?: string, val?: string): string;
		};
	}
}

window.HSStaticMethods = {
	afterTransition(el: HTMLElement, cb: Function) {
		const handleEvent = () => {
			cb();
			
			el.removeEventListener('transitionend', handleEvent, true);
		};
		
		if (
			window.getComputedStyle(el, null).getPropertyValue('transition') !==
			'all 0s ease 0s'
		) {
			el.addEventListener('transitionend', handleEvent, true);
		} else {
			cb();
		}
	},
	getClassPropertyAlt(el: HTMLElement, prop?: string, val: string = '') {
		let targetClass = '';
		
		el.classList.forEach((c) => {
			if (c.includes(prop)) {
				targetClass = c;
			}
		});
		
		return targetClass.match(/:(.*)]/) ? targetClass.match(/:(.*)]/)[1] : val;
	},
	getClassProperty(el: HTMLElement, prop: string, val = '') {
		return (window.getComputedStyle(el).getPropertyValue(prop) || val).replace(
			' ',
			'',
		);
	},
};
