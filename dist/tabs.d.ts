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
export interface ITabsOptions {
	eventType: "click" | "hover";
	preventNavigationResolution: string | number | null;
}
export interface ITabs {
	options?: ITabsOptions;
	destroy(): void;
}
declare class HSTabs extends HSBasePlugin<ITabsOptions> implements ITabs {
	private readonly eventType;
	private readonly preventNavigationResolution;
	toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId;
	private readonly extraToggle;
	private current;
	private currentContentId;
	currentContent: HTMLElement | null;
	private prev;
	private prevContentId;
	private prevContent;
	private onToggleHandler;
	private onExtraToggleChangeListener;
	constructor(el: HTMLElement, options?: ITabsOptions, events?: {});
	private toggle;
	private extraToggleChange;
	private init;
	private open;
	private change;
	destroy(): void;
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
