export interface IAccordionTreeViewStaticOptions {}

export interface IAccordionTreeView {
	el: HTMLElement | null;
	options?: IAccordionTreeViewStaticOptions
}

export interface IAccordionOptions {}

export interface IAccordion {
	options?: IAccordionOptions;

	show(): void;

	hide(): void;
}
