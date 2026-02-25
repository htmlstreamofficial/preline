import HSAccordion from "./core";

window.addEventListener("load", () => {
  HSAccordion.autoInit();
});

if (typeof window !== "undefined") {
  window.HSAccordion = HSAccordion;
}