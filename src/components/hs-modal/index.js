/*
* HSModal
* @version: 1.0.0
* @author: HtmlStream
* @license: Htmlstream Libraries (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/


import Component from '../../core/Component'

class HSModal extends Component {
    constructor() {
        super('[data-hs-modal]')

        this.openNextModal = false
    }

    init() {
        document.addEventListener('click', e => {
            const $targetEl = e.target
            const $modalToggleEl = $targetEl.closest(this.selector)
            const $closeModalTriggerEl = e.target.closest('[data-hs-modal-close]')
            const $openedModalEl = e.target.getAttribute('aria-modal') === 'true'

            if ($closeModalTriggerEl) {
                return this.close($closeModalTriggerEl.closest('.hs-modal.open'))
            }

            if ($modalToggleEl) {
                return this.toggle(document.querySelector($modalToggleEl.getAttribute('data-hs-modal')))
            }

            if ($openedModalEl) {
                this._onBackdropClick(e.target)
            }
        })

        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                const $openedModalEl = document.querySelector('.hs-modal.open')
                if (!$openedModalEl) return

                setTimeout(() => {
                    ($openedModalEl.getAttribute('data-hs-modal-keyboard') !== 'false')
                        ? this.close($openedModalEl)
                        : null
                })
            }
        })
    }

    toggle($modalEl) {
        if (!$modalEl) return

        $modalEl.classList.contains('hidden')
            ? this.open($modalEl)
            : this.close($modalEl)
    }

    open($modalEl) {
        if (!$modalEl) return

        const $openedModalEl = document.querySelector('.hs-modal.open')

        if ($openedModalEl) {
            this.openNextModal = true
            return this.close($openedModalEl)
                .then(() => {
                    this.open($modalEl)
                    this.openNextModal = false
                })
        }

        document.body.style.overflow = 'hidden'

        this._buildBackdrop($modalEl)

        $modalEl.classList.remove('hidden')
        $modalEl.setAttribute('aria-modal', 'true')
        $modalEl.setAttribute('tabindex', '-1')

        setTimeout(() => {
            if ($modalEl.classList.contains('hidden')) return
            $modalEl.classList.add('open')
            this._fireEvent('open', $modalEl)
            this._dispatch('open.hs.modal', $modalEl, $modalEl)
            this._focusInput($modalEl)
        }, 50)
    }

    close($modalEl) {
        return new Promise((resolve) => {
            if (!$modalEl) return

            $modalEl.classList.remove('open')
            $modalEl.removeAttribute('aria-modal')
            $modalEl.removeAttribute('tabindex', '-1')

            this.afterTransition($modalEl.firstElementChild, () => {
                $modalEl.classList.add('hidden')
                this._destroyBackdrop()
                this._fireEvent('close', $modalEl)
                this._dispatch('close.hs.modal', $modalEl, $modalEl)
                document.body.style.overflow = ''
                resolve($modalEl)
            })
        })
    }

    _onBackdropClick($modalEl) {
        const closeOnBackdrop = $modalEl.getAttribute('data-hs-modal-backdrop') != 'static'
        if (closeOnBackdrop) {
            this.close($modalEl)
        }
    }

    _buildBackdrop($modalEl) {
        const backdropSelector = $modalEl.getAttribute('data-hs-modal-backdrop-container') || false
        let $backdropEl = document.createElement('div')
        const backdropClasses = 'transition duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80'
        const bacldropCount = document.querySelectorAll('[data-hs-modal-backdrop-template]').length

        if (bacldropCount > 1) return

        if (backdropSelector) {
            $backdropEl = document.querySelector(backdropSelector).cloneNode(true)
            $backdropEl.classList.remove('hidden')
            backdropClasses = $backdropEl.classList
            $backdropEl.classList = ''
        }

        $backdropEl.setAttribute('data-hs-modal-backdrop-template', '')
        document.body.appendChild($backdropEl)

        setTimeout(() => {
            $backdropEl.classList = backdropClasses
        })
    }

    _destroyBackdrop() {
        const $backdropEl = document.querySelector('[data-hs-modal-backdrop-template]')

        if (!$backdropEl) return

        if (this.openNextModal) {
            $backdropEl.style.transitionDuration = `${parseFloat(window.getComputedStyle($backdropEl).transitionDuration.replace(/[^\d.-]/g, '')) * 1.8}s`
        }

        $backdropEl.classList.add('opacity-0')

        this.afterTransition($backdropEl, () => {
            $backdropEl.remove()
        })
    }

    _focusInput($modalEl) {
        const $inputWithAutoFocusEl = $modalEl.querySelector('[autofocus]')
        if ($inputWithAutoFocusEl) $inputWithAutoFocusEl.focus()
    }
}

window.HSModal = new HSModal()
document.addEventListener('load', window.HSModal.init())