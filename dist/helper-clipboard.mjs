/*
 * @version: 3.0.0
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */
var t;const e=null!==(t=null===window||void 0===window?void 0:window.HS_CLIPBOARD_SELECTOR)&&void 0!==t?t:".js-clipboard";window.addEventListener("load",(()=>{document.querySelectorAll(e).forEach((t=>{new ClipboardJS(t,{text:t=>{const e=t.dataset.clipboardText;if(e)return e;const o=t.dataset.clipboardTarget,l=document.querySelector(o);return"SELECT"===l.tagName||"INPUT"===l.tagName||"TEXTAREA"===l.tagName?l.value:l.textContent}}).on("success",(()=>{const e=t.querySelector(".js-clipboard-default"),o=t.querySelector(".js-clipboard-success"),l=t.querySelector(".js-clipboard-success-text"),s=t.dataset.clipboardSuccessText||"",n=t.closest(".hs-tooltip");let a;l&&(a=l.textContent,l.textContent=s),e&&o&&(e.style.display="none",o.style.display="block"),n&&window.HSTooltip.show(n),setTimeout((function(){l&&a&&(l.textContent=a),n&&window.HSTooltip.hide(n),e&&o&&(o.style.display="",e.style.display="")}),800)}))}))}));