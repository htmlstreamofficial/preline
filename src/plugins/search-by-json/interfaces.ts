export interface ISearchItemTemplate {
	type: string;
	markup: string;
}

export interface ISearchItem {
	title: string;
	url: string;
	description: string;
	categories?: string;
	type?: string;
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
