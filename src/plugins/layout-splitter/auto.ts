import HSLayoutSplitter from "./core";

window.addEventListener('load', () => {
  HSLayoutSplitter.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSLayoutSplitter = HSLayoutSplitter;
}