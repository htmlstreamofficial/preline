/*
 * HSDropdown
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	afterTransition,
	dispatch,
	getClassProperty,
	getClassPropertyAlt,
	isIOS,
	isIpadOS,
	stringToBoolean,
} from "../../utils";

import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	type Placement,
	type Strategy,
	VirtualElement,
} from "@floating-ui/dom";

import { IDropdown, IHTMLElementFloatingUI } from "../dropdown/interfaces";
import HSBasePlugin from "../base-plugin";
import HSAccessibilityObserver from "../accessibility-manager";
import { ICollectionItem } from "../../interfaces";
import { IAccessibilityComponent } from "../accessibility-manager/interfaces";

import { POSITIONS } from "../../constants";

class HSDropdown extends HSBasePlugin<{}, IHTMLElementFloatingUI>
	implements IDropdown {
	private accessibilityComponent: IAccessibilityComponent;

	private readonly toggle: HTMLElement | null;
	private readonly closers: HTMLElement[] | null;
	public menu: HTMLElement | null;
	private eventMode: string;
	private closeMode: string;
	private hasAutofocus: boolean;
	private autofocusOnKeyboardOnly: boolean;
	private animationInProcess: boolean;
	private longPressTimer: number | null = null;
	private openedViaKeyboard: boolean = false;

	private onElementMouseEnterListener: () => void | null;
	private onElementMouseLeaveListener: () => void | null;
	private onToggleClickListener: (evt: Event) => void | null;
	private onToggleContextMenuListener: (evt: Event) => void | null;
	private onTouchStartListener: ((evt: TouchEvent) => void) | null = null;
	private onTouchEndListener: ((evt: TouchEvent) => void) | null = null;
	private onCloserClickListener:
		| {
			el: HTMLButtonElement;
			fn: () => void;
		}[]
		| null;

	constructor(el: IHTMLElementFloatingUI, options?: {}, events?: {}) {
		super(el, options, events);

		this.toggle = this.el.querySelector(":scope > .hs-dropdown-toggle") ||
			this.el.querySelector(
				":scope > .hs-dropdown-toggle-wrapper > .hs-dropdown-toggle",
			) ||
			(this.el.children[0] as HTMLElement);
		this.closers =
			Array.from(this.el.querySelectorAll(":scope .hs-dropdown-close")) || null;
		this.menu = this.el.querySelector(":scope > .hs-dropdown-menu");
		this.eventMode = getClassProperty(this.el, "--trigger", "click");
		this.closeMode = getClassProperty(this.el, "--auto-close", "true");
		this.hasAutofocus = stringToBoolean(
			getClassProperty(this.el, "--has-autofocus", "true") || "true",
		);
		this.autofocusOnKeyboardOnly = stringToBoolean(
			getClassProperty(this.el, "--autofocus-on-keyboard-only", "true") ||
				"true",
		);
		this.animationInProcess = false;

		this.onCloserClickListener = [];

		if (this.toggle && this.menu) this.init();
	}

	private elementMouseEnter() {
		this.onMouseEnterHandler();
	}

	private elementMouseLeave() {
		this.onMouseLeaveHandler();
	}

	private toggleClick(evt: Event) {
		this.onClickHandler(evt);
	}

	private toggleContextMenu(evt: MouseEvent) {
		evt.preventDefault();

		this.onContextMenuHandler(evt);
	}

	private handleTouchStart(evt: TouchEvent): void {
		this.longPressTimer = window.setTimeout(() => {
			evt.preventDefault();

			const touch = evt.touches[0];
			const contextMenuEvent = new MouseEvent("contextmenu", {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: touch.clientX,
				clientY: touch.clientY,
			});

			if (this.toggle) this.toggle.dispatchEvent(contextMenuEvent);
		}, 400);
	}

	private handleTouchEnd(evt: TouchEvent): void {
		if (this.longPressTimer) {
			clearTimeout(this.longPressTimer);

			this.longPressTimer = null;
		}
	}

	private closerClick() {
		this.close();
	}

	private init() {
		this.createCollection(window.$hsDropdownCollection, this);

		if ((this.toggle as HTMLButtonElement).disabled) return false;

		if (this.toggle) this.buildToggle();
		if (this.menu) this.buildMenu();
		if (this.closers) this.buildClosers();

		if (!isIOS() && !isIpadOS()) {
			this.onElementMouseEnterListener = () => this.elementMouseEnter();
			this.onElementMouseLeaveListener = () => this.elementMouseLeave();

			this.el.addEventListener("mouseenter", this.onElementMouseEnterListener);
			this.el.addEventListener("mouseleave", this.onElementMouseLeaveListener);
		}

		if (typeof window !== "undefined") {
			if (!window.HSAccessibilityObserver) {
				window.HSAccessibilityObserver = new HSAccessibilityObserver();
			}
			this.setupAccessibility();
		}
	}

	resizeHandler() {
		this.eventMode = getClassProperty(this.el, "--trigger", "click");
		this.closeMode = getClassProperty(this.el, "--auto-close", "true");
		this.hasAutofocus = stringToBoolean(
			getClassProperty(this.el, "--has-autofocus", "true") || "true",
		);
		this.autofocusOnKeyboardOnly = stringToBoolean(
			getClassProperty(this.el, "--autofocus-on-keyboard-only", "true") ||
				"true",
		);
	}

	private isOpen(): boolean {
		return this.el.classList.contains("open") &&
			!this.menu.classList.contains("hidden");
	}

	private buildToggle() {
		if (this?.toggle?.ariaExpanded) {
			if (this.el.classList.contains("open")) this.toggle.ariaExpanded = "true";
			else this.toggle.ariaExpanded = "false";
		}

		if (this.eventMode === "contextmenu") {
			this.onToggleContextMenuListener = (evt: MouseEvent) =>
				this.toggleContextMenu(evt);
			this.onTouchStartListener = this.handleTouchStart.bind(this);
			this.onTouchEndListener = this.handleTouchEnd.bind(this);

			this.toggle.addEventListener(
				"contextmenu",
				this.onToggleContextMenuListener,
			);
			this.toggle.addEventListener("touchstart", this.onTouchStartListener, {
				passive: false,
			});
			this.toggle.addEventListener("touchend", this.onTouchEndListener);
			this.toggle.addEventListener("touchmove", this.onTouchEndListener);
		} else {
			this.onToggleClickListener = (evt) => this.toggleClick(evt);

			this.toggle.addEventListener("click", this.onToggleClickListener);
		}
	}

	private buildMenu() {
		this.menu.role = this.menu.getAttribute("role") || "menu";
		this.menu.tabIndex = -1;

		const checkboxes = this.menu.querySelectorAll('[role="menuitemcheckbox"]');
		const radiobuttons = this.menu.querySelectorAll('[role="menuitemradio"]');

		checkboxes.forEach((el: HTMLElement) =>
			el.addEventListener("click", () => this.selectCheckbox(el))
		);
		radiobuttons.forEach((el: HTMLElement) =>
			el.addEventListener("click", () => this.selectRadio(el))
		);

		this.menu.addEventListener("click", (evt) => {
			const target = evt.target as HTMLElement;

			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.tagName === "BUTTON" ||
				target.tagName === "A" ||
				target.closest("button") ||
				target.closest("a") ||
				target.closest("input") ||
				target.closest("textarea") ||
				target.closest("select")
			) {
				return;
			}

			this.menu.focus();
		});
	}

	private buildClosers() {
		this.closers.forEach((el: HTMLButtonElement) => {
			this.onCloserClickListener.push({
				el,
				fn: () => this.closerClick(),
			});

			el.addEventListener(
				"click",
				this.onCloserClickListener.find((closer) => closer.el === el).fn,
			);
		});
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

	private onContextMenuHandler(evt: MouseEvent) {
		const virtualElement: VirtualElement = {
			getBoundingClientRect: () => new DOMRect(),
		};
		virtualElement.getBoundingClientRect = () =>
			new DOMRect(evt.clientX, evt.clientY, 0, 0);

		HSDropdown.closeCurrentlyOpened();

		if (
			this.el.classList.contains("open") &&
			!this.menu.classList.contains("hidden")
		) {
			this.close();

			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		} else {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${this.getScrollbarSize()}px`;

			this.open(virtualElement);
		}
	}

	private onClickHandler(evt: Event) {
		const isMouseHoverTrigger = this.eventMode === "hover" &&
			window.matchMedia("(hover: hover)").matches &&
			(evt as PointerEvent).pointerType === "mouse";

		if (isMouseHoverTrigger) {
			const el = evt.currentTarget as HTMLElement;
			const isAnchor = el.tagName === "A";
			const isNavLink = isAnchor && el.hasAttribute("href") &&
				el.getAttribute("href") !== "#";

			if (!isNavLink) {
				evt.preventDefault();
				evt.stopPropagation();
				evt.stopImmediatePropagation?.();
			}

			return false;
		}

		if (
			this.el.classList.contains("open") &&
			!this.menu.classList.contains("hidden")
		) {
			this.close();
		} else {
			this.open();
		}
	}

	private onMouseEnterHandler() {
		if (this.eventMode !== "hover") return false;

		if (
			!this.el._floatingUI ||
			(
				this.el._floatingUI &&
				!this.el.classList.contains("open")
			)
		) this.forceClearState();

		if (
			!this.el.classList.contains("open") &&
			this.menu.classList.contains("hidden")
		) {
			this.open();
		}
	}

	private onMouseLeaveHandler() {
		if (this.eventMode !== "hover") return false;

		if (
			this.el.classList.contains("open") &&
			!this.menu.classList.contains("hidden")
		) {
			this.close();
		}
	}

	private destroyFloatingUI() {
		const scope =
			(window.getComputedStyle(this.el).getPropertyValue("--scope") || "")
				.trim();

		this.menu.classList.remove("block");
		this.menu.classList.add("hidden");

		this.menu.style.inset = null;
		this.menu.style.position = null;

		if (this.el && this.el._floatingUI) {
			this.el._floatingUI.destroy();
			this.el._floatingUI = null;
		}

		if (scope === "window") this.el.appendChild(this.menu);

		this.animationInProcess = false;
	}

	private focusElement() {
		const input: HTMLInputElement = this.menu.querySelector("[autofocus]");

		if (input) {
			input.focus();

			return true;
		}

		const menuItems = this.menu.querySelectorAll(
			'a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])',
		);

		if (menuItems.length > 0) {
			const firstItem = menuItems[0] as HTMLElement;

			firstItem.focus();

			return true;
		}

		return false;
	}

	private setupFloatingUI(target?: VirtualElement | HTMLElement) {
		const _target = target || this.el;
		const computedStyle = window.getComputedStyle(this.el);

		const placementCss = (computedStyle.getPropertyValue("--placement") || "")
			.trim();
		const flipCss = (computedStyle.getPropertyValue("--flip") || "true").trim();
		const strategyCss =
			(computedStyle.getPropertyValue("--strategy") || "fixed").trim();
		const offsetCss = (computedStyle.getPropertyValue("--offset") || "10")
			.trim();
		const gpuAccelerationCss =
			(computedStyle.getPropertyValue("--gpu-acceleration") || "true").trim();
		const adaptive =
			(window.getComputedStyle(this.el).getPropertyValue("--adaptive") ||
				"adaptive").replace(" ", "");

		const strategy = strategyCss as Strategy;
		const offsetValue = parseInt(offsetCss, 10);
		const placement: Placement = POSITIONS[placementCss] || "bottom-start";

		const middleware = [
			...(flipCss === "true" ? [flip()] : []),
			offset(offsetValue),
		];

		const options = {
			placement,
			strategy,
			middleware,
		};

		const checkSpaceAndAdjust = (x: number) => {
			const menuRect = this.menu.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const scrollbarWidth = window.innerWidth -
				document.documentElement.clientWidth;
			const availableWidth = viewportWidth - scrollbarWidth;

			if (x + menuRect.width > availableWidth) {
				x = availableWidth - menuRect.width;
			}

			if (x < 0) x = 0;

			return x;
		};

		const update = () => {
			computePosition(_target, this.menu, options).then(
				({ x, y, placement: computedPlacement }) => {
					const adjustedX = checkSpaceAndAdjust(x);

					if (strategy === "absolute" && adaptive === "none") {
						Object.assign(this.menu.style, {
							position: strategy,
							margin: "0",
						});
					} else if (strategy === "absolute") {
						Object.assign(this.menu.style, {
							position: strategy,
							transform: `translate3d(${x}px, ${y}px, 0px)`,
							margin: "0",
						});
					} else {
						if (gpuAccelerationCss === "true") {
							Object.assign(this.menu.style, {
								position: strategy,
								left: "",
								top: "",
								inset: "0px auto auto 0px",
								margin: "0",
								transform: `translate3d(${
									adaptive === "adaptive" ? adjustedX : 0
								}px, ${y}px, 0)`,
							});
						} else {
							Object.assign(this.menu.style, {
								position: strategy,
								left: `${x}px`,
								top: `${y}px`,
								transform: "",
							});
						}
					}

					this.menu.setAttribute("data-placement", computedPlacement);
				},
			);
		};

		update();

		const cleanup = autoUpdate(_target, this.menu, update);

		return {
			update,
			destroy: cleanup,
		};
	}

	private selectCheckbox(target: HTMLElement) {
		target.ariaChecked = target.ariaChecked === "true" ? "false" : "true";
	}

	private selectRadio(target: HTMLElement) {
		if (target.ariaChecked === "true") return false;
		const group = target.closest(".group");
		const items = group.querySelectorAll('[role="menuitemradio"]');
		const otherItems = Array.from(items).filter((el) => el !== target);
		otherItems.forEach((el) => {
			el.ariaChecked = "false";
		});
		target.ariaChecked = "true";
	}

	// Public methods
	// TODO:: rename "Popper" to "FLoatingUI"
	public calculatePopperPosition(target?: VirtualElement | HTMLElement) {
		const floatingUIInstance = this.setupFloatingUI(target);
		const floatingUIPosition = this.menu.getAttribute("data-placement");

		floatingUIInstance.update();
		floatingUIInstance.destroy();

		return floatingUIPosition;
	}

	public open(
		target?: VirtualElement | HTMLElement,
		openedViaKeyboard: boolean = false,
	) {
		if (this.el.classList.contains("open") || this.animationInProcess) {
			return false;
		}

		this.openedViaKeyboard = openedViaKeyboard;
		this.animationInProcess = true;
		this.menu.style.cssText = "";

		const _target = target || this.el;
		const computedStyle = window.getComputedStyle(this.el);
		const scope = (computedStyle.getPropertyValue("--scope") || "").trim();
		const strategyCss =
			(computedStyle.getPropertyValue("--strategy") || "fixed").trim();
		const strategy = strategyCss as Strategy;

		if (scope === "window") document.body.appendChild(this.menu);

		if (strategy !== ("static" as Strategy)) {
			this.el._floatingUI = this.setupFloatingUI(_target);
		}

		this.menu.style.margin = null;
		this.menu.classList.remove("hidden");
		this.menu.classList.add("block");

		setTimeout(() => {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "true";
			this.el.classList.add("open");

			if (window.HSAccessibilityObserver && this.accessibilityComponent) {
				window.HSAccessibilityObserver.updateComponentState(
					this.accessibilityComponent,
					true,
				);
			}

			if (scope === "window") this.menu.classList.add("open");

			this.animationInProcess = false;

			if (
				this.hasAutofocus &&
				(!this.autofocusOnKeyboardOnly || this.openedViaKeyboard)
			) this.focusElement();

			this.fireEvent("open", this.el);
			dispatch("open.hs.dropdown", this.el, this.el);
		});
	}

	public close(isAnimated = true) {
		if (this.animationInProcess || !this.el.classList.contains("open")) {
			return false;
		}

		const scope =
			(window.getComputedStyle(this.el).getPropertyValue("--scope") || "")
				.trim();

		const clearAfterClose = () => {
			this.menu.style.margin = null;
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "false";
			this.el.classList.remove("open");

			this.openedViaKeyboard = false;

			this.fireEvent("close", this.el);
			dispatch("close.hs.dropdown", this.el, this.el);
		};

		this.animationInProcess = true;

		if (scope === "window") this.menu.classList.remove("open");

		if (window.HSAccessibilityObserver && this.accessibilityComponent) {
			window.HSAccessibilityObserver.updateComponentState(
				this.accessibilityComponent,
				false,
			);
		}

		if (isAnimated) {
			const el: HTMLElement =
				this.el.querySelector("[data-hs-dropdown-transition]") || this.menu;
			let hasCompleted = false;

			const completeClose = () => {
				if (hasCompleted) return;

				hasCompleted = true;

				this.destroyFloatingUI();
			};

			afterTransition(el, completeClose);

			const computedStyle = window.getComputedStyle(el);
			const transitionDuration = computedStyle.getPropertyValue(
				"transition-duration",
			);
			const duration = parseFloat(transitionDuration) * 1000 || 150;

			setTimeout(completeClose, duration + 50);
		} else {
			this.destroyFloatingUI();
		}

		clearAfterClose();
	}

	public forceClearState() {
		this.destroyFloatingUI();

		this.menu.style.margin = null;
		this.el.classList.remove("open");
		this.menu.classList.add("hidden");

		this.openedViaKeyboard = false;
	}

	public destroy() {
		// Remove listeners
		if (!isIOS() && !isIpadOS()) {
			this.el.removeEventListener(
				"mouseenter",
				this.onElementMouseEnterListener,
			);
			this.el.removeEventListener(
				"mouseleave",
				() => this.onElementMouseLeaveListener,
			);

			this.onElementMouseEnterListener = null;
			this.onElementMouseLeaveListener = null;
		}

		if (this.eventMode === "contextmenu") {
			if (this.toggle) {
				this.toggle.removeEventListener(
					"contextmenu",
					this.onToggleContextMenuListener,
				);
				this.toggle.removeEventListener(
					"touchstart",
					this.onTouchStartListener,
				);
				this.toggle.removeEventListener("touchend", this.onTouchEndListener);
				this.toggle.removeEventListener("touchmove", this.onTouchEndListener);
			}

			this.onToggleContextMenuListener = null;
			this.onTouchStartListener = null;
			this.onTouchEndListener = null;
		} else {
			if (this.toggle) {
				this.toggle.removeEventListener("click", this.onToggleClickListener);
			}

			this.onToggleClickListener = null;
		}

		if (this.closers.length) {
			this.closers.forEach((el: HTMLButtonElement) => {
				el.removeEventListener(
					"click",
					this.onCloserClickListener.find((closer) => closer.el === el).fn,
				);
			});

			this.onCloserClickListener = null;
		}

		// Remove classes
		this.el.classList.remove("open");

		this.destroyFloatingUI();

		window.$hsDropdownCollection = window.$hsDropdownCollection.filter((
			{ element },
		) => element.el !== this.el);

		// Unregister accessibility
		// if (typeof window !== "undefined" && window.HSAccessibilityObserver) {
		// 	window.HSAccessibilityObserver.unregisterPlugin(this);
		// }
	}

	// Static methods
	private static findInCollection(
		target: HSDropdown | HTMLElement | string,
	): ICollectionItem<HSDropdown> | null {
		return window.$hsDropdownCollection.find((el) => {
			if (target instanceof HSDropdown) return el.element.el === target.el;
			else if (typeof target === "string") {
				return el.element.el === document.querySelector(target);
			} else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsDropdownCollection.find(
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
		if (!window.$hsDropdownCollection) {
			window.$hsDropdownCollection = [];

			window.addEventListener("click", (evt) => {
				const evtTarget = evt.target;

				HSDropdown.closeCurrentlyOpened(evtTarget as HTMLElement);
			});

			let prevWidth = window.innerWidth;
			window.addEventListener("resize", () => {
				if (window.innerWidth !== prevWidth) {
					prevWidth = innerWidth;
					HSDropdown.closeCurrentlyOpened(null, false);
				}
			});
		}

		if (window.$hsDropdownCollection) {
			window.$hsDropdownCollection = window.$hsDropdownCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll(".hs-dropdown:not(.--prevent-on-load-init)")
			.forEach((el: IHTMLElementFloatingUI) => {
				if (
					!window.$hsDropdownCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					new HSDropdown(el);
				}
			});
	}

	static open(
		target: HSDropdown | HTMLElement | string,
		openedViaKeyboard: boolean = false,
	) {
		const instance = HSDropdown.findInCollection(target);

		if (
			instance &&
			instance.element.menu.classList.contains("hidden")
		) instance.element.open(undefined, openedViaKeyboard);
	}

	static close(target: HSDropdown | HTMLElement | string) {
		const instance = HSDropdown.findInCollection(target);

		if (
			instance &&
			!instance.element.menu.classList.contains("hidden")
		) instance.element.close();
	}

	static closeCurrentlyOpened(
		evtTarget: HTMLElement | null = null,
		isAnimated = true,
	) {
		const parent = evtTarget &&
				evtTarget.closest(".hs-dropdown") &&
				evtTarget.closest(".hs-dropdown").parentElement.closest(".hs-dropdown")
			? evtTarget
				.closest(".hs-dropdown")
				.parentElement.closest(".hs-dropdown")
			: null;
		let currentlyOpened = parent
			? window.$hsDropdownCollection.filter(
				(el) =>
					el.element.el.classList.contains("open") &&
					el.element.menu
							.closest(".hs-dropdown")
							.parentElement.closest(".hs-dropdown") === parent,
			)
			: window.$hsDropdownCollection.filter((el) =>
				el.element.el.classList.contains("open")
			);

		if (evtTarget) {
			const dropdownElement = evtTarget.closest(".hs-dropdown") as HTMLElement;

			if (dropdownElement) {
				if (getClassPropertyAlt(dropdownElement, "--auto-close") === "inside") {
					currentlyOpened = currentlyOpened.filter(
						(el) => el.element.el !== dropdownElement,
					);
				}
			} else {
				const dropdownMenu = evtTarget.closest(".hs-dropdown-menu");

				if (dropdownMenu) {
					const originalDropdown = window.$hsDropdownCollection.find(
						(item) => item.element.menu === dropdownMenu,
					);

					if (
						originalDropdown &&
						getClassPropertyAlt(originalDropdown.element.el, "--auto-close") ===
							"inside"
					) {
						currentlyOpened = currentlyOpened.filter(
							(el) => el.element.el !== originalDropdown.element.el,
						);
					}
				}
			}
		}

		if (currentlyOpened) {
			currentlyOpened.forEach((el) => {
				if (
					el.element.closeMode === "false" ||
					el.element.closeMode === "outside"
				) {
					return false;
				}

				el.element.close(isAnimated);
			});
		}

		if (currentlyOpened) {
			currentlyOpened.forEach((el) => {
				if (getClassPropertyAlt(el.element.el, "--trigger") !== "contextmenu") {
					return false;
				}

				document.body.style.overflow = "";
				document.body.style.paddingRight = "";
			});
		}
	}

	// Accessibility methods
	private setupAccessibility(): void {
		this.accessibilityComponent = window.HSAccessibilityObserver
			.registerComponent(
				this.el,
				{
					onEnter: () => {
						if (!this.isOpened()) this.open(undefined, true);
					},
					onSpace: () => {
						if (!this.isOpened()) this.open(undefined, true);
					},
					onEsc: () => {
						if (this.isOpened()) {
							this.close();
							if (this.toggle) this.toggle.focus();
						}
					},
					onArrow: (evt: KeyboardEvent) => {
						if (evt.metaKey) return;

						switch (evt.key) {
							case "ArrowDown":
								if (!this.isOpened()) this.open(undefined, true);
								else this.focusMenuItem("next");
								break;
							case "ArrowUp":
								if (this.isOpened()) this.focusMenuItem("prev");
								break;
							case "ArrowRight":
								this.onArrowX(evt, "right");
								break;
							case "ArrowLeft":
								this.onArrowX(evt, "left");
								break;
						}
					},
					onHome: () => {
						if (this.isOpened()) this.onStartEnd(true);
					},
					onEnd: () => {
						if (this.isOpened()) this.onStartEnd(false);
					},
					onTab: () => {
						if (this.isOpened()) this.close();
					},
					onFirstLetter: (key: string) => {
						if (this.isOpened()) this.onFirstLetter(key);
					},
				},
				this.isOpened(),
				"Dropdown",
				".hs-dropdown",
				this.menu,
			);
	}

	private onFirstLetter(key: string): void {
		if (!this.isOpened() || !this.menu) return;

		const menuItems = this.menu.querySelectorAll(
			'a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])',
		);

		if (menuItems.length === 0) return;

		const currentIndex = Array.from(menuItems).indexOf(
			document.activeElement as HTMLElement,
		);

		for (let i = 1; i <= menuItems.length; i++) {
			const index = (currentIndex + i) % menuItems.length;
			const text =
				(menuItems[index] as HTMLElement).textContent?.trim().toLowerCase() ||
				"";

			if (text.startsWith(key.toLowerCase())) {
				(menuItems[index] as HTMLElement).focus();

				return;
			}
		}

		(menuItems[0] as HTMLElement).focus();
	}

	private onArrowX(evt: KeyboardEvent, direction: "left" | "right"): void {
		if (!this.isOpened()) return;

		evt.preventDefault();
		evt.stopImmediatePropagation();

		const menuItems = this.menu.querySelectorAll(
			'a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])',
		);

		if (!menuItems.length) return;

		const currentIndex = Array.from(menuItems).indexOf(
			document.activeElement as HTMLElement,
		);
		let nextIndex = -1;

		if (direction === "right") {
			nextIndex = (currentIndex + 1) % menuItems.length;
		} else {
			nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
		}

		(menuItems[nextIndex] as HTMLElement).focus();
	}

	private onStartEnd(toStart: boolean = true): void {
		if (!this.isOpened()) return;

		const menuItems = this.menu.querySelectorAll(
			'a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])',
		);

		if (!menuItems.length) return;

		const index = toStart ? 0 : menuItems.length - 1;
		(menuItems[index] as HTMLElement).focus();
	}

	private focusMenuItem(direction: "next" | "prev"): void {
		const menuItems = this.menu.querySelectorAll(
			'a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])',
		);

		if (!menuItems.length) return;

		const currentIndex = Array.from(menuItems).indexOf(
			document.activeElement as HTMLElement,
		);
		const nextIndex = direction === "next"
			? (currentIndex + 1) % menuItems.length
			: (currentIndex - 1 + menuItems.length) % menuItems.length;
		(menuItems[nextIndex] as HTMLElement).focus();
	}

	// Backward compatibility
	static on(
		evt: string,
		target: HSDropdown | HTMLElement | string,
		cb: Function,
	) {
		const instance = HSDropdown.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
	}

	public isOpened(): boolean {
		return this.isOpen();
	}

	public containsElement(element: HTMLElement): boolean {
		return this.el.contains(element);
	}
}

declare global {
	interface Window {
		HSDropdown: Function;
		$hsDropdownCollection: ICollectionItem<HSDropdown>[];
	}
}

window.addEventListener("load", () => {
	HSDropdown.autoInit();

	// Uncomment for debug
	// console.log('Dropdown collection:', window.$hsDropdownCollection);
});

window.addEventListener("resize", () => {
	if (!window.$hsDropdownCollection) window.$hsDropdownCollection = [];

	window.$hsDropdownCollection.forEach((el) => el.element.resizeHandler());
});

if (typeof window !== "undefined") {
	window.HSDropdown = HSDropdown;
}

export default HSDropdown;
