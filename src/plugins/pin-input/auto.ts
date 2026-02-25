import HSPinInput from "./core";

window.addEventListener('load', () => {
  HSPinInput.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSPinInput = HSPinInput;
}