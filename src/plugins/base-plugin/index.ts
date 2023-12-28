/*
 * HSBasePlugin
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { IBasePlugin } from './interfaces';

export default class HSBasePlugin<O, E = HTMLElement>
	implements IBasePlugin<O, E>
{
	constructor(
		public el: E,
		public options: O,
		public events?: any,
	) {
		this.el = el;
		this.options = options;
		this.events = {};
	}

	public createCollection(collection: any[], element: any) {
		collection.push({
			id: element?.el?.id || collection.length + 1,
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
