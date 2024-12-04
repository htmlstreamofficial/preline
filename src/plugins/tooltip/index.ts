/*
 * HSTooltip
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { createPopper, PositioningStrategy, Instance } from '@popperjs/core';
import { getClassProperty, dispatch, afterTransition } from '../../utils';

import { ITooltip } from './interfaces';
import { TTooltipOptionsScope } from './types';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { POSITIONS } from '../../constants';

class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle: HTMLElement | null;
	public content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventPopper: string;
	private popperInstance: Instance | null;
	private readonly placement: string;
	private readonly strategy: PositioningStrategy;
	private readonly scope: TTooltipOptionsScope;

	private onToggleClickListener: () => void;
	private onToggleFocusListener: () => void;
	private onToggleMouseEnterListener: () => void;
	private onToggleMouseLeaveListener: () => void;
	private onToggleHandleListener: () => void;

	constructor(el: HTMLElement, options?: {}, events?: {}) {
		super(el, options, events);

		if (this.el) {
			this.toggle = this.el.querySelector('.hs-tooltip-toggle') || this.el;
			this.content = this.el.querySelector('.hs-tooltip-content');
			this.eventMode = getClassProperty(this.el, '--trigger') || 'hover';
			this.preventPopper = getClassProperty(
				this.el,
				'--prevent-popper',
				'false',
			);
			this.placement = getClassProperty(this.el, '--placement');
			this.strategy = getClassProperty(
				this.el,
				'--strategy',
			) as PositioningStrategy;
			this.scope = getClassProperty(this.el, '--scope') as TTooltipOptionsScope || 'parent';
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

		this.toggle.removeEventListener('click', this.onToggleHandleListener, true);
		this.toggle.removeEventListener('blur', this.onToggleHandleListener, true);
	}

	private init() {
		this.createCollection(window.$hsTooltipCollection, this);

		if (this.eventMode === 'click') {
			this.onToggleClickListener = () => this.toggleClick();

			this.toggle.addEventListener('click', this.onToggleClickListener);
		} else if (this.eventMode === 'focus') {
			this.onToggleFocusListener = () => this.toggleFocus();

			this.toggle.addEventListener('click', this.onToggleFocusListener);
		} else if (this.eventMode === 'hover') {
			this.onToggleMouseEnterListener = () => this.toggleMouseEnter();
			this.onToggleMouseLeaveListener = () => this.toggleMouseLeave();

			this.toggle.addEventListener(
				'mouseenter',
				this.onToggleMouseEnterListener,
			);
			this.toggle.addEventListener(
				'mouseleave',
				this.onToggleMouseLeaveListener,
			);
		}

		if (this.preventPopper === 'false') this.buildPopper();
	}

	private enter() {
		this._show();
	}

	private leave() {
		this.hide();
	}

	private click() {
		if (this.el.classList.contains('show')) return false;

		this._show();

		this.onToggleHandleListener = () => {
			setTimeout(() => this.toggleHandle());
		};

		this.toggle.addEventListener('click', this.onToggleHandleListener, true);
		this.toggle.addEventListener('blur', this.onToggleHandleListener, true);
	}

	private focus() {
		this._show();

		const handle = () => {
			this.hide();

			this.toggle.removeEventListener('blur', handle, true);
		};

		this.toggle.addEventListener('blur', handle, true);
	}

	private buildPopper() {
		if (this.scope === 'window') document.body.appendChild(this.content);

		this.popperInstance = createPopper(this.toggle, this.content, {
			placement: POSITIONS[this.placement] || 'top',
			strategy: this.strategy || 'fixed',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 5],
					},
				},
			],
		});
	}

	private _show() {
		this.content.classList.remove('hidden');
		if (this.scope === 'window') this.content.classList.add('show');

		if (this.preventPopper === 'false') {
			this.popperInstance.setOptions((options) => ({
				...options,
				modifiers: [
					...options.modifiers,
					{
						name: 'eventListeners',
						enabled: true,
					},
				],
			}));

			this.popperInstance.update();
		}

		setTimeout(() => {
			this.el.classList.add('show');

			this.fireEvent('show', this.el);
			dispatch('show.hs.tooltip', this.el, this.el);
		});
	}

	// Public methods
	public show() {
		switch (this.eventMode) {
			case 'click':
				this.click();
				break;
			case 'focus':
				this.focus();
				break;
			default:
				this.enter();
				break;
		}

		this.toggle.focus();
		this.toggle.style.outline = 'none';
	}

	public hide() {
		this.el.classList.remove('show');
		if (this.scope === 'window') this.content.classList.remove('show');

		if (this.preventPopper === 'false') {
			this.popperInstance.setOptions((options) => ({
				...options,
				modifiers: [
					...options.modifiers,
					{
						name: 'eventListeners',
						enabled: false,
					},
				],
			}));
		}

		this.fireEvent('hide', this.el);
		dispatch('hide.hs.tooltip', this.el, this.el);

		afterTransition(this.content, () => {
			if (this.el.classList.contains('show')) return false;

			this.content.classList.add('hidden');
			this.toggle.style.outline = '';
		});
	}

	public destroy() {
		// Remove classes
		this.el.classList.remove('show');
		this.content.classList.add('hidden');

		// Remove listeners
		if (this.eventMode === 'click') {
			this.toggle.removeEventListener('click', this.onToggleClickListener);
		} else if (this.eventMode === 'focus') {
			this.toggle.removeEventListener('click', this.onToggleFocusListener);
		} else if (this.eventMode === 'hover') {
			this.toggle.removeEventListener(
				'mouseenter',
				this.onToggleMouseEnterListener,
			);
			this.toggle.removeEventListener(
				'mouseleave',
				this.onToggleMouseLeaveListener,
			);
		}
		this.toggle.removeEventListener('click', this.onToggleHandleListener, true);
		this.toggle.removeEventListener('blur', this.onToggleHandleListener, true);

		this.popperInstance.destroy();
		this.popperInstance = null;

		window.$hsTooltipCollection = window.$hsTooltipCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance = false) {
		const elInCollection = window.$hsTooltipCollection.find(
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
		if (!window.$hsTooltipCollection) window.$hsTooltipCollection = [];

		if (window.$hsTooltipCollection)
			window.$hsTooltipCollection = window.$hsTooltipCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document.querySelectorAll('.hs-tooltip').forEach((el: HTMLElement) => {
			if (
				!window.$hsTooltipCollection.find(
					(elC) => (elC?.element?.el as HTMLElement) === el,
				)
			)
				new HSTooltip(el);
		});
	}

	static show(target: HTMLElement) {
		const elInCollection = window.$hsTooltipCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection) elInCollection.element.show();
	}

	static hide(target: HTMLElement) {
		const elInCollection = window.$hsTooltipCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection) elInCollection.element.hide();
	}

	// Backward compatibility
	static on(evt: string, target: HTMLElement, cb: Function) {
		const elInCollection = window.$hsTooltipCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection) elInCollection.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSTooltip: Function;
		$hsTooltipCollection: ICollectionItem<HSTooltip>[];
	}
}

window.addEventListener('load', () => {
	HSTooltip.autoInit();

	// Uncomment for debug
	// console.log('Tooltip collection:', window.$hsTooltipCollection);
});

if (typeof window !== 'undefined') {
	window.HSTooltip = HSTooltip;
}

export default HSTooltip;
