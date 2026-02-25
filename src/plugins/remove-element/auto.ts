import HSRemoveElement from "./core";

window.addEventListener('load', () => {
  HSRemoveElement.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSRemoveElement = HSRemoveElement;
}