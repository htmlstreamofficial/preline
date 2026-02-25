export type TAutoInitPlugin = {
	autoInit?: () => void;
};
export type TCollectionItem = {
	key: string;
	fn: TAutoInitPlugin | null;
	collection: string;
};
export declare const COLLECTIONS: TCollectionItem[];
export declare const HSStaticMethods: {
	getClassProperty: (el: HTMLElement, prop: string, val?: string) => string;
	afterTransition: (el: HTMLElement, callback: Function) => void;
	autoInit(collection?: string | string[]): void;
	cleanCollection(name?: string | string[]): void;
};

export {
	HSStaticMethods as default,
};

export {};
