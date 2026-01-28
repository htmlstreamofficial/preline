import { Options } from 'vanilla-calendar-pro/types';
import { ISelectOptions } from '../select/interfaces';

export interface ICustomDatepickerOptions extends Options {
	removeDefaultStyles?: boolean;
	mode?: 'custom-select' | 'default';
  applyUtilityClasses?: boolean;
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
	dateFormat?: string;
	dateLocale?: string;
	replaceTodayWithText?: boolean;
}

export interface IDatepicker {
	options?: ICustomDatepickerOptions;
	formatDate(date: string | number | Date, format?: string): string;
}

export interface ITemplates {
  default: (theme: string | boolean) => string;
  multiple: (theme: string | boolean) => string;
  year: (theme: string | boolean) => string;
  month: (theme: string | boolean) => string;
  years: (options: string, theme: string | boolean) => string;
  months: (theme: string | boolean) => string;
  hours: (theme: string | boolean) => string;
  minutes: (theme: string | boolean) => string;
  meridiem: (theme: string | boolean) => string;
}