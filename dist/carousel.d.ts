
export interface ICarouselOptions {
	currentIndex: number;
	loadingClasses?: string | string[];
	isAutoPlay?: boolean;
	speed?: number;
	isInfiniteLoop?: boolean;
}
export interface ICarousel {
	options?: ICarouselOptions;
	recalculateWidth(): void;
	goToPrev(): void;
	goToNext(): void;
	goTo(i: number): void;
}
export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}
declare class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	el: E;
	options: O;
	events?: any;
	constructor(el: E, options: O, events?: any);
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
declare class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
	private readonly inner;
	private readonly slides;
	private readonly prev;
	private readonly next;
	private readonly dots;
	private sliderWidth;
	private currentIndex;
	private readonly loadingClasses;
	private readonly loadingClassesRemove;
	private readonly loadingClassesAdd;
	private readonly afterLoadingClassesAdd;
	private readonly isAutoPlay;
	private readonly speed;
	private readonly isInfiniteLoop;
	private timer;
	private readonly touchX;
	constructor(el: HTMLElement, options?: ICarouselOptions);
	private init;
	private observeResize;
	private calculateWidth;
	private addCurrentClass;
	private addDisabledClass;
	private autoPlay;
	private setTimer;
	private resetTimer;
	private detectDirection;
	recalculateWidth(): void;
	goToPrev(): void;
	goToNext(): void;
	goTo(i: number): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCarousel | ICollectionItem<HSCarousel>;
	static autoInit(): void;
}

export {
	HSCarousel as default,
};

export {};
