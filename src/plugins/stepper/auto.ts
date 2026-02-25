import HSStepper from "./core";

window.addEventListener("load", () => {
  HSStepper.autoInit();
});

if (typeof window !== "undefined") {
  window.HSStepper = HSStepper;
}