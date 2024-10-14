/*
 * HSStaticMethods
 * @version: 2.5.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { getClassProperty, afterTransition } from '../utils';
import { COLLECTIONS } from '../spa/index';
import { IStaticMethods } from '../static/interfaces';
import { ICollectionItem } from '../interfaces';
import type HSCopyMarkup from '../plugins/copy-markup';
import type HSAccordion from '../plugins/accordion';
import type HSCarousel from '../plugins/carousel';
import type HSCollapse from '../plugins/collapse';
import type HSComboBox from '../plugins/combobox';
import type HSDataTable from '../plugins/datatable';
import type HSDropdown from '../plugins/dropdown';
import type HSFileUpload from '../plugins/file-upload';
import type HSInputNumber from '../plugins/input-number';
import type HSOverlay from '../plugins/overlay';
import type HSPinInput from '../plugins/pin-input';
import type HSRangeSlider from '../plugins/range-slider';
import type HSRemoveElement from '../plugins/remove-element';
import type HSScrollspy from '../plugins/scrollspy';
import type HSSelect from '../plugins/select';
import type HSStepper from '../plugins/stepper';
import type HSStrongPassword from '../plugins/strong-password';
import type HSTabs from '../plugins/tabs';
import type HSTextareaAutoHeight from '../plugins/textarea-auto-height';
import type HSThemeSwitch from '../plugins/theme-switch';
import type HSToggleCount from '../plugins/toggle-count';
import type HSTogglePassword from '../plugins/toggle-password';
import type HSTooltip from '../plugins/tooltip';
import type HSTreeView from '../plugins/tree-view';

declare global {
	interface Window {
		HSStaticMethods: IStaticMethods;
		$hsCopyMarkupCollection: ICollectionItem<HSCopyMarkup>[];
		$hsAccordionCollection: ICollectionItem<HSAccordion>[];
		$hsCarouselCollection: ICollectionItem<HSCarousel>[];
		$hsCollapseCollection: ICollectionItem<HSCollapse>[];
		$hsComboBoxCollection: ICollectionItem<HSComboBox>[];
		$hsDataTableCollection: ICollectionItem<HSDataTable>[];
		$hsDropdownCollection: ICollectionItem<HSDropdown>[];
		$hsFileUploadCollection: ICollectionItem<HSFileUpload>[];
		$hsInputNumberCollection: { id: number; element: HSInputNumber }[];
		$hsOverlayCollection: ICollectionItem<HSOverlay>[];
		$hsPinInputCollection: ICollectionItem<HSPinInput>[];
		$hsRangeSliderCollection: ICollectionItem<HSRangeSlider>[];
		$hsRemoveElementCollection: ICollectionItem<HSRemoveElement>[];
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

const HSStaticMethods: IStaticMethods = {
	getClassProperty,
	afterTransition,
	autoInit(collection: string | string[] = 'all') {
		if (collection === 'all') {
			COLLECTIONS.forEach(({ fn }) => {
				fn?.autoInit();
			});
		} else {
			COLLECTIONS.forEach(({ key, fn }) => {
				if (collection.includes(key)) fn?.autoInit();
			});
		}
	},
	cleanCollection(name: string | string[] = 'all') {
		if (name === 'all') {
			COLLECTIONS.forEach(({ collection }) => {
				if ((window as any)[collection] instanceof Array) {
					(window as any)[collection] = [];
				}
			});
		} else {
			COLLECTIONS.forEach(({ key, collection }) => {
				if (
					name.includes(key) &&
					(window as any)[collection] instanceof Array
				) {
					(window as any)[collection] = [];
				}
			});
		}
	},
};

if (typeof window !== 'undefined') {
	window.HSStaticMethods = HSStaticMethods;
}

export default HSStaticMethods;
