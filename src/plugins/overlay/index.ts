/*
 * HSOverlay
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import {
	getClassProperty,
	isParentOrElementHidden,
	dispatch,
	afterTransition,
} from '../../utils';

import { IOverlayOptions, IOverlay } from './interfaces';
import { ICollectionItem } from '../../interfaces';

import HSBasePlugin from '../base-plugin';

class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass: string | null;
	private readonly isClosePrev: boolean;
	private readonly backdropClasses: string | null;

	private openNextOverlay: boolean;
	private autoHide: ReturnType<typeof setTimeout> | null;
	private readonly overlayId: string | null;

	public overlay: HTMLElement | null;
	public isCloseWhenClickInside: string;
	public isTabAccessibilityLimited: string;
	public hasAutofocus: string;
	public hasAbilityToCloseOnBackdropClick: string;

	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {}) {
		super(el, options, events);

		const data = el.getAttribute('data-hs-overlay-options');
		const dataOptions: IOverlayOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.hiddenClass = concatOptions?.hiddenClass || 'hidden';
		this.isClosePrev = concatOptions?.isClosePrev ?? true;
		this.backdropClasses =
			concatOptions?.backdropClasses ??
			'transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop';

		this.openNextOverlay = false;
		this.autoHide = null;
		this.overlayId = this.el.getAttribute('data-hs-overlay');
		this.overlay = document.querySelector(this.overlayId);
		if (this.overlay) {
			this.isCloseWhenClickInside =
				getClassProperty(this.overlay, '--close-when-click-inside', 'false') ||
				'false';
			this.isTabAccessibilityLimited =
				getClassProperty(this.overlay, '--tab-accessibility-limited', 'true') ||
				'true';
			this.hasAutofocus =
				getClassProperty(this.overlay, '--has-autofocus', 'true') || 'true';
			this.hasAbilityToCloseOnBackdropClick =
				this.overlay.getAttribute('data-hs-overlay-keyboard') || 'true';
		}

		if (this.overlay) this.init();
	}

	private init() {
		this.createCollection(window.$hsOverlayCollection, this);

		this.el.addEventListener('click', () => {
			if (this.overlay.classList.contains(this.hiddenClass)) {
				this.open();
			} else {
				this.close();
			}
		});

		this.overlay.addEventListener('click', (evt) => {
			if (
				(evt.target as HTMLElement).id &&
				`#${(evt.target as HTMLElement).id}` === this.overlayId &&
				this.isCloseWhenClickInside === 'true' &&
				this.hasAbilityToCloseOnBackdropClick === 'true'
			) {
				this.close();
			}
		});
	}

	private hideAuto() {
		const time = parseInt(getClassProperty(this.overlay, '--auto-hide', '0'));

		if (time) {
			this.autoHide = setTimeout(() => {
				this.close();
			}, time);
		}
	}

	private checkTimer() {
		if (this.autoHide) {
			clearTimeout(this.autoHide);

			this.autoHide = null;
		}
	}

	private buildBackdrop() {
		const overlayClasses = this.overlay.classList.value.split(' ');
		const overlayZIndex = parseInt(
			window.getComputedStyle(this.overlay).getPropertyValue('z-index'),
		);
		const backdropId =
			this.overlay.getAttribute('data-hs-overlay-backdrop-container') || false;
		let backdrop: HTMLElement | Node = document.createElement('div');
		let backdropClasses = this.backdropClasses;
		const closeOnBackdrop =
			getClassProperty(this.overlay, '--overlay-backdrop', 'true') !== 'static';
		const disableBackdrop =
			getClassProperty(this.overlay, '--overlay-backdrop', 'true') === 'false';

		(backdrop as HTMLElement).id = `${this.overlay.id}-backdrop`;
		if ('style' in backdrop) backdrop.style.zIndex = `${overlayZIndex - 1}`;

		for (const value of overlayClasses) {
			if (
				value.startsWith('hs-overlay-backdrop-open:') ||
				value.includes(':hs-overlay-backdrop-open:')
			) {
				backdropClasses += ` ${value}`;
			}
		}

		if (disableBackdrop) return;

		if (backdropId) {
			backdrop = document.querySelector(backdropId).cloneNode(true);
			(backdrop as HTMLElement).classList.remove('hidden');

			backdropClasses = `${(backdrop as HTMLElement).classList.toString()}`;
			(backdrop as HTMLElement).classList.value = '';
		}

		if (closeOnBackdrop) {
			(backdrop as HTMLElement).addEventListener(
				'click',
				() => this.close(),
				true,
			);
		}

		(backdrop as HTMLElement).setAttribute(
			'data-hs-overlay-backdrop-template',
			'',
		);

		document.body.appendChild(backdrop);

		setTimeout(() => {
			(backdrop as HTMLElement).classList.value = backdropClasses;
		});
	}

	private destroyBackdrop() {
		const backdrop: HTMLElement = document.querySelector(
			`#${this.overlay.id}-backdrop`,
		);

		if (!backdrop) return;

		if (this.openNextOverlay) {
			backdrop.style.transitionDuration = `${
				parseFloat(
					window
						.getComputedStyle(backdrop)
						.transitionDuration.replace(/[^\d.-]/g, ''),
				) * 1.8
			}s`;
		}

		backdrop.classList.add('opacity-0');

		afterTransition(backdrop, () => {
			backdrop.remove();
		});
	}

	private focusElement() {
		const input: HTMLInputElement = this.overlay.querySelector('[autofocus]');

		if (!input) return false;
		else input.focus();
	}

	// Public methods
	public open() {
		if (!this.overlay) return false;

		const currentlyOpened = window.$hsOverlayCollection.find(
			(el) => el.element.overlay === document.querySelector('.hs-overlay.open'),
		);
		const disabledScroll =
			getClassProperty(this.overlay, '--body-scroll', 'false') !== 'true';

		if (this.isClosePrev && currentlyOpened) {
			this.openNextOverlay = true;

			return currentlyOpened.element.close().then(() => {
				this.open();

				this.openNextOverlay = false;
			});
		}

		if (disabledScroll) {
			document.body.style.overflow = 'hidden';
		}

		this.buildBackdrop();
		this.checkTimer();
		this.hideAuto();

		this.overlay.classList.remove(this.hiddenClass);
		this.overlay.setAttribute('aria-overlay', 'true');
		this.overlay.setAttribute('tabindex', '-1');

		setTimeout(() => {
			if (this.overlay.classList.contains(this.hiddenClass)) return false;

			this.overlay.classList.add('open');

			this.fireEvent('open', this.el);
			dispatch('open.hs.overlay', this.el, this.el);

			if (this.hasAutofocus === 'true') this.focusElement();
		}, 50);
	}

	public close() {
		return new Promise((resolve) => {
			if (!this.overlay) return false;

			this.overlay.classList.remove('open');
			this.overlay.removeAttribute('aria-overlay');
			this.overlay.removeAttribute('tabindex');

			afterTransition(this.overlay, () => {
				if (this.overlay.classList.contains('open')) return false;

				this.overlay.classList.add(this.hiddenClass);

				this.destroyBackdrop();

				this.fireEvent('close', this.el);
				dispatch('close.hs.overlay', this.el, this.el);

				document.body.style.overflow = '';

				resolve(this.overlay);
			});
		});
	}

	// Static methods
	static getInstance(target: HTMLElement, isInstance?: boolean) {
		const elInCollection = window.$hsOverlayCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target) ||
				el.element.overlay ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsOverlayCollection) window.$hsOverlayCollection = [];

		document
			.querySelectorAll('[data-hs-overlay]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsOverlayCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSOverlay(el);
			});

		if (window.$hsOverlayCollection) {
			document.addEventListener('keydown', (evt) =>
				HSOverlay.accessibility(evt),
			);
		}
	}

	static open(target: HTMLElement) {
		const elInCollection = window.$hsOverlayCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target) ||
				el.element.overlay ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target),
		);

		if (
			elInCollection &&
			elInCollection.element.overlay.classList.contains(
				elInCollection.element.hiddenClass,
			)
		)
			elInCollection.element.open();
	}

	static close(target: HTMLElement) {
		const elInCollection = window.$hsOverlayCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target) ||
				el.element.overlay ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target),
		);

		if (
			elInCollection &&
			!elInCollection.element.overlay.classList.contains(
				elInCollection.element.hiddenClass,
			)
		)
			elInCollection.element.close();
	}

	// Accessibility methods
	static accessibility(evt: KeyboardEvent) {
		const targets = window.$hsOverlayCollection.filter((el) =>
			el.element.overlay.classList.contains('open'),
		);
		const target = targets[targets.length - 1];
		const focusableElements = target?.element?.overlay?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		const notHiddenFocusableElements: HTMLElement[] = [];
		if (focusableElements?.length)
			focusableElements.forEach((el: HTMLElement) => {
				if (!isParentOrElementHidden(el)) notHiddenFocusableElements.push(el);
			});
		const basicCheck = target && !evt.metaKey;

		if (
			basicCheck &&
			target.element.isTabAccessibilityLimited === 'false' &&
			evt.code === 'Tab'
		)
			return false;

		if (basicCheck && notHiddenFocusableElements.length && evt.code === 'Tab') {
			evt.preventDefault();
			this.onTab(target, notHiddenFocusableElements);
		}
		if (basicCheck && evt.code === 'Escape') {
			evt.preventDefault();
			this.onEscape(target);
		}
	}

	static onEscape(target: ICollectionItem<HSOverlay>) {
		if (target) target.element.close();
	}

	static onTab(
		target: ICollectionItem<HSOverlay>,
		focusableElements: HTMLElement[],
	) {
		if (!focusableElements.length) return false;

		const focused = target.element.overlay.querySelector(':focus');
		const focusedIndex = Array.from(focusableElements).indexOf(
			focused as HTMLElement,
		);

		if (focusedIndex > -1) {
			const nextIndex = (focusedIndex + 1) % focusableElements.length;
			(focusableElements[nextIndex] as HTMLElement).focus();
		} else {
			(focusableElements[0] as HTMLElement).focus();
		}
	}

	// Backward compatibility
	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsOverlayCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target) ||
				el.element.overlay ===
					(typeof target === 'string'
						? document.querySelector(target)
						: target),
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSOverlay: Function;
		$hsOverlayCollection: ICollectionItem<HSOverlay>[];
	}
}

window.addEventListener('load', () => {
	HSOverlay.autoInit();

	// Uncomment for debug
	// console.log('Overlay collection:', window.$hsOverlayCollection);
});

if (typeof window !== 'undefined') {
	window.HSOverlay = HSOverlay;
}

export default HSOverlay;
