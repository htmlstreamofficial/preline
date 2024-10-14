/*
 * HSTogglePassword
 * @version: 2.5.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { isFormElement, dispatch } from '../../utils';

import {
	ITogglePasswordOptions,
	ITogglePassword,
} from '../toggle-password/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSTogglePassword
	extends HSBasePlugin<ITogglePasswordOptions>
	implements ITogglePassword
{
	private readonly target:
		| string
		| string[]
		| HTMLInputElement
		| HTMLInputElement[]
		| null;
	private isShown: boolean;
	private isMultiple: boolean;
	private eventType: string;

	constructor(el: HTMLElement, options?: ITogglePasswordOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-toggle-password');
		const dataOptions: ITogglePasswordOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};
		const targets: HTMLInputElement[] = [];
		if (concatOptions?.target && typeof concatOptions?.target === 'string') {
			const ids = concatOptions?.target.split(',');
			ids.forEach((id) => {
				targets.push(document.querySelector(id) as HTMLInputElement);
			});
		} else if (
			concatOptions?.target &&
			typeof concatOptions?.target === 'object'
		) {
			(concatOptions.target as string[]).forEach((el) =>
				targets.push(document.querySelector(el)),
			);
		} else {
			(concatOptions.target as HTMLInputElement[]).forEach((el) =>
				targets.push(el),
			);
		}

		this.target = targets;
		this.isShown = this.el.hasAttribute('type')
			? (this.el as HTMLInputElement).checked
			: false;
		this.eventType = isFormElement(this.el) ? 'change' : 'click';
		this.isMultiple =
			this.target.length > 1 &&
			!!this.el.closest('[data-hs-toggle-password-group]');

		if (this.target) this.init();
	}

	private init() {
		this.createCollection(window.$hsTogglePasswordCollection, this);

		if (!this.isShown) {
			this.hide();
		} else {
			this.show();
		}

		this.el.addEventListener(this.eventType, () => {
			if (this.isShown) {
				this.hide();
			} else {
				this.show();
			}

			this.fireEvent('toggle', this.target);
			dispatch('toggle.hs.toggle-select', this.el, this.target);
		});
	}

	private getMultipleToggles(): HSTogglePassword[] {
		const group = this.el.closest('[data-hs-toggle-password-group]');
		const toggles = group.querySelectorAll('[data-hs-toggle-password]');
		const togglesInCollection: HSTogglePassword[] = [];

		toggles.forEach((el: HTMLElement) => {
			togglesInCollection.push(
				HSTogglePassword.getInstance(el) as HSTogglePassword,
			);
		});

		return togglesInCollection;
	}

	// Public methods
	public show() {
		if (this.isMultiple) {
			const toggles = this.getMultipleToggles();

			toggles.forEach((el: HSTogglePassword) =>
				el ? (el.isShown = true) : false,
			);

			this.el
				.closest('[data-hs-toggle-password-group]')
				.classList.add('active');
		} else {
			this.isShown = true;

			this.el.classList.add('active');
		}
		(this.target as HTMLInputElement[]).forEach((el) => {
			(el as HTMLInputElement).type = 'text';
		});
	}

	public hide() {
		if (this.isMultiple) {
			const toggles = this.getMultipleToggles();

			toggles.forEach((el: HSTogglePassword) =>
				el ? (el.isShown = false) : false,
			);

			this.el
				.closest('[data-hs-toggle-password-group]')
				.classList.remove('active');
		} else {
			this.isShown = false;

			this.el.classList.remove('active');
		}
		(this.target as HTMLInputElement[]).forEach((el) => {
			(el as HTMLInputElement).type = 'password';
		});
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsTogglePasswordCollection.find(
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
		if (!window.$hsTogglePasswordCollection)
			window.$hsTogglePasswordCollection = [];

		document
			.querySelectorAll(
				'[data-hs-toggle-password]:not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLInputElement) => {
				if (
					!window.$hsTogglePasswordCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSTogglePassword(el);
			});
	}
}

declare global {
	interface Window {
		HSTogglePassword: Function;
		$hsTogglePasswordCollection: ICollectionItem<HSTogglePassword>[];
	}
}

window.addEventListener('load', () => {
	HSTogglePassword.autoInit();

	// Uncomment for debug
	// console.log('Toggle password collection:', window.$hsTogglePasswordCollection);
});

if (typeof window !== 'undefined') {
	window.HSTogglePassword = HSTogglePassword;
}

export default HSTogglePassword;
