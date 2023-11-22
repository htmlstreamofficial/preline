export interface IDropdown {
	options?: {};
	open(): void;
	close(isAnimated: boolean): void;
	forceClearState(): void;
}
export interface IHTMLElementPopper extends HTMLElement {
	_popper: any;
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
declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementPopper> implements IDropdown {
	private static history;
	private readonly toggle;
	menu: HTMLElement | null;
	private eventMode;
	private readonly closeMode;
	private animationInProcess;
	constructor(el: IHTMLElementPopper, options?: {}, events?: {});
	private init;
	resizeHandler(): void;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyPopper;
	private absoluteStrategyModifiers;
	open(): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): IHTMLElementPopper | {
		id: number;
		element: HSDropdown;
	};
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(evt: KeyboardEvent): void;
	static onEnter(evt: KeyboardEvent): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onFirstLetter(code: string): boolean;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null, isAnimated?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSDropdown as default,
};

export {};
