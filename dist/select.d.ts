
export interface ISingleOptionOptions {
	description: string;
	icon: string;
}
export interface ISingleOption {
	title: string;
	val: string;
	options?: ISingleOptionOptions | null;
}
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
	searchNoResultText?: string | null;
	searchNoResultClasses?: string | null;
	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;
	descriptionClasses?: string;
	iconClasses?: string;
	isAddTagOnEnter?: boolean;
}
export interface ISelect {
	options?: ISelectOptions;
	destroy(): void;
	open(): void;
	close(): void;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
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
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
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
	private searchNoResultText;
	private searchNoResultClasses;
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
	private searchNoResult;
	private selectOptions;
	private readonly isAddTagOnEnter;
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
	private destroyOption;
	private buildOriginalOption;
	private destroyOriginalOption;
	private onSelectOption;
	private addSelectOption;
	private removeSelectOption;
	private resetTagsInputField;
	private clearSelections;
	private setNewValue;
	private stringFromValue;
	private selectSingleItem;
	private selectMultipleItems;
	private unselectMultipleItems;
	private searchOptions;
	private eraseToggleIcon;
	private eraseToggleTitle;
	destroy(): void;
	open(): boolean;
	close(): boolean;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSSelect | ICollectionItem<HSSelect>;
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
