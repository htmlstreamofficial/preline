export type ITreeViewOptionsControlBy = 'checkbox' | 'button';

export interface ITreeViewItem {
	id: string;
	value: string;
	isDir: boolean;
	path: string;
	isSelected?: boolean;
}

export interface ITreeViewOptions {
	items: ITreeViewItem[] | null;
	controlBy?: ITreeViewOptionsControlBy;
	autoSelectChildren?: boolean;
	isIndeterminate?: boolean;
}

export interface ITreeView {
	options?: ITreeViewOptions;

	update(): void;
	getSelectedItems(): ITreeViewItem[];
	changeItemProp(id: string, prop: string, val: any): void;
	destroy(): void;
}
