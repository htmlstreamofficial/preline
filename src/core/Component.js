/*
 * Component
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

export default class Component {
  constructor(selector, config) {
    this.$collection = [];
    this.selector = selector;
    this.config = config;
    this.events = {};
  }

  _fireEvent(eventType, payload = null) {
    if (this.events.hasOwnProperty(eventType)) {
      this.events[eventType](payload);
    }
  }

  _dispatch(eventType, element, payload = null) {
    const event = new CustomEvent(eventType, {
      detail: { payload },
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    element.dispatchEvent(event);
  }

  on(eventType, callback) {
    this.events[eventType] = callback;
  }

  afterTransition($element, callback) {
    const handleEvent = () => {
      callback();
      $element.removeEventListener('transitionend', handleEvent, true);
    };

    if (window.getComputedStyle($element, null).getPropertyValue('transition') !== 'all 0s ease 0s') {
      $element.addEventListener('transitionend', handleEvent, true);
    } else {
      callback();
    }
  }

  getClassProperty($element, propertyName, defaultValue = '') {
    const value = (window.getComputedStyle($element).getPropertyValue(propertyName) || defaultValue).replace(' ', '');

    return value;
  }
}
