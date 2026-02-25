export interface ITextareaAutoHeightOptions {
	defaultHeight: number;
}
export interface ITextareaAutoHeight {
	options?: ITextareaAutoHeightOptions;
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
declare class HSTextareaAutoHeight extends HSBasePlugin<ITextareaAutoHeightOptions> implements ITextareaAutoHeight {
	private readonly defaultHeight;
	private onElementInputListener;
	constructor(el: HTMLTextAreaElement, options?: ITextareaAutoHeightOptions);
	private elementInput;
	private init;
	private setAutoHeight;
	private textareaSetHeight;
	private checkIfOneLine;
	private isParentHidden;
	private parentType;
	private callbackAccordingToType;
	destroy(): void;
	static getInstance(target: HTMLTextAreaElement | string, isInstance?: boolean): any;
	static autoInit(): void;
}

export {
	HSTextareaAutoHeight as default,
};

export {};
