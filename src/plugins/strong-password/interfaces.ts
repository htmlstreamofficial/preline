export interface IStrongPasswordOptions {
	target: string | HTMLInputElement;
	hints?: string;
	stripClasses?: string;
	minLength?: number;
	mode?: string;
	popoverSpace?: number;
	checksExclude?: string[];
	specialCharactersSet?: string;
}

export interface IStrongPassword {
	options?: IStrongPasswordOptions;
	
	recalculateDirection(): void;
	destroy(): void;
}
