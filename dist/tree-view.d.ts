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
export type ITreeViewOptionsControlBy = "checkbox" | "button";
export interface ITreeViewItem {
	id: string;
	value: string;
	isDir: boolean;
	path: string;
	isSelected?: boolean;
}
export interface ITreeViewOptions {
	items: ITreeViewItem[] | null;
	controlBy?: ITreeViewOptionsControlBy;
	autoSelectChildren?: boolean;
	isIndeterminate?: boolean;
}
export interface ITreeView {
	options?: ITreeViewOptions;
	update(): void;
	getSelectedItems(): ITreeViewItem[];
	changeItemProp(id: string, prop: string, val: any): void;
	destroy(): void;
}
declare class HSTreeView extends HSBasePlugin<ITreeViewOptions> implements ITreeView {
	private items;
	private readonly controlBy;
	private readonly autoSelectChildren;
	private readonly isIndeterminate;
	static group: number;
	private onElementClickListener;
	private onControlChangeListener;
	constructor(el: HTMLElement, options?: ITreeViewOptions, events?: {});
	private elementClick;
	private controlChange;
	private init;
	private initItems;
	private controlByButton;
	private controlByCheckbox;
	private getItem;
	private getPath;
	private unselectItem;
	private selectItem;
	private selectChildren;
	private toggleParent;
	update(): void;
	getSelectedItems(): ITreeViewItem[];
	changeItemProp(id: string, prop: string, val: any): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTreeView>;
	static autoInit(): void;
	static on(evt: string, target: HSTreeView | HTMLElement | string, cb: Function): void;
}

export {
	HSTreeView as default,
};

export {};
