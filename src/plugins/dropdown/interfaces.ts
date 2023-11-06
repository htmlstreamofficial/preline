export interface IDropdown {
	options?: {};
	
	open(): void;
	
	close(isAnimated: boolean): void;
	
	forceClearState(): void;
}

export interface IHTMLElementPopper extends HTMLElement {
	_popper: any;
}
