declare var _: any;
declare var DataTable: any;
declare var Dropzone: any;

let HSDataTableModule;
let HSFileUploadModule;

export { default as HSCopyMarkup } from './plugins/copy-markup';
export { default as HSAccordion } from './plugins/accordion';
export { default as HSCarousel } from './plugins/carousel';
export { default as HSCollapse } from './plugins/collapse';
export { default as HSComboBox } from './plugins/combobox';
export { default as HSDropdown } from './plugins/dropdown';
export { default as HSInputNumber } from './plugins/input-number';
export { default as HSOverlay } from './plugins/overlay';
export { default as HSPinInput } from './plugins/pin-input';
export { default as HSRemoveElement } from './plugins/remove-element';
export { default as HSScrollspy } from './plugins/scrollspy';
export { default as HSSelect } from './plugins/select';
export { default as HSStepper } from './plugins/stepper';
export { default as HSStrongPassword } from './plugins/strong-password';
export { default as HSTabs } from './plugins/tabs';
export { default as HSThemeSwitch } from './plugins/theme-switch';
export { default as HSToggleCount } from './plugins/toggle-count';
export { default as HSTogglePassword } from './plugins/toggle-password';
export { default as HSTooltip } from './plugins/tooltip';
export { default as HSStaticMethods } from './static';

if (typeof DataTable !== 'undefined' && typeof jQuery !== 'undefined')
	HSDataTableModule = require('./plugins/datatable').default;
else HSDataTableModule = null;
export { HSDataTableModule as HSDataTable };

if (typeof _ !== 'undefined' && typeof Dropzone !== 'undefined')
	HSFileUploadModule = require('./plugins/file-upload').default;
else HSFileUploadModule = null;
export { HSFileUploadModule as HSFileUpload };