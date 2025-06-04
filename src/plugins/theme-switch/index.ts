/*
 * HSThemeSwitch
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { IThemeSwitch, IThemeSwitchOptions } from "../theme-switch/interfaces";

import HSBasePlugin from "../base-plugin";

import { ICollectionItem } from "../../interfaces";

class HSThemeSwitch extends HSBasePlugin<IThemeSwitchOptions>
	implements IThemeSwitch {
	public theme: string;
	public type: "change" | "click";

	private onElementChangeListener: (evt: Event) => void;
	private onElementClickListener: () => void;

	private static systemThemeObserver:
		| ((e: MediaQueryListEvent) => void)
		| null = null;

	constructor(
		el: HTMLElement | HTMLInputElement,
		options?: IThemeSwitchOptions,
	) {
		super(el, options);

		const data = el.getAttribute("data-hs-theme-switch");
		const dataOptions: IThemeSwitchOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.theme = concatOptions?.theme || localStorage.getItem("hs_theme") ||
			"default";
		this.type = concatOptions?.type || "change";

		this.init();
	}

	private elementChange(evt: Event) {
		const theme = (evt.target as HTMLInputElement).checked ? "dark" : "default";

		this.setAppearance(theme);
		this.toggleObserveSystemTheme();
	}

	private elementClick(theme: string) {
		this.setAppearance(theme);
		this.toggleObserveSystemTheme();
	}

	private init() {
		this.createCollection(window.$hsThemeSwitchCollection, this);

		if (this.theme !== "default") this.setAppearance();

		if (this.type === "click") this.buildSwitchTypeOfClick();
		else this.buildSwitchTypeOfChange();
	}

	private buildSwitchTypeOfChange() {
		(this.el as HTMLInputElement).checked = this.theme === "dark";

		this.toggleObserveSystemTheme();

		this.onElementChangeListener = (evt) => this.elementChange(evt);

		this.el.addEventListener("change", this.onElementChangeListener);
	}

	private buildSwitchTypeOfClick() {
		const theme = this.el.getAttribute("data-hs-theme-click-value");

		this.toggleObserveSystemTheme();

		this.onElementClickListener = () => this.elementClick(theme);

		this.el.addEventListener("click", this.onElementClickListener);
	}

	private setResetStyles() {
		const style = document.createElement("style");
		style.innerText = `*{transition: unset !important;}`;
		style.setAttribute("data-hs-appearance-onload-styles", "");

		document.head.appendChild(style);

		return style;
	}

	private addSystemThemeObserver() {
		if (HSThemeSwitch.systemThemeObserver) return;

		HSThemeSwitch.systemThemeObserver = (e: MediaQueryListEvent) => {
			window.$hsThemeSwitchCollection?.forEach((instance) => {
				if (localStorage.getItem("hs_theme") === "auto") {
					instance.element.setAppearance(e.matches ? "dark" : "default", false);
				}
			});
		};

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", HSThemeSwitch.systemThemeObserver);
	}

	private removeSystemThemeObserver() {
		if (!HSThemeSwitch.systemThemeObserver) return;

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", HSThemeSwitch.systemThemeObserver);

		HSThemeSwitch.systemThemeObserver = null;
	}

	private toggleObserveSystemTheme() {
		if (localStorage.getItem("hs_theme") === "auto") {
			this.addSystemThemeObserver();
		} else this.removeSystemThemeObserver();
	}

	// Public methods
	public setAppearance(
		theme = this.theme,
		isSaveToLocalStorage = true,
		isSetDispatchEvent = true,
	) {
		const html = document.querySelector("html");
		const resetStyles = this.setResetStyles();

		if (isSaveToLocalStorage) localStorage.setItem("hs_theme", theme);

		if (theme === "auto") {
			theme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "default";
		}

		html.classList.remove("light", "dark", "default", "auto");
		html.classList.add(theme);

		setTimeout(() => resetStyles.remove());

		if (isSetDispatchEvent) {
			window.dispatchEvent(
				new CustomEvent("on-hs-appearance-change", { detail: theme }),
			);
		}
	}

	public destroy() {
		// Clear listeners
		if (this.type === "change") {
			this.el.removeEventListener("change", this.onElementChangeListener);
		}
		if (this.type === "click") {
			this.el.removeEventListener("click", this.onElementClickListener);
		}

		window.$hsThemeSwitchCollection = window.$hsThemeSwitchCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsThemeSwitchCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsThemeSwitchCollection) window.$hsThemeSwitchCollection = [];

		if (window.$hsThemeSwitchCollection) {
			window.$hsThemeSwitchCollection = window.$hsThemeSwitchCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll("[data-hs-theme-switch]:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsThemeSwitchCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSThemeSwitch(el, { type: "change" });
				}
			});

		document
			.querySelectorAll(
				"[data-hs-theme-click-value]:not(.--prevent-on-load-init)",
			)
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsThemeSwitchCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSThemeSwitch(el, { type: "click" });
				}
			});
	}
}

declare global {
	interface Window {
		HSThemeSwitch: Function;
		$hsThemeSwitchCollection: ICollectionItem<HSThemeSwitch>[];
	}
}

window.addEventListener("load", () => {
	HSThemeSwitch.autoInit();

	// Uncomment for debug
	// console.log('Theme switch collection:', window.$hsThemeSwitchCollection);
});

if (window.$hsThemeSwitchCollection) {
	window.addEventListener(
		"on-hs-appearance-change",
		(evt: Event & { detail: string }) => {
			window.$hsThemeSwitchCollection.forEach((el) => {
				(el.element.el as HTMLInputElement).checked = evt.detail === "dark";
			});
		},
	);
}

if (typeof window !== "undefined") {
	window.HSThemeSwitch = HSThemeSwitch;
}

export default HSThemeSwitch;
