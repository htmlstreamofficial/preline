import HSRangeSlider from "./core";

window.addEventListener("load", () => {
  HSRangeSlider.autoInit();
});

if (typeof window !== "undefined") {
  window.HSRangeSlider = HSRangeSlider;
}