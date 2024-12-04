export interface IInputNumberOptions {
	min?: number;
	max?: number;
	step?: number;
}

export interface IInputNumber {
	options?: IInputNumberOptions;

	destroy(): void;
}
