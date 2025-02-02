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
export interface ITogglePasswordOptions {
	target: string | string[] | HTMLInputElement | HTMLInputElement[];
}
export interface ITogglePassword {
	options?: ITogglePasswordOptions;
	show(): void;
	hide(): void;
	destroy(): void;
}
declare class HSTogglePassword extends HSBasePlugin<ITogglePasswordOptions> implements ITogglePassword {
	private readonly target;
	private isShown;
	private isMultiple;
	private eventType;
	private onElementActionListener;
	constructor(el: HTMLElement, options?: ITogglePasswordOptions);
	private elementAction;
	private init;
	private getMultipleToggles;
	show(): void;
	hide(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTogglePassword | ICollectionItem<HSTogglePassword>;
	static autoInit(): void;
}

export {
	HSTogglePassword as default,
};

export {};
