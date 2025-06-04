import { ApexOptions } from 'apexcharts';

export interface IBuildTooltipHelperOptions {
	title: string;
	mode: string;
	valuePrefix: string;
	isValueDivided: boolean;
	valuePostfix: string;
	hasTextLabel: boolean;
	invertGroup: boolean;
	labelDivider: string;
	wrapperClasses: string;
	wrapperExtClasses: string;
	seriesClasses: string;
	seriesExtClasses: string;
	titleClasses: string;
	titleExtClasses: string;
	markerClasses: string;
	markerExtClasses: string;
	valueClasses: string;
	valueExtClasses: string;
	labelClasses: string;
	labelExtClasses: string;
	hasCategory?: boolean;
	thousandsShortName?: string;
}

export interface IBuildTooltipHelperSingleOptions {
	mode: string;
	valuePrefix: string;
	valuePostfix: string;
	divider: string;
	wrapperClasses: string;
	wrapperExtClasses: string;
	markerClasses: string;
	markerStyles: string;
	markerExtClasses: string;
	valueClasses: string;
	valueExtClasses: string;
}

export interface IChartProps {
	dataPointIndex: number;
	seriesIndex: number;
	series: [][];
	ctx: {
		opts: ApexOptions;
	};
}

export interface IChartPropsSeries {
	name: string;
	altValue?: string;
	data: number[];
}

export interface IChartDonutProps {
	series: IChartPropsSeries[];
	seriesIndex: number;
	w: {
		globals: ApexOptions;
	};
}
