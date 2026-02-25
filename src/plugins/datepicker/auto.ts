import HSDatepicker from "./core";

window.addEventListener('load', () => {
  HSDatepicker.autoInit()
});

if (typeof window !== 'undefined') {
  window.HSDatepicker = HSDatepicker;
}