/*
* HSSmoothScroll
* @version: 1.0.0
* @author: HtmlStream
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/

import Component from '../../core/Component'

class HSSmoothScroll extends Component {
    constructor () {
        super('[data-hs-smooth-scroll-to]')
    }

    init () {
        document.querySelectorAll(this.selector)
            .forEach(this.scroll)
    }

    scroll ($scrollEl) {
        const $targetEl = $scrollEl.querySelector($scrollEl.getAttribute('data-hs-smooth-scroll-to'))
        if (!$targetEl) return

        const topOffset = $scrollEl.getAttribute('data-hs-smooth-scroll-offset') || 0
        const top = $targetEl.getBoundingClientRect().top - topOffset

        $scrollEl.scrollTo({
            behavior: 'smooth',
            top: top
        })
    }
}

window.HSSmoothScroll = new HSSmoothScroll()
document.addEventListener('load', window.HSSmoothScroll.init())