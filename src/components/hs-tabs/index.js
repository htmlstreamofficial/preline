/*
 * HSTabs
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import Component from '../../core/Component';

class HSTabs extends Component {
  constructor() {
    super('[data-hs-tab]');
  }

  init() {
    document.addEventListener('keydown', this._keyboardSupport.bind(this));

    document.addEventListener('click', (e) => {
      const $targetEl = e.target;
      const $tabToggleEl = $targetEl.closest(this.selector);

      if ($tabToggleEl) {
        this.open($tabToggleEl);
      }
    });

    document.querySelectorAll('[hs-data-tab-select]').forEach(($tabNavWithSelectEl) => {
      const $selectEl = document.querySelector($tabNavWithSelectEl.getAttribute('hs-data-tab-select'));
      if (!$selectEl) return;

      $selectEl.addEventListener('change', (e) => {
        const $tabToggleEl = document.querySelector(`[data-hs-tab="${e.target.value}"]`);
        if (!$tabToggleEl) return;
        this.open($tabToggleEl);
      });
    });
  }

  open($tabToggleEl) {
    const $tabEl = document.querySelector($tabToggleEl.getAttribute('data-hs-tab'));
    const $tabToggleEls = [...$tabToggleEl.parentElement.children];
    const $tabEls = [...$tabEl.parentElement.children];
    const $tabNavWithSelectEl = $tabToggleEl.closest('[hs-data-tab-select]');
    const $selectEl = $tabNavWithSelectEl
      ? document.querySelector($tabNavWithSelectEl.getAttribute('data-hs-tab'))
      : null;

    $tabToggleEls.forEach(($tab) => $tab.classList.remove('active'));
    $tabEls.forEach(($tab) => $tab.classList.add('hidden'));

    $tabToggleEl.classList.add('active');
    $tabEl.classList.remove('hidden');

    this._fireEvent('change', $tabToggleEl);
    this._dispatch('change.hs.tab', $tabToggleEl, $tabToggleEl);

    if ($selectEl) {
      $selectEl.value = $tabToggleEl.getAttribute('data-hs-tab');
    }
  }

  _keyboardSupport(e) {
    const $tabButtonEl = e.target.closest(this.selector);
    if (!$tabButtonEl) return;

    const $navEl = $tabButtonEl.closest('[role="tablist"]');
    const vertical = $navEl.getAttribute('data-hs-tabs-vertical') === 'true';

    if (vertical ? e.keyCode === 38 : e.keyCode === 37) {
      e.preventDefault();
      return this._left($tabButtonEl);
    }

    if (vertical ? e.keyCode === 40 : e.keyCode === 39) {
      e.preventDefault();
      return this._right($tabButtonEl);
    }

    if (e.keyCode === 36) {
      e.preventDefault();
      return this._start($tabButtonEl);
    }

    if (e.keyCode === 35) {
      e.preventDefault();
      return this._end($tabButtonEl);
    }
  }

  _right($tabButtonEl) {
    const $navEl = $tabButtonEl.closest('[role="tablist"]');
    if (!$navEl) return;

    const buttons = [...$navEl.querySelectorAll(this.selector)].filter(($buttonEl) => !$buttonEl.disabled);
    const $activeButtonEl = $navEl.querySelector('button:focus');
    let acitveIndex = buttons.findIndex(($buttonEl) => $buttonEl === $activeButtonEl);

    if (acitveIndex + 1 < buttons.length) {
      acitveIndex++;
    } else {
      acitveIndex = 0;
    }

    buttons[acitveIndex].focus();
    this.open(buttons[acitveIndex]);
  }

  _left($tabButtonEl) {
    const $navEl = $tabButtonEl.closest('[role="tablist"]');
    if (!$navEl) return;

    const buttons = [...$navEl.querySelectorAll(this.selector)].filter(($buttonEl) => !$buttonEl.disabled).reverse();
    const $activeButtonEl = $navEl.querySelector('button:focus');
    let acitveIndex = buttons.findIndex(($buttonEl) => $buttonEl === $activeButtonEl);

    if (acitveIndex + 1 < buttons.length) {
      acitveIndex++;
    } else {
      acitveIndex = 0;
    }

    buttons[acitveIndex].focus();
    this.open(buttons[acitveIndex]);
  }

  _start($tabButtonEl) {
    const $navEl = $tabButtonEl.closest('[role="tablist"]');
    if (!$navEl) return;

    const buttons = [...$navEl.querySelectorAll(this.selector)].filter(($buttonEl) => !$buttonEl.disabled);

    if (buttons.length) {
      buttons[0].focus();
      this.open(buttons[0]);
    }
  }

  _end($tabButtonEl) {
    const $navEl = $tabButtonEl.closest('[role="tablist"]');
    if (!$navEl) return;

    const buttons = [...$navEl.querySelectorAll(this.selector)].reverse().filter(($buttonEl) => !$buttonEl.disabled);

    if (buttons.length) {
      buttons[0].focus();
      this.open(buttons[0]);
    }
  }
}

window.HSTabs = new HSTabs();
document.addEventListener('load', window.HSTabs.init());
