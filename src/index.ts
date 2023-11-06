const CopyMarkup = require('./plugins/copy-markup');

const Accordion = require('./plugins/accordion');
const BunchCheck = require('./plugins/bunch-check');
const Carousel = require('./plugins/carousel');
const Collapse = require('./plugins/collapse');
const Dropdown = require('./plugins/dropdown');
const InputMask = require('./plugins/input-mask');
const InputNumber = require('./plugins/input-number');
const Overlay = require('./plugins/overlay');
const PinInput = require('./plugins/pin-input');
const RemoveElement = require('./plugins/remove-element');
const SearchByJson = require('./plugins/search-by-json');
const Scrollspy = require('./plugins/scrollspy');
const Select = require('./plugins/select');
const Stepper = require('./plugins/stepper');
const StrongPassword = require('./plugins/strong-password');
const Tabs = require('./plugins/tabs');
const ThemeSwitch = require('./plugins/theme-switch');
const ToggleCount = require('./plugins/toggle-count');
const TogglePassword = require('./plugins/toggle-password');
const Tooltip = require('./plugins/tooltip');

module.exports = {
	HSCopyMarkup: CopyMarkup.HSCopyMarkup,
	
	HSAccordion: Accordion.HSAccordion,
	HSBunchCheck: BunchCheck.HSBunchCheck,
	HSCarousel: Carousel.HSCarousel,
	HSCollapse: Collapse.HSCollapse,
	HSDropdown: Dropdown.HSDropdown,
	HSInputMask: InputMask.HSInputMask,
	HSInputNumber: InputNumber.HSInputNumber,
	HSOverlay: Overlay.HSOverlay,
	HSPinInput: PinInput.HSPinInput,
	HSRemoveElement: RemoveElement.HSRemoveElement,
	HSSearchByJson: SearchByJson.HSSearchByJson,
	HSScrollspy: Scrollspy.HSScrollspy,
	HSSelect: Select.HSSelect,
	HSStepper: Stepper.HSStepper,
	HSStrongPassword: StrongPassword.HSStrongPassword,
	HSTabs: Tabs.HSTabs,
	HSThemeSwitch: ThemeSwitch.HSThemeSwitch,
	HSToggleCount: ToggleCount.HSToggleCount,
	HSTogglePassword: TogglePassword.HSTogglePassword,
	HSTooltip: Tooltip.HSTooltip,
};
