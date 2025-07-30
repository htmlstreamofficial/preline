import { VirtualElement } from '@floating-ui/dom';

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
	destroy(): void;
}
export interface IHTMLElementFloatingUI extends HTMLElement {
	_floatingUI: any;
}
declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementFloatingUI> implements IDropdown {
	private accessibilityComponent;
	private readonly toggle;
	private readonly closers;
	menu: HTMLElement | null;
	private eventMode;
	private closeMode;
	private hasAutofocus;
	private autofocusOnKeyboardOnly;
	private animationInProcess;
	private longPressTimer;
	private openedViaKeyboard;
	private onElementMouseEnterListener;
	private onElementMouseLeaveListener;
	private onToggleClickListener;
	private onToggleContextMenuListener;
	private onTouchStartListener;
	private onTouchEndListener;
	private onCloserClickListener;
	constructor(el: IHTMLElementFloatingUI, options?: {}, events?: {});
	private elementMouseEnter;
	private elementMouseLeave;
	private toggleClick;
	private toggleContextMenu;
	private handleTouchStart;
	private handleTouchEnd;
	private closerClick;
	private init;
	resizeHandler(): void;
	private isOpen;
	private buildToggle;
	private buildMenu;
	private buildClosers;
	private getScrollbarSize;
	private onContextMenuHandler;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyFloatingUI;
	private focusElement;
	private setupFloatingUI;
	private selectCheckbox;
	private selectRadio;
	calculatePopperPosition(target?: VirtualElement | HTMLElement): string;
	open(target?: VirtualElement | HTMLElement, openedViaKeyboard?: boolean): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSDropdown | ICollectionItem<HSDropdown>;
	static autoInit(): void;
	static open(target: HSDropdown | HTMLElement | string, openedViaKeyboard?: boolean): void;
	static close(target: HSDropdown | HTMLElement | string): void;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null, isAnimated?: boolean): void;
	private setupAccessibility;
	private onFirstLetter;
	private onArrowX;
	private onStartEnd;
	private focusMenuItem;
	static on(evt: string, target: HSDropdown | HTMLElement | string, cb: Function): void;
	isOpened(): boolean;
	containsElement(element: HTMLElement): boolean;
}

export {
	HSDropdown as default,
};

export {};
