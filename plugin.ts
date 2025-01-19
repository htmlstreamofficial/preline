/*
 * Plugin
 * @version: 2.7.0
 * @author: Preline Labs Ltd.
 * @requires: tailwindcss ^3.4.1
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';

module.exports = plugin(function ({ addVariant }: PluginAPI) {
	// Dropdown
	addVariant('hs-dropdown-open', [
		'.hs-dropdown.open > &',
		'.hs-dropdown.open > .hs-dropdown-toggle &',
		'.hs-dropdown.open > .hs-dropdown-menu > &',
		'.hs-dropdown-menu.open&',
	]);

	addVariant('hs-dropdown-item-disabled', [
		'.hs-dropdown.open > .hs-dropdown-menu .disabled &',
	]);

	addVariant('hs-dropdown-item-checked', [
		'.hs-dropdown.open > .hs-dropdown-menu [aria-checked="true"]&',
		'.hs-dropdown.open > .hs-dropdown-menu [aria-checked="true"] &',
	]);

	// Removing
	addVariant('hs-removing', [
		'.hs-removing&',
	]);

	// Tooltip
	addVariant('hs-tooltip-shown', [
		'.hs-tooltip.show &',
		'.hs-tooltip-content.show&',
	]);

	// Accordion
	addVariant('hs-accordion-active', [
		'.hs-accordion.active&',
		'.hs-accordion.active > &',
		'.hs-accordion.active > .hs-accordion-toggle &',
		'.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle &',
		'.hs-accordion.active > .hs-accordion-toggle&',
		'.hs-accordion.active > .hs-accordion-heading > .hs-accordion-toggle&',
		'.hs-accordion.active .hs-accordion-force-active&',
	]);

	addVariant('hs-accordion-selected', [
		'.hs-accordion .selected &',
	]);

	// Tree View
	addVariant('hs-tree-view-selected', [
		'[data-hs-tree-view-item].selected > &',
		'[data-hs-tree-view-item].selected&',
	]);

	addVariant('hs-tree-view-disabled', [
		'[data-hs-tree-view-item].disabled&',
		'[data-hs-tree-view-item].disabled > &',
	]);

	// Collapse
	addVariant('hs-collapse-open', [
		'.hs-collapse.open &',
		'.hs-collapse.open&',
		'.hs-collapse-toggle.open &',
		'.hs-collapse-toggle.open&',
	]);

	// Tab
	addVariant('hs-tab-active', [
		'[data-hs-tab].active&',
		'[data-hs-tab].active &',
	]);

	// Overlay
	addVariant('hs-overlay-open', [
		'.open&',
		'.open &',
	]);

	addVariant('hs-overlay-layout-open', [
		'.hs-overlay-body-open&',
		'.hs-overlay-body-open &',
	]);

	addVariant('hs-overlay-backdrop-open', [
		'.hs-overlay-backdrop&',
		'.hs-overlay-backdrop &',
	]);

	// Scrollspy
	addVariant('hs-scrollspy-active', [
		'.active&',
	]);

	// Carousel
	addVariant('hs-carousel-active', [
		'.active&',
		'.active &',
	]);

	addVariant('hs-carousel-disabled', [
		'.disabled&',
		'.disabled &',
	]);

	addVariant('hs-carousel-dragging', [
		'.dragging&',
		'.dragging &',
	]);

	// Selected
	addVariant('hs-selected', [
		'.selected&',
		'.selected &',
	]);

	// Select
	addVariant('hs-select-disabled', [
		'.disabled&',
		'.disabled &',
	]);

	addVariant('hs-select-active', [
		'.active&',
		'.active &',
	]);

	// Input number
	addVariant('hs-input-number-disabled', [
		'.disabled&',
		'.disabled &',
	]);

	// Pin input
	addVariant('hs-pin-input-active', [
		'.active&',
		'.active &',
	]);

	// Select opened
	addVariant('hs-select-opened', [
		'.opened&',
	]);

	// Password
	addVariant('hs-password-active', [
		'.active&',
		'.active &',
	]);

	// Stepper
	addVariant('hs-stepper-active', [
		'.active&',
		'.active &',
	]);

	addVariant('hs-stepper-success', [
		'.success&',
		'.success &',
	]);

	addVariant('hs-stepper-completed', [
		'.completed&',
		'.completed &',
	]);

	addVariant('hs-stepper-error', [
		'.error&',
		'.error &',
	]);

	addVariant('hs-stepper-processed', [
		'.processed&',
		'.processed &',
	]);

	addVariant('hs-stepper-disabled', [
		'.disabled&',
		'.disabled &',
	]);

	addVariant('hs-stepper-skipped', [
		'.skipped&',
		'.skipped &',
	]);

	// Strong password
	addVariant('hs-strong-password', [
		'.passed&',
		'.passed &',
	]);

	addVariant('hs-strong-password-accepted', [
		'.accepted&',
		'.accepted &',
	]);

	addVariant('hs-strong-password-active', [
		'.active&',
	]);

	// Combo box
	addVariant('hs-combo-box-active', [
		'.active &',
		'.active&',
	]);

	addVariant('hs-combo-box-has-value', [
		'.has-value &',
		'.has-value&',
	]);

	addVariant('hs-combo-box-selected', [
		'.selected &',
		'.selected&',
	]);

	addVariant('hs-combo-box-tab-active', [
		'.active&',
	]);

	// Apexcharts tooltip in dark mode
	addVariant('hs-apexcharts-tooltip-dark', [
		'.dark&',
	]);

	// Success / error
	addVariant('hs-success', [
		'.success &',
		'.success&',
	]);

	addVariant('hs-error', [
		'.error &',
		'.error&',
	]);

	// Layout splitter
	addVariant('hs-layout-splitter-dragging', [
		'.dragging &',
		'.dragging&',
	]);

	addVariant('hs-layout-splitter-prev-limit-reached', [
		'.prev-limit-reached &',
		'.prev-limit-reached&',
	]);

	addVariant('hs-layout-splitter-next-limit-reached', [
		'.next-limit-reached &',
		'.next-limit-reached&',
	]);

	addVariant('hs-layout-splitter-prev-pre-limit-reached', [
		'.prev-pre-limit-reached &',
		'.prev-pre-limit-reached&',
	]);

	addVariant('hs-layout-splitter-next-pre-limit-reached', [
		'.next-pre-limit-reached &',
		'.next-pre-limit-reached&',
	]);

	// Datatables
	addVariant('hs-datatable-ordering-asc', [
		'.dt-ordering-asc &',
		'.dt-ordering-asc&',
	]);

	addVariant('hs-datatable-ordering-desc', [
		'.dt-ordering-desc &',
		'.dt-ordering-desc&',
	]);

	// Sortable
	addVariant('hs-dragged', [
		'.dragged&',
	]);

	// noUiSlider
	addVariant('hs-range-slider-disabled', [
		'.disabled &',
		'.disabled&',
	]);

	// Dropzone
	addVariant('hs-file-upload-complete', [
		'.complete &',
		'.complete&',
	]);

	// Toastify
	addVariant('hs-toastify-on', [
		'.toastify.on &',
		'.toastify.on&',
	]);

	// Modes
	addVariant('hs-default-mode-active', [
		'.default &',
	]);

	addVariant('hs-dark-mode-active', [
		'.dark &',
	]);

	addVariant('hs-auto-mode-active', [
		'.auto &',
	]);
});
