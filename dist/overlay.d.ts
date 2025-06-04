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
export interface IOverlayOptions {
	hiddenClass?: string | null;
	emulateScrollbarSpace?: boolean;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropParent?: string | HTMLElement | Document;
	backdropExtraClasses?: string | null;
	moveOverlayToBody?: number | null;
}
export interface IOverlay {
	options?: IOverlayOptions;
	open(cb: Function | null): void;
	close(forceClose: boolean, cb: Function | null): void;
	destroy(): void;
}
export type TOverlayOptionsAutoCloseEqualityType = "less-than" | "more-than";
declare class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass;
	private readonly emulateScrollbarSpace;
	private readonly isClosePrev;
	private readonly backdropClasses;
	private readonly backdropParent;
	private readonly backdropExtraClasses;
	private readonly animationTarget;
	private openNextOverlay;
	private autoHide;
	private toggleButtons;
	static openedItemsQty: number;
	initContainer: HTMLElement | null;
	isCloseWhenClickInside: boolean;
	isTabAccessibilityLimited: boolean;
	isLayoutAffect: boolean;
	hasAutofocus: boolean;
	hasDynamicZIndex: boolean;
	hasAbilityToCloseOnBackdropClick: boolean;
	openedBreakpoint: number | null;
	autoClose: number | null;
	autoCloseEqualityType: TOverlayOptionsAutoCloseEqualityType | null;
	moveOverlayToBody: number | null;
	private backdrop;
	private initialZIndex;
	static currentZIndex: number;
	private onElementClickListener;
	private onOverlayClickListener;
	private onBackdropClickListener;
	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {});
	private elementClick;
	private overlayClick;
	private backdropClick;
	private init;
	private getElementsByZIndex;
	private buildToggleButtons;
	private hideAuto;
	private checkTimer;
	private buildBackdrop;
	private destroyBackdrop;
	private focusElement;
	private getScrollbarSize;
	private collectToggleParameters;
	private isElementVisible;
	open(cb?: Function | null): Promise<void>;
	close(forceClose?: boolean, cb?: Function | null): Promise<unknown>;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSOverlay>;
	static autoInit(): void;
	static open(target: HSOverlay | HTMLElement | string): void;
	static close(target: HSOverlay | HTMLElement | string): void;
	static setOpened(breakpoint: number, el: ICollectionItem<HSOverlay>): void;
	static accessibility(evt: KeyboardEvent): boolean;
	static onEscape(target: ICollectionItem<HSOverlay>): void;
	static onTab(target: ICollectionItem<HSOverlay>): boolean;
	static on(evt: string, target: HSOverlay | HTMLElement | string, cb: Function): void;
}

export {
	HSOverlay as default,
};

export {};
