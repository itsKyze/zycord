7130(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    debugLogger = __webpack_require__(2533),
                    stacktrace = __webpack_require__(7970),
                    handlers = {},
                    instrumented = {};
                ((exports.addHandler = function (type, handler) {
                    ((handlers[type] = handlers[type] || []), handlers[type].push(handler));
                }),
                    (exports.maybeInstrument = function (type, instrumentFn) {
                        if (!instrumented[type]) {
                            instrumented[type] = !0;
                            try {
                                instrumentFn();
                            } catch (e) {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.error(`Error while instrumenting ${type}`, e);
                            }
                        }
                    }),
                    (exports.resetInstrumentationHandlers = function () {
                        Object.keys(handlers).forEach((key) => {
                            handlers[key] = void 0;
                        });
                    }),
                    (exports.triggerHandlers = function (type, data) {
                        let typeHandlers = type && handlers[type];
                        if (typeHandlers)
                            for (let handler of typeHandlers)
                                try {
                                    handler(data);
                                } catch (e) {
                                    debugBuild.DEBUG_BUILD &&
                                        debugLogger.debug.error(
                                            `Error while triggering instrumentation handler.
Type: ${type}
Name: ${stacktrace.getFunctionName(handler)}
Error:`,
                                            e,
                                        );
                                }
                    }));
            }