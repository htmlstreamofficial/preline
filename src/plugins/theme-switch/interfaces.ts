export interface IThemeSwitchOptions {
	theme?: 'dark' | 'light' | 'default';
	type?: 'change' | 'click';
}

export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
	destroy(): void;
}
