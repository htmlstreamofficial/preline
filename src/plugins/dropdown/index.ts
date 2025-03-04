/*
 * HSDropdown
 * @version: 3.0.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	stringToBoolean,
	getClassProperty,
	getClassPropertyAlt,
	isIOS,
	isIpadOS,
	dispatch,
	afterTransition,
	menuSearchHistory,
} from '../../utils';
import { IMenuSearchHistory } from '../../utils/interfaces';

import {
	type Placement,
	type Strategy,
	computePosition,
	autoUpdate,
	offset,
	flip,
	VirtualElement,
} from '@floating-ui/dom';

import { IDropdown, IHTMLElementFloatingUI } from '../dropdown/interfaces';
import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { POSITIONS, DROPDOWN_ACCESSIBILITY_KEY_SET } from '../../constants';

class HSDropdown
	extends HSBasePlugin<{}, IHTMLElementFloatingUI>
	implements IDropdown {
	private static history: IMenuSearchHistory;
	private readonly toggle: HTMLElement | null;
	private readonly closers: HTMLElement[] | null;
	public menu: HTMLElement | null;
	private eventMode: string;
	private closeMode: string;
	private hasAutofocus: boolean;
	private animationInProcess: boolean;
	private longPressTimer: number | null = null;

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

		this.toggle =
			this.el.querySelector(':scope > .hs-dropdown-toggle') ||
			this.el.querySelector(
				':scope > .hs-dropdown-toggle-wrapper > .hs-dropdown-toggle',
			) ||
			(this.el.children[0] as HTMLElement);
		this.closers = Array.from(this.el.querySelectorAll(':scope .hs-dropdown-close')) || null;
		this.menu = this.el.querySelector(':scope > .hs-dropdown-menu');
		this.eventMode = getClassProperty(this.el, '--trigger', 'click');
		this.closeMode = getClassProperty(this.el, '--auto-close', 'true');
		this.hasAutofocus = stringToBoolean(getClassProperty(this.el, '--has-autofocus', 'true') || 'true');
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

			this.el.addEventListener('mouseenter', this.onElementMouseEnterListener);
			this.el.addEventListener('mouseleave', this.onElementMouseLeaveListener);
		}
	}

	resizeHandler() {
		this.eventMode = getClassProperty(this.el, '--trigger', 'click');
		this.closeMode = getClassProperty(this.el, '--auto-close', 'true');
	}

	private buildToggle() {
		if (this?.toggle?.ariaExpanded) {
			if (this.el.classList.contains('open')) this.toggle.ariaExpanded = 'true';
			else this.toggle.ariaExpanded = 'false';
		}

		if (this.eventMode === 'contextmenu') {
			this.onToggleContextMenuListener = (evt: MouseEvent) => this.toggleContextMenu(evt);
			this.onTouchStartListener = this.handleTouchStart.bind(this);
			this.onTouchEndListener = this.handleTouchEnd.bind(this);

			this.toggle.addEventListener('contextmenu', this.onToggleContextMenuListener);
			this.toggle.addEventListener('touchstart', this.onTouchStartListener, { passive: false });
			this.toggle.addEventListener('touchend', this.onTouchEndListener);
			this.toggle.addEventListener('touchmove', this.onTouchEndListener);
		} else {
			this.onToggleClickListener = (evt) => this.toggleClick(evt);

			this.toggle.addEventListener('click', this.onToggleClickListener);
		}
	}

	private buildMenu() {
		this.menu.role = this.menu.getAttribute('role') || 'menu';

		const checkboxes = this.menu.querySelectorAll('[role="menuitemcheckbox"]');
		const radiobuttons = this.menu.querySelectorAll('[role="menuitemradio"]');

		checkboxes.forEach((el: HTMLElement) => el.addEventListener('click', () => this.selectCheckbox(el)));
		radiobuttons.forEach((el: HTMLElement) => el.addEventListener('click', () => this.selectRadio(el)));
	}

	private buildClosers() {
		this.closers.forEach((el: HTMLButtonElement) => {
			this.onCloserClickListener.push({
				el,
				fn: () => this.closerClick(),
			});

			el.addEventListener(
				'click',
				this.onCloserClickListener.find((closer) => closer.el === el).fn,
			);
		});
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

	private onContextMenuHandler(evt: MouseEvent) {
		const virtualElement: VirtualElement = {
			getBoundingClientRect: () => new DOMRect(),
		};
		virtualElement.getBoundingClientRect = () =>
			new DOMRect(evt.clientX, evt.clientY, 0, 0);

		HSDropdown.closeCurrentlyOpened();

		if (
			this.el.classList.contains('open') &&
			!this.menu.classList.contains('hidden')
		) {
			this.close();

			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		} else {
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${this.getScrollbarSize()}px`;

			this.open(virtualElement);
		}
	}

	private onClickHandler(evt: Event) {
		if (
			this.el.classList.contains('open') &&
			!this.menu.classList.contains('hidden')
		) {
			this.close();
		} else {
			this.open();
		}
	}

	private onMouseEnterHandler() {
		if (this.eventMode !== 'hover') return false;

		if (
			!this.el._floatingUI ||
			(
				this.el._floatingUI &&
				!this.el.classList.contains('open')
			)
		) this.forceClearState();

		if (
			!this.el.classList.contains('open') &&
			this.menu.classList.contains('hidden')
		) {
			this.open();
		}
	}

	private onMouseLeaveHandler() {
		if (this.eventMode !== 'hover') return false;

		if (
			this.el.classList.contains('open') &&
			!this.menu.classList.contains('hidden')
		) {
			this.close();
		}
	}

	private destroyFloatingUI() {
		const scope = (window.getComputedStyle(this.el).getPropertyValue('--scope') || '').trim();

		this.menu.classList.remove('block');
		this.menu.classList.add('hidden');

		this.menu.style.inset = null;
		this.menu.style.position = null;

		if (this.el && this.el._floatingUI) {
			this.el._floatingUI.destroy();
			this.el._floatingUI = null;
		}

		if (scope === 'window') this.el.appendChild(this.menu);

		this.animationInProcess = false;
	}

	private focusElement() {
		const input: HTMLInputElement = this.menu.querySelector('[autofocus]');

		if (!input) return false;
		else input.focus();
	}

	private setupFloatingUI(target?: VirtualElement | HTMLElement) {
		const _target = target || this.el;
		const computedStyle = window.getComputedStyle(this.el);

		const placementCss = (computedStyle.getPropertyValue('--placement') || '').trim();
		const flipCss = (computedStyle.getPropertyValue('--flip') || 'true').trim();
		const strategyCss = (computedStyle.getPropertyValue('--strategy') || 'fixed').trim();
		const offsetCss = (computedStyle.getPropertyValue('--offset') || '10').trim();
		const gpuAccelerationCss = (computedStyle.getPropertyValue('--gpu-acceleration') || 'true').trim();
		const adaptive = (window.getComputedStyle(this.el).getPropertyValue('--adaptive') || 'adaptive').replace(' ', '');

		const strategy = strategyCss as Strategy;
		const offsetValue = parseInt(offsetCss, 10);
		const placement: Placement = POSITIONS[placementCss] || 'bottom-start';

		const middleware = [
			...(flipCss === 'true' ? [flip()] : []),
			offset(offsetValue),
		];

		const options = {
			placement,
			strategy,
			middleware,
		};

		const update = () => {
			computePosition(_target, this.menu, options).then(({ x, y, placement: computedPlacement }) => {
				if (strategy === 'absolute' && adaptive === 'none') {
					Object.assign(this.menu.style, {
						position: strategy,
						margin: '0'
					});
				} else if (strategy === 'absolute') {
					Object.assign(this.menu.style, {
						position: strategy,
						transform: `translate3d(${x}px, ${y}px, 0px)`,
						margin: '0'
					});
				} else {
					if (gpuAccelerationCss === 'true') {
						Object.assign(this.menu.style, {
							position: strategy,
							left: '',
							top: '',
							inset: '0px auto auto 0px',
							margin: '0',
							transform: `translate3d(${adaptive === 'adaptive' ? x : 0}px, ${y}px, 0)`,
						});
					} else {
						Object.assign(this.menu.style, {
							position: strategy,
							left: `${x}px`,
							top: `${y}px`,
							transform: '',
						});
					}
				}

				this.menu.setAttribute('data-placement', computedPlacement);
			});
		};

		update();

		const cleanup = autoUpdate(_target, this.menu, update);

		return {
			update,
			destroy: cleanup,
		};
	}

	private selectCheckbox(target: HTMLElement) {
		target.ariaChecked = target.ariaChecked === 'true' ? 'false' : 'true';
	}

	private selectRadio(target: HTMLElement) {
		if (target.ariaChecked === 'true') return false;
		const group = target.closest('.group');
		const items = group.querySelectorAll('[role="menuitemradio"]');
		const otherItems = Array.from(items).filter((el) => el !== target);
		otherItems.forEach((el) => {
			el.ariaChecked = 'false';
		});
		target.ariaChecked = 'true';
	}

	// Public methods
	// TODO:: rename "Popper" to "FLoatingUI"
	public calculatePopperPosition(target?: VirtualElement | HTMLElement) {
		const floatingUIInstance = this.setupFloatingUI(target);
		const floatingUIPosition = this.menu.getAttribute('data-placement');

		floatingUIInstance.update();
		floatingUIInstance.destroy();

		return floatingUIPosition;
	}

	public open(target?: VirtualElement | HTMLElement) {
		if (this.el.classList.contains('open') || this.animationInProcess) return false;

		this.animationInProcess = true;

		const _target = target || this.el;
		const computedStyle = window.getComputedStyle(this.el);
		const scope = (computedStyle.getPropertyValue('--scope') || '').trim();
		const strategyCss = (computedStyle.getPropertyValue('--strategy') || 'fixed').trim();
		const strategy = strategyCss as Strategy;

		if (scope === 'window') document.body.appendChild(this.menu);

		if (strategy !== ('static' as Strategy)) this.el._floatingUI = this.setupFloatingUI(_target);

		this.menu.style.margin = null;
		this.menu.classList.remove('hidden');
		this.menu.classList.add('block');

		setTimeout(() => {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'true';
			this.el.classList.add('open');

			if (scope === 'window') this.menu.classList.add('open');

			this.animationInProcess = false;

			if (this.hasAutofocus) this.focusElement();

			this.fireEvent('open', this.el);
			dispatch('open.hs.dropdown', this.el, this.el);
		});
	}

	public close(isAnimated = true) {
		if (this.animationInProcess || !this.el.classList.contains('open')) return false;

		const scope = (window.getComputedStyle(this.el).getPropertyValue('--scope') || '').trim();

		const clearAfterClose = () => {
			this.menu.style.margin = null;
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'false';
			this.el.classList.remove('open');
			this.fireEvent('close', this.el);
			dispatch('close.hs.dropdown', this.el, this.el);
		};

		this.animationInProcess = true;

		if (scope === 'window') this.menu.classList.remove('open');

		if (isAnimated) {
			const el: HTMLElement = this.el.querySelector('[data-hs-dropdown-transition]') || this.menu;

			afterTransition(el, () => this.destroyFloatingUI());
		} else {
			this.destroyFloatingUI();
		}

		clearAfterClose();
	}

	public forceClearState() {
		this.destroyFloatingUI();

		this.menu.style.margin = null;
		this.el.classList.remove('open');
		this.menu.classList.add('hidden');
	}

	public destroy() {
		// Remove listeners
		if (!isIOS() && !isIpadOS()) {
			this.el.removeEventListener('mouseenter', this.onElementMouseEnterListener);
			this.el.removeEventListener('mouseleave', () => this.onElementMouseLeaveListener);

			this.onElementMouseEnterListener = null;
			this.onElementMouseLeaveListener = null;
		}

		if (this.eventMode === 'contextmenu') {
			if (this.toggle) {
				this.toggle.removeEventListener('contextmenu', this.onToggleContextMenuListener);
				this.toggle.removeEventListener('touchstart', this.onTouchStartListener);
				this.toggle.removeEventListener('touchend', this.onTouchEndListener);
				this.toggle.removeEventListener('touchmove', this.onTouchEndListener);
			}

			this.onToggleContextMenuListener = null;
			this.onTouchStartListener = null;
			this.onTouchEndListener = null;
		} else {
			if (this.toggle) this.toggle.removeEventListener('click', this.onToggleClickListener);

			this.onToggleClickListener = null;
		}

		if (this.closers.length) {
			this.closers.forEach((el: HTMLButtonElement) => {
				el.removeEventListener('click', this.onCloserClickListener.find((closer) => closer.el === el).fn);
			});

			this.onCloserClickListener = null;
		}

		// Remove classes
		this.el.classList.remove('open');

		this.destroyFloatingUI();

		window.$hsDropdownCollection = window.$hsDropdownCollection.filter(({ element }) => element.el !== this.el);
	}

	// Static methods
	private static findInCollection(target: HSDropdown | HTMLElement | string): ICollectionItem<HSDropdown> | null {
		return window.$hsDropdownCollection.find((el) => {
			if (target instanceof HSDropdown) return el.element.el === target.el;
			else if (typeof target === 'string') return el.element.el === document.querySelector(target);
			else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsDropdownCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsDropdownCollection) {
			window.$hsDropdownCollection = [];

			document.addEventListener('keydown', (evt) =>
				HSDropdown.accessibility(evt),
			);

			window.addEventListener('click', (evt) => {
				const evtTarget = evt.target;

				HSDropdown.closeCurrentlyOpened(evtTarget as HTMLElement);
			});

			let prevWidth = window.innerWidth;
			window.addEventListener('resize', () => {
				if (window.innerWidth !== prevWidth) {
					prevWidth = innerWidth;
					HSDropdown.closeCurrentlyOpened(null, false);
				}
			});
		}

		if (window.$hsDropdownCollection)
			window.$hsDropdownCollection = window.$hsDropdownCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('.hs-dropdown:not(.--prevent-on-load-init)')
			.forEach((el: IHTMLElementFloatingUI) => {
				if (
					!window.$hsDropdownCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSDropdown(el);
			});
	}

	static open(target: HSDropdown | HTMLElement | string) {
		const instance = HSDropdown.findInCollection(target);

		if (
			instance &&
			instance.element.menu.classList.contains('hidden')
		) instance.element.open();
	}

	static close(target: HSDropdown | HTMLElement | string) {
		const instance = HSDropdown.findInCollection(target);

		if (
			instance &&
			!instance.element.menu.classList.contains('hidden')
		) instance.element.close();
	}

	// Accessibility methods
	static accessibility(evt: KeyboardEvent) {
		this.history = menuSearchHistory;

		const target: ICollectionItem<HSDropdown> | null =
			window.$hsDropdownCollection.find((el) =>
				el.element.el.classList.contains('open'),
			);

		if (
			target &&
			(DROPDOWN_ACCESSIBILITY_KEY_SET.includes(evt.code) ||
				(evt.code.length === 4 &&
					evt.code[evt.code.length - 1].match(/^[A-Z]*$/))) &&
			!evt.metaKey &&
			!target.element.menu.querySelector('input:focus') &&
			!target.element.menu.querySelector('textarea:focus')
		) {
			switch (evt.code) {
				case 'Escape':
					if (!target.element.menu.querySelector('.hs-select.active')) {
						evt.preventDefault();
						this.onEscape(evt);
					}
					break;
				case 'Enter':
					if (
						!target.element.menu.querySelector('.hs-select button:focus') &&
						!target.element.menu.querySelector('.hs-collapse-toggle:focus')
					) {
						this.onEnter(evt);
					}
					break;
				case 'ArrowUp':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow();
					break;
				case 'ArrowDown':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow(false);
					break;
				case 'ArrowRight':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrowX(evt, 'right');
					break;
				case 'ArrowLeft':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrowX(evt, 'left');
					break;
				case 'Home':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd();
					break;
				case 'End':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd(false);
					break;
				default:
					evt.preventDefault();
					this.onFirstLetter(evt.key);
					break;
			}
		}
	}

	static onEscape(evt: KeyboardEvent) {
		const dropdown = (evt.target as HTMLElement).closest('.hs-dropdown.open');

		if (window.$hsDropdownCollection.find((el) => el.element.el === dropdown)) {
			const target = window.$hsDropdownCollection.find(
				(el) => el.element.el === dropdown,
			);

			if (target) {
				target.element.close();
				target.element.toggle.focus();
			}
		} else {
			this.closeCurrentlyOpened();
		}
	}

	static onEnter(evt: KeyboardEvent) {
		const target = evt.target as HTMLElement;
		const { element } =
			window.$hsDropdownCollection.find(
				(el) => el.element.el === target.closest('.hs-dropdown'),
			) ?? null;

		if (element && target.classList.contains('hs-dropdown-toggle')) {
			evt.preventDefault();
			element.open();
		} else if (element && target.getAttribute('role') === 'menuitemcheckbox') {
			element.selectCheckbox(target);
			element.close();
		} else if (element && target.getAttribute('role') === 'menuitemradio') {
			element.selectRadio(target);
			element.close();
		} else {
			return false;
		}
	}

	static onArrow(isArrowUp = true) {
		const target = window.$hsDropdownCollection.find((el) =>
			el.element.el.classList.contains('open'),
		);

		if (target) {
			const menu = target.element.menu;

			if (!menu) return false;

			const preparedLinks = isArrowUp
				? Array.from(
					menu.querySelectorAll(
						'a:not([hidden]), :scope button:not([hidden]), [role="button"]:not([hidden]), [role^="menuitem"]:not([hidden])',
					),
				).reverse()
				: Array.from(
					menu.querySelectorAll(
						'a:not([hidden]), :scope button:not([hidden]), [role="button"]:not([hidden]), [role^="menuitem"]:not([hidden])',
					),
				);
			const visiblePreparedLinks = Array.from(preparedLinks).filter((item) => {
				const el = item as HTMLElement;

				return el.closest('[hidden]') === null && el.offsetParent !== null;
			});
			const links = visiblePreparedLinks.filter(
				(el: any) => !el.classList.contains('disabled'),
			);
			const current = menu.querySelector(
				'a:focus, button:focus, [role="button"]:focus, [role^="menuitem"]:focus',
			);
			let currentInd = links.findIndex((el: any) => el === current);

			if (currentInd + 1 < links.length) {
				currentInd++;
			}

			(links[currentInd] as HTMLButtonElement | HTMLAnchorElement).focus();
		}
	}

	static onArrowX(evt: KeyboardEvent, direction: 'right' | 'left') {
		const toggle = evt.target as HTMLElement;
		const closestDropdown = toggle.closest('.hs-dropdown.open');
		const isRootDropdown =
			!!closestDropdown &&
			!closestDropdown?.parentElement.closest('.hs-dropdown');
		const menuToOpen =
			(HSDropdown.getInstance(
				toggle.closest('.hs-dropdown') as HTMLElement,
				true,
			) as ICollectionItem<HSDropdown>) ?? null;
		const firstLink = menuToOpen.element.menu.querySelector(
			'a, button, [role="button"], [role^="menuitem"]',
		) as HTMLButtonElement;

		if (isRootDropdown && !toggle.classList.contains('hs-dropdown-toggle'))
			return false;

		const menuToClose =
			(HSDropdown.getInstance(
				toggle.closest('.hs-dropdown.open') as HTMLElement,
				true,
			) as ICollectionItem<HSDropdown>) ?? null;

		if (
			menuToOpen.element.el.classList.contains('open') &&
			menuToOpen.element.el._floatingUI.state.placement.includes(direction)
		) {
			firstLink.focus();

			return false;
		}

		// TODO:: rename "Popper" to "FLoatingUI"
		const futurePosition = menuToOpen.element.calculatePopperPosition();

		if (isRootDropdown && !futurePosition.includes(direction)) return false;

		if (
			futurePosition.includes(direction) &&
			toggle.classList.contains('hs-dropdown-toggle')
		) {
			menuToOpen.element.open();
			firstLink.focus();
		} else {
			menuToClose.element.close(false);
			menuToClose.element.toggle.focus();
		}
	}

	static onStartEnd(isStart = true) {
		const target = window.$hsDropdownCollection.find((el) =>
			el.element.el.classList.contains('open'),
		);

		if (target) {
			const menu = target.element.menu;

			if (!menu) return false;

			const preparedLinks = isStart
				? Array.from(
					menu.querySelectorAll(
						'a, button, [role="button"], [role^="menuitem"]',
					),
				)
				: Array.from(
					menu.querySelectorAll(
						'a, button, [role="button"], [role^="menuitem"]',
					),
				).reverse();
			const links = preparedLinks.filter(
				(el: any) => !el.classList.contains('disabled'),
			);

			if (links.length) {
				(links[0] as HTMLButtonElement).focus();
			}
		}
	}

	static onFirstLetter(code: string) {
		const target = window.$hsDropdownCollection.find((el) =>
			el.element.el.classList.contains('open'),
		);

		if (target) {
			const menu = target.element.menu;

			if (!menu) return false;

			const links = Array.from(
				menu.querySelectorAll('a, [role="button"], [role^="menuitem"]'),
			);
			const getCurrentInd = () =>
				links.findIndex(
					(el, i) =>
						(el as HTMLElement).innerText.toLowerCase().charAt(0) ===
						code.toLowerCase() && this.history.existsInHistory(i),
				);
			let currentInd = getCurrentInd();

			if (currentInd === -1) {
				this.history.clearHistory();
				currentInd = getCurrentInd();
			}

			if (currentInd !== -1) {
				(links[currentInd] as HTMLElement).focus();
				this.history.addHistory(currentInd);
			}
		}
	}

	static closeCurrentlyOpened(
		evtTarget: HTMLElement | null = null,
		isAnimated = true,
	) {
		const parent =
			evtTarget &&
				evtTarget.closest('.hs-dropdown') &&
				evtTarget.closest('.hs-dropdown').parentElement.closest('.hs-dropdown')
				? evtTarget
					.closest('.hs-dropdown')
					.parentElement.closest('.hs-dropdown')
				: null;
		let currentlyOpened = parent
			? window.$hsDropdownCollection.filter(
				(el) =>
					el.element.el.classList.contains('open') &&
					el.element.menu
						.closest('.hs-dropdown')
						.parentElement.closest('.hs-dropdown') === parent,
			)
			: window.$hsDropdownCollection.filter((el) =>
				el.element.el.classList.contains('open'),
			);

		if (
			evtTarget &&
			evtTarget.closest('.hs-dropdown') &&
			getClassPropertyAlt(evtTarget.closest('.hs-dropdown'), '--auto-close') ===
			'inside'
		) {
			currentlyOpened = currentlyOpened.filter(
				(el) => el.element.el !== evtTarget.closest('.hs-dropdown'),
			);
		}

		if (currentlyOpened) {
			currentlyOpened.forEach((el) => {
				if (
					el.element.closeMode === 'false' ||
					el.element.closeMode === 'outside'
				)
					return false;

				el.element.close(isAnimated);
			});
		}

		if (currentlyOpened) {
			currentlyOpened.forEach((el) => {
				if (getClassPropertyAlt(el.element.el, '--trigger') !== 'contextmenu')
					return false;

				document.body.style.overflow = '';
				document.body.style.paddingRight = '';
			});
		}
	}

	// Backward compatibility
	static on(evt: string, target: HSDropdown | HTMLElement | string, cb: Function) {
		const instance = HSDropdown.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSDropdown: Function;
		$hsDropdownCollection: ICollectionItem<HSDropdown>[];
	}
}

window.addEventListener('load', () => {
	HSDropdown.autoInit();

	// Uncomment for debug
	// console.log('Dropdown collection:', window.$hsDropdownCollection);
});

window.addEventListener('resize', () => {
	if (!window.$hsDropdownCollection) window.$hsDropdownCollection = [];

	window.$hsDropdownCollection.forEach((el) => el.element.resizeHandler());
});

if (typeof window !== 'undefined') {
	window.HSDropdown = HSDropdown;
}

export default HSDropdown;