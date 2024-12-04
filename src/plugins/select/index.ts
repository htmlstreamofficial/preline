/*
 * HSSelect
 * @version: 2.6.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	isEnoughSpace,
	debounce,
	dispatch,
	afterTransition,
	htmlToElement,
	classToClassList,
} from '../../utils';

import {
	ISelect,
	ISelectOptions,
	ISingleOption,
	ISingleOptionOptions,
	IApiFieldMap,
} from '../select/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { SELECT_ACCESSIBILITY_KEY_SET, POSITIONS } from '../../constants';

class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder: string | null;
	private readonly hasSearch: boolean;
	private readonly preventSearchFocus: boolean;
	private readonly mode: string | null;
	private readonly viewport: HTMLElement | null;

	isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;
	selectedItems: string[];

	private readonly apiUrl: string | null;
	private readonly apiQuery: string | null;
	private readonly apiOptions: RequestInit | null;
	private readonly apiDataPart: string | null;
	private readonly apiSearchQueryKey: string | null;
	private readonly apiFieldsMap: IApiFieldMap | null;
	private readonly apiIconTag: string | null;

	private readonly toggleTag: string | null;
	private readonly toggleClasses: string | null;
	private readonly toggleSeparators: {
		items?: string;
		betweenItemsAndCounter?: string;
	} | null;
	private readonly toggleCountText: string | null;
	private readonly toggleCountTextPlacement:
		| 'postfix'
		| 'prefix'
		| 'postfix-no-space'
		| 'prefix-no-space';
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
	public readonly dropdownVerticalFixedPlacement: 'top' | 'bottom' | null;
	public readonly dropdownScope: 'window' | 'parent';
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
	private readonly optionTag: string | null;
	private readonly optionTemplate: string | null;
	private readonly optionClasses: string | null;
	private readonly descriptionClasses: string | null;
	private readonly iconClasses: string | null;

	private animationInProcess: boolean;

	private wrapper: HTMLElement | null;
	private toggle: HTMLElement | null;
	private toggleTextWrapper: HTMLElement | null;
	private tagsInput: HTMLElement | null;
	private dropdown: HTMLElement | null;
	private popperInstance: any;
	private searchWrapper: HTMLElement | null;
	private search: HTMLInputElement | null;
	private searchNoResult: HTMLElement | null;
	private selectOptions: ISingleOption[] | [];
	private extraMarkup: string | string[] | Element | null;

	private readonly isAddTagOnEnter: boolean;

	private tagsInputHelper: HTMLElement | null;

	private remoteOptions: unknown[];

	private optionId = 0;

	private onWrapperClickListener: (evt: Event) => void;
	private onToggleClickListener: () => void;
	private onTagsInputFocusListener: () => void;
	private onTagsInputInputListener: () => void;
	private onTagsInputInputSecondListener: (evt: InputEvent) => void;
	private onTagsInputKeydownListener: (evt: KeyboardEvent) => void;
	private onSearchInputListener: (evt: InputEvent) => void;

	constructor(el: HTMLElement, options?: ISelectOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-select');
		const dataOptions: ISelectOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.value =
			concatOptions?.value || (this.el as HTMLSelectElement).value || null;
		this.placeholder = concatOptions?.placeholder || 'Select...';
		this.hasSearch = concatOptions?.hasSearch || false;
		this.preventSearchFocus = concatOptions?.preventSearchFocus || false;
		this.mode = concatOptions?.mode || 'default';
		this.viewport =
			typeof concatOptions?.viewport !== 'undefined'
				? document.querySelector(concatOptions?.viewport)
				: null;
		this.isOpened = Boolean(concatOptions?.isOpened) || false;
		this.isMultiple = this.el.hasAttribute('multiple') || false;
		this.isDisabled = this.el.hasAttribute('disabled') || false;
		this.selectedItems = [];

		this.apiUrl = concatOptions?.apiUrl || null;
		this.apiQuery = concatOptions?.apiQuery || null;
		this.apiOptions = concatOptions?.apiOptions || null;
		this.apiSearchQueryKey = concatOptions?.apiSearchQueryKey || null;
		this.apiDataPart = concatOptions?.apiDataPart || null;
		this.apiFieldsMap = concatOptions?.apiFieldsMap || null;
		this.apiIconTag = concatOptions?.apiIconTag || null;

		this.wrapperClasses = concatOptions?.wrapperClasses || null;
		this.toggleTag = concatOptions?.toggleTag || null;
		this.toggleClasses = concatOptions?.toggleClasses || null;
		this.toggleCountText =
			typeof concatOptions?.toggleCountText === undefined
				? null
				: concatOptions.toggleCountText;
		this.toggleCountTextPlacement =
			concatOptions?.toggleCountTextPlacement || 'postfix';
		this.toggleCountTextMinItems = concatOptions?.toggleCountTextMinItems || 1;
		this.toggleCountTextMode =
			concatOptions?.toggleCountTextMode || 'countAfterLimit';
		this.toggleSeparators = {
			items: concatOptions?.toggleSeparators?.items || ', ',
			betweenItemsAndCounter:
				concatOptions?.toggleSeparators?.betweenItemsAndCounter || 'and',
		};
		this.tagsItemTemplate = concatOptions?.tagsItemTemplate || null;
		this.tagsItemClasses = concatOptions?.tagsItemClasses || null;
		this.tagsInputId = concatOptions?.tagsInputId || null;
		this.tagsInputClasses = concatOptions?.tagsInputClasses || null;
		this.dropdownTag = concatOptions?.dropdownTag || null;
		this.dropdownClasses = concatOptions?.dropdownClasses || null;
		this.dropdownDirectionClasses =
			concatOptions?.dropdownDirectionClasses || null;
		this.dropdownSpace = concatOptions?.dropdownSpace || 10;
		this.dropdownPlacement = concatOptions?.dropdownPlacement || null;
		this.dropdownVerticalFixedPlacement = concatOptions?.dropdownVerticalFixedPlacement || null;
		this.dropdownScope = concatOptions?.dropdownScope || 'parent';
		this.searchTemplate = concatOptions?.searchTemplate || null;
		this.searchWrapperTemplate = concatOptions?.searchWrapperTemplate || null;
		this.searchWrapperClasses =
			concatOptions?.searchWrapperClasses || 'bg-white p-2 sticky top-0';
		this.searchId = concatOptions?.searchId || null;
		this.searchLimit = concatOptions?.searchLimit || Infinity;
		this.isSearchDirectMatch =
			typeof concatOptions?.isSearchDirectMatch !== 'undefined'
				? concatOptions?.isSearchDirectMatch
				: true;
		this.searchClasses =
			concatOptions?.searchClasses ||
			'block w-[calc(100%-2rem)] text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 py-2 px-3 my-2 mx-4';
		this.searchPlaceholder = concatOptions?.searchPlaceholder || 'Search...';
		this.searchNoResultTemplate =
			concatOptions?.searchNoResultTemplate || '<span></span>';
		this.searchNoResultText =
			concatOptions?.searchNoResultText || 'No results found';
		this.searchNoResultClasses =
			concatOptions?.searchNoResultClasses ||
			'px-4 text-sm text-gray-800 dark:text-neutral-200';
		this.optionTemplate = concatOptions?.optionTemplate || null;
		this.optionTag = concatOptions?.optionTag || null;
		this.optionClasses = concatOptions?.optionClasses || null;
		this.extraMarkup = concatOptions?.extraMarkup || null;
		this.descriptionClasses = concatOptions?.descriptionClasses || null;
		this.iconClasses = concatOptions?.iconClasses || null;
		this.isAddTagOnEnter = concatOptions?.isAddTagOnEnter ?? true;

		this.animationInProcess = false;
		this.selectOptions = [];
		this.remoteOptions = [];

		this.tagsInputHelper = null;

		this.init();
	}

	private wrapperClick(evt: Event) {
		if (
			!(evt.target as HTMLElement).closest('[data-hs-select-dropdown]') &&
			!(evt.target as HTMLElement).closest('[data-tag-value]')
		) {
			this.tagsInput.focus();
		}
	}

	private toggleClick() {
		if (this.isDisabled) return false;

		this.toggleFn();
	}

	private tagsInputFocus() {
		if (!this.isOpened) this.open();
	}

	private tagsInputInput() {
		this.calculateInputWidth();
	}

	private tagsInputInputSecond(evt: InputEvent) {
		this.searchOptions((evt.target as HTMLInputElement).value);
	}

	private tagsInputKeydown(evt: KeyboardEvent) {
		if (evt.key === 'Enter' && this.isAddTagOnEnter) {
			const val = (evt.target as HTMLInputElement).value;

			if (this.selectOptions.find((el: ISingleOption) => el.val === val))
				return false;

			this.addSelectOption(val, val);
			this.buildOption(val, val);
			(
				this.dropdown.querySelector(`[data-value="${val}"]`) as HTMLElement
			).click();

			this.resetTagsInputField();
			// this.close();
		}
	}

	private searchInput(evt: InputEvent) {
		if (this.apiUrl) this.remoteSearch((evt.target as HTMLInputElement).value);
		else this.searchOptions((evt.target as HTMLInputElement).value);
	}

	public setValue(val: string | string[]) {
		this.value = val;

		this.clearSelections();

		if (Array.isArray(val)) {
			this.toggleTextWrapper.innerHTML = this.value.length
				? this.stringFromValue()
				: this.placeholder;
			this.unselectMultipleItems();
			this.selectMultipleItems();
		} else {
			this.setToggleTitle();

			if (this.toggle.querySelector('[data-icon]')) this.setToggleIcon();
			if (this.toggle.querySelector('[data-title]')) this.setToggleTitle();

			this.selectSingleItem();
		}
	}

	private init() {
		this.createCollection(window.$hsSelectCollection, this);

		this.build();
	}

	private build() {
		this.el.style.display = 'none';

		if (this.el.children) {
			Array.from(this.el.children)
				.filter((el: HTMLOptionElement) => el.value && el.value !== '')
				.forEach((el: HTMLOptionElement) => {
					const data = el.getAttribute('data-hs-select-option');

					this.selectOptions = [
						...this.selectOptions,
						{
							title: el.textContent,
							val: el.value,
							disabled: el.disabled,
							options: data !== 'undefined' ? JSON.parse(data) : null,
						},
					];
				});
		}

		if (this.isMultiple) {
			const selectedOptions = Array.from(this.el.children).filter(
				(el: HTMLOptionElement) => el.selected,
			);

			if (selectedOptions) {
				const values: string[] = [];

				selectedOptions.forEach((el: HTMLOptionElement) => {
					values.push(el.value);
				});

				this.value = values;
			}
		}

		this.buildWrapper();
		if (this.mode === 'tags') this.buildTags();
		else this.buildToggle();
		this.buildDropdown();
		if (this.extraMarkup) this.buildExtraMarkup();
	}

	private buildWrapper() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('hs-select', 'relative');

		if (this.mode === 'tags') {
			this.onWrapperClickListener = (evt) => this.wrapperClick(evt);

			this.wrapper.addEventListener('click', this.onWrapperClickListener);
		}

		if (this.wrapperClasses)
			classToClassList(this.wrapperClasses, this.wrapper);

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
			if (!el.classList.contains('--prevent-click'))
				el.addEventListener('click', (evt: Event) => {
					evt.stopPropagation();
					this.toggleFn();
				});
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
		this.toggleTextWrapper = document.createElement('span');
		this.toggleTextWrapper.classList.add('truncate');
		this.toggle = htmlToElement(this.toggleTag || '<div></div>');
		icon = this.toggle.querySelector('[data-icon]');
		title = this.toggle.querySelector('[data-title]');

		if (!this.isMultiple && icon) this.setToggleIcon();
		if (!this.isMultiple && title) this.setToggleTitle();
		if (this.isMultiple) {
			this.toggleTextWrapper.innerHTML = this.value.length
				? this.stringFromValue()
				: this.placeholder;
		} else {
			this.toggleTextWrapper.innerHTML =
				this.getItemByValue(this.value as string)?.title || this.placeholder;
		}
		if (!title) this.toggle.append(this.toggleTextWrapper);
		if (this.toggleClasses) classToClassList(this.toggleClasses, this.toggle);
		if (this.isDisabled) this.toggle.classList.add('disabled');
		if (this.wrapper) this.wrapper.append(this.toggle);

		if (this.toggle?.ariaExpanded) {
			if (this.isOpened) this.toggle.ariaExpanded = 'true';
			else this.toggle.ariaExpanded = 'false';
		}

		this.onToggleClickListener = () => this.toggleClick();

		this.toggle.addEventListener('click', this.onToggleClickListener);
	}

	private setToggleIcon() {
		const item = this.getItemByValue(this.value as string) as ISingleOption &
			IApiFieldMap;
		const icon = this.toggle.querySelector('[data-icon]');

		if (icon) {
			icon.innerHTML = '';

			const img = htmlToElement(
				this.apiUrl && this.apiIconTag
					? this.apiIconTag || ''
					: item?.options?.icon || '',
			) as HTMLImageElement;
			if (
				this.value &&
				this.apiUrl &&
				this.apiIconTag &&
				item[this.apiFieldsMap.icon]
			)
				img.src = (item[this.apiFieldsMap.icon] as string) || '';

			icon.append(img);

			if (!img) icon.classList.add('hidden');
			else icon.classList.remove('hidden');
		}
	}

	private setToggleTitle() {
		const title = this.toggle.querySelector('[data-title]');

		if (title) {
			title.innerHTML = this.getItemByValue(this.value as string)?.title || this.placeholder;
			title.classList.add('truncate');

			this.toggle.append(title);
		}
	}

	private buildTags() {
		if (this.isDisabled) this.wrapper.classList.add('disabled');
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

		const newItem = document.createElement('div');
		newItem.setAttribute('data-tag-value', val);
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

			if (this.apiUrl && this.apiIconTag && item[this.apiFieldsMap.icon])
				img.src = (item[this.apiFieldsMap.icon] as string) || '';

			icon = template
				? template.querySelector('[data-icon]')
				: document.createElement('span');

			icon.append(img);

			if (!template) newItem.append(icon);
		}

		if (
			template &&
			template.querySelector('[data-icon]') &&
			!item?.options?.icon &&
			!this.apiUrl &&
			!this.apiIconTag &&
			!item[this.apiFieldsMap?.icon]
		) {
			template.querySelector('[data-icon]').classList.add('hidden');
		}

		// Title
		title = template
			? template.querySelector('[data-title]')
			: document.createElement('span');
		title.textContent = item.title || '';

		if (!template) newItem.append(title);

		// Remove
		if (template) {
			remove = template.querySelector('[data-remove]');
		} else {
			remove = document.createElement('span');
			remove.textContent = 'X';

			newItem.append(remove);
		}

		remove.addEventListener('click', () => {
			this.value = (this.value as string[]).filter((el) => el !== val);
			this.selectedItems = this.selectedItems.filter((el) => el !== val);

			if (!this.value.length)
				this.reassignTagsInputPlaceholder(this.placeholder);

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
				(el) => `${el[this.apiFieldsMap.val]}` === val || el[this.apiFieldsMap.title] === val,
			)
			: this.selectOptions.find((el: ISingleOption) => el.val === val);

		return value;
	}

	private setTagsItems() {
		if (this.value) {
			(this.value as string[]).forEach((val) => {
				if (!this.selectedItems.includes(val)) this.buildTagsItem(val);

				this.selectedItems = !this.selectedItems.includes(val)
					? [...this.selectedItems, val]
					: this.selectedItems;
			});
		}
	}

	private buildTagsInput() {
		this.tagsInput = document.createElement('input');

		if (this.tagsInputId) this.tagsInput.id = this.tagsInputId;
		if (this.tagsInputClasses)
			classToClassList(this.tagsInputClasses, this.tagsInput);

		this.onTagsInputFocusListener = () => this.tagsInputFocus();
		this.onTagsInputInputListener = () => this.tagsInputInput();
		this.onTagsInputInputSecondListener = debounce((evt: InputEvent) =>
			this.tagsInputInputSecond(evt),
		);
		this.onTagsInputKeydownListener = (evt) => this.tagsInputKeydown(evt);

		this.tagsInput.addEventListener('focus', this.onTagsInputFocusListener);
		this.tagsInput.addEventListener('input', this.onTagsInputInputListener);
		this.tagsInput.addEventListener(
			'input',
			this.onTagsInputInputSecondListener,
		);
		this.tagsInput.addEventListener('keydown', this.onTagsInputKeydownListener);

		this.wrapper.append(this.tagsInput);

		setTimeout(() => {
			this.adjustInputWidth();
			this.reassignTagsInputPlaceholder(
				this.value.length ? '' : this.placeholder,
			);
		});
	}

	private buildDropdown() {
		this.dropdown = htmlToElement(this.dropdownTag || '<div></div>');
		this.dropdown.setAttribute('data-hs-select-dropdown', '');

		if (this.dropdownScope === 'parent') {
			this.dropdown.classList.add('absolute');
			if (!this.dropdownVerticalFixedPlacement) this.dropdown.classList.add('top-full');
		}
		this.dropdown.role = 'listbox';
		this.dropdown.tabIndex = -1;
		this.dropdown.ariaOrientation = 'vertical';

		if (!this.isOpened) this.dropdown.classList.add('hidden');

		if (this.dropdownClasses)
			classToClassList(this.dropdownClasses, this.dropdown);
		if (this.wrapper) this.wrapper.append(this.dropdown);
		if (this.dropdown && this.hasSearch) this.buildSearch();
		if (this.selectOptions)
			this.selectOptions.forEach((props: ISingleOption, i) =>
				this.buildOption(
					props.title,
					props.val,
					props.disabled,
					props.selected,
					props.options,
					`${i}`,
				),
			);

		if (this.apiUrl) this.optionsFromRemoteData();

		if (this.dropdownScope === 'window') this.buildPopper();
	}

	private buildPopper() {
		if (typeof Popper !== 'undefined' && Popper.createPopper) {
			document.body.appendChild(this.dropdown);

			this.popperInstance = Popper.createPopper(
				this.mode === 'tags' ? this.wrapper : this.toggle,
				this.dropdown,
				{
					placement: POSITIONS[this.dropdownPlacement] || 'bottom',
					strategy: 'fixed',
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, 5],
							},
						},
					],
				},
			);
		}
	}

	private updateDropdownWidth() {
		const toggle = this.mode === 'tags' ? this.wrapper : this.toggle;

		this.dropdown.style.width = `${toggle.clientWidth}px`;
	}

	private buildSearch() {
		let input;
		this.searchWrapper = htmlToElement(
			this.searchWrapperTemplate || '<div></div>',
		);
		if (this.searchWrapperClasses)
			classToClassList(this.searchWrapperClasses, this.searchWrapper);
		input = this.searchWrapper.querySelector('[data-input]');

		const search = htmlToElement(
			this.searchTemplate || '<input type="text" />',
		);
		this.search = (
			search.tagName === 'INPUT' ? search : search.querySelector(':scope input')
		) as HTMLInputElement;

		this.search.placeholder = this.searchPlaceholder;
		if (this.searchClasses) classToClassList(this.searchClasses, this.search);
		if (this.searchId) this.search.id = this.searchId;

		this.onSearchInputListener = debounce((evt: InputEvent) =>
			this.searchInput(evt),
		);

		this.search.addEventListener('input', this.onSearchInputListener);

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
		index: string = '1',
		id?: string,
	) {
		let template: HTMLElement | null = null;
		let titleWrapper: HTMLElement | null = null;
		let iconWrapper: HTMLElement | null = null;
		let descriptionWrapper: HTMLElement | null = null;

		const option = htmlToElement(this.optionTag || '<div></div>');
		option.setAttribute('data-value', val);
		option.setAttribute('data-title-value', title);
		option.setAttribute('tabIndex', index);
		option.classList.add('cursor-pointer');
		option.setAttribute('data-id', id || `${this.optionId}`);
		if (!id) this.optionId++;
		if (disabled) option.classList.add('disabled');
		if (selected) {
			if (this.isMultiple) this.value = [...(this.value as []), val];
			else this.value = val;
		}
		if (this.optionTemplate) {
			template = htmlToElement(this.optionTemplate);

			option.append(template);
		}
		if (template) {
			titleWrapper = template.querySelector('[data-title]');
			titleWrapper.textContent = title || '';
		} else {
			option.textContent = title || '';
		}
		if (options) {
			if (options.icon) {
				const img = htmlToElement(this.apiIconTag ?? options.icon);
				img.classList.add('max-w-full');

				if (this.apiUrl) {
					img.setAttribute('alt', title);
					img.setAttribute('src', options.icon);
				}

				if (template) {
					iconWrapper = template.querySelector('[data-icon]');
					iconWrapper.append(img);
				} else {
					const icon = htmlToElement('<div></div>');
					if (this.iconClasses) classToClassList(this.iconClasses, icon);

					icon.append(img);
					option.append(icon);
				}
			}
			if (options.description) {
				if (template) {
					descriptionWrapper = template.querySelector('[data-description]');
					if (descriptionWrapper)
						descriptionWrapper.append(options.description);
				} else {
					const description = htmlToElement('<div></div>');
					description.textContent = options.description;
					if (this.descriptionClasses)
						classToClassList(this.descriptionClasses, description);

					option.append(description);
				}
			}
		}
		if (
			template &&
			template.querySelector('[data-icon]') &&
			!options &&
			!options?.icon
		) {
			template.querySelector('[data-icon]').classList.add('hidden');
		}

		if (
			this.value &&
			(this.isMultiple ? this.value.includes(val) : this.value === val)
		)
			option.classList.add('selected');

		if (!disabled)
			option.addEventListener('click', () => this.onSelectOption(val));

		if (this.optionClasses) classToClassList(this.optionClasses, option);
		if (this.dropdown) this.dropdown.append(option);
		if (selected) this.setNewValue();
	}

	private buildOptionFromRemoteData(
		title: string,
		val: string,
		disabled: boolean = false,
		selected: boolean = false,
		index: string = '1',
		id: string | null,
		options?: ISingleOptionOptions,
	) {
		if (index) {
			this.buildOption(title, val, disabled, selected, options, index, id);
		} else {
			alert(
				'ID parameter is required for generating remote options! Please check your API endpoint have it.',
			);
		}
	}

	private buildOptionsFromRemoteData(data: []) {
		data.forEach((el: IApiFieldMap, i) => {
			let id = null;
			let title = '';
			let value = '';
			const options: IApiFieldMap & { rest: { [key: string]: unknown } } = {
				id: '',
				val: '',
				title: '',
				icon: null,
				description: null,
				rest: {},
			};

			Object.keys(el).forEach((key: string) => {
				if (el[this.apiFieldsMap.id]) id = el[this.apiFieldsMap.id];
				if (el[this.apiFieldsMap.val] || el[this.apiFieldsMap.title]) {
					value = el[this.apiFieldsMap.val] as string || el[this.apiFieldsMap.title] as string;
				}
				if (el[this.apiFieldsMap.title])
					title = el[this.apiFieldsMap.title] as string;
				if (el[this.apiFieldsMap.icon])
					options.icon = el[this.apiFieldsMap.icon] as string;
				if (el[this.apiFieldsMap?.description])
					options.description = el[this.apiFieldsMap.description] as string;
				options.rest[key] = el[key];
			});

			this.buildOriginalOption(
				title,
				`${value}`,
				id,
				false,
				false,
				options as ISingleOptionOptions & IApiFieldMap,
			);

			this.buildOptionFromRemoteData(
				title,
				`${value}`,
				false,
				false,
				`${i}`,
				id,
				options as ISingleOptionOptions & IApiFieldMap,
			);
		});

		this.sortElements(this.el, 'option');
		this.sortElements(this.dropdown, '[data-value]');
	}

	private async optionsFromRemoteData(val = '') {
		const res = await this.apiRequest(val);
		this.remoteOptions = res;

		if (res.length) this.buildOptionsFromRemoteData(this.remoteOptions as []);
		else console.log('There is no data were responded!');
	}

	private async apiRequest(val = '') {
		try {
			let url = this.apiUrl;
			const search = this.apiSearchQueryKey
				? `${this.apiSearchQueryKey}=${val.toLowerCase()}`
				: null;
			const query = `${this.apiQuery}`;
			const options = this.apiOptions || {};

			if (search) url += `?${search}`;
			if (this.apiQuery) url += `${search ? '&' : '?'}${query}`;

			const req = await fetch(url, options);
			const res = await req.json();

			return this.apiDataPart ? res[this.apiDataPart] : res;
		} catch (err) {
			console.error(err);
		}
	}

	private sortElements(container: HTMLElement, selector: string): void {
		const items = Array.from(container.querySelectorAll(selector));

		items.sort((a, b) => {
			const isASelected =
				a.classList.contains('selected') || a.hasAttribute('selected');
			const isBSelected =
				b.classList.contains('selected') || b.hasAttribute('selected');

			if (isASelected && !isBSelected) return -1;
			if (!isASelected && isBSelected) return 1;

			return 0;
		});

		items.forEach((item) => container.appendChild(item));
	}

	private async remoteSearch(val: string) {
		const res = await this.apiRequest(val);
		this.remoteOptions = res;
		let newIds = res.map((item: { id: string }) => `${item.id}`);
		let restOptions = null;
		const pseudoOptions = this.dropdown.querySelectorAll('[data-value]');
		const options = this.el.querySelectorAll('[data-hs-select-option]');

		options.forEach((el: HTMLOptionElement) => {
			const dataId = el.getAttribute('data-id');

			if (!newIds.includes(dataId) && !this.value?.includes(el.value))
				this.destroyOriginalOption(el.value);
		});

		pseudoOptions.forEach((el: HTMLElement) => {
			const dataId = el.getAttribute('data-id');

			if (
				!newIds.includes(dataId) &&
				!this.value?.includes(el.getAttribute('data-value'))
			)
				this.destroyOption(el.getAttribute('data-value'));
			else newIds = newIds.filter((item: string) => item !== dataId);
		});

		restOptions = res.filter((item: { id: string }) =>
			newIds.includes(`${item.id}`),
		);

		if (restOptions.length) this.buildOptionsFromRemoteData(restOptions as []);
		else console.log('There is no data were responded!');
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
		const option = htmlToElement('<option></option>');
		option.setAttribute('value', val);
		if (disabled) option.setAttribute('disabled', 'disabled');
		if (selected) option.setAttribute('selected', 'selected');
		if (id) option.setAttribute('data-id', id);
		option.setAttribute('data-hs-select-option', JSON.stringify(options));
		option.innerText = title;

		this.el.append(option);
	}

	private destroyOriginalOption(val: string) {
		const option = this.el.querySelector(`[value="${val}"]`);

		if (!option) return false;

		option.remove();
	}

	private buildTagsInputHelper() {
		this.tagsInputHelper = document.createElement('span');
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
		this.tagsInputHelper.style.visibility = 'hidden';
		this.tagsInputHelper.style.whiteSpace = 'pre';
		this.tagsInputHelper.style.position = 'absolute';

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
		const newWidth =
			this.tagsInputHelper.offsetWidth + inputPadding + inputBorder;
		const maxWidth =
			this.wrapper.offsetWidth -
			(parseInt(window.getComputedStyle(this.wrapper).paddingLeft) +
				parseInt(window.getComputedStyle(this.wrapper).paddingRight));

		(this.tagsInput as HTMLInputElement).style.width = `${Math.min(newWidth, maxWidth) + 2
			}px`;
	}

	private adjustInputWidth() {
		this.buildTagsInputHelper();
		this.calculateInputWidth();
	}

	private onSelectOption(val: string) {
		this.clearSelections();

		if (this.isMultiple) {
			this.value = this.value.includes(val)
				? Array.from(this.value).filter((el) => el !== val)
				: [...Array.from(this.value), val];

			this.selectMultipleItems();
			this.setNewValue();
		} else {
			this.value = val;

			this.selectSingleItem();
			this.setNewValue();
		}

		this.fireEvent('change', this.value);
		// TODO:: test with this line commented out
		// dispatch('change.hs.select', this.el, this.value);

		if (this.mode === 'tags') {
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
			if (this.toggle.querySelector('[data-icon]')) this.setToggleIcon();
			if (this.toggle.querySelector('[data-title]')) this.setToggleTitle();
			this.close(true);
		}

		if (!this.value.length && this.mode === 'tags')
			this.reassignTagsInputPlaceholder(this.placeholder);

		if (this.isOpened && this.mode === 'tags' && this.tagsInput)
			this.tagsInput.focus();

		this.triggerChangeEventForNativeSelect();
	}

	private triggerChangeEventForNativeSelect() {
		const selectChangeEvent = new Event('change', { bubbles: true });
		(this.el as HTMLSelectElement).dispatchEvent(selectChangeEvent);

		// TODO:: test with these lines added
		dispatch('change.hs.select', this.el, this.value);
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
		(this.tagsInput as HTMLInputElement).value = '';

		this.reassignTagsInputPlaceholder('');
		this.searchOptions('');
	}

	private clearSelections() {
		Array.from(this.dropdown.children).forEach((el) => {
			if (el.classList.contains('selected')) el.classList.remove('selected');
		});
		Array.from(this.el.children).forEach((el) => {
			if ((el as HTMLOptionElement).selected)
				(el as HTMLOptionElement).selected = false;
		});
	}

	private setNewValue() {
		if (this.mode === 'tags') {
			this.setTagsItems();
		} else {
			if (this.value?.length) {
				this.toggleTextWrapper.innerHTML = this.stringFromValue();
			} else {
				this.toggleTextWrapper.innerHTML = this.placeholder;
			}
		}
	}

	private stringFromValueBasic(options: ISingleOption[]) {
		const value: string[] = [];
		let title = '';

		options.forEach((el: ISingleOption) => {
			if (this.isMultiple) {
				if (this.value.includes(el.val)) value.push(el.title);
			} else {
				if (this.value === el.val) value.push(el.title);
			}
		});

		if (
			this.toggleCountText !== undefined &&
			this.toggleCountText !== null &&
			value.length >= this.toggleCountTextMinItems
		) {
			if (this.toggleCountTextMode === 'nItemsAndCount') {
				const nItems = value.slice(0, this.toggleCountTextMinItems - 1);
				const tempTitle = [nItems.join(this.toggleSeparators.items)];
				const count = `${value.length - nItems.length}`;

				if (this?.toggleSeparators?.betweenItemsAndCounter)
					tempTitle.push(this.toggleSeparators.betweenItemsAndCounter);
				if (this.toggleCountText) {
					switch (this.toggleCountTextPlacement) {
						case 'postfix-no-space':
							tempTitle.push(`${count}${this.toggleCountText}`);
							break;
						case 'prefix-no-space':
							tempTitle.push(`${this.toggleCountText}${count}`);
							break;
						case 'prefix':
							tempTitle.push(`${this.toggleCountText} ${count}`);
							break;
						default:
							tempTitle.push(`${count} ${this.toggleCountText}`);
							break;
					}
				}

				title = tempTitle.join(' ');
			} else {
				title = `${value.length} ${this.toggleCountText}`;
			}
		} else {
			title = value.join(this.toggleSeparators.items);
		}

		return title;
	}

	private stringFromValueRemoteData() {
		const options = this.dropdown.querySelectorAll('[data-title-value]');
		const value: string[] = [];
		let title = '';

		options.forEach((el: HTMLElement) => {
			const dataValue = el.getAttribute('data-value');
			const dataTitleValue = el.getAttribute('data-title-value');

			if (this.isMultiple) {
				if (this.value.includes(dataValue)) value.push(dataTitleValue);
			} else {
				if (this.value === dataValue) value.push(dataTitleValue);
			}
		});

		if (
			this.toggleCountText &&
			this.toggleCountText !== '' &&
			value.length >= this.toggleCountTextMinItems
		) {
			if (this.toggleCountTextMode === 'nItemsAndCount') {
				const nItems = value.slice(0, this.toggleCountTextMinItems - 1);

				title = `${nItems.join(this.toggleSeparators.items)} ${this.toggleSeparators.betweenItemsAndCounter} ${value.length - nItems.length} ${this.toggleCountText}`;
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
				this.value === (el as HTMLOptionElement).getAttribute('data-value'),
		);

		if (selectedItem) selectedItem.classList.add('selected');
	}

	private selectMultipleItems() {
		Array.from(this.dropdown.children)
			.filter((el) => this.value.includes(el.getAttribute('data-value')))
			.forEach((el) => el.classList.add('selected'));

		Array.from(this.el.children)
			.filter((el) => this.value.includes((el as HTMLOptionElement).value))
			.forEach((el) => ((el as HTMLOptionElement).selected = true));
	}

	private unselectMultipleItems() {
		Array.from(this.dropdown.children).forEach((el) =>
			el.classList.remove('selected'),
		);
		Array.from(this.el.children).forEach(
			(el) => ((el as HTMLOptionElement).selected = false),
		);
	}

	private searchOptions(val: string) {
		if (this.searchNoResult) {
			this.searchNoResult.remove();
			this.searchNoResult = null;
		}
		this.searchNoResult = htmlToElement(this.searchNoResultTemplate);
		this.searchNoResult.innerText = this.searchNoResultText;
		classToClassList(this.searchNoResultClasses, this.searchNoResult);

		const options = this.dropdown.querySelectorAll('[data-value]');
		let hasItems = false;
		let countLimit: number;
		if (this.searchLimit) countLimit = 0;

		options.forEach((el) => {
			const optionVal = el.getAttribute('data-title-value').toLocaleLowerCase();
			const regexSafeVal = val
				? val
					.split('')
					.map((char) => {
						return char.match(/\w/) ? `${char}[\\W_]*` : '\\W*';
					})
					.join('')
				: '';
			const regex = new RegExp(regexSafeVal, 'i');
			const directMatch = this.isSearchDirectMatch;
			const cleanedOptionVal = optionVal.trim();
			const condition = val
				? directMatch
					? !cleanedOptionVal.toLowerCase().includes(val.toLowerCase()) ||
					countLimit >= this.searchLimit
					: !regex.test(cleanedOptionVal) || countLimit >= this.searchLimit
				: !regex.test(cleanedOptionVal);

			if (condition) {
				el.classList.add('hidden');
			} else {
				el.classList.remove('hidden');
				hasItems = true;

				if (this.searchLimit) countLimit++;
			}
		});

		if (!hasItems) this.dropdown.append(this.searchNoResult);
	}

	private eraseToggleIcon() {
		const icon = this.toggle.querySelector('[data-icon]');

		if (icon) {
			icon.innerHTML = null;
			icon.classList.add('hidden');
		}
	}

	private eraseToggleTitle() {
		const title = this.toggle.querySelector('[data-title]');

		if (title) {
			title.innerHTML = this.placeholder;
		} else {
			this.toggleTextWrapper.innerHTML = this.placeholder;
		}
	}

	private toggleFn() {
		if (this.isOpened) this.close();
		else this.open();
	}

	// Public methods
	public destroy() {
		// Remove listeners
		if (this.wrapper)
			this.wrapper.removeEventListener('click', this.onWrapperClickListener);
		if (this.toggle)
			this.toggle.removeEventListener('click', this.onToggleClickListener);
		if (this.tagsInput) {
			this.tagsInput.removeEventListener(
				'focus',
				this.onTagsInputFocusListener,
			);
			this.tagsInput.removeEventListener(
				'input',
				this.onTagsInputInputListener,
			);
			this.tagsInput.removeEventListener(
				'input',
				this.onTagsInputInputSecondListener,
			);
			this.tagsInput.removeEventListener(
				'keydown',
				this.onTagsInputKeydownListener,
			);
		}

		if (this.search)
			this.search.removeEventListener('input', this.onSearchInputListener);

		const parent = this.el.parentElement.parentElement;

		this.el.classList.remove('hidden');
		this.el.style.display = '';
		parent.prepend(this.el);
		parent.querySelector('.hs-select').remove();
		this.wrapper = null;
	}

	public open() {
		const currentlyOpened =
			window?.$hsSelectCollection?.find((el) => el.element.isOpened) || null;

		if (currentlyOpened) currentlyOpened.element.close();
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

		if (this.dropdownScope === 'window')
			this.dropdown.classList.add('invisible');
		this.dropdown.classList.remove('hidden');

		this.recalculateDirection();

		setTimeout(() => {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'true';
			this.wrapper.classList.add('active');
			this.dropdown.classList.add('opened');
			if (
				this.dropdown.classList.contains('w-full') &&
				this.dropdownScope === 'window'
			)
				this.updateDropdownWidth();
			if (this.popperInstance && this.dropdownScope === 'window') {
				this.popperInstance.update();
				this.dropdown.classList.remove('invisible');
			}
			if (this.hasSearch && !this.preventSearchFocus) this.search.focus();

			this.animationInProcess = false;
		});

		this.isOpened = true;
	}

	public close(forceFocus = false) {
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = 'false';
		this.wrapper.classList.remove('active');
		this.dropdown.classList.remove('opened', 'bottom-full', 'top-full');
		if (this.dropdownDirectionClasses?.bottom)
			this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom);
		if (this.dropdownDirectionClasses?.top)
			this.dropdown.classList.remove(this.dropdownDirectionClasses.top);
		this.dropdown.style.marginTop = '';
		this.dropdown.style.marginBottom = '';

		afterTransition(this.dropdown, () => {
			this.dropdown.classList.add('hidden');
			if (this.hasSearch) {
				this.search.value = '';
				this.search.dispatchEvent(new Event('input', { bubbles: true }));
				this.search.blur();
			}

			if (forceFocus) this.toggle.focus();

			this.animationInProcess = false;
		});

		this.dropdown
			.querySelector('.hs-select-option-highlighted')
			?.classList.remove('hs-select-option-highlighted');
		this.isOpened = false;
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
	}

	public recalculateDirection() {
		if (this?.dropdownVerticalFixedPlacement && (this.dropdown.classList.contains('bottom-full') || this.dropdown.classList.contains('top-full'))) return false;

		if (this?.dropdownVerticalFixedPlacement === 'top') {
			this.dropdown.classList.add('bottom-full');
			this.dropdown.style.marginBottom = `${this.dropdownSpace}px`;
		} else if (this?.dropdownVerticalFixedPlacement === 'bottom') {
			this.dropdown.classList.add('top-full');
			this.dropdown.style.marginTop = `${this.dropdownSpace}px`;
		} else if (
			isEnoughSpace(
				this.dropdown,
				this.toggle || this.tagsInput,
				'bottom',
				this.dropdownSpace,
				this.viewport,
			)
		) {
			this.dropdown.classList.remove('bottom-full');
			if (this.dropdownDirectionClasses?.bottom)
				this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom);
			this.dropdown.style.marginBottom = '';
			this.dropdown.classList.add('top-full');
			if (this.dropdownDirectionClasses?.top)
				this.dropdown.classList.add(this.dropdownDirectionClasses.top);
			this.dropdown.style.marginTop = `${this.dropdownSpace}px`;
		} else {
			this.dropdown.classList.remove('top-full');
			if (this.dropdownDirectionClasses?.top)
				this.dropdown.classList.remove(this.dropdownDirectionClasses.top);
			this.dropdown.style.marginTop = '';
			this.dropdown.classList.add('bottom-full');
			if (this.dropdownDirectionClasses?.bottom)
				this.dropdown.classList.add(this.dropdownDirectionClasses.bottom);
			this.dropdown.style.marginBottom = `${this.dropdownSpace}px`;
		}
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsSelectCollection.find(
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
		if (!window.$hsSelectCollection) {
			window.$hsSelectCollection = [];

			window.addEventListener('click', (evt) => {
				const evtTarget = evt.target;

				HSSelect.closeCurrentlyOpened(evtTarget as HTMLElement);
			});

			document.addEventListener('keydown', (evt) =>
				HSSelect.accessibility(evt),
			);
		}

		if (window.$hsSelectCollection)
			window.$hsSelectCollection = window.$hsSelectCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('[data-hs-select]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsSelectCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const data = el.getAttribute('data-hs-select');
					const options: ISelectOptions = data ? JSON.parse(data) : {};

					new HSSelect(el, options);
				}
			});
	}

	static open(target: HTMLElement | string) {
		const elInCollection = window.$hsSelectCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection && !elInCollection.element.isOpened)
			elInCollection.element.open();
	}

	static close(target: HTMLElement | string) {
		const elInCollection = window.$hsSelectCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		if (elInCollection && elInCollection.element.isOpened) {
			elInCollection.element.close();
		}
	}

	static closeCurrentlyOpened(evtTarget: HTMLElement | null = null) {
		if (
			!evtTarget.closest('.hs-select.active') &&
			!evtTarget.closest('[data-hs-select-dropdown].opened')
		) {
			const currentlyOpened =
				window.$hsSelectCollection.filter((el) => el.element.isOpened) || null;

			if (currentlyOpened) {
				currentlyOpened.forEach((el) => {
					el.element.close();
				});
			}
		}
	}

	// Accessibility methods
	static accessibility(evt: KeyboardEvent) {
		const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

		if (
			target &&
			SELECT_ACCESSIBILITY_KEY_SET.includes(evt.code) &&
			!evt.metaKey
		) {
			switch (evt.code) {
				case 'Escape':
					evt.preventDefault();
					this.onEscape();
					break;
				case 'ArrowUp':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow();
					break;
				case 'ArrowDown':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow(false);
					break;
				case 'Tab':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onTab(evt.shiftKey);
					break;
				case 'Home':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd();
					break;
				case 'End':
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd(false);
					break;
				case 'Enter':
					evt.preventDefault();
					this.onEnter(evt);
					break;
				case 'Space':
					evt.preventDefault();
					this.onEnter(evt);
					break;
				default:
					break;
			}
		}
	}

	static onEscape() {
		const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

		if (target) target.element.close();
	}

	static onArrow(isArrowUp = true) {
		const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

		if (target) {
			const dropdown = target.element.dropdown;

			if (!dropdown) return false;

			const preparedOptions = isArrowUp
				? Array.from(
					dropdown.querySelectorAll(':scope > *:not(.hidden)'),
				).reverse()
				: Array.from(dropdown.querySelectorAll(':scope > *:not(.hidden)'));
			const options = preparedOptions.filter(
				(el: any) => !el.classList.contains('disabled'),
			);
			const current =
				dropdown.querySelector('.hs-select-option-highlighted') ||
				dropdown.querySelector('.selected');
			if (!current) options[0].classList.add('hs-select-option-highlighted');
			let currentInd = options.findIndex((el: any) => el === current);

			if (currentInd + 1 < options.length) {
				currentInd++;
			}

			(options[currentInd] as HTMLButtonElement).focus();
			if (current) current.classList.remove('hs-select-option-highlighted');
			options[currentInd].classList.add('hs-select-option-highlighted');
		}
	}

	static onTab(isArrowUp = true) {
		const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

		if (target) {
			const dropdown = target.element.dropdown;

			if (!dropdown) return false;

			const preparedOptions = isArrowUp
				? Array.from(
					dropdown.querySelectorAll(':scope >  *:not(.hidden)'),
				).reverse()
				: Array.from(dropdown.querySelectorAll(':scope >  *:not(.hidden)'));
			const options = preparedOptions.filter(
				(el: any) => !el.classList.contains('disabled'),
			);
			const current =
				dropdown.querySelector('.hs-select-option-highlighted') ||
				dropdown.querySelector('.selected');
			if (!current) options[0].classList.add('hs-select-option-highlighted');
			let currentInd = options.findIndex((el: any) => el === current);

			if (currentInd + 1 < options.length) {
				currentInd++;
			} else {
				if (current) current.classList.remove('hs-select-option-highlighted');
				target.element.close();
				target.element.toggle.focus();

				return false;
			}

			(options[currentInd] as HTMLButtonElement).focus();
			if (current) current.classList.remove('hs-select-option-highlighted');
			options[currentInd].classList.add('hs-select-option-highlighted');
		}
	}

	static onStartEnd(isStart = true) {
		const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

		if (target) {
			const dropdown = target.element.dropdown;

			if (!dropdown) return false;

			const preparedOptions = isStart
				? Array.from(dropdown.querySelectorAll(':scope >  *:not(.hidden)'))
				: Array.from(
					dropdown.querySelectorAll(':scope >  *:not(.hidden)'),
				).reverse();
			const options = preparedOptions.filter(
				(el: any) => !el.classList.contains('disabled'),
			);
			const current = dropdown.querySelector('.hs-select-option-highlighted');

			if (options.length) {
				(options[0] as HTMLButtonElement).focus();
				if (current) current.classList.remove('hs-select-option-highlighted');
				options[0].classList.add('hs-select-option-highlighted');
			}
		}
	}

	static onEnter(evt: Event) {
		const select = (evt.target as HTMLElement).previousSibling;

		if (window.$hsSelectCollection.find((el) => el.element.el === select)) {
			const opened = window.$hsSelectCollection.find(
				(el) => el.element.isOpened,
			);
			const target = window.$hsSelectCollection.find(
				(el) => el.element.el === select,
			);

			opened.element.close();
			target.element.open();
		} else {
			const target = window.$hsSelectCollection.find(
				(el) => el.element.isOpened,
			);

			if (target)
				target.element.onSelectOption(
					(evt.target as HTMLElement).dataset.value || '',
				);
		}
	}
}

declare global {
	interface Window {
		HSSelect: Function;
		$hsSelectCollection: ICollectionItem<HSSelect>[];
	}
}

window.addEventListener('load', () => {
	HSSelect.autoInit();

	// Uncomment for debug
	// console.log('Select collection:', window.$hsSelectCollection);
});

document.addEventListener('scroll', () => {
	if (!window.$hsSelectCollection) return false;

	const target = window.$hsSelectCollection.find((el) => el.element.isOpened);

	if (target) target.element.recalculateDirection();
});

if (typeof window !== 'undefined') {
	window.HSSelect = HSSelect;
}

export default HSSelect;
