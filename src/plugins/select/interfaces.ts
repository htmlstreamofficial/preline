export interface ISingleOptionOptions {
	description: string;
	icon: string;
}

export interface ISingleOption {
	title: string;
	val: string;
	disabled?: boolean;
	selected?: boolean;
	options?: ISingleOptionOptions | null;
}

export interface IApiFieldMap {
	id: string;
	val: string;
	title: string;
	icon?: string | null;
	description?: string | null;
	page?: string;
	offset?: string;
	limit?: string;
	[key: string]: unknown;
}

export interface ISelectOptions {
	value?: string | string[];
	isOpened?: boolean;
	placeholder?: string;
	hasSearch?: boolean;
	minSearchLength?: number;
	preventSearchFocus?: boolean;
	mode?: string;

	viewport?: string;

	wrapperClasses?: string;

	apiUrl?: string | null;
	apiQuery?: string | null;
	apiOptions?: RequestInit | null;
	apiDataPart?: string | null;
	apiSearchQueryKey?: string | null;
	apiFieldsMap?: IApiFieldMap | null;
	apiSelectedValues?: string | string[];
	apiIconTag?: string | null;
	apiLoadMore?: boolean | {
		perPage: number;
		scrollThreshold: number;
	};

	toggleTag?: string;
	toggleClasses?: string;
	toggleSeparators?: {
		items?: string;
		betweenItemsAndCounter?: string;
	};
	toggleCountText?: string | null;
	toggleCountTextPlacement?:
		| "postfix"
		| "prefix"
		| "postfix-no-space"
		| "prefix-no-space";
	toggleCountTextMinItems?: number;
	toggleCountTextMode?: string;

	tagsItemTemplate?: string;
	tagsItemClasses?: string;
	tagsInputId?: string;
	tagsInputClasses?: string;

	dropdownTag?: string;
	dropdownClasses?: string;
	dropdownDirectionClasses?: {
		top?: string;
		bottom?: string;
	};
	dropdownSpace: number;
	dropdownPlacement: string | null;
	dropdownVerticalFixedPlacement: "top" | "bottom" | null;
	dropdownScope: "window" | "parent";

	extraMarkup?: string | string[] | null;

	searchTemplate?: string;
	searchWrapperTemplate?: string;
	searchId?: string;
	searchLimit?: number | typeof Infinity;
	isSearchDirectMatch?: boolean;
	searchClasses?: string;
	searchWrapperClasses?: string;
	searchPlaceholder?: string;
	searchNoResultTemplate?: string | null;
	searchNoResultText?: string | null;
	searchNoResultClasses?: string | null;
	optionAllowEmptyOption?: boolean;

	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;

	descriptionClasses?: string;

	iconClasses?: string;

	isAddTagOnEnter?: boolean;
	dropdownAutoPlacement?: boolean;

	isSelectedOptionOnTop?: boolean;
}

export interface ISelect {
	options?: ISelectOptions;

	setValue(val: string | string[]): void;
	open(): void;
	close(): void;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): void;
	destroy(): void;
}
