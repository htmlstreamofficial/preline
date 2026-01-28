export interface IInputNumberOptions {
	min?: number;
	max?: number;
	step?: number;
	forceBlankValue?: boolean;
}

export interface IInputNumber {
	options?: IInputNumberOptions;

	destroy(): void;
}
