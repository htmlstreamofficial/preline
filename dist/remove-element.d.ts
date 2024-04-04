

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
export interface IRemoveElementOptions {
	removeTargetAnimationClass: string;
}
export interface IRemoveElement {
	options?: IRemoveElementOptions;
}
declare class HSRemoveElement extends HSBasePlugin<IRemoveElementOptions> implements IRemoveElement {
	private readonly removeTargetId;
	private readonly removeTarget;
	private readonly removeTargetAnimationClass;
	constructor(el: HTMLElement, options?: IRemoveElementOptions);
	private init;
	private remove;
	static autoInit(): void;
}

export {
	HSRemoveElement as default,
};

export {};
