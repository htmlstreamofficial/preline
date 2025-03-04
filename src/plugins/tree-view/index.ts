/*
 * HSTreeView
 * @version: 3.0.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch } from '../../utils';

import {
	ITreeViewOptions,
	ITreeView,
	ITreeViewItem,
	ITreeViewOptionsControlBy,
} from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSTreeView extends HSBasePlugin<ITreeViewOptions> implements ITreeView {
	private items: ITreeViewItem[] = [];
	private readonly controlBy: ITreeViewOptionsControlBy;
	private readonly autoSelectChildren: boolean;
	private readonly isIndeterminate: boolean;
	static group: number = 0;

	private onElementClickListener:
		| {
			el: Element;
			fn: (evt: PointerEvent) => void;
		}[]
		| null;
	private onControlChangeListener:
		| {
			el: Element;
			fn: () => void;
		}[]
		| null;

	constructor(el: HTMLElement, options?: ITreeViewOptions, events?: {}) {
		super(el, options, events);

		const data = el.getAttribute('data-hs-tree-view');
		const dataOptions: ITreeView = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.controlBy = concatOptions?.controlBy || 'button';
		this.autoSelectChildren = concatOptions?.autoSelectChildren || false;
		this.isIndeterminate = concatOptions?.isIndeterminate || true;

		this.onElementClickListener = [];
		this.onControlChangeListener = [];

		this.init();
	}

	private elementClick(evt: PointerEvent, el: Element, data: ITreeViewItem) {
		evt.stopPropagation();

		if (el.classList.contains('disabled')) return false;

		if (!evt.metaKey && !evt.shiftKey) this.unselectItem(data);
		this.selectItem(el, data);

		this.fireEvent('click', {
			el,
			data: data,
		});
		dispatch('click.hs.treeView', this.el, {
			el,
			data: data,
		});
	}

	private controlChange(el: Element, data: ITreeViewItem) {
		if (this.autoSelectChildren) {
			this.selectItem(el, data);
			if (data.isDir) this.selectChildren(el, data);
			this.toggleParent(el);
		} else this.selectItem(el, data);
	}

	private init() {
		this.createCollection(window.$hsTreeViewCollection, this);

		HSTreeView.group += 1;

		this.initItems();
	}

	private initItems() {
		this.el.querySelectorAll('[data-hs-tree-view-item]').forEach((el, ind) => {
			const data = JSON.parse(el.getAttribute('data-hs-tree-view-item'));
			if (!el.id) el.id = `tree-view-item-${HSTreeView.group}-${ind}`;
			const concatData = {
				...data,
				id: data.id ?? el.id,
				path: this.getPath(el),
				isSelected: data.isSelected ?? false,
			};

			this.items.push(concatData);

			if (this.controlBy === 'checkbox') this.controlByCheckbox(el, concatData);
			else this.controlByButton(el, concatData);
		});
	}

	private controlByButton(el: Element, data: ITreeViewItem) {
		this.onElementClickListener.push({
			el,
			fn: (evt: PointerEvent) => this.elementClick(evt, el, data),
		});

		el.addEventListener(
			'click',
			this.onElementClickListener.find((elI) => elI.el === el).fn,
		);
	}

	private controlByCheckbox(el: Element, data: ITreeViewItem) {
		const control = el.querySelector(`input[value="${data.value}"]`);

		if (!!control) {
			this.onControlChangeListener.push({
				el: control,
				fn: () => this.controlChange(el, data),
			});

			control.addEventListener(
				'change',
				this.onControlChangeListener.find((elI) => elI.el === control).fn,
			);
		}
	}

	private getItem(id: string) {
		return this.items.find((el) => el.id === id);
	}

	private getPath(el: Element) {
		const path: any = [];
		let parent = el.closest('[data-hs-tree-view-item]');

		while (!!parent) {
			const data = JSON.parse(parent.getAttribute('data-hs-tree-view-item'));

			path.push(data.value);

			parent = parent.parentElement?.closest('[data-hs-tree-view-item]');
		}

		return path.reverse().join('/');
	}

	private unselectItem(exception: ITreeViewItem | null = null) {
		let selectedItems = this.getSelectedItems();
		if (exception)
			selectedItems = selectedItems.filter((el) => el.id !== exception.id);

		if (selectedItems.length) {
			selectedItems.forEach((el) => {
				const selectedElement = document.querySelector(`#${el.id}`);

				selectedElement.classList.remove('selected');
				this.changeItemProp(el.id, 'isSelected', false);
			});
		}
	}

	private selectItem(el: Element, data: ITreeViewItem) {
		if (data.isSelected) {
			el.classList.remove('selected');
			this.changeItemProp(data.id, 'isSelected', false);
		} else {
			el.classList.add('selected');
			this.changeItemProp(data.id, 'isSelected', true);
		}
	}

	private selectChildren(el: Element, data: ITreeViewItem) {
		const items = el.querySelectorAll('[data-hs-tree-view-item]');

		Array.from(items)
			.filter((elI) => !elI.classList.contains('disabled'))
			.forEach((elI) => {
				const initialItemData = elI.id ? this.getItem(elI.id) : null;

				if (!initialItemData) return false;

				if (data.isSelected) {
					elI.classList.add('selected');
					this.changeItemProp(initialItemData.id, 'isSelected', true);
				} else {
					elI.classList.remove('selected');
					this.changeItemProp(initialItemData.id, 'isSelected', false);
				}

				const currentItemData = this.getItem(elI.id);
				const control: HTMLFormElement = elI.querySelector(
					`input[value="${currentItemData.value}"]`,
				);

				if (this.isIndeterminate) control.indeterminate = false;

				if (currentItemData.isSelected) control.checked = true;
				else control.checked = false;
			});
	}

	private toggleParent(el: Element) {
		let parent = el.parentElement?.closest('[data-hs-tree-view-item]');

		while (!!parent) {
			const items = parent.querySelectorAll(
				'[data-hs-tree-view-item]:not(.disabled)',
			);
			const data = JSON.parse(parent.getAttribute('data-hs-tree-view-item'));
			const control: HTMLFormElement = parent.querySelector(
				`input[value="${data.value}"]`,
			);
			let hasUnchecked = false;
			let checkedItems = 0;

			items.forEach((elI) => {
				const dataI = this.getItem(elI.id);

				if (dataI.isSelected) checkedItems += 1;
				if (!dataI.isSelected) hasUnchecked = true;
			});

			if (hasUnchecked) {
				parent.classList.remove('selected');
				this.changeItemProp(parent.id, 'isSelected', false);
				control.checked = false;
			} else {
				parent.classList.add('selected');
				this.changeItemProp(parent.id, 'isSelected', true);
				control.checked = true;
			}

			if (this.isIndeterminate) {
				if (checkedItems > 0 && checkedItems < items.length)
					control.indeterminate = true;
				else control.indeterminate = false;
			}

			parent = parent.parentElement?.closest('[data-hs-tree-view-item]');
		}
	}

	// Public methods
	public update() {
		this.items.map((el: ITreeViewItem) => {
			const selector = document.querySelector(`#${el.id}`);

			if (el.path !== this.getPath(selector)) el.path = this.getPath(selector);

			return el;
		});
	}

	public getSelectedItems() {
		return this.items.filter((el) => el.isSelected);
	}

	public changeItemProp(id: string, prop: string, val: any) {
		this.items.map((el) => {
			// @ts-ignore
			if (el.id === id) el[prop] = val;

			return el;
		});
	}

	public destroy() {
		// Remove listeners
		this.onElementClickListener.forEach(({ el, fn }) => {
			el.removeEventListener('click', fn);
		});
		if (this.onControlChangeListener.length)
			this.onElementClickListener.forEach(({ el, fn }) => {
				el.removeEventListener('change', fn);
			});

		this.unselectItem();

		this.items = [];

		window.$hsTreeViewCollection = window.$hsTreeViewCollection.filter(
			({ element }) => element.el !== this.el,
		);

		HSTreeView.group -= 1;
	}

	// Static methods
	private static findInCollection(target: HSTreeView | HTMLElement | string): ICollectionItem<HSTreeView> | null {
		return window.$hsTreeViewCollection.find((el) => {
			if (target instanceof HSTreeView) return el.element.el === target.el;
			else if (typeof target === 'string') return el.element.el === document.querySelector(target);
			else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsTreeViewCollection.find(
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
		if (!window.$hsTreeViewCollection) window.$hsTreeViewCollection = [];

		if (window.$hsTreeViewCollection)
			window.$hsTreeViewCollection = window.$hsTreeViewCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('[data-hs-tree-view]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsTreeViewCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSTreeView(el);
			});
	}

	// Backward compatibility
	static on(evt: string, target: HSTreeView | HTMLElement | string, cb: Function) {
		const instance = HSTreeView.findInCollection(target);

		if (instance) instance.element.events[evt] = cb;
	}
}

declare global {
	interface Window {
		HSTreeView: Function;
		$hsTreeViewCollection: ICollectionItem<HSTreeView>[];
	}
}

window.addEventListener('load', () => {
	HSTreeView.autoInit();

	// Uncomment for debug
	// console.log('Tree view collection:', window.$hsTreeViewCollection);
});

if (typeof window !== 'undefined') {
	window.HSTreeView = HSTreeView;
}

export default HSTreeView;
