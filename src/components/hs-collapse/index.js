/*
 * HSCollapse
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import Component from '../../core/Component';

class HSCollapse extends Component {
  constructor() {
    super('[data-hs-collapse]');
  }

  init() {
    document.addEventListener('click', (e) => {
      const $targetEl = e.target;
      const $collapseToggleEl = $targetEl.closest(this.selector);

      if ($collapseToggleEl) {
        const collapseEls = document.querySelectorAll($collapseToggleEl.getAttribute('data-hs-collapse'));

        this.toggle(collapseEls);
      }
    });
  }

  toggle($collapseEls) {
    if (!$collapseEls.length) return;

    [...$collapseEls].forEach(($collapseEl) => {
      $collapseEl.classList.contains('hidden') ? this.show($collapseEl) : this.hide($collapseEl);
    });
  }

  show($collapseEl) {
    $collapseEl.classList.add('open');
    $collapseEl.classList.remove('hidden');
    $collapseEl.style.height = 0;

    document.querySelectorAll(this.selector).forEach(($toggleEl) => {
      if ($collapseEl.closest($toggleEl.getAttribute('data-hs-collapse'))) {
        $toggleEl.classList.add('open');
      }
    });

    $collapseEl.style.height = `${$collapseEl.scrollHeight}px`;

    this.afterTransition($collapseEl, () => {
      if (!$collapseEl.classList.contains('open')) return;

      $collapseEl.style.height = '';

      this._fireEvent('open', $collapseEl);
      this._dispatch('open.hs.collapse', $collapseEl, $collapseEl);
    });
  }

  hide($collapseEl) {
    $collapseEl.style.height = `${$collapseEl.scrollHeight}px`;

    setTimeout(() => {
      $collapseEl.style.height = 0;
    });

    $collapseEl.classList.remove('open');

    this.afterTransition($collapseEl, () => {
      if ($collapseEl.classList.contains('open')) return;
      $collapseEl.classList.add('hidden');
      $collapseEl.style.height = null;

      this._fireEvent('hide', $collapseEl);
      this._dispatch('hide.hs.collapse', $collapseEl, $collapseEl);

      $collapseEl.querySelectorAll('.hs-mega-menu-content.block').forEach(($megaMenuEl) => {
        $megaMenuEl.classList.remove('block');
        $megaMenuEl.classList.add('hidden');
      });
    });

    document.querySelectorAll(this.selector).forEach(($toggleEl) => {
      if ($collapseEl.closest($toggleEl.getAttribute('data-hs-collapse'))) {
        $toggleEl.classList.remove('open');
      }
    });
  }
}

window.HSCollapse = new HSCollapse();
document.addEventListener('load', window.HSCollapse.init());
