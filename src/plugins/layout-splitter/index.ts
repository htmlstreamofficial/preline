/*
 * HSLayoutSplitter
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */
import { isJson, classToClassList, htmlToElement, dispatch } from '../../utils';

import {
	ILayoutSplitterOptions,
	ILayoutSplitter,
	ISingleLayoutSplitter,
	IControlLayoutSplitter,
} from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSLayoutSplitter
	extends HSBasePlugin<ILayoutSplitterOptions>
	implements ILayoutSplitter {
	static isListenersInitialized = false;

	private readonly horizontalSplitterClasses: string | null;
	private readonly horizontalSplitterTemplate: string;
	private readonly verticalSplitterClasses: string | null;
	private readonly verticalSplitterTemplate: string;
	private readonly isSplittersAddedManually: boolean;

	private horizontalSplitters: ISingleLayoutSplitter[];
	private horizontalControls: IControlLayoutSplitter[];
	private verticalSplitters: ISingleLayoutSplitter[];
	private verticalControls: IControlLayoutSplitter[];

	isDragging: boolean;
	activeSplitter: IControlLayoutSplitter | null;

	private onControlPointerDownListener:
		| {
			el: HTMLElement;
			fn: () => void;
		}[]
		| null;

	constructor(el: HTMLElement, options?: ILayoutSplitterOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-layout-splitter');
		const dataOptions: ILayoutSplitterOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.horizontalSplitterClasses =
			concatOptions?.horizontalSplitterClasses || null;
		this.horizontalSplitterTemplate =
			concatOptions?.horizontalSplitterTemplate || '<div></div>';
		this.verticalSplitterClasses =
			concatOptions?.verticalSplitterClasses || null;
		this.verticalSplitterTemplate =
			concatOptions?.verticalSplitterTemplate || '<div></div>';
		this.isSplittersAddedManually = concatOptions?.isSplittersAddedManually ?? false;

		this.horizontalSplitters = [];
		this.horizontalControls = [];
		this.verticalSplitters = [];
		this.verticalControls = [];

		this.isDragging = false;
		this.activeSplitter = null;

		this.onControlPointerDownListener = [];

		this.init();
	}

	private controlPointerDown(item: IControlLayoutSplitter) {
		this.isDragging = true;
		this.activeSplitter = item;

		this.onPointerDownHandler(item);
	}

	private controlPointerUp() {
		this.isDragging = false;
		this.activeSplitter = null;

		this.onPointerUpHandler();
	}

	private static onDocumentPointerMove = (evt: PointerEvent) => {
		const draggingElement = document.querySelector(
			'.hs-layout-splitter-control.dragging',
		);
		if (!draggingElement) return;

		const draggingInstance = HSLayoutSplitter.getInstance(
			draggingElement.closest('[data-hs-layout-splitter]') as HTMLElement,
			true,
		) as ICollectionItem<HSLayoutSplitter>;

		if (!draggingInstance || !draggingInstance.element.isDragging) return;

		const activeSplitter = draggingInstance.element.activeSplitter;
		if (!activeSplitter) return;

		if (activeSplitter.direction === 'vertical')
			draggingInstance.element.onPointerMoveHandler(
				evt,
				activeSplitter,
				'vertical'
			);
		else
			draggingInstance.element.onPointerMoveHandler(
				evt,
				activeSplitter,
				'horizontal'
			);
	};

	private static onDocumentPointerUp = () => {
		const draggingElement = document.querySelector(
			'.hs-layout-splitter-control.dragging',
		);
		if (!draggingElement) return;

		const draggingInstance = HSLayoutSplitter.getInstance(
			draggingElement.closest('[data-hs-layout-splitter]') as HTMLElement,
			true,
		) as ICollectionItem<HSLayoutSplitter>;

		if (draggingInstance) draggingInstance.element.controlPointerUp();
	};

	private init() {
		this.createCollection(window.$hsLayoutSplitterCollection, this);
		this.buildSplitters();

		if (!HSLayoutSplitter.isListenersInitialized) {
			document.addEventListener(
				'pointermove',
				HSLayoutSplitter.onDocumentPointerMove,
			);

			document.addEventListener(
				'pointerup',
				HSLayoutSplitter.onDocumentPointerUp,
			);

			HSLayoutSplitter.isListenersInitialized = true;
		}
	}

	private buildSplitters() {
		this.buildHorizontalSplitters();
		this.buildVerticalSplitters();
	}

	private buildHorizontalSplitters() {
		const groups = this.el.querySelectorAll(
			'[data-hs-layout-splitter-horizontal-group]',
		);

		if (groups.length) {
			groups.forEach((el: HTMLElement) => {
				this.horizontalSplitters.push({
					el,
					items: Array.from(
						el.querySelectorAll(':scope > [data-hs-layout-splitter-item]'),
					),
				});
			});

			this.updateHorizontalSplitter();
		}
	}

	private buildVerticalSplitters() {
		const groups = this.el.querySelectorAll(
			'[data-hs-layout-splitter-vertical-group]',
		);

		if (groups.length) {
			groups.forEach((el: HTMLElement) => {
				this.verticalSplitters.push({
					el,
					items: Array.from(
						el.querySelectorAll(':scope > [data-hs-layout-splitter-item]'),
					),
				});
			});

			this.updateVerticalSplitter();
		}
	}

	private buildControl(
		prev: HTMLElement | null,
		next: HTMLElement | null,
		direction: 'horizontal' | 'vertical' = 'horizontal',
	) {
		let el;

		if (this.isSplittersAddedManually) {
			el = next?.previousElementSibling as HTMLElement;

			if (!el) return false;

			el.style.display = '';
		} else {
			el = htmlToElement(direction === 'horizontal' ? this.horizontalSplitterTemplate : this.verticalSplitterTemplate) as HTMLElement;
			classToClassList(direction === 'horizontal' ? this.horizontalSplitterClasses : this.verticalSplitterClasses, el);
			el.classList.add('hs-layout-splitter-control');
		}

		const item = { el, direction, prev, next };

		if (direction === 'horizontal') this.horizontalControls.push(item);
		else this.verticalControls.push(item);

		this.bindListeners(item);

		if (next && !this.isSplittersAddedManually) prev.insertAdjacentElement('afterend', el);
	}

	private getSplitterItemParsedParam(item: HTMLElement) {
		const param = item.getAttribute('data-hs-layout-splitter-item');

		return isJson(param) ? JSON.parse(param) : param;
	}

	private getContainerSize(container: Element, isHorizontal: boolean): number {
		return isHorizontal ? container.getBoundingClientRect().width : container.getBoundingClientRect().height;
	}

	private getMaxFlexSize(element: HTMLElement, param: string, totalWidth: number): number {
		const paramValue = this.getSplitterItemSingleParam(element, param);

		return typeof paramValue === 'number' ? (paramValue / 100) * totalWidth : 0;
	}

	private updateHorizontalSplitter() {
		this.horizontalSplitters.forEach(({ items }) => {
			items.forEach((el: HTMLElement) => {
				this.updateSingleSplitter(el);
			});

			items.forEach((el: HTMLElement, index: number) => {
				if (index >= items.length - 1) this.buildControl(el, null);
				else this.buildControl(el, items[index + 1]);
			});
		});
	}

	private updateSingleSplitter(el: HTMLElement) {
		const param = el.getAttribute('data-hs-layout-splitter-item');
		const parsedParam = isJson(param) ? JSON.parse(param) : param;
		const width = isJson(param) ? parsedParam.dynamicSize : param;
		el.style.flex = `${width} 1 0`;
	}

	private updateVerticalSplitter() {
		this.verticalSplitters.forEach(({ items }) => {
			items.forEach((el: HTMLElement) => {
				this.updateSingleSplitter(el);
			});

			items.forEach((el: HTMLElement, index: number) => {
				if (index >= items.length - 1) this.buildControl(el, null, 'vertical');
				else this.buildControl(el, items[index + 1], 'vertical');
			});
		});
	}

	private updateSplitterItemParam(item: HTMLElement, newSize: number) {
		const param = this.getSplitterItemParsedParam(item);
		const newSizeFixed = newSize.toFixed(1);
		const newParam = typeof param === 'object' ? JSON.stringify({
			...param,
			dynamicSize: +newSizeFixed,
		}) : newSizeFixed;

		item.setAttribute(
			'data-hs-layout-splitter-item',
			newParam,
		);
	}

	private onPointerDownHandler(item: IControlLayoutSplitter) {
		const { el, prev, next } = item;

		el.classList.add('dragging');
		prev.classList.add('dragging');
		next.classList.add('dragging');
		document.body.style.userSelect = 'none';
	}

	private onPointerUpHandler() {
		document.body.style.userSelect = '';
	}

	private onPointerMoveHandler(
		evt: PointerEvent,
		item: IControlLayoutSplitter,
		direction: 'horizontal' | 'vertical'
	) {
		const { prev, next } = item;
		const container = item.el.closest(
			direction === 'horizontal'
				? '[data-hs-layout-splitter-horizontal-group]'
				: '[data-hs-layout-splitter-vertical-group]'
		);
		const isHorizontal = direction === 'horizontal';
		const totalSize = this.getContainerSize(container, isHorizontal);
		const availableSize = this.calculateAvailableSize(container, prev, next, isHorizontal, totalSize);

		const sizes = this.calculateResizedSizes(evt, prev, availableSize, isHorizontal);
		const adjustedSizes = this.enforceLimits(sizes, prev, next, totalSize, availableSize);

		this.applySizes(prev, next, adjustedSizes, totalSize);
	}

	private bindListeners(item: IControlLayoutSplitter) {
		const { el } = item;

		this.onControlPointerDownListener.push({
			el,
			fn: () => this.controlPointerDown(item),
		});

		el.addEventListener(
			'pointerdown',
			this.onControlPointerDownListener.find((control) => control.el === el).fn,
		);
	}

	private calculateAvailableSize(
		container: Element,
		prev: HTMLElement,
		next: HTMLElement,
		isHorizontal: boolean,
		totalSize: number
	): number {
		const items = container.querySelectorAll(':scope > [data-hs-layout-splitter-item]');
		const otherSize = Array.from(items).reduce((sum, item) => {
			if (item === prev || item === next) return sum;

			const rect = item.getBoundingClientRect();
			// TODO:: Test
			const computedStyle = window.getComputedStyle(item);

			return sum + (computedStyle.position === 'fixed' ? 0 : (isHorizontal ? rect.width : rect.height));
		}, 0);

		return totalSize - otherSize;
	}

	private calculateResizedSizes(
		evt: PointerEvent,
		prev: HTMLElement,
		availableSize: number,
		isHorizontal: boolean
	): {
		previousSize: number;
		nextSize: number
	} {
		const prevStart = isHorizontal ? prev.getBoundingClientRect().left : prev.getBoundingClientRect().top;
		let previousSize = Math.max(0, Math.min((isHorizontal ? evt.clientX : evt.clientY) - prevStart, availableSize));
		let nextSize = availableSize - previousSize;

		return { previousSize, nextSize };
	}

	private enforceLimits(
		sizes: {
			previousSize: number;
			nextSize: number
		},
		prev: HTMLElement,
		next: HTMLElement,
		totalSize: number,
		availableSize: number
	): {
		previousSize: number;
		nextSize: number;
	} {
		const prevMinSize = this.getMaxFlexSize(prev, 'minSize', totalSize);
		const nextMinSize = this.getMaxFlexSize(next, 'minSize', totalSize);
		const prevPreLimitSize = this.getMaxFlexSize(prev, 'preLimitSize', totalSize);
		const nextPreLimitSize = this.getMaxFlexSize(next, 'preLimitSize', totalSize);

		let { previousSize, nextSize } = sizes;

		if (nextSize < nextMinSize) {
			nextSize = nextMinSize;
			previousSize = availableSize - nextSize;
		} else if (previousSize < prevMinSize) {
			previousSize = prevMinSize;
			nextSize = availableSize - previousSize;
		}

		const payload = {
			prev,
			next,
			previousSize: previousSize.toFixed(),
			previousFlexSize: (previousSize / totalSize) * 100,
			previousPreLimitSize: prevPreLimitSize,
			previousPreLimitFlexSize: (prevPreLimitSize / totalSize) * 100,
			previousMinSize: prevMinSize,
			previousMinFlexSize: (prevMinSize / totalSize) * 100,
			nextSize: nextSize.toFixed(),
			nextFlexSize: (nextSize / totalSize) * 100,
			nextPreLimitSize: nextPreLimitSize,
			nextPreLimitFlexSize: (nextPreLimitSize / totalSize) * 100,
			nextMinSize: nextMinSize,
			nextMinFlexSize: (nextMinSize / totalSize) * 100,
			static: {
				prev: {
					minSize: this.getSplitterItemSingleParam(prev, 'minSize'),
					preLimitSize: this.getSplitterItemSingleParam(prev, 'preLimitSize')
				},
				next: {
					minSize: this.getSplitterItemSingleParam(next, 'minSize'),
					preLimitSize: this.getSplitterItemSingleParam(next, 'preLimitSize')
				}
			}
		};

		if (nextSize < nextMinSize) {
			this.fireEvent('onNextLimit', payload);
			dispatch('onNextLimit.hs.layoutSplitter', this.el, payload);
		} else if (previousSize < prevMinSize) {
			this.fireEvent('onPrevLimit', payload);
			dispatch('onPrevLimit.hs.layoutSplitter', this.el, payload);
		}

		if (previousSize <= prevPreLimitSize) {
			this.fireEvent('onPrevPreLimit', payload);
			dispatch('onPrevPreLimit.hs.layoutSplitter', this.el, payload);
		}
		if (nextSize <= nextPreLimitSize) {
			this.fireEvent('onNextPreLimit', payload);
			dispatch('onNextPreLimit.hs.layoutSplitter', this.el, payload);
		}

		this.fireEvent('drag', payload);
		dispatch('drag.hs.layoutSplitter', this.el, payload);

		return { previousSize, nextSize };
	}

	private applySizes(
		prev: HTMLElement,
		next: HTMLElement,
		sizes: {
			previousSize: number;
			nextSize: number
		},
		totalSize: number
	) {
		const { previousSize, nextSize } = sizes;

		const prevPercent = (previousSize / totalSize) * 100;
		this.updateSplitterItemParam(prev, prevPercent);
		prev.style.flex = `${prevPercent.toFixed(1)} 1 0`;

		const nextPercent = (nextSize / totalSize) * 100;
		this.updateSplitterItemParam(next, nextPercent);
		next.style.flex = `${nextPercent.toFixed(1)} 1 0`;
	}

	// Public methods
	public getSplitterItemSingleParam(item: HTMLElement, name: string) {
		try {
			const param = this.getSplitterItemParsedParam(item);

			return param[name];
		} catch {
			console.log('There is no parameter with this name in the object.');

			return false;
		}
	}

	public getData(el: HTMLElement): any {
		const container = el.closest('[data-hs-layout-splitter-horizontal-group], [data-hs-layout-splitter-vertical-group]');

		if (!container) {
			throw new Error('Element is not inside a valid layout splitter container.');
		}

		const isHorizontal = container.matches('[data-hs-layout-splitter-horizontal-group]');
		const totalSize = this.getContainerSize(container, isHorizontal);

		const dynamicFlexSize = this.getSplitterItemSingleParam(el, 'dynamicSize') || 0;
		const minSize = this.getMaxFlexSize(el, 'minSize', totalSize);
		const preLimitSize = this.getMaxFlexSize(el, 'preLimitSize', totalSize);

		const dynamicSize = (dynamicFlexSize / 100) * totalSize;

		const minFlexSize = (minSize / totalSize) * 100;
		const preLimitFlexSize = (preLimitSize / totalSize) * 100;

		return {
			el,

			dynamicSize: +dynamicSize.toFixed(),
			dynamicFlexSize,

			minSize: +minSize.toFixed(),
			minFlexSize,

			preLimitSize: +preLimitSize.toFixed(),
			preLimitFlexSize,

			static: {
				minSize: this.getSplitterItemSingleParam(el, 'minSize') ?? null,
				preLimitSize: this.getSplitterItemSingleParam(el, 'preLimitSize') ?? null
			}
		};
	}

	public setSplitterItemSize(el: HTMLElement, size: number) {
		this.updateSplitterItemParam(el, size);
		el.style.flex = `${size.toFixed(1)} 1 0`;
	}

	public updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void {
		let totalFlex = 0;
		const currentWidth = window.innerWidth;
		const getBreakpointValue = (breakpoints: Record<number, number>): number => {
			const sortedBreakpoints = Object.keys(breakpoints)
				.map(Number)
				.sort((a, b) => a - b);

			for (let i = sortedBreakpoints.length - 1; i >= 0; i--) {
				if (currentWidth >= sortedBreakpoints[i]) {
					return breakpoints[sortedBreakpoints[i]];
				}
			}

			return 0;
		};

		data.forEach(({ id, breakpoints }) => {
			const item = document.getElementById(id);

			if (item) {
				const flexValue = getBreakpointValue(breakpoints);

				this.updateSplitterItemParam(item, flexValue);
				item.style.flex = `${flexValue.toFixed(1)} 1 0`;

				totalFlex += flexValue;
			}
		});

		if (totalFlex !== 100) {
			const scaleFactor = 100 / totalFlex;

			data.forEach(({ id }) => {
				const item = document.getElementById(id);

				if (item) {
					const currentFlex = parseFloat(item.style.flex.split(" ")[0]);
					const adjustedFlex = currentFlex * scaleFactor;

					this.updateSplitterItemParam(item, adjustedFlex);
					item.style.flex = `${adjustedFlex.toFixed(1)} 1 0`;
				}
			});
		}
	}

	public destroy() {
		if (this.onControlPointerDownListener) {
			this.onControlPointerDownListener.forEach(({ el, fn }) => {
				el.removeEventListener('pointerdown', fn);
			});
			this.onControlPointerDownListener = null;
		}

		this.horizontalSplitters.forEach(({ items }) => {
			items.forEach((el: HTMLElement) => {
				el.style.flex = '';
			});
		});

		this.verticalSplitters.forEach(({ items }) => {
			items.forEach((el: HTMLElement) => {
				el.style.flex = '';
			});
		});

		this.horizontalControls.forEach(({ el }) => {
			if (this.isSplittersAddedManually) el.style.display = 'none';
			else el.remove();
		});
		this.verticalControls.forEach(({ el }) => {
			if (this.isSplittersAddedManually) el.style.display = 'none';
			else el.remove();
		});

		this.horizontalControls = [];
		this.verticalControls = [];

		window.$hsLayoutSplitterCollection =
			window.$hsLayoutSplitterCollection.filter(
				({ element }) => element.el !== this.el,
			);

		if (
			window.$hsLayoutSplitterCollection.length === 0 &&
			HSLayoutSplitter.isListenersInitialized
		) {
			document.removeEventListener(
				'pointermove',
				HSLayoutSplitter.onDocumentPointerMove,
			);
			document.removeEventListener(
				'pointerup',
				HSLayoutSplitter.onDocumentPointerUp,
			);
			HSLayoutSplitter.isListenersInitialized = false;
		}
	}

	// Static method
	static autoInit() {
		if (!window.$hsLayoutSplitterCollection) {
			window.$hsLayoutSplitterCollection = [];

			window.addEventListener('pointerup', () => {
				if (!window.$hsLayoutSplitterCollection) return false;

				const draggingElement = document.querySelector(
					'.hs-layout-splitter-control.dragging',
				);
				const draggingSections = document.querySelectorAll(
					'[data-hs-layout-splitter-item].dragging',
				);

				if (!draggingElement) return false;

				const draggingInstance = HSLayoutSplitter.getInstance(
					draggingElement.closest('[data-hs-layout-splitter]') as HTMLElement,
					true,
				) as ICollectionItem<HSLayoutSplitter>;

				draggingElement.classList.remove('dragging');
				draggingSections.forEach((el) => el.classList.remove('dragging'));
				draggingInstance.element.isDragging = false;
			});
		}

		if (window.$hsLayoutSplitterCollection)
			window.$hsLayoutSplitterCollection =
				window.$hsLayoutSplitterCollection.filter(({ element }) =>
					document.contains(element.el),
				);

		document
			.querySelectorAll(
				'[data-hs-layout-splitter]:not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsLayoutSplitterCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSLayoutSplitter(el);
			});
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsLayoutSplitterCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsLayoutSplitterCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSLayoutSplitter: Function;
		$hsLayoutSplitterCollection: ICollectionItem<HSLayoutSplitter>[];
	}
}

window.addEventListener('load', () => {
	HSLayoutSplitter.autoInit();

	// Uncomment for debug
	// console.log('Layout splitter collection:', window.$hsLayoutSplitterCollection);
});

if (typeof window !== 'undefined') {
	window.HSLayoutSplitter = HSLayoutSplitter;
}

export default HSLayoutSplitter;
