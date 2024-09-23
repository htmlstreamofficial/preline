import { Options } from 'nouislider';

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
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
export type TRangeSliderOptionsFormatterType = "integer" | "thousandsSeparatorAndDecimalPoints" | null;
export interface IRangeSliderOptionsFormatterOptions {
	type?: TRangeSliderOptionsFormatterType;
	prefix?: string;
	postfix?: string;
}
export interface IRangeSliderOptions extends Options {
	disabled?: boolean;
	formatter?: IRangeSliderOptionsFormatterOptions | TRangeSliderOptionsFormatterType;
}
export interface IRangeSlider {
	options?: IRangeSliderOptions;
}
declare class HSRangeSlider extends HSBasePlugin<IRangeSliderOptions> implements IRangeSlider {
	private readonly concatOptions;
	private format;
	constructor(el: HTMLElement, options?: IRangeSliderOptions, events?: {});
	get formattedValue(): any;
	private processClasses;
	private init;
	private formatValue;
	private integerFormatter;
	private prefixOrPostfixFormatter;
	private thousandsSeparatorAndDecimalPointsFormatter;
	private setDisabled;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSRangeSlider>;
	static autoInit(): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {
	HSRangeSlider as default,
};

export {};
