/*
* HSTooltips
* @version: 1.4.0
* @author: HtmlStream
* @requires: @popperjs/core ^2.11.2
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2023 Htmlstream
*/

import Component from "../../core/Component";
import {createPopper} from "@popperjs/core";

class HSTooltip extends Component {
    constructor () {
        super('.hs-tooltip')
    }

    init () {
        document.addEventListener('click', e => {
            const $targetEl = e.target
            const $tooltipEl = $targetEl.closest(this.selector)
            
            if ($tooltipEl && this.getClassProperty($tooltipEl, '--trigger') === 'focus') this._focus($tooltipEl)
            if ($tooltipEl && this.getClassProperty($tooltipEl, '--trigger') === 'click') this._click($tooltipEl)
        })

        document.addEventListener('mousemove', e => {
            const $targetEl = e.target
            const $tooltipEl = $targetEl.closest(this.selector)

            if ($tooltipEl && this.getClassProperty($tooltipEl, '--trigger') !== 'focus' && this.getClassProperty($tooltipEl, '--trigger') !== 'click') this._hover($tooltipEl)
        })
    }

    _hover ($tooltipEl) {
        if ($tooltipEl.classList.contains('show')) return

        const $tooltipToggleEl = $tooltipEl.querySelector('.hs-tooltip-toggle')
        const $tooltipContentEl = $tooltipEl.querySelector('.hs-tooltip-content')
        const placement = this.getClassProperty($tooltipEl, '--placement')

        createPopper($tooltipToggleEl, $tooltipContentEl, {
            placement: placement || 'top',
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5]
                    }
                }
            ]
        })

        this.show($tooltipEl)

        const handleMouseoverOnTooltip = (e) => {
            if (e.relatedTarget.closest(this.selector) && e.relatedTarget.closest(this.selector) == $tooltipEl) return
            this.hide($tooltipEl)
            $tooltipEl.removeEventListener('mouseleave', handleMouseoverOnTooltip, true)
        }

        $tooltipEl.addEventListener('mouseleave', handleMouseoverOnTooltip, true)
    }

    _focus ($tooltipEl) {
        const $tooltipToggleEl = $tooltipEl.querySelector('.hs-tooltip-toggle')
        const $tooltipContentEl = $tooltipEl.querySelector('.hs-tooltip-content')
        const placement = this.getClassProperty($tooltipEl, '--placement')
        const strategy = this.getClassProperty($tooltipEl, '--strategy')

        createPopper($tooltipToggleEl, $tooltipContentEl, {
            placement: placement || 'top',
            strategy: strategy || 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5]
                    }
                }
            ]
        })

        this.show($tooltipEl)

        const handleMouseoverOnTooltip = () => {
            this.hide($tooltipEl)
            $tooltipEl.removeEventListener('blur', handleMouseoverOnTooltip, true)
        }


        $tooltipEl.addEventListener('blur', handleMouseoverOnTooltip, true)
    }

    _click ($tooltipEl) {
        if ($tooltipEl.classList.contains('show')) return

        const $tooltipToggleEl = $tooltipEl.querySelector('.hs-tooltip-toggle')
        const $tooltipContentEl = $tooltipEl.querySelector('.hs-tooltip-content')
        const placement = this.getClassProperty($tooltipEl, '--placement')
        const strategy = this.getClassProperty($tooltipEl, '--strategy')

        createPopper($tooltipToggleEl, $tooltipContentEl, {
            placement: placement || 'top',
            strategy: strategy || 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 5]
                    }
                }
            ]
        })

        this.show($tooltipEl)

        const handleMouseoverOnTooltip = (e) => {
            setTimeout(() => {
                this.hide($tooltipEl)
                $tooltipEl.removeEventListener('click', handleMouseoverOnTooltip, true)
                $tooltipEl.removeEventListener('blur', handleMouseoverOnTooltip, true)
            })
        }

        $tooltipEl.addEventListener('blur', handleMouseoverOnTooltip, true)
        $tooltipEl.addEventListener('click', handleMouseoverOnTooltip, true)
    }

    show ($tooltipEl) {
        const $tooltipContentEl = $tooltipEl.querySelector('.hs-tooltip-content')
        $tooltipContentEl.classList.remove('hidden')

        setTimeout(() => {
            $tooltipEl.classList.add('show')

            this._fireEvent('show', $tooltipEl)
            this._dispatch('show.hs.tooltip', $tooltipEl, $tooltipEl)
        })
    }

    hide ($tooltipEl) {
        const $tooltipContentEl = $tooltipEl.querySelector('.hs-tooltip-content')

        $tooltipEl.classList.remove('show')

        this._fireEvent('hide', $tooltipEl)
        this._dispatch('hide.hs.tooltip', $tooltipEl, $tooltipEl)

        this.afterTransition($tooltipContentEl, () => {
            if ($tooltipEl.classList.contains('show')) return
            $tooltipContentEl.classList.add('hidden')
        })
    }
}

window.HSTooltip = new HSTooltip()
document.addEventListener('load', window.HSTooltip.init())