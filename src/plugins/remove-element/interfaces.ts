export interface IRemoveElementOptions {
	removeTargetAnimationClass: string;
}

export interface IRemoveElement {
	options?: IRemoveElementOptions;

	destroy(): void;
}
