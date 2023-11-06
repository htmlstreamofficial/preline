export interface IOverlayOptions {
	hiddenClass?: string | null;
}

export interface IOverlay {
	options?: IOverlayOptions;
	
	open(): void;
	
	close(): void;
}
