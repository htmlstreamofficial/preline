
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
}
export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}
declare class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	el: E;
	options: O;
	events?: any;
	constructor(el: E, options: O, events?: any);
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
declare class HSStrongPassword extends HSBasePlugin<IStrongPasswordOptions> implements IStrongPassword {
	private readonly target;
	private readonly hints;
	private readonly stripClasses;
	private readonly minLength;
	private readonly mode;
	private readonly popoverSpace;
	private readonly checksExclude;
	private readonly specialCharactersSet;
	isOpened: boolean;
	private strength;
	private passedRules;
	private weakness;
	private rules;
	private availableChecks;
	constructor(el: HTMLElement, options?: IStrongPasswordOptions);
	private init;
	private build;
	private buildStrips;
	private buildHints;
	private buildWeakness;
	private buildRules;
	private setWeaknessText;
	private setRulesText;
	private togglePopover;
	private checkStrength;
	private checkIfPassed;
	private setStrength;
	private hideStrips;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string): HSStrongPassword;
	static autoInit(): void;
}

export {
	HSStrongPassword as default,
};

export {};
