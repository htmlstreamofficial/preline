import {
  IAccessibilityComponent,
  IAccessibilityKeyboardHandlers,
} from "./interfaces";
import { isFormElement } from "../../utils";

class HSAccessibilityObserver {
  private components: IAccessibilityComponent[] = [];
  private currentlyOpenedComponents: IAccessibilityComponent[] = [];
  private activeComponent: IAccessibilityComponent | null = null;

  private readonly allowedKeybindings = new Set([
    "Escape",
    "Enter",
    " ",
    "Space",
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ]);

  constructor() {
    this.initGlobalListeners();
  }

  private initGlobalListeners(): void {
    document.addEventListener(
      "keydown",
      (evt) => this.handleGlobalKeydown(evt),
    );

    document.addEventListener(
      "focusin",
      (evt) => this.handleGlobalFocusin(evt),
    );
  }

  private isAllowedKeybinding(evt: KeyboardEvent): boolean {
    if (this.allowedKeybindings.has(evt.key)) {
      return true;
    }

    if (
      evt.key.length === 1 && /^[a-zA-Z]$/.test(evt.key) && !evt.metaKey &&
      !evt.ctrlKey && !evt.altKey && !evt.shiftKey
    ) {
      return true;
    }

    return false;
  }

  private getActiveComponent(el: HTMLElement) {
    if (!el) return null;

    const containingComponents = this.components.filter((comp) =>
      comp.wrapper.contains(el) || (comp.context && comp.context.contains(el))
    );

    if (containingComponents.length === 0) return null;
    if (containingComponents.length === 1) return containingComponents[0];

    let closestComponent = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (const comp of containingComponents) {
      let distance = 0;
      let current = el;

      while (current && current !== comp.wrapper && current !== comp.context) {
        distance++;
        current = current.parentElement;
      }

      if (distance < minDistance) {
        minDistance = distance;
        closestComponent = comp;
      }
    }

    return closestComponent;
  }

  private getActiveComponentForKey(
    el: HTMLElement,
    key: string,
  ): IAccessibilityComponent | null {
    if (!el) return null;

    const containingComponents = this.components.filter((component) =>
      component.wrapper.contains(el) || (component.context && component.context.contains(el))
    );

    if (containingComponents.length === 0) return null;

    const hasHandlerForKey = (component: IAccessibilityComponent): boolean => {
      const handlers = component.handlers;

      switch (key) {
        case "Escape":
          return !!handlers.onEsc;
        case "Enter":
          return !!handlers.onEnter;
        case " ":
        case "Space":
          return !!handlers.onSpace;
        case "ArrowDown":
        case "ArrowUp":
        case "ArrowLeft":
        case "ArrowRight":
          return !!handlers.onArrow;
        case "Tab":
          return !!handlers.onTab || !!handlers.onShiftTab;
        case "Home":
          return !!handlers.onHome;
        case "End":
          return !!handlers.onEnd;
        default:
          return !!handlers.onFirstLetter;
      }
    };

    const candidates = containingComponents.filter(hasHandlerForKey);

    if (candidates.length === 0) return this.getActiveComponent(el);
    if (candidates.length === 1) return candidates[0];

    let closestComponent: IAccessibilityComponent | null = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (const candidate of candidates) {
      let distance = 0;
      let current: HTMLElement | null = el;

      while (current && current !== candidate.wrapper && current !== candidate.context) {
        distance++;

        current = current.parentElement;
      }

      if (distance < minDistance) {
        minDistance = distance;
        closestComponent = candidate;
      }
    }

    return closestComponent;
  }

  private getDistanceToComponent(
    el: HTMLElement,
    component: IAccessibilityComponent,
  ): number {
    let distance = 0;
    let current: HTMLElement | null = el;

    while (
      current &&
      current !== component.wrapper &&
      current !== component.context
    ) {
      distance++;
      current = current.parentElement;
    }

    return distance;
  }

  private getComponentsByNesting(el: HTMLElement): IAccessibilityComponent[] {
    if (!el) return [];

    const containingComponents = this.components.filter((component) =>
      component.wrapper.contains(el) ||
      (component.context && component.context.contains(el))
    );

    if (containingComponents.length <= 1) return containingComponents;

    return [...containingComponents].sort((a, b) =>
      this.getDistanceToComponent(el, b) - this.getDistanceToComponent(el, a)
    );
  }

  private getSequentialHandlersForKey(
    el: HTMLElement,
    key: "Enter" | "Space",
  ): Array<() => boolean | void> {
    const components = this.getComponentsByNesting(el);

    if (components.length === 0) return [];

    return components
      .map((component) => {
        if (key === "Enter") return component.handlers.onEnter;

        return component.handlers.onSpace;
      })
      .filter(
        (handler): handler is () => boolean | void =>
          typeof handler === "function",
      );
  }

  private executeSequentialHandlers(
    handlers: Array<() => boolean | void>,
  ): { called: boolean; stopped: boolean } {
    let called = false;
    let stopped = false;

    for (const handler of handlers) {
      called = true;

      const result = handler();

      if (result === false) {
        stopped = true;
        break;
      }
    }

    return { called, stopped };
  }

