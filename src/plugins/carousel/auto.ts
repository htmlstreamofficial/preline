import HSCarousel from "./core";

window.addEventListener('load', () => {
  HSCarousel.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSCarousel = HSCarousel;
}