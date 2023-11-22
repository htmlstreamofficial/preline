export interface IToggleCountOptions {
	target: string | HTMLInputElement;
	min: number;
	max: number;
	duration: number;
}
export interface IToggleCount {
	options?: IToggleCountOptions;
	countUp(): void;
	countDown(): void;
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
declare class HSToggleCount extends HSBasePlugin<IToggleCountOptions> implements IToggleCount {
	private readonly target;
	private readonly min;
	private readonly max;
	private readonly duration;
	private isChecked;
	constructor(el: HTMLElement, options?: IToggleCountOptions);
	private init;
	private toggle;
	private animate;
	countUp(): void;
	countDown(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSToggleCount | {
		id: number;
		element: HSToggleCount;
	};
	static autoInit(): void;
}

export {
	HSToggleCount as default,
};

export {};
