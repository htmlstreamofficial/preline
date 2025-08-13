/*
 * HSOverlay
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	afterTransition,
	dispatch,
	getClassProperty,
	isDirectChild,
	stringToBoolean,
} from "../../utils";

import { IOverlay, IOverlayOptions } from "./interfaces";
import { TOverlayOptionsAutoCloseEqualityType } from "./types";
import { ICollectionItem } from "../../interfaces";
import { IAccessibilityComponent } from "../accessibility-manager/interfaces";
import { BREAKPOINTS } from "../../constants";

import HSBasePlugin from "../base-plugin";
import HSAccessibilityObserver from "../accessibility-manager";

class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private accessibilityComponent: IAccessibilityComponent;
	private lastFocusedToggle: HTMLElement | null = null;
	private initiallyOpened: boolean;

	private readonly hiddenClass: string | null;
	private readonly emulateScrollbarSpace: boolean;
	private readonly isClosePrev: boolean;
	private readonly backdropClasses: string | null;
	private readonly backdropParent: string | HTMLElement | Document;
	private readonly backdropExtraClasses: string | null;
	private readonly animationTarget: HTMLElement | null;

	private openNextOverlay: boolean;
	private autoHide: ReturnType<typeof setTimeout> | null;
	private toggleButtons: HTMLElement[];
	public toggleMinifierButtons: HTMLElement[];

	static openedItemsQty = 0;

	public initContainer: HTMLElement | null;
	public isCloseWhenClickInside: boolean;
	public isTabAccessibilityLimited: boolean;
	public isLayoutAffect: boolean;
	public hasAutofocus: boolean;
	public hasDynamicZIndex: boolean;
	public hasAbilityToCloseOnBackdropClick: boolean;
	public openedBreakpoint: number | null;
	public autoClose: number | null;
	public autoCloseEqualityType: TOverlayOptionsAutoCloseEqualityType | null;
	public moveOverlayToBody: number | null;

	private backdrop: HTMLElement | null;
	private initialZIndex = 0;
	static currentZIndex = 0;

	private onElementClickListener: {
		el: HTMLElement;
		fn: () => void;
	}[] | null;
	private onElementMinifierClickListener: {
		el: HTMLElement;
		fn: () => void;
	}[] | null;
	private onOverlayClickListener: (evt: Event) => void;
	private onBackdropClickListener: () => void;

	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {}) {
		super(el, options, events);

		// Collect all data options from toggles
		this.toggleButtons = Array.from(
			document.querySelectorAll(`[data-hs-overlay="#${this.el.id}"]`),
		);
		const toggleDataOptions = this.collectToggleParameters(this.toggleButtons);

		this.toggleMinifierButtons = Array.from(
			document.querySelectorAll(`[data-hs-overlay-minifier="#${this.el.id}"]`),
		);

		const data = el.getAttribute("data-hs-overlay-options");
		const dataOptions: IOverlayOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...toggleDataOptions,
			...options,
		};

		this.hiddenClass = concatOptions?.hiddenClass || "hidden";
		this.emulateScrollbarSpace = concatOptions?.emulateScrollbarSpace || false;
		this.isClosePrev = concatOptions?.isClosePrev ?? true;
		this.backdropClasses = concatOptions?.backdropClasses ??
			"hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900/50 dark:bg-neutral-900/80";
		this.backdropParent = typeof concatOptions.backdropParent === "string"
			? document.querySelector(concatOptions.backdropParent) as HTMLElement
			: document.body;
		this.backdropExtraClasses = concatOptions?.backdropExtraClasses ?? "";
		this.moveOverlayToBody = concatOptions?.moveOverlayToBody || null;

		this.openNextOverlay = false;
		this.autoHide = null;
		this.initContainer = this.el?.parentElement || null;
		this.isCloseWhenClickInside = stringToBoolean(
			getClassProperty(this.el, "--close-when-click-inside", "false") ||
				"false",
		);
		this.isTabAccessibilityLimited = stringToBoolean(
			getClassProperty(this.el, "--tab-accessibility-limited", "true") ||
				"true",
		);
		this.isLayoutAffect = stringToBoolean(
			getClassProperty(this.el, "--is-layout-affect", "false") || "false",
		);
		this.hasAutofocus = stringToBoolean(
			getClassProperty(this.el, "--has-autofocus", "true") || "true",
		);
		this.hasDynamicZIndex = stringToBoolean(
			getClassProperty(this.el, "--has-dynamic-z-index", "false") || "false",
		);
		this.hasAbilityToCloseOnBackdropClick = stringToBoolean(
			this.el.getAttribute("data-hs-overlay-keyboard") || "true",
		);

		const autoCloseBreakpoint = getClassProperty(this.el, "--auto-close");
		const autoCloseEqualityType = getClassProperty(
			this.el,
			"--auto-close-equality-type",
		);
		const openedBreakpoint = getClassProperty(this.el, "--opened");

		this.autoClose =
			!isNaN(+autoCloseBreakpoint) && isFinite(+autoCloseBreakpoint)
				? +autoCloseBreakpoint
				: BREAKPOINTS[autoCloseBreakpoint] || null;
		this.autoCloseEqualityType =
			autoCloseEqualityType as TOverlayOptionsAutoCloseEqualityType ?? null;
		this.openedBreakpoint =
			(!isNaN(+openedBreakpoint) && isFinite(+openedBreakpoint)
				? +openedBreakpoint
				: BREAKPOINTS[openedBreakpoint]) || null;

		this.animationTarget =
			this?.el?.querySelector(".hs-overlay-animation-target") || this.el;

		this.initialZIndex = parseInt(getComputedStyle(this.el).zIndex, 10);

		this.onElementClickListener = [];
		this.onElementMinifierClickListener = [];

		this.initiallyOpened = document.body.classList.contains(
			"hs-overlay-body-open",
		);

		this.init();
	}

	private elementClick() {
		const payloadFn = () => {
			const payload = {
				el: this.el,
				isOpened: !!this.el.classList.contains("open"),
			};

			this.fireEvent("toggleClicked", payload);
			dispatch("toggleClicked.hs.overlay", this.el, payload);
		};

		if (this.el.classList.contains("opened")) this.close(false, payloadFn);
		else this.open(payloadFn);
	}

	private elementMinifierClick() {
		const payloadFn = () => {
			const payload = {
				el: this.el,
				isMinified: !!this.el.classList.contains("minified"),
			};

			this.fireEvent("toggleMinifierClicked", payload);
			dispatch("toggleMinifierClicked.hs.overlay", this.el, payload);
		};

		if (this.el.classList.contains("minified")) this.minify(false, payloadFn);
		else this.minify(true, payloadFn);
	}

	public minify(isMinified: boolean, cb: Function | null = null) {
		if (isMinified) {
			this.el.classList.add("minified");
			document.body.classList.add("hs-overlay-minified");

			if (cb) cb();
		} else {
			this.el.classList.remove("minified");
			document.body.classList.remove("hs-overlay-minified");

			if (cb) cb();
		}
	}

	private overlayClick(evt: Event) {
		if (
			(evt.target as HTMLElement).id &&
			`#${(evt.target as HTMLElement).id}` === this.el.id &&
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

		this.onOverlayClickListener = (evt) => this.overlayClick(evt);

		this.el.addEventListener("click", this.onOverlayClickListener);

		if (this.toggleButtons.length) this.buildToggleButtons(this.toggleButtons);

		if (this.toggleMinifierButtons.length) this.buildToggleMinifierButtons();

		if (typeof window !== "undefined") {
			if (!window.HSAccessibilityObserver) {
				window.HSAccessibilityObserver = new HSAccessibilityObserver();
			}
			this.setupAccessibility();
		}
	}

	private buildToggleButtons(buttons: HTMLElement[]) {
		buttons.forEach((el) => {
			if (this.el.classList.contains("opened")) el.ariaExpanded = "true";
			else el.ariaExpanded = "false";

			this.onElementClickListener.push({
				el,
				fn: () => this.elementClick(),
			});

			el.addEventListener(
				"click",
				this.onElementClickListener.find((toggleButton) =>
					toggleButton.el === el
				).fn,
			);
		});
	}

	private buildToggleMinifierButtons() {
		this.toggleMinifierButtons.forEach((el) => {
			if (this.el.classList.contains("minified")) el.ariaExpanded = "true";
			else el.ariaExpanded = "false";

			this.onElementMinifierClickListener.push({
				el,
				fn: () => this.elementMinifierClick(),
			});

			el.addEventListener(
				"click",
				this.onElementMinifierClickListener.find((minifierButton) =>
					minifierButton.el === el
				).fn,
			);
		});
	}

	private hideAuto() {
		const time = parseInt(getClassProperty(this.el, "--auto-hide", "0"));

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
		const overlayClasses = this.el.classList.value.split(" ");
		const overlayZIndex = parseInt(
			window.getComputedStyle(this.el).getPropertyValue("z-index"),
		);
		const backdropId =
			this.el.getAttribute("data-hs-overlay-backdrop-container") || false;
		this.backdrop = document.createElement("div");
		let backdropClasses =
			`${this.backdropClasses} ${this.backdropExtraClasses}`;
		const closeOnBackdrop =
			getClassProperty(this.el, "--overlay-backdrop", "true") !== "static";
		const disableBackdrop =
			getClassProperty(this.el, "--overlay-backdrop", "true") === "false";

		this.backdrop.id = `${this.el.id}-backdrop`;
		if ("style" in this.backdrop) {
			this.backdrop.style.zIndex = `${overlayZIndex - 1}`;
		}

		for (const value of overlayClasses) {
			if (
				value.startsWith("hs-overlay-backdrop-open:") ||
				value.includes(":hs-overlay-backdrop-open:")
			) {
				backdropClasses += ` ${value}`;
			}
		}

		if (disableBackdrop) return;

		if (backdropId) {
			this.backdrop = document
				.querySelector(backdropId)
				.cloneNode(true) as HTMLElement;
			this.backdrop.classList.remove("hidden");

			backdropClasses = `${
				(this.backdrop as HTMLElement).classList.toString()
			}`;
			this.backdrop.classList.value = "";
		}

		if (closeOnBackdrop) {
			this.onBackdropClickListener = () => this.backdropClick();

			this.backdrop.addEventListener(
				"click",
				this.onBackdropClickListener,
				true,
			);
		}

		this.backdrop.setAttribute("data-hs-overlay-backdrop-template", "");

		(this.backdropParent as HTMLElement).appendChild(this.backdrop);

		setTimeout(() => {
			this.backdrop.classList.value = backdropClasses;
		});
	}

	private destroyBackdrop() {
		const backdrop: HTMLElement = document.querySelector(
			`#${this.el.id}-backdrop`,
		);

		if (!backdrop) return;

		if (this.openNextOverlay) {
			backdrop.style.transitionDuration = `${
				parseFloat(
					window
						.getComputedStyle(backdrop)
						.transitionDuration.replace(/[^\d.-]/g, ""),
				) * 1.8
			}s`;
		}

		backdrop.classList.add("opacity-0");

		afterTransition(backdrop, () => {
			backdrop.remove();
		});
	}

	private focusElement() {
		const input: HTMLInputElement = this.el.querySelector("[autofocus]");

		if (!input) return false;
		else input.focus();
	}

	private getScrollbarSize() {
		let div = document.createElement("div");
		div.style.overflow = "scroll";
		div.style.width = "100px";
		div.style.height = "100px";
		document.body.appendChild(div);

		let scrollbarSize = div.offsetWidth - div.clientWidth;

		document.body.removeChild(div);

		return scrollbarSize;
	}

	private collectToggleParameters(buttons: HTMLElement[]) {
		let toggleData = {};

		buttons.forEach((el) => {
			const data = el.getAttribute("data-hs-overlay-options");
			const dataOptions: IOverlayOptions = data ? JSON.parse(data) : {};
			toggleData = {
				...toggleData,
				...dataOptions,
			};
		});

		return toggleData;
	}

	private isElementVisible(): boolean {
		const style = window.getComputedStyle(this.el);

		if (
			style.display === "none" || style.visibility === "hidden" ||
			style.opacity === "0"
		) {
			return false;
		}

		const rect = this.el.getBoundingClientRect();

		if (rect.width === 0 || rect.height === 0) {
			return false;
		}

		let parent = this.el.parentElement;

		while (parent) {
			const parentStyle = window.getComputedStyle(parent);

			if (
				parentStyle.display === "none" || parentStyle.visibility === "hidden" ||
				parentStyle.opacity === "0"
			) {
				return false;
			}

			parent = parent.parentElement;
		}

		return true;
	}

	private isOpened(): boolean {
		return this.el.classList.contains("open") &&
			!this.el.classList.contains(this.hiddenClass);
	}

	// Public methods
	public open(cb: Function | null = null) {
		if (this.el.classList.contains("minified")) {
			this.minify(false);
		}

		if (this.hasDynamicZIndex) {
			if (HSOverlay.currentZIndex < this.initialZIndex) {
				HSOverlay.currentZIndex = this.initialZIndex;
			}

			HSOverlay.currentZIndex++;
			this.el.style.zIndex = `${HSOverlay.currentZIndex}`;
		}

		const openedOverlays = document.querySelectorAll(".hs-overlay.open");
		const currentlyOpened = window.$hsOverlayCollection.find(
			(el) =>
				Array.from(openedOverlays).includes(el.element.el) &&
				!el.element.isLayoutAffect,
		);
		const toggles = document.querySelectorAll(
			`[data-hs-overlay="#${this.el.id}"]`,
		);
		const disabledScroll =
			getClassProperty(this.el, "--body-scroll", "false") !== "true";

		this.lastFocusedToggle = document.activeElement as HTMLElement;

		if (this.isClosePrev && currentlyOpened) {
			this.openNextOverlay = true;

			return currentlyOpened.element.close().then(() => {
				this.open();

				this.openNextOverlay = false;
			});
		}

		if (disabledScroll) {
			document.body.style.overflow = "hidden";
			if (this.emulateScrollbarSpace) {
				document.body.style.paddingRight = `${this.getScrollbarSize()}px`;
			}
		}

		this.buildBackdrop();
		this.checkTimer();
		this.hideAuto();

		toggles.forEach((toggle) => {
			if (toggle.ariaExpanded) toggle.ariaExpanded = "true";
		});
		this.el.classList.remove(this.hiddenClass);
		this.el.setAttribute("aria-overlay", "true");
		this.el.setAttribute("tabindex", "-1");

		setTimeout(() => {
			if (this.el.classList.contains("opened")) return false;

			this.el.classList.add("open", "opened");
			if (this.isLayoutAffect) {
				document.body.classList.add("hs-overlay-body-open");
			}

			if (!this.initiallyOpened) {
				this.el.focus();

				this.el.style.outline = "none";
			}
			this.initiallyOpened = false;

			this.fireEvent("open", this.el);
			dispatch("open.hs.overlay", this.el, this.el);

			if (window.HSAccessibilityObserver && this.accessibilityComponent) {
				window.HSAccessibilityObserver.updateComponentState(
					this.accessibilityComponent,
					true,
				);
			}

			if (this.hasAutofocus) this.focusElement();

			if (typeof cb === "function") cb();

			if (this.isElementVisible()) HSOverlay.openedItemsQty++;
		}, 50);
	}

	public close(forceClose = false, cb: Function | null = null) {
		if (this.isElementVisible()) {
			HSOverlay.openedItemsQty = HSOverlay.openedItemsQty <= 0
				? 0
				: HSOverlay.openedItemsQty - 1;
		}

		if (HSOverlay.openedItemsQty === 0 && this.isLayoutAffect) {
			document.body.classList.remove("hs-overlay-body-open");
		}

		const closeFn = (_cb: Function) => {
			if (this.el.classList.contains("open")) return false;
			const toggles = document.querySelectorAll(
				`[data-hs-overlay="#${this.el.id}"]`,
			);

			toggles.forEach((toggle) => {
				if (toggle.ariaExpanded) toggle.ariaExpanded = "false";
			});
			this.el.classList.add(this.hiddenClass);
			if (this.hasDynamicZIndex) this.el.style.zIndex = "";

			this.destroyBackdrop();

			this.fireEvent("close", this.el);
			dispatch("close.hs.overlay", this.el, this.el);

			if (window.HSAccessibilityObserver && this.accessibilityComponent) {
				window.HSAccessibilityObserver.updateComponentState(
					this.accessibilityComponent,
					false,
				);
			}

			if (!document.querySelector(".hs-overlay.opened")) {
				document.body.style.overflow = "";
				if (this.emulateScrollbarSpace) document.body.style.paddingRight = "";
			}

			if (this.lastFocusedToggle) {
				this.lastFocusedToggle.focus();
				this.lastFocusedToggle = null;
			}

			_cb(this.el);
			if (typeof cb === "function") cb();

			if (HSOverlay.openedItemsQty === 0) {
				document.body.classList.remove("hs-overlay-body-open");
				if (this.hasDynamicZIndex) HSOverlay.currentZIndex = 0;
			}
		};

		return new Promise((resolve) => {
			this.el.classList.remove("open", "opened");
			this.el.removeAttribute("aria-overlay");
			this.el.removeAttribute("tabindex");

			this.el.style.outline = "";

			if (forceClose) closeFn(resolve);
			else afterTransition(this.animationTarget, () => closeFn(resolve));
		});
	}

	public updateToggles() {
		const found = Array.from(
			document.querySelectorAll<HTMLElement>(
				`[data-hs-overlay="#${this.el.id}"]`,
			),
		);
		const newButtons = found.filter((btn) => !this.toggleButtons.includes(btn));

		if (newButtons.length) {
			this.toggleButtons.push(...newButtons);
			this.buildToggleButtons(newButtons);
		}

		this.toggleButtons = this.toggleButtons.filter((btn) => {
			if (document.contains(btn)) return true;

			const listener = this.onElementClickListener?.find(
				(lst) => lst.el === btn,
			);
			if (listener) btn.removeEventListener("click", listener.fn as () => void);

			return false;
		});
	}

	public destroy() {
		// Remove classes
		this.el.classList.remove("open", "opened", this.hiddenClass);
		if (this.isLayoutAffect) {
			document.body.classList.remove("hs-overlay-body-open");
		}

		// Remove listeners
		this.el.removeEventListener("click", this.onOverlayClickListener);
		if (this.onElementClickListener.length) {
			this.onElementClickListener.forEach(({ el, fn }) => {
				el.removeEventListener("click", fn);
			});
			this.onElementClickListener = null;
		}
		if (this.backdrop) {
			this.backdrop.removeEventListener("click", this.onBackdropClickListener);
		}

		if (this.backdrop) {
			this.backdrop.remove();
			this.backdrop = null;
		}

		window.$hsOverlayCollection = window.$hsOverlayCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	private static findInCollection(
		target: HSOverlay | HTMLElement | string,
	): ICollectionItem<HSOverlay> | null {
		return window.$hsOverlayCollection.find((el) => {
			if (target instanceof HSOverlay) return el.element.el === target.el;
			else if (typeof target === "string") {
				return el.element.el === document.querySelector(target);
			} else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		// Backward compatibility
		const _temp = typeof target === "string"
			? document.querySelector(target)
			: target;
		const _target = _temp?.getAttribute("data-hs-overlay")
			? _temp.getAttribute("data-hs-overlay")
			: target;

		const elInCollection = window.$hsOverlayCollection.find(
			(el) =>
				el.element.el ===
					(typeof _target === "string"
						? document.querySelector(_target)
						: _target) ||
				el.element.el ===
					(typeof _target === "string"
						? document.querySelector(_target)
						: _target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsOverlayCollection) {
			window.$hsOverlayCollection = [];
		}

		if (window.$hsOverlayCollection) {
			window.$hsOverlayCollection = window.$hsOverlayCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll(".hs-overlay:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsOverlayCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSOverlay(el);
				}
			});
	}

	static open(target: HSOverlay | HTMLElement | string) {
		const instance = HSOverlay.findInCollection(target);

		if (
			instance &&
			instance.element.el.classList.contains(instance.element.hiddenClass)
		) instance.element.open();
	}

	static close(target: HSOverlay | HTMLElement | string) {
		const instance = HSOverlay.findInCollection(target);

		if (
			instance &&
			!instance.element.el.classList.contains(instance.element.hiddenClass)
		) instance.element.close();
	}

	static minify(target: HSOverlay | HTMLElement | string, isMinified: boolean) {
		const instance = HSOverlay.findInCollection(target);

		if (instance) {
			instance.element.minify(isMinified);
		}
	}

	static setOpened(breakpoint: number, el: ICollectionItem<HSOverlay>) {
		if (document.body.clientWidth >= breakpoint) {
			if (el.element.el.classList.contains("minified")) {
				el.element.minify(false);
			}

			document.body.classList.add("hs-overlay-body-open");

			el.element.open();
		} else el.element.close(true);
	}

	// Accessibility methods
	private setupAccessibility(): void {
		this.accessibilityComponent = window.HSAccessibilityObserver
			.registerComponent(
				this.el,
				{
					onEnter: () => {
						if (!this.isOpened()) this.open();
					},
					onEsc: () => {
						if (this.isOpened()) {
							this.close();
						}
					},
					onTab: () => {
						if (!this.isOpened() || !this.isTabAccessibilityLimited) return;

						const focusableElements = Array.from(
							this.el.querySelectorAll<HTMLElement>(
								'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
							),
						).filter((el) =>
							!el.hidden && window.getComputedStyle(el).display !== "none"
						);

						if (focusableElements.length === 0) return;

						const focusedElement = this.el.querySelector(":focus");
						const currentIndex = focusedElement
							? focusableElements.indexOf(focusedElement as HTMLElement)
							: -1;
						const isShiftPressed = window.event instanceof KeyboardEvent &&
							window.event.shiftKey;

						if (isShiftPressed) {
							if (currentIndex <= 0) {
								focusableElements[focusableElements.length - 1].focus();
							} else {
								focusableElements[currentIndex - 1].focus();
							}
						} else {
							if (currentIndex === focusableElements.length - 1) {
								focusableElements[0].focus();
							} else {
								focusableElements[currentIndex + 1].focus();
							}
						}

						window.event?.preventDefault();
					},
				},
				this.isOpened(),
				"Overlay",
				".hs-overlay",
			);

		this.toggleButtons.forEach((toggleButton) => {
			window.HSAccessibilityObserver.registerComponent(
				toggleButton,
				{
					onEnter: () => {
						if (!this.isOpened()) this.open();
					},
					onEsc: () => {
						if (this.isOpened()) {
							this.close();
						}
					},
				},
				this.isOpened(),
				"Overlay Toggle",
				`[data-hs-overlay="#${this.el.id}"]`,
			);
		});
	}

	// Backward compatibility
	static on(
		evt: string,
		target: HSOverlay | HTMLElement | string,
		cb: Function,
	) {
		const instance = HSOverlay.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSOverlay: Function;
		$hsOverlayCollection: ICollectionItem<HSOverlay>[];
	}
}

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const debounceResize = (callback: () => void, delay: number = 150) => {
	if (resizeTimeout) clearTimeout(resizeTimeout);

	resizeTimeout = setTimeout(callback, delay);
};

const autoCloseResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.autoClose)
	) {
		return false;
	}

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.autoClose,
	);

	overlays.forEach((overlay) => {
		const { autoCloseEqualityType, autoClose } = overlay.element;
		const condition = autoCloseEqualityType === "less-than"
			? document.body.clientWidth <= autoClose
			: document.body.clientWidth >= autoClose;

		if (condition && overlay.element.el.classList.contains("opened")) {
			if (overlay.element.el.classList.contains("minified")) {
				overlay.element.minify(false);
			}

			overlay.element.close(true);
		} else {
			if (
				overlay.element.isLayoutAffect &&
				overlay.element.el.classList.contains("opened")
			) {
				document.body.classList.add("hs-overlay-body-open");
			}
		}
	});
};

const moveOverlayToBodyResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.moveOverlayToBody)
	) {
		return false;
	}

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.moveOverlayToBody,
	);

	overlays.forEach((overlay) => {
		const resolution = overlay.element.moveOverlayToBody;
		const initPlace = overlay.element.initContainer;
		const newPlace = document.querySelector("body");
		const target = overlay.element.el;

		if (!initPlace && target) return false;

		if (
			document.body.clientWidth <= resolution &&
			!isDirectChild(newPlace, target)
		) {
			newPlace.appendChild(target);
		} else if (
			document.body.clientWidth > resolution &&
			!initPlace.contains(target)
		) {
			initPlace.appendChild(target);
		}
	});
};

const setOpenedResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) => el.element.openedBreakpoint)
	) {
		return false;
	}

	const overlays = window.$hsOverlayCollection.filter(
		(el) => el.element.openedBreakpoint,
	);

	overlays.forEach((overlay) => {
		const { openedBreakpoint } = overlay.element;
		const condition = document.body.clientWidth >= openedBreakpoint;

		if (condition) {
			if (!overlay.element.el.classList.contains("opened")) {
				HSOverlay.setOpened(openedBreakpoint, overlay);
			}
		} else {
			if (overlay.element.el.classList.contains("opened")) {
				if (overlay.element.el.classList.contains("minified")) {
					overlay.element.minify(false);
				}

				overlay.element.close(true);
			}
		}
	});
};

const setBackdropZIndexResizeFn = () => {
	if (
		!window.$hsOverlayCollection.length ||
		!window.$hsOverlayCollection.find((el) =>
			el.element.el.classList.contains("opened")
		)
	) {
		return false;
	}

	const overlays = window.$hsOverlayCollection.filter((el) =>
		el.element.el.classList.contains("opened")
	);

	overlays.forEach((overlay) => {
		const overlayZIndex = parseInt(
			window.getComputedStyle(overlay.element.el).getPropertyValue("z-index"),
		);
		const backdrop: HTMLElement = document.querySelector(
			`#${overlay.element.el.id}-backdrop`,
		);
		if (!backdrop) return false;

		const backdropZIndex = parseInt(
			window.getComputedStyle(backdrop).getPropertyValue("z-index"),
		);
		if (overlayZIndex === backdropZIndex + 1) return false;

		if ("style" in backdrop) backdrop.style.zIndex = `${overlayZIndex - 1}`;

		document.body.classList.add("hs-overlay-body-open");
	});
};

const ensureBodyOpenForMinifiedSidebar = () => {
	if (!window.$hsOverlayCollection?.length) return;

	window.$hsOverlayCollection.forEach((overlayItem) => {
		const overlay = overlayItem.element;
		if (
			overlay.toggleMinifierButtons?.length > 0 &&
			overlay.openedBreakpoint
		) {
			if (document.body.clientWidth >= overlay.openedBreakpoint) {
				document.body.classList.add("hs-overlay-body-open");
			} else {
				document.body.classList.remove("hs-overlay-body-open");
			}
		}
	});
};

window.addEventListener("load", () => {
	HSOverlay.autoInit();

	moveOverlayToBodyResizeFn();
	ensureBodyOpenForMinifiedSidebar();

	// Uncomment for debug
	// console.log('Overlay collection:', window.$hsOverlayCollection);
});

window.addEventListener("resize", () => {
	debounceResize(() => {
		autoCloseResizeFn();
		setOpenedResizeFn();
	});

	moveOverlayToBodyResizeFn();
	setBackdropZIndexResizeFn();
	ensureBodyOpenForMinifiedSidebar();
});

if (typeof window !== "undefined") {
	window.HSOverlay = HSOverlay;
}

export default HSOverlay;
