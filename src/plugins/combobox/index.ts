/*
 * HSComboBox
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	afterTransition,
	debounce,
	dispatch,
	htmlToElement,
	isEnoughSpace,
	isParentOrElementHidden,
} from "../../utils";

import { IComboBox, IComboBoxItemAttr, IComboBoxOptions } from "./interfaces";

import HSBasePlugin from "../base-plugin";
import { ICollectionItem } from "../../interfaces";

import { COMBO_BOX_ACCESSIBILITY_KEY_SET } from "../../constants";

class HSComboBox extends HSBasePlugin<IComboBoxOptions> implements IComboBox {
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
	preventClientFiltering: boolean;
	isOpenOnFocus: boolean;

	private readonly input: HTMLInputElement | null;
	private readonly output: HTMLElement | null;
	private readonly itemsWrapper: HTMLElement | null;
	private items: HTMLElement[] | [];
	private tabs: HTMLElement[] | [];
	private readonly toggle: HTMLElement | null;
	private readonly toggleClose: HTMLElement | null;
	private readonly toggleOpen: HTMLElement | null;
	private outputPlaceholder: HTMLElement | null;
	private outputLoader: HTMLElement | null;

	private value: string | null;
	private selected: string | null;
	private currentData: {} | {}[] | null;
	private groups: any[] | null;
	private selectedGroup: string | null;

	isOpened: boolean;
	isCurrent: boolean;
	private animationInProcess: boolean;
	private isSearchLengthExceeded = false;

	private onInputFocusListener: () => void;
	private onInputInputListener: (evt: InputEvent) => void;
	private onToggleClickListener: () => void;
	private onToggleCloseClickListener: () => void;
	private onToggleOpenClickListener: () => void;

	constructor(el: HTMLElement, options?: IComboBoxOptions, events?: {}) {
		super(el, options, events);

		// Data parameters
		const data = el.getAttribute("data-hs-combo-box");
		const dataOptions: IComboBoxOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.gap = 5;
		this.viewport =
			(typeof concatOptions?.viewport === "string"
				? (document.querySelector(concatOptions?.viewport) as HTMLElement)
				: concatOptions?.viewport) ?? null;
		this.preventVisibility = concatOptions?.preventVisibility ?? false;
		this.minSearchLength = concatOptions?.minSearchLength ?? 0;
		this.apiUrl = concatOptions?.apiUrl ?? null;
		this.apiDataPart = concatOptions?.apiDataPart ?? null;
		this.apiQuery = concatOptions?.apiQuery ?? null;
		this.apiSearchQuery = concatOptions?.apiSearchQuery ?? null;
		this.apiSearchPath = concatOptions?.apiSearchPath ?? null;
		this.apiSearchDefaultPath = concatOptions?.apiSearchDefaultPath ?? null;
		this.apiHeaders = concatOptions?.apiHeaders ?? {};
		this.apiGroupField = concatOptions?.apiGroupField ?? null;
		this.outputItemTemplate = concatOptions?.outputItemTemplate ??
			`<div class="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" data-hs-combo-box-output-item>
				<div class="flex justify-between items-center w-full">
					<span data-hs-combo-box-search-text></span>
					<span class="hidden hs-combo-box-selected:block">
						<svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</span>
				</div>
			</div>`;
		this.outputEmptyTemplate = concatOptions?.outputEmptyTemplate ??
			`<div class="py-2 px-4 w-full text-sm text-gray-800 rounded-lg dark:bg-neutral-900 dark:text-neutral-200">Nothing found...</div>`;
		this.outputLoaderTemplate = concatOptions?.outputLoaderTemplate ??
			`<div class="flex justify-center items-center py-2 px-4 text-sm text-gray-800 rounded-lg bg-white dark:bg-neutral-900 dark:text-neutral-200">
				<div class="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
					<span class="sr-only">Loading...</span>
				</div>
			</div>`;
		this.groupingType = concatOptions?.groupingType ?? null;
		this.groupingTitleTemplate = concatOptions?.groupingTitleTemplate ??
			(this.groupingType === "default"
				? `<div class="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500"></div>`
				: `<button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold whitespace-nowrap rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"></button>`);
		this.tabsWrapperTemplate = concatOptions?.tabsWrapperTemplate ??
			`<div class="overflow-x-auto p-4"></div>`;
		this.preventSelection = concatOptions?.preventSelection ?? false;
		this.preventAutoPosition = concatOptions?.preventAutoPosition ?? false;
		this.preventClientFiltering = options?.preventClientFiltering ?? (!!concatOptions?.apiSearchQuery || !!concatOptions?.apiSearchPath);
		this.isOpenOnFocus = concatOptions?.isOpenOnFocus ?? false;

		// Internal parameters
		this.input = this.el.querySelector("[data-hs-combo-box-input]") ?? null;
		this.output = this.el.querySelector("[data-hs-combo-box-output]") ?? null;
		this.itemsWrapper =
			this.el.querySelector("[data-hs-combo-box-output-items-wrapper]") ?? null;
		this.items =
			Array.from(this.el.querySelectorAll("[data-hs-combo-box-output-item]")) ??
				[];
		this.tabs = [];
		this.toggle = this.el.querySelector("[data-hs-combo-box-toggle]") ?? null;
		this.toggleClose = this.el.querySelector("[data-hs-combo-box-close]") ??
			null;
		this.toggleOpen = this.el.querySelector("[data-hs-combo-box-open]") ?? null;
		this.outputPlaceholder = null;

		this.selected =
			this.value =
				(this.el.querySelector("[data-hs-combo-box-input]") as HTMLInputElement)
					.value ?? "";
		this.currentData = null;
		this.isOpened = false;
		this.isCurrent = false;
		this.animationInProcess = false;
		this.selectedGroup = "all";

		this.init();
	}

	private inputFocus() {
		if (!this.isOpened) {
			this.setResultAndRender();
			this.open();
		}
	}

	private inputInput(evt: InputEvent) {
		const val = (evt.target as HTMLInputElement).value.trim();

		if (val.length <= this.minSearchLength) this.setResultAndRender("");
		else this.setResultAndRender(val);

		if (this.input.value !== "") this.el.classList.add("has-value");
		else this.el.classList.remove("has-value");

		if (!this.isOpened) this.open();
	}

	private toggleClick() {
		if (this.isOpened) this.close();
		else this.open(this.toggle.getAttribute("data-hs-combo-box-toggle"));
	}

	private toggleCloseClick() {
		this.close();
	}

	private toggleOpenClick() {
		this.open();
	}

	private init() {
		this.createCollection(window.$hsComboBoxCollection, this);

		this.build();
	}

	private build() {
		this.buildInput();
		if (this.groupingType) this.setGroups();
		this.buildItems();
		if (this.preventVisibility) {
			// TODO:: test the plugin while the line below is commented.
			// this.isOpened = true;

			if (!this.preventAutoPosition) this.recalculateDirection();
		}
		if (this.toggle) this.buildToggle();
		if (this.toggleClose) this.buildToggleClose();
		if (this.toggleOpen) this.buildToggleOpen();
	}

	private getNestedProperty<T>(obj: T, path: string): any {
		return path.split(".").reduce(
			(acc: any, key: string) => acc && acc[key],
			obj,
		);
	}

	private setValue(val: string, data: {} | null = null) {
		this.selected = val;
		this.value = val;
		this.input.value = val;

		if (data) this.currentData = data;

		this.fireEvent("select", this.currentData);
		dispatch("select.hs.combobox", this.el, this.currentData);
	}

	private setValueAndOpen(val: string) {
		this.value = val;

		if (this.items.length) {
			this.setItemsVisibility();
		}
	}

	private setValueAndClear(val: string | null, data: {} | null = null) {
		if (val) this.setValue(val, data);
		else this.setValue(this.selected, data);

		if (this.outputPlaceholder) this.destroyOutputPlaceholder();
	}

	private setSelectedByValue(val: string[]) {
		this.items.forEach((el) => {
			const valueElement = el.querySelector("[data-hs-combo-box-value]");

			if (valueElement && val.includes(valueElement.textContent)) {
				(el as HTMLElement).classList.add("selected");
			} else {
				(el as HTMLElement).classList.remove("selected");
			}
		});
	}

	private setResultAndRender(value = "") {
		// TODO:: test the plugin with below code added.
		let _value = this.preventVisibility ? this.input.value : value;

		this.setResults(_value);

		if (
			this.apiSearchQuery || this.apiSearchPath || this.apiSearchDefaultPath
		) this.itemsFromJson();

		if (_value === "") this.isSearchLengthExceeded = true;
		else this.isSearchLengthExceeded = false;
	}

	private setResults(val: string) {
		this.value = val;

		this.resultItems();

		if (this.hasVisibleItems()) this.destroyOutputPlaceholder();
		else this.buildOutputPlaceholder();
	}

	private setGroups() {
		const groups: any[] = [];

		this.items.forEach((item: HTMLElement) => {
			const { group } = JSON.parse(
				item.getAttribute("data-hs-combo-box-output-item"),
			);

			if (!groups.some((el) => el?.name === group.name)) {
				groups.push(group);
			}
		});

		this.groups = groups;
	}

	private setApiGroups(items: any) {
		const groups: any[] = [];

		items.forEach((item: any) => {
			const group = item[this.apiGroupField];

			if (!groups.some((el) => el.name === group)) {
				groups.push({
					name: group,
					title: group,
				});
			}
		});

		this.groups = groups;
	}

	private setItemsVisibility() {
		if (this.preventClientFiltering) {
			this.items.forEach((el) => {
				(el as HTMLElement).style.display = "";
			});

			return false;
		}

		if (this.groupingType === "tabs" && this.selectedGroup !== "all") {
			this.items.forEach((item) => {
				(item as HTMLElement).style.display = "none";
			});
		}

		const items = this.groupingType === "tabs"
			? this.selectedGroup === "all"
				? this.items
				: this.items.filter((f: HTMLElement) => {
					const { group } = JSON.parse(
						f.getAttribute("data-hs-combo-box-output-item"),
					);

					return group.name === this.selectedGroup;
				})
			: this.items;

		if (this.groupingType === "tabs" && this.selectedGroup !== "all") {
			items.forEach((item) => {
				(item as HTMLElement).style.display = "block";
			});
		}

		items.forEach((item) => {
			if (!this.isTextExistsAny(item, this.value)) {
				(item as HTMLElement).style.display = "none";
			} else (item as HTMLElement).style.display = "block";
		});

		if (this.groupingType === "default") {
			this.output
				.querySelectorAll("[data-hs-combo-box-group-title]")
				.forEach((el: HTMLElement) => {
					const g = el.getAttribute("data-hs-combo-box-group-title");
					const items = this.items.filter((f: HTMLElement) => {
						const { group } = JSON.parse(
							f.getAttribute("data-hs-combo-box-output-item"),
						);

						return group.name === g && f.style.display === "block";
					});

					if (items.length) el.style.display = "block";
					else el.style.display = "none";
				});
		}
	}

	private isTextExistsAny(el: HTMLElement, val: string): boolean {
		return Array.from(
			el.querySelectorAll("[data-hs-combo-box-search-text]"),
		).some((elI: HTMLElement) =>
			elI
				.getAttribute("data-hs-combo-box-search-text")
				.toLowerCase()
				.includes(val.toLowerCase())
		);
	}

	private hasVisibleItems() {
		return this.items.length
			? this.items.some((el: HTMLElement) => el.style.display === "block")
			: false;
	}

	private valuesBySelector(el: HTMLElement) {
		return Array.from(
			el.querySelectorAll("[data-hs-combo-box-search-text]"),
		).reduce(
			(acc: any, cur: HTMLElement) => [
				...acc,
				cur.getAttribute("data-hs-combo-box-search-text"),
			],
			[],
		);
	}

	private sortItems() {
		const compareFn = (i1: HTMLElement, i2: HTMLElement) => {
			const a = i1.querySelector("[data-hs-combo-box-value]").textContent;
			const b = i2.querySelector("[data-hs-combo-box-value]").textContent;

			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}

			return 0;
		};

		return this.items.sort(compareFn);
	}

	private buildInput() {
		if (this.isOpenOnFocus) {
			this.onInputFocusListener = () => this.inputFocus();

			this.input.addEventListener("focus", this.onInputFocusListener);
		}

		this.onInputInputListener = debounce((evt: InputEvent) =>
			this.inputInput(evt)
		);

		this.input.addEventListener("input", this.onInputInputListener);
	}

	private async buildItems() {
		this.output.role = "listbox";
		this.output.tabIndex = -1;
		this.output.ariaOrientation = "vertical";

		if (this.apiUrl) await this.itemsFromJson();
		else {
			if (this.itemsWrapper) this.itemsWrapper.innerHTML = "";
			else this.output.innerHTML = "";
			this.itemsFromHtml();
		}

		if (this?.items.length && this.items[0].classList.contains("selected")) {
			this.currentData = JSON.parse(
				this.items[0].getAttribute("data-hs-combo-box-item-stored-data"),
			);
		}
	}

	private buildOutputLoader() {
		if (this.outputLoader) return false;

		this.outputLoader = htmlToElement(this.outputLoaderTemplate);
		if (this.items.length || this.outputPlaceholder) {
			this.outputLoader.style.position = "absolute";
			this.outputLoader.style.top = "0";
			this.outputLoader.style.bottom = "0";
			this.outputLoader.style.left = "0";
			this.outputLoader.style.right = "0";
			this.outputLoader.style.zIndex = "2";
		} else {
			this.outputLoader.style.position = "";
			this.outputLoader.style.top = "";
			this.outputLoader.style.bottom = "";
			this.outputLoader.style.left = "";
			this.outputLoader.style.right = "";
			this.outputLoader.style.zIndex = "";
			this.outputLoader.style.height = "30px";
		}

		this.output.append(this.outputLoader);
	}

	private buildToggle() {
		if (this.isOpened) {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "true";
			if (this?.input?.ariaExpanded) this.input.ariaExpanded = "true";
		} else {
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "false";
			if (this?.input?.ariaExpanded) this.input.ariaExpanded = "false";
		}

		this.onToggleClickListener = () => this.toggleClick();

		this.toggle.addEventListener("click", this.onToggleClickListener);
	}

	private buildToggleClose() {
		this.onToggleCloseClickListener = () => this.toggleCloseClick();

		this.toggleClose.addEventListener("click", this.onToggleCloseClickListener);
	}

	private buildToggleOpen() {
		this.onToggleOpenClickListener = () => this.toggleOpenClick();

		this.toggleOpen.addEventListener("click", this.onToggleOpenClickListener);
	}

	private buildOutputPlaceholder() {
		if (!this.outputPlaceholder) {
			this.outputPlaceholder = htmlToElement(this.outputEmptyTemplate);
		}

		this.appendItemsToWrapper(this.outputPlaceholder);
	}

	private destroyOutputLoader() {
		if (this.outputLoader) this.outputLoader.remove();

		this.outputLoader = null;
	}

	private itemRender(item: HTMLElement) {
		const val = item
			.querySelector("[data-hs-combo-box-value]").textContent;
		const data =
			JSON.parse(item.getAttribute("data-hs-combo-box-item-stored-data")) ??
				null;

		if (this.itemsWrapper) this.itemsWrapper.append(item);
		else this.output.append(item);

		if (!this.preventSelection) {
			item.addEventListener("click", () => {
				this.close(val, data);
				this.setSelectedByValue(this.valuesBySelector(item));
			});
		}
	}

	private plainRender(items: HTMLElement[]) {
		items.forEach((item: HTMLElement) => {
			this.itemRender(item);
		});
	}

	private jsonItemsRender(items: any) {
		items.forEach((item: never, index: number) => {
			const newItem = htmlToElement(this.outputItemTemplate);
			newItem.setAttribute(
				"data-hs-combo-box-item-stored-data",
				JSON.stringify(item),
			);
			newItem
				.querySelectorAll("[data-hs-combo-box-output-item-field]")
				.forEach((el) => {
					const valueAttr = el.getAttribute(
						"data-hs-combo-box-output-item-field",
					);
					let value = "";

					try {
						// Try to parse as JSON array first
						const fields = JSON.parse(valueAttr);
						if (Array.isArray(fields)) {
							// If it's an array, join all field values
							value = fields
								.map((field) => this.getNestedProperty(item, field))
								.filter(Boolean)
								.join(" ");
						} else {
							// If not an array, treat as single field
							value = this.getNestedProperty(item, valueAttr);
						}
					} catch (e) {
						// If parsing fails, treat as single field
						value = this.getNestedProperty(item, valueAttr);
					}

					el.textContent = value ?? "";

					if (
						!value &&
						el.hasAttribute("data-hs-combo-box-output-item-hide-if-empty")
					) {
						(el as HTMLElement).style.display = "none";
					}
				});
			newItem
				.querySelectorAll("[data-hs-combo-box-search-text]")
				.forEach((el) => {
					const valueAttr = el.getAttribute(
						"data-hs-combo-box-output-item-field",
					);
					let value = "";

					try {
						// Try to parse as JSON array first
						const fields = JSON.parse(valueAttr);
						if (Array.isArray(fields)) {
							// If it's an array, join all field values
							value = fields
								.map((field) => this.getNestedProperty(item, field))
								.filter(Boolean)
								.join(" ");
						} else {
							// If not an array, treat as single field
							value = this.getNestedProperty(item, valueAttr);
						}
					} catch (e) {
						// If parsing fails, treat as single field
						value = this.getNestedProperty(item, valueAttr);
					}

					el.setAttribute(
						"data-hs-combo-box-search-text",
						value ?? "",
					);
				});
			newItem
				.querySelectorAll("[data-hs-combo-box-output-item-attr]")
				.forEach((el) => {
					const attributes = JSON.parse(
						el.getAttribute("data-hs-combo-box-output-item-attr"),
					);

					attributes.forEach((attr: IComboBoxItemAttr) => {
						el.setAttribute(attr.attr, item[attr.valueFrom]);
					});
				});
			newItem.setAttribute("tabIndex", `${index}`);
			if (this.groupingType === "tabs" || this.groupingType === "default") {
				newItem.setAttribute(
					"data-hs-combo-box-output-item",
					`{"group": {"name": "${item[this.apiGroupField]}", "title": "${
						item[this.apiGroupField]
					}"}}`,
				);
			}

			this.items = [...this.items, newItem];

			if (!this.preventSelection) {
				(newItem as HTMLElement).addEventListener("click", () => {
					this.close(
						(newItem as HTMLElement).querySelector("[data-hs-combo-box-value]")
							.textContent,
						JSON.parse((newItem as HTMLElement)
							.getAttribute("data-hs-combo-box-item-stored-data")),
					);

					this.setSelectedByValue(this.valuesBySelector(newItem));
				});
			}

			this.appendItemsToWrapper(newItem);
		});
	}

	private groupDefaultRender() {
		this.groups.forEach((el) => {
			const title = htmlToElement(this.groupingTitleTemplate);
			title.setAttribute("data-hs-combo-box-group-title", el.name);
			title.classList.add("--exclude-accessibility");
			title.innerText = el.title;

			if (this.itemsWrapper) this.itemsWrapper.append(title);
			else this.output.append(title);

			const items = this.sortItems().filter((f) => {
				const { group } = JSON.parse(
					f.getAttribute("data-hs-combo-box-output-item"),
				);

				return group.name === el.name;
			});

			this.plainRender(items);
		});
	}

	private groupTabsRender() {
		const tabsScroll = htmlToElement(this.tabsWrapperTemplate);
		const tabsWrapper = htmlToElement(
			`<div class="flex flex-nowrap gap-x-2"></div>`,
		);

		tabsScroll.append(tabsWrapper);
		this.output.insertBefore(tabsScroll, this.output.firstChild);

		const tabDef = htmlToElement(this.groupingTitleTemplate);
		tabDef.setAttribute("data-hs-combo-box-group-title", "all");
		tabDef.classList.add("--exclude-accessibility", "active");
		tabDef.innerText = "All";
		this.tabs = [...this.tabs, tabDef];
		tabsWrapper.append(tabDef);
		tabDef.addEventListener("click", () => {
			this.selectedGroup = "all";
			const selectedTab = this.tabs.find(
				(elI: HTMLElement) =>
					elI.getAttribute("data-hs-combo-box-group-title") ===
						this.selectedGroup,
			);

			this.tabs.forEach((el: HTMLElement) => el.classList.remove("active"));
			selectedTab.classList.add("active");
			this.setItemsVisibility();
		});

		this.groups.forEach((el) => {
			const tab = htmlToElement(this.groupingTitleTemplate);
			tab.setAttribute("data-hs-combo-box-group-title", el.name);
			tab.classList.add("--exclude-accessibility");
			tab.innerText = el.title;

			this.tabs = [...this.tabs, tab];
			tabsWrapper.append(tab);

			tab.addEventListener("click", () => {
				this.selectedGroup = el.name;
				const selectedTab = this.tabs.find(
					(elI: HTMLElement) =>
						elI.getAttribute("data-hs-combo-box-group-title") ===
							this.selectedGroup,
				);

				this.tabs.forEach((el: HTMLElement) => el.classList.remove("active"));
				selectedTab.classList.add("active");
				this.setItemsVisibility();
			});
		});
	}

	private itemsFromHtml() {
		if (this.groupingType === "default") {
			this.groupDefaultRender();
		} else if (this.groupingType === "tabs") {
			const items = this.sortItems();

			this.groupTabsRender();
			this.plainRender(items);
		} else {
			const items = this.sortItems();

			this.plainRender(items);
		}
		this.setResults(this.input.value);
	}

	private async itemsFromJson() {
		if (this.isSearchLengthExceeded) return false;

		this.buildOutputLoader();

		try {
			const query = `${this.apiQuery}`;
			let searchQuery;
			let searchPath;
			let url = this.apiUrl;

			if (!this.apiSearchQuery && this.apiSearchPath) {
				if (this.apiSearchDefaultPath && this.value === "") {
					searchPath = `/${this.apiSearchDefaultPath}`;
				} else {
					searchPath = `/${this.apiSearchPath}/${this.value.toLowerCase()}`;
				}

				if (this.apiSearchPath || this.apiSearchDefaultPath) {
					url += searchPath;
				}
			} else {
				searchQuery = `${this.apiSearchQuery}=${this.value.toLowerCase()}`;

				if (this.apiQuery && this.apiSearchQuery) {
					url += `?${searchQuery}&${query}`;
				} else if (this.apiQuery) {
					url += `?${query}`;
				} else if (this.apiSearchQuery) {
					url += `?${searchQuery}`;
				}
			}

			const res = await fetch(url, this.apiHeaders);
			let items = await res.json();

			if (this.apiDataPart) {
				items = items[this.apiDataPart];
			}
			if (this.apiSearchQuery || this.apiSearchPath) {
				this.items = [];
			}
			if (this.itemsWrapper) {
				this.itemsWrapper.innerHTML = "";
			} else {
				this.output.innerHTML = "";
			}

			if (this.groupingType === "tabs") {
				this.setApiGroups(items);
				this.groupTabsRender();
				this.jsonItemsRender(items);
			} else if (this.groupingType === "default") {
				this.setApiGroups(items);

				this.groups.forEach((el) => {
					const title = htmlToElement(this.groupingTitleTemplate);
					title.setAttribute("data-hs-combo-box-group-title", el.name);
					title.classList.add("--exclude-accessibility");
					title.innerText = el.title;
					const newItems = items.filter(
						(i: any) => i[this.apiGroupField] === el.name,
					);

					if (this.itemsWrapper) this.itemsWrapper.append(title);
					else this.output.append(title);

					this.jsonItemsRender(newItems);
				});
			} else {
				this.jsonItemsRender(items);
			}

			this.setResults(
				this.input.value.length <= this.minSearchLength ? "" : this.input.value,
			);
		} catch (err) {
			console.error(err);

			this.buildOutputPlaceholder();
		}

		this.destroyOutputLoader();
	}

	private appendItemsToWrapper(item: HTMLElement) {
		if (this.itemsWrapper) {
			this.itemsWrapper.append(item);
		} else {
			this.output.append(item);
		}
	}

	private resultItems() {
		if (!this.items.length) return false;

		this.setItemsVisibility();
		this.setSelectedByValue([this.selected]);
	}

	private destroyOutputPlaceholder() {
		if (this.outputPlaceholder) this.outputPlaceholder.remove();

		this.outputPlaceholder = null;
	}

	// Public methods
	public getCurrentData() {
		return this.currentData;
	}

	public setCurrent() {
		if (window.$hsComboBoxCollection.length) {
			window.$hsComboBoxCollection.map((el) => (el.element.isCurrent = false));

			this.isCurrent = true;
		}
	}

	public open(val?: string) {
		if (this.animationInProcess) return false;

		if (typeof val !== "undefined") this.setValueAndOpen(val);

		if (this.preventVisibility) return false;

		this.animationInProcess = true;

		this.output.style.display = "block";
		if (!this.preventAutoPosition) this.recalculateDirection();

		setTimeout(() => {
			if (this?.input?.ariaExpanded) this.input.ariaExpanded = "true";
			if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "true";
			this.el.classList.add("active");

			this.animationInProcess = false;
		});

		this.isOpened = true;
	}

	public close(val?: string | null, data: {} | null = null) {
		if (this.animationInProcess) return false;

		if (this.preventVisibility) {
			this.setValueAndClear(val, data);

			if (this.input.value !== "") this.el.classList.add("has-value");
			else this.el.classList.remove("has-value");

			return false;
		}

		this.animationInProcess = true;

		if (this?.input?.ariaExpanded) this.input.ariaExpanded = "false";
		if (this?.toggle?.ariaExpanded) this.toggle.ariaExpanded = "false";
		this.el.classList.remove("active");
		if (!this.preventAutoPosition) {
			this.output.classList.remove("bottom-full", "top-full");
			this.output.style.marginTop = "";
			this.output.style.marginBottom = "";
		}

		afterTransition(this.output, () => {
			this.output.style.display = "none";

			this.setValueAndClear(val, data || null);

			this.animationInProcess = false;
		});

		if (this.input.value !== "") this.el.classList.add("has-value");
		else this.el.classList.remove("has-value");

		this.isOpened = false;
	}

	public recalculateDirection() {
		if (
			isEnoughSpace(
				this.output,
				this.input,
				"bottom",
				this.gap,
				this.viewport as HTMLElement,
			)
		) {
			this.output.classList.remove("bottom-full");
			this.output.style.marginBottom = "";
			this.output.classList.add("top-full");
			this.output.style.marginTop = `${this.gap}px`;
		} else {
			this.output.classList.remove("top-full");
			this.output.style.marginTop = "";
			this.output.classList.add("bottom-full");
			this.output.style.marginBottom = `${this.gap}px`;
		}
	}

	public destroy() {
		// Remove listeners
		this.input.removeEventListener("focus", this.onInputFocusListener);
		this.input.removeEventListener("input", this.onInputInputListener);
		this.toggle.removeEventListener("click", this.onToggleClickListener);
		if (this.toggleClose) {
			this.toggleClose.removeEventListener(
				"click",
				this.onToggleCloseClickListener,
			);
		}
		if (this.toggleOpen) {
			this.toggleOpen.removeEventListener(
				"click",
				this.onToggleOpenClickListener,
			);
		}

		// Remove classes
		this.el.classList.remove("has-value", "active");
		if (this.items.length) {
			this.items.forEach((el) => {
				(el as HTMLElement).classList.remove("selected");
				(el as HTMLElement).style.display = "";
			});
		}

		// Remove attributes
		this.output.removeAttribute("role");
		this.output.removeAttribute("tabindex");
		this.output.removeAttribute("aria-orientation");

		// Remove generated markup
		if (this.outputLoader) {
			this.outputLoader.remove();
			this.outputLoader = null;
		}
		if (this.outputPlaceholder) {
			this.outputPlaceholder.remove();
			this.outputPlaceholder = null;
		}
		if (this.apiUrl) {
			this.output.innerHTML = "";
		}

		this.items = [];

		window.$hsComboBoxCollection = window.$hsComboBoxCollection.filter(
			({ element }) => element.el !== this.el,
		);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsComboBoxCollection.find(
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
		if (!window.$hsComboBoxCollection) {
			window.$hsComboBoxCollection = [];

			window.addEventListener("click", (evt) => {
				const evtTarget = evt.target;

				HSComboBox.closeCurrentlyOpened(evtTarget as HTMLElement);
			});

			document.addEventListener(
				"keydown",
				(evt) => HSComboBox.accessibility(evt),
			);
		}

		if (window.$hsComboBoxCollection) {
			window.$hsComboBoxCollection = window.$hsComboBoxCollection.filter(
				({ element }) => document.contains(element.el),
			);
		}

		document
			.querySelectorAll("[data-hs-combo-box]:not(.--prevent-on-load-init)")
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsComboBoxCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const data = el.getAttribute("data-hs-combo-box");
					const options: IComboBoxOptions = data ? JSON.parse(data) : {};

					new HSComboBox(el, options);
				}
			});
	}

	static close(target: HTMLElement | string) {
		const elInCollection = window.$hsComboBoxCollection.find(
			(el) =>
				el.element.el ===
					(typeof target === "string"
						? document.querySelector(target)
						: target),
		);

		if (elInCollection && elInCollection.element.isOpened) {
			elInCollection.element.close();
		}
	}

	static closeCurrentlyOpened(evtTarget: HTMLElement | null = null) {
		if (!evtTarget.closest("[data-hs-combo-box].active")) {
			const currentlyOpened = window.$hsComboBoxCollection.filter((el) =>
				el.element.isOpened
			) ||
				null;

			if (currentlyOpened) {
				currentlyOpened.forEach((el) => {
					el.element.close();
				});
			}
		}
	}

	// Accessibility methods
	private static getPreparedItems(
		isReversed = false,
		output: HTMLElement | null,
	): Element[] | null {
		if (!output) return null;

		const preparedItems = isReversed
			? Array.from(
				output.querySelectorAll(":scope > *:not(.--exclude-accessibility)"),
			)
				.filter((el) => (el as HTMLElement).style.display !== "none")
				.reverse()
			: Array.from(
				output.querySelectorAll(":scope > *:not(.--exclude-accessibility)"),
			).filter((el) => (el as HTMLElement).style.display !== "none");
		const items = preparedItems.filter(
			(el: any) => !el.classList.contains("disabled"),
		);

		return items;
	}

	private static setHighlighted(
		prev: Element,
		current: HTMLElement,
		input: HTMLInputElement,
	): void {
		current.focus();

		input.value = current
			.querySelector("[data-hs-combo-box-value]").textContent;

		if (prev) prev.classList.remove("hs-combo-box-output-item-highlighted");
		current.classList.add("hs-combo-box-output-item-highlighted");
	}

	static accessibility(evt: KeyboardEvent) {
		const target = window.$hsComboBoxCollection.find((el) =>
			el.element.preventVisibility ? el.element.isCurrent : el.element.isOpened
		);

		if (
			target &&
			COMBO_BOX_ACCESSIBILITY_KEY_SET.includes(evt.code) &&
			!evt.metaKey
		) {
			switch (evt.code) {
				case "Escape":
					evt.preventDefault();
					this.onEscape();
					break;
				case "ArrowUp":
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow();
					break;
				case "ArrowDown":
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onArrow(false);
					break;
				case "Home":
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd();
					break;
				case "End":
					evt.preventDefault();
					evt.stopImmediatePropagation();
					this.onStartEnd(false);
					break;
				case "Enter":
					evt.preventDefault();
					this.onEnter(evt);
					break;
				default:
					break;
			}
		}
	}

	static onEscape() {
		const target = window.$hsComboBoxCollection.find(
			(el) => !el.element.preventVisibility && el.element.isOpened,
		);

		if (target) {
			target.element.close();
			target.element.input.blur();
		}
	}

	static onArrow(isArrowUp = true) {
		const target = window.$hsComboBoxCollection.find((el) =>
			el.element.preventVisibility ? el.element.isCurrent : el.element.isOpened
		);

		if (target) {
			const output = target.element.itemsWrapper ?? target.element.output;

			if (!output) return false;

			const items = HSComboBox.getPreparedItems(isArrowUp, output) as Element[];
			const current = output.querySelector(
				".hs-combo-box-output-item-highlighted",
			);
			let currentItem = null;
			if (!current) {
				items[0].classList.add("hs-combo-box-output-item-highlighted");
			}
			let currentInd = items.findIndex((el: any) => el === current);
			if (currentInd + 1 < items.length) currentInd++;
			currentItem = items[currentInd] as HTMLButtonElement;

			HSComboBox.setHighlighted(current, currentItem, target.element.input);
		}
	}

	static onStartEnd(isStart = true) {
		const target = window.$hsComboBoxCollection.find((el) =>
			el.element.preventVisibility ? el.element.isCurrent : el.element.isOpened
		);

		if (target) {
			const output = target.element.itemsWrapper ?? target.element.output;

			if (!output) return false;

			const items = HSComboBox.getPreparedItems(isStart, output) as Element[];
			const current = output.querySelector(
				".hs-combo-box-output-item-highlighted",
			);

			if (items.length) {
				HSComboBox.setHighlighted(
					current,
					items[0] as HTMLButtonElement,
					target.element.input,
				);
			}
		}
	}

	static onEnter(evt: Event) {
		const target = evt.target;
		const opened = window.$hsComboBoxCollection.find(
			(el) =>
				!isParentOrElementHidden(el.element.el) &&
				(evt.target as HTMLElement).closest("[data-hs-combo-box]") ===
					el.element.el,
		);

		const link: HTMLAnchorElement = opened.element.el.querySelector(
			".hs-combo-box-output-item-highlighted a",
		);

		if ((target as HTMLElement).hasAttribute("data-hs-combo-box-input")) {
			opened.element.close();
			(target as HTMLInputElement).blur();
		} else {
			if (!opened.element.preventSelection) {
				opened.element.setSelectedByValue(
					opened.element.valuesBySelector(evt.target as HTMLElement),
				);
			}
			if (opened.element.preventSelection && link) {
				window.location.assign(link.getAttribute("href"));
			}
			opened.element.close(
				!opened.element.preventSelection
					? (evt.target as HTMLElement).querySelector(
						"[data-hs-combo-box-value]",
					).textContent
					: null,
				JSON.parse(
					(evt.target as HTMLElement).getAttribute(
						"data-hs-combo-box-item-stored-data",
					),
				) ?? null,
			);
		}
	}
}

declare global {
	interface Window {
		HSComboBox: Function;
		$hsComboBoxCollection: ICollectionItem<HSComboBox>[];
	}
}

window.addEventListener("load", () => {
	HSComboBox.autoInit();

	// Uncomment for debug
	// console.log('ComboBox collection:', window.$hsComboBoxCollection);
});

document.addEventListener("scroll", () => {
	if (!window.$hsComboBoxCollection) return false;

	const target = window.$hsComboBoxCollection.find((el) => el.element.isOpened);

	if (target && !target.element.preventAutoPosition) {
		target.element.recalculateDirection();
	}
});

if (typeof window !== "undefined") {
	window.HSComboBox = HSComboBox;
}

export default HSComboBox;
