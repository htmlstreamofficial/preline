/*
* Plugin
* @version: 1.2.0
* @author: HtmlStream
* @requires: tailwindcss ^3.1.2
* @license: Licensed under MIT (https://preline.co/docs/license.html)
* Copyright 2022 Htmlstream
*/

const plugin = require("tailwindcss/plugin")

module.exports = plugin(function ({addVariant, e}) {
    addVariant('hs-dropdown-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-dropdown.open > .${e(`hs-dropdown-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-dropdown.open > .hs-dropdown-menu > .${e(`hs-dropdown-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-mega-menu-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-mega-menu.open.${e(`hs-mega-menu-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-mega-menu.open > .hs-mega-menu-toggle .${e(`hs-mega-menu-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-mega-menu.open > .hs-mega-menu-toggle.${e(`hs-mega-menu-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-mega-menu.open > .hs-mega-menu-content.${e(`hs-mega-menu-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-removing', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.hs-removing.${e(`hs-removing${separator}${className}`)}`
        })
    })

    addVariant('hs-tooltip-shown', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.hs-tooltip.show .${e(`hs-tooltip-shown${separator}${className}`)}`
        })
    })

    addVariant('hs-accordion-active', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-accordion.active.${e(`hs-accordion-active${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-accordion.active > .hs-accordion-toggle .${e(`hs-accordion-active${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-accordion.active > .hs-accordion-toggle.${e(`hs-accordion-active${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-collapse-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-collapse.open .${e(`hs-collapse-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-collapse.open.${e(`hs-collapse-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-collapse-toggle.open .${e(`hs-collapse-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.hs-collapse-toggle.open.${e(`hs-collapse-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-tab-active', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.active.${e(`hs-tab-active${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.active .${e(`hs-tab-active${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-overlay-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.open.${e(`hs-overlay-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.open .${e(`hs-overlay-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-modal-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.open.${e(`hs-modal-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.open .${e(`hs-modal-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-offcanvas-open', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.show.${e(`hs-offcanvas-open${separator}${className}`)}`
        })
    })

    addVariant('hs-sidebar-open', [
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.show.${e(`hs-sidebar-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.sidebar-open .${e(`hs-sidebar-open${separator}${className}`)}`
            })
        },
        ({modifySelectors, separator}) => {
            modifySelectors(({className}) => {
                return `.sidebar-open.${e(`hs-sidebar-open${separator}${className}`)}`
            })
        }
    ])

    addVariant('hs-dark-mode-active', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.dark .${e(`hs-dark-mode-active${separator}${className}`)}`
        })
    })

    addVariant('hs-auto-mode-active', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.auto .${e(`hs-auto-mode-active${separator}${className}`)}`
        })
    })

    addVariant('hs-scrollspy-active', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.active.${e(`hs-scrollspy-active${separator}${className}`)}`
        })
    })

    addVariant('hs-default-mode-active', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
            return `.default .${e(`hs-default-mode-active${separator}${className}`)}`
        })
    })
})