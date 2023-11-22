export interface IInputNumberOptions {
}
export interface IInputNumber {
	options?: IInputNumberOptions;
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
declare class HSInputNumber extends HSBasePlugin<IInputNumberOptions> implements IInputNumber {
	private readonly input;
	private readonly increment;
	private readonly decrement;
	private inputValue;
	constructor(el: HTMLElement, options?: IInputNumberOptions);
	private init;
	private build;
	private buildInput;
	private buildIncrement;
	private buildDecrement;
	private changeValue;
	private disableButtons;
	private enableButtons;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSInputNumber | {
		id: number;
		element: HSInputNumber;
	};
	static autoInit(): void;
}

export {
	HSInputNumber as default,
};

export {};
