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
