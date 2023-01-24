/*
 * HSAccordion
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import Component from '../../core/Component';

class HSAccordion extends Component {
  constructor() {
    super('.hs-accordion');
  }

  init() {
    document.addEventListener('click', (e) => {
      const $targetEl = e.target;
      const $accordionEl = $targetEl.closest(this.selector);
      const $accordionToggleEl = $targetEl.closest('.hs-accordion-toggle');
      const $accordionGroupEl = $targetEl.closest('.hs-accordion-group');
      if ($accordionEl && $accordionGroupEl && $accordionToggleEl) {
        this._hideAll($accordionEl);

        this.show($accordionEl);
      }
    });
  }

  show($accordionEl) {
    if ($accordionEl.classList.contains('active')) {
      return this.hide($accordionEl);
    }

    $accordionEl.classList.add('active');

    const $accordionContentEl = $accordionEl.querySelector('.hs-accordion-content');

    $accordionContentEl.style.display = 'block';
    $accordionContentEl.style.height = 0;
    setTimeout(() => {
      $accordionContentEl.style.height = `${$accordionContentEl.scrollHeight}px`;
    });

    this.afterTransition($accordionContentEl, () => {
      if (!$accordionEl.classList.contains('active')) return;
      $accordionContentEl.style.height = '';

      this._fireEvent('open', $accordionEl);
      this._dispatch('open.hs.accordion', $accordionEl, $accordionEl);
    });
  }

  hide($accordionEl) {
    const $accordionContentEl = $accordionEl.querySelector('.hs-accordion-content');

    $accordionContentEl.style.height = `${$accordionContentEl.scrollHeight}px`;
    setTimeout(() => {
      $accordionContentEl.style.height = 0;
    });

    this.afterTransition($accordionContentEl, () => {
      if ($accordionEl.classList.contains('active')) return;
      $accordionContentEl.style.display = '';

      this._fireEvent('hide', $accordionEl);
      this._dispatch('hide.hs.accordion', $accordionEl, $accordionEl);
    });

    $accordionEl.classList.remove('active');
  }

  _hideAll($currentaccordionEl) {
    const $accordionGroupEl = $currentaccordionEl.closest('.hs-accordion-group');

    if ($accordionGroupEl.hasAttribute('data-hs-accordion-always-open')) return;

    $accordionGroupEl.querySelectorAll(this.selector).forEach(($accordionEl) => {
      if ($currentaccordionEl !== $accordionEl) {
        this.hide($accordionEl);
      }
    });
  }
}

window.HSAccordion = new HSAccordion();
document.addEventListener('load', window.HSAccordion.init());
