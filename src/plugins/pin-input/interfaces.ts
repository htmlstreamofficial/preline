export interface IPinInputOptions {
	availableCharsRE?: RegExp;
}

export interface IPinInput {
	options?: IPinInputOptions;

	destroy(): void;
}