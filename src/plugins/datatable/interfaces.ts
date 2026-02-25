import { Config } from 'datatables.net-dt';

interface IDataTablePagingOptions {
	pageBtnClasses?: string;
}

interface IDataTableRowSelectingOptions {
	selectAllSelector?: string;
	individualSelector?: string;
}
export interface IDataTableOptions extends Config {
	rowSelectingOptions?: IDataTableRowSelectingOptions;
	pagingOptions?: IDataTablePagingOptions;
}

export interface IDataTable {
	options?: IDataTableOptions;

	destroy(): void;
}

export interface IColumnDef {
	targets: number;
	orderable: boolean;
}