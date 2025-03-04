import { Options } from 'vanilla-calendar-pro/types';
import { ISelectOptions } from '../select/interfaces';

export interface ICustomDatepickerOptions extends Options {
	removeDefaultStyles?: boolean;
	mode?: 'custom-select' | 'default';
	inputModeOptions?: {
		dateSeparator?: string;
		itemsSeparator?: string;
	},
	templates?: {
		time?: string,
		arrowPrev?: string,
		arrowNext?: string
	},
	styles?: Options['styles'] & {
		customSelect?: {
			shared?: ISelectOptions;
			years?: ISelectOptions;
			months?: ISelectOptions;
			hours?: ISelectOptions;
			minutes?: ISelectOptions;
			meridiem?: ISelectOptions;
		}
	};
}

export interface IDatepicker {
	options?: ICustomDatepickerOptions;
}
