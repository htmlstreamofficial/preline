import HSCopyMarkup from "./core";

window.addEventListener("load", () => {
	HSCopyMarkup.autoInit();
});

if (typeof window !== "undefined") {
	window.HSCopyMarkup = HSCopyMarkup;
}