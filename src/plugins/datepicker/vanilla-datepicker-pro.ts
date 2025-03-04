import { Calendar } from "vanilla-calendar-pro";
import { Options, Reset, Styles } from "vanilla-calendar-pro/types";

class CustomVanillaCalendar extends Calendar {
	constructor(selector: HTMLElement | string, options?: Partial<Options>) {
		super(selector, options);

		const parentSet = this.set;

		this.set = (options: Options, resetOptions?: Partial<Reset>) => {
			if (parentSet) parentSet.call(this, options, resetOptions);

			if (options.selectedTime && this.onChangeTime) {
				this.onChangeTime(this, null, true);
			}
			if (options.selectedMonth && this.onClickMonth) {
				this.onClickMonth(this, null);
			}
			if (options.selectedYear && this.onClickYear) {
				this.onClickYear(this, null);
			}
		};
	}

	static get defaultStyles() {
		return {
			calendar: "vc",
			controls: "vc-controls",
			grid: "vc-grid",
			column: "vc-column",
			header: "vc-header",
			headerContent: "vc-header__content",
			month: "vc-month",
			year: "vc-year",
			arrowPrev: "vc-arrow vc-arrow_prev",
			arrowNext: "vc-arrow vc-arrow_next",
			wrapper: "vc-wrapper",
			content: "vc-content",
			months: "vc-months",
			monthsMonth: "vc-months__month",
			years: "vc-years",
			yearsYear: "vc-years__year",
			week: "vc-week",
			weekDay: "vc-week__day",
			weekNumbers: "vc-week-numbers",
			weekNumbersTitle: "vc-week-numbers__title",
			weekNumbersContent: "vc-week-numbers__content",
			weekNumber: "vc-week-number",
			dates: "vc-dates",
			date: "vc-date",
			dateBtn: "vc-date__btn",
			datePopup: "vc-date__popup",
			dateRangeTooltip: "vc-date-range-tooltip",
			time: "vc-time",
			timeContent: "vc-time__content",
			timeHour: "vc-time__hour",
			timeMinute: "vc-time__minute",
			timeKeeping: "vc-time__keeping",
			timeRanges: "vc-time__ranges",
			timeRange: "vc-time__range",
		};
	}

	public logInfo() {
		console.log("This log is from CustomVanillaCalendar!", this);
	}
}

export default CustomVanillaCalendar;
