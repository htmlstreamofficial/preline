export interface IAccessibilityKeyboardHandlers {
	onEnter?: () => boolean | void;
	onEsc?: () => boolean | void;
	onSpace?: () => boolean | void;
	onArrow?: (event: KeyboardEvent) => void;
	onTab?: (event: KeyboardEvent) => void;
	onShiftTab?: (event: KeyboardEvent) => void;
	onHome?: () => boolean | void;
	onEnd?: () => boolean | void;
	onFirstLetter?: (key: string) => void;
	[key: string]: ((...args: any[]) => boolean | void) | undefined;
}
export interface IAccessibilityComponent {
	wrapper: HTMLElement;
	handlers: IAccessibilityKeyboardHandlers;
	isOpened: boolean;
	name: string;
	selector: string;
	context?: HTMLElement;
	isRegistered: boolean;
	stopPropagation?: {
		[key: string]: boolean;
	};
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
	private getActiveComponentForKey;
	private getDistanceToComponent;
	private getComponentsByNesting;
	private getSequentialHandlersForKey;
	private executeSequentialHandlers;
	private handleGlobalFocusin;
	private handleGlobalKeydown;
	private findClosestOpenParent;
	registerComponent(wrapper: HTMLElement, handlers: IAccessibilityKeyboardHandlers, isOpened?: boolean, name?: string, selector?: string, context?: HTMLElement, stopPropagation?: {
		[key: string]: boolean;
	}): IAccessibilityComponent;
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
