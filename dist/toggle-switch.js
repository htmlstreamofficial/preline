/*! For license information please see toggle-switch.js.LICENSE.txt */
!(function (t, e) {
	if ('object' == typeof exports && 'object' == typeof module)
		module.exports = e();
	else if ('function' == typeof define && define.amd) define([], e);
	else {
		var o = e();
		for (var n in o) ('object' == typeof exports ? exports : t)[n] = o[n];
	}
})(self, () =>
	(() => {
		'use strict';
		var t = {
				737: (t, e) => {
					Object.defineProperty(e, '__esModule', { value: !0 });
					var o = (function () {
						function t(t, e, o) {
							(this.el = t),
								(this.options = e),
								(this.events = o),
								(this.el = t),
								(this.options = e),
								(this.events = {});
						}
						return (
							(t.prototype.isIOS = function () {
								return (
									!!/iPad|iPhone|iPod/.test(navigator.platform) ||
									(navigator.maxTouchPoints &&
										navigator.maxTouchPoints > 2 &&
										/MacIntel/.test(navigator.platform))
								);
							}),
							(t.prototype.isIpadOS = function () {
								return (
									navigator.maxTouchPoints &&
									navigator.maxTouchPoints > 2 &&
									/MacIntel/.test(navigator.platform)
								);
							}),
							(t.prototype.fireEvent = function (t, e) {
								void 0 === e && (e = null),
									this.events.hasOwnProperty(t) && this.events[t](e);
							}),
							(t.prototype.dispatch = function (t, e, o) {
								void 0 === o && (o = null);
								var n = new CustomEvent(t, {
									detail: { payload: o },
									bubbles: !0,
									cancelable: !0,
									composed: !1,
								});
								e.dispatchEvent(n);
							}),
							(t.prototype.on = function (t, e) {
								this.events[t] = e;
							}),
							(t.prototype.afterTransition = function (t, e) {
								var o = function () {
									e(), t.removeEventListener('transitionend', o, !0);
								};
								'all 0s ease 0s' !==
								window.getComputedStyle(t, null).getPropertyValue('transition')
									? t.addEventListener('transitionend', o, !0)
									: e();
							}),
							(t.prototype.getClassProperty = function (t, e, o) {
								return (
									void 0 === o && (o = ''),
									(window.getComputedStyle(t).getPropertyValue(e) || o).replace(
										' ',
										'',
									)
								);
							}),
							(t.prototype.getClassPropertyAlt = function (t, e, o) {
								void 0 === o && (o = '');
								var n = '';
								return (
									t.classList.forEach(function (t) {
										t.includes(e) && (n = t);
									}),
									n.match(/:(.*)]/) ? n.match(/:(.*)]/)[1] : o
								);
							}),
							t
						);
					})();
					(e.default = o),
						(window.HSStaticMethods = {
							getClassPropertyAlt: function (t, e, o) {
								void 0 === o && (o = '');
								var n = '';
								return (
									t.classList.forEach(function (t) {
										t.includes(e) && (n = t);
									}),
									n.match(/:(.*)]/) ? n.match(/:(.*)]/)[1] : o
								);
							},
						});
				},
				677: function (t, e, o) {
					var n,
						i =
							(this && this.__extends) ||
							((n = function (t, e) {
								return (
									(n =
										Object.setPrototypeOf ||
										({ __proto__: [] } instanceof Array &&
											function (t, e) {
												t.__proto__ = e;
											}) ||
										function (t, e) {
											for (var o in e)
												Object.prototype.hasOwnProperty.call(e, o) &&
													(t[o] = e[o]);
										}),
									n(t, e)
								);
							}),
							function (t, e) {
								if ('function' != typeof e && null !== e)
									throw new TypeError(
										'Class extends value ' +
											String(e) +
											' is not a constructor or null',
									);
								function o() {
									this.constructor = t;
								}
								n(t, e),
									(t.prototype =
										null === e
											? Object.create(e)
											: ((o.prototype = e.prototype), new o()));
							}),
						r =
							(this && this.__assign) ||
							function () {
								return (
									(r =
										Object.assign ||
										function (t) {
											for (var e, o = 1, n = arguments.length; o < n; o++)
												for (var i in (e = arguments[o]))
													Object.prototype.hasOwnProperty.call(e, i) &&
														(t[i] = e[i]);
											return t;
										}),
									r.apply(this, arguments)
								);
							};
					Object.defineProperty(e, '__esModule', { value: !0 });
					var s = (function (t) {
						function e(e, o) {
							var n = t.call(this, e, o) || this,
								i = e.getAttribute('data-hs-toggle-switch'),
								s = i ? JSON.parse(i) : {},
								a = r(r({}, s), o);
							return (
								(n.target = (null == a ? void 0 : a.target) || null),
								n.target && n.init(),
								n
							);
						}
						return (
							i(e, t),
							(e.prototype.init = function () {
								window.$hsToggleSwitchCollection.push({
									id: window.$hsToggleSwitchCollection.length + 1,
									element: this,
								});
							}),
							(e.getInstance = function (t) {
								var e = window.$hsToggleSwitchCollection.find(function (e) {
									return (
										e.element.el ===
										('string' == typeof t ? document.querySelector(t) : t)
									);
								});
								return e ? e.element : null;
							}),
							e
						);
					})(o(737).default);
					window.addEventListener('load', function () {
						window.$hsToggleSwitchCollection ||
							(window.$hsToggleSwitchCollection = []),
							document
								.querySelectorAll(
									'[data-hs-toggle-switch]:not(.--prevent-on-load-init)',
								)
								.forEach(function (t) {
									return new s(t);
								}),
							console.log(
								'Toggle switch collection:',
								window.$hsToggleSwitchCollection,
							);
					}),
						(t.exports.HSToggleSwitch = s),
						(e.default = s);
				},
			},
			e = {};
		return (function o(n) {
			var i = e[n];
			if (void 0 !== i) return i.exports;
			var r = (e[n] = { exports: {} });
			return t[n].call(r.exports, r, r.exports, o), r.exports;
		})(677);
	})(),
);
