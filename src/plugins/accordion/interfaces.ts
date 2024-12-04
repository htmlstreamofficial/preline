export interface IAccordionTreeViewStaticOptions {}

export interface IAccordionTreeView {
	el: HTMLElement | null;
	options?: IAccordionTreeViewStaticOptions;
	listeners?: { el: HTMLElement; listener: (evt: Event) => void }[];
}

export interface IAccordionOptions {}

export interface IAccordion {
	options?: IAccordionOptions;

	toggleClick(evt: Event): void;
	show(): void;
	hide(): void;
	update(): void;
	destroy(): void;
}
