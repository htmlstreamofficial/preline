export interface IThemeSwitchOptions {
	theme?: 'dark' | 'light' | 'default';
}

export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
}