  private handleGlobalFocusin(evt: FocusEvent): void {
    const target = evt.target as HTMLElement;
    this.activeComponent = this.getActiveComponent(target);
  }

  private handleGlobalKeydown(evt: KeyboardEvent): void {
    const target = evt.target as HTMLElement;
    this.activeComponent = this.getActiveComponentForKey(target, evt.key);
    const activeComponent = this.activeComponent;
    const isActivationKey = evt.key === "Enter" || evt.key === " " ||
      evt.key === "Space";

    if (!activeComponent && !isActivationKey) return;

    if (!this.isAllowedKeybinding(evt)) {
      return;
    }

    switch (evt.key) {
      case "Escape":
        if (!activeComponent) break;

        if (!activeComponent.isOpened) {
          const closestOpenParent = this.findClosestOpenParent(target);

          if (closestOpenParent?.handlers.onEsc) {
            closestOpenParent.handlers.onEsc();
            evt.preventDefault();
            evt.stopPropagation();
          }
        } else if (activeComponent.handlers.onEsc) {
          activeComponent.handlers.onEsc();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "Enter": {
        const enterHandlers = this.getSequentialHandlersForKey(target, "Enter");

        if (enterHandlers.length === 0) break;

        const { called, stopped } = this.executeSequentialHandlers(
          enterHandlers,
        );

        if (called && !isFormElement(target)) {
          evt.stopPropagation();
          evt.preventDefault();
        }

        if (stopped) {
          break;
        }
        break;
      }
      case " ":
      case "Space": {
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }

        const closestComponent = this.getActiveComponent(target);
        const spaceHandlers = this.getSequentialHandlersForKey(target, "Space");

        if (spaceHandlers.length === 0) break;

        const { stopped } = this.executeSequentialHandlers(spaceHandlers);

        if (stopped || closestComponent?.handlers.onSpace) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      }
      case "ArrowDown":
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowRight":
        if (!activeComponent) break;

        if (activeComponent.handlers.onArrow) {
          if (evt.metaKey || evt.ctrlKey || evt.altKey || evt.shiftKey) {
            return;
          }

          activeComponent.handlers.onArrow(evt);
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "Tab":
        if (!activeComponent) break;
        if (!activeComponent.handlers.onTab) break;

        const handler = evt.shiftKey
          ? activeComponent.handlers.onShiftTab
          : activeComponent.handlers.onTab;

        if (handler) handler(evt);

        break;
      case "Home":
        if (!activeComponent) break;
        if (activeComponent.handlers.onHome) {
          activeComponent.handlers.onHome();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "End":
        if (!activeComponent) break;
        if (activeComponent.handlers.onEnd) {
          activeComponent.handlers.onEnd();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      default:
        if (!activeComponent) break;
        if (
          activeComponent.handlers.onFirstLetter &&
          evt.key.length === 1 &&
          /^[a-zA-Z]$/.test(evt.key)
        ) {
          activeComponent.handlers.onFirstLetter(evt.key);

          if (!activeComponent.stopPropagation?.onFirstLetter) {
            return;
          } else {
            evt.preventDefault();
            evt.stopPropagation();
          }
        }
        break;
    }
  }

  private findClosestOpenParent(
    target: HTMLElement,
  ): IAccessibilityComponent | null {
    let current = target.parentElement;

    while (current) {
      const parentComponent = this.currentlyOpenedComponents.find((comp) =>
        comp.wrapper === current && comp !== this.activeComponent
      );

      if (parentComponent) {
        return parentComponent;
      }

      current = current.parentElement;
    }

    return null;
  }

  public registerComponent(
    wrapper: HTMLElement,
    handlers: IAccessibilityKeyboardHandlers,
    isOpened: boolean = true,
    name: string = "",
    selector: string = "",
    context?: HTMLElement,
    stopPropagation?: {
      [key: string]: boolean;
    },
  ): IAccessibilityComponent {
    const component: IAccessibilityComponent = {
      wrapper,
      handlers,
      isOpened,
      name,
      selector,
      context,
      isRegistered: true,
      stopPropagation,
    };

    this.components.push(component);
    return component;
  }

  public updateComponentState(
    component: IAccessibilityComponent,
    isOpened: boolean,
  ): void {
    component.isOpened = isOpened;

    if (isOpened) {
      if (!this.currentlyOpenedComponents.includes(component)) {
        this.currentlyOpenedComponents.push(component);
      }
    } else {
      this.currentlyOpenedComponents = this.currentlyOpenedComponents.filter(
        (comp) => comp !== component,
      );
    }
  }

  public unregisterComponent(component: IAccessibilityComponent): void {
    this.components = this.components.filter((comp) => comp !== component);
    this.currentlyOpenedComponents = this.currentlyOpenedComponents.filter(
      (comp) => comp !== component,
    );
  }

  public addAllowedKeybinding(key: string): void {
    this.allowedKeybindings.add(key);
  }

  public removeAllowedKeybinding(key: string): void {
    this.allowedKeybindings.delete(key);
  }

  public getAllowedKeybindings(): string[] {
    return Array.from(this.allowedKeybindings);
  }
}

export default HSAccessibilityObserver;
