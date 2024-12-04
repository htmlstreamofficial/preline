import { TCarouselOptionsSlidesQty } from './types';

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
	destroy(): void;
}
