import HSTabs from "./core";

window.addEventListener("load", () => {
  HSTabs.autoInit();
});

if (typeof window !== "undefined") {
  window.HSTabs = HSTabs;
}