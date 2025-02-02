export interface ILayoutSplitterOptions {
	horizontalSplitterClasses?: string | null;
	horizontalSplitterTemplate?: string;
	verticalSplitterClasses?: string | null;
	verticalSplitterTemplate?: string;
	isSplittersAddedManually?: boolean;
}

export interface ISingleLayoutSplitter {
	el: HTMLElement;
	items: HTMLElement[];
}

export interface IControlLayoutSplitter {
	el: HTMLElement;
	direction: 'horizontal' | 'vertical';
	prev: HTMLElement | null;
	next: HTMLElement | null;
}

export interface ILayoutSplitter {
	options?: ILayoutSplitterOptions;

	getSplitterItemSingleParam(item: HTMLElement, name: string): any;
	getData(el: HTMLElement): any;
	setSplitterItemSize(el: HTMLElement, size: number): void;
	updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void;
	destroy(): void;
}
