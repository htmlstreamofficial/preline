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
export interface ILayoutSplitterOptions {
	horizontalSplitterClasses?: string | null;
	horizontalSplitterTemplate?: string;
	verticalSplitterClasses?: string | null;
	verticalSplitterTemplate?: string;
	isSplittersAddedManually?: boolean;
}
export interface IControlLayoutSplitter {
	el: HTMLElement;
	direction: "horizontal" | "vertical";
	prev: HTMLElement | null;
	next: HTMLElement | null;
}
export interface ILayoutSplitter {
	options?: ILayoutSplitterOptions;
	getSplitterItemSingleParam(item: HTMLElement, name: string): any;
	getData(el: HTMLElement): any;
	setSplitterItemSize(el: HTMLElement, size: number): void;
	updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void;
	destroy(): void;
}
declare class HSLayoutSplitter extends HSBasePlugin<ILayoutSplitterOptions> implements ILayoutSplitter {
	static isListenersInitialized: boolean;
	private readonly horizontalSplitterClasses;
	private readonly horizontalSplitterTemplate;
	private readonly verticalSplitterClasses;
	private readonly verticalSplitterTemplate;
	private readonly isSplittersAddedManually;
	private horizontalSplitters;
	private horizontalControls;
	private verticalSplitters;
	private verticalControls;
	isDragging: boolean;
	activeSplitter: IControlLayoutSplitter | null;
	private onControlPointerDownListener;
	constructor(el: HTMLElement, options?: ILayoutSplitterOptions);
	private controlPointerDown;
	private controlPointerUp;
	private static onDocumentPointerMove;
	private static onDocumentPointerUp;
	private init;
	private buildSplitters;
	private buildHorizontalSplitters;
	private buildVerticalSplitters;
	private buildControl;
	private getSplitterItemParsedParam;
	private getContainerSize;
	private getMaxFlexSize;
	private updateHorizontalSplitter;
	private updateSingleSplitter;
	private updateVerticalSplitter;
	private updateSplitterItemParam;
	private onPointerDownHandler;
	private onPointerUpHandler;
	private onPointerMoveHandler;
	private bindListeners;
	private calculateAvailableSize;
	private calculateResizedSizes;
	private enforceLimits;
	private applySizes;
	getSplitterItemSingleParam(item: HTMLElement, name: string): any;
	getData(el: HTMLElement): any;
	setSplitterItemSize(el: HTMLElement, size: number): void;
	updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void;
	destroy(): void;
	static autoInit(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSLayoutSplitter>;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSLayoutSplitter as default,
};

export {};
