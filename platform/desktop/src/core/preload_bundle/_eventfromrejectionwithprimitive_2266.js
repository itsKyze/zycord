2266(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    eventbuilder = __webpack_require__(2081),
                    helpers = __webpack_require__(9445),
                    globalHandlersIntegration = core.defineIntegration((options = {}) => {
                        let _options = { onerror: !0, onunhandledrejection: !0, ...options };
                        return {
                            name: "GlobalHandlers",
                            setupOnce() {
                                Error.stackTraceLimit = 50;
                            },
                            setup(client) {
                                var client1, client2;
                                (_options.onerror &&
                                    ((client1 = client),
                                    core.addGlobalErrorInstrumentationHandler((data) => {
                                        var event, url, lineno, colno;
                                        let e,
                                            ev,
                                            ev0,
                                            ev0s,
                                            ev0sf,
                                            { stackParser, attachStacktrace } = getOptions();
                                        if (core.getClient() !== client1 || helpers.shouldIgnoreOnError()) return;
                                        let { msg, url: url1, line, column, error } = data,
                                            event1 =
                                                ((event = eventbuilder.eventFromUnknownInput(stackParser, error || msg, void 0, attachStacktrace, !1)),
                                                (url = url1),
                                                (lineno = line),
                                                (colno = column),
                                                0 ===
                                                    (ev0sf = (ev0s = (ev0 = (ev = (e = event.exception = event.exception || {}).values = e.values || [])[0] =
                                                        ev[0] || {}).stacktrace =
                                                        ev0.stacktrace || {}).frames =
                                                        ev0s.frames || []).length &&
                                                    ev0sf.push({
                                                        colno,
                                                        lineno,
                                                        filename:
                                                            (function (url) {
                                                                if (core.isString(url) && 0 !== url.length)
                                                                    return url.startsWith("data:") ? `<${core.stripDataUrlContent(url, !1)}>` : url;
                                                            })(url) ?? core.getLocationHref(),
                                                        function: core.UNKNOWN_FUNCTION,
                                                        in_app: !0,
                                                    }),
                                                event);
                                        ((event1.level = "error"),
                                            core.captureEvent(event1, { originalException: error, mechanism: { handled: !1, type: "auto.browser.global_handlers.onerror" } }));
                                    }),
                                    globalHandlerLog("onerror")),
                                    _options.onunhandledrejection &&
                                        ((client2 = client),
                                        core.addGlobalUnhandledRejectionInstrumentationHandler((e) => {
                                            let { stackParser, attachStacktrace } = getOptions();
                                            if (core.getClient() !== client2 || helpers.shouldIgnoreOnError()) return;
                                            let error = _getUnhandledRejectionError(e),
                                                event = core.isPrimitive(error)
                                                    ? _eventFromRejectionWithPrimitive(error)
                                                    : eventbuilder.eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, !0);
                                            ((event.level = "error"),
                                                core.captureEvent(event, {
                                                    originalException: error,
                                                    mechanism: { handled: !1, type: "auto.browser.global_handlers.onunhandledrejection" },
                                                }));
                                        }),
                                        globalHandlerLog("onunhandledrejection")));
                            },
                        };
                    });
                function _getUnhandledRejectionError(error) {
                    if (core.isPrimitive(error)) return error;
                    try {
                        if ("reason" in error) return error.reason;
                        if ("detail" in error && "reason" in error.detail) return error.detail.reason;
                    } catch {}
                    return error;
                }
                function _eventFromRejectionWithPrimitive(reason) {
                    return { exception: { values: [{ type: "UnhandledRejection", value: `Non-Error promise rejection captured with value: ${String(reason)}` }] } };
                }
                function globalHandlerLog(type) {
                    debugBuild.DEBUG_BUILD && core.debug.log(`Global Handler attached: ${type}`);
                }
                function getOptions() {
                    let client = core.getClient();
                    return client?.getOptions() || { stackParser: () => [], attachStacktrace: !1 };
                }
                ((exports._eventFromRejectionWithPrimitive = _eventFromRejectionWithPrimitive),
                    (exports._getUnhandledRejectionError = _getUnhandledRejectionError),
                    (exports.globalHandlersIntegration = globalHandlersIntegration));
            }