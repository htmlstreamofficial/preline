import { Config } from 'datatables.net-dt';

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
export interface IDataTablePagingOptions {
	pageBtnClasses?: string;
}
export interface IDataTableRowSelectingOptions {
	selectAllSelector?: string;
	individualSelector?: string;
}
export interface IDataTableOptions extends Config {
	rowSelectingOptions?: IDataTableRowSelectingOptions;
	pagingOptions?: IDataTablePagingOptions;
}
export interface IDataTable {
	options?: IDataTableOptions;
}
declare class HSDataTable extends HSBasePlugin<IDataTableOptions> implements IDataTable {
	private concatOptions;
	private dataTable;
	private readonly table;
	private readonly search;
	private readonly pageEntities;
	private readonly paging;
	private readonly pagingPrev;
	private readonly pagingNext;
	private readonly pagingPages;
	private readonly info;
	private readonly infoFrom;
	private readonly infoTo;
	private readonly infoLength;
	private rowSelectingAll;
	private rowSelectingIndividual;
	private maxPagesToShow;
	private isRowSelecting;
	private readonly pageBtnClasses;
	constructor(el: HTMLElement, options?: IDataTableOptions, events?: {});
	private init;
	private initTable;
	private initSearch;
	private onSearchInput;
	private initPageEntities;
	private onEntitiesChange;
	private initInfo;
	private initInfoFrom;
	private initInfoTo;
	private initInfoLength;
	private updateInfo;
	private initPaging;
	private hidePagingIfSinglePage;
	private initPagingPrev;
	private onPrevClick;
	private disablePagingArrow;
	private initPagingNext;
	private onNextClick;
	private buildPagingPages;
	private updatePaging;
	private buildPagingPage;
	private onPageClick;
	private initRowSelecting;
	private triggerChangeEventToRow;
	private onSelectAllChange;
	private updateSelectAllCheckbox;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSDataTable>;
	static autoInit(): void;
}

export {
	HSDataTable as default,
};

export {};
