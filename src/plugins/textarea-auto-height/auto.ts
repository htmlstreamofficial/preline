import HSTextareaAutoHeight from "./core";

window.addEventListener('load', () => {
  HSTextareaAutoHeight.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSTextareaAutoHeight = HSTextareaAutoHeight;
}