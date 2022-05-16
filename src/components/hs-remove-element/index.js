import Component from '../../core/Component'

class HSRemoveElement extends Component {
    constructor () {
        super('[data-hs-remove-element]')
    }

    init () {
        document.addEventListener('click', e => {
            const $removeElementTrigger = e.target.closest(this.selector)
            if (!$removeElementTrigger) return

            const $removeEl = document.querySelector($removeElementTrigger.getAttribute('data-hs-remove-element'))
            if ($removeEl) {
                $removeEl.classList.add('hs-removing')
                this.afterTransition($removeEl, () => {
                    $removeEl.remove()
                })
            }

        })
    }
}

window.HSRemoveElement = new HSRemoveElement()
document.addEventListener('load', window.HSRemoveElement.init())