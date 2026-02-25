import HSInputNumber from "./core";

window.addEventListener("load", () => {
  HSInputNumber.autoInit();
});

if (typeof window !== "undefined") {
  window.HSInputNumber = HSInputNumber;
}