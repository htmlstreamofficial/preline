/*
 * HSThemeSwitch
 * @version: 2.1.0
 * @author: HTMLStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 HTMLStream
 */
import { IThemeSwitchOptions, IThemeSwitch } from './interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSThemeSwitch
	extends HSBasePlugin<IThemeSwitchOptions>
	implements IThemeSwitch
{
	public theme: string;
	private readonly themeSet: string[];

	constructor(el: HTMLElement, options?: IThemeSwitchOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-theme-switch');
		const dataOptions: IThemeSwitchOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.theme =
			concatOptions?.theme || localStorage.getItem('hs_theme') || 'default';
		this.themeSet = ['light', 'dark', 'default'];

		this.init();
	}

	private init() {
		this.createCollection(window.$hsThemeSwitchCollection, this);

		if (this.theme !== 'default') this.setAppearance();
	}

	private setResetStyles() {
		const style = document.createElement('style');

		style.innerText = `*{transition: unset !important;}`;
		style.setAttribute('data-hs-appearance-onload-styles', '');

		document.head.appendChild(style);

		return style;
	}

	private addSystemThemeObserver() {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', ({ matches }) => {
				if (matches) this.setAppearance('dark', false);
				else this.setAppearance('default', false);
			});
	}

	private removeSystemThemeObserver() {
		window.matchMedia('(prefers-color-scheme: dark)').removeEventListener;
	}

	// Public methods
	public setAppearance(
		theme = this.theme,
		isSaveToLocalStorage = true,
		isSetDispatchEvent = true,
	) {
		const html = document.querySelector('html');
		const resetStyles = this.setResetStyles();

		if (isSaveToLocalStorage) localStorage.setItem('hs_theme', theme);
		if (theme === 'auto')
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'default';

		html.classList.remove('light', 'dark', 'default', 'auto');
		html.classList.add(theme);

		setTimeout(() => resetStyles.remove());

		if (isSetDispatchEvent)
			window.dispatchEvent(
				new CustomEvent('on-hs-appearance-change', { detail: theme }),
			);
	}

	// Static methods
	static getInstance(target: HTMLElement | string) {
		const elInCollection = window.$hsThemeSwitchCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection ? elInCollection.element : null;
	}

	static autoInit() {
		if (!window.$hsThemeSwitchCollection) window.$hsThemeSwitchCollection = [];

		const toggleObserveSystemTheme = (el: HSThemeSwitch) => {
			if (localStorage.getItem('hs_theme') === 'auto')
				el.addSystemThemeObserver();
			else el.removeSystemThemeObserver();
		};

		document
			.querySelectorAll('[data-hs-theme-switch]:not(.--prevent-on-load-init)')
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsThemeSwitchCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const switchTheme = new HSThemeSwitch(el);
					(switchTheme.el as HTMLInputElement).checked =
						switchTheme.theme === 'dark';

					toggleObserveSystemTheme(switchTheme);

					switchTheme.el.addEventListener('change', (evt) => {
						const theme = (evt.target as HTMLInputElement).checked
							? 'dark'
							: 'default';
						switchTheme.setAppearance(theme);

						toggleObserveSystemTheme(switchTheme);
					});
				}
			});

		document
			.querySelectorAll(
				'[data-hs-theme-click-value]:not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLElement) => {
				const theme = el.getAttribute('data-hs-theme-click-value');
				const switchTheme = new HSThemeSwitch(el);

				toggleObserveSystemTheme(switchTheme);

				switchTheme.el.addEventListener('click', () => {
					switchTheme.setAppearance(theme);

					toggleObserveSystemTheme(switchTheme);
				});
			});
	}
}

declare global {
	interface Window {
		HSThemeSwitch: Function;
		$hsThemeSwitchCollection: ICollectionItem<HSThemeSwitch>[];
	}
}

window.addEventListener('load', () => {
	HSThemeSwitch.autoInit();

	// Uncomment for debug
	// console.log('Theme switch collection:', window.$hsThemeSwitchCollection);
});

if (window.$hsThemeSwitchCollection) {
	window.addEventListener(
		'on-hs-appearance-change',
		(evt: Event & { detail: string }) => {
			window.$hsThemeSwitchCollection.forEach((el) => {
				(el.element.el as HTMLInputElement).checked = evt.detail === 'dark';
			});
		},
	);
}

if (typeof window !== 'undefined') {
	window.HSThemeSwitch = HSThemeSwitch;
}

export default HSThemeSwitch;
