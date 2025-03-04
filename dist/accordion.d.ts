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
	listeners?: {
		el: HTMLElement;
		listener: (evt: Event) => void;
	}[];
}
export interface IAccordionOptions {
}
export interface IAccordion {
	options?: IAccordionOptions;
	toggleClick(evt: Event): void;
	show(): void;
	hide(): void;
	update(): void;
	destroy(): void;
}
declare class HSAccordion extends HSBasePlugin<IAccordionOptions> implements IAccordion {
	private toggle;
	content: HTMLElement | null;
	private group;
	private isAlwaysOpened;
	private keepOneOpen;
	private isToggleStopPropagated;
	private onToggleClickListener;
	static selectable: IAccordionTreeView[];
	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {});
	private init;
	toggleClick(evt: Event): boolean;
	show(): boolean;
	hide(): boolean;
	update(): boolean;
	destroy(): void;
	private static findInCollection;
	static autoInit(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSAccordion>;
	static show(target: HSAccordion | HTMLElement | string): void;
	static hide(target: HSAccordion | HTMLElement | string): void;
	static onSelectableClick: (evt: Event, item: IAccordionTreeView, el: HTMLElement) => void;
	static treeView(): boolean;
	static toggleSelected(root: IAccordionTreeView, item: HTMLElement): void;
	static on(evt: string, target: HSAccordion | HTMLElement | string, cb: Function): void;
}

export {
	HSAccordion as default,
};

export {};
