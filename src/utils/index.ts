/*
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

const stringToBoolean = (string: string): boolean => {
	return string === 'true' ? true : false;
};

const getClassProperty = (el: HTMLElement, prop: string, val = '') => {
	return (window.getComputedStyle(el).getPropertyValue(prop) || val).replace(
		' ',
		'',
	);
};

const getClassPropertyAlt = (
	el: HTMLElement,
	prop?: string,
	val: string = '',
) => {
	let targetClass = '';

	el.classList.forEach((c) => {
		if (c.includes(prop)) {
			targetClass = c;
		}
	});

	return targetClass.match(/:(.*)]/) ? targetClass.match(/:(.*)]/)[1] : val;
};

const getZIndex = (el: HTMLElement) => {
	const computedStyle = window.getComputedStyle(el);
	const zIndex = computedStyle.getPropertyValue('z-index');

	return zIndex;
};

function getHighestZIndex(arr: HTMLElement[]) {
	let highestZIndex = Number.NEGATIVE_INFINITY;

	arr.forEach((el) => {
		let zIndex: string | number = getZIndex(el);

		if (zIndex !== 'auto') {
			zIndex = parseInt(zIndex, 10);

			if (zIndex > highestZIndex) highestZIndex = zIndex;
		}
	});

	return highestZIndex;
}

const isIOS = () => {
	if (/iPad|iPhone|iPod/.test(navigator.platform)) {
		return true;
	} else {
		return (
			navigator.maxTouchPoints &&
			navigator.maxTouchPoints > 2 &&
			/MacIntel/.test(navigator.platform)
		);
	}
};

const isIpadOS = () => {
	return (
		navigator.maxTouchPoints &&
		navigator.maxTouchPoints > 2 &&
		/MacIntel/.test(navigator.platform)
	);
};

const isDirectChild = (parent: Element, child: HTMLElement) => {
	const children = parent.children;

	for (let i = 0; i < children.length; i++) {
		if (children[i] === child) return true;
	}

	return false;
};

const isEnoughSpace = (
	el: HTMLElement,
	toggle: HTMLElement,
	preferredPosition: 'top' | 'bottom' | 'auto' = 'auto',
	space = 10,
	wrapper: HTMLElement | null = null,
) => {
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
};

const isFormElement = (target: HTMLElement) => {
	return (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement
	);
};

const isParentOrElementHidden = (element: any): any => {
	if (!element) return false;

	const computedStyle = window.getComputedStyle(element);

	if (computedStyle.display === 'none') return true;

	return isParentOrElementHidden(element.parentElement);
};

const isJson = (str: string) => {
	if (typeof str !== 'string') return false;

	const firstChar = str.trim()[0];
	const lastChar = str.trim().slice(-1);

	if ((firstChar === '{' && lastChar === '}') || (firstChar === '[' && lastChar === ']')) {
		try {
			JSON.parse(str);

			return true;
		} catch {
			return false;
		}
	}

	return false;
};

const debounce = (func: Function, timeout = 200) => {
	let timer: any;

	return (...args: any[]) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};

const dispatch = (evt: string, element: any, payload: any = null) => {
	const event = new CustomEvent(evt, {
		detail: { payload },
		bubbles: true,
		cancelable: true,
		composed: false,
	});

	element.dispatchEvent(event);
};

const afterTransition = (el: HTMLElement, callback: Function) => {
	const handleEvent = () => {
		callback();

		el.removeEventListener('transitionend', handleEvent, true);
	};

	const computedStyle = window.getComputedStyle(el);
	const transitionDuration = computedStyle.getPropertyValue(
		'transition-duration',
	);
	const transitionProperty = computedStyle.getPropertyValue(
		'transition-property',
	);
	const hasTransition =
		transitionProperty !== 'none' && parseFloat(transitionDuration) > 0;

	if (hasTransition) el.addEventListener('transitionend', handleEvent, true);
	else callback();
};

const htmlToElement = (html: string): HTMLElement => {
	const template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;

	return template.content.firstChild as HTMLElement;
};

const classToClassList = (
	classes: string,
	target: HTMLElement,
	splitter = ' ',
	action: 'add' | 'remove' = 'add',
) => {
	const classesToArray = classes.split(splitter);
	classesToArray.forEach((cl) =>
		action === 'add' ? target.classList.add(cl) : target.classList.remove(cl),
	);
};

const menuSearchHistory = {
	historyIndex: -1,

	addHistory(index: number) {
		this.historyIndex = index;
	},

	existsInHistory(index: number) {
		return index > this.historyIndex;
	},

	clearHistory() {
		this.historyIndex = -1;
	},
};

export {
	stringToBoolean,
	getClassProperty,
	getClassPropertyAlt,
	getZIndex,
	getHighestZIndex,
	isIOS,
	isIpadOS,
	isEnoughSpace,
	isParentOrElementHidden,
	isFormElement,
	isDirectChild,
	isJson,
	debounce,
	dispatch,
	afterTransition,
	htmlToElement,
	classToClassList,
	menuSearchHistory,
};
