6110(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugLogger = __webpack_require__(2533),
                    object = __webpack_require__(4204),
                    worldwide = __webpack_require__(3712),
                    handlers = __webpack_require__(7130);
                function instrumentConsole() {
                    "console" in worldwide.GLOBAL_OBJ &&
                        debugLogger.CONSOLE_LEVELS.forEach(function (level) {
                            level in worldwide.GLOBAL_OBJ.console &&
                                object.fill(worldwide.GLOBAL_OBJ.console, level, function (originalConsoleMethod) {
                                    return (
                                        (debugLogger.originalConsoleMethods[level] = originalConsoleMethod),
                                        function (...args) {
                                            handlers.triggerHandlers("console", { args, level });
                                            let log = debugLogger.originalConsoleMethods[level];
                                            log?.apply(worldwide.GLOBAL_OBJ.console, args);
                                        }
                                    );
                                });
                        });
                }
                exports.addConsoleInstrumentationHandler = function (handler) {
                    let type = "console";
                    (handlers.addHandler(type, handler), handlers.maybeInstrument(type, instrumentConsole));
                };
            }