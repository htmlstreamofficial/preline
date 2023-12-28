
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
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTabs | ICollectionItem<HSTabs>;
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
