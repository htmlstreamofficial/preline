export interface IComboBoxOptions {
	gap?: number;
	viewport?: string | HTMLElement | null;
	preventVisibility?: boolean;
	minSearchLength?: number;
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
	preventClientFiltering?: boolean;
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

export interface IComboBoxItemAttr {
	valueFrom: string;
	attr: string;
}