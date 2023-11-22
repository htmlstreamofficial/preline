export interface IPinInputOptions {
	availableCharsRE?: RegExp;
}
export interface IPinInput {
	options?: IPinInputOptions;
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
declare class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items;
	private currentItem;
	private currentValue;
	private readonly placeholders;
	private readonly availableCharsRE;
	constructor(el: HTMLElement, options?: IPinInputOptions);
	private init;
	private build;
	private buildInputItems;
	private checkIfNumber;
	private autoFillAll;
	private setCurrentValue;
	private toggleCompleted;
	private onInput;
	private onKeydown;
	private onFocusIn;
	private onFocusOut;
	private onPaste;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSPinInput | {
		id: number;
		element: HSPinInput;
	};
	static autoInit(): void;
}

export {
	HSPinInput as default,
};

export {};
