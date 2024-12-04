/*
 * HSTextareaAutoHeight
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	ITextareaAutoHeightOptions,
	ITextareaAutoHeight,
} from '../textarea-auto-height/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSTextareaAutoHeight
	extends HSBasePlugin<ITextareaAutoHeightOptions>
	implements ITextareaAutoHeight
{
	private readonly defaultHeight: number;

	private onElementInputListener: () => void;

	constructor(el: HTMLTextAreaElement, options?: ITextareaAutoHeightOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-copy-markup');
		const dataOptions: ITextareaAutoHeightOptions = data
			? JSON.parse(data)
			: {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.defaultHeight = concatOptions?.defaultHeight || 0;

		this.init();
	}

	private elementInput() {
		this.textareaSetHeight(3);
	}

	private init() {
		this.createCollection(window.$hsTextareaAutoHeightCollection, this);

		this.setAutoHeight();
	}

	private setAutoHeight() {
		if (this.isParentHidden()) this.callbackAccordingToType();
		else this.textareaSetHeight(3);

		this.onElementInputListener = () => this.elementInput();

		this.el.addEventListener('input', this.onElementInputListener);
	}

	private textareaSetHeight(offsetTop = 0) {
		this.el.style.height = 'auto';
		this.el.style.height =
			this.checkIfOneLine() && this.defaultHeight
				? `${this.defaultHeight}px`
				: `${this.el.scrollHeight + offsetTop}px`;
	}

	private checkIfOneLine(): boolean {
		const clientHeight = this.el.clientHeight;
		const scrollHeight = this.el.scrollHeight;

		if (scrollHeight > clientHeight) return false;
		else return true;
	}

	private isParentHidden() {
		return (
			this.el.closest('.hs-collapse') ||
			this.el.closest('.hs-overlay') ||
			this.el.closest('[role="tabpanel"]')
		);
	}

	private parentType(): string | boolean {
		if (this.el.closest('.hs-collapse')) return 'collapse';
		else if (this.el.closest('.hs-overlay')) return 'overlay';
		else if (this.el.closest('[role="tabpanel"]')) return 'tabs';
		else return false;
	}

	private callbackAccordingToType() {
		if (this.parentType() === 'tabs') {
			const tabId = this.el.closest('[role="tabpanel"]')?.id;
			const tab = document.querySelector(`[data-hs-tab="#${tabId}"]`);
			const tabs = tab.closest('[role="tablist"]');
			const { element } =
				(window.HSTabs as any).getInstance(tabs, true) || null;

			element.on('change', () => {
				if (!this.el) return false;

				this.textareaSetHeight(3);
			});
		} else if (this.parentType() === 'collapse') {
			const collapseId = this.el.closest('.hs-collapse').id;
			const { element } = (window.HSCollapse as any).getInstance(
				`[data-hs-collapse="#${collapseId}"]`,
				true,
			);

			element.on('beforeOpen', () => {
				if (!this.el) return false;

				this.textareaSetHeight(3);
			});
		} else if (this.parentType() === 'overlay') {
			const { element } = (window.HSOverlay as any).getInstance(
				this.el.closest('.hs-overlay'),
				true,
			);

			element.on('open', () => {
				if (!this.el) return false;

				this.textareaSetHeight(3);
			});
		} else return false;
	}

	// Public methods
	public destroy() {
		// Remove listeners
		this.el.removeEventListener('input', this.onElementInputListener);

		window.$hsTextareaAutoHeightCollection =
			window.$hsTextareaAutoHeightCollection.filter(
				({ element }) => element.el !== this.el,
			);
	}

	// Static method
	static getInstance(
		target: HTMLTextAreaElement | string,
		isInstance?: boolean,
	) {
		const elInCollection = window.$hsTextareaAutoHeightCollection.find(
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
		if (!window.$hsTextareaAutoHeightCollection)
			window.$hsTextareaAutoHeightCollection = [];

		if (window.$hsTextareaAutoHeightCollection)
			window.$hsTextareaAutoHeightCollection =
				window.$hsTextareaAutoHeightCollection.filter(({ element }) =>
					document.contains(element.el),
				);

		document
			.querySelectorAll(
				'[data-hs-textarea-auto-height]:not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLTextAreaElement) => {
				if (
					!window.$hsTextareaAutoHeightCollection.find(
						(elC) => (elC?.element?.el as HTMLTextAreaElement) === el,
					)
				) {
					const data = el.getAttribute('data-hs-textarea-auto-height');
					const options: ITextareaAutoHeightOptions = data
						? JSON.parse(data)
						: {};

					new HSTextareaAutoHeight(el, options);
				}
			});
	}
}

declare global {
	interface Window {
		HSTextareaAutoHeight: Function;
		$hsTextareaAutoHeightCollection: ICollectionItem<HSTextareaAutoHeight>[];
	}
}

window.addEventListener('load', () => {
	HSTextareaAutoHeight.autoInit();

	// Uncomment for debug
	// console.log('Textarea Autoheight collection:', window.$hsTextareaAutoHeightCollection);
});

if (typeof window !== 'undefined') {
	window.HSTextareaAutoHeight = HSTextareaAutoHeight;
}

export default HSTextareaAutoHeight;
