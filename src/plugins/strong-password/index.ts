/*
 * HSStrongPassword
 * @version: 3.2.3
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import {
	isEnoughSpace,
	dispatch,
	htmlToElement,
	classToClassList,
} from '../../utils';

import {
	IStrongPasswordOptions,
	IStrongPassword,
} from '../strong-password/interfaces';

import HSBasePlugin from '../base-plugin';
import { ICollectionItem } from '../../interfaces';

class HSStrongPassword
	extends HSBasePlugin<IStrongPasswordOptions>
	implements IStrongPassword
{
	private readonly target: string | HTMLInputElement | null;
	private readonly hints: string | HTMLElement | null;
	private readonly stripClasses: string | null;
	private readonly minLength: number;
	private readonly mode: string;
	private readonly popoverSpace: number;
	private readonly checksExclude: string[] | null;
	private readonly specialCharactersSet: string | null;

	public isOpened: boolean = false;
	private strength: number = 0;
	private passedRules: Set<string> = new Set<string>();
	private weakness: HTMLElement | null;
	private rules: HTMLElement[] | null;
	private availableChecks: string[] | null;

	private onTargetInputListener: (evt: InputEvent) => void;
	private onTargetFocusListener: () => void;
	private onTargetBlurListener: () => void;
	private onTargetInputSecondListener: () => void;
	private onTargetInputThirdListener: () => void;

	constructor(el: HTMLElement, options?: IStrongPasswordOptions) {
		super(el, options);

		const data = el.getAttribute('data-hs-strong-password');
		const dataOptions: IStrongPasswordOptions = data ? JSON.parse(data) : {};
		const concatOptions = {
			...dataOptions,
			...options,
		};

		this.target = concatOptions?.target
			? typeof concatOptions?.target === 'string'
				? (document.querySelector(concatOptions.target) as HTMLInputElement)
				: concatOptions.target
			: null;
		this.hints = concatOptions?.hints
			? typeof concatOptions?.hints === 'string'
				? (document.querySelector(concatOptions.hints) as HTMLElement)
				: concatOptions.hints
			: null;
		this.stripClasses = concatOptions?.stripClasses || null;
		this.minLength = concatOptions?.minLength || 6;
		this.mode = concatOptions?.mode || 'default';
		this.popoverSpace = concatOptions?.popoverSpace || 10;
		this.checksExclude = concatOptions?.checksExclude || [];
		this.availableChecks = [
			'lowercase',
			'uppercase',
			'numbers',
			'special-characters',
			'min-length',
		].filter((el) => !this.checksExclude.includes(el));
		this.specialCharactersSet =
			concatOptions?.specialCharactersSet ||
			'!"#$%&\'()*+,-./:;<=>?@[\\\\\\]^_`{|}~';

		if (this.target) this.init();
	}

	private targetInput(evt: InputEvent) {
		this.setStrength((evt.target as HTMLInputElement).value);
	}

	private targetFocus() {
		this.isOpened = true;
		(this.hints as HTMLElement).classList.remove('hidden');
		(this.hints as HTMLElement).classList.add('block');

		this.recalculateDirection();
	}

	private targetBlur() {
		this.isOpened = false;
		(this.hints as HTMLElement).classList.remove(
			'block',
			'bottom-full',
			'top-full',
		);
		(this.hints as HTMLElement).classList.add('hidden');
		(this.hints as HTMLElement).style.marginTop = '';
		(this.hints as HTMLElement).style.marginBottom = '';
	}

	private targetInputSecond() {
		this.setWeaknessText();
	}

	private targetInputThird() {
		this.setRulesText();
	}

	private init() {
		this.createCollection(window.$hsStrongPasswordCollection, this);

		if (this.availableChecks.length) this.build();
	}

	private build() {
		this.buildStrips();
		if (this.hints) this.buildHints();

		this.setStrength((this.target as HTMLInputElement).value);

		this.onTargetInputListener = (evt) => this.targetInput(evt);

		(this.target as HTMLInputElement).addEventListener(
			'input',
			this.onTargetInputListener,
		);
	}

	private buildStrips() {
		this.el.innerHTML = '';

		if (this.stripClasses) {
			for (let i = 0; i < this.availableChecks.length; i++) {
				const newStrip = htmlToElement('<div></div>');
				classToClassList(this.stripClasses, newStrip);

				this.el.append(newStrip);
			}
		}
	}

	private buildHints() {
		this.weakness =
			(this.hints as HTMLElement).querySelector(
				'[data-hs-strong-password-hints-weakness-text]',
			) || null;
		this.rules =
			Array.from(
				(this.hints as HTMLElement).querySelectorAll(
					'[data-hs-strong-password-hints-rule-text]',
				),
			) || null;

		this.rules.forEach((rule) => {
			const ruleValue = rule.getAttribute(
				'data-hs-strong-password-hints-rule-text',
			);

			if (this.checksExclude?.includes(ruleValue)) rule.remove();
		});

		if (this.weakness) this.buildWeakness();
		if (this.rules) this.buildRules();
		if (this.mode === 'popover') {
			this.onTargetFocusListener = () => this.targetFocus();
			this.onTargetBlurListener = () => this.targetBlur();

			(this.target as HTMLInputElement).addEventListener(
				'focus',
				this.onTargetFocusListener,
			);
			(this.target as HTMLInputElement).addEventListener(
				'blur',
				this.onTargetBlurListener,
			);
		}
	}

	private buildWeakness() {
		this.checkStrength((this.target as HTMLInputElement).value);
		this.setWeaknessText();

		this.onTargetInputSecondListener = () =>
			setTimeout(() => this.targetInputSecond());

		(this.target as HTMLInputElement).addEventListener(
			'input',
			this.onTargetInputSecondListener,
		);
	}

	private buildRules() {
		this.setRulesText();

		this.onTargetInputThirdListener = () =>
			setTimeout(() => this.targetInputThird());

		(this.target as HTMLInputElement).addEventListener(
			'input',
			this.onTargetInputThirdListener,
		);
	}

	private setWeaknessText() {
		const weaknessText = this.weakness.getAttribute(
			'data-hs-strong-password-hints-weakness-text',
		);
		const weaknessTextToJson = JSON.parse(weaknessText as string);

		this.weakness.textContent = weaknessTextToJson[this.strength];
	}

	private setRulesText() {
		this.rules.forEach((rule) => {
			const ruleValue = rule.getAttribute(
				'data-hs-strong-password-hints-rule-text',
			);

			this.checkIfPassed(rule, this.passedRules.has(ruleValue));
		});
	}

	private togglePopover() {
		const popover = this.el.querySelector('.popover');

		if (popover) popover.classList.toggle('show');
	}

	private checkStrength(val: string): { strength: number; rules: Set<string> } {
		const passedRules = new Set<string>();
		const regexps = {
			lowercase: /[a-z]+/,
			uppercase: /[A-Z]+/,
			numbers: /[0-9]+/,
			'special-characters': new RegExp(`[${this.specialCharactersSet}]`),
		};
		let strength = 0;

		if (
			this.availableChecks.includes('lowercase') &&
			val.match(regexps['lowercase'])
		) {
			strength += 1;
			passedRules.add('lowercase');
		}
		if (
			this.availableChecks.includes('uppercase') &&
			val.match(regexps['uppercase'])
		) {
			strength += 1;
			passedRules.add('uppercase');
		}
		if (
			this.availableChecks.includes('numbers') &&
			val.match(regexps['numbers'])
		) {
			strength += 1;
			passedRules.add('numbers');
		}
		if (
			this.availableChecks.includes('special-characters') &&
			val.match(regexps['special-characters'])
		) {
			strength += 1;
			passedRules.add('special-characters');
		}
		if (
			this.availableChecks.includes('min-length') &&
			val.length >= this.minLength
		) {
			strength += 1;
			passedRules.add('min-length');
		}
		if (!val.length) {
			strength = 0;
		}

		if (strength === this.availableChecks.length)
			this.el.classList.add('accepted');
		else this.el.classList.remove('accepted');

		this.strength = strength;
		this.passedRules = passedRules;

		return {
			strength: this.strength,
			rules: this.passedRules,
		};
	}

	private checkIfPassed(el: HTMLElement, isRulePassed = false) {
		const check = el.querySelector('[data-check]');
		const uncheck = el.querySelector('[data-uncheck]');

		if (isRulePassed) {
			el.classList.add('active');
			check.classList.remove('hidden');
			uncheck.classList.add('hidden');
		} else {
			el.classList.remove('active');
			check.classList.add('hidden');
			uncheck.classList.remove('hidden');
		}
	}

	private setStrength(val: string) {
		const { strength, rules } = this.checkStrength(val);
		const payload = {
			strength,
			rules,
		};

		this.hideStrips(strength);

		this.fireEvent('change', payload);
		dispatch('change.hs.strongPassword', this.el, payload);
	}

	private hideStrips(qty: number) {
		Array.from(this.el.children).forEach((el: HTMLElement, i: number) => {
			if (i < qty) el.classList.add('passed');
			else el.classList.remove('passed');
		});
	}

	// Public methods
	public recalculateDirection() {
		if (
			isEnoughSpace(
				this.hints as HTMLElement,
				this.target as HTMLInputElement,
				'bottom',
				this.popoverSpace,
			)
		) {
			(this.hints as HTMLElement).classList.remove('bottom-full');
			(this.hints as HTMLElement).classList.add('top-full');
			(this.hints as HTMLElement).style.marginBottom = '';
			(this.hints as HTMLElement).style.marginTop = `${this.popoverSpace}px`;
		} else {
			(this.hints as HTMLElement).classList.remove('top-full');
			(this.hints as HTMLElement).classList.add('bottom-full');
			(this.hints as HTMLElement).style.marginTop = '';
			(this.hints as HTMLElement).style.marginBottom = `${this.popoverSpace}px`;
		}
	}

	public destroy() {
		// Remove listeners
		(this.target as HTMLInputElement).removeEventListener(
			'input',
			this.onTargetInputListener,
		);
		(this.target as HTMLInputElement).removeEventListener(
			'focus',
			this.onTargetFocusListener,
		);
		(this.target as HTMLInputElement).removeEventListener(
			'blur',
			this.onTargetBlurListener,
		);
		(this.target as HTMLInputElement).removeEventListener(
			'input',
			this.onTargetInputSecondListener,
		);
		(this.target as HTMLInputElement).removeEventListener(
			'input',
			this.onTargetInputThirdListener,
		);

		window.$hsStrongPasswordCollection =
			window.$hsStrongPasswordCollection.filter(
				({ element }) => element.el !== this.el,
			);
	}

	// Static methods
	static getInstance(target: HTMLElement | string, isInstance?: boolean) {
		const elInCollection = window.$hsStrongPasswordCollection.find(
			(el) =>
				el.element.el ===
				(typeof target === 'string' ? document.querySelector(target) : target),
		);

		return elInCollection
			? isInstance
				? elInCollection
				: elInCollection.element.el
			: null;
	}

	static autoInit() {
		if (!window.$hsStrongPasswordCollection)
			window.$hsStrongPasswordCollection = [];

		if (window.$hsStrongPasswordCollection)
			window.$hsStrongPasswordCollection =
				window.$hsStrongPasswordCollection.filter(({ element }) =>
					document.contains(element.el),
				);

		document
			.querySelectorAll(
				'[data-hs-strong-password]:not(.--prevent-on-load-init)',
			)
			.forEach((el: HTMLElement) => {
				if (
					!window.$hsStrongPasswordCollection.find(
						(elC) => (elC?.element?.el as HTMLElement) === el,
					)
				) {
					const data = el.getAttribute('data-hs-strong-password');
					const options: IStrongPasswordOptions = data ? JSON.parse(data) : {};

					new HSStrongPassword(el, options);
				}
			});
	}
}

declare global {
	interface Window {
		HSStrongPassword: Function;
		$hsStrongPasswordCollection: ICollectionItem<HSStrongPassword>[];
	}
}

window.addEventListener('load', () => {
	HSStrongPassword.autoInit();

	// Uncomment for debug
	// console.log('Strong password collection:', window.$hsStrongPasswordCollection);
});

document.addEventListener('scroll', () => {
	if (!window.$hsStrongPasswordCollection) return false;

	const target = window.$hsStrongPasswordCollection.find(
		(el) => el.element.isOpened,
	);

	if (target) target.element.recalculateDirection();
});

if (typeof window !== 'undefined') {
	window.HSStrongPassword = HSStrongPassword;
}

export default HSStrongPassword;
