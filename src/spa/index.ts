import { ISpaCollectionItem } from './interfaces';

import HSCopyMarkup from '../plugins/copy-markup';
import HSAccordion from '../plugins/accordion';
import HSCarousel from '../plugins/carousel';
import HSCollapse from '../plugins/collapse';
import HSDropdown from '../plugins/dropdown';
import HSInputNumber from '../plugins/input-number';
import HSOverlay from '../plugins/overlay';
import HSPinInput from '../plugins/pin-input';
import HSRemoveElement from '../plugins/remove-element';
import HSScrollspy from '../plugins/scrollspy';
import HSSelect from '../plugins/select';
import HSStepper from '../plugins/stepper';
import HSStrongPassword from '../plugins/strong-password';
import HSTabs from '../plugins/tabs';
import HSToggleCount from '../plugins/toggle-count';
import HSTogglePassword from '../plugins/toggle-password';
import HSTooltip from '../plugins/tooltip';

export const COLLECTIONS: ISpaCollectionItem[] = [
	{ key: 'copy-markup', fn: HSCopyMarkup },
	{ key: 'accordion', fn: HSAccordion },
	{ key: 'carousel', fn: HSCarousel },
	{ key: 'collapse', fn: HSCollapse },
	{ key: 'dropdown', fn: HSDropdown },
	{ key: 'input-number', fn: HSInputNumber },
	{ key: 'overlay', fn: HSOverlay },
	{ key: 'pin-input', fn: HSPinInput },
	{ key: 'remove-element', fn: HSRemoveElement },
	{ key: 'scrollspy', fn: HSScrollspy },
	{ key: 'select', fn: HSSelect },
	{ key: 'stepper', fn: HSStepper },
	{ key: 'strong-password', fn: HSStrongPassword },
	{ key: 'tabs', fn: HSTabs },
	{ key: 'toggle-count', fn: HSToggleCount },
	{ key: 'toggle-password', fn: HSTogglePassword },
	{ key: 'tooltip', fn: HSTooltip },
];
