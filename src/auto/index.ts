import HSAccessibilityObserver from "../plugins/accessibility-manager";

import "../plugins/copy-markup/auto";
import "../plugins/accordion/auto";
import "../plugins/carousel/auto";
import "../plugins/collapse/auto";
import "../plugins/combobox/auto";
import "../plugins/datatable/auto";
import "../plugins/datepicker/auto";
import "../plugins/dropdown/auto";
import "../plugins/file-upload/auto";
import "../plugins/input-number/auto";
import "../plugins/layout-splitter/auto";
import "../plugins/overlay/auto";
import "../plugins/pin-input/auto";
import "../plugins/range-slider/auto";
import "../plugins/remove-element/auto";
import "../plugins/scroll-nav/auto";
import "../plugins/scrollspy/auto";
import "../plugins/select/auto";
import "../plugins/stepper/auto";
import "../plugins/strong-password/auto";
import "../plugins/tabs/auto";
import "../plugins/textarea-auto-height/auto";
import "../plugins/theme-switch/auto";
import "../plugins/toggle-count/auto";
import "../plugins/toggle-password/auto";
import "../plugins/tooltip/auto";
import "../plugins/tree-view/auto";

import HSStaticMethods, { COLLECTIONS } from "./static-methods";

export { default as HSCopyMarkup } from "../plugins/copy-markup/core";
export { default as HSAccordion } from "../plugins/accordion/core";
export { default as HSCarousel } from "../plugins/carousel/core";
export { default as HSCollapse } from "../plugins/collapse/core";
export { default as HSComboBox } from "../plugins/combobox/core";
export { default as HSDataTable } from "../plugins/datatable/core";
export { default as HSDatepicker } from "../plugins/datepicker/core";
export { default as HSDropdown } from "../plugins/dropdown/core";
export { default as HSFileUpload } from "../plugins/file-upload/core";
export { default as HSInputNumber } from "../plugins/input-number/core";
export { default as HSLayoutSplitter } from "../plugins/layout-splitter/core";
export { default as HSOverlay } from "../plugins/overlay/core";
export { default as HSPinInput } from "../plugins/pin-input/core";
export { default as HSRangeSlider } from "../plugins/range-slider/core";
export { default as HSRemoveElement } from "../plugins/remove-element/core";
export { default as HSScrollNav } from "../plugins/scroll-nav/core";
export { default as HSScrollspy } from "../plugins/scrollspy/core";
export { default as HSSelect } from "../plugins/select/core";
export { default as HSStepper } from "../plugins/stepper/core";
export { default as HSStrongPassword } from "../plugins/strong-password/core";
export { default as HSTabs } from "../plugins/tabs/core";
export { default as HSTextareaAutoHeight } from "../plugins/textarea-auto-height/core";
export { default as HSThemeSwitch } from "../plugins/theme-switch/core";
export { default as HSToggleCount } from "../plugins/toggle-count/core";
export { default as HSTogglePassword } from "../plugins/toggle-password/core";
export { default as HSTooltip } from "../plugins/tooltip/core";
export { default as HSTreeView } from "../plugins/tree-view/core";

if (typeof window !== "undefined") {
	(window as any).HSAccessibilityObserver = new HSAccessibilityObserver();
	(window as any).HSStaticMethods = HSStaticMethods;
}

export { COLLECTIONS, HSStaticMethods };
export default HSStaticMethods;
