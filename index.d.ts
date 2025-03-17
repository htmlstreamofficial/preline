import { VirtualElement } from '@floating-ui/dom';

export interface ICopyMarkupOptions {
	targetSelector: string;
	wrapperSelector: string;
	limit?: number;
}
export interface ICopyMarkup {
	options?: ICopyMarkupOptions;
	delete(target: HTMLElement): void;
	destroy(): void;
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
export declare class HSCopyMarkup extends HSBasePlugin<ICopyMarkupOptions> implements ICopyMarkup {
	private readonly targetSelector;
	private readonly wrapperSelector;
	private readonly limit;
	private target;
	private wrapper;
	private items;
	private onElementClickListener;
	private onDeleteItemButtonClickListener;
	constructor(el: HTMLElement, options?: ICopyMarkupOptions);
	private elementClick;
	private deleteItemButtonClick;
	private init;
	private copy;
	private addPredefinedItems;
	private setTarget;
	private setWrapper;
	private addToItems;
	delete(target: HTMLElement): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCopyMarkup | ICollectionItem<HSCopyMarkup>;
	static autoInit(): void;
}
export interface IAccordionTreeViewStaticOptions {
}
export interface IAccordionTreeView {
	el: HTMLElement | null;
	options?: IAccordionTreeViewStaticOptions;
	listeners?: {
		el: HTMLElement;
		listener: (evt: Event) => void;
	}[];
}
export interface IAccordionOptions {
}
export interface IAccordion {
	options?: IAccordionOptions;
	toggleClick(evt: Event): void;
	show(): void;
	hide(): void;
	update(): void;
	destroy(): void;
}
export declare class HSAccordion extends HSBasePlugin<IAccordionOptions> implements IAccordion {
	private toggle;
	content: HTMLElement | null;
	private group;
	private isAlwaysOpened;
	private keepOneOpen;
	private isToggleStopPropagated;
	private onToggleClickListener;
	static selectable: IAccordionTreeView[];
	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {});
	private init;
	toggleClick(evt: Event): boolean;
	show(): boolean;
	hide(): boolean;
	update(): boolean;
	destroy(): void;
	private static findInCollection;
	static autoInit(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSAccordion>;
	static show(target: HSAccordion | HTMLElement | string): void;
	static hide(target: HSAccordion | HTMLElement | string): void;
	static onSelectableClick: (evt: Event, item: IAccordionTreeView, el: HTMLElement) => void;
	static treeView(): boolean;
	static toggleSelected(root: IAccordionTreeView, item: HTMLElement): void;
	static on(evt: string, target: HSAccordion | HTMLElement | string, cb: Function): void;
}
export type TCarouselOptionsSlidesQty = {
	[key: string]: number;
};
export interface ICarouselOptions {
	currentIndex: number;
	loadingClasses?: string | string[];
	dotsItemClasses?: string;
	mode?: "default" | "scroll-nav";
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
export declare class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
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
	private onPrevClickListener;
	private onNextClickListener;
	private onContainerScrollListener;
	private onElementTouchStartListener;
	private onElementTouchEndListener;
	private onInnerMouseDownListener;
	private onInnerTouchStartListener;
	private onDocumentMouseMoveListener;
	private onDocumentTouchMoveListener;
	private onDocumentMouseUpListener;
	private onDocumentTouchEndListener;
	private onDotClickListener;
	constructor(el: HTMLElement, options?: ICarouselOptions);
	private setIsSnap;
	private prevClick;
	private nextClick;
	private containerScroll;
	private elementTouchStart;
	private elementTouchEnd;
	private innerMouseDown;
	private innerTouchStart;
	private documentMouseMove;
	private documentTouchMove;
	private documentMouseUp;
	private documentTouchEnd;
	private dotClick;
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
	private calculateTransform;
	private setTransform;
	private setTranslate;
	private setIndex;
	recalculateWidth(): void;
	goToPrev(): void;
	goToNext(): void;
	goTo(i: number): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCarousel | ICollectionItem<HSCarousel>;
	static autoInit(): void;
}
export interface ICollapse {
	options?: {};
	show(): void;
	hide(): void;
	destroy(): void;
}
export declare class HSCollapse extends HSBasePlugin<{}> implements ICollapse {
	private readonly contentId;
	content: HTMLElement | null;
	private animationInProcess;
	private onElementClickListener;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private elementClick;
	private init;
	private hideAllMegaMenuItems;
	show(): boolean;
	hide(): boolean;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSCollapse>;
	static autoInit(): void;
	static show(target: HSCollapse | HTMLElement | string): void;
	static hide(target: HSCollapse | HTMLElement | string): void;
	static on(evt: string, target: HSCollapse | HTMLElement | string, cb: Function): void;
}
export interface IComboBoxOptions {
	gap?: number;
	viewport?: string | HTMLElement | null;
	preventVisibility?: boolean;
	minSearchLength?: number;
	apiUrl?: string | null;
	apiDataPart?: string | null;
	apiQuery?: string | null;
	apiSearchQuery?: string | null;
	apiSearchPath?: string | null;
	apiSearchDefaultPath?: string | null;
	apiHeaders?: {};
	apiGroupField?: string | null;
	outputItemTemplate?: string | null;
	outputEmptyTemplate?: string | null;
	outputLoaderTemplate?: string | null;
	groupingType?: "default" | "tabs" | null;
	groupingTitleTemplate?: string | null;
	tabsWrapperTemplate?: string | null;
	preventSelection?: boolean;
	preventAutoPosition?: boolean;
	isOpenOnFocus?: boolean;
}
export interface IComboBox {
	options?: IComboBoxOptions;
	getCurrentData(): {} | {}[];
	open(): void;
	close(): void;
	recalculateDirection(): void;
	destroy(): void;
}
export declare class HSComboBox extends HSBasePlugin<IComboBoxOptions> implements IComboBox {
	gap: number;
	viewport: string | HTMLElement | null;
	preventVisibility: boolean;
	minSearchLength: number;
	apiUrl: string | null;
	apiDataPart: string | null;
	apiQuery: string | null;
	apiSearchQuery: string | null;
	apiSearchPath: string | null;
	apiSearchDefaultPath: string | null;
	apiHeaders: {};
	apiGroupField: string | null;
	outputItemTemplate: string | null;
	outputEmptyTemplate: string | null;
	outputLoaderTemplate: string | null;
	groupingType: "default" | "tabs" | null;
	groupingTitleTemplate: string | null;
	tabsWrapperTemplate: string | null;
	preventSelection: boolean;
	preventAutoPosition: boolean;
	isOpenOnFocus: boolean;
	private readonly input;
	private readonly output;
	private readonly itemsWrapper;
	private items;
	private tabs;
	private readonly toggle;
	private readonly toggleClose;
	private readonly toggleOpen;
	private outputPlaceholder;
	private outputLoader;
	private value;
	private selected;
	private currentData;
	private groups;
	private selectedGroup;
	isOpened: boolean;
	isCurrent: boolean;
	private animationInProcess;
	private isSearchLengthExceeded;
	private onInputFocusListener;
	private onInputInputListener;
	private onToggleClickListener;
	private onToggleCloseClickListener;
	private onToggleOpenClickListener;
	constructor(el: HTMLElement, options?: IComboBoxOptions, events?: {});
	private inputFocus;
	private inputInput;
	private toggleClick;
	private toggleCloseClick;
	private toggleOpenClick;
	private init;
	private build;
	private getNestedProperty;
	private setValue;
	private setValueAndOpen;
	private setValueAndClear;
	private setSelectedByValue;
	private setResultAndRender;
	private setResults;
	private setGroups;
	private setApiGroups;
	private setItemsVisibility;
	private isTextExists;
	private isTextExistsAny;
	private hasVisibleItems;
	private valuesBySelector;
	private sortItems;
	private buildInput;
	private buildItems;
	private buildOutputLoader;
	private buildToggle;
	private buildToggleClose;
	private buildToggleOpen;
	private buildOutputPlaceholder;
	private destroyOutputLoader;
	private itemRender;
	private plainRender;
	private jsonItemsRender;
	private groupDefaultRender;
	private groupTabsRender;
	private itemsFromHtml;
	private itemsFromJson;
	private appendItemsToWrapper;
	private resultItems;
	private destroyOutputPlaceholder;
	getCurrentData(): {} | {}[];
	setCurrent(): void;
	open(val?: string): boolean;
	close(val?: string | null, data?: {} | null): boolean;
	recalculateDirection(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSComboBox | ICollectionItem<HSComboBox>;
	static autoInit(): void;
	static close(target: HTMLElement | string): void;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null): void;
	private static getPreparedItems;
	private static setHighlighted;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onEnter(evt: Event): void;
}
export interface IDropdown {
	options?: {};
	open(): void;
	close(isAnimated: boolean): void;
	forceClearState(): void;
	destroy(): void;
}
export interface IHTMLElementFloatingUI extends HTMLElement {
	_floatingUI: any;
}
export declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementFloatingUI> implements IDropdown {
	private static history;
	private readonly toggle;
	private readonly closers;
	menu: HTMLElement | null;
	private eventMode;
	private closeMode;
	private hasAutofocus;
	private animationInProcess;
	private longPressTimer;
	private onElementMouseEnterListener;
	private onElementMouseLeaveListener;
	private onToggleClickListener;
	private onToggleContextMenuListener;
	private onTouchStartListener;
	private onTouchEndListener;
	private onCloserClickListener;
	constructor(el: IHTMLElementFloatingUI, options?: {}, events?: {});
	private elementMouseEnter;
	private elementMouseLeave;
	private toggleClick;
	private toggleContextMenu;
	private handleTouchStart;
	private handleTouchEnd;
	private closerClick;
	private init;
	resizeHandler(): void;
	private buildToggle;
	private buildMenu;
	private buildClosers;
	private getScrollbarSize;
	private onContextMenuHandler;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyFloatingUI;
	private focusElement;
	private setupFloatingUI;
	private selectCheckbox;
	private selectRadio;
	calculatePopperPosition(target?: VirtualElement | HTMLElement): string;
	open(target?: VirtualElement | HTMLElement): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): ICollectionItem<HSDropdown> | IHTMLElementFloatingUI;
	static autoInit(): void;
	static open(target: HSDropdown | HTMLElement | string): void;
	static close(target: HSDropdown | HTMLElement | string): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(evt: KeyboardEvent): void;
	static onEnter(evt: KeyboardEvent): boolean;
	static onArrow(isArrowUp?: boolean): boolean;
	static onArrowX(evt: KeyboardEvent, direction: "right" | "left"): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onFirstLetter(code: string): boolean;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null, isAnimated?: boolean): void;
	static on(evt: string, target: HSDropdown | HTMLElement | string, cb: Function): void;
}
export interface IInputNumberOptions {
	min?: number;
	max?: number;
	step?: number;
}
export interface IInputNumber {
	options?: IInputNumberOptions;
	destroy(): void;
}
export declare class HSInputNumber extends HSBasePlugin<IInputNumberOptions> implements IInputNumber {
	private readonly input;
	private readonly increment;
	private readonly decrement;
	private inputValue;
	private readonly minInputValue;
	private readonly maxInputValue;
	private readonly step;
	private onInputInputListener;
	private onIncrementClickListener;
	private onDecrementClickListener;
	constructor(el: HTMLElement, options?: IInputNumberOptions);
	private inputInput;
	private incrementClick;
	private decrementClick;
	private init;
	private checkIsNumberAndConvert;
	private cleanAndExtractNumber;
	private build;
	private buildInput;
	private buildIncrement;
	private buildDecrement;
	private changeValue;
	private disableButtons;
	private enableButtons;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSInputNumber | {
		id: number;
		element: HSInputNumber;
	};
	static autoInit(): void;
}
export interface ILayoutSplitterOptions {
	horizontalSplitterClasses?: string | null;
	horizontalSplitterTemplate?: string;
	verticalSplitterClasses?: string | null;
	verticalSplitterTemplate?: string;
	isSplittersAddedManually?: boolean;
}
export interface IControlLayoutSplitter {
	el: HTMLElement;
	direction: "horizontal" | "vertical";
	prev: HTMLElement | null;
	next: HTMLElement | null;
}
export interface ILayoutSplitter {
	options?: ILayoutSplitterOptions;
	getSplitterItemSingleParam(item: HTMLElement, name: string): any;
	getData(el: HTMLElement): any;
	setSplitterItemSize(el: HTMLElement, size: number): void;
	updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void;
	destroy(): void;
}
export declare class HSLayoutSplitter extends HSBasePlugin<ILayoutSplitterOptions> implements ILayoutSplitter {
	static isListenersInitialized: boolean;
	private readonly horizontalSplitterClasses;
	private readonly horizontalSplitterTemplate;
	private readonly verticalSplitterClasses;
	private readonly verticalSplitterTemplate;
	private readonly isSplittersAddedManually;
	private horizontalSplitters;
	private horizontalControls;
	private verticalSplitters;
	private verticalControls;
	isDragging: boolean;
	activeSplitter: IControlLayoutSplitter | null;
	private onControlPointerDownListener;
	constructor(el: HTMLElement, options?: ILayoutSplitterOptions);
	private controlPointerDown;
	private controlPointerUp;
	private static onDocumentPointerMove;
	private static onDocumentPointerUp;
	private init;
	private buildSplitters;
	private buildHorizontalSplitters;
	private buildVerticalSplitters;
	private buildControl;
	private getSplitterItemParsedParam;
	private getContainerSize;
	private getMaxFlexSize;
	private updateHorizontalSplitter;
	private updateSingleSplitter;
	private updateVerticalSplitter;
	private updateSplitterItemParam;
	private onPointerDownHandler;
	private onPointerUpHandler;
	private onPointerMoveHandler;
	private bindListeners;
	private calculateAvailableSize;
	private calculateResizedSizes;
	private enforceLimits;
	private applySizes;
	getSplitterItemSingleParam(item: HTMLElement, name: string): any;
	getData(el: HTMLElement): any;
	setSplitterItemSize(el: HTMLElement, size: number): void;
	updateFlexValues(data: Array<{
		id: string;
		breakpoints: Record<number, number>;
	}>): void;
	destroy(): void;
	private static findInCollection;
	static autoInit(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSLayoutSplitter>;
	static on(evt: string, target: HSLayoutSplitter | HTMLElement | string, cb: Function): void;
}
export interface IOverlayOptions {
	hiddenClass?: string | null;
	emulateScrollbarSpace?: boolean;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropParent?: string | HTMLElement | Document;
	backdropExtraClasses?: string | null;
	moveOverlayToBody?: number | null;
}
export interface IOverlay {
	options?: IOverlayOptions;
	open(cb: Function | null): void;
	close(forceClose: boolean, cb: Function | null): void;
	destroy(): void;
}
export type TOverlayOptionsAutoCloseEqualityType = "less-than" | "more-than";
export declare class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass;
	private readonly emulateScrollbarSpace;
	private readonly isClosePrev;
	private readonly backdropClasses;
	private readonly backdropParent;
	private readonly backdropExtraClasses;
	private readonly animationTarget;
	private openNextOverlay;
	private autoHide;
	private toggleButtons;
	static openedItemsQty: number;
	initContainer: HTMLElement | null;
	isCloseWhenClickInside: boolean;
	isTabAccessibilityLimited: boolean;
	isLayoutAffect: boolean;
	hasAutofocus: boolean;
	hasDynamicZIndex: boolean;
	hasAbilityToCloseOnBackdropClick: boolean;
	openedBreakpoint: number | null;
	autoClose: number | null;
	autoCloseEqualityType: TOverlayOptionsAutoCloseEqualityType | null;
	moveOverlayToBody: number | null;
	private backdrop;
	private initialZIndex;
	static currentZIndex: number;
	private onElementClickListener;
	private onOverlayClickListener;
	private onBackdropClickListener;
	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {});
	private elementClick;
	private overlayClick;
	private backdropClick;
	private init;
	private getElementsByZIndex;
	private buildToggleButtons;
	private hideAuto;
	private checkTimer;
	private buildBackdrop;
	private destroyBackdrop;
	private focusElement;
	private getScrollbarSize;
	private collectToggleParameters;
	open(cb?: Function | null): Promise<void>;
	close(forceClose?: boolean, cb?: Function | null): Promise<unknown>;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSOverlay>;
	static autoInit(): void;
	static open(target: HSOverlay | HTMLElement | string): void;
	static close(target: HSOverlay | HTMLElement | string): void;
	static setOpened(breakpoint: number, el: ICollectionItem<HSOverlay>): void;
	static accessibility(evt: KeyboardEvent): boolean;
	static onEscape(target: ICollectionItem<HSOverlay>): void;
	static onTab(target: ICollectionItem<HSOverlay>): boolean;
	static on(evt: string, target: HSOverlay | HTMLElement | string, cb: Function): void;
}
export interface IPinInputOptions {
	availableCharsRE?: RegExp;
}
export interface IPinInput {
	options?: IPinInputOptions;
	destroy(): void;
}
export declare class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items;
	private currentItem;
	private currentValue;
	private readonly placeholders;
	private readonly availableCharsRE;
	private onElementInputListener;
	private onElementPasteListener;
	private onElementKeydownListener;
	private onElementFocusinListener;
	private onElementFocusoutListener;
	private elementInput;
	private elementPaste;
	private elementKeydown;
	private elementFocusin;
	private elementFocusout;
	constructor(el: HTMLElement, options?: IPinInputOptions);
	private init;
	private build;
	private buildInputItems;
	private checkIfNumber;
	private autoFillAll;
	private setCurrentValue;
	private toggleCompleted;
	private onInput;
	private onKeydown;
	private onFocusIn;
	private onFocusOut;
	private onPaste;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSPinInput | ICollectionItem<HSPinInput>;
	static autoInit(): void;
}
export interface IRemoveElementOptions {
	removeTargetAnimationClass: string;
}
export interface IRemoveElement {
	options?: IRemoveElementOptions;
	destroy(): void;
}
export declare class HSRemoveElement extends HSBasePlugin<IRemoveElementOptions> implements IRemoveElement {
	private readonly removeTargetId;
	private readonly removeTarget;
	private readonly removeTargetAnimationClass;
	private onElementClickListener;
	constructor(el: HTMLElement, options?: IRemoveElementOptions);
	private elementClick;
	private init;
	private remove;
	destroy(): void;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSRemoveElement>;
	static autoInit(): void;
}
export interface IScrollNavOptions {
	paging?: boolean;
	autoCentering?: boolean;
}
export interface IScrollNavCurrentState {
	first: HTMLElement;
	last: HTMLElement;
	center: HTMLElement;
}
export interface IScrollNav {
	options?: IScrollNavOptions;
	getCurrentState(): IScrollNavCurrentState;
	goTo(el: Element, cb?: () => void): void;
	centerElement(el: HTMLElement, behavior: ScrollBehavior): void;
	destroy(): void;
}
export declare class HSScrollNav extends HSBasePlugin<IScrollNavOptions> implements IScrollNav {
	private readonly paging;
	private readonly autoCentering;
	private body;
	private items;
	private prev;
	private next;
	private currentState;
	constructor(el: HTMLElement, options?: IScrollNavOptions);
	private init;
	private setCurrentState;
	private setPrevToDisabled;
	private setNextToDisabled;
	private buildPrev;
	private buildNext;
	private buildPrevSingle;
	private buildNextSingle;
	private getCenterVisibleItem;
	private getFirstVisibleItem;
	private getLastVisibleItem;
	private getVisibleItemsCount;
	private scrollToActiveElement;
	getCurrentState(): IScrollNavCurrentState;
	goTo(el: Element, cb?: () => void): void;
	centerElement(el: HTMLElement, behavior?: ScrollBehavior): void;
	destroy(): void;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSScrollNav>;
	static autoInit(): void;
}
export interface IScrollspyOptions {
	ignoreScrollUp?: boolean;
}
export interface IScrollspy {
	options?: IScrollspyOptions;
	destroy(): void;
}
export declare class HSScrollspy extends HSBasePlugin<IScrollspyOptions> implements IScrollspy {
	private readonly ignoreScrollUp;
	private readonly links;
	private readonly sections;
	private readonly scrollableId;
	private readonly scrollable;
	private isScrollingDown;
	private lastScrollTop;
	private onScrollableScrollListener;
	private onLinkClickListener;
	constructor(el: HTMLElement, options?: {});
	private scrollableScroll;
	private init;
	private determineScrollDirection;
	private linkClick;
	private update;
	private scrollTo;
	destroy(): void;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSScrollspy>;
	static autoInit(): void;
}
export interface ISingleOptionOptions {
	description: string;
	icon: string;
}
export interface ISingleOption {
	title: string;
	val: string;
	disabled?: boolean;
	selected?: boolean;
	options?: ISingleOptionOptions | null;
}
export interface IApiFieldMap {
	id: string;
	val: string;
	title: string;
	icon?: string | null;
	description?: string | null;
	[key: string]: unknown;
}
export interface ISelectOptions {
	value?: string | string[];
	isOpened?: boolean;
	placeholder?: string;
	hasSearch?: boolean;
	minSearchLength?: number;
	preventSearchFocus?: boolean;
	mode?: string;
	viewport?: string;
	wrapperClasses?: string;
	apiUrl?: string | null;
	apiQuery?: string | null;
	apiOptions?: RequestInit | null;
	apiDataPart?: string | null;
	apiSearchQueryKey?: string | null;
	apiFieldsMap?: IApiFieldMap | null;
	apiIconTag?: string | null;
	toggleTag?: string;
	toggleClasses?: string;
	toggleSeparators?: {
		items?: string;
		betweenItemsAndCounter?: string;
	};
	toggleCountText?: string | null;
	toggleCountTextPlacement?: "postfix" | "prefix" | "postfix-no-space" | "prefix-no-space";
	toggleCountTextMinItems?: number;
	toggleCountTextMode?: string;
	tagsItemTemplate?: string;
	tagsItemClasses?: string;
	tagsInputId?: string;
	tagsInputClasses?: string;
	dropdownTag?: string;
	dropdownClasses?: string;
	dropdownDirectionClasses?: {
		top?: string;
		bottom?: string;
	};
	dropdownSpace: number;
	dropdownPlacement: string | null;
	dropdownVerticalFixedPlacement: "top" | "bottom" | null;
	dropdownScope: "window" | "parent";
	extraMarkup?: string | string[] | null;
	searchTemplate?: string;
	searchWrapperTemplate?: string;
	searchId?: string;
	searchLimit?: number | typeof Infinity;
	isSearchDirectMatch?: boolean;
	searchClasses?: string;
	searchWrapperClasses?: string;
	searchPlaceholder?: string;
	searchNoResultTemplate?: string | null;
	searchNoResultText?: string | null;
	searchNoResultClasses?: string | null;
	optionAllowEmptyOption?: boolean;
	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;
	descriptionClasses?: string;
	iconClasses?: string;
	isAddTagOnEnter?: boolean;
}
export interface ISelect {
	options?: ISelectOptions;
	setValue(val: string | string[]): void;
	open(): void;
	close(): void;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): void;
	destroy(): void;
}
export declare class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder;
	private readonly hasSearch;
	private readonly minSearchLength;
	private readonly preventSearchFocus;
	private readonly mode;
	private readonly viewport;
	isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;
	selectedItems: string[];
	private readonly apiUrl;
	private readonly apiQuery;
	private readonly apiOptions;
	private readonly apiDataPart;
	private readonly apiSearchQueryKey;
	private readonly apiFieldsMap;
	private readonly apiIconTag;
	private readonly toggleTag;
	private readonly toggleClasses;
	private readonly toggleSeparators;
	private readonly toggleCountText;
	private readonly toggleCountTextPlacement;
	private readonly toggleCountTextMinItems;
	private readonly toggleCountTextMode;
	private readonly wrapperClasses;
	private readonly tagsItemTemplate;
	private readonly tagsItemClasses;
	private readonly tagsInputId;
	private readonly tagsInputClasses;
	private readonly dropdownTag;
	private readonly dropdownClasses;
	private readonly dropdownDirectionClasses;
	dropdownSpace: number | null;
	readonly dropdownPlacement: string | null;
	readonly dropdownVerticalFixedPlacement: "top" | "bottom" | null;
	readonly dropdownScope: "window" | "parent";
	private readonly searchTemplate;
	private readonly searchWrapperTemplate;
	private readonly searchPlaceholder;
	private readonly searchId;
	private readonly searchLimit;
	private readonly isSearchDirectMatch;
	private readonly searchClasses;
	private readonly searchWrapperClasses;
	private readonly searchNoResultTemplate;
	private readonly searchNoResultText;
	private readonly searchNoResultClasses;
	private readonly optionAllowEmptyOption;
	private readonly optionTag;
	private readonly optionTemplate;
	private readonly optionClasses;
	private readonly descriptionClasses;
	private readonly iconClasses;
	private animationInProcess;
	private wrapper;
	private toggle;
	private toggleTextWrapper;
	private tagsInput;
	private dropdown;
	private floatingUIInstance;
	private searchWrapper;
	private search;
	private searchNoResult;
	private selectOptions;
	private extraMarkup;
	private readonly isAddTagOnEnter;
	private tagsInputHelper;
	private remoteOptions;
	private optionId;
	private onWrapperClickListener;
	private onToggleClickListener;
	private onTagsInputFocusListener;
	private onTagsInputInputListener;
	private onTagsInputInputSecondListener;
	private onTagsInputKeydownListener;
	private onSearchInputListener;
	constructor(el: HTMLElement, options?: ISelectOptions);
	private wrapperClick;
	private toggleClick;
	private tagsInputFocus;
	private tagsInputInput;
	private tagsInputInputSecond;
	private tagsInputKeydown;
	private searchInput;
	setValue(val: string | string[]): void;
	private init;
	private build;
	private buildWrapper;
	private buildExtraMarkup;
	private buildToggle;
	private setToggleIcon;
	private setToggleTitle;
	private buildTags;
	private reassignTagsInputPlaceholder;
	private buildTagsItem;
	private getItemByValue;
	private setTagsItems;
	private buildTagsInput;
	private buildDropdown;
	private buildFloatingUI;
	private updateDropdownWidth;
	private buildSearch;
	private buildOption;
	private buildOptionFromRemoteData;
	private buildOptionsFromRemoteData;
	private optionsFromRemoteData;
	private apiRequest;
	private sortElements;
	private remoteSearch;
	private destroyOption;
	private buildOriginalOption;
	private destroyOriginalOption;
	private buildTagsInputHelper;
	private calculateInputWidth;
	private adjustInputWidth;
	private onSelectOption;
	private triggerChangeEventForNativeSelect;
	private addSelectOption;
	private removeSelectOption;
	private resetTagsInputField;
	private clearSelections;
	private setNewValue;
	private stringFromValueBasic;
	private stringFromValueRemoteData;
	private stringFromValue;
	private selectSingleItem;
	private selectMultipleItems;
	private unselectMultipleItems;
	private searchOptions;
	private eraseToggleIcon;
	private eraseToggleTitle;
	private toggleFn;
	destroy(): void;
	open(): boolean;
	close(forceFocus?: boolean): boolean;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): boolean;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSSelect | ICollectionItem<HSSelect>;
	static autoInit(): void;
	static open(target: HSSelect | HTMLElement | string): void;
	static close(target: HSSelect | HTMLElement | string): void;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onTab(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onEnter(evt: Event): void;
}
export interface IStepperOptions {
	currentIndex?: number;
	isCompleted?: boolean;
	mode?: string;
}
export interface IStepper {
	options?: IStepperOptions;
	setProcessedNavItem(n?: number): void;
	unsetProcessedNavItem(n?: number): void;
	goToNext(): void;
	disableButtons(): void;
	enableButtons(): void;
	setErrorNavItem(n?: number): void;
	destroy(): void;
}
export declare class HSStepper extends HSBasePlugin<{}> implements IStepper {
	private currentIndex;
	private readonly mode;
	private isCompleted;
	private totalSteps;
	private navItems;
	private contentItems;
	private backBtn;
	private nextBtn;
	private skipBtn;
	private completeStepBtn;
	private completeStepBtnDefaultText;
	private finishBtn;
	private resetBtn;
	private onNavItemClickListener;
	private onBackClickListener;
	private onNextClickListener;
	private onSkipClickListener;
	private onCompleteStepBtnClickListener;
	private onFinishBtnClickListener;
	private onResetBtnClickListener;
	constructor(el: HTMLElement, options?: IStepperOptions);
	private navItemClick;
	private backClick;
	private nextClick;
	private skipClick;
	private completeStepBtnClick;
	private finishBtnClick;
	private resetBtnClick;
	private init;
	private getUncompletedSteps;
	private setTotalSteps;
	private buildNav;
	private buildNavItem;
	private addNavItem;
	private setCurrentNavItem;
	private setCurrentNavItemActions;
	private getNavItem;
	private setProcessedNavItemActions;
	private setErrorNavItemActions;
	private unsetCurrentNavItemActions;
	private handleNavItemClick;
	private buildContent;
	private buildContentItem;
	private addContentItem;
	private setCurrentContentItem;
	private hideAllContentItems;
	private setCurrentContentItemActions;
	private unsetCurrentContentItemActions;
	private disableAll;
	private disableNavItemActions;
	private enableNavItemActions;
	private buildButtons;
	private buildBackButton;
	private handleBackButtonClick;
	private checkForTheFirstStep;
	private setToDisabled;
	private setToNonDisabled;
	private buildNextButton;
	private unsetProcessedNavItemActions;
	private handleNextButtonClick;
	private removeOptionalClasses;
	private buildSkipButton;
	private setSkipItem;
	private setSkipItemActions;
	private showSkipButton;
	private handleSkipButtonClick;
	private buildCompleteStepButton;
	private changeTextAndDisableCompleteButtonIfStepCompleted;
	private setCompleteItem;
	private setCompleteItemActions;
	private showCompleteStepButton;
	private handleCompleteStepButtonClick;
	private buildFinishButton;
	private setCompleted;
	private unsetCompleted;
	private showFinishButton;
	private handleFinishButtonClick;
	private buildResetButton;
	private handleResetButtonClick;
	setProcessedNavItem(n?: number): void;
	unsetProcessedNavItem(n?: number): void;
	goToNext(): void;
	disableButtons(): void;
	enableButtons(): void;
	setErrorNavItem(n?: number): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSStepper | ICollectionItem<HSStepper>;
	static autoInit(): void;
}
export interface IStrongPasswordOptions {
	target: string | HTMLInputElement;
	hints?: string;
	stripClasses?: string;
	minLength?: number;
	mode?: string;
	popoverSpace?: number;
	checksExclude?: string[];
	specialCharactersSet?: string;
}
export interface IStrongPassword {
	options?: IStrongPasswordOptions;
	recalculateDirection(): void;
	destroy(): void;
}
export declare class HSStrongPassword extends HSBasePlugin<IStrongPasswordOptions> implements IStrongPassword {
	private readonly target;
	private readonly hints;
	private readonly stripClasses;
	private readonly minLength;
	private readonly mode;
	private readonly popoverSpace;
	private readonly checksExclude;
	private readonly specialCharactersSet;
	isOpened: boolean;
	private strength;
	private passedRules;
	private weakness;
	private rules;
	private availableChecks;
	private onTargetInputListener;
	private onTargetFocusListener;
	private onTargetBlurListener;
	private onTargetInputSecondListener;
	private onTargetInputThirdListener;
	constructor(el: HTMLElement, options?: IStrongPasswordOptions);
	private targetInput;
	private targetFocus;
	private targetBlur;
	private targetInputSecond;
	private targetInputThird;
	private init;
	private build;
	private buildStrips;
	private buildHints;
	private buildWeakness;
	private buildRules;
	private setWeaknessText;
	private setRulesText;
	private togglePopover;
	private checkStrength;
	private checkIfPassed;
	private setStrength;
	private hideStrips;
	recalculateDirection(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSStrongPassword>;
	static autoInit(): void;
}
export interface ITabsOptions {
	eventType: "click" | "hover";
	preventNavigationResolution: string | number | null;
}
export interface ITabs {
	options?: ITabsOptions;
	destroy(): void;
}
export declare class HSTabs extends HSBasePlugin<ITabsOptions> implements ITabs {
	private readonly eventType;
	private readonly preventNavigationResolution;
	toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId;
	private readonly extraToggle;
	private current;
	private currentContentId;
	currentContent: HTMLElement | null;
	private prev;
	private prevContentId;
	private prevContent;
	private onToggleHandler;
	private onExtraToggleChangeListener;
	constructor(el: HTMLElement, options?: ITabsOptions, events?: {});
	private toggle;
	private extraToggleChange;
	private init;
	private open;
	private change;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTabs | ICollectionItem<HSTabs>;
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onArrow(isOpposite?: boolean): void;
	static onStartEnd(isOpposite?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
export interface ITextareaAutoHeightOptions {
	defaultHeight: number;
}
export interface ITextareaAutoHeight {
	options?: ITextareaAutoHeightOptions;
	destroy(): void;
}
export declare class HSTextareaAutoHeight extends HSBasePlugin<ITextareaAutoHeightOptions> implements ITextareaAutoHeight {
	private readonly defaultHeight;
	private onElementInputListener;
	constructor(el: HTMLTextAreaElement, options?: ITextareaAutoHeightOptions);
	private elementInput;
	private init;
	private setAutoHeight;
	private textareaSetHeight;
	private checkIfOneLine;
	private isParentHidden;
	private parentType;
	private callbackAccordingToType;
	destroy(): void;
	static getInstance(target: HTMLTextAreaElement | string, isInstance?: boolean): HSTextareaAutoHeight | ICollectionItem<HSTextareaAutoHeight>;
	static autoInit(): void;
}
export interface IThemeSwitchOptions {
	theme?: "dark" | "light" | "default";
	type?: "change" | "click";
}
export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
	destroy(): void;
}
export declare class HSThemeSwitch extends HSBasePlugin<IThemeSwitchOptions> implements IThemeSwitch {
	theme: string;
	type: "change" | "click";
	private themeSet;
	private onElementChangeListener;
	private onElementClickListener;
	constructor(el: HTMLElement | HTMLInputElement, options?: IThemeSwitchOptions);
	private elementChange;
	private elementClick;
	private init;
	private buildSwitchTypeOfChange;
	private buildSwitchTypeOfClick;
	private setResetStyles;
	private addSystemThemeObserver;
	private removeSystemThemeObserver;
	private toggleObserveSystemTheme;
	setAppearance(theme?: string, isSaveToLocalStorage?: boolean, isSetDispatchEvent?: boolean): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSThemeSwitch>;
	static autoInit(): void;
}
export interface IToggleCountOptions {
	target: string | HTMLInputElement;
	min: number;
	max: number;
	duration: number;
}
export interface IToggleCount {
	options?: IToggleCountOptions;
	countUp(): void;
	countDown(): void;
	destroy(): void;
}
export declare class HSToggleCount extends HSBasePlugin<IToggleCountOptions> implements IToggleCount {
	private readonly target;
	private readonly min;
	private readonly max;
	private readonly duration;
	private isChecked;
	private onToggleChangeListener;
	constructor(el: HTMLElement, options?: IToggleCountOptions);
	private toggleChange;
	private init;
	private toggle;
	private animate;
	countUp(): void;
	countDown(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSToggleCount | ICollectionItem<HSToggleCount>;
	static autoInit(): void;
}
export interface ITogglePasswordOptions {
	target: string | string[] | HTMLInputElement | HTMLInputElement[];
}
export interface ITogglePassword {
	options?: ITogglePasswordOptions;
	show(): void;
	hide(): void;
	destroy(): void;
}
export declare class HSTogglePassword extends HSBasePlugin<ITogglePasswordOptions> implements ITogglePassword {
	private readonly target;
	private isShown;
	private isMultiple;
	private eventType;
	private onElementActionListener;
	constructor(el: HTMLElement, options?: ITogglePasswordOptions);
	private elementAction;
	private init;
	private getMultipleToggles;
	show(): void;
	hide(): void;
	destroy(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTogglePassword | ICollectionItem<HSTogglePassword>;
	static autoInit(): void;
}
export interface ITooltip {
	options?: {};
	show(): void;
	hide(): void;
	destroy(): void;
}
export declare class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle;
	content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventFloatingUI;
	private readonly placement;
	private readonly strategy;
	private readonly scope;
	cleanupAutoUpdate: (() => void) | null;
	private onToggleClickListener;
	private onToggleFocusListener;
	private onToggleMouseEnterListener;
	private onToggleMouseLeaveListener;
	private onToggleHandleListener;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private toggleClick;
	private toggleFocus;
	private toggleMouseEnter;
	private toggleMouseLeave;
	private toggleHandle;
	private init;
	private enter;
	private leave;
	private click;
	private focus;
	private buildFloatingUI;
	private _show;
	show(): void;
	hide(): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTooltip>;
	static autoInit(): void;
	static show(target: HSTooltip | HTMLElement | string): void;
	static hide(target: HSTooltip | HTMLElement | string): void;
	static on(evt: string, target: HSTooltip | HTMLElement | string, cb: Function): void;
}
export type ITreeViewOptionsControlBy = "checkbox" | "button";
export interface ITreeViewItem {
	id: string;
	value: string;
	isDir: boolean;
	path: string;
	isSelected?: boolean;
}
export interface ITreeViewOptions {
	items: ITreeViewItem[] | null;
	controlBy?: ITreeViewOptionsControlBy;
	autoSelectChildren?: boolean;
	isIndeterminate?: boolean;
}
export interface ITreeView {
	options?: ITreeViewOptions;
	update(): void;
	getSelectedItems(): ITreeViewItem[];
	changeItemProp(id: string, prop: string, val: any): void;
	destroy(): void;
}
export declare class HSTreeView extends HSBasePlugin<ITreeViewOptions> implements ITreeView {
	private items;
	private readonly controlBy;
	private readonly autoSelectChildren;
	private readonly isIndeterminate;
	static group: number;
	private onElementClickListener;
	private onControlChangeListener;
	constructor(el: HTMLElement, options?: ITreeViewOptions, events?: {});
	private elementClick;
	private controlChange;
	private init;
	private initItems;
	private controlByButton;
	private controlByCheckbox;
	private getItem;
	private getPath;
	private unselectItem;
	private selectItem;
	private selectChildren;
	private toggleParent;
	update(): void;
	getSelectedItems(): ITreeViewItem[];
	changeItemProp(id: string, prop: string, val: any): void;
	destroy(): void;
	private static findInCollection;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTreeView>;
	static autoInit(): void;
	static on(evt: string, target: HSTreeView | HTMLElement | string, cb: Function): void;
}
export interface IStaticMethods {
	getClassProperty(el: HTMLElement, prop?: string, val?: string): string;
	afterTransition(el: HTMLElement, cb: Function): void;
	autoInit(collection?: string | string[]): void;
	cleanCollection(collection?: string | string[]): void;
}
export declare const HSStaticMethods: IStaticMethods;
declare let HSDataTableModule: any;
declare let HSFileUploadModule: any;
declare let HSRangeSliderModule: any;
declare let HSDatepickerModule: any;

export {
	HSDataTableModule as HSDataTable,
	HSDatepickerModule as HSDatepicker,
	HSFileUploadModule as HSFileUpload,
	HSRangeSliderModule as HSRangeSlider,
};

export {};
