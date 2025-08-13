import {
  IAccessibilityComponent,
  IAccessibilityKeyboardHandlers,
} from "./interfaces";

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

  private handleGlobalFocusin(evt: FocusEvent): void {
    const target = evt.target as HTMLElement;
    this.activeComponent = this.getActiveComponent(target);
  }

  private handleGlobalKeydown(evt: KeyboardEvent): void {
    const target = evt.target as HTMLElement;
    this.activeComponent = this.getActiveComponent(target);

    if (!this.activeComponent) return;

    if (!this.isAllowedKeybinding(evt)) {
      return;
    }

    switch (evt.key) {
      case "Escape":
        if (!this.activeComponent.isOpened) {
          const closestOpenParent = this.findClosestOpenParent(target);

          if (closestOpenParent?.handlers.onEsc) {
            closestOpenParent.handlers.onEsc();
            evt.preventDefault();
            evt.stopPropagation();
          }
        } else if (this.activeComponent.handlers.onEsc) {
          this.activeComponent.handlers.onEsc();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "Enter":
        if (this.activeComponent.handlers.onEnter) {
          this.activeComponent.handlers.onEnter();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case " ":
      case "Space":
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }

        if (this.activeComponent.handlers.onSpace) {
          this.activeComponent.handlers.onSpace();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowRight":
        if (this.activeComponent.handlers.onArrow) {
          if (evt.metaKey || evt.ctrlKey || evt.altKey || evt.shiftKey) {
            return;
          }

          this.activeComponent.handlers.onArrow(evt);
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "Tab":
        if (!this.activeComponent.handlers.onTab) break;

        const handler = evt.shiftKey
          ? this.activeComponent.handlers.onShiftTab
          : this.activeComponent.handlers.onTab;

        if (handler) handler();

        break;
      case "Home":
        if (this.activeComponent.handlers.onHome) {
          this.activeComponent.handlers.onHome();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      case "End":
        if (this.activeComponent.handlers.onEnd) {
          this.activeComponent.handlers.onEnd();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
      default:
        if (
          this.activeComponent.handlers.onFirstLetter &&
          evt.key.length === 1 &&
          /^[a-zA-Z]$/.test(evt.key)
        ) {
          this.activeComponent.handlers.onFirstLetter(evt.key);
          evt.preventDefault();
          evt.stopPropagation();
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
  ): IAccessibilityComponent {
    const component: IAccessibilityComponent = {
      wrapper,
      handlers,
      isOpened,
      name,
      selector,
      context,
      isRegistered: true,
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
