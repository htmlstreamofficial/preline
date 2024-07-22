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
export interface IDropdown {
	options?: {};
	open(): void;
	close(isAnimated: boolean): void;
	forceClearState(): void;
}
export interface IHTMLElementPopper extends HTMLElement {
	_popper: any;
}
declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementPopper> implements IDropdown {
	private static history;
	private readonly toggle;
	private readonly closers;
	menu: HTMLElement | null;
	private eventMode;
	private closeMode;
	private animationInProcess;
	constructor(el: IHTMLElementPopper, options?: {}, events?: {});
	private init;
	resizeHandler(): void;
	private buildToggle;
	private buildMenu;
	private buildClosers;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyPopper;
	private absoluteStrategyModifiers;
	open(): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): ICollectionItem<HSDropdown> | IHTMLElementPopper;
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(evt: KeyboardEvent): void;
	static onEnter(evt: KeyboardEvent): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onFirstLetter(code: string): boolean;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null, isAnimated?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSDropdown as default,
};

export {};
