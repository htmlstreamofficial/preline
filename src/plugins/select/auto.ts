import HSSelect from "./core";

import { debounce } from '../../utils';

window.addEventListener('load', () => {
  HSSelect.autoInit();
});

const onDocumentScrollRecalculateDirection = debounce((evt?: Event) => {
  if (!window.$hsSelectCollection) return false;

  const target = window.$hsSelectCollection.find((el) => el.element.isOpened());
  if (!target) return false;

  const activeElement = document.activeElement as HTMLElement | null;
  const evtTarget = (evt?.target || null) as HTMLElement | null;

  if (
    (activeElement && target.element.containsDropdownElement(activeElement)) ||
    (evtTarget && target.element.containsDropdownElement(evtTarget))
  )
    return false;

  target.element.recalculateDirection();
}, 150);

document.addEventListener('scroll', onDocumentScrollRecalculateDirection);

if (typeof window !== 'undefined') {
  window.HSSelect = HSSelect;
}