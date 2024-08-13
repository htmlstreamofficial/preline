export interface IStaticMethods {
	getClassProperty(el: HTMLElement, prop?: string, val?: string): string;
	afterTransition(el: HTMLElement, cb: Function): void;
	autoInit(collection?: string | string[], target: HTMLElement | null = null): void;
	cleanCollection(collection?: string | string[]): void;
}
