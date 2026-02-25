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

if (typeof window !== "undefined") {
	(window as any).HSAccessibilityObserver = new HSAccessibilityObserver();
	(window as any).HSStaticMethods = HSStaticMethods;
}

export { COLLECTIONS, HSStaticMethods };
export default HSStaticMethods;
