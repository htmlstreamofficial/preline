export interface ICopyMarkupOptions {
	targetSelector: string;
	wrapperSelector: string;
	limit?: number;
}
export interface ICopyMarkup {
	options?: ICopyMarkupOptions;
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
	isIOS(): boolean;
	isIpadOS(): boolean;
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	dispatch(evt: string, element: any, payload?: any): void;
	on(evt: string, cb: Function): void;
	afterTransition(el: HTMLElement, callback: Function): void;
	onTransitionEnd(el: HTMLElement, cb: Function): void;
	getClassProperty(el: HTMLElement, prop: string, val?: string): string;
	getClassPropertyAlt(el: HTMLElement, prop?: string, val?: string): string;
	htmlToElement(html: string): HTMLElement;
	classToClassList(classes: string, target: HTMLElement, splitter?: string): void;
	debounce(func: Function, timeout?: number): (...args: any[]) => void;
	checkIfFormElement(target: HTMLElement): boolean;
	static isEnoughSpace(el: HTMLElement, toggle: HTMLElement, preferredPosition?: "top" | "bottom" | "auto", space?: number, wrapper?: HTMLElement | null): boolean;
	static isParentOrElementHidden(element: any): any;
}
export declare class HSCopyMarkup extends HSBasePlugin<ICopyMarkupOptions> implements ICopyMarkup {
	private readonly targetSelector;
	private readonly wrapperSelector;
	private readonly limit;
	private target;
	private wrapper;
	private items;
	constructor(el: HTMLElement, options?: ICopyMarkupOptions);
	private init;
	private copy;
	private addPredefinedItems;
	private setTarget;
	private setWrapper;
	private addToItems;
	delete(target: HTMLElement): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCopyMarkup | {
		id: number;
		element: HSCopyMarkup;
	};
}
export interface IAccordion {
	options?: {};
	show(): void;
	hide(): void;
}
export declare class HSAccordion extends HSBasePlugin<{}> implements IAccordion {
	private readonly toggle;
	content: HTMLElement | null;
	private readonly group;
	private readonly isAlwaysOpened;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	show(): boolean;
	hide(): boolean;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | {
		id: number;
		element: HSAccordion;
	};
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
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
export declare class HSCarousel extends HSBasePlugin<ICarouselOptions> implements ICarousel {
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCarousel | {
		id: number;
		element: HSCarousel;
	};
}
export interface ICollapse {
	options?: {};
	show(): void;
	hide(): void;
}
export declare class HSCollapse extends HSBasePlugin<{}> implements ICollapse {
	private readonly contentId;
	content: HTMLElement | null;
	private animationInProcess;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private hideAllMegaMenuItems;
	show(): boolean;
	hide(): boolean;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | {
		id: number;
		element: HSCollapse;
	};
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
export interface IDropdown {
	options?: {};
	open(): void;
	close(isAnimated: boolean): void;
	forceClearState(): void;
}
export interface IHTMLElementPopper extends HTMLElement {
	_popper: any;
}
export declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementPopper> implements IDropdown {
	private static history;
	private readonly toggle;
	menu: HTMLElement | null;
	private eventMode;
	private readonly closeMode;
	private animationInProcess;
	constructor(el: IHTMLElementPopper, options?: {}, events?: {});
	private init;
	resizeHandler(): void;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyPopper;
	private absoluteStrategyModifiers;
	open(): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): IHTMLElementPopper | {
		id: number;
		element: HSDropdown;
	};
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onEscape(evt: KeyboardEvent): void;
	static onEnter(evt: KeyboardEvent): void;
	static onArrow(isArrowUp?: boolean): boolean;
	static onStartEnd(isStart?: boolean): boolean;
	static onFirstLetter(code: string): boolean;
	static closeCurrentlyOpened(evtTarget?: HTMLElement | null, isAnimated?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
export interface IInputNumberOptions {
}
export interface IInputNumber {
	options?: IInputNumberOptions;
}
export declare class HSInputNumber extends HSBasePlugin<IInputNumberOptions> implements IInputNumber {
	private readonly input;
	private readonly increment;
	private readonly decrement;
	private inputValue;
	constructor(el: HTMLElement, options?: IInputNumberOptions);
	private init;
	private build;
	private buildInput;
	private buildIncrement;
	private buildDecrement;
	private changeValue;
	private disableButtons;
	private enableButtons;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSInputNumber | {
		id: number;
		element: HSInputNumber;
	};
}
export interface IOverlayOptions {
	hiddenClass?: string | null;
}
export interface IOverlay {
	options?: IOverlayOptions;
	open(): void;
	close(): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
export declare class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private openNextOverlay;
	private autoHide;
	private readonly overlayId;
	private readonly hiddenClass;
	overlay: HTMLElement | null;
	isCloseWhenClickInside: string;
	isTabAccessibilityLimited: string;
	hasAutofocus: string;
	hasAbilityToCloseOnBackdropClick: string;
	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {});
	private init;
	private hideAuto;
	private checkTimer;
	private buildBackdrop;
	private destroyBackdrop;
	private focusElement;
	open(): false | Promise<void>;
	close(): Promise<unknown>;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSOverlay>;
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): boolean;
	static onEscape(target: ICollectionItem<HSOverlay>): void;
	static onTab(target: ICollectionItem<HSOverlay>, focusableElements: HTMLElement[]): boolean;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
export interface IPinInputOptions {
	availableCharsRE?: RegExp;
}
export interface IPinInput {
	options?: IPinInputOptions;
}
export declare class HSPinInput extends HSBasePlugin<IPinInputOptions> implements IPinInput {
	private items;
	private currentItem;
	private currentValue;
	private readonly placeholders;
	private readonly availableCharsRE;
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSPinInput | {
		id: number;
		element: HSPinInput;
	};
}
export interface IRemoveElementOptions {
	removeTargetAnimationClass: string;
}
export interface IRemoveElement {
	options?: IRemoveElementOptions;
}
export declare class HSRemoveElement extends HSBasePlugin<IRemoveElementOptions> implements IRemoveElement {
	private readonly removeTargetId;
	private readonly removeTarget;
	private readonly removeTargetAnimationClass;
	constructor(el: HTMLElement, options?: IRemoveElementOptions);
	private init;
	private remove;
}
export interface IScrollspy {
	options?: {};
}
export declare class HSScrollspy extends HSBasePlugin<{}> implements IScrollspy {
	private activeSection;
	private readonly contentId;
	private readonly content;
	private readonly links;
	private readonly sections;
	private readonly scrollableId;
	private readonly scrollable;
	constructor(el: HTMLElement, options?: {});
	private init;
	private update;
	private scrollTo;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | {
		id: number;
		element: HSScrollspy;
	};
}
export interface ISelectOptions {
	value?: string | string[];
	isOpened?: boolean;
	placeholder?: string;
	hasSearch?: boolean;
	mode?: string;
	viewport?: string;
	toggleTag?: string;
	toggleClasses?: string;
	toggleCountText?: string;
	toggleCountTextMinItems?: number;
	tagsClasses?: string;
	tagsItemTemplate?: string;
	tagsItemClasses?: string;
	tagsInputClasses?: string;
	dropdownTag?: string;
	dropdownClasses?: string;
	dropdownDirectionClasses?: {
		top?: string;
		bottom?: string;
	};
	dropdownSpace: number;
	searchWrapperTemplate?: string;
	searchClasses?: string;
	searchWrapperClasses?: string;
	searchPlaceholder?: string;
	searchNoItemsText?: string;
	searchNoItemsClasses?: string;
	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;
	descriptionClasses?: string;
	iconClasses?: string;
}
export interface ISelect {
	options?: ISelectOptions;
	open(): void;
	close(): void;
	recalculateDirection(): void;
}
export declare class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder;
	private readonly hasSearch;
	private readonly mode;
	private readonly viewport;
	isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;
	private readonly toggleTag;
	private readonly toggleClasses;
	private readonly toggleCountText;
	private readonly toggleCountTextMinItems;
	private readonly tagsClasses;
	private readonly tagsItemTemplate;
	private readonly tagsItemClasses;
	private readonly tagsInputClasses;
	private readonly dropdownTag;
	private readonly dropdownClasses;
	private readonly dropdownDirectionClasses;
	dropdownSpace: number | null;
	private readonly searchWrapperTemplate;
	private readonly searchPlaceholder;
	private readonly searchClasses;
	private readonly searchWrapperClasses;
	private readonly optionTag;
	private readonly optionTemplate;
	private readonly optionClasses;
	private readonly descriptionClasses;
	private readonly iconClasses;
	private animationInProcess;
	private wrapper;
	private toggle;
	private toggleTextWrapper;
	private tags;
	private tagsItems;
	private tagsInput;
	private dropdown;
	private searchWrapper;
	private search;
	private selectOptions;
	constructor(el: HTMLElement, options?: ISelectOptions);
	private init;
	private build;
	private buildWrapper;
	private buildToggle;
	private setToggleIcon;
	private setToggleTitle;
	private buildTags;
	private buildTagsItems;
	private buildTagsItem;
	private getItemByValue;
	private setTagsItems;
	private buildTagsInput;
	private buildDropdown;
	private buildSearch;
	private buildOption;
	private onSelectOption;
	private addSelectOption;
	private resetTagsInputField;
	private clearSelections;
	private setNewValue;
	private stringFromValue;
	private selectSingleItem;
	private selectMultipleItems;
	private unselectMultipleItems;
	private searchOptions;
	open(): boolean;
	close(): boolean;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): {
		id: number;
		element: HSSelect;
	} | HSSelect;
	static close(target: HTMLElement | string): void;
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
	constructor(el: HTMLElement, options?: IStepperOptions);
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): {
		id: string | number;
		element: HSStepper;
	} | HSStepper;
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
	constructor(el: HTMLElement, options?: IStrongPasswordOptions);
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
	static getInstance(target: HTMLElement | string): HSStrongPassword;
}
export interface ITabs {
	options?: {};
}
export declare class HSTabs extends HSBasePlugin<{}> implements ITabs {
	toggles: NodeListOf<HTMLElement> | null;
	private readonly extraToggleId;
	private readonly extraToggle;
	private current;
	private currentContentId;
	currentContent: HTMLElement | null;
	private prev;
	private prevContentId;
	private prevContent;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private open;
	private change;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): {
		id: number;
		element: HSTabs;
	} | HSTabs;
	static open(target: HTMLElement): void;
	static accessibility(evt: KeyboardEvent): void;
	static onArrow(isOpposite?: boolean): void;
	static onStartEnd(isOpposite?: boolean): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
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
}
export declare class HSToggleCount extends HSBasePlugin<IToggleCountOptions> implements IToggleCount {
	private readonly target;
	private readonly min;
	private readonly max;
	private readonly duration;
	private isChecked;
	constructor(el: HTMLElement, options?: IToggleCountOptions);
	private init;
	private toggle;
	private animate;
	countUp(): void;
	countDown(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): {
		id: number;
		element: HSToggleCount;
	} | HSToggleCount;
}
export interface ITogglePasswordOptions {
	target: string | string[] | HTMLInputElement | HTMLInputElement[];
}
export interface ITogglePassword {
	options?: ITogglePasswordOptions;
	show(): void;
	hide(): void;
}
export declare class HSTogglePassword extends HSBasePlugin<ITogglePasswordOptions> implements ITogglePassword {
	private readonly target;
	private isShown;
	private isMultiple;
	private eventType;
	constructor(el: HTMLElement, options?: ITogglePasswordOptions);
	private init;
	private getMultipleToggles;
	show(): void;
	hide(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): {
		id: number;
		element: HSTogglePassword;
	} | HSTogglePassword;
}
export interface ITooltip {
	options?: {};
	show(): void;
	hide(): void;
}
export declare class HSTooltip extends HSBasePlugin<{}> implements ITooltip {
	private readonly toggle;
	content: HTMLElement | null;
	readonly eventMode: string;
	private readonly preventPopper;
	private popperInstance;
	private readonly placement;
	private readonly strategy;
	constructor(el: HTMLElement, options?: {}, events?: {});
	private init;
	private enter;
	private leave;
	private click;
	private focus;
	private buildPopper;
	show(): void;
	hide(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | {
		id: number;
		element: HSTooltip;
	};
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}

export {};
