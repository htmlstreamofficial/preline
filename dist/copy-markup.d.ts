export interface ICopyMarkupOptions {
	targetSelector: string;
	wrapperSelector: string;
	limit?: number;
}
export interface ICopyMarkup {
	options?: ICopyMarkupOptions;
}
export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}
declare class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	el: E;
	options: O;
	events?: any;
	constructor(el: E, options: O, events?: any);
	isIOS(): boolean;
	isIpadOS(): boolean;
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	dispatch(evt: string, element: any, payload?: any): void;
	on(evt: string, cb: Function): void;
	afterTransition(el: HTMLElement, callback: Function): void;
	onTransitionEnd(el: HTMLElement, cb: Function): void;
	getClassProperty(el: HTMLElement, prop: string, val?: string): string;
	getClassPropertyAlt(el: HTMLElement, prop?: string, val?: string): string;
	htmlToElement(html: string): HTMLElement;
	classToClassList(classes: string, target: HTMLElement, splitter?: string): void;
	debounce(func: Function, timeout?: number): (...args: any[]) => void;
	checkIfFormElement(target: HTMLElement): boolean;
	static isEnoughSpace(el: HTMLElement, toggle: HTMLElement, preferredPosition?: "top" | "bottom" | "auto", space?: number, wrapper?: HTMLElement | null): boolean;
	static isParentOrElementHidden(element: any): any;
}
declare class HSCopyMarkup extends HSBasePlugin<ICopyMarkupOptions> implements ICopyMarkup {
	private readonly targetSelector;
	private readonly wrapperSelector;
	private readonly limit;
	private target;
	private wrapper;
	private items;
	constructor(el: HTMLElement, options?: ICopyMarkupOptions);
	private init;
	private copy;
	private addPredefinedItems;
	private setTarget;
	private setWrapper;
	private addToItems;
	delete(target: HTMLElement): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCopyMarkup | {
		id: number;
		element: HSCopyMarkup;
	};
	static autoInit(): void;
}

export {
	HSCopyMarkup as default,
};

export {};
