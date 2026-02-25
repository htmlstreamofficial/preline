import HSScrollspy from "./core";

window.addEventListener('load', () => {
  HSScrollspy.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSScrollspy = HSScrollspy;
}