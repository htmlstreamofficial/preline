import ApexCharts from 'apexcharts';
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
	series: [
	][];
	ctx: {
		opts: ApexCharts.ApexOptions;
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
		globals: ApexCharts.ApexOptions;
	};
}
export declare function buildTooltip(props: IChartProps, options: IBuildTooltipHelperOptions): string;
export declare function buildHeatmapTooltip(props: IChartProps, options: IBuildTooltipHelperSingleOptions): string;
export declare function buildTooltipCompareTwo(props: IChartProps, options: IBuildTooltipHelperOptions): string;
export declare function buildTooltipCompareTwoAlt(props: IChartProps, options: IBuildTooltipHelperOptions): string;
export declare function buildTooltipForDonut({ series, seriesIndex, w }: IChartDonutProps, textColor: string[]): string;
export declare function buildChart(id: string, shared: Function, light: string, dark: string): any;
export declare function fullBarHoverEffect(chartCtx: ApexCharts & {
	el: HTMLElement;
	w: {
		config: {
			xaxis?: {
				categories?: any[];
			};
		};
	};
}, { shadowClasses, }?: {
	shadowClasses?: string;
}): void;

export {};
