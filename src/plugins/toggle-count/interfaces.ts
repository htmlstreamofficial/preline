export interface IToggleCountOptions {
	target: string | HTMLInputElement;
	min: number;
	max: number;
	duration: number;
}

export interface IToggleCount {
	options?: IToggleCountOptions;
	
	countUp(): void;
	
	countDown(): void;
}
