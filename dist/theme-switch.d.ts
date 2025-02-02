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
export interface IThemeSwitchOptions {
	theme?: "dark" | "light" | "default";
	type?: "change" | "click";
}
export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
	destroy(): void;
}
declare class HSThemeSwitch extends HSBasePlugin<IThemeSwitchOptions> implements IThemeSwitch {
	theme: string;
	type: "change" | "click";
	private themeSet;
	private onElementChangeListener;
	private onElementClickListener;
	constructor(el: HTMLElement | HTMLInputElement, options?: IThemeSwitchOptions);
	private elementChange;
	private elementClick;
	private init;
	private buildSwitchTypeOfChange;
	private buildSwitchTypeOfClick;
	private setResetStyles;
	private addSystemThemeObserver;
	private removeSystemThemeObserver;
	private toggleObserveSystemTheme;
	setAppearance(theme?: string, isSaveToLocalStorage?: boolean, isSetDispatchEvent?: boolean): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSThemeSwitch>;
	static autoInit(): void;
}

export {
	HSThemeSwitch as default,
};

export {};
