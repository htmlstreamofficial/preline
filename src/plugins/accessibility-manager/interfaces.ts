export interface IAccessibilityKeyboardHandlers {
  onEnter?: () => void;
  onEsc?: () => void;
  onSpace?: () => void;
  onArrow?: (event: KeyboardEvent) => void;
  onTab?: (event: KeyboardEvent) => void;
  onShiftTab?: (event: KeyboardEvent) => void;
  onHome?: () => void;
  onEnd?: () => void;
  onFirstLetter?: (key: string) => void;
  [key: string]: ((...args: any[]) => void) | undefined;
}

export interface IAccessibilityComponent {
  wrapper: HTMLElement;
  handlers: IAccessibilityKeyboardHandlers;
  isOpened: boolean;
  name: string;
  selector: string;
  context?: HTMLElement;
  isRegistered: boolean;
  stopPropagation?: {
    [key: string]: boolean;
  };
}

export interface HSAccessibilityObserver {
  registerComponent(
    wrapper: HTMLElement,
    handlers: IAccessibilityKeyboardHandlers,
    isActive?: boolean,
    name?: string,
    selector?: string,
    context?: HTMLElement,
    stopPropagation?: {
      [key: string]: boolean;
    },
  ): IAccessibilityComponent;
  addAllowedKeybinding(key: string): void;
  removeAllowedKeybinding(key: string): void;
  getAllowedKeybindings(): string[];
}
