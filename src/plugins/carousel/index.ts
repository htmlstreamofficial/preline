/*
 * HSCarousel
 * @version: 2.5.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { classToClassList, debounce, htmlToElement } from '../../utils';

import { ICarousel, ICarouselOptions } from './interfaces';
import { TCarouselOptionsSlidesQty } from './types';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';
import { BREAKPOINTS } from '../../constants';

class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
	private currentIndex: number;
	private readonly loadingClasses: string | string[];
	private readonly dotsItemClasses: string;
	private readonly isAutoHeight: boolean;
	private readonly isAutoPlay: boolean;
	private readonly isCentered: boolean;
	private readonly isDraggable: boolean;
	private readonly isInfiniteLoop: boolean;
	private readonly isRTL: boolean;
	private readonly isSnap: boolean;
	private readonly hasSnapSpacers: boolean;
	private readonly slidesQty: TCarouselOptionsSlidesQty | number;
	private readonly speed: number;
	private readonly updateDelay: number;

	private readonly loadingClassesRemove: string | string[];
	private readonly loadingClassesAdd: string | string[];
	private readonly afterLoadingClassesAdd: string | string[];

	private readonly container: HTMLElement | null;
	private readonly inner: HTMLElement | null;
	private readonly slides: NodeListOf<HTMLElement> | undefined[];
	private readonly prev: HTMLElement | null;
	private readonly next: HTMLElement | null;
	private readonly dots: HTMLElement | null;
	private dotsItems: NodeListOf<HTMLElement> | undefined[] | null;
	private readonly info: HTMLElement | null;
	private readonly infoTotal: HTMLElement | null;
	private readonly infoCurrent: HTMLElement | null;

	private sliderWidth: number;
	private timer: any;

	// Drag events' help variables
	private isScrolling: ReturnType<typeof setTimeout>;
	private isDragging: boolean;
	private dragStartX: number | null;
	private initialTranslateX: number | null;

	// Touch events' help variables
	private readonly touchX: {
		start: number;
		end: number;
	};

	// Resize events' help variables
	private resizeContainer: HTMLElement;
	public resizeContainerWidth: number;

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
		this.dotsItemClasses = concatOptions.dotsItemClasses
			? concatOptions.dotsItemClasses
			: null;
		this.isAutoHeight =
			typeof concatOptions.isAutoHeight !== 'undefined'
				? concatOptions.isAutoHeight
				: false;
		this.isAutoPlay =
			typeof concatOptions.isAutoPlay !== 'undefined'
				? concatOptions.isAutoPlay
				: false;
		this.isCentered =
			typeof concatOptions.isCentered !== 'undefined'
				? concatOptions.isCentered
				: false;
		this.isDraggable =
			typeof concatOptions.isDraggable !== 'undefined'
				? concatOptions.isDraggable
				: false;
		this.isInfiniteLoop =
			typeof concatOptions.isInfiniteLoop !== 'undefined'
				? concatOptions.isInfiniteLoop
				: false;
		this.isRTL =
			typeof concatOptions.isRTL !== 'undefined' ? concatOptions.isRTL : false;
		this.isSnap =
			typeof concatOptions.isSnap !== 'undefined'
				? concatOptions.isSnap
				: false;
		this.hasSnapSpacers =
			typeof concatOptions.hasSnapSpacers !== 'undefined'
				? concatOptions.hasSnapSpacers
				: true;
		this.speed = concatOptions.speed || 4000;
		this.updateDelay = concatOptions.updateDelay || 0;
		this.slidesQty = concatOptions.slidesQty || 1;

		this.loadingClassesRemove = this.loadingClasses?.[0]
			? this.loadingClasses[0].split(' ')
			: 'opacity-0';
		this.loadingClassesAdd = this.loadingClasses?.[1]
			? this.loadingClasses[1].split(' ')
			: '';
		this.afterLoadingClassesAdd = this.loadingClasses?.[2]
			? this.loadingClasses[2].split(' ')
			: '';

		this.container = this.el.querySelector('.hs-carousel') || null;
		this.inner = this.el.querySelector('.hs-carousel-body') || null;
		this.slides = this.el.querySelectorAll('.hs-carousel-slide') || [];
		this.prev = this.el.querySelector('.hs-carousel-prev') || null;
		this.next = this.el.querySelector('.hs-carousel-next') || null;
		this.dots = this.el.querySelector('.hs-carousel-pagination') || null;
		this.info = this.el.querySelector('.hs-carousel-info') || null;
		this.infoTotal =
			this?.info?.querySelector('.hs-carousel-info-total') || null;
		this.infoCurrent =
			this?.info?.querySelector('.hs-carousel-info-current') || null;

		this.sliderWidth = this.el.getBoundingClientRect().width;

		// Drag events' help variables
		this.isDragging = false;
		this.dragStartX = null;
		this.initialTranslateX = null;

		// Touch events' help variables
		this.touchX = {
			start: 0,
			end: 0,
		};

		// Resize events' help variables
		this.resizeContainer = document.querySelector('body');
		this.resizeContainerWidth = 0;

		this.init();
	}

	private setIsSnap() {
		const containerRect = this.container.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;

		let closestElement: HTMLElement | null = null;
		let closestElementIndex: number | null = null;
		let closestDistance = Infinity;

		Array.from(this.inner.children).forEach((child: HTMLElement) => {
			const childRect = child.getBoundingClientRect();
			const innerContainerRect = this.inner.getBoundingClientRect();
			const childCenter =
				childRect.left + childRect.width / 2 - innerContainerRect.left;
			const distance = Math.abs(
				containerCenter - (innerContainerRect.left + childCenter),
			);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestElement = child;
			}
		});

		if (closestElement) {
			closestElementIndex = Array.from(this.slides).findIndex(
				(el) => el === closestElement,
			);
		}

		this.setIndex(closestElementIndex);

		if (this.dots) this.setCurrentDot();
	}

	private init() {
		this.createCollection(window.$hsCarouselCollection, this);

		if (this.inner) {
			this.calculateWidth();

			if (this.isDraggable && !this.isSnap) this.initDragHandling();
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
		if (this.dots) this.initDots();
		if (this.info) this.buildInfo();
		if (this.slides.length) {
			this.addCurrentClass();
			if (!this.isInfiniteLoop) this.addDisabledClass();
			if (this.isAutoPlay) this.autoPlay();
		}

		setTimeout(() => {
			if (this.isSnap) this.setIsSnap();

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

			if (this.inner && this.afterLoadingClassesAdd) {
				setTimeout(() => {
					if (typeof this.afterLoadingClassesAdd === 'string')
						this.inner.classList.add(this.afterLoadingClassesAdd);
					else this.inner.classList.add(...this.afterLoadingClassesAdd);
				});
			}
		}, 400);

		if (this.isSnap) {
			this.container.addEventListener('scroll', () => {
				clearTimeout(this.isScrolling);

				this.isScrolling = setTimeout(() => {
					this.setIsSnap();
				}, 100);
			});
		}

		this.el.classList.add('init');

		if (!this.isSnap) {
			this.el.addEventListener('touchstart', (evt) => {
				this.touchX.start = evt.changedTouches[0].screenX;
			});

			this.el.addEventListener('touchend', (evt) => {
				this.touchX.end = evt.changedTouches[0].screenX;

				this.detectDirection();
			});
		}

		this.observeResize();
	}

	private initDragHandling(): void {
		const scrollableElement = this.inner;

		if (scrollableElement) {
			scrollableElement.addEventListener(
				'mousedown',
				this.handleDragStart.bind(this),
			);
			scrollableElement.addEventListener(
				'touchstart',
				this.handleDragStart.bind(this),
				{ passive: true },
			);

			document.addEventListener('mousemove', this.handleDragMove.bind(this));
			document.addEventListener('touchmove', this.handleDragMove.bind(this), {
				passive: false,
			});

			document.addEventListener('mouseup', this.handleDragEnd.bind(this));
			document.addEventListener('touchend', this.handleDragEnd.bind(this));
		}
	}

	private getTranslateXValue(): number {
		const transformMatrix = window.getComputedStyle(this.inner).transform;

		if (transformMatrix !== 'none') {
			const matrixValues = transformMatrix
				.match(/matrix.*\((.+)\)/)?.[1]
				.split(', ');

			if (matrixValues) {
				let translateX = parseFloat(
					matrixValues.length === 6 ? matrixValues[4] : matrixValues[12],
				);
				if (this.isRTL) translateX = -translateX;

				return isNaN(translateX) || translateX === 0 ? 0 : -translateX;
			}
		}
		return 0;
	}

	private removeClickEventWhileDragging(evt: MouseEvent) {
		evt.preventDefault();
	}

	private handleDragStart(evt: MouseEvent | TouchEvent): void {
		evt.preventDefault();

		this.isDragging = true;
		this.dragStartX = this.getEventX(evt);
		this.initialTranslateX = this.isRTL
			? this.getTranslateXValue()
			: -this.getTranslateXValue();

		this.inner.classList.add('dragging');
	}

	private handleDragMove(evt: MouseEvent | TouchEvent): void {
		if (!this.isDragging) return;

		this.inner.querySelectorAll('a:not(.prevented-click)').forEach((el) => {
			el.classList.add('prevented-click');
			el.addEventListener('click', this.removeClickEventWhileDragging);
		});

		const currentX = this.getEventX(evt);
		let deltaX = currentX - this.dragStartX;
		if (this.isRTL) deltaX = -deltaX;
		const newTranslateX = this.initialTranslateX + deltaX;
		const newTranslateXFunc = () => {
			let calcWidth =
				(this.sliderWidth * this.slides.length) / this.getCurrentSlidesQty() -
				this.sliderWidth;
			const containerWidth = this.sliderWidth;
			const itemWidth = containerWidth / this.getCurrentSlidesQty();
			const centeredOffset = (containerWidth - itemWidth) / 2;
			const limitStart = this.isCentered ? centeredOffset : 0;
			if (this.isCentered) calcWidth = calcWidth + centeredOffset;
			const limitEnd = -calcWidth;

			if (this.isRTL) {
				if (newTranslateX < limitStart) return limitStart;
				if (newTranslateX > calcWidth) return limitEnd;
				else return -newTranslateX;
			} else {
				if (newTranslateX > limitStart) return limitStart;
				else if (newTranslateX < -calcWidth) return limitEnd;
				else return newTranslateX;
			}
		};

		this.setTranslate(newTranslateXFunc());
	}

	private handleDragEnd(): void {
		if (!this.isDragging) return;
		this.isDragging = false;

		const containerWidth = this.sliderWidth;
		const itemWidth = containerWidth / this.getCurrentSlidesQty();
		const currentTranslateX = this.getTranslateXValue();
		let closestIndex = Math.round(currentTranslateX / itemWidth);
		if (this.isRTL) closestIndex = Math.round(currentTranslateX / itemWidth);

		this.inner.classList.remove('dragging');

		setTimeout(() => {
			this.calculateTransform(closestIndex);
			if (this.dots) this.setCurrentDot();

			this.dragStartX = null;
			this.initialTranslateX = null;

			this.inner.querySelectorAll('a.prevented-click').forEach((el) => {
				el.classList.remove('prevented-click');
				el.removeEventListener('click', this.removeClickEventWhileDragging);
			});
		});
	}

	private getEventX(event: MouseEvent | TouchEvent): number {
		return event instanceof MouseEvent
			? event.clientX
			: event.touches[0].clientX;
	}

	private getCurrentSlidesQty(): number {
		if (typeof this.slidesQty === 'object') {
			const windowWidth = document.body.clientWidth;
			let currentRes = 0;

			Object.keys(this.slidesQty).forEach((key: string) => {
				if (
					windowWidth >=
					(typeof key + 1 === 'number'
						? (this.slidesQty as TCarouselOptionsSlidesQty)[key]
						: BREAKPOINTS[key])
				)
					currentRes = (this.slidesQty as TCarouselOptionsSlidesQty)[key];
			});

			return currentRes;
		} else {
			return this.slidesQty as number;
		}
	}

	private buildSnapSpacers() {
		const existingBefore = this.inner.querySelector('.hs-snap-before');
		const existingAfter = this.inner.querySelector('.hs-snap-after');
		if (existingBefore) existingBefore.remove();
		if (existingAfter) existingAfter.remove();

		const containerWidth = this.sliderWidth;
		const itemWidth = containerWidth / this.getCurrentSlidesQty();
		const spacerWidth = containerWidth / 2 - itemWidth / 2;

		const before = htmlToElement(
			`<div class="hs-snap-before" style="height: 100%; width: ${spacerWidth}px"></div>`,
		);
		const after = htmlToElement(
			`<div class="hs-snap-after" style="height: 100%; width: ${spacerWidth}px"></div>`,
		);

		this.inner.prepend(before);
		this.inner.appendChild(after);
	}

	private initDots() {
		if (this.el.querySelectorAll('.hs-carousel-pagination-item').length)
			this.setDots();
		else this.buildDots();

		if (this.dots) this.setCurrentDot();
	}

	private buildDots() {
		this.dots.innerHTML = '';

		const slidesQty =
			!this.isCentered && this.slidesQty
				? this.slides.length - (this.getCurrentSlidesQty() - 1)
				: this.slides.length;

		for (let i = 0; i < slidesQty; i++) {
			const singleDot = this.buildSingleDot(i);

			this.dots.append(singleDot);
		}
	}

	private setDots() {
		this.dotsItems = this.dots.querySelectorAll('.hs-carousel-pagination-item');

		this.dotsItems.forEach((dot, ind) => {
			const targetIndex = dot.getAttribute(
				'data-carousel-pagination-item-target',
			);

			this.singleDotEvents(dot, targetIndex ? +targetIndex : ind);
		});
	}

	private goToCurrentDot() {
		const container = this.dots;
		const containerRect = container.getBoundingClientRect();
		const containerScrollLeft = container.scrollLeft;
		const containerScrollTop = container.scrollTop;
		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		const item = this.dotsItems[this.currentIndex];
		const itemRect = item.getBoundingClientRect();
		const itemLeft = itemRect.left - containerRect.left + containerScrollLeft;
		const itemRight = itemLeft + item.clientWidth;
		const itemTop = itemRect.top - containerRect.top + containerScrollTop;
		const itemBottom = itemTop + item.clientHeight;

		let scrollLeft = containerScrollLeft;
		let scrollTop = containerScrollTop;

		if (
			itemLeft < containerScrollLeft ||
			itemRight > containerScrollLeft + containerWidth
		) {
			scrollLeft = itemRight - containerWidth;
		}

		if (
			itemTop < containerScrollTop ||
			itemBottom > containerScrollTop + containerHeight
		) {
			scrollTop = itemBottom - containerHeight;
		}

		container.scrollTo({
			left: scrollLeft,
			top: scrollTop,
			behavior: 'smooth',
		});
	}

	private buildInfo() {
		if (this.infoTotal) this.setInfoTotal();
		if (this.infoCurrent) this.setInfoCurrent();
	}

	private setInfoTotal() {
		this.infoTotal.innerText = `${this.slides.length}`;
	}

	private setInfoCurrent() {
		this.infoCurrent.innerText = `${this.currentIndex + 1}`;
	}

	private buildSingleDot(ind: number) {
		const singleDot = htmlToElement('<span></span>');
		if (this.dotsItemClasses) classToClassList(this.dotsItemClasses, singleDot);

		this.singleDotEvents(singleDot, ind);

		return singleDot;
	}

	private singleDotEvents(dot: HTMLElement, ind: number) {
		dot.addEventListener('click', () => {
			this.goTo(ind);

			if (this.isAutoPlay) {
				this.resetTimer();
				this.setTimer();
			}
		});
	}

	private observeResize() {
		const resizeObserver = new ResizeObserver(
			debounce((entries: ResizeObserverEntry[]) => {
				for (let entry of entries) {
					const newWidth = entry.contentRect.width;

					if (newWidth !== this.resizeContainerWidth) {
						this.recalculateWidth();
						if (this.dots) this.initDots();
						this.addCurrentClass();

						this.resizeContainerWidth = newWidth;
					}
				}
			}, this.updateDelay),
		);

		resizeObserver.observe(this.resizeContainer);
	}

	private calculateWidth() {
		if (!this.isSnap)
			this.inner.style.width = `${(this.sliderWidth * this.slides.length) / this.getCurrentSlidesQty()}px`;

		this.slides.forEach((el) => {
			el.style.width = `${this.sliderWidth / this.getCurrentSlidesQty()}px`;
		});

		this.calculateTransform();
	}

	private addCurrentClass() {
		if (this.isSnap) {
			const itemsQty = Math.floor(this.getCurrentSlidesQty() / 2);

			for (let i = 0; i < this.slides.length; i++) {
				const slide = this.slides[i];

				if (
					i <= this.currentIndex + itemsQty &&
					i >= this.currentIndex - itemsQty
				)
					slide.classList.add('active');
				else slide.classList.remove('active');
			}
		} else {
			const maxIndex = this.isCentered
				? this.currentIndex +
					this.getCurrentSlidesQty() +
					(this.getCurrentSlidesQty() - 1)
				: this.currentIndex + this.getCurrentSlidesQty();

			this.slides.forEach((el, i) => {
				if (i >= this.currentIndex && i < maxIndex) {
					el.classList.add('active');
				} else {
					el.classList.remove('active');
				}
			});
		}
	}

	private setCurrentDot() {
		const toggleDotActive = (el: HTMLElement | Element, i: number) => {
			let statement = false;
			const itemsQty = Math.floor(this.getCurrentSlidesQty() / 2);

			if (this.isSnap && !this.hasSnapSpacers) {
				statement =
					i ===
					(this.getCurrentSlidesQty() % 2 === 0
						? this.currentIndex - itemsQty + 1
						: this.currentIndex - itemsQty);
			} else statement = i === this.currentIndex;

			if (statement) el.classList.add('active');
			else el.classList.remove('active');
		};

		if (this.dotsItems)
			this.dotsItems.forEach((el, i) => toggleDotActive(el, i));
		else
			this.dots
				.querySelectorAll(':scope > *')
				.forEach((el, i) => toggleDotActive(el, i));
	}

	private setElementToDisabled(el: HTMLElement) {
		el.classList.add('disabled');
		if (el.tagName === 'BUTTON' || el.tagName === 'INPUT')
			el.setAttribute('disabled', 'disabled');
	}

	private unsetElementToDisabled(el: HTMLElement) {
		el.classList.remove('disabled');
		if (el.tagName === 'BUTTON' || el.tagName === 'INPUT')
			el.removeAttribute('disabled');
	}

	private addDisabledClass() {
		if (!this.prev || !this.next) return false;

		const gapValue = getComputedStyle(this.inner).getPropertyValue('gap');
		const itemsQty = Math.floor(this.getCurrentSlidesQty() / 2);
		let currentIndex = 0;
		let maxIndex = 0;
		let statementPrev = false;
		let statementNext = false;

		if (this.isSnap) {
			currentIndex = this.currentIndex;
			maxIndex = this.hasSnapSpacers
				? this.slides.length - 1
				: this.slides.length - itemsQty - 1;
			statementPrev = this.hasSnapSpacers
				? currentIndex === 0
				: this.getCurrentSlidesQty() % 2 === 0
					? currentIndex - itemsQty < 0
					: currentIndex - itemsQty === 0;
			statementNext =
				currentIndex >= maxIndex &&
				this.container.scrollLeft +
					this.container.clientWidth +
					(parseFloat(gapValue) || 0) >=
					this.container.scrollWidth;
		} else {
			currentIndex = this.currentIndex;
			maxIndex = this.isCentered
				? this.slides.length -
					this.getCurrentSlidesQty() +
					(this.getCurrentSlidesQty() - 1)
				: this.slides.length - this.getCurrentSlidesQty();
			statementPrev = currentIndex === 0;
			statementNext = currentIndex >= maxIndex;
		}

		if (statementPrev) {
			this.unsetElementToDisabled(this.next);
			this.setElementToDisabled(this.prev);
		} else if (statementNext) {
			this.unsetElementToDisabled(this.prev);
			this.setElementToDisabled(this.next);
		} else {
			this.unsetElementToDisabled(this.prev);
			this.unsetElementToDisabled(this.next);
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
		this.sliderWidth = this.inner.parentElement.getBoundingClientRect().width;

		this.calculateWidth();

		if (
			this.sliderWidth !==
			this.inner.parentElement.getBoundingClientRect().width
		)
			this.recalculateWidth();
	}

	private calculateTransform(currentIdx?: number | undefined): void {
		if (currentIdx !== undefined) this.currentIndex = currentIdx;
		if (
			this.currentIndex > this.slides.length - this.getCurrentSlidesQty() &&
			!this.isCentered
		)
			this.currentIndex = this.slides.length - this.getCurrentSlidesQty();

		const containerWidth = this.sliderWidth;
		const itemWidth = containerWidth / this.getCurrentSlidesQty();
		let translateX = this.currentIndex * itemWidth;

		// TODO:: need to test auto scrolling to the end if last on resize
		if (this.isSnap && !this.isCentered) {
			if (
				this.container.scrollLeft < containerWidth &&
				this.container.scrollLeft + itemWidth / 2 > containerWidth
			)
				this.container.scrollLeft = this.container.scrollWidth;
		}

		if (this.isCentered && !this.isSnap) {
			const centeredOffset = (containerWidth - itemWidth) / 2;

			if (this.currentIndex === 0) translateX = -centeredOffset;
			else if (
				this.currentIndex >=
				this.slides.length -
					this.getCurrentSlidesQty() +
					(this.getCurrentSlidesQty() - 1)
			) {
				const totalSlideWidth = this.slides.length * itemWidth;

				translateX = totalSlideWidth - containerWidth + centeredOffset;
			} else translateX = this.currentIndex * itemWidth - centeredOffset;
		}

		if (!this.isSnap)
			this.inner.style.transform = this.isRTL
				? `translate(${translateX}px, 0px)`
				: `translate(${-translateX}px, 0px)`;

		if (this.isAutoHeight)
			this.inner.style.height = `${this.slides[this.currentIndex].clientHeight}px`;

		if (this.dotsItems) this.goToCurrentDot();

		this.addCurrentClass();
		if (!this.isInfiniteLoop) this.addDisabledClass();
		if (this.isSnap && this.hasSnapSpacers) this.buildSnapSpacers();
		if (this.infoCurrent) this.setInfoCurrent();
	}

	private setTranslate(val: number) {
		this.inner.style.transform = this.isRTL
			? `translate(${-val}px, 0px)`
			: `translate(${val}px, 0px)`;
	}

	public goToPrev() {
		if (this.currentIndex > 0) {
			this.currentIndex--;
		} else {
			this.currentIndex = this.slides.length - this.getCurrentSlidesQty();
		}

		if (this.isSnap) {
			const itemWidth = this.sliderWidth / this.getCurrentSlidesQty();

			this.container.scrollBy({
				left: Math.max(-this.container.scrollLeft, -itemWidth),
				behavior: 'smooth',
			});

			this.addCurrentClass();
			if (!this.isInfiniteLoop) this.addDisabledClass();
		} else this.calculateTransform();

		if (this.dots) this.setCurrentDot();
	}

	public goToNext() {
		const statement = this.isCentered
			? this.slides.length -
				this.getCurrentSlidesQty() +
				(this.getCurrentSlidesQty() - 1)
			: this.slides.length - this.getCurrentSlidesQty();

		if (this.currentIndex < statement) {
			this.currentIndex++;
		} else {
			this.currentIndex = 0;
		}

		if (this.isSnap) {
			const itemWidth = this.sliderWidth / this.getCurrentSlidesQty();
			const maxScrollLeft =
				this.container.scrollWidth - this.container.clientWidth;

			this.container.scrollBy({
				left: Math.min(itemWidth, maxScrollLeft - this.container.scrollLeft),
				behavior: 'smooth',
			});

			this.addCurrentClass();
			if (!this.isInfiniteLoop) this.addDisabledClass();
		} else this.calculateTransform();

		if (this.dots) this.setCurrentDot();
	}

	public goTo(i: number) {
		const currentIndex = this.currentIndex;
		this.currentIndex = i;

		if (this.isSnap) {
			const itemWidth = this.sliderWidth / this.getCurrentSlidesQty();
			const index =
				currentIndex > this.currentIndex
					? currentIndex - this.currentIndex
					: this.currentIndex - currentIndex;
			const width =
				currentIndex > this.currentIndex
					? -(itemWidth * index)
					: itemWidth * index;

			this.container.scrollBy({
				left: width,
				behavior: 'smooth',
			});

			this.addCurrentClass();
			if (!this.isInfiniteLoop) this.addDisabledClass();
		} else this.calculateTransform();

		if (this.dots) this.setCurrentDot();
	}

	private setIndex(i: number) {
		this.currentIndex = i;

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

if (typeof window !== 'undefined') {
	window.HSCarousel = HSCarousel;
}

export default HSCarousel;
