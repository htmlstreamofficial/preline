/*
 * HSDropdown
 * @version: 1.3.0
 * @author: HtmlStream
 * @requires: @popperjs/core ^2.11.2
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import { createPopper } from '@popperjs/core';
import Component from '../../core/Component';
import MenuSearchHistory from '../../core/utils/MenuSearchHistory';

const isIOS = () => {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  } else {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  }
};

const isIpadOS = () => {
  return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
};

class HSDropdown extends Component {
  constructor() {
    super('.hs-dropdown');

    this.positions = {
      top: 'top',
      'top-left': 'top-start',
      'top-right': 'top-end',
      bottom: 'bottom',
      'bottom-left': 'bottom-start',
      'bottom-right': 'bottom-end',
      right: 'right',
      'right-top': 'right-start',
      'right-bottom': 'right-end',
      left: 'left',
      'left-top': 'left-start',
      'left-bottom': 'left-end',
    };
    this.absoluteStrategyModifiers = ($dropdownEl) => {
      return [
        {
          name: 'applyStyles',
          fn: (data) => {
            const strategy = (
              window.getComputedStyle($dropdownEl).getPropertyValue('--strategy') || 'absolute'
            ).replace(' ', '');
            const adaptive = (
              window.getComputedStyle($dropdownEl).getPropertyValue('--adaptive') || 'adaptive'
            ).replace(' ', '');

            data.state.elements.popper.style.position = strategy;
            data.state.elements.popper.style.transform =
              adaptive === 'adaptive' ? data.state.styles.popper.transform : null;
            data.state.elements.popper.style.top = null;
            data.state.elements.popper.style.bottom = null;
            data.state.elements.popper.style.left = null;
            data.state.elements.popper.style.right = null;
            data.state.elements.popper.style.margin = 0;
          },
        },
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
          },
        },
      ];
    };
    this._history = MenuSearchHistory;
  }

  init() {
    document.addEventListener('click', (e) => {
      const $targetEl = e.target;
      const $dropdownEl = $targetEl.closest(this.selector);
      const $menuEl = $targetEl.closest('.hs-dropdown-menu');

      if (!$dropdownEl || !$dropdownEl.classList.contains('open')) this._closeOthers($dropdownEl);

      if ($menuEl) {
        const autoClose = (window.getComputedStyle($dropdownEl).getPropertyValue('--auto-close') || '').replace(
          ' ',
          ''
        );
        if ((autoClose == 'false' || autoClose == 'inside') && !$dropdownEl.parentElement.closest(this.selector))
          return;
      }

      if ($dropdownEl) {
        !$dropdownEl.classList.contains('open') ? this.open($dropdownEl) : this.close($dropdownEl);
      }
    });

    document.addEventListener('mousemove', (e) => {
      const $targetEl = e.target;
      const $dropdownEl = $targetEl.closest(this.selector);
      const $menuEl = $targetEl.closest('.hs-dropdown-menu');

      if ($dropdownEl) {
        const trigger = (window.getComputedStyle($dropdownEl).getPropertyValue('--trigger') || 'click').replace(
          ' ',
          ''
        );
        if (trigger !== 'hover') return;

        if (!$dropdownEl || !$dropdownEl.classList.contains('open')) this._closeOthers($dropdownEl);
        if (trigger === 'hover' && !$dropdownEl.classList.contains('open') && !isIOS() && !isIpadOS())
          this._hover($targetEl);
      }
    });

    document.addEventListener('keydown', this._keyboardSupport.bind(this));

    window.addEventListener('resize', () => {
      const dropdownEls = document.querySelectorAll('.hs-dropdown.open');
      dropdownEls.forEach(($dropdownEl) => {
        this.close($dropdownEl, true);
      });
    });
  }

  _closeOthers($currentDropdownEl = null) {
    const $collection = document.querySelectorAll(`${this.selector}.open`);
    $collection.forEach(($dropdownEl) => {
      if ($currentDropdownEl && $currentDropdownEl.closest('.hs-dropdown.open') === $dropdownEl) return;

      const autoClose = (window.getComputedStyle($dropdownEl).getPropertyValue('--auto-close') || '').replace(' ', '');
      if (autoClose == 'false' || autoClose == 'outside') return;

      this.close($dropdownEl);
    });
  }

  _hover($targetEl) {
    const $dropdownEl = $targetEl.closest(this.selector);

    this.open($dropdownEl);

    const handleMousmove = (e) => {
      if (
        !e.target.closest(this.selector) ||
        e.target.closest(this.selector) === $dropdownEl.parentElement.closest(this.selector)
      ) {
        this.close($dropdownEl);
        document.removeEventListener('mousemove', handleMousmove, true);
      }
    };

    document.addEventListener('mousemove', handleMousmove, true);
  }

  close($dropdownEl, noAnimation = false) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');

    const destroy = () => {
      if ($dropdownEl.classList.contains('open')) return;
      $menuEl.classList.remove('block');
      $menuEl.classList.add('hidden');
      $menuEl.style.inset = null;
      $menuEl.style.position = null;

      if ($dropdownEl._popper) {
        $dropdownEl._popper.destroy();
      }
    };

    if (!noAnimation) {
      this.afterTransition($dropdownEl.querySelector('[data-hs-dropdown-transition]') || $menuEl, () => {
        destroy();
      });
    }

    $menuEl.style.margin = null;
    $dropdownEl.classList.remove('open');

    if (noAnimation) {
      destroy();
    }

    this._fireEvent('close', $dropdownEl);
    this._dispatch('close.hs.dropdown', $dropdownEl, $dropdownEl);

    const dropdownEls = $menuEl.querySelectorAll('.hs-dropdown.open');
    dropdownEls.forEach(($dropdownEl) => {
      this.close($dropdownEl, true);
    });
  }

  open($dropdownEl) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const placement = (window.getComputedStyle($dropdownEl).getPropertyValue('--placement') || '').replace(' ', '');
    const strategy = (window.getComputedStyle($dropdownEl).getPropertyValue('--strategy') || 'fixed').replace(' ', '');
    const adaptive = (window.getComputedStyle($dropdownEl).getPropertyValue('--adaptive') || 'adaptive').replace(
      ' ',
      ''
    );
    const offset = parseInt(
      (window.getComputedStyle($dropdownEl).getPropertyValue('--offset') || '10').replace(' ', '')
    );

    if (strategy !== 'static') {
      if ($dropdownEl._popper) {
        $dropdownEl._popper.destroy();
      }

      const $popper = createPopper($dropdownEl, $menuEl, {
        placement: this.positions[placement] || 'bottom-start',
        strategy: strategy,
        modifiers: [
          ...(strategy !== 'fixed' ? this.absoluteStrategyModifiers($dropdownEl) : []),
          {
            name: 'offset',
            options: {
              offset: [0, offset],
            },
          },
        ],
      });

      $dropdownEl._popper = $popper;
    }

    $menuEl.style.margin = null;
    $menuEl.classList.add('block');
    $menuEl.classList.remove('hidden');

    setTimeout(() => {
      $dropdownEl.classList.add('open');
    });

    this._fireEvent('open', $dropdownEl);
    this._dispatch('open.hs.dropdown', $dropdownEl, $dropdownEl);
  }

  _keyboardSupport(e) {
    const $dropdownEl = document.querySelector('.hs-dropdown.open');
    if (!$dropdownEl) return;

    if (e.keyCode === 27) {
      e.preventDefault();
      return this._esc($dropdownEl);
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      return this._down($dropdownEl);
    }
    if (e.keyCode === 38) {
      e.preventDefault();
      return this._up($dropdownEl);
    }

    if (e.keyCode === 36) {
      e.preventDefault();
      return this._start($dropdownEl);
    }

    if (e.keyCode === 35) {
      e.preventDefault();
      return this._end($dropdownEl);
    }

    this._byChar($dropdownEl, e.key);
  }

  _esc($dropdownEl) {
    this.close($dropdownEl);
  }

  _up($dropdownEl) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const links = [...$menuEl.querySelectorAll('a')].reverse().filter(($linkEl) => !$linkEl.disabled);
    const $activeLinkEl = $menuEl.querySelector('a:focus');
    let acitveIndex = links.findIndex(($linkEl) => $linkEl === $activeLinkEl);

    if (acitveIndex + 1 < links.length) {
      acitveIndex++;
    }

    links[acitveIndex].focus();
  }

  _down($dropdownEl) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const links = [...$menuEl.querySelectorAll('a')].filter(($linkEl) => !$linkEl.disabled);
    const $activeLinkEl = $menuEl.querySelector('a:focus');
    let acitveIndex = links.findIndex(($linkEl) => $linkEl === $activeLinkEl);

    if (acitveIndex + 1 < links.length) {
      acitveIndex++;
    }

    links[acitveIndex].focus();
  }

  _start($dropdownEl) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const links = [...$menuEl.querySelectorAll('a')].filter(($linkEl) => !$linkEl.disabled);

    if (links.length) {
      links[0].focus();
    }
  }

  _end($dropdownEl) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const links = [...$menuEl.querySelectorAll('a')].reverse().filter(($linkEl) => !$linkEl.disabled);

    if (links.length) {
      links[0].focus();
    }
  }

  _byChar($dropdownEl, char) {
    const $menuEl = $dropdownEl.querySelector('.hs-dropdown-menu');
    const links = [...$menuEl.querySelectorAll('a')];
    const getActiveIndex = () => {
      return links.findIndex(
        ($linkEl, index) =>
          $linkEl.innerText.toLowerCase().charAt(0) === char.toLowerCase() && this._history.existsInHistory(index)
      );
    };

    let acitveIndex = getActiveIndex();

    if (acitveIndex === -1) {
      this._history.clearHistory();
      acitveIndex = getActiveIndex();
    }

    if (acitveIndex !== -1) {
      links[acitveIndex].focus();
      this._history.addHistory(acitveIndex);
    }
  }

  toggle($dropdownEl) {
    $dropdownEl.classList.contains('open') ? this.close($dropdownEl) : this.open($dropdownEl);
  }
}

window.HSDropdown = new HSDropdown();
document.addEventListener('load', window.HSDropdown.init());
