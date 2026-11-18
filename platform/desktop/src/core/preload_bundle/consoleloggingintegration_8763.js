8763(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    console1 = __webpack_require__(6110),
                    integration = __webpack_require__(5579),
                    semanticAttributes = __webpack_require__(3052),
                    debugLogger = __webpack_require__(2533),
                    internal = __webpack_require__(8388),
                    utils = __webpack_require__(2444),
                    DEFAULT_ATTRIBUTES = { [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.log.console" };
                exports.consoleLoggingIntegration = integration.defineIntegration((options = {}) => {
                    let levels = options.levels || debugLogger.CONSOLE_LEVELS;
                    return {
                        name: "ConsoleLogs",
                        setup(client) {
                            let { enableLogs, normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = client.getOptions();
                            if (!enableLogs) {
                                debugBuild.DEBUG_BUILD && debugLogger.debug.warn("`enableLogs` is not enabled, ConsoleLogs integration disabled");
                                return;
                            }
                            console1.addConsoleInstrumentationHandler(({ args, level }) => {
                                if (currentScopes.getClient() !== client || !levels.includes(level)) return;
                                let firstArg = args[0],
                                    followingArgs = args.slice(1);
                                if ("assert" === level) {
                                    if (!firstArg) {
                                        let assertionMessage =
                                            followingArgs.length > 0
                                                ? `Assertion failed: ${utils.formatConsoleArgs(followingArgs, normalizeDepth, normalizeMaxBreadth)}`
                                                : "Assertion failed";
                                        internal._INTERNAL_captureLog({ level: "error", message: assertionMessage, attributes: DEFAULT_ATTRIBUTES });
                                    }
                                    return;
                                }
                                let isLevelLog = "log" === level,
                                    shouldGenerateTemplate = args.length > 1 && "string" == typeof args[0] && !utils.hasConsoleSubstitutions(args[0]),
                                    attributes = { ...DEFAULT_ATTRIBUTES, ...(shouldGenerateTemplate ? utils.createConsoleTemplateAttributes(firstArg, followingArgs) : {}) };
                                internal._INTERNAL_captureLog({
                                    level: isLevelLog ? "info" : level,
                                    message: utils.formatConsoleArgs(args, normalizeDepth, normalizeMaxBreadth),
                                    severityNumber: isLevelLog ? 10 : void 0,
                                    attributes,
                                });
                            });
                        },
                    };
                });
            }