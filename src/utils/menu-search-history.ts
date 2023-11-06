/*
 * Menu Search History
 * @version: 2.0.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

export default {
	historyIndex: -1,

	addHistory(index: number) {
		this.historyIndex = index;
	},

	existsInHistory(index: number) {
		return index > this.historyIndex;
	},

	clearHistory() {
		this.historyIndex = -1;
	},
};
