/*
* HSSideabr
* @version: 1.0.0
* @author: HtmlStream
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/

import Component from '../../core/Component'

class HSSideabr extends Component {
    constructor () {
        super('[data-hs-sidebar]')
    }

    init () {
        document.addEventListener('click', e => {
            const $targetEl = e.target
            const $sidebarToggleEl = $targetEl.closest(this.selector)

            if ($sidebarToggleEl) {
                this.toggle(document.querySelector($sidebarToggleEl.getAttribute('data-hs-sidebar')))
            }
        })

        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                const $openedSidebarEl = document.querySelector('.hs-sidebar.show')
                if (!$openedSidebarEl) return

                ($openedSidebarEl.getAttribute('data-hs-sidebar-keyboard') !== 'false')
                    ? this.close($openedSidebarEl)
                    : null
            }
        })

        window.addEventListener('resize', () => {
            const $openedSidebarEl = document.querySelector('.hs-sidebar.show')
            if (!$openedSidebarEl) return
            this.close($openedSidebarEl)
        })
    }

    toggle ($sidebarEl) {
        if (!$sidebarEl) return

        !$sidebarEl.classList.contains('show')
            ? this.open($sidebarEl)
            : this.close($sidebarEl)
    }

    open ($sidebarEl) {
        if (!$sidebarEl) return

        const $openedSidebarEl = document.querySelector('.hs-sidebar.show')
        const disabledScroll = $sidebarEl.getAttribute('data-hs-sidebar-scroll') !== 'true'

        if ($openedSidebarEl) {
            return this.close($openedSidebarEl)
                .then(() => this.open($sidebarEl))
        }

        this._buildBackdrop($sidebarEl)

        $sidebarEl.classList.remove('hidden')

        setTimeout(() => {
            if (disabledScroll) {
                document.body.style.overflow = 'hidden'
            }

            $sidebarEl.classList.add('show')
            document.body.classList.add('sidebar-open')
            this._fireEvent('show', $sidebarEl)
            this._dispatch('open.hs.sidebarl', $sidebarEl, $sidebarEl)
        })
    }

    close ($sidebarEl) {
        return new Promise((resolve) => {
            if (!$sidebarEl) return

            $sidebarEl.classList.remove('show')
            document.body.classList.remove('sidebar-open')

            this.afterTransition($sidebarEl, () => {
                $sidebarEl.classList.add('hidden')
                this._destroyBackdrop()
                this._fireEvent('close', $sidebarEl)
                this._dispatch('close.hs.sidebarl', $sidebarEl, $sidebarEl)
                document.body.style.overflow = ''
                resolve($sidebarEl)
            })
        })
    }

    _buildBackdrop ($sidebarEl) {
        const backdropSelector = $sidebarEl.getAttribute('data-hs-sidebar-backdrop-container') || false
        const closeOnBackdrop = $sidebarEl.getAttribute('data-hs-sidebar-close-on-backdrop') !== 'false'
        const disableBackdrop = $sidebarEl.getAttribute('data-hs-sidebar-backdrop') === 'false'

        if (disableBackdrop) return

        let $backdropEl = document.createElement('div')

        backdropSelector
            ? $backdropEl = document.querySelector(backdropSelector).cloneNode(true)
            : $backdropEl.className = 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 transition duration fixed inset-0 z-50'

        if (backdropSelector) {
            $backdropEl.classList.remove('hidden')
        }

        if (closeOnBackdrop) {
            $backdropEl.addEventListener('click', () => this.close($sidebarEl), true)
        }

        $backdropEl.setAttribute('data-hs-sidebar-backdrop-template', '')
        document.body.appendChild($backdropEl)
    }
    
    _destroyBackdrop () {
        const $backdropEl = document.querySelector('[data-hs-sidebar-backdrop-template]')
        if (!$backdropEl) return

        $backdropEl.classList.add('opacity-0')

        this.afterTransition($backdropEl, () => {
            $backdropEl.remove()
        })
    }
}

window.HSSideabr = new HSSideabr()
document.addEventListener('load', window.HSSideabr.init())