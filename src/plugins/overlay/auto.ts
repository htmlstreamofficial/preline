import HSOverlay from "./core";
import { isDirectChild } from '../../utils';

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const debounceResize = (callback: () => void, delay: number = 150) => {
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(callback, delay);
};

const autoCloseResizeFn = () => {
  if (
    !window?.$hsOverlayCollection?.length ||
    !window?.$hsOverlayCollection?.find((el) => el.element.autoClose)
  ) {
    return false;
  }

  const overlays = window.$hsOverlayCollection.filter(
    (el) => el.element.autoClose,
  );

  overlays.forEach((overlay) => {
    const { autoCloseEqualityType, autoClose } = overlay.element;
    const condition =
      autoCloseEqualityType === 'less-than'
        ? document.body.clientWidth <= autoClose
        : document.body.clientWidth >= autoClose;

    if (condition && overlay.element.el.classList.contains('opened')) {
      if (overlay.element.el.classList.contains('minified')) {
        overlay.element.minify(false);
      }

      overlay.element.close(true);
    } else {
      if (
        overlay.element.isLayoutAffect &&
        overlay.element.el.classList.contains('opened')
      ) {
        document.body.classList.add('hs-overlay-body-open');
      }
    }
  });
};

const moveOverlayToBodyResizeFn = () => {
  if (
    !window?.$hsOverlayCollection?.length ||
    !window?.$hsOverlayCollection?.find((el) => el.element.moveOverlayToBody)
  ) {
    return false;
  }

  const overlays = window.$hsOverlayCollection.filter(
    (el) => el.element.moveOverlayToBody,
  );

  overlays.forEach((overlay) => {
    const resolution = overlay.element.moveOverlayToBody;
    const initPlace = overlay.element.initContainer;
    const newPlace = document.querySelector('body');
    const target = overlay.element.el;

    if (!initPlace && target) return false;

    if (
      document.body.clientWidth <= resolution &&
      !isDirectChild(newPlace, target)
    ) {
      newPlace.appendChild(target);
    } else if (
      document.body.clientWidth > resolution &&
      !initPlace.contains(target)
    ) {
      initPlace.appendChild(target);
    }
  });
};

const setOpenedResizeFn = () => {
  if (
    !window?.$hsOverlayCollection?.length ||
    !window?.$hsOverlayCollection?.find((el) => el.element.openedBreakpoint)
  ) {
    return false;
  }

  const overlays = window.$hsOverlayCollection.filter(
    (el) => el.element.openedBreakpoint,
  );

  overlays.forEach((overlay) => {
    const { openedBreakpoint } = overlay.element;
    const condition = document.body.clientWidth >= openedBreakpoint;

    if (condition) {
      if (!overlay.element.el.classList.contains('opened')) {
        HSOverlay.setOpened(openedBreakpoint, overlay);
      }
    } else {
      if (overlay.element.el.classList.contains('opened')) {
        if (overlay.element.el.classList.contains('minified')) {
          overlay.element.minify(false);
        }

        overlay.element.close(true);
      }
    }
  });
};

const setBackdropZIndexResizeFn = () => {
  if (
    !window?.$hsOverlayCollection?.length ||
    !window?.$hsOverlayCollection?.find((el) =>
      el.element.el.classList.contains('opened'),
    )
  ) {
    return false;
  }

  const overlays = window.$hsOverlayCollection.filter((el) =>
    el.element.el.classList.contains('opened'),
  );

  overlays.forEach((overlay) => {
    const overlayZIndex = parseInt(
      window.getComputedStyle(overlay.element.el).getPropertyValue('z-index'),
    );
    const backdrop: HTMLElement = document.querySelector(
      `#${overlay.element.el.id}-backdrop`,
    );
    if (!backdrop) return false;

    const backdropZIndex = parseInt(
      window.getComputedStyle(backdrop).getPropertyValue('z-index'),
    );
    if (overlayZIndex === backdropZIndex + 1) return false;

    if ('style' in backdrop) backdrop.style.zIndex = `${overlayZIndex - 1}`;

    document.body.classList.add('hs-overlay-body-open');
  });
};

const ensureBodyOpenForMinifiedSidebar = () => {
  if (!window.$hsOverlayCollection?.length) return;

  window.$hsOverlayCollection.forEach((overlayItem) => {
    const overlay = overlayItem.element;
    if (overlay.toggleMinifierButtons?.length > 0 && overlay.openedBreakpoint) {
      if (document.body.clientWidth >= overlay.openedBreakpoint) {
        document.body.classList.add('hs-overlay-body-open');
      } else {
        document.body.classList.remove('hs-overlay-body-open');
      }
    }
  });
};

window.addEventListener('load', () => {
  HSOverlay.autoInit();

  moveOverlayToBodyResizeFn();
  ensureBodyOpenForMinifiedSidebar();
});

window.addEventListener('resize', () => {
  debounceResize(() => {
    autoCloseResizeFn();
    setOpenedResizeFn();
  });

  moveOverlayToBodyResizeFn();
  setBackdropZIndexResizeFn();
  ensureBodyOpenForMinifiedSidebar();
});

if (typeof window !== 'undefined') {
  window.HSOverlay = HSOverlay;
}