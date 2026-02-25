import HSTreeView from "./core";

window.addEventListener('load', () => {
  HSTreeView.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSTreeView = HSTreeView;
}