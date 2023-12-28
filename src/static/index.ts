/*
 * HSStaticMethods
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { getClassProperty, afterTransition } from '../utils';
import { COLLECTIONS } from '../spa';
import { IStaticMethods } from './interfaces';

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods;
	}
}

const HSStaticMethods: IStaticMethods = {
	getClassProperty,
	afterTransition,
	autoInit(collection: string | string[] = 'all') {
		if (collection === 'all') {
			COLLECTIONS.forEach(({ fn }) => {
				fn?.autoInit();
			});
		} else {
			COLLECTIONS.forEach(({ key, fn }) => {
				if (collection.includes(key)) fn?.autoInit();
			});
		}
	},
};

if (typeof window !== 'undefined') {
	window.HSStaticMethods = HSStaticMethods;
}

export default HSStaticMethods;
