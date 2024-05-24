export interface IOverlayOptions {
	hiddenClass?: string | null;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropExtraClasses?: string | null;
}

export interface IOverlay {
	options?: IOverlayOptions;

	open(): void;

	close(): void;
}
