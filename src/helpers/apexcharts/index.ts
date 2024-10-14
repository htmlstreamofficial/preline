/*
 * @version: 2.5.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	IBuildTooltipHelperOptions,
	IChartProps,
	IChartPropsSeries,
	IChartDonutProps,
} from './interfaces';
import { EventWithProps } from '../types';

function buildTooltip(props: IChartProps, options: IBuildTooltipHelperOptions) {
	const {
		title,
		mode,
		valuePrefix = '$',
		isValueDivided = true,
		valuePostfix = '',
		hasTextLabel = false,
		invertGroup = false,
		labelDivider = '',
		wrapperClasses = 'ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700',
		wrapperExtClasses = '',
		seriesClasses = 'text-[12px]',
		seriesExtClasses = '',
		titleClasses = 'font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200',
		titleExtClasses = '',
		markerClasses = '!w-2.5 !h-2.5 !me-1.5',
		markerExtClasses = '!rounded-sm',
		valueClasses = '!font-medium text-gray-500 !ms-auto dark:text-neutral-400',
		valueExtClasses = '',
		labelClasses = 'text-gray-500 dark:text-neutral-400',
		labelExtClasses = '',
	} = options;
	const { dataPointIndex } = props;
	const { colors } = props.ctx.opts;
	const series = props.ctx.opts.series as IChartPropsSeries[];
	let seriesGroups = '';

	series.forEach((single, i) => {
		const val =
			props.series[i][dataPointIndex] ||
			(typeof series[i].data[dataPointIndex] !== 'object'
				? series[i].data[dataPointIndex]
				: props.series[i][dataPointIndex]);
		const label = series[i].name;
		const groupData = invertGroup
			? {
					left: `${hasTextLabel ? label : ''}${labelDivider}`,
					right: `${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}`,
				}
			: {
					left: `${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}`,
					right: `${hasTextLabel ? label : ''}${labelDivider}`,
				};
		const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${groupData.left}</span>`;

		seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${hasTextLabel ? '!justify-between' : ''} order-${i + 1} ${seriesClasses} ${seriesExtClasses}">
      <span class="flex items-center">
        <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${colors[i]}"></span>
        <div class="apexcharts-tooltip-text">
          <div class="apexcharts-tooltip-y-group !py-0.5">
            <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${groupData.right}</span>
          </div>
        </div>
      </span>
      ${labelMarkup}
    </div>`;
	});

	return `<div class="${mode === 'dark' ? 'dark ' : ''}${wrapperClasses} ${wrapperExtClasses}">
    <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">${title}</div>
    ${seriesGroups}
  </div>`;
}

function buildTooltipCompareTwo(
	props: IChartProps,
	options: IBuildTooltipHelperOptions,
) {
	const { dataPointIndex } = props;
	const { categories } = props.ctx.opts.xaxis;
	const { colors } = props.ctx.opts;
	const series = props.ctx.opts.series as IChartPropsSeries[];

	const {
		title,
		mode,
		valuePrefix = '$',
		isValueDivided = true,
		valuePostfix = '',
		hasCategory = true,
		hasTextLabel = false,
		labelDivider = '',
		wrapperClasses = 'ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700',
		wrapperExtClasses = '',
		seriesClasses = '!justify-between w-full text-[12px]',
		seriesExtClasses = '',
		titleClasses = 'flex justify-between font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200',
		titleExtClasses = '',
		markerClasses = '!w-2.5 !h-2.5 !me-1.5',
		markerExtClasses = '!rounded-sm',
		valueClasses = '!font-medium text-gray-500 !ms-auto dark:text-neutral-400',
		valueExtClasses = '',
		labelClasses = 'text-gray-500 dark:text-neutral-400 ms-2',
		labelExtClasses = '',
	} = options;

	let seriesGroups = '';
	const s0 = series[0].data[dataPointIndex];
	const s1 = series[1].data[dataPointIndex];
	const category = categories[dataPointIndex].split(' ');
	const newCategory = hasCategory
		? `${category[0]}${category[1] ? ' ' : ''}${category[1] ? category[1].slice(0, 3) : ''}`
		: '';
	const isGrowing = s0 > s1;
	const isDifferenceIsNull = s0 / s1 === 1;
	const difference = isDifferenceIsNull ? 0 : (s0 / s1) * 100;
	const icon = isGrowing
		? `<svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`
		: `<svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>`;

	series.forEach((_, i) => {
		const val =
			props.series[i][dataPointIndex] ||
			(typeof series[i].data[dataPointIndex] !== 'object'
				? series[i].data[dataPointIndex]
				: props.series[i][dataPointIndex]);
		const label = series[i].name;
		const altValue = series[i].altValue || null;
		const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${newCategory} ${label || ''}</span>`;
		const valueMarkup =
			altValue ||
			`<span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}${labelDivider}</span>`;

		seriesGroups += `<div class="apexcharts-tooltip-series-group ${seriesClasses} !flex order-${i + 1} ${seriesExtClasses}">
      <span class="flex items-center">
        <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${colors[i]}"></span>
        <div class="apexcharts-tooltip-text">
          <div class="apexcharts-tooltip-y-group !py-0.5">
            ${valueMarkup}
          </div>
        </div>
      </span>
      ${hasTextLabel ? labelMarkup : ''}
    </div>`;
	});

	return `<div class="${mode === 'dark' ? 'dark ' : ''}${wrapperClasses} ${wrapperExtClasses}">
    <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">
      <span>${title}</span>
      <span class="flex items-center gap-x-1 ${!isDifferenceIsNull ? (isGrowing ? 'text-green-600' : 'text-red-600') : ''} ms-2">
        ${!isDifferenceIsNull ? icon : ''}
        <span class="inline-block text-sm">
          ${difference.toFixed(1)}%
        </span>
      </span>
    </div>
    ${seriesGroups}
  </div>`;
}

function buildTooltipCompareTwoAlt(
	props: IChartProps,
	options: IBuildTooltipHelperOptions,
) {
	const { dataPointIndex } = props;
	const { categories } = props.ctx.opts.xaxis;
	const { colors } = props.ctx.opts;
	const series = props.ctx.opts.series as IChartPropsSeries[];

	const {
		title,
		mode,
		valuePrefix = '$',
		isValueDivided = true,
		valuePostfix = '',
		hasCategory = true,
		hasTextLabel = false,
		labelDivider = '',
		wrapperClasses = 'ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700',
		wrapperExtClasses = '',
		seriesClasses = '!justify-between w-full text-[12px]',
		seriesExtClasses = '',
		titleClasses = 'flex justify-between font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200',
		titleExtClasses = '',
		markerClasses = '!w-2.5 !h-2.5 !me-1.5',
		markerExtClasses = '!rounded-sm',
		valueClasses = '!font-medium text-gray-500 !ms-auto dark:text-neutral-400',
		valueExtClasses = '',
		labelClasses = 'text-gray-500 dark:text-neutral-400 ms-2',
		labelExtClasses = '',
	} = options;

	let seriesGroups = '';
	const s0 = series[0].data[dataPointIndex];
	const s1 = series[1].data[dataPointIndex];
	const category = categories[dataPointIndex].split(' ');
	const newCategory = hasCategory
		? `${category[0]}${category[1] ? ' ' : ''}${category[1] ? category[1].slice(0, 3) : ''}`
		: '';
	const isGrowing = s0 > s1;
	const isDifferenceIsNull = s0 / s1 === 1;
	const difference = isDifferenceIsNull ? 0 : (s0 / s1) * 100;
	const icon = isGrowing
		? `<svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`
		: `<svg class="inline-block size-4 self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>`;

	series.forEach((single, i) => {
		const val =
			props.series[i][dataPointIndex] ||
			(typeof series[i].data[dataPointIndex] !== 'object'
				? series[i].data[dataPointIndex]
				: props.series[i][dataPointIndex]);
		const label = series[i].name;
		const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}</span>`;

		seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${seriesClasses} order-${i + 1} ${seriesExtClasses}">
      <span class="flex items-center">
        <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${colors[i]}"></span>
        <div class="apexcharts-tooltip-text text-[12px]">
          <div class="apexcharts-tooltip-y-group !py-0.5">
            <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${newCategory} ${label || ''}${labelDivider}</span>
          </div>
        </div>
      </span>
      ${hasTextLabel ? labelMarkup : ''}
    </div>`;
	});

	return `<div class="${mode === 'dark' ? 'dark ' : ''}${wrapperClasses} ${wrapperExtClasses}">
    <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">
      <span>${title}</span>
      <span class="flex items-center gap-x-1 ${!isDifferenceIsNull ? (isGrowing ? 'text-green-600' : 'text-red-600') : ''} ms-2">
        ${!isDifferenceIsNull ? icon : ''}
        <span class="inline-block text-sm">
          ${difference.toFixed(1)}%
        </span>
      </span>
    </div>
    ${seriesGroups}
  </div>`;
}

function buildTooltipForDonut(
	{ series, seriesIndex, w }: IChartDonutProps,
	textColor: string[],
) {
	const { globals } = w;
	const { colors } = globals;

	return `<div class="apexcharts-tooltip-series-group" style="background-color: ${colors[seriesIndex]}; display: block;">
    <div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
      <div class="apexcharts-tooltip-y-group" style="color: ${textColor[seriesIndex]}">
        <span class="apexcharts-tooltip-text-y-label">${globals.labels[seriesIndex]}: </span>
        <span class="apexcharts-tooltip-text-y-value">${series[seriesIndex]}</span>
      </div>
    </div>
  </div>`;
}

function buildChart(id: string, shared: Function, light: string, dark: string) {
	const $chart = document.querySelector(id);
	let chart: any = null;

	if (!$chart) return false;

	const tabpanel = $chart.closest('[role="tabpanel"]');
	let modeFromBodyClass: string | null = null;

	Array.from(document.querySelector('html').classList).forEach((cl) => {
		if (['dark', 'light', 'default'].includes(cl)) modeFromBodyClass = cl;
	});

	const optionsFn = (
		mode = modeFromBodyClass || localStorage.getItem('hs_theme'),
	) => window._.merge(shared(mode), mode === 'dark' ? dark : light);

	if ($chart) {
		chart = new ApexCharts($chart, optionsFn());
		chart.render();

		window.addEventListener('on-hs-appearance-change', (evt: EventWithProps) =>
			chart.updateOptions(optionsFn(evt.detail)),
		);

		if (tabpanel)
			tabpanel.addEventListener(
				'on-hs-appearance-change',
				(evt: EventWithProps) => chart.updateOptions(optionsFn(evt.detail)),
			);
	}

	return chart;
}

export {
	buildTooltip,
	buildTooltipCompareTwo,
	buildTooltipCompareTwoAlt,
	buildTooltipForDonut,
	buildChart,
};
