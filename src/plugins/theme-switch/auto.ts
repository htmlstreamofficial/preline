import HSThemeSwitch from "./core";

window.addEventListener("load", () => {
  HSThemeSwitch.autoInit();
});

if (window.$hsThemeSwitchCollection) {
  window.addEventListener("on-hs-appearance-change", (evt: Event & { detail: string }) => {
    window.$hsThemeSwitchCollection.forEach((el) => {
      (el.element.el as HTMLInputElement).checked = evt.detail === "dark";
    });
  });
}

if (typeof window !== "undefined") {
  window.HSThemeSwitch = HSThemeSwitch;
}