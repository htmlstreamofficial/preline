import HSTooltip from "./core";

window.addEventListener("load", () => {
  HSTooltip.autoInit();
});

if (typeof window !== "undefined") {
  window.HSTooltip = HSTooltip;
}