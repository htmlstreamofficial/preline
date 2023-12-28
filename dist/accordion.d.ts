
export interface IAccordion {
	options?: {};
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
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
declare class HSAccordion extends HSBasePlugin<{}> implements IAccordion {
	private readonly toggle;
	content: HTMLElement | null;
	private readonly group;
	private readonly isAlwaysOpened;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	show(): boolean;
	hide(): boolean;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSAccordion>;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static autoInit(): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSAccordion as default,
};

export {};
