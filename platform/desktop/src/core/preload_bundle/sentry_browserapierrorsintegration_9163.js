9163(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    helpers = __webpack_require__(9445),
                    DEFAULT_EVENT_TARGET =
                        "EventTarget,Window,Node,ApplicationCache,AudioTrackList,BroadcastChannel,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(
                            ",",
                        );
                function _wrapTimeFunction(original) {
                    return function (...args) {
                        let originalCallback = args[0];
                        return (
                            (args[0] = helpers.wrap(originalCallback, { mechanism: { handled: !1, type: `auto.browser.browserapierrors.${core.getFunctionName(original)}` } })),
                            original.apply(this, args)
                        );
                    };
                }
                function _wrapRAF(original) {
                    return function (callback) {
                        return original.apply(this, [
                            helpers.wrap(callback, {
                                mechanism: { data: { handler: core.getFunctionName(original) }, handled: !1, type: "auto.browser.browserapierrors.requestAnimationFrame" },
                            }),
                        ]);
                    };
                }
                function _wrapXHR(originalSend) {
                    return function (...args) {
                        let xhr = this;
                        return (
                            ["onload", "onerror", "onprogress", "onreadystatechange"].forEach((prop) => {
                                prop in xhr &&
                                    "function" == typeof xhr[prop] &&
                                    core.fill(xhr, prop, function (original) {
                                        let wrapOptions = {
                                                mechanism: { data: { handler: core.getFunctionName(original) }, handled: !1, type: `auto.browser.browserapierrors.xhr.${prop}` },
                                            },
                                            originalFunction = core.getOriginalFunction(original);
                                        return (
                                            originalFunction && (wrapOptions.mechanism.data.handler = core.getFunctionName(originalFunction)),
                                            helpers.wrap(original, wrapOptions)
                                        );
                                    });
                            }),
                            originalSend.apply(this, args)
                        );
                    };
                }
                exports.browserApiErrorsIntegration = core.defineIntegration((options = {}) => {
                    let _options = { XMLHttpRequest: !0, eventTarget: !0, requestAnimationFrame: !0, setInterval: !0, setTimeout: !0, unregisterOriginalCallbacks: !1, ...options };
                    return {
                        name: "BrowserApiErrors",
                        setupOnce() {
                            (_options.setTimeout && core.fill(helpers.WINDOW, "setTimeout", _wrapTimeFunction),
                                _options.setInterval && core.fill(helpers.WINDOW, "setInterval", _wrapTimeFunction),
                                _options.requestAnimationFrame && core.fill(helpers.WINDOW, "requestAnimationFrame", _wrapRAF),
                                _options.XMLHttpRequest && "XMLHttpRequest" in helpers.WINDOW && core.fill(XMLHttpRequest.prototype, "send", _wrapXHR));
                            let eventTargetOption = _options.eventTarget;
                            eventTargetOption &&
                                (Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET).forEach((target) => {
                                    var target1, integrationOptions;
                                    let globalObject, proto;
                                    return (
                                        (target1 = target),
                                        (integrationOptions = _options),
                                        (globalObject = helpers.WINDOW),
                                        (proto = globalObject[target1]?.prototype),
                                        void (
                                            proto?.hasOwnProperty?.("addEventListener") &&
                                            (core.fill(proto, "addEventListener", function (original) {
                                                return function (eventName, fn, options) {
                                                    var obj, target, eventName1, fn1;
                                                    try {
                                                        ((obj = fn),
                                                            "function" == typeof obj.handleEvent &&
                                                                (fn.handleEvent = helpers.wrap(fn.handleEvent, {
                                                                    mechanism: {
                                                                        data: { handler: core.getFunctionName(fn), target: target1 },
                                                                        handled: !1,
                                                                        type: "auto.browser.browserapierrors.handleEvent",
                                                                    },
                                                                })));
                                                    } catch {}
                                                    return (
                                                        integrationOptions.unregisterOriginalCallbacks &&
                                                            ((target = this),
                                                            (eventName1 = eventName),
                                                            (fn1 = fn),
                                                            target &&
                                                                "object" == typeof target &&
                                                                "removeEventListener" in target &&
                                                                "function" == typeof target.removeEventListener &&
                                                                target.removeEventListener(eventName1, fn1)),
                                                        original.apply(this, [
                                                            eventName,
                                                            helpers.wrap(fn, {
                                                                mechanism: {
                                                                    data: { handler: core.getFunctionName(fn), target: target1 },
                                                                    handled: !1,
                                                                    type: "auto.browser.browserapierrors.addEventListener",
                                                                },
                                                            }),
                                                            options,
                                                        ])
                                                    );
                                                };
                                            }),
                                            core.fill(proto, "removeEventListener", function (originalRemoveEventListener) {
                                                return function (eventName, fn, options) {
                                                    try {
                                                        let originalEventHandler = fn.__sentry_wrapped__;
                                                        originalEventHandler && originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
                                                    } catch {}
                                                    return originalRemoveEventListener.call(this, eventName, fn, options);
                                                };
                                            }))
                                        )
                                    );
                                });
                        },
                    };
                });
            }