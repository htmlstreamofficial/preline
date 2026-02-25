import { afterTransition, getClassProperty } from "../utils";

import HSCopyMarkup from "../plugins/copy-markup/core";
import HSAccordion from "../plugins/accordion/core";
import HSCarousel from "../plugins/carousel/core";
import HSCollapse from "../plugins/collapse/core";
import HSComboBox from "../plugins/combobox/core";
import HSDataTable from "../plugins/datatable/core";
import HSDatepicker from "../plugins/datepicker/core";
import HSDropdown from "../plugins/dropdown/core";
import HSFileUpload from "../plugins/file-upload/core";
import HSInputNumber from "../plugins/input-number/core";
import HSLayoutSplitter from "../plugins/layout-splitter/core";
import HSOverlay from "../plugins/overlay/core";
import HSPinInput from "../plugins/pin-input/core";
import HSRangeSlider from "../plugins/range-slider/core";
import HSRemoveElement from "../plugins/remove-element/core";
import HSScrollNav from "../plugins/scroll-nav/core";
import HSScrollspy from "../plugins/scrollspy/core";
import HSSelect from "../plugins/select/core";
import HSStepper from "../plugins/stepper/core";
import HSStrongPassword from "../plugins/strong-password/core";
import HSTabs from "../plugins/tabs/core";
import HSTextareaAutoHeight from "../plugins/textarea-auto-height/core";
import HSThemeSwitch from "../plugins/theme-switch/core";
import HSToggleCount from "../plugins/toggle-count/core";
import HSTogglePassword from "../plugins/toggle-password/core";
import HSTooltip from "../plugins/tooltip/core";
import HSTreeView from "../plugins/tree-view/core";

import { TCollectionItem } from "./types";

const getGlobal = () => globalThis as any;
const isDataTableAvailable = () => {
	const g = getGlobal();

	return typeof g.DataTable !== "undefined" && typeof g.jQuery !== "undefined";
};
const isFileUploadAvailable = () => {
	const g = getGlobal();

	return typeof g._ !== "undefined" && typeof g.Dropzone !== "undefined";
};
const isRangeSliderAvailable = () => {
	const g = getGlobal();

	return typeof g.noUiSlider !== "undefined";
};
const isDatepickerAvailable = () => {
	const g = getGlobal();

	return typeof g.VanillaCalendarPro !== "undefined";
};

export const COLLECTIONS: TCollectionItem[] = [
	{ key: "copy-markup", fn: HSCopyMarkup, collection: "$hsCopyMarkupCollection" },
	{ key: "accordion", fn: HSAccordion, collection: "$hsAccordionCollection" },
	{ key: "carousel", fn: HSCarousel, collection: "$hsCarouselCollection" },
	{ key: "collapse", fn: HSCollapse, collection: "$hsCollapseCollection" },
	{ key: "combobox", fn: HSComboBox, collection: "$hsComboBoxCollection" },
	{
		key: "datatable",
		fn: isDataTableAvailable() ? HSDataTable : null,
		collection: "$hsDataTableCollection",
	},
	{
		key: "datepicker",
		fn: isDatepickerAvailable() ? HSDatepicker : null,
		collection: "$hsDatepickerCollection",
	},
	{ key: "dropdown", fn: HSDropdown, collection: "$hsDropdownCollection" },
	{
		key: "file-upload",
		fn: isFileUploadAvailable() ? HSFileUpload : null,
		collection: "$hsFileUploadCollection",
	},
	{ key: "input-number", fn: HSInputNumber, collection: "$hsInputNumberCollection" },
	{
		key: "layout-splitter",
		fn: HSLayoutSplitter,
		collection: "$hsLayoutSplitterCollection",
	},
	{ key: "overlay", fn: HSOverlay, collection: "$hsOverlayCollection" },
	{ key: "pin-input", fn: HSPinInput, collection: "$hsPinInputCollection" },
	{
		key: "range-slider",
		fn: isRangeSliderAvailable() ? HSRangeSlider : null,
		collection: "$hsRangeSliderCollection",
	},
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
	{ key: "toggle-count", fn: HSToggleCount, collection: "$hsToggleCountCollection" },
	{
		key: "toggle-password",
		fn: HSTogglePassword,
		collection: "$hsTogglePasswordCollection",
	},
	{ key: "tooltip", fn: HSTooltip, collection: "$hsTooltipCollection" },
	{ key: "tree-view", fn: HSTreeView, collection: "$hsTreeViewCollection" },
];

export const HSStaticMethods = {
	getClassProperty,
	afterTransition,
	autoInit(collection: string | string[] = "all") {
		if (collection === "all") {
			COLLECTIONS.forEach(({ fn }) => {
				fn?.autoInit?.();
			});

			return;
		}

		const target = Array.isArray(collection) ? collection : [collection];

		COLLECTIONS.forEach(({ key, fn }) => {
			if (target.includes(key)) fn?.autoInit?.();
		});
	},
	cleanCollection(name: string | string[] = "all") {
		if (typeof window === "undefined") return;

		if (name === "all") {
			COLLECTIONS.forEach(({ collection }) => {
				if ((window as any)[collection] instanceof Array) {
					(window as any)[collection] = [];
				}
			});

			return;
		}

		const target = Array.isArray(name) ? name : [name];

		COLLECTIONS.forEach(({ key, collection }) => {
			if (target.includes(key) && (window as any)[collection] instanceof Array) {
				(window as any)[collection] = [];
			}
		});
	},
};

export default HSStaticMethods;
