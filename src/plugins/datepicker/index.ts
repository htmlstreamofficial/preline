/*
 * HSDatepicker
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from "../../utils";
import { Calendar, DatesArr, Range } from "vanilla-calendar-pro";

import CustomVanillaCalendar from "./vanilla-datepicker-pro";
import { templates } from "./templates";
import { classToClassList, htmlToElement } from "../../utils";
import HSSelect from "../select";
import { ISelectOptions } from "../select/interfaces";

import { ICustomDatepickerOptions, IDatepicker } from "./interfaces";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";

declare var _: any;

class HSDatepicker extends HSBasePlugin<{}> implements IDatepicker {
	private dataOptions: ICustomDatepickerOptions;
	private updatedStyles: ICustomDatepickerOptions["styles"];

	private vanillaCalendar: Calendar;

	constructor(el: HTMLElement, options?: {}, events?: {}) {
		super(el, options, events);

		const dataOptions: ICustomDatepickerOptions =
			el.getAttribute("data-hs-datepicker")
				? JSON.parse(el.getAttribute("data-hs-datepicker")!)
				: {};

		this.dataOptions = {
			...dataOptions,
			...options,
		};

		const removeDefaultStyles =
			typeof this.dataOptions?.removeDefaultStyles !== "undefined"
				? this.dataOptions?.removeDefaultStyles
				: false;

		this.updatedStyles = _.mergeWith(
			removeDefaultStyles ? {} : CustomVanillaCalendar.defaultStyles,
			this.dataOptions?.styles || {},
			(a: any, b: any) => {
				if (typeof a === "string" && typeof b === "string") {
					return `${a} ${b}`;
				}
			},
		);

		const today = new Date();
		const defaults = {
			styles: this.updatedStyles,
			dateMin: this.dataOptions.dateMin ?? today.toISOString().split("T")[0],
			dateMax: this.dataOptions.dateMax ?? "2470-12-31",
			mode: this.dataOptions.mode ?? "default",
			inputMode: typeof this.dataOptions.inputMode !== "undefined"
				? this.dataOptions.inputMode
				: true,
		};

		const chainCallbacks = (
			superCallback?: Function,
			customCallback?: (self: Calendar) => void,
		) =>
		(self: Calendar) => {
			superCallback?.(self);
			customCallback?.(self);
		};
		const initTime = (self: Calendar) => {
			if (this.hasTime(self)) this.initCustomTime(self);
		};

		const _options = {
			layouts: {
				month: templates.month,
			},
			onInit: chainCallbacks(this.dataOptions.onInit, (self) => {
				if (defaults.mode === "custom-select" && !this.dataOptions.inputMode) {
					initTime(self);
				}
			}),
			onShow: chainCallbacks(this.dataOptions.onShow, (self) => {
				if (defaults.mode === "custom-select") {
					this.updateCustomSelects(self);
					initTime(self);
				}
			}),
			onHide: chainCallbacks(this.dataOptions.onHide, (self) => {
				if (defaults.mode === "custom-select") {
					this.destroySelects(self.context.mainElement);
				}
			}),
			onUpdate: chainCallbacks(this.dataOptions.onUpdate, (self) => {
				this.updateCalendar(self.context.mainElement);
			}),
			onCreateDateEls: chainCallbacks(
				this.dataOptions.onCreateDateEls,
				(self) => {
					if (defaults.mode === "custom-select") this.updateCustomSelects(self);
				},
			),
			onChangeToInput: chainCallbacks(
				this.dataOptions.onChangeToInput,
				(self) => {
					if (!self.context.inputElement) return;

					this.setInputValue(
						self.context.inputElement,
						self.context.selectedDates,
					);

					const data = {
						selectedDates: self.context.selectedDates,
						selectedTime: self.context.selectedTime,
						rest: self.context,
					};

					this.fireEvent("change", data);
					dispatch("change.hs.datepicker", this.el, data);
				},
			),
			onChangeTime: chainCallbacks(this.dataOptions.onChangeTime, initTime),
			onClickYear: chainCallbacks(this.dataOptions.onClickYear, initTime),
			onClickMonth: chainCallbacks(this.dataOptions.onClickMonth, initTime),
			onClickArrow: chainCallbacks(this.dataOptions.onClickArrow, (self) => {
				if (defaults.mode === "custom-select") {
					setTimeout(() => {
						this.disableNav();
						this.disableOptions();
						this.updateCalendar(self.context.mainElement);
					});
				}
			}),
		};

		const processedOptions = {
			...defaults,
			layouts: {
				default: this.processCustomTemplate(templates.default, "default"),
				multiple: this.processCustomTemplate(templates.multiple, "multiple"),
				year: this.processCustomTemplate(templates.year, "default"),
			},
		};

		this.vanillaCalendar = new CustomVanillaCalendar(
			this.el,
			_.merge(_options, this.dataOptions, processedOptions),
		);

		this.init();
	}

	private init() {
		this.createCollection(window.$hsDatepickerCollection, this);

		this.vanillaCalendar.init();

		if (this.dataOptions?.selectedDates) {
			this.setInputValue(
				this.vanillaCalendar.context.inputElement,
				this.formatDateArrayToIndividualDates(this.dataOptions?.selectedDates),
			);
		}
	}

	private getTimeParts(time: string) {
		const [_time, meridiem] = time.split(" ");
		const [hours, minutes] = _time.split(":");

		return [hours, minutes, meridiem];
	}

	private getCurrentMonthAndYear(el: HTMLElement) {
		const currentMonthHolder = el.querySelector('[data-vc="month"]');
		const currentYearHolder = el.querySelector('[data-vc="year"]');

		return {
			month: +currentMonthHolder.getAttribute("data-vc-month"),
			year: +currentYearHolder.getAttribute("data-vc-year"),
		};
	}

	private setInputValue(target: HTMLInputElement, dates: DatesArr) {
		const dateSeparator = this.dataOptions?.inputModeOptions?.dateSeparator ??
			".";
		const itemsSeparator = this.dataOptions?.inputModeOptions?.itemsSeparator ??
			", ";
		const selectionDatesMode = this.dataOptions?.selectionDatesMode ?? "single";

		if (dates.length && dates.length > 1) {
			if (selectionDatesMode === "multiple") {
				const temp: string[] = [];
				dates.forEach((date) =>
					temp.push(this.changeDateSeparator(date, dateSeparator))
				);

				target.value = temp.join(itemsSeparator);
			} else {
				target.value = [
					this.changeDateSeparator(dates[0], dateSeparator),
					this.changeDateSeparator(dates[1], dateSeparator),
				].join(itemsSeparator);
			}
		} else if (dates.length && dates.length === 1) {
			target.value = this.changeDateSeparator(dates[0], dateSeparator);
		} else target.value = "";
	}

	private changeDateSeparator(
		date: string | number | Date,
		separator = ".",
		defaultSeparator = "-",
	) {
		const newDate = (date as string).split(defaultSeparator);

		return newDate.join(separator);
	}

	private formatDateArrayToIndividualDates(dates: DatesArr): string[] {
		const selectionDatesMode = this.dataOptions?.selectionDatesMode ?? "single";
		const expandDateRange = (start: string, end: string): string[] => {
			const startDate = new Date(start);
			const endDate = new Date(end);
			const result: string[] = [];

			while (startDate <= endDate) {
				result.push(startDate.toISOString().split("T")[0]);
				startDate.setDate(startDate.getDate() + 1);
			}

			return result;
		};
		const formatDate = (date: string | number | Date): string[] => {
			if (typeof date === "string") {
				const rangeMatch = date.match(
					/^(\d{4}-\d{2}-\d{2})\s*[^a-zA-Z0-9]*\s*(\d{4}-\d{2}-\d{2})$/,
				);

				if (rangeMatch) {
					const [_, start, end] = rangeMatch;

					return selectionDatesMode === "multiple-ranged"
						? [start, end]
						: expandDateRange(start.trim(), end.trim());
				}

				return [date];
			} else if (typeof date === "number") {
				return [new Date(date).toISOString().split("T")[0]];
			} else if (date instanceof Date) {
				return [date.toISOString().split("T")[0]];
			}

			return [];
		};

		return dates.flatMap(formatDate);
	}

	private hasTime(el: Calendar) {
		const { mainElement } = el.context;
		const hours = mainElement.querySelector(
			"[data-hs-select].--hours",
		) as HTMLElement;
		const minutes = mainElement.querySelector(
			"[data-hs-select].--minutes",
		) as HTMLElement;
		const meridiem = mainElement.querySelector(
			"[data-hs-select].--meridiem",
		) as HTMLElement;

		return hours && minutes && meridiem;
	}

	private createArrowFromTemplate(
		template: string,
		classes: string | boolean = false,
	) {
		if (!classes) return template;

		const temp = htmlToElement(template);
		classToClassList(classes as string, temp);

		return temp.outerHTML;
	}

	private concatObjectProperties<
		T extends ISelectOptions,
		U extends ISelectOptions,
	>(
		shared: T,
		other: U,
	): Partial<T & U> {
		const result: Partial<T & U> = {};
		const allKeys = new Set<keyof T | keyof U>([
			...Object.keys(shared || {}),
			...Object.keys(other || {}),
		] as Array<keyof T | keyof U>);

		allKeys.forEach((key) => {
			const sharedValue = shared[key as keyof T] || "";
			const otherValue = other[key as keyof U] || "";

			result[key as keyof T & keyof U] = `${sharedValue} ${otherValue}`
				.trim() as T[keyof T & keyof U] & U[keyof T & keyof U];
		});

		return result;
	}

	private updateTemplate(
		template: string,
		shared: ISelectOptions,
		specific: ISelectOptions,
	) {
		if (!shared) return template;

		const defaultOptions = JSON.parse(
			template.match(/data-hs-select='([^']+)'/)[1],
		);
		const concatOptions = this.concatObjectProperties(shared, specific);
		const mergedOptions = _.merge(defaultOptions, concatOptions);
		const updatedTemplate = template.replace(
			/data-hs-select='[^']+'/,
			`data-hs-select='${JSON.stringify(mergedOptions)}'`,
		);

		return updatedTemplate;
	}

	private initCustomTime(self: Calendar) {
		const { mainElement } = self.context;
		const timeParts = this.getTimeParts(self.selectedTime ?? "12:00 PM");
		const selectors = {
			hours: mainElement.querySelector(
				"[data-hs-select].--hours",
			) as HTMLElement,
			minutes: mainElement.querySelector(
				"[data-hs-select].--minutes",
			) as HTMLElement,
			meridiem: mainElement.querySelector(
				"[data-hs-select].--meridiem",
			) as HTMLElement,
		};

		Object.entries(selectors).forEach(([key, element]) => {
			if (!HSSelect.getInstance(element, true)) {
				const instance = new HSSelect(element);

				instance.setValue(
					timeParts[key === "meridiem" ? 2 : key === "minutes" ? 1 : 0],
				);
				instance.el.addEventListener("change.hs.select", (evt: CustomEvent) => {
					this.destroySelects(mainElement);
					const updatedTime = {
						hours: key === "hours" ? evt.detail.payload : timeParts[0],
						minutes: key === "minutes" ? evt.detail.payload : timeParts[1],
						meridiem: key === "meridiem" ? evt.detail.payload : timeParts[2],
					};

					self.set({
						selectedTime:
							`${updatedTime.hours}:${updatedTime.minutes} ${updatedTime.meridiem}`,
					}, {
						dates: false,
						year: false,
						month: false,
					});
				});
			}
		});
	}

	private initCustomMonths(self: Calendar) {
		const { mainElement } = self.context;
		const columns = Array.from(mainElement.querySelectorAll(".--single-month"));

		if (columns.length) {
			columns.forEach((column: HTMLElement, idx: number) => {
				const _month = column.querySelector(
					"[data-hs-select].--month",
				) as HTMLElement;
				const isInstanceExists = HSSelect.getInstance(_month, true);

				if (isInstanceExists) return false;

				const instance = new HSSelect(_month);
				const { month, year } = this.getCurrentMonthAndYear(column);

				instance.setValue(`${month}`);

				instance.el.addEventListener("change.hs.select", (evt: CustomEvent) => {
					this.destroySelects(mainElement);
					self.set({
						selectedMonth: (+evt.detail.payload - idx < 0
							? 11
							: +evt.detail.payload - idx) as Range<12>,
						selectedYear:
							(+evt.detail.payload - idx < 0 ? +year - 1 : year) as number,
					}, {
						dates: false,
						time: false,
					});
				});
			});
		}
	}

	private initCustomYears(self: Calendar) {
		const { mainElement } = self.context;
		const columns = Array.from(mainElement.querySelectorAll(".--single-month"));

		if (columns.length) {
			columns.forEach((column: HTMLElement) => {
				const _year = column.querySelector(
					"[data-hs-select].--year",
				) as HTMLElement;
				const isInstanceExists = HSSelect.getInstance(_year, true);

				if (isInstanceExists) return false;

				const instance = new HSSelect(_year);
				const { month, year } = this.getCurrentMonthAndYear(column);

				instance.setValue(`${year}`);

				instance.el.addEventListener("change.hs.select", (evt: CustomEvent) => {
					const { dateMax, displayMonthsCount } = this.vanillaCalendar.context;
					const maxYear = new Date(dateMax).getFullYear();
					const maxMonth = new Date(dateMax).getMonth();

					this.destroySelects(mainElement);
					self.set({
						selectedMonth: ((month > maxMonth - displayMonthsCount) &&
								+evt.detail.payload === maxYear
							? maxMonth - displayMonthsCount + 1
							: month) as Range<12>,
						selectedYear: evt.detail.payload,
					}, {
						dates: false,
						time: false,
					});
				});
			});
		}
	}

	private generateCustomTimeMarkup() {
		const customSelectOptions = this.updatedStyles?.customSelect;
		const hours = customSelectOptions
			? this.updateTemplate(
				templates.hours,
				customSelectOptions?.shared || {} as ISelectOptions,
				customSelectOptions?.hours || {} as ISelectOptions,
			)
			: templates.hours;
		const minutes = customSelectOptions
			? this.updateTemplate(
				templates.minutes,
				customSelectOptions?.shared || {} as ISelectOptions,
				customSelectOptions?.minutes || {} as ISelectOptions,
			)
			: templates.minutes;
		const meridiem = customSelectOptions
			? this.updateTemplate(
				templates.meridiem,
				customSelectOptions?.shared || {} as ISelectOptions,
				customSelectOptions?.meridiem || {} as ISelectOptions,
			)
			: templates.meridiem;
		const time = this?.dataOptions?.templates?.time ?? `
			<div class="pt-3 flex justify-center items-center gap-x-2">
        ${hours}
        <span class="text-gray-800 dark:text-white">:</span>
        ${minutes}
        ${meridiem}
      </div>
		`;

		return `<div class="--time">${time}</div>`;
	}

	private generateCustomMonthMarkup() {
		const mode = this?.dataOptions?.mode ?? "default";
		const customSelectOptions = this.updatedStyles?.customSelect;
		const updatedTemplate = customSelectOptions
			? this.updateTemplate(
				templates.months,
				customSelectOptions?.shared || {} as ISelectOptions,
				customSelectOptions?.months || {} as ISelectOptions,
			)
			: templates.months;
		const month = mode === "custom-select" ? updatedTemplate : "<#Month />";

		return month;
	}

	private generateCustomYearMarkup() {
		const mode = this?.dataOptions?.mode ?? "default";

		if (mode === "custom-select") {
			const today = new Date();
			const dateMin = this?.dataOptions?.dateMin ??
				today.toISOString().split("T")[0];
			const tempDateMax = this?.dataOptions?.dateMax ?? "2470-12-31";
			const dateMax = tempDateMax;
			const startDate = new Date(dateMin);
			const endDate = new Date(dateMax);
			const startDateYear = startDate.getFullYear();
			const endDateYear = endDate.getFullYear();
			const generateOptions = () => {
				let result = "";

				for (let i = startDateYear; i <= endDateYear; i++) {
					result += `<option value="${i}">${i}</option>`;
				}

				return result;
			};
			const years = templates.years(generateOptions());
			const customSelectOptions = this.updatedStyles?.customSelect;
			const updatedTemplate = customSelectOptions
				? this.updateTemplate(
					years,
					customSelectOptions?.shared || {} as ISelectOptions,
					customSelectOptions?.years || {} as ISelectOptions,
				)
				: years;

			return updatedTemplate;
		} else {
			return "<#Year />";
		}
	}

	private generateCustomArrowPrevMarkup() {
		const arrowPrev = this?.dataOptions?.templates?.arrowPrev
			? this.createArrowFromTemplate(
				this.dataOptions.templates.arrowPrev,
				this.updatedStyles.arrowPrev,
			)
			: "<#ArrowPrev [month] />";

		return arrowPrev;
	}

	private generateCustomArrowNextMarkup() {
		const arrowNext = this?.dataOptions?.templates?.arrowNext
			? this.createArrowFromTemplate(
				this.dataOptions.templates.arrowNext,
				this.updatedStyles.arrowNext,
			)
			: "<#ArrowNext [month] />";

		return arrowNext;
	}

	private parseCustomTime(template: string) {
		template = template.replace(
			/<#CustomTime\s*\/>/g,
			this.generateCustomTimeMarkup(),
		);

		return template;
	}

	private parseCustomMonth(template: string) {
		template = template.replace(
			/<#CustomMonth\s*\/>/g,
			this.generateCustomMonthMarkup(),
		);

		return template;
	}

	private parseCustomYear(template: string) {
		template = template.replace(
			/<#CustomYear\s*\/>/g,
			this.generateCustomYearMarkup(),
		);

		return template;
	}

	private parseArrowPrev(template: string) {
		template = template.replace(
			/<#CustomArrowPrev\s*\/>/g,
			this.generateCustomArrowPrevMarkup(),
		);

		return template;
	}

	private parseArrowNext(template: string) {
		template = template.replace(
			/<#CustomArrowNext\s*\/>/g,
			this.generateCustomArrowNextMarkup(),
		);

		return template;
	}

	private processCustomTemplate(
		template: string,
		type: "default" | "multiple",
	): string {
		const templateAccordingToType = type === "default"
			? this?.dataOptions?.layouts?.default
			: this?.dataOptions?.layouts?.multiple;
		const processedCustomMonth = this.parseCustomMonth(
			templateAccordingToType ?? template,
		);
		const processedCustomYear = this.parseCustomYear(processedCustomMonth);
		const processedCustomTime = this.parseCustomTime(processedCustomYear);
		const processedCustomArrowPrev = this.parseArrowPrev(processedCustomTime);
		const processedCustomTemplate = this.parseArrowNext(
			processedCustomArrowPrev,
		);

		return processedCustomTemplate;
	}

	private disableOptions() {
		const { mainElement, dateMax, displayMonthsCount } =
			this.vanillaCalendar.context;
		const maxDate = new Date(dateMax);
		const columns = Array.from(mainElement.querySelectorAll(".--single-month"));

		columns.forEach((column, idx) => {
			const year = +column.querySelector('[data-vc="year"]')?.getAttribute(
				"data-vc-year",
			)!;
			const monthOptions = column.querySelectorAll(
				"[data-hs-select].--month option",
			);
			const pseudoOptions = column.querySelectorAll(
				"[data-hs-select-dropdown] [data-value]",
			);
			const isDisabled = (option: HTMLOptionElement | HTMLElement) => {
				const value = +option.getAttribute("data-value")!;

				return value > maxDate.getMonth() - displayMonthsCount + idx + 1 &&
					year === maxDate.getFullYear();
			};

			Array.from(monthOptions).forEach((option: HTMLOptionElement) =>
				option.toggleAttribute("disabled", isDisabled(option))
			);
			Array.from(pseudoOptions).forEach((option: HTMLOptionElement) =>
				option.classList.toggle("disabled", isDisabled(option))
			);
		});
	}

	private disableNav() {
		const {
			mainElement,
			dateMax,
			selectedYear,
			selectedMonth,
			displayMonthsCount,
		} = this.vanillaCalendar.context;
		const maxYear = new Date(dateMax).getFullYear();
		const next = mainElement.querySelector(
			'[data-vc-arrow="next"]',
		) as HTMLElement;

		if (selectedYear === maxYear && selectedMonth + displayMonthsCount > 11) {
			next.style.visibility = "hidden";
		} else next.style.visibility = "";
	}

	private destroySelects(container: HTMLElement) {
		const selects = Array.from(container.querySelectorAll("[data-hs-select]"));

		selects.forEach((select: HTMLElement) => {
			const instance = HSSelect.getInstance(select, true) as ICollectionItem<
				HSSelect
			>;

			if (instance) instance.element.destroy();
		});
	}

	private updateSelect(el: HTMLElement, value: string) {
		const instance = HSSelect.getInstance(el, true) as ICollectionItem<
			HSSelect
		>;

		if (instance) instance.element.setValue(value);
	}

	private updateCalendar(calendar: HTMLElement) {
		const columns = calendar.querySelectorAll(".--single-month");

		if (columns.length) {
			columns.forEach((column: HTMLElement) => {
				const { month, year } = this.getCurrentMonthAndYear(column);

				this.updateSelect(
					column.querySelector("[data-hs-select].--month"),
					`${month}`,
				);
				this.updateSelect(
					column.querySelector("[data-hs-select].--year"),
					`${year}`,
				);
			});
		}
	}

	private updateCustomSelects(el: Calendar) {
		setTimeout(() => {
			this.disableOptions();
			this.disableNav();

			this.initCustomMonths(el);
			this.initCustomYears(el);
		});
	}

	// Public methods
	public getCurrentState() {
		return {
			selectedDates: this.vanillaCalendar.selectedDates,
			selectedTime: this.vanillaCalendar.selectedTime,
		};
	}

	public destroy() {
		if (this.vanillaCalendar) {
			this.vanillaCalendar.destroy();
			this.vanillaCalendar = null;
		}

		window.$hsDatepickerCollection = window.$hsDatepickerCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsDatepickerCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsDatepickerCollection) window.$hsDatepickerCollection = [];

		document
			.querySelectorAll(".hs-datepicker:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsDatepickerCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSDatepicker(el);
				}
			});
	}
}

declare global {
	interface Window {
		HSDatepicker: Function;
		$hsDatepickerCollection: ICollectionItem<HSDatepicker>[];
	}
}

window.addEventListener("load", () => {
	HSDatepicker.autoInit();

	// Uncomment for debug
	// console.log('Datepicker collection:', window.$hsDatepickerCollection);
});

if (typeof window !== "undefined") {
	window.HSDatepicker = HSDatepicker;
}

export default HSDatepicker;
