export interface ITogglePasswordOptions {
	target: string | string[] | HTMLInputElement | HTMLInputElement[];
}

export interface ITogglePassword {
	options?: ITogglePasswordOptions;
	
	show(): void;
	hide(): void;
	destroy(): void;
}
