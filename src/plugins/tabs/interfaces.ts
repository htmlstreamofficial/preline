export interface ITabsOnChangePayload {
	el: HTMLElement;
	prev: string;
	current: string;
}

export interface ITabs {
	options?: {};

	destroy(): void;
}