export interface ITogglePasswordOptions {
	target: string | string[] | HTMLInputElement | HTMLInputElement[];
}
export interface ITogglePassword {
	options?: ITogglePasswordOptions;
	show(): void;
	hide(): void;
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
declare class HSTogglePassword extends HSBasePlugin<ITogglePasswordOptions> implements ITogglePassword {
	private readonly target;
	private isShown;
	private isMultiple;
	private eventType;
	constructor(el: HTMLElement, options?: ITogglePasswordOptions);
	private init;
	private getMultipleToggles;
	show(): void;
	hide(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTogglePassword | {
		id: number;
		element: HSTogglePassword;
	};
	static autoInit(): void;
}

export {
	HSTogglePassword as default,
};

export {};
