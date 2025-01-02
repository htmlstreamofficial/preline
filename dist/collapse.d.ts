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
export interface ICollapse {
	options?: {};
	show(): void;
	hide(): void;
	destroy(): void;
}
declare class HSCollapse extends HSBasePlugin<{}> implements ICollapse {
	private readonly contentId;
	content: HTMLElement | null;
	private animationInProcess;
	private onElementClickListener;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private elementClick;
	private init;
	private hideAllMegaMenuItems;
	show(): boolean;
	hide(): boolean;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSCollapse>;
	static autoInit(): void;
	static show(target: HSCollapse | HTMLElement | string): void;
	static hide(target: HSCollapse | HTMLElement | string): void;
	static on(evt: string, target: HSCollapse | HTMLElement | string, cb: Function): void;
}

export {
	HSCollapse as default,
};

export {};
