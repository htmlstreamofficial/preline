export declare const stringToBoolean: (string: string) => boolean;
export declare const getClassProperty: (el: HTMLElement, prop: string, val?: string) => string;
export declare const getClassPropertyAlt: (el: HTMLElement, prop?: string, val?: string) => string;
export declare const getZIndex: (el: HTMLElement) => string;
export declare const getHighestZIndex: (arr: HTMLElement[]) => number;
export declare const isDirectChild: (parent: Element, child: HTMLElement) => boolean;
export declare const isEnoughSpace: (el: HTMLElement, toggle: HTMLElement, preferredPosition?: "top" | "bottom" | "auto", space?: number, wrapper?: HTMLElement | null) => boolean;
export declare const isFocused: (target: HTMLElement) => boolean;
export declare const isFormElement: (target: HTMLElement) => target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export declare const isIOS: () => boolean;
export declare const isIpadOS: () => boolean;
export declare const isJson: (str: string) => boolean;
export declare const isParentOrElementHidden: (element: any) => any;
export declare const isScrollable: (el: HTMLElement) => boolean;
export declare const debounce: (func: Function, timeout?: number) => (...args: any[]) => void;
export declare const dispatch: (evt: string, element: any, payload?: any) => void;
export declare const afterTransition: (el: HTMLElement, callback: Function) => void;
export declare const htmlToElement: (html: string) => HTMLElement;
export declare const classToClassList: (classes: string, target: HTMLElement, splitter?: string, action?: "add" | "remove") => void;
export declare const menuSearchHistory: {
	historyIndex: number;
	addHistory(index: number): void;
	existsInHistory(index: number): boolean;
	clearHistory(): void;
};

export {};
