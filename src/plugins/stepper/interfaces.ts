export interface IStepperOptions {
	currentIndex?: number;
	isCompleted?: boolean;
	mode?: string;
}

export interface IStepper {
	options?: IStepperOptions;
	
	setProcessedNavItem(n?: number): void;
	unsetProcessedNavItem(n?: number): void;
	goToNext(): void;
	disableButtons(): void;
	enableButtons(): void;
	setErrorNavItem(n?: number): void;
	destroy(): void;
}

export interface IStepperItem {
	index: number;
	isFinal: boolean;
	isCompleted: boolean;
	isSkip: boolean;
	isOptional?: boolean;
	isDisabled?: boolean;
	isProcessed?: boolean;
	hasError?: boolean;
	el: HTMLElement;
}