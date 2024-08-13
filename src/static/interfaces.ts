export interface IStaticMethods {
	getClassProperty(el: HTMLElement, prop?: string, val?: string): string;
	afterTransition(el: HTMLElement, cb: Function): void;
	autoInit(collection?: string | string[]): void;
	cleanCollection(collection?: string | string[]): void;
    autoClean(collection?: string | string[], target?: HTMLElement | Document): void;
}
