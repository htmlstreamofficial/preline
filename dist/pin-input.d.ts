export interface IPinInputOptions {
	availableCharsRE?: RegExp;
}
export interface IPinInput {
	options?: IPinInputOptions;
	destroy(): void;
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
declare class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items;
	private currentItem;
	private currentValue;
	private readonly placeholders;
	private readonly availableCharsRE;
	private onElementInputListener;
	private onElementPasteListener;
	private onElementKeydownListener;
	private onElementFocusinListener;
	private onElementFocusoutListener;
	private elementInput;
	private elementPaste;
	private elementKeydown;
	private elementFocusin;
	private elementFocusout;
	constructor(el: HTMLElement, options?: IPinInputOptions);
	private init;
	private build;
	private buildInputItems;
	private checkIfNumber;
	private autoFillAll;
	private setCurrentValue;
	private toggleCompleted;
	private onInput;
	private onKeydown;
	private onFocusIn;
	private onFocusOut;
	private onPaste;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): any;
	static autoInit(): void;
}

export {
	HSPinInput as default,
};

export {};
