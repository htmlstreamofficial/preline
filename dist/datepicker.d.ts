import { DatesArr } from 'vanilla-calendar-pro';
import { Options } from 'vanilla-calendar-pro/types';

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
	toggleCountTextPlacement?: "postfix" | "prefix" | "postfix-no-space" | "prefix-no-space";
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
export interface ICustomDatepickerOptions extends Options {
	removeDefaultStyles?: boolean;
	mode?: "custom-select" | "default";
	inputModeOptions?: {
		dateSeparator?: string;
		itemsSeparator?: string;
	};
	templates?: {
		time?: string;
		arrowPrev?: string;
		arrowNext?: string;
	};
	styles?: Options["styles"] & {
		customSelect?: {
			shared?: ISelectOptions;
			years?: ISelectOptions;
			months?: ISelectOptions;
			hours?: ISelectOptions;
			minutes?: ISelectOptions;
			meridiem?: ISelectOptions;
		};
	};
	dateFormat?: string;
	dateLocale?: string;
	replaceTodayWithText?: boolean;
}
export interface IDatepicker {
	options?: ICustomDatepickerOptions;
	formatDate(date: string | number | Date, format?: string): string;
}
declare class HSDatepicker extends HSBasePlugin<{}> implements IDatepicker {
	private dataOptions;
	private concatOptions;
	private updatedStyles;
	private vanillaCalendar;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private getTimeParts;
	private getCurrentMonthAndYear;
	private setInputValue;
	private getLocalizedTodayText;
	private changeDateSeparator;
	private formatDateArrayToIndividualDates;
	private hasTime;
	private createArrowFromTemplate;
	private concatObjectProperties;
	private updateTemplate;
	private initCustomTime;
	private initCustomMonths;
	private initCustomYears;
	private generateCustomTimeMarkup;
	private generateCustomMonthMarkup;
	private generateCustomYearMarkup;
	private generateCustomArrowPrevMarkup;
	private generateCustomArrowNextMarkup;
	private parseCustomTime;
	private parseCustomMonth;
	private parseCustomYear;
	private parseArrowPrev;
	private parseArrowNext;
	private processCustomTemplate;
	private disableOptions;
	private disableNav;
	private destroySelects;
	private updateSelect;
	private updateCalendar;
	private updateCustomSelects;
	getCurrentState(): {
		selectedDates: DatesArr;
		selectedTime: string;
	};
	formatDate(date: string | number | Date, format?: string): string;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSDatepicker>;
	static autoInit(): void;
}

export {
	HSDatepicker as default,
};

export {};
