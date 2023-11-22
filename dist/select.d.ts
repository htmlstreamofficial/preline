export interface ISelectOptions {
	value?: string | string[];
	isOpened?: boolean;
	placeholder?: string;
	hasSearch?: boolean;
	mode?: string;
	viewport?: string;
	toggleTag?: string;
	toggleClasses?: string;
	toggleCountText?: string;
	toggleCountTextMinItems?: number;
	tagsClasses?: string;
	tagsItemTemplate?: string;
	tagsItemClasses?: string;
	tagsInputClasses?: string;
	dropdownTag?: string;
	dropdownClasses?: string;
	dropdownDirectionClasses?: {
		top?: string;
		bottom?: string;
	};
	dropdownSpace: number;
	searchWrapperTemplate?: string;
	searchClasses?: string;
	searchWrapperClasses?: string;
	searchPlaceholder?: string;
	searchNoItemsText?: string;
	searchNoItemsClasses?: string;
	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;
	descriptionClasses?: string;
	iconClasses?: string;
}
export interface ISelect {
	options?: ISelectOptions;
	open(): void;
	close(): void;
	recalculateDirection(): void;
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
	isIOS(): boolean;
	isIpadOS(): boolean;
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	dispatch(evt: string, element: any, payload?: any): void;
	on(evt: string, cb: Function): void;
	afterTransition(el: HTMLElement, callback: Function): void;
	onTransitionEnd(el: HTMLElement, cb: Function): void;
	getClassProperty(el: HTMLElement, prop: string, val?: string): string;
	getClassPropertyAlt(el: HTMLElement, prop?: string, val?: string): string;
	htmlToElement(html: string): HTMLElement;
	classToClassList(classes: string, target: HTMLElement, splitter?: string): void;
	debounce(func: Function, timeout?: number): (...args: any[]) => void;
	checkIfFormElement(target: HTMLElement): boolean;
	static isEnoughSpace(el: HTMLElement, toggle: HTMLElement, preferredPosition?: "top" | "bottom" | "auto", space?: number, wrapper?: HTMLElement | null): boolean;
	static isParentOrElementHidden(element: any): any;
}
declare class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder;
	private readonly hasSearch;
	private readonly mode;
	private readonly viewport;
	isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;
	private readonly toggleTag;
	private readonly toggleClasses;
	private readonly toggleCountText;
	private readonly toggleCountTextMinItems;
	private readonly tagsClasses;
	private readonly tagsItemTemplate;
	private readonly tagsItemClasses;
	private readonly tagsInputClasses;
	private readonly dropdownTag;
	private readonly dropdownClasses;
	private readonly dropdownDirectionClasses;
	dropdownSpace: number | null;
	private readonly searchWrapperTemplate;
	private readonly searchPlaceholder;
	private readonly searchClasses;
	private readonly searchWrapperClasses;
	private readonly optionTag;
	private readonly optionTemplate;
	private readonly optionClasses;
	private readonly descriptionClasses;
	private readonly iconClasses;
	private animationInProcess;
	private wrapper;
	private toggle;
	private toggleTextWrapper;
	private tags;
	private tagsItems;
	private tagsInput;
	private dropdown;
	private searchWrapper;
	private search;
	private selectOptions;
	constructor(el: HTMLElement, options?: ISelectOptions);
	private init;
	private build;
	private buildWrapper;
	private buildToggle;
	private setToggleIcon;
	private setToggleTitle;
	private buildTags;
	private buildTagsItems;
	private buildTagsItem;
	private getItemByValue;
	private setTagsItems;
	private buildTagsInput;
	private buildDropdown;
	private buildSearch;
	private buildOption;
	private onSelectOption;
	private addSelectOption;
	private resetTagsInputField;
	private clearSelections;
	private setNewValue;
	private stringFromValue;
	private selectSingleItem;
	private selectMultipleItems;
	private unselectMultipleItems;
	private searchOptions;
	open(): boolean;
	close(): boolean;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSSelect | {
		id: number;
		element: HSSelect;
	};
	static autoInit(): void;
	static close(target: HTMLElement | string): void;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onTab(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onEnter(evt: Event): void;
}

export {
	HSSelect as default,
};

export {};
