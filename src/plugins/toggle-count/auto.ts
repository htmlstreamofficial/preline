import HSToggleCount from "./core";

window.addEventListener('load', () => {
	HSToggleCount.autoInit();
});

if (typeof window !== 'undefined') {
	window.HSToggleCount = HSToggleCount;
}