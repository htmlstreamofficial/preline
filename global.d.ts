import type INoUiSlider from "nouislider";

import { ICollectionItem } from "./src/interfaces";

import { IStaticMethods } from "./src/static/interfaces";

import type HSCopyMarkup from "./src/plugins/copy-markup";
import type HSAccordion from "./src/plugins/accordion";
import type HSCarousel from "./src/plugins/carousel";
import type HSCollapse from "./src/plugins/collapse";
import type HSComboBox from "./src/plugins/combobox";
import type HSDataTable from "./src/plugins/datatable";
import type HSDropdown from "./src/plugins/dropdown";
import type HSFileUpload from "./src/plugins/file-upload";
import type HSInputNumber from "./src/plugins/input-number";
import type HSLayoutSplitter from "./src/plugins/layout-splitter";
import type HSOverlay from "./src/plugins/overlay";
import type HSPinInput from "./src/plugins/pin-input";
import type HSRangeSlider from "./src/plugins/range-slider";
import type HSRemoveElement from "./src/plugins/remove-element";
import type HSScrollNav from "./src/plugins/scroll-nav";
import type HSScrollspy from "./src/plugins/scrollspy";
import type HSSelect from "./src/plugins/select";
import type HSStepper from "./src/plugins/stepper";
import type HSStrongPassword from "./src/plugins/strong-password";
import type HSTabs from "./src/plugins/tabs";
import type HSTextareaAutoHeight from "./src/plugins/textarea-auto-height";
import type HSThemeSwitch from "./src/plugins/theme-switch";
import type HSToggleCount from "./src/plugins/toggle-count";
import type HSTogglePassword from "./src/plugins/toggle-password";
import type HSTooltip from "./src/plugins/tooltip";
import type HSTreeView from "./src/plugins/tree-view";
import type HSAccessibilityObserver from "./src/plugins/accessibility-manager";

declare global {
	var noUiSlider: typeof INoUiSlider;
	var FloatingUIDOM: {
		computePosition: (
			reference: Element,
			floating: HTMLElement,
			options?: any,
		) => Promise<{ x: number; y: number; placement: string }>;
		autoUpdate: (
			reference: Element,
			floating: HTMLElement,
			update: () => void,
		) => () => void;
		offset: (offset: number | [number, number]) => any;
		flip: (options?: { fallbackPlacements?: string[] }) => any;
	};

	interface Window {
		HS_CLIPBOARD_SELECTOR: string;

		HSStaticMethods: IStaticMethods;
		HSAccessibilityObserver: HSAccessibilityObserver;

		$hsCopyMarkupCollection: ICollectionItem<HSCopyMarkup>[];
		$hsAccordionCollection: ICollectionItem<HSAccordion>[];
		$hsCarouselCollection: ICollectionItem<HSCarousel>[];
		$hsCollapseCollection: ICollectionItem<HSCollapse>[];
		$hsComboBoxCollection: ICollectionItem<HSComboBox>[];
		$hsDataTableCollection: ICollectionItem<HSDataTable>[];
		$hsDropdownCollection: ICollectionItem<HSDropdown>[];
		$hsFileUploadCollection: ICollectionItem<HSFileUpload>[];
		$hsInputNumberCollection: { id: number; element: HSInputNumber }[];
		$hsLayoutSplitterCollection: ICollectionItem<HSLayoutSplitter>[];
		$hsOverlayCollection: ICollectionItem<HSOverlay>[];
		$hsPinInputCollection: ICollectionItem<HSPinInput>[];
		$hsRemoveElementCollection: ICollectionItem<HSRemoveElement>[];
		$hsRangeSliderCollection: ICollectionItem<HSRangeSlider>[];
		$hsScrollNavCollection: ICollectionItem<HSScrollNav>[];
		$hsScrollspyCollection: ICollectionItem<HSScrollspy>[];
		$hsSelectCollection: ICollectionItem<HSSelect>[];
		$hsStepperCollection: ICollectionItem<HSStepper>[];
		$hsStrongPasswordCollection: ICollectionItem<HSStrongPassword>[];
		$hsTabsCollection: ICollectionItem<HSTabs>[];
		$hsTextareaAutoHeightCollection: ICollectionItem<HSTextareaAutoHeight>[];
		$hsThemeSwitchCollection: ICollectionItem<HSThemeSwitch>[];
		$hsToggleCountCollection: ICollectionItem<HSToggleCount>[];
		$hsTogglePasswordCollection: ICollectionItem<HSTogglePassword>[];
		$hsTooltipCollection: ICollectionItem<HSTooltip>[];
		$hsTreeViewCollection: ICollectionItem<HSTreeView>[];
	}
}

export {};
