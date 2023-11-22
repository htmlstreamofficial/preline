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
declare class HSStepper extends HSBasePlugin<{}> implements IStepper {
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
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HSStepper | {
		id: string | number;
		element: HSStepper;
	};
	static autoInit(): void;
}

export {
	HSStepper as default,
};

export {};
