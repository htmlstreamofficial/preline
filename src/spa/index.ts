/*
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

declare var _: any;
declare var DataTable: any;
declare var Dropzone: any;
declare var noUiSlider: any;
declare var VanillaCalendarPro: any;

import { ISpaCollectionItem } from "../spa/interfaces";

import HSCopyMarkup from "../plugins/copy-markup";
import HSAccordion from "../plugins/accordion";
import HSCarousel from "../plugins/carousel";
import HSCollapse from "../plugins/collapse";
import HSComboBox from "../plugins/combobox";

let HSDataTable;
let HSFileUpload;
let HSRangeSlider;
let HSDatepicker;

import HSDropdown from "../plugins/dropdown";
import HSLayoutSplitter from "../plugins/layout-splitter";
import HSInputNumber from "../plugins/input-number";
import HSOverlay from "../plugins/overlay";
import HSPinInput from "../plugins/pin-input";
import HSRemoveElement from "../plugins/remove-element";
import HSScrollNav from "../plugins/scroll-nav";
import HSScrollspy from "../plugins/scrollspy";
import HSSelect from "../plugins/select";
import HSStepper from "../plugins/stepper";
import HSStrongPassword from "../plugins/strong-password";
import HSTabs from "../plugins/tabs";
import HSTextareaAutoHeight from "../plugins/textarea-auto-height";
import HSThemeSwitch from "../plugins/theme-switch";
import HSToggleCount from "../plugins/toggle-count";
import HSTogglePassword from "../plugins/toggle-password";
import HSTooltip from "../plugins/tooltip";
import HSTreeView from "../plugins/tree-view";

if (typeof window !== "undefined") {
	try {
		if (typeof DataTable !== "undefined" && typeof jQuery !== "undefined") {
			HSDataTable = require("../plugins/datatable").default;
		}
	} catch (e) {
		console.warn("HSDataTable: Required dependencies not found");
		HSDataTable = null;
	}

	try {
		if (typeof _ !== "undefined" && typeof Dropzone !== "undefined") {
			HSFileUpload = require("../plugins/file-upload").default;
		}
	} catch (e) {
		console.warn("HSFileUpload: Required dependencies not found");
		HSFileUpload = null;
	}

	try {
		if (typeof noUiSlider !== "undefined") {
			HSRangeSlider = require("../plugins/range-slider").default;
		}
	} catch (e) {
		console.warn("HSRangeSlider: Required dependencies not found");
		HSRangeSlider = null;
	}

	try {
		if (typeof VanillaCalendarPro !== "undefined") {
			HSDatepicker = require("../plugins/datepicker").default;
		}
	} catch (e) {
		console.warn("HSDatepicker: Required dependencies not found");
		HSDatepicker = null;
	}
}

export const COLLECTIONS: ISpaCollectionItem[] = [
	{
		key: "copy-markup",
		fn: HSCopyMarkup,
		collection: "$hsCopyMarkupCollection",
	},
	{ key: "accordion", fn: HSAccordion, collection: "$hsAccordionCollection" },
	{ key: "carousel", fn: HSCarousel, collection: "$hsCarouselCollection" },
	{ key: "collapse", fn: HSCollapse, collection: "$hsCollapseCollection" },
	{ key: "combobox", fn: HSComboBox, collection: "$hsComboBoxCollection" },
	...(HSDataTable
		? [{
			key: "datatable",
			fn: HSDataTable,
			collection: "$hsDataTableCollection",
		}]
		: []),
	...(HSDatepicker
		? [{
			key: "datepicker",
			fn: HSDatepicker,
			collection: "$hsDatepickerCollection",
		}]
		: []),
	{ key: "dropdown", fn: HSDropdown, collection: "$hsDropdownCollection" },
	...(HSFileUpload
		? [{
			key: "file-upload",
			fn: HSFileUpload,
			collection: "$hsFileUploadCollection",
		}]
		: []),
	{
		key: "input-number",
		fn: HSInputNumber,
		collection: "$hsInputNumberCollection",
	},
	{
		key: "layout-splitter",
		fn: HSLayoutSplitter,
		collection: "$hsLayoutSplitterCollection",
	},
	{ key: "overlay", fn: HSOverlay, collection: "$hsOverlayCollection" },
	{ key: "pin-input", fn: HSPinInput, collection: "$hsPinInputCollection" },
	...(HSRangeSlider
		? [{
			key: "range-slider",
			fn: HSRangeSlider,
			collection: "$hsRangeSliderCollection",
		}]
		: []),
	{
		key: "remove-element",
		fn: HSRemoveElement,
		collection: "$hsRemoveElementCollection",
	},
	{ key: "scroll-nav", fn: HSScrollNav, collection: "$hsScrollNavCollection" },
	{ key: "scrollspy", fn: HSScrollspy, collection: "$hsScrollspyCollection" },
	{ key: "select", fn: HSSelect, collection: "$hsSelectCollection" },
	{ key: "stepper", fn: HSStepper, collection: "$hsStepperCollection" },
	{
		key: "strong-password",
		fn: HSStrongPassword,
		collection: "$hsStrongPasswordCollection",
	},
	{ key: "tabs", fn: HSTabs, collection: "$hsTabsCollection" },
	{
		key: "textarea-auto-height",
		fn: HSTextareaAutoHeight,
		collection: "$hsTextareaAutoHeightCollection",
	},
	{
		key: "theme-switch",
		fn: HSThemeSwitch,
		collection: "$hsThemeSwitchCollection",
	},
	{
		key: "toggle-count",
		fn: HSToggleCount,
		collection: "$hsToggleCountCollection",
	},
	{
		key: "toggle-password",
		fn: HSTogglePassword,
		collection: "$hsTogglePasswordCollection",
	},
	{ key: "tooltip", fn: HSTooltip, collection: "$hsTooltipCollection" },
	{ key: "tree-view", fn: HSTreeView, collection: "$hsTreeViewCollection" },
];
