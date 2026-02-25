import HSTogglePassword from "./core";

window.addEventListener('load', () => {
  HSTogglePassword.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSTogglePassword = HSTogglePassword;
}