import type INoUiSlider from "nouislider";

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
		HSAccessibilityObserver: any;
		HSStaticMethods: any;

		HSCopyMarkup: any;
		HSAccordion: any;
		HSCarousel: any;
		HSCollapse: any;
		HSComboBox: any;
		HSDataTable: any;
		HSDatepicker: any;
		HSDropdown: any;
		HSFileUpload: any;
		HSInputNumber: any;
		HSLayoutSplitter: any;
		HSOverlay: any;
		HSPinInput: any;
		HSRangeSlider: any;
		HSRemoveElement: any;
		HSScrollNav: any;
		HSScrollspy: any;
		HSSelect: any;
		HSStepper: any;
		HSStrongPassword: any;
		HSTabs: any;
		HSTextareaAutoHeight: any;
		HSThemeSwitch: any;
		HSToggleCount: any;
		HSTogglePassword: any;
		HSTooltip: any;
		HSTreeView: any;

		$hsCopyMarkupCollection: any[];
		$hsAccordionCollection: any[];
		$hsCarouselCollection: any[];
		$hsCollapseCollection: any[];
		$hsComboBoxCollection: any[];
		$hsDataTableCollection: any[];
		$hsDatepickerCollection: any[];
		$hsDropdownCollection: any[];
		$hsFileUploadCollection: any[];
		$hsInputNumberCollection: any[];
		$hsLayoutSplitterCollection: any[];
		$hsOverlayCollection: any[];
		$hsPinInputCollection: any[];
		$hsRemoveElementCollection: any[];
		$hsRangeSliderCollection: any[];
		$hsScrollNavCollection: any[];
		$hsScrollspyCollection: any[];
		$hsSelectCollection: any[];
		$hsStepperCollection: any[];
		$hsStrongPasswordCollection: any[];
		$hsTabsCollection: any[];
		$hsTextareaAutoHeightCollection: any[];
		$hsThemeSwitchCollection: any[];
		$hsToggleCountCollection: any[];
		$hsTogglePasswordCollection: any[];
		$hsTooltipCollection: any[];
		$hsTreeViewCollection: any[];
	}
}

export {};
