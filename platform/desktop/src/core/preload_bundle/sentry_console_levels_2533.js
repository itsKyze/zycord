2533(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let carrier = __webpack_require__(5),
                    debugBuild = __webpack_require__(3695),
                    worldwide = __webpack_require__(3712),
                    originalConsoleMethods = {};
                function consoleSandbox(callback) {
                    if (!("console" in worldwide.GLOBAL_OBJ)) return callback();
                    let console1 = worldwide.GLOBAL_OBJ.console,
                        wrappedFuncs = {},
                        wrappedLevels = Object.keys(originalConsoleMethods);
                    wrappedLevels.forEach((level) => {
                        let originalConsoleMethod = originalConsoleMethods[level];
                        ((wrappedFuncs[level] = console1[level]), (console1[level] = originalConsoleMethod));
                    });
                    try {
                        return callback();
                    } finally {
                        wrappedLevels.forEach((level) => {
                            console1[level] = wrappedFuncs[level];
                        });
                    }
                }
                function isEnabled() {
                    return _getLoggerSettings().enabled;
                }
                function _maybeLog(level, ...args) {
                    debugBuild.DEBUG_BUILD &&
                        isEnabled() &&
                        consoleSandbox(() => {
                            worldwide.GLOBAL_OBJ.console[level](`Sentry Logger [${level}]:`, ...args);
                        });
                }
                function _getLoggerSettings() {
                    return debugBuild.DEBUG_BUILD ? carrier.getGlobalSingleton("loggerSettings", () => ({ enabled: !1 })) : { enabled: !1 };
                }
                ((exports.CONSOLE_LEVELS = ["debug", "info", "warn", "error", "log", "assert", "trace"]),
                    (exports.consoleSandbox = consoleSandbox),
                    (exports.debug = {
                        enable: function () {
                            _getLoggerSettings().enabled = !0;
                        },
                        disable: function () {
                            _getLoggerSettings().enabled = !1;
                        },
                        isEnabled,
                        log: function (...args) {
                            _maybeLog("log", ...args);
                        },
                        warn: function (...args) {
                            _maybeLog("warn", ...args);
                        },
                        error: function (...args) {
                            _maybeLog("error", ...args);
                        },
                    }),
                    (exports.originalConsoleMethods = originalConsoleMethods));
            }