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
export type TCarouselOptionsSlidesQty = {
	[key: string]: number;
};
export interface ICarouselOptions {
	currentIndex: number;
	loadingClasses?: string | string[];
	dotsItemClasses?: string;
	isAutoHeight?: boolean;
	isAutoPlay?: boolean;
	isCentered?: boolean;
	isDraggable?: boolean;
	isInfiniteLoop?: boolean;
	isRTL?: boolean;
	isSnap?: boolean;
	hasSnapSpacers?: boolean;
	slidesQty?: TCarouselOptionsSlidesQty | number;
	speed?: number;
	updateDelay?: number;
}
export interface ICarousel {
	options?: ICarouselOptions;
	recalculateWidth(): void;
	goToPrev(): void;
	goToNext(): void;
	goTo(i: number): void;
}
declare class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
	private currentIndex;
	private readonly loadingClasses;
	private readonly dotsItemClasses;
	private readonly isAutoHeight;
	private readonly isAutoPlay;
	private readonly isCentered;
	private readonly isDraggable;
	private readonly isInfiniteLoop;
	private readonly isRTL;
	private readonly isSnap;
	private readonly hasSnapSpacers;
	private readonly slidesQty;
	private readonly speed;
	private readonly updateDelay;
	private readonly loadingClassesRemove;
	private readonly loadingClassesAdd;
	private readonly afterLoadingClassesAdd;
	private readonly container;
	private readonly inner;
	private readonly slides;
	private readonly prev;
	private readonly next;
	private readonly dots;
	private dotsItems;
	private readonly info;
	private readonly infoTotal;
	private readonly infoCurrent;
	private sliderWidth;
	private timer;
	private isScrolling;
	private isDragging;
	private dragStartX;
	private initialTranslateX;
	private readonly touchX;
	private resizeContainer;
	resizeContainerWidth: number;
	constructor(el: HTMLElement, options?: ICarouselOptions);
	private setIsSnap;
	private init;
	private initDragHandling;
	private getTranslateXValue;
	private removeClickEventWhileDragging;
	private handleDragStart;
	private handleDragMove;
	private handleDragEnd;
	private getEventX;
	private getCurrentSlidesQty;
	private buildSnapSpacers;
	private initDots;
	private buildDots;
	private setDots;
	private goToCurrentDot;
	private buildInfo;
	private setInfoTotal;
	private setInfoCurrent;
	private buildSingleDot;
	private singleDotEvents;
	private observeResize;
	private calculateWidth;
	private addCurrentClass;
	private setCurrentDot;
	private setElementToDisabled;
	private unsetElementToDisabled;
	private addDisabledClass;
	private autoPlay;
	private setTimer;
	private resetTimer;
	private detectDirection;
	recalculateWidth(): void;
	private calculateTransform;
	private setTranslate;
	goToPrev(): void;
	goToNext(): void;
	goTo(i: number): void;
	private setIndex;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCarousel | ICollectionItem<HSCarousel>;
	static autoInit(): void;
}

export {
	HSCarousel as default,
};

export {};
