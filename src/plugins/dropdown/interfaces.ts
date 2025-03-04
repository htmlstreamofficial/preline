export interface IDropdown {
	options?: {};
	
	open(): void;
	close(isAnimated: boolean): void;
	forceClearState(): void;
	destroy(): void;
}

export interface IHTMLElementFloatingUI extends HTMLElement {
	_floatingUI: any;
}
