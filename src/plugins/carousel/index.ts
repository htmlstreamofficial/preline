/*
 * HSCarousel
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */

import { ICarousel, ICarouselOptions } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
	private readonly inner: HTMLElement | null;
	private readonly slides: NodeListOf<HTMLElement> | undefined[];
	private readonly prev: HTMLElement | null;
	private readonly next: HTMLElement | null;
	private readonly dots: NodeListOf<HTMLElement> | null;
	private sliderWidth: number;
	private currentIndex: number;
	private readonly loadingClasses: string | string[];
	private readonly loadingClassesRemove: string | string[];
	private readonly loadingClassesAdd: string | string[];
	private readonly afterLoadingClassesAdd: string | string[];
	private readonly isAutoPlay: boolean;
	private readonly speed: number;
	private readonly isInfiniteLoop: boolean;
	private timer: any;

	// Touch events' help variables
	private readonly touchX: {
		start: number;
		end: number;
	};

	constructor(el: HTMLElement, options?: ICarouselOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-carousel');
		const dataOptions: ICarouselOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.currentIndex = concatOptions.currentIndex || 0;
		this.loadingClasses = concatOptions.loadingClasses
			? `${concatOptions.loadingClasses}`.split(',')
			: null;
		this.loadingClassesRemove = this.loadingClasses?.[0]
			? this.loadingClasses[0].split(' ')
			: 'opacity-0';
		this.loadingClassesAdd = this.loadingClasses?.[1]
			? this.loadingClasses[1].split(' ')
			: '';
		this.afterLoadingClassesAdd = this.loadingClasses?.[2]
			? this.loadingClasses[2].split(' ')
			: '';
		this.isAutoPlay =
			typeof concatOptions.isAutoPlay !== 'undefined'
				? concatOptions.isAutoPlay
				: false;
		this.speed = concatOptions.speed || 4000;
		this.isInfiniteLoop =
			typeof concatOptions.isInfiniteLoop !== 'undefined'
				? concatOptions.isInfiniteLoop
				: true;
		this.inner = this.el.querySelector('.hs-carousel-body') || null;
		this.slides = this.el.querySelectorAll('.hs-carousel-slide') || [];
		this.prev = this.el.querySelector('.hs-carousel-prev') || null;
		this.next = this.el.querySelector('.hs-carousel-next') || null;
		this.dots = this.el.querySelectorAll('.hs-carousel-pagination > *') || null;
		this.sliderWidth = this.inner.parentElement.clientWidth;

		// Touch events' help variables
		this.touchX = {
			start: 0,
			end: 0,
		};

		this.init();
	}

	private init() {
		this.createCollection(window.$hsCarouselCollection, this);

		if (this.inner) {
			this.calculateWidth();
			if (this.loadingClassesRemove) {
				if (typeof this.loadingClassesRemove === 'string')
					this.inner.classList.remove(this.loadingClassesRemove);
				else this.inner.classList.remove(...this.loadingClassesRemove);
			}
			if (this.loadingClassesAdd) {
				if (typeof this.loadingClassesAdd === 'string')
					this.inner.classList.add(this.loadingClassesAdd);
				else this.inner.classList.add(...this.loadingClassesAdd);
			}
		}
		if (this.prev)
			this.prev.addEventListener('click', () => {
				this.goToPrev();
				if (this.isAutoPlay) {
					this.resetTimer();
					this.setTimer();
				}
			});
		if (this.next)
			this.next.addEventListener('click', () => {
				this.goToNext();
				if (this.isAutoPlay) {
					this.resetTimer();
					this.setTimer();
				}
			});
		if (this.dots) {
			this.dots.forEach((el, i) =>
				el.addEventListener('click', () => {
					this.goTo(i);
					if (this.isAutoPlay) {
						this.resetTimer();
						this.setTimer();
					}
				}),
			);
		}
		if (this.slides.length) {
			this.addCurrentClass();
			if (!this.isInfiniteLoop) this.addDisabledClass();
			if (this.isAutoPlay) this.autoPlay();
		}
		if (this.inner && this.afterLoadingClassesAdd) {
			setTimeout(() => {
				if (typeof this.afterLoadingClassesAdd === 'string')
					this.inner.classList.add(this.afterLoadingClassesAdd);
				else this.inner.classList.add(...this.afterLoadingClassesAdd);
			});
		}

		this.el.classList.add('init');

		this.el.addEventListener('touchstart', (evt) => {
			this.touchX.start = evt.changedTouches[0].screenX;
		});

		this.el.addEventListener('touchend', (evt) => {
			this.touchX.end = evt.changedTouches[0].screenX;

			this.detectDirection();
		});

		this.observeResize();
	}

	private observeResize() {
		const resizeObserver = new ResizeObserver(() => this.recalculateWidth());

		resizeObserver.observe(document.querySelector('body'));
	}

	private calculateWidth() {
		// Set slider width
		this.inner.style.width = `${this.sliderWidth * this.slides.length}px`;
		this.inner.style.transform = `translate(-${
			this.currentIndex * this.sliderWidth
		}px, 0px)`;

		// Set width to each slide
		this.slides.forEach((el) => {
			el.style.width = `${this.sliderWidth}px`;
		});
	}

	private addCurrentClass() {
		this.slides.forEach((el, i) => {
			if (i === this.currentIndex) {
				el.classList.add('active');
			} else {
				el.classList.remove('active');
			}
		});

		if (this.dots) {
			this.dots.forEach((el, i) => {
				if (i === this.currentIndex) {
					el.classList.add('active');
				} else {
					el.classList.remove('active');
				}
			});
		}
	}

	private addDisabledClass() {
		if (!this.prev || !this.next) return false;

		if (this.currentIndex === 0) {
			this.next.classList.remove('disabled');
			this.prev.classList.add('disabled');
		} else if (this.currentIndex === this.slides.length - 1) {
			this.prev.classList.remove('disabled');
			this.next.classList.add('disabled');
		} else {
			this.prev.classList.remove('disabled');
			this.next.classList.remove('disabled');
		}
	}

	private autoPlay() {
		this.setTimer();
	}

	private setTimer() {
		this.timer = setInterval(() => {
			if (this.currentIndex === this.slides.length - 1) this.goTo(0);
			else this.goToNext();
		}, this.speed);
	}

	private resetTimer() {
		clearInterval(this.timer);
	}

	private detectDirection() {
		const { start, end } = this.touchX;

		if (end < start) this.goToNext();
		if (end > start) this.goToPrev();
	}

	// Public methods
	public recalculateWidth() {
		this.sliderWidth = this.inner.parentElement.clientWidth;

		this.calculateWidth();
	}

	public goToPrev() {
		if (this.currentIndex === 0 && this.isInfiniteLoop) {
			this.currentIndex = this.slides.length - 1;
			this.inner.style.transform = `translate(-${
				this.currentIndex * this.sliderWidth
			}px, 0px)`;

			this.addCurrentClass();
		} else if (this.currentIndex !== 0) {
			this.currentIndex -= 1;
			this.inner.style.transform = `translate(-${
				this.currentIndex * this.sliderWidth
			}px, 0px)`;

			this.addCurrentClass();
			this.addDisabledClass();
		}
	}

	public goToNext() {
		if (this.currentIndex === this.slides.length - 1 && this.isInfiniteLoop) {
			this.currentIndex = 0;
			this.inner.style.transform = `translate(-${
				this.currentIndex * this.sliderWidth
			}px, 0px)`;

			this.addCurrentClass();
		} else if (this.currentIndex < this.slides.length - 1) {
			this.currentIndex += 1;
			this.inner.style.transform = `translate(-${
				this.currentIndex * this.sliderWidth
			}px, 0px)`;

			this.addCurrentClass();
			this.addDisabledClass();
		}
	}

	public goTo(i: number) {
		this.currentIndex = i;
		this.inner.style.transform = `translate(-${
			this.currentIndex * this.sliderWidth
		}px, 0px)`;

		this.addCurrentClass();
		if (!this.isInfiniteLoop) this.addDisabledClass();
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsCarouselCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element
			: null;
	}

	static autoInit() {
		if (!window.$hsCarouselCollection) window.$hsCarouselCollection = [];

		document
			.querySelectorAll('[data-hs-carousel]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsCarouselCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSCarousel(el);
			});
	}
}

declare global {
	interface Window {
		HSCarousel: Function;
		$hsCarouselCollection: ICollectionItem<HSCarousel>[];
	}
}

window.addEventListener('load', () => {
	HSCarousel.autoInit();

	// Uncomment for debug
	// console.log('Carousel collection:', window.$hsCarouselCollection);
});

window.addEventListener('resize', () => {
	if (!window.$hsCarouselCollection) return false;

	window.$hsCarouselCollection.forEach((el) => {
		el.element.recalculateWidth();
	});
});

if (typeof window !== 'undefined') {
	window.HSCarousel = HSCarousel;
}

export default HSCarousel;
