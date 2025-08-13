/*
 * HSTooltip
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	type Placement,
	type Strategy,
} from "@floating-ui/dom";
import { afterTransition, dispatch, getClassProperty } from "../../utils";

import { ITooltip } from "./interfaces";
import { TTooltipOptionsScope } from "./types";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";
import { POSITIONS } from "../../constants";

class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle: HTMLElement | null;
	public content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventFloatingUI: string;
	private readonly placement: string;
	private readonly strategy: Strategy;
	private readonly scope: TTooltipOptionsScope;

	cleanupAutoUpdate: (() => void) | null = null;

	private onToggleClickListener: () => void;
	private onToggleFocusListener: () => void;
	private onToggleBlurListener: () => void;
	private onToggleMouseEnterListener: () => void;
	private onToggleMouseLeaveListener: () => void;
	private onToggleHandleListener: () => void;

	constructor(el: HTMLElement, options?: {}, events?: {}) {
		super(el, options, events);

		if (this.el) {
			this.toggle = this.el.querySelector(".hs-tooltip-toggle") || this.el;
			this.content = this.el.querySelector(".hs-tooltip-content");
			this.eventMode = getClassProperty(this.el, "--trigger") || "hover";
			// TODO:: rename "Popper" to "FLoatingUI"
			this.preventFloatingUI = getClassProperty(
				this.el,
				"--prevent-popper",
				"false",
			);
			this.placement = getClassProperty(this.el, "--placement") || "top";
			this.strategy = getClassProperty(this.el, "--strategy") as Strategy;
			this.scope =
				getClassProperty(this.el, "--scope") as TTooltipOptionsScope ||
				"parent";
		}

		if (this.el && this.toggle && this.content) this.init();
	}

	private toggleClick() {
		this.click();
	}

	private toggleFocus() {
		this.focus();
	}

	private toggleMouseEnter() {
		this.enter();
	}

	private toggleMouseLeave() {
		this.leave();
	}

	private toggleHandle() {
		this.hide();

		this.toggle.removeEventListener("click", this.onToggleHandleListener, true);
		this.toggle.removeEventListener("blur", this.onToggleHandleListener, true);
	}

	private init() {
		this.createCollection(window.$hsTooltipCollection, this);

		this.onToggleFocusListener = () => this.enter();
		this.onToggleBlurListener = () => this.hide();

		this.toggle.addEventListener("focus", this.onToggleFocusListener);
		this.toggle.addEventListener("blur", this.onToggleBlurListener);

		if (this.eventMode === "click") {
			this.onToggleClickListener = () => this.toggleClick();
			this.toggle.addEventListener("click", this.onToggleClickListener);
		} else if (this.eventMode === "hover") {
			this.onToggleMouseEnterListener = () => this.toggleMouseEnter();
			this.onToggleMouseLeaveListener = () => this.toggleMouseLeave();
			this.toggle.addEventListener(
				"mouseenter",
				this.onToggleMouseEnterListener,
			);
			this.toggle.addEventListener(
				"mouseleave",
				this.onToggleMouseLeaveListener,
			);
		}

		if (this.preventFloatingUI === "false") this.buildFloatingUI();
	}

	private enter() {
		this._show();
	}

	private leave() {
		this.hide();
	}

	private click() {
		if (this.el.classList.contains("show")) return false;

		this._show();

		this.onToggleHandleListener = () => {
			setTimeout(() => this.toggleHandle());
		};

		this.toggle.addEventListener("click", this.onToggleHandleListener, true);
		this.toggle.addEventListener("blur", this.onToggleHandleListener, true);
	}

	private focus() {
		this._show();
	}

	private async positionTooltip(
		placement: string,
	): Promise<{ x: number; y: number; placement: string }> {
		const actualPlacement = placement === "auto" ? "top" : placement;
		const fallbackPlacements =
			(placement === "auto"
				? ["bottom", "left", "right"]
				: this.getFallbackPlacements(actualPlacement)) as Placement[];
		const middlewareArr = [
			offset(5),
			flip({ fallbackPlacements }),
		];
		const result = await computePosition(this.toggle, this.content, {
			placement: actualPlacement as any,
			strategy: this.strategy || "fixed",
			middleware: middlewareArr,
		});

		return result;
	}

	private getFallbackPlacements(placement: string): Placement[] {
		switch (placement) {
			case "top":
				return ["bottom", "left", "right"] as Placement[];
			case "bottom":
				return ["top", "left", "right"] as Placement[];
			case "left":
				return ["right", "top", "bottom"] as Placement[];
			case "right":
				return ["left", "top", "bottom"] as Placement[];
			case "top-start":
				return ["bottom-start", "top-end", "bottom-end"] as Placement[];
			case "top-end":
				return ["bottom-end", "top-start", "bottom-start"] as Placement[];
			case "bottom-start":
				return ["top-start", "bottom-end", "top-end"] as Placement[];
			case "bottom-end":
				return ["top-end", "bottom-start", "top-start"] as Placement[];
			case "left-start":
				return ["right-start", "left-end", "right-end"] as Placement[];
			case "left-end":
				return ["right-end", "left-start", "right-start"] as Placement[];
			case "right-start":
				return ["left-start", "right-end", "left-end"] as Placement[];
			case "right-end":
				return ["left-end", "right-start", "left-start"] as Placement[];
			default:
				return ["top", "bottom", "left", "right"] as Placement[];
		}
	}

	private applyTooltipPosition(x: number, y: number, placement: string) {
		Object.assign(this.content.style, {
			position: this.strategy || "fixed",
			left: `${x}px`,
			top: `${y}px`,
		});
		this.content.setAttribute("data-placement", placement);
	}

	private buildFloatingUI() {
		if (this.scope === "window") document.body.appendChild(this.content);

		const isAutoPlacement = this.placement.startsWith("auto");
		const originalPlacement = getClassProperty(this.el, "--placement");
		const isDefaultPlacement = !originalPlacement || originalPlacement === "";
		const targetPlacement = isAutoPlacement
			? "auto"
			: isDefaultPlacement
			? "auto"
			: (POSITIONS[this.placement] || this.placement);

		this.positionTooltip(targetPlacement).then((result) => {
			this.applyTooltipPosition(result.x, result.y, result.placement);
		});

		this.cleanupAutoUpdate = autoUpdate(this.toggle, this.content, () => {
			this.positionTooltip(targetPlacement).then((result) => {
				Object.assign(this.content.style, {
					position: this.strategy || "fixed",
					left: `${result.x}px`,
					top: `${result.y}px`,
				});
				this.content.setAttribute("data-placement", result.placement);
			});
		});
	}

	private _show() {
		this.content.classList.remove("hidden");
		if (this.scope === "window") this.content.classList.add("show");
		if (this.preventFloatingUI === "false" && !this.cleanupAutoUpdate) {
			this.buildFloatingUI();
		}

		setTimeout(() => {
			this.el.classList.add("show");

			this.fireEvent("show", this.el);
			dispatch("show.hs.tooltip", this.el, this.el);
		});
	}

	// Public methods
	public show() {
		if (this.eventMode === "click") {
			this.click();
		} else {
			this.enter();
		}

		this.toggle.focus();
		this.toggle.style.outline = "none";
	}

	public hide() {
		this.el.classList.remove("show");
		if (this.scope === "window") this.content.classList.remove("show");

		if (this.preventFloatingUI === "false" && this.cleanupAutoUpdate) {
			this.cleanupAutoUpdate();

			this.cleanupAutoUpdate = null;
		}

		this.fireEvent("hide", this.el);
		dispatch("hide.hs.tooltip", this.el, this.el);

		afterTransition(this.content, () => {
			if (this.el.classList.contains("show")) return false;

			this.content.classList.add("hidden");

			this.toggle.style.outline = "";
		});
	}

	public destroy() {
		// Remove classes
		this.el.classList.remove("show");
		this.content.classList.add("hidden");

		// Remove listeners
		this.toggle.removeEventListener("focus", this.onToggleFocusListener);
		this.toggle.removeEventListener("blur", this.onToggleBlurListener);

		// Remove eventMode-specific listeners
		if (this.eventMode === "click") {
			this.toggle.removeEventListener("click", this.onToggleClickListener);
		} else if (this.eventMode === "hover") {
			this.toggle.removeEventListener(
				"mouseenter",
				this.onToggleMouseEnterListener,
			);
			this.toggle.removeEventListener(
				"mouseleave",
				this.onToggleMouseLeaveListener,
			);
		}

		this.toggle.removeEventListener("click", this.onToggleHandleListener, true);
		this.toggle.removeEventListener("blur", this.onToggleHandleListener, true);

		if (this.cleanupAutoUpdate) {
			this.cleanupAutoUpdate();
			this.cleanupAutoUpdate = null;
		}

		window.$hsTooltipCollection = window.$hsTooltipCollection.filter((
			{ element },
		) => element.el !== this.el);
	}

	// Static methods
	private static findInCollection(
		target: HSTooltip | HTMLElement | string,
	): ICollectionItem<HSTooltip> | null {
		return window.$hsTooltipCollection.find((el) => {
			if (target instanceof HSTooltip) return el.element.el === target.el;
			else if (typeof target === "string") {
				return el.element.el === document.querySelector(target);
			} else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance = false) {
		const elInCollection = window.$hsTooltipCollection.find(
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
		if (!window.$hsTooltipCollection) window.$hsTooltipCollection = [];

		if (window.$hsTooltipCollection) {
			window.$hsTooltipCollection = window.$hsTooltipCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll(".hs-tooltip:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsTooltipCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSTooltip(el);
				}
			});
	}

	static show(target: HSTooltip | HTMLElement | string) {
		const instance = HSTooltip.findInCollection(target);

		if (instance) instance.element.show();
	}

	static hide(target: HSTooltip | HTMLElement | string) {
		const instance = HSTooltip.findInCollection(target);

		if (instance) instance.element.hide();
	}

	// Backward compatibility
	static on(
		evt: string,
		target: HSTooltip | HTMLElement | string,
		cb: Function,
	) {
		const instance = HSTooltip.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSTooltip: Function;
		$hsTooltipCollection: ICollectionItem<HSTooltip>[];
	}
}

window.addEventListener("load", () => {
	HSTooltip.autoInit();

	// Uncomment for debug
	// console.log('Tooltip collection:', window.$hsTooltipCollection);
});

if (typeof window !== "undefined") {
	window.HSTooltip = HSTooltip;
}

export default HSTooltip;
