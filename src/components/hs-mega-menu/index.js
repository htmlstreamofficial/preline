/*
* HSMegaMenu
* @version: 1.0.0
* @author: HtmlStream
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/

import Component from '../../core/Component'
import MenuSearchHistory from '../../core/utils/MenuSearchHistory'

class HSMegaMenu extends Component {
    constructor () {
        super('.hs-mega-menu')
        this._history = MenuSearchHistory
    }

    init () {
        document.addEventListener('click', e => {
            const $targetEl = e.target
            const $megaMenuEl = $targetEl.closest(this.selector)
            const $menuEl = $targetEl.closest('.hs-mega-menu-content')
            const $menuToggleEl = $targetEl.closest('.hs-mega-menu-toggle')

            if (!$megaMenuEl) return this._closeAll()

            const trigger = $megaMenuEl.getAttribute('data-hs-mega-menu-trigger')
            const desktop = window.getComputedStyle($megaMenuEl.closest('nav')).display === 'flex'

            if (!$megaMenuEl || !$megaMenuEl.classList.contains('open') && !$megaMenuEl.parentElement.closest(this.selector)) this._closeOthers()

            if ($menuEl && !$menuToggleEl) {
                const autoClose = $megaMenuEl.getAttribute('data-hs-mega-menu-auto-close')

                if (autoClose == 'false') return

                if ($megaMenuEl.parentElement.closest(this.selector)) {
                    return this._closeAll()
                } else if (trigger === 'hover') {
                    if ($megaMenuEl.classList.contains('open')) return this.close($megaMenuEl)
                }
            }

            if (trigger === 'hover' && desktop) return
            !$megaMenuEl.classList.contains('open') ? this.open($megaMenuEl) : this.close($megaMenuEl)
        })

        document.querySelectorAll('.hs-mega-menu[data-hs-mega-menu-trigger="hover"]').forEach($megaMenuEl => {
            $megaMenuEl.addEventListener('mouseenter', e => {
                const $menuEl = $megaMenuEl.querySelector('.hs-mega-menu-content')
                if ($megaMenuEl) this._hover($megaMenuEl)
            })
        })

        document.addEventListener('keydown', this._keyboardSupport.bind(this))
    }

    _closeOthers () {
        const $collection = document.querySelectorAll(`${this.selector}.open`)

        $collection.forEach($megaMenuEl => {
            const autoClose = $megaMenuEl.getAttribute('data-hs-mega-menu-auto-close')

            if (autoClose == 'false') return

            this.close($megaMenuEl)
        })
    }

    _closeAll () {
        const $collection = document.querySelectorAll(`${this.selector}`)
        $collection.forEach($megaMenuEl => {
            const autoClose = $megaMenuEl.getAttribute('data-hs-mega-menu-auto-close')

            if (autoClose == 'false') return

            this.close($megaMenuEl)
        })
    }

    _hover ($megaMenuEl) {
        if (window.getComputedStyle($megaMenuEl.closest('nav')).display !== 'flex') return

        this.open($megaMenuEl)

        const handleMouseleave = (e) => {
            this.close($megaMenuEl)
            $megaMenuEl.removeEventListener('mouseleave', handleMouseleave)
        }

        $megaMenuEl.addEventListener('mouseleave', handleMouseleave)
    }

    close ($megaMenuEl) {
        const $menuEl = $megaMenuEl.querySelector('.hs-mega-menu-content')

        $megaMenuEl.classList.remove('open')

        this.afterTransition($menuEl, () => {
            if ($megaMenuEl.classList.contains('open')) return
            $menuEl.classList.remove('block')
            $menuEl.classList.add('hidden')

            $menuEl.style.right = null
            $menuEl.style.left = null

            $megaMenuEl.querySelectorAll('.hs-mega-menu-content.block').forEach($megaMenuEl => {
                $megaMenuEl.classList.remove('block')
                $megaMenuEl.classList.add('hidden')
            })
        })

        this._fireEvent('close', $megaMenuEl)
        this._dispatch('close.hs.megaMenu', $megaMenuEl, $megaMenuEl)
    }

    open ($megaMenuEl) {
        const $menuEl = $megaMenuEl.querySelector('.hs-mega-menu-content')
        $menuEl.classList.add('block')
        $menuEl.classList.remove('hidden')
        const bounding = $menuEl.getBoundingClientRect()
        const menuStyles = window.getComputedStyle($menuEl)

        if ((parseInt(bounding.left) + parseInt(bounding.width)) > window.innerWidth) {
            $menuEl.style.right = '100%'
            $menuEl.style.left = 'unset'
        }

        setTimeout(() => {
            $megaMenuEl.classList.add('open')
        }, 10)

        this._fireEvent('open', $megaMenuEl)
        this._dispatch('open.hs.megaMenu', $megaMenuEl, $megaMenuEl)
    }

    toggle ($megaMenuEl) {
        $megaMenuEl.classList.contains('open') ? this.close($megaMenuEl) : this.open($megaMenuEl)
    }

    _keyboardSupport (e) {
        const $dropdownEls = document.querySelectorAll('.hs-mega-menu.open')
        if (!$dropdownEls.length) return

        const $dropdownEl = $dropdownEls[$dropdownEls.length - 1]

        if (e.keyCode === 27) {
            e.preventDefault()
            return this._esc($dropdownEl)
        }
        if (e.keyCode === 40) {
            e.preventDefault()
            return this._down($dropdownEl)
        }
        if (e.keyCode === 38) {
            e.preventDefault()
            return this._up($dropdownEl)
        }

        if (e.keyCode === 36) {
            e.preventDefault()
            return this._start($dropdownEl)
        }

        if (e.keyCode === 35) {
            e.preventDefault()
            return this._end($dropdownEl)
        }

        this._byChar($dropdownEl, e.key)
    }

    _esc ($dropdownEl) {
        this.close($dropdownEl)

        if ($dropdownEl.closest('.hs-mega-menu-content')) {
            const $toggleEl = $dropdownEl.querySelector('.hs-mega-menu-toggle')
            if ($toggleEl) $toggleEl.focus()
        }
    }

    _up ($dropdownEl) {
        const $menuEl = $dropdownEl.querySelector('.hs-mega-menu-content')
        const links = [...$menuEl.querySelectorAll('a, button')].reverse().filter($linkEl => {
            return !$linkEl.disabled && $linkEl.closest('.hs-mega-menu-content') === $menuEl
        })

        const $activeLinkEl = $menuEl.querySelector("a:focus") || $menuEl.querySelector("button:focus")
        let acitveIndex = links.findIndex($linkEl => $linkEl === $activeLinkEl)

        if (acitveIndex + 1 < links.length) {
            acitveIndex++
        }

        links[acitveIndex].focus()
    }

    _down ($dropdownEl) {
        const $menuEl = $dropdownEl.querySelector('.hs-mega-menu-content')
        const links = [...$menuEl.querySelectorAll('a, button')].filter($linkEl => {
            return !$linkEl.disabled && $linkEl.closest('.hs-mega-menu-content') === $menuEl
        })
        const $activeLinkEl = $menuEl.querySelector("a:focus") || $menuEl.querySelector("button:focus")
        let acitveIndex = links.findIndex($linkEl => $linkEl === $activeLinkEl)

        if (acitveIndex + 1 < links.length) {
            acitveIndex++
        }

        links[acitveIndex].focus()
    }

    _start ($dropdownEl) {
        const $menuEl = $dropdownEl.querySelector('.hs-mega-menu-content')
        const links = [...$menuEl.querySelectorAll('a, button')].filter($linkEl => {
            return !$linkEl.disabled && $linkEl.closest('.hs-mega-menu-content') === $menuEl
        })

        if (links.length) {
            links[0].focus()
        }
    }

    _end ($dropdownEl) {
        const $menuEl = $dropdownEl.querySelector('.hs-mega-menu-content')
        const links = [...$menuEl.querySelectorAll('a, button')].reverse().filter($linkEl => {
            return !$linkEl.disabled && $linkEl.closest('.hs-mega-menu-content') === $menuEl
        })

        if (links.length) {
            links[0].focus()
        }
    }

    _byChar ($dropdownEl, char) {
        const $menuEl = $dropdownEl.querySelector('.hs-mega-menu-content')
        const links = [...$menuEl.querySelectorAll('a, button')]
        const getActiveIndex = () => {
            return links.findIndex(($linkEl, index) =>
                $linkEl.innerText.toLowerCase().charAt(0) === char.toLowerCase()
                && this._history.existsInHistory(index)
            )
        }

        let acitveIndex = getActiveIndex()

        if (acitveIndex === -1) {
            this._history.clearHistory()
            acitveIndex = getActiveIndex()
        }

        if (acitveIndex !== -1) {
            links[acitveIndex].focus()
            this._history.addHistory(acitveIndex)
        }
    }

}

window.HSMegaMenu = new HSMegaMenu()
document.addEventListener('load', window.HSMegaMenu.init())