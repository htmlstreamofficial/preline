
export interface IOverlayOptions {
	hiddenClass?: string | null;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
}
export interface IOverlay {
	options?: IOverlayOptions;
	open(): void;
	close(): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
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
declare class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass;
	private readonly isClosePrev;
	private readonly backdropClasses;
	private openNextOverlay;
	private autoHide;
	private readonly overlayId;
	overlay: HTMLElement | null;
	isCloseWhenClickInside: string;
	isTabAccessibilityLimited: string;
	hasAutofocus: string;
	hasAbilityToCloseOnBackdropClick: string;
	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {});
	private init;
	private hideAuto;
	private checkTimer;
	private buildBackdrop;
	private destroyBackdrop;
	private focusElement;
	open(): false | Promise<void>;
	close(): Promise<unknown>;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSOverlay>;
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): boolean;
	static onEscape(target: ICollectionItem<HSOverlay>): void;
	static onTab(target: ICollectionItem<HSOverlay>, focusableElements: HTMLElement[]): boolean;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSOverlay as default,
};

export {};
