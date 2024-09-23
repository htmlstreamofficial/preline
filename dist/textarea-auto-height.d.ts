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
export interface ITextareaAutoHeightOptions {
	defaultHeight: number;
}
export interface ITextareaAutoHeight {
	options?: ITextareaAutoHeightOptions;
}
declare class HSTextareaAutoHeight extends HSBasePlugin<ITextareaAutoHeightOptions> implements ITextareaAutoHeight {
	private readonly defaultHeight;
	constructor(el: HTMLTextAreaElement, options?: ITextareaAutoHeightOptions);
	private init;
	private setAutoHeight;
	private textareaSetHeight;
	private checkIfOneLine;
	private isParentHidden;
	private parentType;
	private callbackAccordingToType;
	static getInstance(target: HTMLTextAreaElement | string, isInstance?: boolean): HSTextareaAutoHeight | ICollectionItem<HSTextareaAutoHeight>;
	static autoInit(): void;
}

export {
	HSTextareaAutoHeight as default,
};

export {};
