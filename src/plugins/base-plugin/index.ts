/*
 * HSBasePlugin
 * @version: 4.1.2
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { IBasePlugin } from '../base-plugin/interfaces';

export default class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	constructor(
		public el: E,
		public options: O,
		public events?: any,
	) {
		this.el = el;
		this.options = options;
		this.events = {};
	}

	public createCollection(collection: any[] | undefined, element: any) {
		let targetCollection = collection;

		if (!Array.isArray(targetCollection) && typeof window !== 'undefined') {
			const pluginName = this.constructor?.name;
			const collectionName =
				typeof pluginName === 'string' && pluginName.startsWith('HS')
					? `$hs${pluginName.slice(2)}Collection`
					: null;

			if (collectionName) {
				if (!Array.isArray((window as any)[collectionName])) {
					(window as any)[collectionName] = [];
				}

				targetCollection = (window as any)[collectionName];
			}
		}

		if (!Array.isArray(targetCollection)) return;

		targetCollection.push({
			id: element?.el?.id || targetCollection.length + 1,
			element,
		});
	}

	public fireEvent(evt: string, payload: any = null) {
		if (this.events.hasOwnProperty(evt)) return this.events[evt](payload);
	}

	public on(evt: string, cb: Function) {
		this.events[evt] = cb;
	}
}
