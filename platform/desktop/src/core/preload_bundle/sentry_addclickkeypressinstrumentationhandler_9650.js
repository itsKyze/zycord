9650(__unused_rspack_module, exports, __webpack_require__) {
                let debounceTimerID, lastCapturedEventType, lastCapturedEventTargetId;
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863);
                function instrumentDOM() {
                    if (!types.WINDOW.document) return;
                    let triggerDOMHandler = core.triggerHandlers.bind(null, "dom"),
                        globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, !0);
                    (types.WINDOW.document.addEventListener("click", globalDOMEventHandler, !1),
                        types.WINDOW.document.addEventListener("keypress", globalDOMEventHandler, !1),
                        ["EventTarget", "Node"].forEach((target) => {
                            let globalObject = types.WINDOW,
                                proto = globalObject[target]?.prototype;
                            proto?.hasOwnProperty?.("addEventListener") &&
                                (core.fill(proto, "addEventListener", function (originalAddEventListener) {
                                    return function (type, listener, options) {
                                        if ("click" === type || "keypress" == type)
                                            try {
                                                let handlers = (this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {}),
                                                    handlerForType = (handlers[type] = handlers[type] || { refCount: 0 });
                                                if (!handlerForType.handler) {
                                                    let handler = makeDOMEventHandler(triggerDOMHandler);
                                                    ((handlerForType.handler = handler), originalAddEventListener.call(this, type, handler, options));
                                                }
                                                handlerForType.refCount++;
                                            } catch {}
                                        return originalAddEventListener.call(this, type, listener, options);
                                    };
                                }),
                                core.fill(proto, "removeEventListener", function (originalRemoveEventListener) {
                                    return function (type, listener, options) {
                                        if ("click" === type || "keypress" == type)
                                            try {
                                                let handlers = this.__sentry_instrumentation_handlers__ || {},
                                                    handlerForType = handlers[type];
                                                handlerForType &&
                                                    (handlerForType.refCount--,
                                                    handlerForType.refCount <= 0 &&
                                                        (originalRemoveEventListener.call(this, type, handlerForType.handler, options),
                                                        (handlerForType.handler = void 0),
                                                        delete handlers[type]),
                                                    0 === Object.keys(handlers).length && delete this.__sentry_instrumentation_handlers__);
                                            } catch {}
                                        return originalRemoveEventListener.call(this, type, listener, options);
                                    };
                                }));
                        }));
                }
                function makeDOMEventHandler(handler, globalListener = !1) {
                    return (event) => {
                        var eventType;
                        if (!event || event._sentryCaptured) return;
                        let target = (function (event) {
                            try {
                                return event.target;
                            } catch {
                                return null;
                            }
                        })(event);
                        if (
                            ((eventType = event.type),
                            "keypress" === eventType && (!target?.tagName || ("INPUT" !== target.tagName && "TEXTAREA" !== target.tagName && !target.isContentEditable && 1)))
                        )
                            return;
                        (core.addNonEnumerableProperty(event, "_sentryCaptured", !0),
                            target && !target._sentryId && core.addNonEnumerableProperty(target, "_sentryId", core.uuid4()));
                        let name = "keypress" === event.type ? "input" : event.type;
                        (!(function (event) {
                            if (event.type !== lastCapturedEventType) return !1;
                            try {
                                if (!event.target || event.target._sentryId !== lastCapturedEventTargetId) return !1;
                            } catch {}
                            return !0;
                        })(event) &&
                            (handler({ event, name, global: globalListener }),
                            (lastCapturedEventType = event.type),
                            (lastCapturedEventTargetId = target ? target._sentryId : void 0)),
                            clearTimeout(debounceTimerID),
                            (debounceTimerID = types.WINDOW.setTimeout(() => {
                                ((lastCapturedEventTargetId = void 0), (lastCapturedEventType = void 0));
                            }, 1e3)));
                    };
                }
                ((exports.addClickKeypressInstrumentationHandler = function (handler) {
                    (core.addHandler("dom", handler), core.maybeInstrument("dom", instrumentDOM));
                }),
                    (exports.instrumentDOM = instrumentDOM));
            }