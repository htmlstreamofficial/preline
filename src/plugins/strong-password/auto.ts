import HSStrongPassword from "./core";

window.addEventListener('load', () => {
  HSStrongPassword.autoInit();
});

document.addEventListener('scroll', () => {
  if (!window.$hsStrongPasswordCollection) return false;

  const target = window.$hsStrongPasswordCollection.find(
    (el) => el.element.isOpened,
  );

  if (target) target.element.recalculateDirection();
});

if (typeof window !== 'undefined') {
  window.HSStrongPassword = HSStrongPassword;
}