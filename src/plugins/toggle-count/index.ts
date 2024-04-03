/*
 * HSToggleCount
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { IToggleCountOptions, IToggleCount } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSToggleCount
	extends HSBasePlugin<IToggleCountOptions>
	implements IToggleCount
{
	private readonly target: HTMLInputElement | null;
	private readonly min: number | null;
	private readonly max: number | null;
	private readonly duration: number | null;
	private isChecked: boolean;

	constructor(el: HTMLElement, options?: IToggleCountOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-toggle-count');
		const dataOptions: IToggleCountOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.target = concatOptions?.target
			? typeof concatOptions?.target === 'string'
				? (document.querySelector(concatOptions.target) as HTMLInputElement)
				: concatOptions.target
			: null;
		this.min = concatOptions?.min || 0;
		this.max = concatOptions?.max || 0;
		this.duration = concatOptions?.duration || 700;

		this.isChecked = (this.target as HTMLInputElement).checked || false;

		if (this.target) this.init();
	}

	private init() {
		this.createCollection(window.$hsToggleCountCollection, this);

		if (this.isChecked) this.el.innerText = String(this.max);

		this.target.addEventListener('change', () => {
			this.isChecked = !this.isChecked;

			this.toggle();
		});
	}

	private toggle() {
		if (this.isChecked) this.countUp();
		else this.countDown();
	}

	private animate(from: number, to: number) {
		let startTimestamp = 0;

		const step = (timestamp: number) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min(
				(timestamp - startTimestamp) / this.duration,
				1,
			);

			this.el.innerText = String(Math.floor(progress * (to - from) + from));

			if (progress < 1) window.requestAnimationFrame(step);
		};

		window.requestAnimationFrame(step);
	}

	// Public methods
	public countUp() {
		this.animate(this.min, this.max);
	}

	public countDown() {
		this.animate(this.max, this.min);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsToggleCountCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element
			: null;
	}

	static autoInit() {
		if (!window.$hsToggleCountCollection) window.$hsToggleCountCollection = [];

		document
			.querySelectorAll('[data-hs-toggle-count]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsToggleCountCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSToggleCount(el);
			});
	}
}

declare global {
	interface Window {
		HSToggleCount: Function;
		$hsToggleCountCollection: ICollectionItem<HSToggleCount>[];
	}
}

window.addEventListener('load', () => {
	HSToggleCount.autoInit();

	// Uncomment for debug
	// console.log('Toggle count collection:', window.$hsToggleCountCollection);
});

if (typeof window !== 'undefined') {
	window.HSToggleCount = HSToggleCount;
}

export default HSToggleCount;
