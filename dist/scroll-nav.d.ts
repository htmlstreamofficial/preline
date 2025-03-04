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
export interface IScrollNavOptions {
	paging?: boolean;
	autoCentering?: boolean;
}
export interface IScrollNavCurrentState {
	first: HTMLElement;
	last: HTMLElement;
	center: HTMLElement;
}
export interface IScrollNav {
	options?: IScrollNavOptions;
	getCurrentState(): IScrollNavCurrentState;
	goTo(el: Element, cb?: () => void): void;
	centerElement(el: HTMLElement, behavior: ScrollBehavior): void;
	destroy(): void;
}
declare class HSScrollNav extends HSBasePlugin<IScrollNavOptions> implements IScrollNav {
	private readonly paging;
	private readonly autoCentering;
	private body;
	private items;
	private prev;
	private next;
	private currentState;
	constructor(el: HTMLElement, options?: IScrollNavOptions);
	private init;
	private setCurrentState;
	private setPrevToDisabled;
	private setNextToDisabled;
	private buildPrev;
	private buildNext;
	private buildPrevSingle;
	private buildNextSingle;
	private getCenterVisibleItem;
	private getFirstVisibleItem;
	private getLastVisibleItem;
	private getVisibleItemsCount;
	private scrollToActiveElement;
	getCurrentState(): IScrollNavCurrentState;
	goTo(el: Element, cb?: () => void): void;
	centerElement(el: HTMLElement, behavior?: ScrollBehavior): void;
	destroy(): void;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSScrollNav>;
	static autoInit(): void;
}

export {
	HSScrollNav as default,
};

export {};
