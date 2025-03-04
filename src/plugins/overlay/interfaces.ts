export interface IOverlayOptions {
	hiddenClass?: string | null;
	emulateScrollbarSpace?: boolean;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropParent?: string | HTMLElement | Document;
	backdropExtraClasses?: string | null;
	moveOverlayToBody?: number | null;
}

export interface IOverlay {
	options?: IOverlayOptions;

	open(cb: Function | null): void;
	close(forceClose: boolean, cb: Function | null): void;
	destroy(): void;
}
