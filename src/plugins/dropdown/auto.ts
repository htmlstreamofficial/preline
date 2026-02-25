import HSDropdown from "./core";

window.addEventListener("load", () => {
  HSDropdown.autoInit();
});

window.addEventListener("resize", () => {
  if (!window.$hsDropdownCollection) window.$hsDropdownCollection = [];

  window.$hsDropdownCollection.forEach((el) => el.element.resizeHandler());
});

if (typeof window !== "undefined") {
  window.HSDropdown = HSDropdown;
}