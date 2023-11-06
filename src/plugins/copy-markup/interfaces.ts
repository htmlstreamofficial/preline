export interface ICopyMarkupOptions {
	targetSelector: string;
	wrapperSelector: string;
	limit?: number;
}

export interface ICopyMarkup {
	options?: ICopyMarkupOptions;
}
