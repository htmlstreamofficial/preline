import { ISpaCollectionItem } from './interfaces';

import HSCopyMarkup from '../plugins/copy-markup';
import HSAccordion from '../plugins/accordion';
import HSCarousel from '../plugins/carousel';
import HSCollapse from '../plugins/collapse';
import HSComboBox from '../plugins/combobox';
import HSDataTable from '../plugins/datatable';
import HSDropdown from '../plugins/dropdown';
import HSFileUpload from '../plugins/file-upload';
import HSInputNumber from '../plugins/input-number';
import HSOverlay from '../plugins/overlay';
import HSPinInput from '../plugins/pin-input';
import HSRemoveElement from '../plugins/remove-element';
import HSScrollspy from '../plugins/scrollspy';
import HSSelect from '../plugins/select';
import HSStepper from '../plugins/stepper';
import HSStrongPassword from '../plugins/strong-password';
import HSTabs from '../plugins/tabs';
import HSThemeSwitch from '../plugins/theme-switch';
import HSToggleCount from '../plugins/toggle-count';
import HSTogglePassword from '../plugins/toggle-password';
import HSTooltip from '../plugins/tooltip';

export const COLLECTIONS: ISpaCollectionItem[] = [
	{
		key: 'copy-markup',
		fn: HSCopyMarkup,
		collection: '$hsCopyMarkupCollection',
	},
	{ key: 'accordion', fn: HSAccordion, collection: '$hsAccordionCollection' },
	{ key: 'carousel', fn: HSCarousel, collection: '$hsCarouselCollection' },
	{ key: 'collapse', fn: HSCollapse, collection: '$hsCollapseCollection' },
	{ key: 'combobox', fn: HSComboBox, collection: '$hsComboBoxCollection' },
	{ key: 'datatable', fn: HSDataTable, collection: '$hsDataTableCollection' },
	{ key: 'dropdown', fn: HSDropdown, collection: '$hsDropdownCollection' },
	{
		key: 'file-upload',
		fn: HSFileUpload,
		collection: '$hsFileUploadCollection',
	},
	{
		key: 'input-number',
		fn: HSInputNumber,
		collection: '$hsInputNumberCollection',
	},
	{ key: 'overlay', fn: HSOverlay, collection: '$hsOverlayCollection' },
	{ key: 'pin-input', fn: HSPinInput, collection: '$hsPinInputCollection' },
	{
		key: 'remove-element',
		fn: HSRemoveElement,
		collection: '$hsRemoveElementCollection',
	},
	{ key: 'scrollspy', fn: HSScrollspy, collection: '$hsScrollspyCollection' },
	{ key: 'select', fn: HSSelect, collection: '$hsSelectCollection' },
	{ key: 'stepper', fn: HSStepper, collection: '$hsStepperCollection' },
	{
		key: 'strong-password',
		fn: HSStrongPassword,
		collection: '$hsStrongPasswordCollection',
	},
	{ key: 'tabs', fn: HSTabs, collection: '$hsTabsCollection' },
	{
		key: 'theme-switch',
		fn: HSThemeSwitch,
		collection: '$hsThemeSwitchCollection',
	},
	{
		key: 'toggle-count',
		fn: HSToggleCount,
		collection: '$hsToggleCountCollection',
	},
	{
		key: 'toggle-password',
		fn: HSTogglePassword,
		collection: '$hsTogglePasswordCollection',
	},
	{ key: 'tooltip', fn: HSTooltip, collection: '$hsTooltipCollection' },
];
