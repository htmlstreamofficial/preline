import { ISpaCollectionItem } from './interfaces';

const HSAccordionFn = require('../plugins/accordion').HSAccordion;
const HSCarouselFn = require('../plugins/carousel').HSCarousel;
const HSCollapseFn = require('../plugins/collapse').HSCollapse;
const HSCopyMarkupFn = require('../plugins/copy-markup').HSCopyMarkup;
const HSDropdownFn = require('../plugins/dropdown').HSDropdown;
const HSInputNumberFn = require('../plugins/input-number').HSInputNumber;
const HSOverlayFn = require('../plugins/overlay').HSOverlay;
const HSPinInputFn = require('../plugins/pin-input').HSPinInput;
const HSRemoveElementFn = require('../plugins/remove-element').HSRemoveElement;
const HSScrollspyFn = require('../plugins/scrollspy').HSScrollspy;
const HSSelectFn = require('../plugins/select').HSSelect;
const HSStepperFn = require('../plugins/stepper').HSStepper;
const HSStrongPasswordFn = require('../plugins/strong-password').HSStrongPassword;
const HSTabsFn = require('../plugins/tabs').HSTabs;
const HSToggleCountFn = require('../plugins/toggle-count').HSToggleCount;
const HSTogglePasswordFn = require('../plugins/toggle-password').HSTogglePassword;
const HSTooltipFn = require('../plugins/tooltip').HSTooltip;

export const COLLECTIONS: ISpaCollectionItem[] = [
	{ key: 'accordion', fn: HSAccordionFn },
	{ key: 'carousel', fn: HSCarouselFn },
	{ key: 'collapse', fn: HSCollapseFn },
	{ key: 'copy-markup', fn: HSCopyMarkupFn },
	{ key: 'dropdown', fn: HSDropdownFn },
	{ key: 'input-number', fn: HSInputNumberFn },
	{ key: 'overlay', fn: HSOverlayFn },
	{ key: 'pin-input', fn: HSPinInputFn },
	{ key: 'remove-element', fn: HSRemoveElementFn },
	{ key: 'scrollspy', fn: HSScrollspyFn },
	{ key: 'select', fn: HSSelectFn },
	{ key: 'stepper', fn: HSStepperFn },
	{ key: 'strong-password', fn: HSStrongPasswordFn },
	{ key: 'tabs', fn: HSTabsFn },
	{ key: 'toggle-count', fn: HSToggleCountFn },
	{ key: 'toggle-password', fn: HSTogglePasswordFn },
	{ key: 'tooltip', fn: HSTooltipFn },
];
