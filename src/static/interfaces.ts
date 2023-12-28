export interface IStaticMethods {
	getClassProperty(el: HTMLElement, prop?: string, val?: string): string;
	afterTransition(el: HTMLElement, cb: Function): void;
	autoInit(collection?: string | string[]): void;
}