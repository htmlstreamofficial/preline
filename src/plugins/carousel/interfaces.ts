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
