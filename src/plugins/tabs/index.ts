/*
 * HSTabs
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from "../../utils";

import { ITabs, ITabsOnChangePayload, ITabsOptions } from "./interfaces";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";
import { IAccessibilityComponent } from "../accessibility-manager/interfaces";
import HSAccessibilityObserver from "../accessibility-manager";

import { BREAKPOINTS } from "../../constants";

class HSTabs extends HSBasePlugin<ITabsOptions> implements ITabs {
	private accessibilityComponent: IAccessibilityComponent;

	private readonly eventType: "click" | "hover";
	private readonly preventNavigationResolution: string | number | null;

	public toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId: string | null;
	private readonly extraToggle: HTMLSelectElement | null;
	private current: HTMLElement | null;
	private currentContentId: string | null;
	public currentContent: HTMLElement | null;
	private prev: HTMLElement | null;
	private prevContentId: string | null;
	private prevContent: HTMLElement | null;

	private onToggleHandler:
		| {
			el: HTMLElement;
			fn: (evt: Event) => void;
			preventClickFn: (evt: Event) => void | null;
		}[]
		| null;
	private onExtraToggleChangeListener: (evt: Event) => void;

	constructor(el: HTMLElement, options?: ITabsOptions, events?: {}) {
		super(el, options, events);

		const data = el.getAttribute("data-hs-tabs");
		const dataOptions: ITabsOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.eventType = concatOptions.eventType ?? "click";
		this.preventNavigationResolution =
			typeof concatOptions.preventNavigationResolution === "number"
				? concatOptions.preventNavigationResolution
				: BREAKPOINTS[concatOptions.preventNavigationResolution] || null;

		this.toggles = this.el.querySelectorAll("[data-hs-tab]");
		this.extraToggleId = this.el.getAttribute("data-hs-tab-select");
		this.extraToggle = this.extraToggleId
			? (document.querySelector(this.extraToggleId) as HTMLSelectElement)
			: null;

		this.current = Array.from(this.toggles).find((el) =>
			el.classList.contains("active")
		);
		this.currentContentId = this.current?.getAttribute("data-hs-tab") || null;
		this.currentContent = this.currentContentId
			? document.querySelector(this.currentContentId)
			: null;

		this.prev = null;
		this.prevContentId = null;
		this.prevContent = null;

		this.onToggleHandler = [];

		this.init();
	}

	private toggle(el: HTMLElement) {
		this.open(el);
	}

	private extraToggleChange(evt: Event) {
		this.change(evt);
	}

	private init() {
		this.createCollection(window.$hsTabsCollection, this);

		this.toggles.forEach((el) => {
			const fn = (evt: Event) => {
				if (
					this.eventType === "click" && this.preventNavigationResolution &&
					document.body.clientWidth <= +this.preventNavigationResolution
				) evt.preventDefault();
				this.toggle(el);
			};
			const preventClickFn = (evt: Event) => {
				if (
					this.preventNavigationResolution &&
					document.body.clientWidth <= +this.preventNavigationResolution
				) evt.preventDefault();
			};

			this.onToggleHandler.push({ el, fn, preventClickFn });

			if (this.eventType === "click") el.addEventListener("click", fn);
			else {
				el.addEventListener("mouseenter", fn);
				el.addEventListener("click", preventClickFn);
			}
		});

		if (this.extraToggle) {
			this.onExtraToggleChangeListener = (evt) => this.extraToggleChange(evt);
			this.extraToggle.addEventListener(
				"change",
				this.onExtraToggleChangeListener,
			);
		}

		if (typeof window !== "undefined") {
			if (!window.HSAccessibilityObserver) {
				window.HSAccessibilityObserver = new HSAccessibilityObserver();
			}
			this.setupAccessibility();
		}
	}

	private open(el: HTMLElement) {
		this.prev = this.current;
		this.prevContentId = this.currentContentId;
		this.prevContent = this.currentContent;

		this.current = el;
		this.currentContentId = el.getAttribute("data-hs-tab");
		this.currentContent = this.currentContentId
			? document.querySelector(this.currentContentId)
			: null;

		if (this?.prev?.ariaSelected) {
			this.prev.ariaSelected = "false";
		}
		this.prev?.classList.remove("active");
		this.prevContent?.classList.add("hidden");

		if (this?.current?.ariaSelected) {
			this.current.ariaSelected = "true";
		}
		this.current.classList.add("active");
		this.currentContent?.classList.remove("hidden");

		this.fireEvent("change", {
			el,
			prev: this.prevContentId,
			current: this.currentContentId,
			tabsId: this.el.id,
		} as ITabsOnChangePayload);
		dispatch("change.hs.tab", el, {
			el,
			prev: this.prevContentId,
			current: this.currentContentId,
			tabsId: this.el.id,
		} as ITabsOnChangePayload);
	}

	private change(evt: Event) {
		const toggle: HTMLElement = document.querySelector(
			`[data-hs-tab="${(evt.target as HTMLSelectElement).value}"]`,
		);

		if (toggle) {
			if (this.eventType === "hover") {
				toggle.dispatchEvent(new Event("mouseenter"));
			} else toggle.click();
		}
	}

	// Accessibility methods
	private setupAccessibility(): void {
		this.accessibilityComponent = window.HSAccessibilityObserver
			.registerComponent(
				this.el,
				{
					onArrow: (evt: KeyboardEvent) => {
						if (evt.metaKey) return;

						const isVertical =
							this.el.getAttribute("data-hs-tabs-vertical") === "true" || this.el.getAttribute("aria-orientation") === "vertical";

						switch (evt.key) {
							case isVertical ? "ArrowUp" : "ArrowLeft":
								this.onArrow(true);
								break;
							case isVertical ? "ArrowDown" : "ArrowRight":
								this.onArrow(false);
								break;
							case "Home":
								this.onStartEnd(true);
								break;
							case "End":
								this.onStartEnd(false);
								break;
						}
					},
				},
				true,
				"Tabs",
				'[role="tablist"]',
			);
	}

	private onArrow(isOpposite = true) {
		const toggles = isOpposite
			? Array.from(this.toggles).reverse()
			: Array.from(this.toggles);
		const focused = toggles.find((el) => document.activeElement === el);
		let focusedInd = toggles.findIndex((el: any) => el === focused);
		focusedInd = focusedInd + 1 < toggles.length ? focusedInd + 1 : 0;

		toggles[focusedInd].focus();
		toggles[focusedInd].click();
	}

	private onStartEnd(isOpposite = true) {
		const toggles = isOpposite
			? Array.from(this.toggles)
			: Array.from(this.toggles).reverse();

		if (toggles.length) {
			toggles[0].focus();
			toggles[0].click();
		}
	}

	// Public methods
	public destroy() {
		this.toggles.forEach((toggle) => {
			const _toggle = this.onToggleHandler?.find(({ el }) => el === toggle);

			if (_toggle) {
				if (this.eventType === "click") {
					toggle.removeEventListener("click", _toggle.fn);
				} else {
					toggle.removeEventListener("mouseenter", _toggle.fn);
					toggle.removeEventListener("click", _toggle.preventClickFn);
				}
			}
		});

		this.onToggleHandler = [];

		if (this.extraToggle) {
			this.extraToggle.removeEventListener(
				"change",
				this.onExtraToggleChangeListener,
			);
		}

		if (typeof window !== "undefined" && window.HSAccessibilityObserver) {
			window.HSAccessibilityObserver.unregisterComponent(
				this.accessibilityComponent,
			);
		}

		window.$hsTabsCollection = window.$hsTabsCollection.filter(({ element }) =>
			element.el !== this.el
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsTabsCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element
			: null;
	}

	static autoInit() {
		if (!window.$hsTabsCollection) {
			window.$hsTabsCollection = [];
		}

		if (window.$hsTabsCollection) {
			window.$hsTabsCollection = window.$hsTabsCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll(
				'[role="tablist"]:not(select):not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsTabsCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSTabs(el);
				}
			});
	}

	static open(target: HTMLElement) {
		const elInCollection = window.$hsTabsCollection.find((el) =>
			Array.from(el.element.toggles).includes(
				typeof target === "string" ? document.querySelector(target) : target,
			)
		);

		const targetInCollection = elInCollection
			? Array.from(elInCollection.element.toggles).find(
				(el) =>
					el ===
						(typeof target === "string"
							? document.querySelector(target)
							: target),
			)
			: null;

		if (
			targetInCollection && !targetInCollection.classList.contains("active")
		) {
			elInCollection.element.open(targetInCollection);
		}
	}

	// Backward compatibility
	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsTabsCollection.find((el) =>
			Array.from(el.element.toggles).includes(
				typeof target === "string" ? document.querySelector(target) : target,
			)
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSTabs: typeof HSTabs;
		$hsTabsCollection: ICollectionItem<HSTabs>[];
	}
}

window.addEventListener("load", () => {
	HSTabs.autoInit();
});

if (typeof window !== "undefined") {
	window.HSTabs = HSTabs;
}

export default HSTabs;
