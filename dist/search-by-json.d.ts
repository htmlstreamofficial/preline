
export interface ISearchItemTemplate {
	type: string;
	markup: string;
}
export interface ISearchByJsonOptions {
	jsonUrl: string;
	minChars?: number;
	dropdownTemplate?: string;
	dropdownClasses?: string;
	dropdownItemTemplate?: string;
	dropdownItemTemplatesByType?: ISearchItemTemplate[];
	dropdownItemClasses?: string;
	highlightedTextTagName?: string;
	highlightedTextClasses?: string;
}
export interface ISearchByJson {
	options?: ISearchByJsonOptions;
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
declare class HSSearchByJson extends HSBasePlugin<ISearchByJsonOptions, HTMLInputElement> implements ISearchByJson {
	private readonly jsonUrl;
	private readonly minChars;
	private json;
	private result;
	private val;
	private readonly dropdownTemplate;
	private readonly dropdownClasses;
	private readonly dropdownItemTemplate;
	private readonly dropdownItemTemplatesByType;
	private readonly dropdownItemClasses;
	private readonly highlightedTextTagName;
	private readonly highlightedTextClasses;
	private dropdown;
	constructor(el: HTMLInputElement, options?: ISearchByJsonOptions);
	private init;
	private fetchData;
	private searchData;
	private buildDropdown;
	private buildItems;
	private itemTemplate;
	static getInstance(target: HTMLElement | string): HSSearchByJson;
	static autoInit(): void;
}

export {
	HSSearchByJson as default,
};

export {};
