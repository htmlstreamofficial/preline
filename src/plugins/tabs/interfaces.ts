export interface ITabsOnChangePayload {
	el: HTMLElement;
	tabsId: string;
	prev: string;
	current: string;
}

export interface ITabsOptions {
	eventType: 'click' | 'hover';
	preventNavigationResolution: string | number | null;
}

export interface ITabs {
	options?: ITabsOptions;

	destroy(): void;
}