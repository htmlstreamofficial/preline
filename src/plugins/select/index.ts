/*
 * HSSelect
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	afterTransition,
	classToClassList,
	debounce,
	dispatch,
	htmlToElement,
	isEnoughSpace,
} from "../../utils";

import {
	IApiFieldMap,
	ISelect,
	ISelectOptions,
	ISingleOption,
	ISingleOptionOptions,
} from "../select/interfaces";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";
import { IAccessibilityComponent } from "../accessibility-manager/interfaces";
import HSAccessibilityObserver from "../accessibility-manager";

import { POSITIONS } from "../../constants";

class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	private accessibilityComponent: IAccessibilityComponent;

	value: string | string[] | null;
	private readonly placeholder: string | null;
	private readonly hasSearch: boolean;
	private readonly minSearchLength: number;
	private readonly preventSearchFocus: boolean;
	private readonly mode: string | null;
	private readonly viewport: HTMLElement | null;

	private _isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;
	selectedItems: string[];

	private readonly apiUrl: string | null;
	private readonly apiQuery: string | null;
	private readonly apiOptions: RequestInit | null;
	private readonly apiDataPart: string | null;
	private readonly apiSearchQueryKey: string | null;
	private readonly apiLoadMore: boolean | {
		perPage: number;
		scrollThreshold: number;
	};
	private readonly apiFieldsMap: IApiFieldMap | null;
	private readonly apiIconTag: string | null;
	private readonly apiSelectedValues: string | string[] | null;

	private readonly toggleTag: string | null;
	private readonly toggleClasses: string | null;
	private readonly toggleSeparators: {
		items?: string;
		betweenItemsAndCounter?: string;
	} | null;
	private readonly toggleCountText: string | null;
	private readonly toggleCountTextPlacement:
		| "postfix"
		| "prefix"
		| "postfix-no-space"
		| "prefix-no-space";
	private readonly toggleCountTextMinItems: number | null;
	private readonly toggleCountTextMode: string | null;
	private readonly wrapperClasses: string | null;
	private readonly tagsItemTemplate: string | null;
	private readonly tagsItemClasses: string | null;
	private readonly tagsInputId: string | null;
	private readonly tagsInputClasses: string | null;
	private readonly dropdownTag: string | null;
	private readonly dropdownClasses: string | null;
	private readonly dropdownDirectionClasses: {
		top?: string;
		bottom?: string;
	} | null;
	public dropdownSpace: number | null;
	public readonly dropdownPlacement: string | null;
	private readonly dropdownAutoPlacement: boolean;
	public readonly dropdownVerticalFixedPlacement: "top" | "bottom" | null;
	public readonly dropdownScope: "window" | "parent";
	private readonly searchTemplate: string | null;
	private readonly searchWrapperTemplate: string | null;
	private readonly searchPlaceholder: string | null;
	private readonly searchId: string | null;
	private readonly searchLimit: number | typeof Infinity;
	private readonly isSearchDirectMatch: boolean;
	private readonly searchClasses: string | null;
	private readonly searchWrapperClasses: string | null;
	private readonly searchNoResultTemplate: string | null;
	private readonly searchNoResultText: string | null;
	private readonly searchNoResultClasses: string | null;
	private readonly optionAllowEmptyOption: boolean;
	private readonly optionTag: string | null;
	private readonly optionTemplate: string | null;
	private readonly optionClasses: string | null;
	private readonly descriptionClasses: string | null;
	private readonly iconClasses: string | null;

	private animationInProcess: boolean;
	private currentPage: number;
	private isLoading: boolean;
	private hasMore: boolean;

	private wrapper: HTMLElement | null;
	private toggle: HTMLElement | null;
	private toggleTextWrapper: HTMLElement | null;
	private tagsInput: HTMLElement | null;
	private dropdown: HTMLElement | null;
	private floatingUIInstance: any;
	private searchWrapper: HTMLElement | null;
	private search: HTMLInputElement | null;
	private searchNoResult: HTMLElement | null;
	private selectOptions: ISingleOption[] | [];
	private extraMarkup: string | string[] | Element | null;

	private readonly isAddTagOnEnter: boolean;

	private tagsInputHelper: HTMLElement | null;

	private remoteOptions: unknown[];
	private disabledObserver: MutationObserver | null = null;

	private optionId = 0;

	private onWrapperClickListener: (evt: Event) => void;
	private onToggleClickListener: () => void;
	private onTagsInputFocusListener: () => void;
	private onTagsInputInputListener: () => void;
	private onTagsInputInputSecondListener: (evt: InputEvent) => void;
	private onTagsInputKeydownListener: (evt: KeyboardEvent) => void;
	private onSearchInputListener: (evt: InputEvent) => void;

	private readonly isSelectedOptionOnTop: boolean;

	constructor(el: HTMLElement, options?: ISelectOptions) {
		super(el, options);

		const data = el.getAttribute("data-hs-select");
		const dataOptions: ISelectOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.value = concatOptions?.value || (this.el as HTMLSelectElement).value ||
			null;
		this.placeholder = concatOptions?.placeholder || "Select...";
		this.hasSearch = concatOptions?.hasSearch || false;
		this.minSearchLength = concatOptions?.minSearchLength ?? 0;
		this.preventSearchFocus = concatOptions?.preventSearchFocus || false;
		this.mode = concatOptions?.mode || "default";
		this.viewport = typeof concatOptions?.viewport !== "undefined"
			? document.querySelector(concatOptions?.viewport)
			: null;
		this._isOpened = Boolean(concatOptions?.isOpened) || false;
		this.isMultiple = this.el.hasAttribute("multiple") || false;
		this.isDisabled = this.el.hasAttribute("disabled") || false;
		this.selectedItems = [];

		this.apiUrl = concatOptions?.apiUrl || null;
		this.apiQuery = concatOptions?.apiQuery || null;
		this.apiOptions = concatOptions?.apiOptions || null;
		this.apiSearchQueryKey = concatOptions?.apiSearchQueryKey || null;
		this.apiDataPart = concatOptions?.apiDataPart || null;
		this.apiLoadMore = concatOptions?.apiLoadMore === true
			? {
				perPage: 10,
				scrollThreshold: 100,
			}
			: typeof concatOptions?.apiLoadMore === "object" &&
					concatOptions?.apiLoadMore !== null
			? {
				perPage: concatOptions.apiLoadMore.perPage || 10,
				scrollThreshold: concatOptions.apiLoadMore.scrollThreshold || 100,
			}
			: false;
		this.apiFieldsMap = concatOptions?.apiFieldsMap || null;
		this.apiIconTag = concatOptions?.apiIconTag || null;
		this.apiSelectedValues = concatOptions?.apiSelectedValues || null;

		this.currentPage = 0;
		this.isLoading = false;
		this.hasMore = true;

		this.wrapperClasses = concatOptions?.wrapperClasses || null;
		this.toggleTag = concatOptions?.toggleTag || null;
		this.toggleClasses = concatOptions?.toggleClasses || null;
		this.toggleCountText = typeof concatOptions?.toggleCountText === undefined
			? null
			: concatOptions.toggleCountText;
		this.toggleCountTextPlacement = concatOptions?.toggleCountTextPlacement ||
			"postfix";
		this.toggleCountTextMinItems = concatOptions?.toggleCountTextMinItems || 1;
		this.toggleCountTextMode = concatOptions?.toggleCountTextMode ||
			"countAfterLimit";
		this.toggleSeparators = {
			items: concatOptions?.toggleSeparators?.items || ", ",
			betweenItemsAndCounter:
				concatOptions?.toggleSeparators?.betweenItemsAndCounter || "and",
		};
		this.tagsItemTemplate = concatOptions?.tagsItemTemplate || null;
		this.tagsItemClasses = concatOptions?.tagsItemClasses || null;
		this.tagsInputId = concatOptions?.tagsInputId || null;
		this.tagsInputClasses = concatOptions?.tagsInputClasses || null;
		this.dropdownTag = concatOptions?.dropdownTag || null;
		this.dropdownClasses = concatOptions?.dropdownClasses || null;
		this.dropdownDirectionClasses = concatOptions?.dropdownDirectionClasses ||
			null;
		this.dropdownSpace = concatOptions?.dropdownSpace || 10;
		this.dropdownPlacement = concatOptions?.dropdownPlacement || null;
		this.dropdownVerticalFixedPlacement =
			concatOptions?.dropdownVerticalFixedPlacement || null;
		this.dropdownScope = concatOptions?.dropdownScope || "parent";
		this.dropdownAutoPlacement = concatOptions?.dropdownAutoPlacement || false;
		this.searchTemplate = concatOptions?.searchTemplate || null;
		this.searchWrapperTemplate = concatOptions?.searchWrapperTemplate || null;
		this.searchWrapperClasses = concatOptions?.searchWrapperClasses ||
			"bg-white p-2 sticky top-0";
		this.searchId = concatOptions?.searchId || null;
		this.searchLimit = concatOptions?.searchLimit || Infinity;
		this.isSearchDirectMatch =
			typeof concatOptions?.isSearchDirectMatch !== "undefined"
				? concatOptions?.isSearchDirectMatch
				: true;
		this.searchClasses = concatOptions?.searchClasses ||
			"block w-[calc(100%-32px)] text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 py-2 px-3 my-2 mx-4";
		this.searchPlaceholder = concatOptions?.searchPlaceholder || "Search...";
		this.searchNoResultTemplate = concatOptions?.searchNoResultTemplate ||
			"<span></span>";
		this.searchNoResultText = concatOptions?.searchNoResultText ||
			"No results found";
		this.searchNoResultClasses = concatOptions?.searchNoResultClasses ||
			"px-4 text-sm text-gray-800 dark:text-neutral-200";
		this.optionAllowEmptyOption =
			typeof concatOptions?.optionAllowEmptyOption !== "undefined"
				? concatOptions?.optionAllowEmptyOption
				: false;
		this.optionTemplate = concatOptions?.optionTemplate || null;
		this.optionTag = concatOptions?.optionTag || null;
		this.optionClasses = concatOptions?.optionClasses || null;
		this.extraMarkup = concatOptions?.extraMarkup || null;
		this.descriptionClasses = concatOptions?.descriptionClasses || null;
		this.iconClasses = concatOptions?.iconClasses || null;
		this.isAddTagOnEnter = concatOptions?.isAddTagOnEnter ?? true;
		this.isSelectedOptionOnTop = concatOptions?.isSelectedOptionOnTop ?? false;

		this.animationInProcess = false;

		this.selectOptions = [];
		this.remoteOptions = [];

		this.tagsInputHelper = null;

		this.disabledObserver = new MutationObserver((muts) => {
			if (muts.some((m) => m.attributeName === "disabled")) {
				this.setDisabledState(this.el.hasAttribute("disabled"));
			}
		});
		this.disabledObserver.observe(this.el, {
			attributes: true,
			attributeFilter: ["disabled"],
		});

		this.init();
	}

	private wrapperClick(evt: Event) {
		if (
			!(evt.target as HTMLElement).closest("[data-hs-select-dropdown]") &&
			!(evt.target as HTMLElement).closest("[data-tag-value]")
		) {
			this.tagsInput.focus();
		}
	}

	private toggleClick() {
		if (this.isDisabled) return false;

		this.toggleFn();
	}

	private tagsInputFocus() {
		if (!this._isOpened) this.open();
	}

	private tagsInputInput() {
		this.calculateInputWidth();
	}

	private tagsInputInputSecond(evt: InputEvent) {
		if (!this.apiUrl) {
			this.searchOptions((evt.target as HTMLInputElement).value);
		}
	}

	private tagsInputKeydown(evt: KeyboardEvent) {
		if (evt.key === "Enter" && this.isAddTagOnEnter) {
			const val = (evt.target as HTMLInputElement).value;

			if (this.selectOptions.find((el: ISingleOption) => el.val === val)) {
				return false;
			}

			this.addSelectOption(val, val);
			this.buildOption(val, val);
			this.buildOriginalOption(val, val);
			(
				this.dropdown.querySelector(`[data-value="${val}"]`) as HTMLElement
			).click();

			this.resetTagsInputField();
			// this.close();
		}
	}

	private searchInput(evt: InputEvent) {
		const newVal = (evt.target as HTMLInputElement).value;

		if (this.apiUrl) this.remoteSearch(newVal);
		else this.searchOptions(newVal);
	}

	public setValue(val: string | string[]) {
		this.value = val;

		this.clearSelections();

		if (Array.isArray(val)) {
			if (this.mode === "tags") {
				this.unselectMultipleItems();
				this.selectMultipleItems();

				this.selectedItems = [];

				const existingTags = this.wrapper.querySelectorAll("[data-tag-value]");
				existingTags.forEach((tag) => tag.remove());

				this.setTagsItems();
				this.reassignTagsInputPlaceholder(
					this.hasValue() ? "" : this.placeholder,
				);
			} else {
				this.toggleTextWrapper.innerHTML = this.hasValue()
					? this.stringFromValue()
					: this.placeholder;

				this.unselectMultipleItems();
				this.selectMultipleItems();
			}
		} else {
			this.setToggleTitle();

			if (this.toggle.querySelector("[data-icon]")) this.setToggleIcon();
			if (this.toggle.querySelector("[data-title]")) this.setToggleTitle();

			this.selectSingleItem();
		}
	}

	private setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;

		const target = this.mode === "tags" ? this.wrapper : this.toggle;

		target?.classList.toggle("disabled", isDisabled);

		if (isDisabled && this.isOpened()) this.close();
	}

	private hasValue(): boolean {
		if (!this.isMultiple) {
			return this.value !== null && this.value !== undefined &&
				this.value !== "";
		}
		return Array.isArray(this.value) && this.value.length > 0 &&
			this.value.some((val) => val !== null && val !== undefined && val !== "");
	}

	private init() {
		this.createCollection(window.$hsSelectCollection, this);

		this.build();

		if (typeof window !== "undefined") {
			if (!window.HSAccessibilityObserver) {
				window.HSAccessibilityObserver = new HSAccessibilityObserver();
			}
			this.setupAccessibility();
		}
	}

	private build() {
		this.el.style.display = "none";

		if (this.el.children) {
			Array.from(this.el.children)
				.filter((el: HTMLOptionElement) =>
					this.optionAllowEmptyOption ||
					(!this.optionAllowEmptyOption && el.value && el.value !== "")
				)
				.forEach((el: HTMLOptionElement) => {
					const data = el.getAttribute("data-hs-select-option");

					this.selectOptions = [
						...this.selectOptions,
						{
							title: el.textContent,
							val: el.value,
							disabled: el.disabled,
							options: data !== "undefined" ? JSON.parse(data) : null,
						},
					];
				});
		}

		if (this.optionAllowEmptyOption && !this.value) {
			this.value = "";
		}

		if (this.isMultiple) {
			const selectedOptions = Array.from(this.el.children).filter(
				(el: HTMLOptionElement) => el.selected,
			);

			const values: string[] = [];

			selectedOptions.forEach((el: HTMLOptionElement) => {
				values.push(el.value);
			});

			this.value = values;
		}

		this.buildWrapper();
		if (this.mode === "tags") this.buildTags();
		else this.buildToggle();
		this.buildDropdown();
		if (this.extraMarkup) this.buildExtraMarkup();
	}

	private buildWrapper() {
		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("hs-select", "relative");

		this.setDisabledState(this.isDisabled);

		if (this.mode === "tags") {
			this.onWrapperClickListener = (evt) => this.wrapperClick(evt);

			this.wrapper.addEventListener("click", this.onWrapperClickListener);
		}

		if (this.wrapperClasses) {
			classToClassList(this.wrapperClasses, this.wrapper);
		}

		this.el.before(this.wrapper);

		this.wrapper.append(this.el);
	}

	private buildExtraMarkup() {
		const appendMarkup = (markup: string): HTMLElement => {
			const el = htmlToElement(markup);

			this.wrapper.append(el);

			return el;
		};
		const clickHandle = (el: HTMLElement) => {
			if (!el.classList.contains("--prevent-click")) {
				el.addEventListener("click", (evt: Event) => {
					evt.stopPropagation();

					if (!this.isDisabled) this.toggleFn();
				});
			}
		};

		if (Array.isArray(this.extraMarkup)) {
			this.extraMarkup.forEach((el) => {
				const newEl = appendMarkup(el);

				clickHandle(newEl);
			});
		} else {
			const newEl = appendMarkup(this.extraMarkup as string);

			clickHandle(newEl);
		}
	}

	private buildToggle() {
		let icon, title;
		this.toggleTextWrapper = document.createElement("span");
		this.toggleTextWrapper.classList.add("truncate");
		this.toggle = htmlToElement(this.toggleTag || "<div></div>");
		icon = this.toggle.querySelector("[data-icon]");
		title = this.toggle.querySelector("[data-title]");

		if (!this.isMultiple && icon) this.setToggleIcon();
		if (!this.isMultiple && title) this.setToggleTitle();
		if (this.isMultiple) {
			this.toggleTextWrapper.innerHTML = this.hasValue()
				? this.stringFromValue()
				: this.placeholder;
		} else {
			this.toggleTextWrapper.innerHTML =
				this.getItemByValue(this.value as string)?.title || this.placeholder;
		}
		if (!title) this.toggle.append(this.toggleTextWrapper);
		if (this.toggleClasses) classToClassList(this.toggleClasses, this.toggle);
		if (this.isDisabled) this.toggle.classList.add("disabled");
		if (this.wrapper) this.wrapper.append(this.toggle);

		if (this.toggle?.ariaExpanded) {
			if (this._isOpened) this.toggle.ariaExpanded = "true";
			else this.toggle.ariaExpanded = "false";
		}

		this.onToggleClickListener = () => this.toggleClick();

		this.toggle.addEventListener("click", this.onToggleClickListener);
	}

	private setToggleIcon() {
		const item = this.getItemByValue(this.value as string) as
			& ISingleOption
			& IApiFieldMap;
		const icon = this.toggle.querySelector("[data-icon]");

		if (icon) {
			icon.innerHTML = "";

			const img = htmlToElement(
				this.apiUrl && this.apiIconTag
					? this.apiIconTag || ""
					: item?.options?.icon || "",
			) as HTMLImageElement;
			if (
				this.value &&
				this.apiUrl &&
				this.apiIconTag &&
				item[this.apiFieldsMap.icon]
			) {
				img.src = (item[this.apiFieldsMap.icon] as string) || "";
			}

			icon.append(img);

			if (!img?.src) icon.classList.add("hidden");
			else icon.classList.remove("hidden");
		}
	}

	private setToggleTitle() {
		const title = this.toggle.querySelector("[data-title]");
		let value = this.placeholder;

		if (this.optionAllowEmptyOption && this.value === "") {
			const emptyOption = this.selectOptions.find((el: ISingleOption) =>
				el.val === ""
			);
			value = emptyOption?.title || this.placeholder;
		} else if (this.value) {
			if (this.apiUrl) {
				const selectedOption = (this.remoteOptions as IApiFieldMap[]).find(
					(el) =>
						`${el[this.apiFieldsMap.val]}` === this.value ||
						`${el[this.apiFieldsMap.title]}` === this.value,
				);
				if (selectedOption) {
					value = selectedOption[this.apiFieldsMap.title] as string;
				}
			} else {
				const selectedOption = this.selectOptions.find((el: ISingleOption) =>
					el.val === this.value
				);

				if (selectedOption) {
					value = selectedOption.title;
				}
			}
		}

		if (title) {
			title.innerHTML = value;
			title.classList.add("truncate");
			this.toggle.append(title);
		} else {
			this.toggleTextWrapper.innerHTML = value;
		}
	}

	private buildTags() {
		if (this.isDisabled) this.wrapper.classList.add("disabled");
		this.wrapper.setAttribute("tabindex", "0");
		this.buildTagsInput();
		this.setTagsItems();
	}

	private reassignTagsInputPlaceholder(placeholder: string) {
		(this.tagsInput as HTMLInputElement).placeholder = placeholder;
		this.tagsInputHelper.innerHTML = placeholder;
		this.calculateInputWidth();
	}

	private buildTagsItem(val: string) {
		const item = this.getItemByValue(val) as ISingleOption & IApiFieldMap;

		let template, title, remove, icon: null | HTMLElement;

		const newItem = document.createElement("div");
		newItem.setAttribute("data-tag-value", val);
		if (this.tagsItemClasses) classToClassList(this.tagsItemClasses, newItem);

		if (this.tagsItemTemplate) {
			template = htmlToElement(this.tagsItemTemplate);

			newItem.append(template);
		}

		// Icon
		if (item?.options?.icon || this.apiIconTag) {
			const img = htmlToElement(
				this.apiUrl && this.apiIconTag ? this.apiIconTag : item?.options?.icon,
			) as HTMLImageElement;

			if (this.apiUrl && this.apiIconTag && item[this.apiFieldsMap.icon]) {
				img.src = (item[this.apiFieldsMap.icon] as string) || "";
			}

			icon = template
				? template.querySelector("[data-icon]")
				: document.createElement("span");

			icon.append(img);

			if (!template) newItem.append(icon);
		}

		if (
			template &&
			template.querySelector("[data-icon]") &&
			!item?.options?.icon &&
			!this.apiUrl &&
			!this.apiIconTag &&
			!item[this.apiFieldsMap?.icon]
		) {
			template.querySelector("[data-icon]").classList.add("hidden");
		}

		// Title
		title = template
			? template.querySelector("[data-title]")
			: document.createElement("span");

		if (
			this.apiUrl && this.apiFieldsMap?.title && item[this.apiFieldsMap.title]
		) {
			title.textContent = item[this.apiFieldsMap.title] as string;
		} else {
			title.textContent = item.title || "";
		}

		if (!template) newItem.append(title);

		// Remove
		if (template) {
			remove = template.querySelector("[data-remove]");
		} else {
			remove = document.createElement("span");
			remove.textContent = "X";

			newItem.append(remove);
		}

		remove.addEventListener("click", () => {
			this.value = (this.value as string[]).filter((el) => el !== val);
			this.selectedItems = this.selectedItems.filter((el) => el !== val);

			if (!this.hasValue()) {
				this.reassignTagsInputPlaceholder(this.placeholder);
			}

			this.unselectMultipleItems();
			this.selectMultipleItems();

			newItem.remove();

			this.triggerChangeEventForNativeSelect();
		});

		this.wrapper.append(newItem);
	}

	private getItemByValue(val: string) {
		const value = this.apiUrl
			? (this.remoteOptions as (ISingleOption & IApiFieldMap)[]).find(
				(el) =>
					`${el[this.apiFieldsMap.val]}` === val ||
					el[this.apiFieldsMap.title] === val,
			)
			: this.selectOptions.find((el: ISingleOption) => el.val === val);

		return value;
	}

	private setTagsItems() {
		if (this.value) {
			const values = Array.isArray(this.value)
				? this.value
				: this.value != null
				? [this.value]
				: [];

			values.forEach((val) => {
				if (!this.selectedItems.includes(val)) this.buildTagsItem(val);

				this.selectedItems = !this.selectedItems.includes(val)
					? [...this.selectedItems, val]
					: this.selectedItems;
			});
		}

		if (this._isOpened && this.floatingUIInstance) {
			this.floatingUIInstance.update();
		}
	}

	private buildTagsInput() {
		this.tagsInput = document.createElement("input");

		if (this.tagsInputId) this.tagsInput.id = this.tagsInputId;
		if (this.tagsInputClasses) {
			classToClassList(this.tagsInputClasses, this.tagsInput);
		}
		this.tagsInput.setAttribute("tabindex", "-1");

		this.onTagsInputFocusListener = () => this.tagsInputFocus();
		this.onTagsInputInputListener = () => this.tagsInputInput();
		this.onTagsInputInputSecondListener = debounce((evt: InputEvent) =>
			this.tagsInputInputSecond(evt)
		);
		this.onTagsInputKeydownListener = (evt) => this.tagsInputKeydown(evt);

		this.tagsInput.addEventListener("focus", this.onTagsInputFocusListener);
		this.tagsInput.addEventListener("input", this.onTagsInputInputListener);
		this.tagsInput.addEventListener(
			"input",
			this.onTagsInputInputSecondListener,
		);
		this.tagsInput.addEventListener("keydown", this.onTagsInputKeydownListener);

		this.wrapper.append(this.tagsInput);

		setTimeout(() => {
			this.adjustInputWidth();
			this.reassignTagsInputPlaceholder(
				this.hasValue() ? "" : this.placeholder,
			);
		});
	}

	private buildDropdown() {
		this.dropdown = htmlToElement(this.dropdownTag || "<div></div>");
		this.dropdown.setAttribute("data-hs-select-dropdown", "");

		if (this.dropdownScope === "parent") {
			this.dropdown.classList.add("absolute");
			if (!this.dropdownVerticalFixedPlacement) {
				this.dropdown.classList.add("top-full");
			}
		}
		this.dropdown.role = "listbox";
		this.dropdown.tabIndex = -1;
		this.dropdown.ariaOrientation = "vertical";

		if (!this._isOpened) this.dropdown.classList.add("hidden");

		if (this.dropdownClasses) {
			classToClassList(this.dropdownClasses, this.dropdown);
		}
		if (this.wrapper) this.wrapper.append(this.dropdown);
		if (this.dropdown && this.hasSearch) this.buildSearch();
		if (this.selectOptions) {
			this.selectOptions.forEach((props: ISingleOption, i) =>
				this.buildOption(
					props.title,
					props.val,
					props.disabled,
					props.selected,
					props.options,
					`${i}`,
				)
			);
		}

		if (this.apiUrl) this.optionsFromRemoteData();

		if (!this.apiUrl) {
			this.sortElements(this.el, "option");
			this.sortElements(this.dropdown, "[data-value]");
		}

		if (this.dropdownScope === "window") this.buildFloatingUI();

		if (this.dropdown && this.apiLoadMore) this.setupInfiniteScroll();
	}

	private setupInfiniteScroll() {
		this.dropdown.addEventListener("scroll", this.handleScroll.bind(this));
	}

	private async handleScroll() {
		if (
			!this.dropdown || this.isLoading || !this.hasMore || !this.apiLoadMore
		) return;

		const { scrollTop, scrollHeight, clientHeight } = this.dropdown;
		const scrollThreshold = typeof this.apiLoadMore === "object"
			? this.apiLoadMore.scrollThreshold
			: 100;
		const isNearBottom =
			scrollHeight - scrollTop - clientHeight < scrollThreshold;

		if (isNearBottom) await this.loadMore();
	}

	private async loadMore() {
		if (!this.apiUrl || this.isLoading || !this.hasMore || !this.apiLoadMore) {
			return;
		}

		this.isLoading = true;

		try {
			const url = new URL(this.apiUrl);
			const paginationParam =
				(this.apiFieldsMap?.page || this.apiFieldsMap?.offset ||
					"page") as string;
			const isOffsetBased = !!this.apiFieldsMap?.offset;
			const perPage = typeof this.apiLoadMore === "object"
				? this.apiLoadMore.perPage
				: 10;

			if (isOffsetBased) {
				const offset = this.currentPage * perPage;
				url.searchParams.set(paginationParam, offset.toString());
				this.currentPage++;
			} else {
				this.currentPage++;
				url.searchParams.set(paginationParam, this.currentPage.toString());
			}

			url.searchParams.set(
				this.apiFieldsMap?.limit || "limit",
				perPage.toString(),
			);

			const response = await fetch(url.toString(), this.apiOptions || {});
			const data = await response.json();
			const items = this.apiDataPart ? data[this.apiDataPart] : data.results;
			const total = data.count || 0;
			const currentOffset = this.currentPage * perPage;

			if (items && items.length > 0) {
				this.remoteOptions = [...(this.remoteOptions || []), ...items];
				this.buildOptionsFromRemoteData(items);
				this.hasMore = currentOffset < total;
			} else {
				this.hasMore = false;
			}
		} catch (error) {
			this.hasMore = false;
			console.error("Error loading more options:", error);
		} finally {
			this.isLoading = false;
		}
	}

	private buildFloatingUI() {
		if (typeof FloatingUIDOM !== "undefined" && FloatingUIDOM.computePosition) {
			document.body.appendChild(this.dropdown);

			const reference = this.mode === "tags" ? this.wrapper : this.toggle;
			const middleware = [
				FloatingUIDOM.offset([0, 5]),
			];

			if (
				this.dropdownAutoPlacement && typeof FloatingUIDOM.flip === "function"
			) {
				middleware.push(FloatingUIDOM.flip({
					fallbackPlacements: [
						"bottom-start",
						"bottom-end",
						"top-start",
						"top-end",
					],
				}));
			}

			const options = {
				placement: POSITIONS[this.dropdownPlacement] || "bottom",
				strategy: "fixed",
				middleware,
			};

			const update = () => {
				FloatingUIDOM.computePosition(reference, this.dropdown, options).then(
					({ x, y, placement: computedPlacement }) => {
						Object.assign(this.dropdown.style, {
							position: "fixed",
							left: `${x}px`,
							top: `${y}px`,
							[
								`margin${
									computedPlacement === "bottom"
										? "Top"
										: computedPlacement === "top"
										? "Bottom"
										: computedPlacement === "right"
										? "Left"
										: "Right"
								}`
							]: `${this.dropdownSpace}px`,
						});

						this.dropdown.setAttribute("data-placement", computedPlacement);
					},
				);
			};

			update();

			const cleanup = FloatingUIDOM.autoUpdate(
				reference,
				this.dropdown,
				update,
			);

			this.floatingUIInstance = {
				update,
				destroy: cleanup,
			};
		} else {
			console.error("FloatingUIDOM not found! Please enable it on the page.");
		}
	}

	private updateDropdownWidth() {
		const toggle = this.mode === "tags" ? this.wrapper : this.toggle;

		this.dropdown.style.width = `${toggle.clientWidth}px`;
	}

	private buildSearch() {
		let input;
		this.searchWrapper = htmlToElement(
			this.searchWrapperTemplate || "<div></div>",
		);
		if (this.searchWrapperClasses) {
			classToClassList(this.searchWrapperClasses, this.searchWrapper);
		}
		input = this.searchWrapper.querySelector("[data-input]");

		const search = htmlToElement(
			this.searchTemplate || '<input type="text">',
		);
		this.search = (
			search.tagName === "INPUT" ? search : search.querySelector(":scope input")
		) as HTMLInputElement;

		this.search.placeholder = this.searchPlaceholder;
		if (this.searchClasses) classToClassList(this.searchClasses, this.search);
		if (this.searchId) this.search.id = this.searchId;

		this.onSearchInputListener = debounce((evt: InputEvent) =>
			this.searchInput(evt)
		);

		this.search.addEventListener("input", this.onSearchInputListener);

		if (input) input.append(search);
		else this.searchWrapper.append(search);

		this.dropdown.append(this.searchWrapper);
	}

	private buildOption(
		title: string,
		val: string,
		disabled: boolean = false,
		selected: boolean = false,
		options?: ISingleOptionOptions,
		index: string = "1",
		id?: string,
	) {
		let template: HTMLElement | null = null;
		let titleWrapper: HTMLElement | null = null;
		let iconWrapper: HTMLElement | null = null;
		let descriptionWrapper: HTMLElement | null = null;

		const option = htmlToElement(this.optionTag || "<div></div>");
		option.setAttribute("data-value", val);
		option.setAttribute("data-title-value", title);
		option.setAttribute("tabIndex", index);
		option.classList.add("cursor-pointer");
		option.setAttribute("data-id", id || `${this.optionId}`);
		if (!id) this.optionId++;
		if (disabled) option.classList.add("disabled");
		if (selected) {
			if (this.isMultiple) this.value = [...(this.value as []), val];
			else this.value = val;
		}
		if (this.optionTemplate) {
			template = htmlToElement(this.optionTemplate);

			option.append(template);
		}
		if (template) {
			titleWrapper = template.querySelector("[data-title]");
			titleWrapper.textContent = title || "";
		} else {
			option.textContent = title || "";
		}
		if (options) {
			if (options.icon) {
				const img = htmlToElement(this.apiIconTag ?? options.icon);
				img.classList.add("max-w-full");

				if (this.apiUrl) {
					img.setAttribute("alt", title);
					img.setAttribute("src", options.icon);
				}

				if (template) {
					iconWrapper = template.querySelector("[data-icon]");
					iconWrapper.append(img);
				} else {
					const icon = htmlToElement("<div></div>");
					if (this.iconClasses) classToClassList(this.iconClasses, icon);

					icon.append(img);
					option.append(icon);
				}
			}
			if (options.description) {
				if (template) {
					descriptionWrapper = template.querySelector("[data-description]");
					if (descriptionWrapper) {
						descriptionWrapper.append(options.description);
					}
				} else {
					const description = htmlToElement("<div></div>");
					description.textContent = options.description;
					if (this.descriptionClasses) {
						classToClassList(this.descriptionClasses, description);
					}

					option.append(description);
				}
			}
		}
		if (
			template &&
			template.querySelector("[data-icon]") &&
			!options &&
			!options?.icon
		) {
			template.querySelector("[data-icon]").classList.add("hidden");
		}

		if (
			this.value &&
			(this.isMultiple ? this.value.includes(val) : this.value === val)
		) {
			option.classList.add("selected");
		}

		if (!disabled) {
			option.addEventListener("click", () => this.onSelectOption(val));
		}

		if (this.optionClasses) classToClassList(this.optionClasses, option);
		if (this.dropdown) this.dropdown.append(option);
		if (selected) this.setNewValue();
	}

	private buildOptionFromRemoteData(
		title: string,
		val: string,
		disabled: boolean = false,
		selected: boolean = false,
		index: string = "1",
		id: string | null,
		options?: ISingleOptionOptions,
	) {
		if (index) {
			this.buildOption(title, val, disabled, selected, options, index, id);
		} else {
			alert(
				"ID parameter is required for generating remote options! Please check your API endpoint have it.",
			);
		}
	}

	private buildOptionsFromRemoteData(data: []) {
		data.forEach((el: IApiFieldMap, i) => {
			let id = null;
			let title = "";
			let value = "";
			const options: IApiFieldMap & { rest: { [key: string]: unknown } } = {
				id: "",
				val: "",
				title: "",
				icon: null,
				description: null,
				rest: {},
			};

			Object.keys(el).forEach((key: string) => {
				if (el[this.apiFieldsMap.id]) id = el[this.apiFieldsMap.id];
				if (el[this.apiFieldsMap.val]) {
					value = `${el[this.apiFieldsMap.val]}`;
				}
				if (el[this.apiFieldsMap.title]) {
					title = el[this.apiFieldsMap.title] as string;
					if (!el[this.apiFieldsMap.val]) {
						value = title;
					}
				}
				if (el[this.apiFieldsMap.icon]) {
					options.icon = el[this.apiFieldsMap.icon] as string;
				}
				if (el[this.apiFieldsMap?.description]) {
					options.description = el[this.apiFieldsMap.description] as string;
				}
				options.rest[key] = el[key];
			});

			const existingOption = this.dropdown.querySelector(
				`[data-value="${value}"]`,
			);

			if (!existingOption) {
				const isSelected = this.apiSelectedValues
					? Array.isArray(this.apiSelectedValues)
						? this.apiSelectedValues.includes(value)
						: this.apiSelectedValues === value
					: false;

				this.buildOriginalOption(
					title,
					value,
					id,
					false,
					isSelected,
					options as ISingleOptionOptions & IApiFieldMap,
				);

				this.buildOptionFromRemoteData(
					title,
					value,
					false,
					isSelected,
					`${i}`,
					id,
					options as ISingleOptionOptions & IApiFieldMap,
				);

				if (isSelected) {
					if (this.isMultiple) {
						if (!this.value) this.value = [];
						if (Array.isArray(this.value)) {
							this.value = [...this.value, value];
						}
					} else {
						this.value = value;
					}
				}
			}
		});

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	private async optionsFromRemoteData(val = "") {
		const res = await this.apiRequest(val);
		this.remoteOptions = res;

		if (res.length) this.buildOptionsFromRemoteData(this.remoteOptions as []);
		else console.log("There is no data were responded!");
	}

	private async apiRequest(val = ""): Promise<any> {
		try {
			const url = new URL(this.apiUrl);
			const queryParams = new URLSearchParams(this.apiQuery ?? "");
			const options = this.apiOptions ?? {};
			const key = this.apiSearchQueryKey ?? "q";
			const trimmed = (val ?? "").trim().toLowerCase();

			if (trimmed !== "") queryParams.set(key, encodeURIComponent(trimmed));

			if (this.apiLoadMore) {
				const perPage = typeof this.apiLoadMore === "object"
					? this.apiLoadMore.perPage
					: 10;
				const pageKey = this.apiFieldsMap?.page ?? this.apiFieldsMap?.offset ??
					"page";
				const limitKey = this.apiFieldsMap?.limit ?? "limit";
				const isOffset = Boolean(this.apiFieldsMap?.offset);

				queryParams.delete(pageKey);
				queryParams.delete(limitKey);

				queryParams.set(pageKey, isOffset ? "0" : "1");
				queryParams.set(limitKey, String(perPage));
			}

			url.search = queryParams.toString();
			const res = await fetch(url.toString(), options);
			const json = await res.json();

			return this.apiDataPart ? json[this.apiDataPart] : json;
		} catch (err) {
			console.error(err);
		}
	}

	private sortElements(container: HTMLElement, selector: string): void {
		const items = Array.from(container.querySelectorAll(selector));

		if (this.isSelectedOptionOnTop) {
			items.sort((a, b) => {
				const isASelected = a.classList.contains("selected") ||
					a.hasAttribute("selected");
				const isBSelected = b.classList.contains("selected") ||
					b.hasAttribute("selected");

				if (isASelected && !isBSelected) return -1;
				if (!isASelected && isBSelected) return 1;

				return 0;
			});
		}

		items.forEach((item) => container.appendChild(item));
	}

	private async remoteSearch(val: string) {
		if (val.length <= this.minSearchLength) {
			const res = await this.apiRequest("");
			this.remoteOptions = res;

			Array.from(this.dropdown.querySelectorAll("[data-value]")).forEach((el) =>
				el.remove()
			);
			Array.from(this.el.querySelectorAll("option[value]")).forEach(
				(el: HTMLOptionElement) => {
					el.remove();
				},
			);

			if (res.length) this.buildOptionsFromRemoteData(res);
			else console.log("No data responded!");

			return false;
		}

		const res = await this.apiRequest(val);
		this.remoteOptions = res;
		let newIds = res.map((item: { id: string }) => `${item.id}`);
		let restOptions = null;
		const pseudoOptions = this.dropdown.querySelectorAll("[data-value]");
		const options = this.el.querySelectorAll("[data-hs-select-option]");

		options.forEach((el: HTMLOptionElement) => {
			const dataId = el.getAttribute("data-id");
			if (!newIds.includes(dataId) && !this.value?.includes(el.value)) {
				this.destroyOriginalOption(el.value);
			}
		});

		pseudoOptions.forEach((el: HTMLElement) => {
			const dataId = el.getAttribute("data-id");
			if (
				!newIds.includes(dataId) &&
				!this.value?.includes(el.getAttribute("data-value"))
			) {
				this.destroyOption(el.getAttribute("data-value"));
			} else newIds = newIds.filter((item: string) => item !== dataId);
		});

		restOptions = res.filter((item: { id: string }) =>
			newIds.includes(`${item.id}`)
		);

		if (restOptions.length) this.buildOptionsFromRemoteData(restOptions as []);
		else console.log("No data responded!");
	}

	private destroyOption(val: string) {
		const option = this.dropdown.querySelector(`[data-value="${val}"]`);

		if (!option) return false;

		option.remove();
	}

	private buildOriginalOption(
		title: string,
		val: string,
		id?: string | null,
		disabled?: boolean,
		selected?: boolean,
		options?: ISingleOptionOptions,
	) {
		const option = htmlToElement("<option></option>");
		option.setAttribute("value", val);
		if (disabled) option.setAttribute("disabled", "disabled");
		if (selected) option.setAttribute("selected", "selected");
		if (id) option.setAttribute("data-id", id);
		option.setAttribute("data-hs-select-option", JSON.stringify(options));
		option.innerText = title;

		this.el.append(option);
	}

	private destroyOriginalOption(val: string) {
		const option = this.el.querySelector(`[value="${val}"]`);

		if (!option) return false;

		option.remove();
	}

	private buildTagsInputHelper() {
		this.tagsInputHelper = document.createElement("span");
		this.tagsInputHelper.style.fontSize = window.getComputedStyle(
			this.tagsInput,
		).fontSize;
		this.tagsInputHelper.style.fontFamily = window.getComputedStyle(
			this.tagsInput,
		).fontFamily;
		this.tagsInputHelper.style.fontWeight = window.getComputedStyle(
			this.tagsInput,
		).fontWeight;
		this.tagsInputHelper.style.letterSpacing = window.getComputedStyle(
			this.tagsInput,
		).letterSpacing;
		this.tagsInputHelper.style.visibility = "hidden";
		this.tagsInputHelper.style.whiteSpace = "pre";
		this.tagsInputHelper.style.position = "absolute";

		this.wrapper.appendChild(this.tagsInputHelper);
	}

	private calculateInputWidth() {
		this.tagsInputHelper.textContent =
			(this.tagsInput as HTMLInputElement).value ||
			(this.tagsInput as HTMLInputElement).placeholder;

		const inputPadding =
			parseInt(window.getComputedStyle(this.tagsInput).paddingLeft) +
			parseInt(window.getComputedStyle(this.tagsInput).paddingRight);
		const inputBorder =
			parseInt(window.getComputedStyle(this.tagsInput).borderLeftWidth) +
			parseInt(window.getComputedStyle(this.tagsInput).borderRightWidth);
		const newWidth = this.tagsInputHelper.offsetWidth + inputPadding +
			inputBorder;
		const maxWidth = this.wrapper.offsetWidth -
			(parseInt(window.getComputedStyle(this.wrapper).paddingLeft) +
				parseInt(window.getComputedStyle(this.wrapper).paddingRight));

		(this.tagsInput as HTMLInputElement).style.width = `${
			Math.min(newWidth, maxWidth) + 2
		}px`;
	}

	private adjustInputWidth() {
		this.buildTagsInputHelper();
		this.calculateInputWidth();
	}

	private onSelectOption(val: string) {
		this.clearSelections();

		if (this.isMultiple) {
			if (!Array.isArray(this.value)) this.value = [];

			this.value = this.value.includes(val)
				? this.value.filter((el) => el !== val)
				: [...this.value, val];

			this.selectMultipleItems();
			this.setNewValue();
		} else {
			this.value = val;
			this.selectSingleItem();
			this.setNewValue();
		}

		this.fireEvent("change", this.value);

		if (this.mode === "tags") {
			const intersection = this.selectedItems.filter(
				(x) => !(this.value as string[]).includes(x),
			);
			if (intersection.length) {
				intersection.forEach((el) => {
					this.selectedItems = this.selectedItems.filter((elI) => elI !== el);
					this.wrapper.querySelector(`[data-tag-value="${el}"]`).remove();
				});
			}

			this.resetTagsInputField();
		}

		if (!this.isMultiple) {
			if (this.toggle.querySelector("[data-icon]")) this.setToggleIcon();
			if (this.toggle.querySelector("[data-title]")) this.setToggleTitle();
			this.close(true);
		}

		if (!this.hasValue() && this.mode === "tags") {
			this.reassignTagsInputPlaceholder(this.placeholder);
		}

		if (this._isOpened && this.mode === "tags" && this.tagsInput) {
			this.tagsInput.focus();
		}

		this.triggerChangeEventForNativeSelect();
	}

	private triggerChangeEventForNativeSelect() {
		const selectChangeEvent = new Event("change", { bubbles: true });
		(this.el as HTMLSelectElement).dispatchEvent(selectChangeEvent);

		// TODO:: test with these lines added
		dispatch("change.hs.select", this.el, this.value);
	}

	private addSelectOption(
		title: string,
		val: string,
		disabled?: boolean,
		selected?: boolean,
		options?: ISingleOptionOptions,
	) {
		this.selectOptions = [
			...this.selectOptions,
			{
				title,
				val,
				disabled,
				selected,
				options,
			},
		];
	}

	private removeSelectOption(val: string, isArray = false) {
		const hasOption = !!this.selectOptions.some(
			(el: ISingleOption) => el.val === val,
		);

		if (!hasOption) return false;

		this.selectOptions = this.selectOptions.filter(
			(el: ISingleOption) => el.val !== val,
		);

		this.value = isArray
			? (this.value as string[]).filter((item: string) => item !== val)
			: val;
	}

	private resetTagsInputField() {
		(this.tagsInput as HTMLInputElement).value = "";

		this.reassignTagsInputPlaceholder("");
		this.searchOptions("");
	}

	private clearSelections() {
		Array.from(this.dropdown.children).forEach((el) => {
			if (el.classList.contains("selected")) el.classList.remove("selected");
		});
		Array.from(this.el.children).forEach((el) => {
			if ((el as HTMLOptionElement).selected) {
				(el as HTMLOptionElement).selected = false;
			}
		});
	}

	private setNewValue() {
		if (this.mode === "tags") {
			this.setTagsItems();
		} else {
			if (this.optionAllowEmptyOption && this.value === "") {
				const emptyOption = this.selectOptions.find((el: ISingleOption) =>
					el.val === ""
				);
				this.toggleTextWrapper.innerHTML = emptyOption?.title ||
					this.placeholder;
			} else {
				if (this.hasValue()) {
					if (this.apiUrl) {
						const selectedItem = this.dropdown.querySelector(
							`[data-value="${this.value}"]`,
						);
						if (selectedItem) {
							this.toggleTextWrapper.innerHTML =
								selectedItem.getAttribute("data-title-value") ||
								this.placeholder;
						} else {
							const selectedOption = (this.remoteOptions as IApiFieldMap[])
								.find(
									(el) => {
										const val = el[this.apiFieldsMap.val]
											? `${el[this.apiFieldsMap.val]}`
											: el[this.apiFieldsMap.title] as string;
										return val === this.value;
									},
								);
							this.toggleTextWrapper.innerHTML = selectedOption
								? `${selectedOption[this.apiFieldsMap.title]}`
								: this.stringFromValue();
						}
					} else {
						this.toggleTextWrapper.innerHTML = this.stringFromValue();
					}
				} else {
					this.toggleTextWrapper.innerHTML = this.placeholder;
				}
			}
		}
	}

	private stringFromValueBasic(options: ISingleOption[]) {
		const value: string[] = [];
		let title = "";

		options.forEach((el: ISingleOption) => {
			if (this.isMultiple) {
				if (Array.isArray(this.value) && this.value.includes(el.val)) {
					value.push(el.title);
				}
			} else {
				if (this.value === el.val) value.push(el.title);
			}
		});

		if (
			this.toggleCountText !== undefined &&
			this.toggleCountText !== null &&
			value.length >= this.toggleCountTextMinItems
		) {
			if (this.toggleCountTextMode === "nItemsAndCount") {
				const nItems = value.slice(0, this.toggleCountTextMinItems - 1);
				const tempTitle = [nItems.join(this.toggleSeparators.items)];
				const count = `${value.length - nItems.length}`;

				if (this?.toggleSeparators?.betweenItemsAndCounter) {
					tempTitle.push(this.toggleSeparators.betweenItemsAndCounter);
				}
				if (this.toggleCountText) {
					switch (this.toggleCountTextPlacement) {
						case "postfix-no-space":
							tempTitle.push(`${count}${this.toggleCountText}`);
							break;
						case "prefix-no-space":
							tempTitle.push(`${this.toggleCountText}${count}`);
							break;
						case "prefix":
							tempTitle.push(`${this.toggleCountText} ${count}`);
							break;
						default:
							tempTitle.push(`${count} ${this.toggleCountText}`);
							break;
					}
				}

				title = tempTitle.join(" ");
			} else {
				title = `${value.length} ${this.toggleCountText}`;
			}
		} else {
			title = value.join(this.toggleSeparators.items);
		}

		return title;
	}

	private stringFromValueRemoteData() {
		const options = this.dropdown.querySelectorAll("[data-title-value]");
		const value: string[] = [];
		let title = "";

		options.forEach((el: HTMLElement) => {
			const dataValue = el.getAttribute("data-value");
			const dataTitleValue = el.getAttribute("data-title-value");

			if (this.isMultiple) {
				if (Array.isArray(this.value) && this.value.includes(dataValue)) {
					value.push(dataTitleValue);
				}
			} else {
				if (this.value === dataValue) value.push(dataTitleValue);
			}
		});

		if (
			this.toggleCountText &&
			this.toggleCountText !== "" &&
			value.length >= this.toggleCountTextMinItems
		) {
			if (this.toggleCountTextMode === "nItemsAndCount") {
				const nItems = value.slice(0, this.toggleCountTextMinItems - 1);

				title = `${
					nItems.join(this.toggleSeparators.items)
				} ${this.toggleSeparators.betweenItemsAndCounter} ${
					value.length - nItems.length
				} ${this.toggleCountText}`;
			} else {
				title = `${value.length} ${this.toggleCountText}`;
			}
		} else {
			title = value.join(this.toggleSeparators.items);
		}

		return title;
	}

	private stringFromValue() {
		const result = this.apiUrl
			? this.stringFromValueRemoteData()
			: this.stringFromValueBasic(this.selectOptions);

		return result;
	}

	private selectSingleItem() {
		const selectedOption = Array.from(this.el.children).find(
			(el) => this.value === (el as HTMLOptionElement).value,
		);
		(selectedOption as HTMLOptionElement).selected = true;

		const selectedItem = Array.from(this.dropdown.children).find(
			(el) =>
				this.value === (el as HTMLOptionElement).getAttribute("data-value"),
		);

		if (selectedItem) selectedItem.classList.add("selected");

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	private selectMultipleItems() {
		if (!Array.isArray(this.value)) return;

		Array.from(this.dropdown.children)
			.filter((el) => this.value.includes(el.getAttribute("data-value")))
			.forEach((el) => el.classList.add("selected"));

		Array.from(this.el.children)
			.filter((el) => this.value.includes((el as HTMLOptionElement).value))
			.forEach((el) => ((el as HTMLOptionElement).selected = true));

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	private unselectMultipleItems() {
		Array.from(this.dropdown.children).forEach((el) =>
			el.classList.remove("selected")
		);
		Array.from(this.el.children).forEach(
			(el) => ((el as HTMLOptionElement).selected = false),
		);

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	private searchOptions(val: string) {
		if (val.length <= this.minSearchLength) {
			if (this.searchNoResult) {
				this.searchNoResult.remove();
				this.searchNoResult = null;
			}

			const options = this.dropdown.querySelectorAll("[data-value]");

			options.forEach((el) => {
				el.classList.remove("hidden");
			});

			return false;
		}

		if (this.searchNoResult) {
			this.searchNoResult.remove();
			this.searchNoResult = null;
		}

		this.searchNoResult = htmlToElement(this.searchNoResultTemplate);
		this.searchNoResult.innerText = this.searchNoResultText;
		classToClassList(this.searchNoResultClasses, this.searchNoResult);

		const options = this.dropdown.querySelectorAll("[data-value]");
		let hasItems = false;
		let countLimit: number;

		if (this.searchLimit) countLimit = 0;

		options.forEach((el) => {
			const optionVal = el.getAttribute("data-title-value").toLocaleLowerCase();
			const directMatch = this.isSearchDirectMatch;
			let condition;

			if (directMatch) {
				condition = !optionVal.includes(val.toLowerCase()) ||
					(this.searchLimit && countLimit >= this.searchLimit);
			} else {
				const regexSafeVal = val
					? val.split("").map((
						char,
					) => (/\w/.test(char) ? `${char}[\\W_]*` : "\\W*")).join("")
					: "";
				const regex = new RegExp(regexSafeVal, "i");
				condition = !regex.test(optionVal.trim()) ||
					(this.searchLimit && countLimit >= this.searchLimit);
			}

			if (condition) {
				el.classList.add("hidden");
			} else {
				el.classList.remove("hidden");

				hasItems = true;

				if (this.searchLimit) countLimit++;
			}
		});

		if (!hasItems) this.dropdown.append(this.searchNoResult);
	}

	private eraseToggleIcon() {
		const icon = this.toggle.querySelector("[data-icon]");

		if (icon) {
			icon.innerHTML = null;
			icon.classList.add("hidden");
		}
	}

	private eraseToggleTitle() {
		const title = this.toggle.querySelector("[data-title]");

		if (title) {
			title.innerHTML = this.placeholder;
		} else {
			this.toggleTextWrapper.innerHTML = this.placeholder;
		}
	}

	private toggleFn() {
		if (this._isOpened) this.close();
		else this.open();
	}

	// Accessibility methods
	private setupAccessibility(): void {
		this.accessibilityComponent = window.HSAccessibilityObserver
			.registerComponent(
				this.wrapper,
				{
					onEnter: () => {
						if (!this._isOpened) {
							this.open();
						} else {
							const highlighted = this.dropdown.querySelector(
								".hs-select-option-highlighted",
							);
							if (highlighted) {
								this.onSelectOption(
									highlighted.getAttribute("data-value") || "",
								);
								if (this._isOpened) {
									(highlighted as HTMLElement).focus();
								}
							}
						}
					},
					onSpace: () => {
						if (!this._isOpened) {
							this.open();
						} else {
							const highlighted = this.dropdown.querySelector(
								".hs-select-option-highlighted",
							);
							if (highlighted) {
								this.onSelectOption(
									highlighted.getAttribute("data-value") || "",
								);
								if (this._isOpened) {
									(highlighted as HTMLElement).focus();
								}
							}
						}
					},
					onEsc: () => {
						if (this._isOpened) {
							this.close(true);
						}
					},
					onArrow: (evt: KeyboardEvent) => {
						if (evt.metaKey) return;

						if (!this._isOpened && evt.key === "ArrowDown") {
							this.open();
							return;
						}

						if (this._isOpened) {
							switch (evt.key) {
								case "ArrowDown":
									this.focusMenuItem("next");
									break;
								case "ArrowUp":
									this.focusMenuItem("prev");
									break;
								case "Home":
									this.onStartEnd(true);
									break;
								case "End":
									this.onStartEnd(false);
									break;
							}
						}
					},
					onHome: () => {
						if (this._isOpened) this.onStartEnd(true);
					},
					onEnd: () => {
						if (this._isOpened) this.onStartEnd(false);
					},
					onTab: () => {
						if (this._isOpened) this.close();
					},
				},
				this._isOpened,
				"Select",
				".hs-select",
				this.dropdown,
			);
	}

	private focusMenuItem(direction: "next" | "prev"): void {
		const options = Array.from(
			this.dropdown.querySelectorAll(":scope > *:not(.hidden)"),
		).filter(
			(el: any) => !el.classList.contains("disabled"),
		);

		if (!options.length) return;

		const current = this.dropdown.querySelector(
			".hs-select-option-highlighted",
		);
		const currentIndex = current ? options.indexOf(current) : -1;
		const nextIndex = direction === "next"
			? (currentIndex + 1) % options.length
			: (currentIndex - 1 + options.length) % options.length;

		if (current) current.classList.remove("hs-select-option-highlighted");
		options[nextIndex].classList.add("hs-select-option-highlighted");
		(options[nextIndex] as HTMLElement).focus();
	}

	private onStartEnd(isStart = true): void {
		if (!this.dropdown) return;

		const options = Array.from(
			this.dropdown.querySelectorAll(":scope > *:not(.hidden)"),
		).filter(
			(el: any) => !el.classList.contains("disabled"),
		);

		if (!options.length) return;

		const current = this.dropdown.querySelector(
			".hs-select-option-highlighted",
		);
		if (current) current.classList.remove("hs-select-option-highlighted");

		const index = isStart ? 0 : options.length - 1;
		options[index].classList.add("hs-select-option-highlighted");
		(options[index] as HTMLElement).focus();
	}

	// Public methods
	public destroy() {
		// Remove listeners
		if (this.wrapper) {
			this.wrapper.removeEventListener("click", this.onWrapperClickListener);
		}
		if (this.toggle) {
			this.toggle.removeEventListener("click", this.onToggleClickListener);
		}
		if (this.tagsInput) {
			this.tagsInput.removeEventListener(
				"focus",
				this.onTagsInputFocusListener,
			);
			this.tagsInput.removeEventListener(
				"input",
				this.onTagsInputInputListener,
			);
			this.tagsInput.removeEventListener(
				"input",
				this.onTagsInputInputSecondListener,
			);
			this.tagsInput.removeEventListener(
				"keydown",
				this.onTagsInputKeydownListener,
			);
		}

		if (this.search) {
			this.search.removeEventListener("input", this.onSearchInputListener);
		}

		const parent = this.el.parentElement.parentElement;

		this.el.classList.add("hidden");
		this.el.style.display = "";
		parent.prepend(this.el);
		parent.querySelector(".hs-select").remove();
		this.wrapper = null;
		this.disabledObserver?.disconnect();
		this.disabledObserver = null;

		window.$hsSelectCollection = window.$hsSelectCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	public open() {
		const currentlyOpened =
			window?.$hsSelectCollection?.find((el) => el.element.isOpened()) || null;

		if (currentlyOpened) currentlyOpened.element.close();
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

		if (this.dropdownScope === "window") {
			this.dropdown.classList.add("invisible");
		}
		this.dropdown.classList.remove("hidden");

		if (this.dropdownScope !== "window") this.recalculateDirection();

		setTimeout(() => {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "true";
			this.wrapper.classList.add("active");
			this.dropdown.classList.add("opened");
			if (
				this.dropdown.classList.contains("w-full") &&
				this.dropdownScope === "window"
			) {
				this.updateDropdownWidth();
			}

			if (this.floatingUIInstance && this.dropdownScope === "window") {
				this.floatingUIInstance.update();
				this.dropdown.classList.remove("invisible");
			}
			if (this.hasSearch && !this.preventSearchFocus) this.search.focus();

			this.animationInProcess = false;
		});

		this._isOpened = true;

		if (window.HSAccessibilityObserver && this.accessibilityComponent) {
			window.HSAccessibilityObserver.updateComponentState(
				this.accessibilityComponent,
				this._isOpened,
			);
		}
	}

	public close(forceFocus = false) {
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "false";
		this.wrapper.classList.remove("active");
		this.dropdown.classList.remove("opened", "bottom-full", "top-full");
		if (this.dropdownDirectionClasses?.bottom) {
			this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom);
		}
		if (this.dropdownDirectionClasses?.top) {
			this.dropdown.classList.remove(this.dropdownDirectionClasses.top);
		}
		this.dropdown.style.marginTop = "";
		this.dropdown.style.marginBottom = "";

		afterTransition(this.dropdown, () => {
			this.dropdown.classList.add("hidden");
			if (this.hasSearch) {
				this.search.value = "";

				if (!this.apiUrl) {
					this.search.dispatchEvent(new Event("input", { bubbles: true }));
				}

				this.search.blur();
			}

			if (forceFocus) {
				if (this.mode?.includes("tags")) this.wrapper.focus();
				else this.toggle.focus();
			}

			this.animationInProcess = false;
		});

		this.dropdown
			.querySelector(".hs-select-option-highlighted")
			?.classList.remove("hs-select-option-highlighted");
		this._isOpened = false;

		if (window.HSAccessibilityObserver && this.accessibilityComponent) {
			window.HSAccessibilityObserver.updateComponentState(
				this.accessibilityComponent,
				this._isOpened,
			);
		}
	}

	public addOption(items: ISingleOption | ISingleOption[]) {
		let i = `${this.selectOptions.length}`;
		const addOption = (option: ISingleOption) => {
			const { title, val, disabled, selected, options } = option;
			const hasOption = !!this.selectOptions.some(
				(el: ISingleOption) => el.val === val,
			);

			if (!hasOption) {
				this.addSelectOption(title, val, disabled, selected, options);
				this.buildOption(title, val, disabled, selected, options, i);
				this.buildOriginalOption(title, val, null, disabled, selected, options);

				if (selected && !this.isMultiple) this.onSelectOption(val);
			}
		};

		if (Array.isArray(items)) {
			items.forEach((option) => {
				addOption(option);
			});
		} else {
			addOption(items);
		}

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	public removeOption(values: string | string[]) {
		const removeOption = (val: string, isArray = false) => {
			const hasOption = !!this.selectOptions.some(
				(el: ISingleOption) => el.val === val,
			);

			if (hasOption) {
				this.removeSelectOption(val, isArray);
				this.destroyOption(val);
				this.destroyOriginalOption(val);

				if (this.value === val) {
					this.value = null;

					this.eraseToggleTitle();
					this.eraseToggleIcon();
				}
			}
		};

		if (Array.isArray(values)) {
			values.forEach((val) => {
				removeOption(val, this.isMultiple);
			});
		} else {
			removeOption(values, this.isMultiple);
		}

		this.setNewValue();

		this.sortElements(this.el, "option");
		this.sortElements(this.dropdown, "[data-value]");
	}

	public recalculateDirection() {
		if (
			this?.dropdownVerticalFixedPlacement &&
			(this.dropdown.classList.contains("bottom-full") ||
				this.dropdown.classList.contains("top-full"))
		) return false;

		if (this?.dropdownVerticalFixedPlacement === "top") {
			this.dropdown.classList.add("bottom-full");
			this.dropdown.style.marginBottom = `${this.dropdownSpace}px`;
		} else if (this?.dropdownVerticalFixedPlacement === "bottom") {
			this.dropdown.classList.add("top-full");
			this.dropdown.style.marginTop = `${this.dropdownSpace}px`;
		} else if (
			isEnoughSpace(
				this.dropdown,
				this.toggle || this.tagsInput,
				"bottom",
				this.dropdownSpace,
				this.viewport,
			)
		) {
			this.dropdown.classList.remove("bottom-full");
			if (this.dropdownDirectionClasses?.bottom) {
				this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom);
			}
			this.dropdown.style.marginBottom = "";
			this.dropdown.classList.add("top-full");
			if (this.dropdownDirectionClasses?.top) {
				this.dropdown.classList.add(this.dropdownDirectionClasses.top);
			}
			this.dropdown.style.marginTop = `${this.dropdownSpace}px`;
		} else {
			this.dropdown.classList.remove("top-full");
			if (this.dropdownDirectionClasses?.top) {
				this.dropdown.classList.remove(this.dropdownDirectionClasses.top);
			}
			this.dropdown.style.marginTop = "";
			this.dropdown.classList.add("bottom-full");
			if (this.dropdownDirectionClasses?.bottom) {
				this.dropdown.classList.add(this.dropdownDirectionClasses.bottom);
			}
			this.dropdown.style.marginBottom = `${this.dropdownSpace}px`;
		}
	}

	public isOpened(): boolean {
		return this._isOpened || false;
	}

	public containsElement(element: HTMLElement): boolean {
		return this.wrapper?.contains(element) || false;
	}

	// Static methods
	private static findInCollection(
		target: HSSelect | HTMLElement | string,
	): ICollectionItem<HSSelect> | null {
		return window.$hsSelectCollection.find((el) => {
			if (target instanceof HSSelect) return el.element.el === target.el;
			else if (typeof target === "string") {
				return el.element.el === document.querySelector(target);
			} else return el.element.el === target;
		}) || null;
	}

	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsSelectCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		return elInCollection
			? isInstance ? elInCollection : elInCollection.element
			: null;
	}

	static autoInit() {
		if (!window.$hsSelectCollection) {
			window.$hsSelectCollection = [];

			window.addEventListener("click", (evt) => {
				const evtTarget = evt.target;

				HSSelect.closeCurrentlyOpened(evtTarget as HTMLElement);
			});
		}

		if (window.$hsSelectCollection) {
			window.$hsSelectCollection = window.$hsSelectCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll("[data-hs-select]:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsSelectCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const data = el.getAttribute("data-hs-select");
					const options: ISelectOptions = data ? JSON.parse(data) : {};

					new HSSelect(el, options);
				}
			});
	}

	static open(target: HSSelect | HTMLElement | string) {
		const instance = HSSelect.findInCollection(target);

		if (
			instance &&
			!instance.element.isOpened()
		) instance.element.open();
	}

	static close(target: HSSelect | HTMLElement | string) {
		const instance = HSSelect.findInCollection(target);

		if (
			instance &&
			instance.element.isOpened()
		) instance.element.close();
	}

	static closeCurrentlyOpened(evtTarget: HTMLElement | null = null) {
		if (
			!evtTarget.closest(".hs-select.active") &&
			!evtTarget.closest("[data-hs-select-dropdown].opened")
		) {
			const currentlyOpened = window.$hsSelectCollection.filter((el) =>
				el.element.isOpened()
			) || null;

			if (currentlyOpened) {
				currentlyOpened.forEach((el) => {
					el.element.close();
				});
			}
		}
	}
}

declare global {
	interface Window {
		HSSelect: Function;
		$hsSelectCollection: ICollectionItem<HSSelect>[];
	}
}

window.addEventListener("load", () => {
	HSSelect.autoInit();

	// Uncomment for debug
	// console.log('Select collection:', window.$hsSelectCollection);
});

document.addEventListener("scroll", () => {
	if (!window.$hsSelectCollection) return false;

	const target = window.$hsSelectCollection.find((el) => el.element.isOpened());

	if (target) target.element.recalculateDirection();
});

if (typeof window !== "undefined") {
	window.HSSelect = HSSelect;
}

export default HSSelect;
