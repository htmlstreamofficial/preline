export interface IAccessibilityKeyboardHandlers {
	onEnter?: () => void;
	onEsc?: () => void;
	onSpace?: () => void;
	onArrow?: (event: KeyboardEvent) => void;
	onTab?: () => void;
	onShiftTab?: () => void;
	onHome?: () => void;
	onEnd?: () => void;
	onFirstLetter?: (key: string) => void;
	[key: string]: ((...args: any[]) => void) | undefined;
}
export interface IAccessibilityComponent {
	wrapper: HTMLElement;
	handlers: IAccessibilityKeyboardHandlers;
	isOpened: boolean;
	name: string;
	selector: string;
	context?: HTMLElement;
	isRegistered: boolean;
}
declare class HSAccessibilityObserver {
	private components;
	private currentlyOpenedComponents;
	private activeComponent;
	private readonly allowedKeybindings;
	constructor();
	private initGlobalListeners;
	private isAllowedKeybinding;
	private getActiveComponent;
	private handleGlobalFocusin;
	private handleGlobalKeydown;
	private findClosestOpenParent;
	registerComponent(wrapper: HTMLElement, handlers: IAccessibilityKeyboardHandlers, isOpened?: boolean, name?: string, selector?: string, context?: HTMLElement): IAccessibilityComponent;
	updateComponentState(component: IAccessibilityComponent, isOpened: boolean): void;
	unregisterComponent(component: IAccessibilityComponent): void;
	addAllowedKeybinding(key: string): void;
	removeAllowedKeybinding(key: string): void;
	getAllowedKeybindings(): string[];
}

export {
	HSAccessibilityObserver as default,
};

export {};
