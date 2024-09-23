import type { Options } from 'nouislider';

import { TRangeSliderOptionsFormatterType } from './types';

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
	formatter?:
		| IRangeSliderOptionsFormatterOptions
		| TRangeSliderOptionsFormatterType;
}

export interface IRangeSlider {
	options?: IRangeSliderOptions;
}
