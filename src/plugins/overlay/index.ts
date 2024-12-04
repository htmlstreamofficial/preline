/*
 * HSOverlay
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	stringToBoolean,
	getClassProperty,
	isParentOrElementHidden,
	isDirectChild,
	dispatch,
	afterTransition,
} from '../../utils';

import { IOverlayOptions, IOverlay } from './interfaces';
import { TOverlayOptionsAutoCloseEqualityType } from './types';
import { ICollectionItem } from '../../interfaces';
import { BREAKPOINTS } from '../../constants';

import HSBasePlugin from '../base-plugin';

class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass: string | null;
	private readonly emulateScrollbarSpace: boolean;
	private readonly isClosePrev: boolean;
	private readonly backdropClasses: string | null;
	private readonly backdropParent: string | HTMLElement | Document;
	private readonly backdropExtraClasses: string | null;
	private readonly animationTarget: HTMLElement | null;

	private openNextOverlay: boolean;
	private autoHide: ReturnType<typeof setTimeout> | null;
	private readonly overlayId: string | null;

	public overlay: HTMLElement | null;
	public initContainer: HTMLElement | null;
	public isCloseWhenClickInside: boolean;
	public isTabAccessibilityLimited: boolean;
	public isLayoutAffect: boolean;
	public hasAutofocus: boolean;
	public hasAbilityToCloseOnBackdropClick: boolean;
	public openedBreakpoint: number | null;
	public autoClose: number | null;
	public autoCloseEqualityType: TOverlayOptionsAutoCloseEqualityType | null;
	public moveOverlayToBody: number | null;

	private backdrop: HTMLElement | null;

	private onElementClickListener: () => void;
	private onOverlayClickListener: (evt: Event) => void;
	private onBackdropClickListener: () => void;

	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {}) {
		super(el, options, events);

		const data = el.getAttribute('data-hs-overlay-options');
		const dataOptions: IOverlayOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.hiddenClass = concatOptions?.hiddenClass || 'hidden';
		this.emulateScrollbarSpace = concatOptions?.emulateScrollbarSpace || false;
		this.isClosePrev = concatOptions?.isClosePrev ?? true;
		this.backdropClasses =
			concatOptions?.backdropClasses ??
			'hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900';
		this.backdropParent =
			typeof concatOptions.backdropParent === 'string' ? document.querySelector(concatOptions.backdropParent) as HTMLElement : document.body;
		this.backdropExtraClasses = concatOptions?.backdropExtraClasses ?? '';
		this.moveOverlayToBody = concatOptions?.moveOverlayToBody || null;

		this.openNextOverlay = false;
		this.autoHide = null;
		this.overlayId = this.el.getAttribute('data-hs-overlay');
		this.overlay = document.querySelector(this.overlayId);
		this.initContainer = this.overlay?.parentElement || null;
		if (this.overlay) {
			this.isCloseWhenClickInside = stringToBoolean(
				getClassProperty(this.overlay, '--close-when-click-inside', 'false') ||
				'false',
			);
			this.isTabAccessibilityLimited = stringToBoolean(
				getClassProperty(this.overlay, '--tab-accessibility-limited', 'true') ||
				'true',
			);
			this.isLayoutAffect = stringToBoolean(
				getClassProperty(this.overlay, '--is-layout-affect', 'false') ||
				'false',
			);
			this.hasAutofocus = stringToBoolean(
				getClassProperty(this.overlay, '--has-autofocus', 'true') || 'true',
			);
			this.hasAbilityToCloseOnBackdropClick = stringToBoolean(
				this.overlay.getAttribute('data-hs-overlay-keyboard') || 'true',
			);

			const autoCloseBreakpoint = getClassProperty(
				this.overlay,
				'--auto-close',
			);
			const autoCloseEqualityType = getClassProperty(
				this.overlay,
				'--auto-close-equality-type',
			);
			this.autoClose =
				!isNaN(+autoCloseBreakpoint) && isFinite(+autoCloseBreakpoint)
					? +autoCloseBreakpoint
					: BREAKPOINTS[autoCloseBreakpoint] || null;
			this.autoCloseEqualityType = autoCloseEqualityType as TOverlayOptionsAutoCloseEqualityType ?? null;

			const openedBreakpoint = getClassProperty(this.overlay, '--opened');
			this.openedBreakpoint =
				(!isNaN(+openedBreakpoint) && isFinite(+openedBreakpoint)
					? +openedBreakpoint
					: BREAKPOINTS[openedBreakpoint]) || null;
		}

		this.animationTarget =
			this?.overlay?.querySelector('.hs-overlay-animation-target') ||
			this.overlay;

		if (this.overlay) this.init();
	}

	private elementClick() {
		if (this.overlay.classList.contains('opened')) this.close();
		else this.open();
	}

	private overlayClick(evt: Event) {
		if (
			(evt.target as HTMLElement).id &&
			`#${(evt.target as HTMLElement).id}` === this.overlayId &&
			this.isCloseWhenClickInside &&
			this.hasAbilityToCloseOnBackdropClick
		) {
			this.close();
		}
	}

	private backdropClick() {
		this.close();
	}

	private init() {
		this.createCollection(window.$hsOverlayCollection, this);

		if (this.isLayoutAffect && this.openedBreakpoint) {
			const instance = HSOverlay.getInstance(this.el, true);

			HSOverlay.setOpened(
				this.openedBreakpoint,
				instance as ICollectionItem<HSOverlay>,
			);
		}

		if (this?.el?.ariaExpanded) {
			if (this.overlay.classList.contains('opened'))
				this.el.ariaExpanded = 'true';
			else this.el.ariaExpanded = 'false';
		}

		this.onElementClickListener = () => this.elementClick();
		this.onOverlayClickListener = (evt) => this.overlayClick(evt);

		this.el.addEventListener('click', this.onElementClickListener);
		this.overlay.addEventListener('click', this.onOverlayClickListener);
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
		this.backdrop = document.createElement('div');
		let backdropClasses = `${this.backdropClasses} ${this.backdropExtraClasses}`;
		const closeOnBackdrop =
			getClassProperty(this.overlay, '--overlay-backdrop', 'true') !== 'static';
		const disableBackdrop =
			getClassProperty(this.overlay, '--overlay-backdrop', 'true') === 'false';

		this.backdrop.id = `${this.overlay.id}-backdrop`;
		if ('style' in this.backdrop)
			this.backdrop.style.zIndex = `${overlayZIndex - 1}`;

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
			this.backdrop = document
				.querySelector(backdropId)
				.cloneNode(true) as HTMLElement;
			this.backdrop.classList.remove('hidden');

			backdropClasses = `${(this.backdrop as HTMLElement).classList.toString()}`;
			this.backdrop.classList.value = '';
		}

		if (closeOnBackdrop) {
			this.onBackdropClickListener = () => this.backdropClick();

			this.backdrop.addEventListener(
				'click',
				this.onBackdropClickListener,
				true,
			);
		}

		this.backdrop.setAttribute('data-hs-overlay-backdrop-template', '');

		(this.backdropParent as HTMLElement).appendChild(this.backdrop);

		setTimeout(() => {
			this.backdrop.classList.value = backdropClasses;
		});
	}

	private destroyBackdrop() {
		const backdrop: HTMLElement = document.querySelector(
			`#${this.overlay.id}-backdrop`,
		);

		if (!backdrop) return;

		if (this.openNextOverlay) {
			backdrop.style.transitionDuration = `${parseFloat(
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

	private getScrollbarSize() {
		let div = document.createElement('div');
		div.style.overflow = 'scroll';
		div.style.width = '100px';
		div.style.height = '100px';
		document.body.appendChild(div);

		let scrollbarSize = div.offsetWidth - div.clientWidth;

		document.body.removeChild(div);

		return scrollbarSize;
	}

	// Public methods
	public open() {
		if (!this.overlay) return false;

		const openedOverlays = document.querySelectorAll('.hs-overlay.open');
		const currentlyOpened = window.$hsOverlayCollection.find(
			(el) =>
				Array.from(openedOverlays).includes(el.element.overlay) &&
				!el.element.isLayoutAffect,
		);
		const toggles = document.querySelectorAll(
			`[data-hs-overlay="#${this.overlay.id}"]`,
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
			if (this.emulateScrollbarSpace)
				document.body.style.paddingRight = `${this.getScrollbarSize()}px`;
		}

		this.buildBackdrop();
		this.checkTimer();
		this.hideAuto();

		toggles.forEach((toggle) => {
			if (toggle.ariaExpanded) toggle.ariaExpanded = 'true';
		});
		this.overlay.classList.remove(this.hiddenClass);
		this.overlay.setAttribute('aria-overlay', 'true');
		this.overlay.setAttribute('tabindex', '-1');

		setTimeout(() => {
			if (this.overlay.classList.contains('opened')) return false;

			this.overlay.classList.add('open', 'opened');
			if (this.isLayoutAffect)
				document.body.classList.add('hs-overlay-body-open');

			this.fireEvent('open', this.el);
			dispatch('open.hs.overlay', this.el, this.el);

			if (this.hasAutofocus) this.focusElement();
		}, 50);
	}

	public close(forceClose = false) {
		if (this.isLayoutAffect)
			document.body.classList.remove('hs-overlay-body-open');

		const closeFn = (cb: Function) => {
			if (this.overlay.classList.contains('open')) return false;
			const toggles = document.querySelectorAll(
				`[data-hs-overlay="#${this.overlay.id}"]`,
			);

			toggles.forEach((toggle) => {
				if (toggle.ariaExpanded) toggle.ariaExpanded = 'false';
			});
			this.overlay.classList.add(this.hiddenClass);

			this.destroyBackdrop();

			this.fireEvent('close', this.el);
			dispatch('close.hs.overlay', this.el, this.el);

			if (!document.querySelector('.hs-overlay.opened')) {
				document.body.style.overflow = '';
				if (this.emulateScrollbarSpace) document.body.style.paddingRight = '';
			}

			cb(this.overlay);
		};

		return new Promise((resolve) => {
			if (!this.overlay) return false;

			this.overlay.classList.remove('open', 'opened');
			this.overlay.removeAttribute('aria-overlay');
			this.overlay.removeAttribute('tabindex');

			if (forceClose) closeFn(resolve);
			else afterTransition(this.animationTarget, () => closeFn(resolve));
		});
	}

	public destroy() {
		// Remove classes
		this.overlay.classList.remove('open', 'opened', this.hiddenClass);
		if (this.isLayoutAffect)
			document.body.classList.remove('hs-overlay-body-open');

		// Remove listeners
		this.el.removeEventListener('click', this.onElementClickListener);
		this.overlay.removeEventListener('click', this.onOverlayClickListener);
		if (this.backdrop)
			this.backdrop.removeEventListener('click', this.onBackdropClickListener);

		if (this.backdrop) {
			this.backdrop.remove();
			this.backdrop = null;
		}

		window.$hsOverlayCollection = window.$hsOverlayCollection.filter(
			({ element }) => element.el !== this.el,
		);
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
		if (!window.$hsOverlayCollection) {
			window.$hsOverlayCollection = [];

			document.addEventListener('keydown', (evt) =>
				HSOverlay.accessibility(evt),
			);
		}

		if (window.$hsOverlayCollection)
			window.$hsOverlayCollection = window.$hsOverlayCollection.filter(
				({ element }) => document.contains(element.el),
			);

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

	static setOpened(breakpoint: number, el: ICollectionItem<HSOverlay>) {
		if (document.body.clientWidth >= breakpoint) {
			document.body.classList.add('hs-overlay-body-open');
			el.element.overlay.classList.add('opened');
		} else el.element.close(true);
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
			!target.element.isTabAccessibilityLimited &&
			evt.code === 'Tab'
		)
			return false;

		if (basicCheck && notHiddenFocusableElements.length && evt.code === 'Tab') {
			evt.preventDefault();
			this.onTab(target);
		}
		if (basicCheck && evt.code === 'Escape') {
			evt.preventDefault();
			this.onEscape(target);
		}
	}

	static onEscape(target: ICollectionItem<HSOverlay>) {
		if (target && target.element.hasAbilityToCloseOnBackdropClick)
			target.element.close();
	}

	static onTab(target: ICollectionItem<HSOverlay>) {
		const overlayElement = target.element.overlay;
		const focusableElements = Array.from(
			overlayElement.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		);

		if (focusableElements.length === 0) return false;

		const focusedElement = overlayElement.querySelector(':focus');

		if (focusedElement) {
			let foundCurrent = false;

			for (const element of focusableElements) {
				if (foundCurrent) {
					element.focus();

					return;
				}

				if (element === focusedElement) {
					foundCurrent = true;
				}
			}

			focusableElements[0].focus();
		} else {
			focusableElements[0].focus();
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

const autoCloseResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.autoClose)
	)
		return false;

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.autoClose,
	);

	overlays.forEach((overlay) => {
		const { autoCloseEqualityType, autoClose } = overlay.element;
		const condition = autoCloseEqualityType === 'less-than'
			? document.body.clientWidth <= autoClose
			: document.body.clientWidth >= autoClose;

		if (condition) {
			overlay.element.close(true);
		}
	});
};

const moveOverlayToBodyResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.moveOverlayToBody)
	)
		return false;

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.moveOverlayToBody,
	);

	overlays.forEach((overlay) => {
		const resolution = overlay.element.moveOverlayToBody;
		const initPlace = overlay.element.initContainer;
		const newPlace = document.querySelector('body');
		const target = overlay.element.overlay;

		if (!initPlace && target) return false;

		if (
			document.body.clientWidth <= resolution &&
			!isDirectChild(newPlace, target)
		)
			newPlace.appendChild(target);
		else if (
			document.body.clientWidth > resolution &&
			!initPlace.contains(target)
		)
			initPlace.appendChild(target);
	});
};

const setOpenedResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.autoClose)
	)
		return false;

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.autoClose,
	);

	overlays.forEach((overlay) => {
		const { autoCloseEqualityType, autoClose } = overlay.element;
		const condition = autoCloseEqualityType === 'less-than'
			? document.body.clientWidth <= autoClose
			: document.body.clientWidth >= autoClose;

		if (condition) {
			overlay.element.close(true);
		}
	});
};

const setBackdropZIndexResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) =>
			el.element.overlay.classList.contains('opened'),
		)
	)
		return false;

	const overlays = window.$hsOverlayCollection.filter((el) =>
		el.element.overlay.classList.contains('opened'),
	);

	overlays.forEach((overlay) => {
		const overlayZIndex = parseInt(
			window
				.getComputedStyle(overlay.element.overlay)
				.getPropertyValue('z-index'),
		);
		const backdrop: HTMLElement = document.querySelector(
			`#${overlay.element.overlay.id}-backdrop`,
		);
		const backdropZIndex = parseInt(
			window.getComputedStyle(backdrop).getPropertyValue('z-index'),
		);
		if (overlayZIndex === backdropZIndex + 1) return false;

		if ('style' in backdrop) backdrop.style.zIndex = `${overlayZIndex - 1}`;
		document.body.classList.add('hs-overlay-body-open');
	});
};

window.addEventListener('load', () => {
	HSOverlay.autoInit();

	moveOverlayToBodyResizeFn();
	// Uncomment for debug
	// console.log('Overlay collection:', window.$hsOverlayCollection);
});

window.addEventListener('resize', () => {
	autoCloseResizeFn();
	moveOverlayToBodyResizeFn();
	setOpenedResizeFn();
	setBackdropZIndexResizeFn();
});

if (typeof window !== 'undefined') {
	window.HSOverlay = HSOverlay;
}

export default HSOverlay;
