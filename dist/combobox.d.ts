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
	apiSearchPath?: string | null;
	apiSearchDefaultPath?: string | null;
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
	getCurrentData(): {} | {}[];
	open(): void;
	close(): void;
	recalculateDirection(): void;
	destroy(): void;
}
declare class HSComboBox extends HSBasePlugin<IComboBoxOptions> implements IComboBox {
	gap: number;
	viewport: string | HTMLElement | null;
	preventVisibility: boolean;
	apiUrl: string | null;
	apiDataPart: string | null;
	apiQuery: string | null;
	apiSearchQuery: string | null;
	apiSearchPath: string | null;
	apiSearchDefaultPath: string | null;
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
	private currentData;
	private groups;
	private selectedGroup;
	isOpened: boolean;
	isCurrent: boolean;
	private animationInProcess;
	private onInputFocusListener;
	private onInputInputListener;
	private onToggleClickListener;
	private onToggleCloseClickListener;
	private onToggleOpenClickListener;
	constructor(el: HTMLElement, options?: IComboBoxOptions, events?: {});
	private inputFocus;
	private inputInput;
	private toggleClick;
	private toggleCloseClick;
	private toggleOpenClick;
	private init;
	private build;
	private getNestedProperty;
	private setValue;
	private setValueAndOpen;
	private setValueAndClear;
	private setSelectedByValue;
	private setResultAndRender;
	private setResults;
	private setGroups;
	private setApiGroups;
	private setItemsVisibility;
	private isTextExists;
	private isTextExistsAny;
	private hasVisibleItems;
	private valuesBySelector;
	private sortItems;
	private buildInput;
	private buildItems;
	private buildOutputLoader;
	private buildToggle;
	private buildToggleClose;
	private buildToggleOpen;
	private buildOutputPlaceholder;
	private destroyOutputLoader;
	private itemRender;
	private plainRender;
	private jsonItemsRender;
	private groupDefaultRender;
	private groupTabsRender;
	private itemsFromHtml;
	private itemsFromJson;
	private appendItemsToWrapper;
	private resultItems;
	private destroyOutputPlaceholder;
	getCurrentData(): {} | {}[];
	setCurrent(): void;
	open(val?: string): boolean;
	close(val?: string | null, data?: {} | null): boolean;
	recalculateDirection(): void;
	destroy(): void;
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
