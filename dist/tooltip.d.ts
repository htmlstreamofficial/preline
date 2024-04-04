

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
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
export interface ITooltip {
	options?: {};
	show(): void;
	hide(): void;
}
declare class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle;
	content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventPopper;
	private popperInstance;
	private readonly placement;
	private readonly strategy;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private enter;
	private leave;
	private click;
	private focus;
	private buildPopper;
	show(): void;
	hide(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTooltip>;
	static autoInit(): void;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSTooltip as default,
};

export {};
