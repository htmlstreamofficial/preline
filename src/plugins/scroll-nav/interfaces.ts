export interface IScrollNavOptions {
	paging?: boolean;
	autoCentering?: boolean;
}

export interface IScrollNavCurrentState {
	first: HTMLElement;
	last: HTMLElement;
	center: HTMLElement;
}

export interface IScrollNav {
	options?: IScrollNavOptions;

	getCurrentState(): IScrollNavCurrentState;
	goTo(el: Element, cb?: () => void): void;
	centerElement(el: HTMLElement, behavior: ScrollBehavior): void;
	destroy(): void;
}
