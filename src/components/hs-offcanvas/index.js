/*
* HSOffcanvas
* @version: 1.0.0
* @author: HtmlStream
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/

import Component from '../../core/Component'

class HSOffcanvas extends Component {
    constructor () {
        super('[data-hs-offcanvas]')
    }

    init () {
        document.addEventListener('click', e => {
            const $targetEl = e.target
            const $offcanvasToggleEl = $targetEl.closest(this.selector)

            if ($offcanvasToggleEl) {
                this.toggle(document.querySelector($offcanvasToggleEl.getAttribute('data-hs-offcanvas')))
            }
        })

        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                const $openedOffcanvasEl = document.querySelector('.hs-offcanvas.show')
                if (!$openedOffcanvasEl) return

                ($openedOffcanvasEl.getAttribute('data-hs-offcanvas-keyboard') !== 'false')
                    ? this.close($openedOffcanvasEl)
                    : null
            }
        })
    }

    toggle ($offcanvasEl) {
        if (!$offcanvasEl) return

        !$offcanvasEl.classList.contains('show')
            ? this.open($offcanvasEl)
            : this.close($offcanvasEl)
    }

    open ($offcanvasEl) {
        if (!$offcanvasEl) return

        const $openedOffcanvasEl = document.querySelector('.hs-offcanvas.show')
        const disabledScroll = $offcanvasEl.getAttribute('data-hs-offcanvas-scroll') !== 'true'

        if ($openedOffcanvasEl) {
            return this.close($openedOffcanvasEl)
                .then(() => this.open($offcanvasEl))
        }

        this._buildBackdrop($offcanvasEl)

        $offcanvasEl.classList.remove('hidden')

        setTimeout(() => {
            if (disabledScroll) {
                document.body.style.overflow = 'hidden'
            }

            $offcanvasEl.classList.add('show')
            this._fireEvent('show', $offcanvasEl)
            this._dispatch('open.hs.offcanvas', $offcanvasEl, $offcanvasEl)
            $offcanvasEl.classList.remove('hidden')
        })
    }

    close ($offcanvasEl) {
        return new Promise((resolve) => {
            if (!$offcanvasEl) return

            $offcanvasEl.classList.remove('show')

            this.afterTransition($offcanvasEl, () => {
                if ($offcanvasEl.classList.contains('show')) return
                $offcanvasEl.classList.add('hidden')
                this._destroyBackdrop()
                this._fireEvent('close', $offcanvasEl)
                this._dispatch('close.hs.offcanvas', $offcanvasEl, $offcanvasEl)
                document.body.style.overflow = ''
                resolve($offcanvasEl)
            })
        })
    }

    _buildBackdrop ($offcanvasEl) {
        const backdropSelector = $offcanvasEl.getAttribute('data-hs-offcanvas-backdrop-container') || false
        const closeOnBackdrop = $offcanvasEl.getAttribute('data-hs-offcanvas-close-on-backdrop') !== 'false'
        const disableBackdrop = $offcanvasEl.getAttribute('data-hs-offcanvas-backdrop') === 'false'

        if (disableBackdrop) return

        let $backdropEl = document.createElement('div')

        backdropSelector
            ? $backdropEl = document.querySelector(backdropSelector).cloneNode(true)
            : $backdropEl.className = 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 transition duration fixed inset-0 z-50'

        if (backdropSelector) {
            $backdropEl.classList.remove('hidden')
        }

        if (closeOnBackdrop) {
            $backdropEl.addEventListener('click', () => this.close($offcanvasEl), true)
        }

        $backdropEl.setAttribute('data-hs-offcanvas-backdrop-template', '')
        document.body.appendChild($backdropEl)
    }
    
    _destroyBackdrop () {
        const $backdropEl = document.querySelector('[data-hs-offcanvas-backdrop-template]')

        if (!$backdropEl) return

        $backdropEl.classList.add('opacity-0')

        this.afterTransition($backdropEl, () => {
            $backdropEl.remove()
        })
    }
}

window.HSOffcanvas = new HSOffcanvas()
document.addEventListener('load', window.HSOffcanvas.init())