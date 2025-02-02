export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}
declare class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	el: E;
	options: O;
	events?: any;
	constructor(el: E, options: O, events?: any);
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
export interface IToggleCountOptions {
	target: string | HTMLInputElement;
	min: number;
	max: number;
	duration: number;
}
export interface IToggleCount {
	options?: IToggleCountOptions;
	countUp(): void;
	countDown(): void;
	destroy(): void;
}
declare class HSToggleCount extends HSBasePlugin<IToggleCountOptions> implements IToggleCount {
	private readonly target;
	private readonly min;
	private readonly max;
	private readonly duration;
	private isChecked;
	private onToggleChangeListener;
	constructor(el: HTMLElement, options?: IToggleCountOptions);
	private toggleChange;
	private init;
	private toggle;
	private animate;
	countUp(): void;
	countDown(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSToggleCount | ICollectionItem<HSToggleCount>;
	static autoInit(): void;
}

export {
	HSToggleCount as default,
};

export {};
