export interface ITabs {
	options?: {};
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
declare class HSTabs extends HSBasePlugin<{}> implements ITabs {
	toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId;
	private readonly extraToggle;
	private current;
	private currentContentId;
	currentContent: HTMLElement | null;
	private prev;
	private prevContentId;
	private prevContent;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private open;
	private change;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTabs | {
		id: number;
		element: HSTabs;
	};
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onArrow(isOpposite?: boolean): void;
	static onStartEnd(isOpposite?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSTabs as default,
};

export {};
