import HSScrollNav from "./core";

window.addEventListener('load', () => {
  HSScrollNav.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSScrollNav = HSScrollNav;
}