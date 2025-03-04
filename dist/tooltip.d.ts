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
	destroy(): void;
}
declare class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle;
	content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventFloatingUI;
	private readonly placement;
	private readonly strategy;
	private readonly scope;
	cleanupAutoUpdate: (() => void) | null;
	private onToggleClickListener;
	private onToggleFocusListener;
	private onToggleMouseEnterListener;
	private onToggleMouseLeaveListener;
	private onToggleHandleListener;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private toggleClick;
	private toggleFocus;
	private toggleMouseEnter;
	private toggleMouseLeave;
	private toggleHandle;
	private init;
	private enter;
	private leave;
	private click;
	private focus;
	private buildFloatingUI;
	private _show;
	show(): void;
	hide(): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTooltip>;
	static autoInit(): void;
	static show(target: HSTooltip | HTMLElement | string): void;
	static hide(target: HSTooltip | HTMLElement | string): void;
	static on(evt: string, target: HSTooltip | HTMLElement | string, cb: Function): void;
}

export {
	HSTooltip as default,
};

export {};
