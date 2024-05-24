

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
export interface IComboBoxOptions {
	gap?: number;
	viewport?: string | HTMLElement | null;
	preventVisibility?: boolean;
	apiUrl?: string | null;
	apiDataPart?: string | null;
	apiQuery?: string | null;
	apiSearchQuery?: string | null;
	apiHeaders?: {};
	apiGroupField?: string | null;
	outputItemTemplate?: string | null;
	outputEmptyTemplate?: string | null;
	outputLoaderTemplate?: string | null;
	groupingType?: "default" | "tabs" | null;
	groupingTitleTemplate?: string | null;
	tabsWrapperTemplate?: string | null;
	preventSelection?: boolean;
	preventAutoPosition?: boolean;
	isOpenOnFocus?: boolean;
}
export interface IComboBox {
	options?: IComboBoxOptions;
	open(): void;
	close(): void;
	recalculateDirection(): void;
}
declare class HSComboBox extends HSBasePlugin<IComboBoxOptions> implements IComboBox {
	gap: number;
	viewport: string | HTMLElement | null;
	preventVisibility: boolean;
	apiUrl: string | null;
	apiDataPart: string | null;
	apiQuery: string | null;
	apiSearchQuery: string | null;
	apiHeaders: {};
	apiGroupField: string | null;
	outputItemTemplate: string | null;
	outputEmptyTemplate: string | null;
	outputLoaderTemplate: string | null;
	groupingType: "default" | "tabs" | null;
	groupingTitleTemplate: string | null;
	tabsWrapperTemplate: string | null;
	preventSelection: boolean;
	preventAutoPosition: boolean;
	isOpenOnFocus: boolean;
	private readonly input;
	private readonly output;
	private readonly itemsWrapper;
	private items;
	private tabs;
	private readonly toggle;
	private readonly toggleClose;
	private readonly toggleOpen;
	private outputPlaceholder;
	private outputLoader;
	private value;
	private selected;
	private groups;
	private selectedGroup;
	isOpened: boolean;
	isCurrent: boolean;
	private animationInProcess;
	constructor(el: HTMLElement, options?: IComboBoxOptions, events?: {});
	private init;
	private build;
	private setResultAndRender;
	private buildInput;
	private buildItems;
	private setResults;
	private isItemExists;
	private isTextExists;
	private isTextExistsAny;
	private valuesBySelector;
	private buildOutputLoader;
	private destroyOutputLoader;
	private itemsFromJson;
	private jsonItemsRender;
	private setGroups;
	setCurrent(): void;
	private setApiGroups;
	private sortItems;
	private itemRender;
	private plainRender;
	private groupTabsRender;
	private groupDefaultRender;
	private itemsFromHtml;
	private buildToggle;
	private buildToggleClose;
	private buildToggleOpen;
	private setSelectedByValue;
	private setValue;
	private setItemsVisibility;
	private hasVisibleItems;
	private appendItemsToWrapper;
	private buildOutputPlaceholder;
	private destroyOutputPlaceholder;
	private resultItems;
	private setValueAndOpen;
	open(val?: string): boolean;
	private setValueAndClear;
	close(val?: string | null): boolean;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSComboBox | ICollectionItem<HSComboBox>;
	static autoInit(): void;
	static close(target: HTMLElement | string): void;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null): void;
	private static getPreparedItems;
	private static setHighlighted;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onEnter(evt: Event): void;
}

export {
	HSComboBox as default,
};

export {};
