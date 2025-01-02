/*
 * @version: 2.7.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

declare var _: any;
declare var DataTable: any;
declare var Dropzone: any;
declare var noUiSlider: any;

let HSDataTableModule = null;
let HSFileUploadModule = null;
let HSRangeSliderModule = null;

export { default as HSCopyMarkup } from './plugins/copy-markup';
export { default as HSAccordion } from './plugins/accordion';
export { default as HSCarousel } from './plugins/carousel';
export { default as HSCollapse } from './plugins/collapse';
export { default as HSComboBox } from './plugins/combobox';
export { default as HSDropdown } from './plugins/dropdown';
export { default as HSInputNumber } from './plugins/input-number';
export { default as HSLayoutSplitter } from './plugins/layout-splitter';
export { default as HSOverlay } from './plugins/overlay';
export { default as HSPinInput } from './plugins/pin-input';
export { default as HSRemoveElement } from './plugins/remove-element';
export { default as HSScrollspy } from './plugins/scrollspy';
export { default as HSSelect } from './plugins/select';
export { default as HSStepper } from './plugins/stepper';
export { default as HSStrongPassword } from './plugins/strong-password';
export { default as HSTabs } from './plugins/tabs';
export { default as HSTextareaAutoHeight } from './plugins/textarea-auto-height';
export { default as HSThemeSwitch } from './plugins/theme-switch';
export { default as HSToggleCount } from './plugins/toggle-count';
export { default as HSTogglePassword } from './plugins/toggle-password';
export { default as HSTooltip } from './plugins/tooltip';
export { default as HSTreeView } from './plugins/tree-view';
export { default as HSStaticMethods } from './static';

(async () => {
	if (typeof DataTable !== 'undefined' && typeof jQuery !== 'undefined') {
		HSDataTableModule = (await import('./plugins/datatable')).default;
	}

	if (typeof _ !== 'undefined' && typeof Dropzone !== 'undefined') {
		HSFileUploadModule = (await import('./plugins/file-upload')).default;
	}

	if (typeof noUiSlider !== 'undefined') {
		HSRangeSliderModule = (await import('./plugins/range-slider')).default;
	}
})();

export { HSDataTableModule as HSDataTable };
export { HSFileUploadModule as HSFileUpload };
export { HSRangeSliderModule as HSRangeSlider };
