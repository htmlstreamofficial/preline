/*
 * HSOverlay
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Htmlstream Libraries (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import Component from '../../core/Component';

class HSOverlay extends Component {
  constructor() {
    super('[data-hs-overlay]');

    this.openNextOverlay = false;
  }

  init() {
    document.addEventListener('click', (e) => {
      const $targetEl = e.target;
      const $overlayToggleEl = $targetEl.closest(this.selector);
      const $closeOverlayTriggerEl = e.target.closest('[data-hs-overlay-close]');
      const $openedOverlayEl = e.target.getAttribute('aria-overlay') === 'true';

      if ($closeOverlayTriggerEl) {
        return this.close($closeOverlayTriggerEl.closest('.hs-overlay.open'));
      }

      if ($overlayToggleEl) {
        return this.toggle(document.querySelector($overlayToggleEl.getAttribute('data-hs-overlay')));
      }

      if ($openedOverlayEl) {
        this._onBackdropClick(e.target);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        const $openedOverlayEl = document.querySelector('.hs-overlay.open');
        if (!$openedOverlayEl) return;

        setTimeout(() => {
          $openedOverlayEl.getAttribute('data-hs-overlay-keyboard') !== 'false' ? this.close($openedOverlayEl) : null;
        });
      }
    });
  }

  toggle($overlayEl) {
    if (!$overlayEl) return;

    $overlayEl.classList.contains('hidden') ? this.open($overlayEl) : this.close($overlayEl);
  }

  open($overlayEl) {
    if (!$overlayEl) return;

    const $openedOverlayEl = document.querySelector('.hs-overlay.open');
    const disabledScroll = this.getClassProperty($overlayEl, '--body-scroll', 'false') !== 'true';

    if ($openedOverlayEl) {
      this.openNextOverlay = true;
      return this.close($openedOverlayEl).then(() => {
        this.open($overlayEl);
        this.openNextOverlay = false;
      });
    }

    if (disabledScroll) {
      document.body.style.overflow = 'hidden';
    }

    this._buildBackdrop($overlayEl);
    this._checkTimer($overlayEl);
    this._autoHide($overlayEl);

    $overlayEl.classList.remove('hidden');
    $overlayEl.setAttribute('aria-overlay', 'true');
    $overlayEl.setAttribute('tabindex', '-1');

    setTimeout(() => {
      if ($overlayEl.classList.contains('hidden')) return;
      $overlayEl.classList.add('open');
      this._fireEvent('open', $overlayEl);
      this._dispatch('open.hs.overlay', $overlayEl, $overlayEl);
      this._focusInput($overlayEl);
    }, 50);
  }

  close($overlayEl) {
    return new Promise((resolve) => {
      if (!$overlayEl) return;

      $overlayEl.classList.remove('open');
      $overlayEl.removeAttribute('aria-overlay');
      $overlayEl.removeAttribute('tabindex', '-1');

      this.afterTransition($overlayEl, () => {
        if ($overlayEl.classList.contains('open')) return;
        $overlayEl.classList.add('hidden');
        this._destroyBackdrop();
        this._fireEvent('close', $overlayEl);
        this._dispatch('close.hs.overlay', $overlayEl, $overlayEl);
        document.body.style.overflow = '';
        resolve($overlayEl);
      });
    });
  }

  _autoHide($overlayEl) {
    const time = parseInt(this.getClassProperty($overlayEl, '--auto-hide', '0'));

    if (time) {
      $overlayEl.autoHide = setTimeout(() => {
        this.close($overlayEl);
      }, time);
    }
  }

  _checkTimer($overlayEl) {
    if ($overlayEl.autoHide) {
      clearTimeout($overlayEl.autoHide);
      delete $overlayEl.autoHide;
    }
  }

  _onBackdropClick($overlayEl) {
    const closeOnBackdrop = this.getClassProperty($overlayEl, '--overlay-backdrop', 'true') !== 'static';

    if (closeOnBackdrop) {
      this.close($overlayEl);
    }
  }

  _buildBackdrop($overlayEl) {
    const backdropSelector = $overlayEl.getAttribute('data-hs-overlay-backdrop-container') || false;
    let $backdropEl = document.createElement('div');
    let backdropClasses =
      'transition duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop';

    for (const value of $overlayEl.classList.values()) {
      if (value.startsWith('hs-overlay-backdrop-open:')) {
        backdropClasses += ` ${value}`;
      }
    }

    const closeOnBackdrop = this.getClassProperty($overlayEl, '--overlay-backdrop', 'true') !== 'static';
    const disableBackdrop = this.getClassProperty($overlayEl, '--overlay-backdrop', 'true') === 'false';

    if (disableBackdrop) return;

    if (backdropSelector) {
      $backdropEl = document.querySelector(backdropSelector).cloneNode(true);
      $backdropEl.classList.remove('hidden');
      backdropClasses = $backdropEl.classList;
      $backdropEl.classList = '';
    }

    if (closeOnBackdrop) {
      $backdropEl.addEventListener('click', () => this.close($overlayEl), true);
    }

    $backdropEl.setAttribute('data-hs-overlay-backdrop-template', '');
    document.body.appendChild($backdropEl);

    setTimeout(() => {
      $backdropEl.classList = backdropClasses;
    });
  }

  _destroyBackdrop() {
    const $backdropEl = document.querySelector('[data-hs-overlay-backdrop-template]');

    if (!$backdropEl) return;

    if (this.openNextOverlay) {
      $backdropEl.style.transitionDuration = `${
        parseFloat(window.getComputedStyle($backdropEl).transitionDuration.replace(/[^\d.-]/g, '')) * 1.8
      }s`;
    }

    $backdropEl.classList.add('opacity-0');

    this.afterTransition($backdropEl, () => {
      $backdropEl.remove();
    });
  }

  _focusInput($overlayEl) {
    const $inputWithAutoFocusEl = $overlayEl.querySelector('[autofocus]');
    if ($inputWithAutoFocusEl) $inputWithAutoFocusEl.focus();
  }
}

window.HSOverlay = new HSOverlay();
document.addEventListener('load', window.HSOverlay.init());
