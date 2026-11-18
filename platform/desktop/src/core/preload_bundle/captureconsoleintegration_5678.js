5678(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    _exports = __webpack_require__(6082),
                    console1 = __webpack_require__(6110),
                    integration = __webpack_require__(5579),
                    debugLogger = __webpack_require__(2533),
                    misc = __webpack_require__(735),
                    severity = __webpack_require__(2548),
                    string = __webpack_require__(2634),
                    worldwide = __webpack_require__(3712);
                exports.captureConsoleIntegration = integration.defineIntegration((options = {}) => {
                    let levels = options.levels || debugLogger.CONSOLE_LEVELS,
                        handled = options.handled ?? !0;
                    return {
                        name: "CaptureConsole",
                        setup(client) {
                            "console" in worldwide.GLOBAL_OBJ &&
                                console1.addConsoleInstrumentationHandler(({ args, level }) => {
                                    var args1, level1, handled1;
                                    let severityLevel, syntheticException, captureContext;
                                    currentScopes.getClient() === client &&
                                        levels.includes(level) &&
                                        ((args1 = args),
                                        (level1 = level),
                                        (handled1 = handled),
                                        (severityLevel = severity.severityLevelFromString(level1)),
                                        (syntheticException = Error()),
                                        (captureContext = { level: severity.severityLevelFromString(level1), extra: { arguments: args1 } }),
                                        currentScopes.withScope((scope) => {
                                            if (
                                                (scope.addEventProcessor(
                                                    (event) => (
                                                        (event.logger = "console"),
                                                        misc.addExceptionMechanism(event, { handled: handled1, type: "auto.core.capture_console" }),
                                                        event
                                                    ),
                                                ),
                                                "assert" === level1)
                                            ) {
                                                if (!args1[0]) {
                                                    let message = `Assertion failed: ${string.safeJoin(args1.slice(1), " ") || "console.assert"}`;
                                                    (scope.setExtra("arguments", args1.slice(1)),
                                                        scope.captureMessage(message, severityLevel, { captureContext, syntheticException }));
                                                }
                                                return;
                                            }
                                            let error = args1.find((arg) => arg instanceof Error);
                                            if (error) return void _exports.captureException(error, captureContext);
                                            let message = string.safeJoin(args1, " ");
                                            scope.captureMessage(message, severityLevel, { captureContext, syntheticException });
                                        }));
                                });
                        },
                    };
                });
            }