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
export interface IInputNumberOptions {
	min?: number;
	max?: number;
	step?: number;
}
export interface IInputNumber {
	options?: IInputNumberOptions;
	destroy(): void;
}
declare class HSInputNumber extends HSBasePlugin<IInputNumberOptions> implements IInputNumber {
	private readonly input;
	private readonly increment;
	private readonly decrement;
	private inputValue;
	private readonly minInputValue;
	private readonly maxInputValue;
	private readonly step;
	private onInputInputListener;
	private onIncrementClickListener;
	private onDecrementClickListener;
	constructor(el: HTMLElement, options?: IInputNumberOptions);
	private inputInput;
	private incrementClick;
	private decrementClick;
	private init;
	private checkIsNumberAndConvert;
	private cleanAndExtractNumber;
	private build;
	private buildInput;
	private buildIncrement;
	private buildDecrement;
	private changeValue;
	private disableButtons;
	private enableButtons;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSInputNumber | {
		id: number;
		element: HSInputNumber;
	};
	static autoInit(): void;
}

export {
	HSInputNumber as default,
};

export {};
