export interface IOverlayOptions {
	hiddenClass?: string | null;
	emulateScrollbarSpace?: boolean;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropExtraClasses?: string | null;
	moveOverlayToBody?: number | null;
}

export interface IOverlay {
	options?: IOverlayOptions;

	open(): void;

	close(): void;
}
