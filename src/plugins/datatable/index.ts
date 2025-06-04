/*
 * HSDataTable
 * @version: 3.1.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { Api } from 'datatables.net';

import { debounce, htmlToElement, classToClassList } from '../../utils';

import { IDataTableOptions, IDataTable } from '../datatable/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

declare var DataTable: any;

interface IColumnDef {
	targets: number;
	orderable: boolean;
}

class HSDataTable
	extends HSBasePlugin<IDataTableOptions>
	implements IDataTable {
	private concatOptions: IDataTableOptions;

	private dataTable: Api<any>;

	private readonly table: HTMLTableElement;

	private searches: HTMLElement[] | null;

	private pageEntitiesList: (HTMLSelectElement | HTMLInputElement)[] | null;

	private pagingList: HTMLElement[] | null;
	private pagingPagesList: HTMLElement[] | null;

	private pagingPrevList: HTMLElement[] | null;
	private pagingNextList: HTMLElement[] | null;

	private readonly infoList: HTMLElement[] | null;

	private rowSelectingAll: HTMLElement | null;
	private rowSelectingIndividual: string | null;

	private maxPagesToShow: number;
	private isRowSelecting: boolean;
	private readonly pageBtnClasses: string | null;

	private onSearchInputListener: {
		el: Element;
		fn: (evt: InputEvent) => void;
	}[] | null;
	private onPageEntitiesChangeListener: {
		el: Element;
		fn: (evt: InputEvent) => void;
	}[] | null;
	private onSinglePagingClickListener: {
		el: Element;
		fn: () => void;
	}[] | null;
	private onPagingPrevClickListener: {
		el: Element;
		fn: () => void;
	}[] | null;
	private onPagingNextClickListener: {
		el: Element;
		fn: () => void;
	}[] | null;
	private onRowSelectingAllChangeListener: () => void;

	constructor(el: HTMLElement, options?: IDataTableOptions, events?: {}) {
		super(el, options, events);

		this.el = typeof el === 'string' ? document.querySelector(el) : el;

		// Exclude columns from ordering
		const columnDefs: IColumnDef[] = [];
		Array.from(this.el.querySelectorAll('thead th, thead td')).forEach(
			(th: HTMLElement, ind: number) => {
				if (th.classList.contains('--exclude-from-ordering'))
					columnDefs.push({
						targets: ind,
						orderable: false,
					});
			},
		);

		const data = this.el.getAttribute('data-hs-datatable');
		const dataOptions: IDataTableOptions = data ? JSON.parse(data) : {};

		this.concatOptions = {
			searching: true,
			lengthChange: false,
			order: [],
			columnDefs: [...columnDefs],
			...dataOptions,
			...options,
		};

		this.table = this.el.querySelector('table');

		this.searches = Array.from(this.el.querySelectorAll('[data-hs-datatable-search]')) ?? null;

		this.pageEntitiesList = Array.from(this.el.querySelectorAll('[data-hs-datatable-page-entities]')) ?? null;

		this.pagingList = Array.from(this.el.querySelectorAll('[data-hs-datatable-paging]')) ?? null;
		this.pagingPagesList = Array.from(this.el.querySelectorAll('[data-hs-datatable-paging-pages]')) ?? null;
		this.pagingPrevList = Array.from(this.el.querySelectorAll('[data-hs-datatable-paging-prev]')) ?? null;
		this.pagingNextList = Array.from(this.el.querySelectorAll('[data-hs-datatable-paging-next]')) ?? null;

		this.infoList = Array.from(this.el.querySelectorAll('[data-hs-datatable-info]')) ?? null;

		if (this.concatOptions?.rowSelectingOptions)
			this.rowSelectingAll =
				(this.concatOptions?.rowSelectingOptions?.selectAllSelector
					? document.querySelector(
						this.concatOptions?.rowSelectingOptions?.selectAllSelector,
					)
					: document.querySelector('[data-hs-datatable-row-selecting-all]')) ??
				null;
		if (this.concatOptions?.rowSelectingOptions)
			this.rowSelectingIndividual =
				this.concatOptions?.rowSelectingOptions?.individualSelector ??
				'[data-hs-datatable-row-selecting-individual]' ??
				null;

		if (this.pageEntitiesList.length) this.concatOptions.pageLength = parseInt(this.pageEntitiesList[0].value);

		this.maxPagesToShow = 3;
		this.isRowSelecting = !!this.concatOptions?.rowSelectingOptions;
		this.pageBtnClasses = this.concatOptions?.pagingOptions?.pageBtnClasses ?? null;

		this.onSearchInputListener = [];
		this.onPageEntitiesChangeListener = [];
		this.onSinglePagingClickListener = [];
		this.onPagingPrevClickListener = [];
		this.onPagingNextClickListener = [];

		this.init();
	}

	private init() {
		this.createCollection(window.$hsDataTableCollection, this);

		this.initTable();

		if (this.searches.length) this.initSearch();

		if (this.pageEntitiesList.length) this.initPageEntities();

		if (this.pagingList.length) this.initPaging();
		if (this.pagingPagesList.length) this.buildPagingPages();
		if (this.pagingPrevList.length) this.initPagingPrev();
		if (this.pagingNextList.length) this.initPagingNext();

		if (this.infoList.length) this.initInfo();

		if (this.isRowSelecting) this.initRowSelecting();
	}

	private initTable() {
		this.dataTable = new DataTable(this.table, this.concatOptions);

		if (this.isRowSelecting) this.triggerChangeEventToRow();

		this.dataTable.on('draw', () => {
			if (this.isRowSelecting) this.updateSelectAllCheckbox();
			if (this.isRowSelecting) this.triggerChangeEventToRow();
			this.updateInfo();
			this.pagingPagesList.forEach((el) => this.updatePaging(el));
		});
	}

	private searchInput(evt: InputEvent) {
		this.onSearchInput((evt.target as HTMLInputElement).value);
	}

	private pageEntitiesChange(evt: Event) {
		this.onEntitiesChange(parseInt((evt.target as HTMLSelectElement).value), evt.target as HTMLSelectElement);
	}

	private pagingPrevClick() {
		this.onPrevClick();
	}

	private pagingNextClick() {
		this.onNextClick();
	}

	private rowSelectingAllChange() {
		this.onSelectAllChange();
	}

	private singlePagingClick(count: number) {
		this.onPageClick(count);
	}

	// Search
	private initSearch() {
		this.searches.forEach((el) => {
			this.onSearchInputListener.push({
				el,
				fn: debounce((evt: InputEvent) => this.searchInput(evt)),
			});

			el.addEventListener('input', this.onSearchInputListener.find((search) => search.el === el).fn);
		});
	}

	private onSearchInput(val: string) {
		this.dataTable.search(val).draw();
	}

	// Page entities
	private initPageEntities() {
		this.pageEntitiesList.forEach((el) => {
			this.onPageEntitiesChangeListener.push({
				el,
				fn: (evt) => this.pageEntitiesChange(evt),
			});

			el.addEventListener('change', this.onPageEntitiesChangeListener.find((pageEntity) => pageEntity.el === el).fn);
		});
	}

	private onEntitiesChange(entities: number, target: HTMLSelectElement) {
		const otherEntities = this.pageEntitiesList.filter((el) => el !== target);

		if (otherEntities.length) otherEntities.forEach((el) => {
			if (window.HSSelect) {
				// @ts-ignore
				const hsSelectInstance = window.HSSelect.getInstance(el, true);
				if (hsSelectInstance) hsSelectInstance.element.setValue(`${entities}`);
			} else el.value = `${entities}`;
		});

		this.dataTable.page.len(entities).draw();
	}

	// Info
	private initInfo() {
		this.infoList.forEach((el) => {
			this.initInfoFrom(el);
			this.initInfoTo(el);
			this.initInfoLength(el);
		});
	}

	private initInfoFrom(el: HTMLElement) {
		const infoFrom = el.querySelector('[data-hs-datatable-info-from]') as HTMLElement ?? null;
		const { start } = this.dataTable.page.info();

		if (infoFrom) infoFrom.innerText = `${start + 1}`;
	}

	private initInfoTo(el: HTMLElement) {
		const infoTo = el.querySelector('[data-hs-datatable-info-to]') as HTMLElement ?? null;
		const { end } = this.dataTable.page.info();

		if (infoTo) infoTo.innerText = `${end}`;
	}

	private initInfoLength(el: HTMLElement) {
		const infoLength = el.querySelector('[data-hs-datatable-info-length]') as HTMLElement ?? null;
		const { recordsTotal } = this.dataTable.page.info();

		if (infoLength) infoLength.innerText = `${recordsTotal}`;
	}

	private updateInfo() {
		this.initInfo();
	}

	// Paging
	private initPaging() {
		this.pagingList.forEach((el) => this.hidePagingIfSinglePage(el));
	}

	private hidePagingIfSinglePage(el: HTMLElement) {
		const { pages } = this.dataTable.page.info();

		if (pages < 2) {
			el.classList.add('hidden');
			el.style.display = 'none';
		} else {
			el.classList.remove('hidden');
			el.style.display = '';
		}
	}

	private initPagingPrev() {
		this.pagingPrevList.forEach((el) => {
			this.onPagingPrevClickListener.push({
				el,
				fn: () => this.pagingPrevClick(),
			});

			el.addEventListener('click', this.onPagingPrevClickListener.find((pagingPrev) => pagingPrev.el === el).fn);
		});
	}

	private onPrevClick() {
		this.dataTable.page('previous').draw('page');
	}

	private disablePagingArrow(el: HTMLElement, statement: boolean) {
		if (statement) {
			el.classList.add('disabled');
			el.setAttribute('disabled', 'disabled');
		} else {
			el.classList.remove('disabled');
			el.removeAttribute('disabled');
		}
	}

	private initPagingNext() {
		this.pagingNextList.forEach((el) => {
			this.onPagingNextClickListener.push({
				el,
				fn: () => this.pagingNextClick(),
			});

			el.addEventListener('click', this.onPagingNextClickListener.find((pagingNext) => pagingNext.el === el).fn);
		});
	}

	private onNextClick() {
		this.dataTable.page('next').draw('page');
	}

	private buildPagingPages() {
		this.pagingPagesList.forEach((el) => this.updatePaging(el));
	}

	private updatePaging(pagingPages: HTMLElement) {
		const { page, pages, length } = this.dataTable.page.info();
		const totalRecords = this.dataTable.rows({ search: 'applied' }).count();
		const totalPages = Math.ceil(totalRecords / length);
		const currentPage = page + 1;

		let startPage = Math.max(1, currentPage - Math.floor(this.maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + (this.maxPagesToShow - 1));

		if (endPage - startPage + 1 < this.maxPagesToShow) {
			startPage = Math.max(1, endPage - this.maxPagesToShow + 1);
		}

		pagingPages.innerHTML = '';

		if (startPage > 1) {
			this.buildPagingPage(1, pagingPages);

			if (startPage > 2) pagingPages.appendChild(htmlToElement(`<span class="ellipsis">...</span>`));
		}

		for (let i = startPage; i <= endPage; i++) {
			this.buildPagingPage(i, pagingPages);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) pagingPages.appendChild(htmlToElement(`<span class="ellipsis">...</span>`));

			this.buildPagingPage(totalPages, pagingPages);
		}

		this.pagingPrevList.forEach((el) => this.disablePagingArrow(el, page === 0));
		this.pagingNextList.forEach((el) => this.disablePagingArrow(el, page === pages - 1));

		this.pagingList.forEach((el) => this.hidePagingIfSinglePage(el));
	}

	private buildPagingPage(counter: number, target: HTMLElement) {
		const { page } = this.dataTable.page.info();
		const pageEl = htmlToElement(`<button type="button"></button>`);
		pageEl.innerText = `${counter}`;
		pageEl.setAttribute('data-page', `${counter}`);
		if (this.pageBtnClasses) classToClassList(this.pageBtnClasses, pageEl);
		if (page === counter - 1) pageEl.classList.add('active');

		this.onSinglePagingClickListener.push({
			el: pageEl,
			fn: () => this.singlePagingClick(counter),
		});

		pageEl.addEventListener('click', this.onSinglePagingClickListener.find((singlePaging) => singlePaging.el === pageEl).fn);

		target.append(pageEl);
	}

	private onPageClick(counter: number) {
		this.dataTable.page(counter - 1).draw('page');
	}

	// Select row
	private initRowSelecting() {
		this.onRowSelectingAllChangeListener = () => this.rowSelectingAllChange();

		this.rowSelectingAll.addEventListener(
			'change',
			this.onRowSelectingAllChangeListener,
		);
	}

	private triggerChangeEventToRow() {
		this.table
			.querySelectorAll(`tbody ${this.rowSelectingIndividual}`)
			.forEach((el) => {
				el.addEventListener('change', () => {
					this.updateSelectAllCheckbox();
				});
			});
	}

	private onSelectAllChange() {
		let isChecked = (this.rowSelectingAll as HTMLInputElement).checked;
		const visibleRows = Array.from(
			this.dataTable.rows({ page: 'current', search: 'applied' }).nodes(),
		);

		visibleRows.forEach((el) => {
			const checkbox = el.querySelector(this.rowSelectingIndividual);

			if (checkbox) checkbox.checked = isChecked;
		});

		this.updateSelectAllCheckbox();
	}

	private updateSelectAllCheckbox() {
		const searchRelatedItems = this.dataTable
			.rows({ search: 'applied' })
			.count();

		if (!searchRelatedItems) {
			(this.rowSelectingAll as HTMLInputElement).checked = false;

			return false;
		}

		let isChecked = true;
		const visibleRows = Array.from(
			this.dataTable
				.rows({
					page: 'current',
					search: 'applied',
				})
				.nodes(),
		);

		visibleRows.forEach((el) => {
			const checkbox = el.querySelector(this.rowSelectingIndividual);

			if (checkbox && !checkbox.checked) {
				isChecked = false;

				return false;
			}
		});

		(this.rowSelectingAll as HTMLInputElement).checked = isChecked;
	}

	// Public methods
	public destroy() {
		if (this.searches) {
			this.onSearchInputListener.forEach(({ el, fn }) => el.removeEventListener('click', fn));

			// this.searches = null;
		}
		if (this.pageEntitiesList) this.onPageEntitiesChangeListener.forEach(({ el, fn }) => el.removeEventListener('change', fn));
		if (this.pagingPagesList.length) {
			this.onSinglePagingClickListener.forEach(({ el, fn }) => el.removeEventListener('click', fn));

			this.pagingPagesList.forEach((el) => el.innerHTML = '');
		}
		if (this.pagingPrevList.length) this.onPagingPrevClickListener.forEach(({ el, fn }) => el.removeEventListener('click', fn));
		if (this.pagingNextList.length) this.onPagingNextClickListener.forEach(({ el, fn }) => el.removeEventListener('click', fn));
		if (this.rowSelectingAll)
			this.rowSelectingAll.removeEventListener(
				'change',
				this.onRowSelectingAllChangeListener,
			);

		this.dataTable.destroy();

		this.rowSelectingAll = null;
		this.rowSelectingIndividual = null;

		window.$hsDataTableCollection = window.$hsDataTableCollection.filter(({ element }) => element.el !== this.el);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsDataTableCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsDataTableCollection) window.$hsDataTableCollection = [];

		if (window.$hsDataTableCollection)
			window.$hsDataTableCollection = window.$hsDataTableCollection.filter(
				({ element }) => document.contains(element.el),
			);

		document
			.querySelectorAll('[data-hs-datatable]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsDataTableCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				)
					new HSDataTable(el);
			});
	}
}

declare global {
	interface Window {
		HSDataTable: Function;
		$hsDataTableCollection: ICollectionItem<HSDataTable>[];
	}
}

window.addEventListener('load', () => {
	if (
		document.querySelectorAll(
			'[data-hs-datatable]:not(.--prevent-on-load-init)',
		).length
	) {
		if (typeof jQuery === 'undefined')
			console.error(
				'HSDataTable: jQuery is not available, please add it to the page.',
			);
		if (typeof DataTable === 'undefined')
			console.error(
				'HSDataTable: DataTable is not available, please add it to the page.',
			);
	}

	if (typeof DataTable !== 'undefined' && typeof jQuery !== 'undefined')
		HSDataTable.autoInit();

	// Uncomment for debug
	// console.log('Datatable collection:', window.$hsDataTableCollection);
});

if (typeof window !== 'undefined') {
	window.HSDataTable = HSDataTable;
}

export default HSDataTable;
