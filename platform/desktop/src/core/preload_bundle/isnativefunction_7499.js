7499(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    WINDOW = __webpack_require__(3712).GLOBAL_OBJ;
                function _isFetchSupported() {
                    if (!("fetch" in WINDOW)) return !1;
                    try {
                        return (new Headers(), new Request("data:,"), new Response(), !0);
                    } catch {
                        return !1;
                    }
                }
                function isNativeFunction(func) {
                    return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
                }
                ((exports.isNativeFunction = isNativeFunction),
                    (exports.supportsDOMError = function () {
                        try {
                            return (new DOMError(""), !0);
                        } catch {
                            return !1;
                        }
                    }),
                    (exports.supportsDOMException = function () {
                        try {
                            return (new DOMException(""), !0);
                        } catch {
                            return !1;
                        }
                    }),
                    (exports.supportsErrorEvent = function () {
                        try {
                            return (new ErrorEvent(""), !0);
                        } catch {
                            return !1;
                        }
                    }),
                    (exports.supportsFetch = _isFetchSupported),
                    (exports.supportsHistory = function () {
                        return "history" in WINDOW && !!WINDOW.history;
                    }),
                    (exports.supportsNativeFetch = function () {
                        if ("string" == typeof EdgeRuntime) return !0;
                        if (!_isFetchSupported()) return !1;
                        if (isNativeFunction(WINDOW.fetch)) return !0;
                        let result = !1,
                            doc = WINDOW.document;
                        if (doc && "function" == typeof doc.createElement)
                            try {
                                let sandbox = doc.createElement("iframe");
                                ((sandbox.hidden = !0),
                                    doc.head.appendChild(sandbox),
                                    sandbox.contentWindow?.fetch && (result = isNativeFunction(sandbox.contentWindow.fetch)),
                                    doc.head.removeChild(sandbox));
                            } catch (err) {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
                            }
                        return result;
                    }),
                    (exports.supportsReferrerPolicy = function () {
                        if (!_isFetchSupported()) return !1;
                        try {
                            return (new Request("_", { referrerPolicy: "origin" }), !0);
                        } catch {
                            return !1;
                        }
                    }),
                    (exports.supportsReportingObserver = function () {
                        return "ReportingObserver" in WINDOW;
                    }));
            }