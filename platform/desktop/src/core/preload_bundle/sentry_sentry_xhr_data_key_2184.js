2184(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    types = __webpack_require__(3863),
                    SENTRY_XHR_DATA_KEY = "__sentry_xhr_v3__";
                function instrumentXHR() {
                    if (!types.WINDOW.XMLHttpRequest) return;
                    let xhrproto = XMLHttpRequest.prototype;
                    ((xhrproto.open = new Proxy(xhrproto.open, {
                        apply(originalOpen, xhrOpenThisArg, xhrOpenArgArray) {
                            let virtualError = Error(),
                                startTimestamp = 1e3 * core.timestampInSeconds(),
                                method = core.isString(xhrOpenArgArray[0]) ? xhrOpenArgArray[0].toUpperCase() : void 0,
                                url = (function (url) {
                                    if (core.isString(url)) return url;
                                    try {
                                        return url.toString();
                                    } catch {}
                                })(xhrOpenArgArray[1]);
                            if (!method || !url) return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
                            ((xhrOpenThisArg[SENTRY_XHR_DATA_KEY] = { method, url, request_headers: {} }),
                                "POST" === method && url.match(/sentry_key/) && (xhrOpenThisArg.__sentry_own_request__ = !0));
                            let onreadystatechangeHandler = () => {
                                let xhrInfo = xhrOpenThisArg[SENTRY_XHR_DATA_KEY];
                                if (xhrInfo && 4 === xhrOpenThisArg.readyState) {
                                    try {
                                        xhrInfo.status_code = xhrOpenThisArg.status;
                                    } catch {}
                                    let handlerData = { endTimestamp: 1e3 * core.timestampInSeconds(), startTimestamp, xhr: xhrOpenThisArg, virtualError };
                                    core.triggerHandlers("xhr", handlerData);
                                }
                            };
                            return (
                                "onreadystatechange" in xhrOpenThisArg && "function" == typeof xhrOpenThisArg.onreadystatechange
                                    ? (xhrOpenThisArg.onreadystatechange = new Proxy(xhrOpenThisArg.onreadystatechange, {
                                          apply: (originalOnreadystatechange, onreadystatechangeThisArg, onreadystatechangeArgArray) => (
                                              onreadystatechangeHandler(),
                                              originalOnreadystatechange.apply(onreadystatechangeThisArg, onreadystatechangeArgArray)
                                          ),
                                      }))
                                    : xhrOpenThisArg.addEventListener("readystatechange", onreadystatechangeHandler),
                                (xhrOpenThisArg.setRequestHeader = new Proxy(xhrOpenThisArg.setRequestHeader, {
                                    apply(originalSetRequestHeader, setRequestHeaderThisArg, setRequestHeaderArgArray) {
                                        let [header, value] = setRequestHeaderArgArray,
                                            xhrInfo = setRequestHeaderThisArg[SENTRY_XHR_DATA_KEY];
                                        return (
                                            xhrInfo && core.isString(header) && core.isString(value) && (xhrInfo.request_headers[header.toLowerCase()] = value),
                                            originalSetRequestHeader.apply(setRequestHeaderThisArg, setRequestHeaderArgArray)
                                        );
                                    },
                                })),
                                originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray)
                            );
                        },
                    })),
                        (xhrproto.send = new Proxy(xhrproto.send, {
                            apply(originalSend, sendThisArg, sendArgArray) {
                                let sentryXhrData = sendThisArg[SENTRY_XHR_DATA_KEY];
                                if (!sentryXhrData) return originalSend.apply(sendThisArg, sendArgArray);
                                void 0 !== sendArgArray[0] && (sentryXhrData.body = sendArgArray[0]);
                                let handlerData = { startTimestamp: 1e3 * core.timestampInSeconds(), xhr: sendThisArg };
                                return (core.triggerHandlers("xhr", handlerData), originalSend.apply(sendThisArg, sendArgArray));
                            },
                        })));
                }
                ((exports.SENTRY_XHR_DATA_KEY = SENTRY_XHR_DATA_KEY),
                    (exports.addXhrInstrumentationHandler = function (handler) {
                        (core.addHandler("xhr", handler), core.maybeInstrument("xhr", instrumentXHR));
                    }),
                    (exports.instrumentXHR = instrumentXHR));
            }