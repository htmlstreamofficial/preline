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
export interface IAccordionTreeViewStaticOptions {
}
export interface IAccordionTreeView {
	el: HTMLElement | null;
	options?: IAccordionTreeViewStaticOptions;
}
export interface IAccordionOptions {
}
export interface IAccordion {
	options?: IAccordionOptions;
	show(): void;
	hide(): void;
}
declare class HSAccordion extends HSBasePlugin<IAccordionOptions> implements IAccordion {
	private readonly toggle;
	content: HTMLElement | null;
	private group;
	private isAlwaysOpened;
	static selectable: IAccordionTreeView[];
	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {});
	private init;
	show(): boolean;
	hide(): boolean;
	update(): boolean;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSAccordion>;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static autoInit(): void;
	static treeView(): boolean;
	static toggleSelected(root: IAccordionTreeView, item: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSAccordion as default,
};

export {};
