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
	constructor(el: HTMLElement, options?: ICopyMarkupOptions);
	private init;
	private copy;
	private addPredefinedItems;
	private setTarget;
	private setWrapper;
	private addToItems;
	delete(target: HTMLElement): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSCopyMarkup | ICollectionItem<HSCopyMarkup>;
	static autoInit(): void;
}
export interface IAccordionTreeViewStaticOptions {
}
export interface IAccordionTreeView {
	el: HTMLElement | null;
	options?: IAccordionTreeViewStaticOptions;
}
export interface IAccordionOptions {
}
export interface IAccordion {
	options?: IAccordionOptions;
	show(): void;
	hide(): void;
}
export declare class HSAccordion extends HSBasePlugin<IAccordionOptions> implements IAccordion {
	private readonly toggle;
	content: HTMLElement | null;
	private group;
	private isAlwaysOpened;
	static selectable: IAccordionTreeView[];
	constructor(el: HTMLElement, options?: IAccordionOptions, events?: {});
	private init;
	show(): boolean;
	hide(): boolean;
	update(): boolean;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSAccordion>;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static autoInit(): void;
	static treeView(): boolean;
	static toggleSelected(root: IAccordionTreeView, item: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
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
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSCollapse>;
	static autoInit(): void;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
}
export interface IComboBoxOptions {
	gap?: number;
	viewport?: string | HTMLElement | null;
	preventVisibility?: boolean;
	apiUrl?: string | null;
	apiDataPart?: string | null;
	apiQuery?: string | null;
	apiSearchQuery?: string | null;
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
	open(): void;
	close(): void;
	recalculateDirection(): void;
}
export declare class HSComboBox extends HSBasePlugin<IComboBoxOptions> implements IComboBox {
	gap: number;
	viewport: string | HTMLElement | null;
	preventVisibility: boolean;
	apiUrl: string | null;
	apiDataPart: string | null;
	apiQuery: string | null;
	apiSearchQuery: string | null;
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
	private groups;
	private selectedGroup;
	isOpened: boolean;
	isCurrent: boolean;
	private animationInProcess;
	constructor(el: HTMLElement, options?: IComboBoxOptions, events?: {});
	private init;
	private build;
	private setResultAndRender;
	private buildInput;
	private buildItems;
	private setResults;
	private isItemExists;
	private isTextExists;
	private isTextExistsAny;
	private valuesBySelector;
	private buildOutputLoader;
	private destroyOutputLoader;
	private itemsFromJson;
	private jsonItemsRender;
	private setGroups;
	setCurrent(): void;
	private setApiGroups;
	private sortItems;
	private itemRender;
	private plainRender;
	private groupTabsRender;
	private groupDefaultRender;
	private itemsFromHtml;
	private buildToggle;
	private buildToggleClose;
	private buildToggleOpen;
	private setSelectedByValue;
	private setValue;
	private setItemsVisibility;
	private hasVisibleItems;
	private appendItemsToWrapper;
	private buildOutputPlaceholder;
	private destroyOutputPlaceholder;
	private resultItems;
	private setValueAndOpen;
	open(val?: string): boolean;
	private setValueAndClear;
	close(val?: string | null): boolean;
	recalculateDirection(): void;
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
}
export interface IHTMLElementPopper extends HTMLElement {
	_popper: any;
}
export declare class HSDropdown extends HSBasePlugin<{}, IHTMLElementPopper> implements IDropdown {
	private static history;
	private readonly toggle;
	private readonly closers;
	menu: HTMLElement | null;
	private eventMode;
	private closeMode;
	private animationInProcess;
	constructor(el: IHTMLElementPopper, options?: {}, events?: {});
	private init;
	resizeHandler(): void;
	private buildToggle;
	private buildMenu;
	private buildClosers;
	private onClickHandler;
	private onMouseEnterHandler;
	private onMouseLeaveHandler;
	private destroyPopper;
	private absoluteStrategyModifiers;
	open(): boolean;
	close(isAnimated?: boolean): boolean;
	forceClearState(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): ICollectionItem<HSDropdown> | IHTMLElementPopper;
	static autoInit(): void;
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
	min?: number;
	max?: number;
	step?: number;
}
export interface IInputNumber {
	options?: IInputNumberOptions;
}
export declare class HSInputNumber extends HSBasePlugin<IInputNumberOptions> implements IInputNumber {
	private readonly input;
	private readonly increment;
	private readonly decrement;
	private inputValue;
	private readonly minInputValue;
	private readonly maxInputValue;
	private readonly step;
	constructor(el: HTMLElement, options?: IInputNumberOptions);
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSInputNumber | {
		id: number;
		element: HSInputNumber;
	};
	static autoInit(): void;
}
export interface IOverlayOptions {
	hiddenClass?: string | null;
	emulateScrollbarSpace?: boolean;
	isClosePrev?: boolean;
	backdropClasses?: string | null;
	backdropExtraClasses?: string | null;
	moveOverlayToBody?: number | null;
}
export interface IOverlay {
	options?: IOverlayOptions;
	open(): void;
	close(): void;
}
export declare class HSOverlay extends HSBasePlugin<{}> implements IOverlay {
	private readonly hiddenClass;
	private readonly emulateScrollbarSpace;
	private readonly isClosePrev;
	private readonly backdropClasses;
	private readonly backdropExtraClasses;
	private readonly animationTarget;
	private openNextOverlay;
	private autoHide;
	private readonly overlayId;
	overlay: HTMLElement | null;
	initContainer: HTMLElement | null;
	isCloseWhenClickInside: boolean;
	isTabAccessibilityLimited: boolean;
	isLayoutAffect: boolean;
	hasAutofocus: boolean;
	hasAbilityToCloseOnBackdropClick: boolean;
	openedBreakpoint: number | null;
	autoClose: number | null;
	moveOverlayToBody: number | null;
	constructor(el: HTMLElement, options?: IOverlayOptions, events?: {});
	private init;
	private hideAuto;
	private checkTimer;
	private buildBackdrop;
	private destroyBackdrop;
	private focusElement;
	private getScrollbarSize;
	open(): false | Promise<void>;
	close(forceClose?: boolean): Promise<unknown>;
	static getInstance(target: HTMLElement, isInstance?: boolean): HTMLElement | ICollectionItem<HSOverlay>;
	static autoInit(): void;
	static open(target: HTMLElement): void;
	static close(target: HTMLElement): void;
	static setOpened(breakpoint: number, el: ICollectionItem<HSOverlay>): void;
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSPinInput | ICollectionItem<HSPinInput>;
	static autoInit(): void;
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
	static autoInit(): void;
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
	toggleCountText?: string;
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
	optionTemplate?: string;
	optionTag?: string;
	optionClasses?: string;
	descriptionClasses?: string;
	iconClasses?: string;
	isAddTagOnEnter?: boolean;
}
export interface ISelect {
	options?: ISelectOptions;
	destroy(): void;
	open(): void;
	close(): void;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): void;
}
export declare class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder;
	private readonly hasSearch;
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
	private popperInstance;
	private searchWrapper;
	private search;
	private searchNoResult;
	private selectOptions;
	private extraMarkup;
	private readonly isAddTagOnEnter;
	private tagsInputHelper;
	private remoteOptions;
	private optionId;
	constructor(el: HTMLElement, options?: ISelectOptions);
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
	private buildPopper;
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
	close(): boolean;
	addOption(items: ISingleOption | ISingleOption[]): void;
	removeOption(values: string | string[]): void;
	recalculateDirection(): void;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSSelect | ICollectionItem<HSSelect>;
	static autoInit(): void;
	static open(target: HTMLElement | string): void;
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
	static autoInit(): void;
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
}
export declare class HSTextareaAutoHeight extends HSBasePlugin<ITextareaAutoHeightOptions> implements ITextareaAutoHeight {
	private readonly defaultHeight;
	constructor(el: HTMLTextAreaElement, options?: ITextareaAutoHeightOptions);
	private init;
	private setAutoHeight;
	private textareaSetHeight;
	private checkIfOneLine;
	private isParentHidden;
	private parentType;
	private callbackAccordingToType;
	static getInstance(target: HTMLTextAreaElement | string, isInstance?: boolean): HSTextareaAutoHeight | ICollectionItem<HSTextareaAutoHeight>;
	static autoInit(): void;
}
export interface IThemeSwitchOptions {
	theme?: "dark" | "light" | "default";
}
export interface IThemeSwitch {
	options?: IThemeSwitchOptions;
	setAppearance(theme: string, isSaveToLocalStorage: boolean, isSetDispatchEvent: boolean): void;
}
export declare class HSThemeSwitch extends HSBasePlugin<IThemeSwitchOptions> implements IThemeSwitch {
	theme: string;
	private readonly themeSet;
	constructor(el: HTMLElement, options?: IThemeSwitchOptions);
	private init;
	private setResetStyles;
	private addSystemThemeObserver;
	private removeSystemThemeObserver;
	setAppearance(theme?: string, isSaveToLocalStorage?: boolean, isSetDispatchEvent?: boolean): void;
	static getInstance(target: HTMLElement | string): HSThemeSwitch;
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSTogglePassword | ICollectionItem<HSTogglePassword>;
	static autoInit(): void;
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTooltip>;
	static autoInit(): void;
	static show(target: HTMLElement): void;
	static hide(target: HTMLElement): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
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
}
export declare class HSTreeView extends HSBasePlugin<ITreeViewOptions> implements ITreeView {
	private items;
	private readonly controlBy;
	private readonly autoSelectChildren;
	private readonly isIndeterminate;
	static group: number;
	constructor(el: HTMLElement, options?: ITreeViewOptions, events?: {});
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSTreeView>;
	static autoInit(): void;
	static on(evt: string, target: HTMLElement, cb: Function): void;
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

export {
	HSDataTableModule as HSDataTable,
	HSFileUploadModule as HSFileUpload,
	HSRangeSliderModule as HSRangeSlider,
};

export {};
