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

// const getClassPropertyAlt = (
// 	el: HTMLElement,
// 	prop: string,
// 	val: string = '',
// ): string => {
// 	let targetClass = '';

// 	el.classList.forEach((className) => {
// 		if (className.includes(prop)) {
// 			targetClass = className;
// 		}
// 	});

// 	const match = targetClass.match(/:(.*)/);

// 	return match ? match[1] : val;
// };

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
	const hasTransition =
		window.getComputedStyle(el, null).getPropertyValue('transition') !==
		(navigator.userAgent.includes('Firefox') ? 'all' : 'all 0s ease 0s');

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
	isIOS,
	isIpadOS,
	isEnoughSpace,
	isParentOrElementHidden,
	isFormElement,
	debounce,
	dispatch,
	afterTransition,
	htmlToElement,
	classToClassList,
	menuSearchHistory,
};
