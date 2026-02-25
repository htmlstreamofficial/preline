import HSComboBox from "./core";

window.addEventListener('load', () => {
  HSComboBox.autoInit();
});

document.addEventListener('scroll', () => {
  if (!window.$hsComboBoxCollection) return false;

  const target = window.$hsComboBoxCollection.find((el) => el.element.isOpened);

  if (target && !target.element.preventAutoPosition) {
    target.element.recalculateDirection();
  }
});

if (typeof window !== 'undefined') {
  window.HSComboBox = HSComboBox;
}