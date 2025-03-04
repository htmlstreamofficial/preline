export interface IScrollspyOptions {
	ignoreScrollUp?: boolean;
}

export interface IScrollspy {
	options?: IScrollspyOptions;

	destroy(): void;
}
