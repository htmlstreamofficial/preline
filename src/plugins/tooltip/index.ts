/*
 * HSTooltip
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { createPopper, PositioningStrategy, Instance } from '@popperjs/core';
import { getClassProperty, dispatch, afterTransition } from '../../utils';

import { ITooltip } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { POSITIONS } from '../../constants';

class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle: HTMLElement | null;
	public content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventPopper: string;
	private popperInstance: Instance;
	private readonly placement: string;
	private readonly strategy: PositioningStrategy;
	private static currentTooltip: HSTooltip | null = null;

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
		}

		if (this.el && this.toggle && this.content) this.init();
	}

	private init() {
		this.createCollection(window.$hsTooltipCollection, this);

		if (this.eventMode === 'click') {
			this.toggle.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent immediate closing of popover
                this.click();
            });	
		} else if (this.eventMode === 'focus') {
			this.toggle.addEventListener('click', () => this.focus());
		} else if (this.eventMode === 'hover') {
			this.toggle.addEventListener('mouseenter', () => this.enter());
			this.toggle.addEventListener('mouseleave', () => this.leave());
		}
		this.toggle.addEventListener('click', this.handleOutsideClick); // Add an event listener to the document to close the popover
		if (this.preventPopper === 'false') this.buildPopper();
	}

	private enter() {
		this.show();
	}

	private leave() {
		this.hide();
	}

	private click() {
		// Close the current tooltip if one is open
		if (HSTooltip.currentTooltip && HSTooltip.currentTooltip !== this) {
			HSTooltip.currentTooltip.hide();
		}

		// Toggle the visibility of the current tooltip
		if (this.el.classList.contains('show')) {
			// If already open, hide it
			this.hide();
			HSTooltip.currentTooltip = null; // Clear the current tooltip reference
		} else {
			// Otherwise, show it
			this.show();

			const handle = () => {
				setTimeout(() => {
					this.hide();
					document.body.removeEventListener('click', handle); // Remove the event listener
					document.body.removeEventListener('blur', handle);  // Remove the event listener
				});
			};

			document.body.addEventListener('click', handle);
			document.body.addEventListener('blur', handle); 

			// Add an event listener to the tooltip content to prevent closing when clicked inside
			// With this when click inside content it will not close
			// If you want to close it when click inside content you can remove this part
			// The link or button inside content will work as expected
			this.content?.addEventListener('click', (event) => {
				event.stopPropagation(); // Prevent the click event from bubbling up
			});
			

			// Update the current tooltip reference
			HSTooltip.currentTooltip = this;
		}
	}
	
	/**
	 * Handles outside click events to hide the popover if clicked outside.
	 * Used to ensure the popover is hidden when clicking outside of it.
	 */
	private handleOutsideClick = (event: MouseEvent) => {
        if (!this.el.contains(event.target as Node)) {
            this.hide();
        }
    };

	private focus() {
		this.show();

		const handle = () => {
			this.hide();

			this.toggle.removeEventListener('blur', handle, true);
		};

		this.toggle.addEventListener('blur', handle, true);
	}

	private buildPopper() {
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

	// Public methods
	public show() {
		this.content.classList.remove('hidden');

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

	public hide() {
		this.el.classList.remove('show');

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
		});
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

		if (elInCollection) {
			switch (elInCollection.element.eventMode) {
				case 'click':
					elInCollection.element.click();
					break;
				case 'focus':
					elInCollection.element.focus();
					break;
				default:
					elInCollection.element.enter();
					break;
			}
		}
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
