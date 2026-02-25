import HSAccordion from "./core";

window.addEventListener('load', () => {
  HSAccordion.autoInit();

  if (document.querySelectorAll('.hs-accordion-treeview-root').length) HSAccordion.treeView();
});

if (typeof window !== 'undefined') {
  window.HSAccordion = HSAccordion;
}