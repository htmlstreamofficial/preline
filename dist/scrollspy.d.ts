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
export interface IScrollspy {
	options?: {};
	destroy(): void;
}
declare class HSScrollspy extends HSBasePlugin<{}> implements IScrollspy {
	private activeSection;
	private readonly contentId;
	private readonly content;
	private readonly links;
	private readonly sections;
	private readonly scrollableId;
	private readonly scrollable;
	private onScrollableScrollListener;
	private onLinkClickListener;
	constructor(el: HTMLElement, options?: {});
	private scrollableScroll;
	private linkClick;
	private init;
	private update;
	private scrollTo;
	destroy(): void;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSScrollspy>;
	static autoInit(): void;
}

export {
	HSScrollspy as default,
};

export {};
