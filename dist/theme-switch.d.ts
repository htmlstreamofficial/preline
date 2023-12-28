
export interface IThemeSwitchOptions {
	theme?: "dark" | "light" | "default";
}
export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
}
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
declare class HSThemeSwitch extends HSBasePlugin<IThemeSwitchOptions> implements IThemeSwitch {
	theme: string;
	private readonly themeSet;
	constructor(el: HTMLElement, options?: IThemeSwitchOptions);
	private init;
	private setResetStyles;
	setAppearance(theme?: string, isSaveToLocalStorage?: boolean, isSetDispatchEvent?: boolean): void;
	static getInstance(target: HTMLElement | string): HSThemeSwitch;
	static autoInit(): void;
}

export {
	HSThemeSwitch as default,
};

export {};
