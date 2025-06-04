import type { Options } from "nouislider";

import { TRangeSliderOptionsFormatterType } from "./types";

export interface IRangeSliderCssClassesObject {
	[key: string]: any;
}

export interface IRangeSliderOptionsFormatterOptions {
	type?: TRangeSliderOptionsFormatterType;
	prefix?: string;
	postfix?: string;
}

export interface IRangeSliderOptions extends Options {
	disabled?: boolean;
	wrapper?: HTMLElement;
	currentValue?: HTMLElement[];
	formatter?:
		| IRangeSliderOptionsFormatterOptions
		| TRangeSliderOptionsFormatterType;
	icons?: {
		handle?: string;
	};
}

export interface IRangeSlider {
	options?: IRangeSliderOptions;

	destroy(): void;
}
