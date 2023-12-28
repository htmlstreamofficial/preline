/*
 * HSSelect
 * @version: 2.0.3
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
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
} from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

import { SELECT_ACCESSIBILITY_KEY_SET } from '../../constants';

class HSSelect extends HSBasePlugin<ISelectOptions> implements ISelect {
	value: string | string[] | null;
	private readonly placeholder: string | null;
	private readonly hasSearch: boolean;
	private readonly mode: string | null;
	private readonly viewport: HTMLElement | null;

	isOpened: boolean | null;
	isMultiple: boolean | null;
	isDisabled: boolean | null;

	private readonly toggleTag: string | null;
	private readonly toggleClasses: string | null;
	private readonly toggleCountText: string | null;
	private readonly toggleCountTextMinItems: number | null;
	private readonly tagsClasses: string | null;
	private readonly tagsItemTemplate: string | null;
	private readonly tagsItemClasses: string | null;
	private readonly tagsInputClasses: string | null;
	private readonly dropdownTag: string | null;
	private readonly dropdownClasses: string | null;
	private readonly dropdownDirectionClasses: {
		top?: string;
		bottom?: string;
	} | null;
	public dropdownSpace: number | null;
	private readonly searchWrapperTemplate: string | null;
	private readonly searchPlaceholder: string | null;
	private readonly searchClasses: string | null;
	private readonly searchWrapperClasses: string | null;
	private searchNoResultText: string | null;
	private searchNoResultClasses: string | null;
	private readonly optionTag: string | null;
	private readonly optionTemplate: string | null;
	private readonly optionClasses: string | null;
	private readonly descriptionClasses: string | null;
	private readonly iconClasses: string | null;

	private animationInProcess: boolean;

	private wrapper: HTMLElement | null;
	private toggle: HTMLElement | null;
	private toggleTextWrapper: HTMLElement | null;
	private tags: HTMLElement | null;
	private tagsItems: HTMLElement | null;
	private tagsInput: HTMLElement | null;
	private dropdown: HTMLElement | null;
	private searchWrapper: HTMLElement | null;
	private search: HTMLInputElement | null;
	private searchNoResult: HTMLElement | null;
	private selectOptions: ISingleOption[] | [];

	private readonly isAddTagOnEnter: boolean;

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
		this.mode = concatOptions?.mode || 'default';
		this.viewport =
			typeof concatOptions?.viewport !== 'undefined'
				? document.querySelector(concatOptions?.viewport)
				: null;
		this.isOpened = Boolean(concatOptions?.isOpened) || false;
		this.isMultiple = this.el.hasAttribute('multiple') || false;
		this.isDisabled = this.el.hasAttribute('disabled') || false;
		this.toggleTag = concatOptions?.toggleTag || null;
		this.toggleClasses = concatOptions?.toggleClasses || null;
		this.toggleCountText = concatOptions?.toggleCountText || null;
		this.toggleCountTextMinItems = concatOptions?.toggleCountTextMinItems || 1;
		this.tagsClasses = concatOptions?.tagsClasses || null;
		this.tagsItemTemplate = concatOptions?.tagsItemTemplate || null;
		this.tagsItemClasses = concatOptions?.tagsItemClasses || null;
		this.tagsInputClasses = concatOptions?.tagsInputClasses || null;
		this.dropdownTag = concatOptions?.dropdownTag || null;
		this.dropdownClasses = concatOptions?.dropdownClasses || null;
		this.dropdownDirectionClasses =
			concatOptions?.dropdownDirectionClasses || null;
		this.dropdownSpace = concatOptions?.dropdownSpace || 10;
		this.searchWrapperTemplate = concatOptions?.searchWrapperTemplate || null;
		this.searchWrapperClasses =
			concatOptions?.searchWrapperClasses || 'bg-white p-2 sticky top-0';
		this.searchClasses =
			concatOptions?.searchClasses ||
			'block w-[calc(100%-2rem)] text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 py-2 px-3 my-2 mx-4';
		this.searchPlaceholder = concatOptions?.searchPlaceholder || 'Search...';
		this.searchNoResultText =
			concatOptions?.searchNoResultText || 'No options found...';
		this.searchNoResultClasses =
			concatOptions?.searchNoResultClasses || 'px-4 text-sm';
		this.optionTemplate = concatOptions?.optionTemplate || null;
		this.optionTag = concatOptions?.optionTag || null;
		this.optionClasses = concatOptions?.optionClasses || null;
		this.descriptionClasses = concatOptions?.descriptionClasses || null;
		this.iconClasses = concatOptions?.iconClasses || null;
		this.isAddTagOnEnter = concatOptions?.isAddTagOnEnter ?? true;

		this.animationInProcess = false;
		this.selectOptions = [];

		this.init();
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
							options: data !== 'undefined' ? JSON.parse(data) : null,
						},
					];
				});
		}

		if (this.isMultiple) {
			const selectedOptions = Array.from(
				(this.el as HTMLSelectElement).options,
			).filter((el) => el.selected);

			if (selectedOptions) {
				const values: string[] = [];

				selectedOptions.forEach((el) => {
					values.push(el.value);
				});

				this.value = values;
			}
		}

		this.buildWrapper();
		if (this.mode === 'tags') this.buildTags();
		else this.buildToggle();
		this.buildDropdown();
	}

	private buildWrapper() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('hs-select', 'relative');

		this.el.before(this.wrapper);

		this.wrapper.append(this.el);
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

		this.toggle.addEventListener('click', () => {
			if (this.isDisabled) return false;

			if (this.isOpened) this.close();
			else this.open();
		});
	}

	private setToggleIcon() {
		const icon = this.toggle.querySelector('[data-icon]');
		icon.innerHTML = '';

		if (icon) {
			const img = htmlToElement(
				this.getItemByValue(this.value as string)?.options?.icon || '',
			);
			icon.append(img);

			if (!img) icon.classList.add('hidden');
			else icon.classList.remove('hidden');
		}
	}

	private setToggleTitle() {
		const title = this.toggle.querySelector('[data-title]');
		title.classList.add('truncate');
		title.innerHTML = '';

		if (title) {
			const titleText =
				this.getItemByValue(this.value as string)?.title || this.placeholder;
			title.innerHTML = titleText;

			this.toggle.append(title);
		}
	}

	private buildTags() {
		this.tags = document.createElement('div');
		this.tags.classList.add('flex');
		if (this.tagsClasses) classToClassList(this.tagsClasses, this.tags);

		this.buildTagsInput();
		this.buildTagsItems();
		this.setTagsItems();

		if (this.wrapper) this.wrapper.append(this.tags);
	}

	private buildTagsItems() {
		this.tagsItems = document.createElement('div');
		this.tagsItems.classList.add('flex', 'flex-wrap', 'flex-0', 'items-center');

		this.setTagsItems();

		this.tags.append(this.tagsItems);
	}

	private buildTagsItem(val: string) {
		const item = this.getItemByValue(val);

		let template, title, remove, icon: null | HTMLElement;

		const newItem = document.createElement('div');
		if (this.tagsItemClasses) classToClassList(this.tagsItemClasses, newItem);

		if (this.tagsItemTemplate) {
			template = htmlToElement(this.tagsItemTemplate);

			newItem.append(template);
		}

		// Icon
		if (item?.options?.icon) {
			const img = htmlToElement(item?.options?.icon);
			icon = template
				? template.querySelector('[data-icon]')
				: document.createElement('span');

			icon.append(img);

			if (!template) newItem.append(icon);
		}
		if (
			template &&
			template.querySelector('[data-icon]') &&
			!item?.options?.icon
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

			this.unselectMultipleItems();
			this.setTagsItems();
			this.selectMultipleItems();
		});

		this.tagsItems.append(newItem);
	}

	private getItemByValue(val: string) {
		return this.selectOptions.find((el: ISingleOption) => el.val === val);
	}

	private setTagsItems() {
		this.tagsItems.innerHTML = '';

		if (this.value) {
			(this.value as string[]).forEach((val) => {
				this.buildTagsItem(val);
			});

			(this.tagsInput as HTMLInputElement).readOnly = true;
		}

		if (!this.value.length) {
			(this.tagsInput as HTMLInputElement).placeholder = this.placeholder;
			(this.tagsInput as HTMLInputElement).readOnly = false;
		}
	}

	private buildTagsInput() {
		this.tagsInput = document.createElement('input');
		(this.tagsInput as HTMLInputElement).placeholder = this.placeholder;

		if (this.tagsInputClasses)
			classToClassList(this.tagsInputClasses, this.tagsInput);

		this.tagsInput.addEventListener('focus', () => this.open());
		this.tagsInput.addEventListener(
			'input',
			debounce((evt: InputEvent) =>
				this.searchOptions((evt.target as HTMLInputElement).value),
			),
		);
		this.tagsInput.addEventListener('keydown', (evt) => {
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
				this.close();
			}
		});

		this.tags.append(this.tagsInput);
	}

	private buildDropdown() {
		this.dropdown = htmlToElement(this.dropdownTag || '<div></div>');

		this.dropdown.classList.add('absolute', 'top-full');
		if (!this.isOpened) this.dropdown.classList.add('hidden');

		if (this.dropdownClasses)
			classToClassList(this.dropdownClasses, this.dropdown);
		if (this.wrapper) this.wrapper.append(this.dropdown);
		if (this.dropdown && this.hasSearch) this.buildSearch();
		if (this.selectOptions)
			this.selectOptions.forEach((props: ISingleOption, i) =>
				this.buildOption(props.title, props.val, props.options, `${i}`),
			);
	}

	private buildSearch() {
		let input;
		this.searchWrapper = htmlToElement(
			this.searchWrapperTemplate || '<div></div>',
		);
		if (this.searchWrapperClasses)
			classToClassList(this.searchWrapperClasses, this.searchWrapper);
		input = this.searchWrapper.querySelector('[data-input]');

		this.search = htmlToElement('<input type="text" />') as HTMLInputElement;
		this.search.placeholder = this.searchPlaceholder;
		if (this.searchClasses) classToClassList(this.searchClasses, this.search);

		this.search.addEventListener(
			'input',
			debounce((evt: InputEvent) =>
				this.searchOptions((evt.target as HTMLInputElement).value),
			),
		);

		if (input) input.append(this.search);
		else this.searchWrapper.append(this.search);

		this.dropdown.append(this.searchWrapper);
	}

	private buildOption(
		title: string,
		val: string,
		options?: ISingleOptionOptions,
		index: string = '1',
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
				const img = htmlToElement(options.icon);
				img.classList.add('mw-full');

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

		option.addEventListener('click', () => this.onSelectOption(val));

		if (this.optionClasses) classToClassList(this.optionClasses, option);
		if (this.dropdown) this.dropdown.append(option);
	}

	private destroyOption(val: string) {
		const option = this.dropdown.querySelector(`[data-value="${val}"]`);

		if (!option) return false;

		option.remove();
	}

	private buildOriginalOption(
		title: string,
		val: string,
		options?: ISingleOptionOptions,
	) {
		const option = htmlToElement('<option></option>');
		option.setAttribute('value', val);
		option.setAttribute('data-hs-select-option', JSON.stringify(options));
		option.innerText = title;

		this.el.append(option);
	}

	private destroyOriginalOption(val: string) {
		const option = this.el.querySelector(`[value="${val}"]`);

		if (!option) return false;

		option.remove();
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
		dispatch('change.hs.select', this.el, this.value);

		if (this.mode === 'tags') this.resetTagsInputField();

		if (!this.isMultiple) {
			if (this.toggle.querySelector('[data-icon]')) this.setToggleIcon();
			if (this.toggle.querySelector('[data-title]')) this.setToggleTitle();
			this.close();
		}

		if (!this.value.length && this.mode === 'tags')
			(this.tagsInput as HTMLInputElement).placeholder = this.placeholder;
	}

	private addSelectOption(
		title: string,
		val: string,
		options?: ISingleOptionOptions,
	) {
		this.selectOptions = [
			...this.selectOptions,
			{
				title,
				val,
				options,
			},
		];
	}

	private removeSelectOption(val: string) {
		const hasOption = !!this.selectOptions.some((el: ISingleOption) => el.val === val);

		if (!hasOption) return false;

		this.selectOptions = this.selectOptions.filter((el: ISingleOption) => el.val !== val);
	}

	private resetTagsInputField() {
		(this.tagsInput as HTMLInputElement).value = '';
		(this.tagsInput as HTMLInputElement).placeholder = '';
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
			if (this.value.length)
				this.toggleTextWrapper.innerHTML = this.stringFromValue();
			else this.toggleTextWrapper.innerHTML = this.placeholder;
		}
	}

	private stringFromValue() {
		const value: string[] = [];

		this.selectOptions.forEach((el: ISingleOption) => {
			if (this.isMultiple) {
				if (this.value.includes(el.val)) value.push(el.title);
			} else {
				if (this.value === el.val) value.push(el.title);
			}
		});

		return this.toggleCountText &&
			this.toggleCountText !== '' &&
			value.length >= this.toggleCountTextMinItems
			? `${value.length} ${this.toggleCountText}`
			: value.join(', ');
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
		selectedItem.classList.add('selected');
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
		this.searchNoResult = htmlToElement('<span></span>');
		this.searchNoResult.innerText = this.searchNoResultText;
		classToClassList(this.searchNoResultClasses, this.searchNoResult);

		const options = this.dropdown.querySelectorAll('[data-value]');
		let hasItems = false;

		options.forEach((el) => {
			const optionVal = el.getAttribute('data-title-value').toLowerCase();

			if (!optionVal.includes(val.toLowerCase())) el.classList.add('hidden');
			else {
				el.classList.remove('hidden');
				hasItems = true;
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

	// Public methods
	public destroy() {
		const parent = this.el.parentElement.parentElement;

		this.el.classList.remove('hidden');
		this.el.style.display = '';
		parent.prepend(this.el);
		parent.querySelector('.hs-select').remove();
		this.wrapper = null;
	}

	public open() {
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

		this.dropdown.classList.remove('hidden');

		this.recalculateDirection();

		setTimeout(() => {
			this.wrapper.classList.add('active');
			this.dropdown.classList.add('opened');
			if (this.hasSearch) this.search.focus();

			this.animationInProcess = false;
		});

		this.isOpened = true;
	}

	public close() {
		if (this.animationInProcess) return false;

		this.animationInProcess = true;

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
			const { title, val, options } = option;
			const hasOption = !!this.selectOptions.some((el: ISingleOption) => el.val === val);

			if (!hasOption) {
				this.addSelectOption(title, val, options);
				this.buildOption(title, val, options, i);
				this.buildOriginalOption(title, val, options);
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
		const removeOption = (val: string) => {
			const hasOption = !!this.selectOptions.some((el: ISingleOption) => el.val === val);

			if (hasOption) {
				this.removeSelectOption(val);
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
				removeOption(val);
			});
		} else {
			removeOption(values);
		}
	}

	public recalculateDirection() {
		if (
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
		if (!window.$hsSelectCollection) window.$hsSelectCollection = [];

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

		if (window.$hsSelectCollection) {
			window.addEventListener('click', (evt) => {
				const evtTarget = evt.target;

				HSSelect.closeCurrentlyOpened(evtTarget as HTMLElement);
			});

			document.addEventListener('keydown', (evt) =>
				HSSelect.accessibility(evt),
			);
		}
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
		if (!evtTarget.closest('.hs-select.active')) {
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
			console.log(target);

			console.log('Key code:', evt.code);

			switch (evt.code) {
				case 'Escape':
					evt.preventDefault();
					this.onEscape();
					break;
				case 'ArrowUp':
					evt.preventDefault();
					this.onArrow();
					break;
				case 'ArrowDown':
					evt.preventDefault();
					this.onArrow(false);
					break;
				case 'Tab':
					evt.preventDefault();
					this.onTab(evt.shiftKey);
					break;
				case 'Home':
					evt.preventDefault();
					this.onStartEnd();
					break;
				case 'End':
					evt.preventDefault();
					this.onStartEnd(false);
					break;
				case 'Enter':
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
			const current = dropdown.querySelector('.hs-select-option-highlighted');
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
			const current = dropdown.querySelector('.hs-select-option-highlighted');
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
