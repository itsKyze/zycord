1488(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let currentScopes = __webpack_require__(7121),
                    internal = __webpack_require__(8388),
                    utils = __webpack_require__(2444),
                    is = __webpack_require__(7431),
                    normalize = __webpack_require__(4496),
                    DEFAULT_CAPTURED_LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"],
                    CONSOLA_TYPE_TO_LOG_SEVERITY_LEVEL_MAP = {
                        silent: "trace",
                        fatal: "fatal",
                        error: "error",
                        warn: "warn",
                        log: "info",
                        info: "info",
                        success: "info",
                        fail: "error",
                        ready: "info",
                        start: "info",
                        box: "info",
                        debug: "debug",
                        trace: "trace",
                        verbose: "debug",
                        critical: "fatal",
                        notice: "info",
                    },
                    CONSOLA_LEVEL_TO_LOG_SEVERITY_LEVEL_MAP = { 0: "fatal", 1: "warn", 2: "info", 3: "info", 4: "debug", 5: "trace" };
                exports.createConsolaReporter = function (options = {}) {
                    let levels = new Set(options.levels ?? DEFAULT_CAPTURED_LEVELS),
                        providedClient = options.client;
                    return {
                        log(logObj) {
                            let { type, level, message: consolaMessage, args, tag, date: _date, ...rest } = logObj,
                                client = providedClient || currentScopes.getClient();
                            if (!client) return;
                            let logSeverityLevel = (function (type, level) {
                                if ("verbose" === type) return "debug";
                                if ("silent" === type) return "trace";
                                if (type) {
                                    let mappedLevel = CONSOLA_TYPE_TO_LOG_SEVERITY_LEVEL_MAP[type];
                                    if (mappedLevel) return mappedLevel;
                                }
                                if ("number" == typeof level) {
                                    let mappedLevel = CONSOLA_LEVEL_TO_LOG_SEVERITY_LEVEL_MAP[level];
                                    if (mappedLevel) return mappedLevel;
                                }
                                return "info";
                            })(type, level);
                            if (!levels.has(logSeverityLevel)) return;
                            let { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = client.getOptions(),
                                attributes = {};
                            for (let [key, value] of Object.entries(rest)) attributes[key] = normalize.normalize(value, normalizeDepth, normalizeMaxBreadth);
                            ((attributes["sentry.origin"] = "auto.log.consola"),
                                tag && (attributes["consola.tag"] = tag),
                                type && (attributes["consola.type"] = type),
                                null != level && "number" == typeof level && (attributes["consola.level"] = level));
                            let extractionResult = (function (extractionResult, normalizeDepth, normalizeMaxBreadth) {
                                let { message, attributes, messageTemplate, messageParameters } = extractionResult,
                                    messageParamAttributes = {};
                                if (messageTemplate && messageParameters)
                                    for (let [key, value] of Object.entries(utils.createConsoleTemplateAttributes(messageTemplate, messageParameters)))
                                        messageParamAttributes[key] = key.startsWith("sentry.message.parameter.")
                                            ? normalize.normalize(value, normalizeDepth, normalizeMaxBreadth)
                                            : value;
                                else
                                    messageParameters &&
                                        messageParameters.length > 0 &&
                                        messageParameters.forEach((arg, index) => {
                                            messageParamAttributes[`sentry.message.parameter.${index}`] = normalize.normalize(arg, normalizeDepth, normalizeMaxBreadth);
                                        });
                                return { message: message, attributes: { ...normalize.normalize(attributes, normalizeDepth, normalizeMaxBreadth), ...messageParamAttributes } };
                            })(
                                (function (args, normalizeDepth, normalizeMaxBreadth) {
                                    if (!args?.length) return { message: "" };
                                    let message = utils.formatConsoleArgs(args, normalizeDepth, normalizeMaxBreadth),
                                        firstArg = args[0];
                                    if (is.isPlainObject(firstArg)) {
                                        let remainingArgsStartIndex = "string" == typeof args[1] ? 2 : 1;
                                        return { message, attributes: firstArg, messageParameters: args.slice(remainingArgsStartIndex) };
                                    }
                                    {
                                        let followingArgs = args.slice(1),
                                            shouldAddTemplateAttr = followingArgs.length > 0 && "string" == typeof firstArg && !utils.hasConsoleSubstitutions(firstArg);
                                        return {
                                            message,
                                            messageTemplate: shouldAddTemplateAttr ? firstArg : void 0,
                                            messageParameters: shouldAddTemplateAttr ? followingArgs : void 0,
                                        };
                                    }
                                })(args, normalizeDepth, normalizeMaxBreadth),
                                normalizeDepth,
                                normalizeMaxBreadth,
                            );
                            (extractionResult?.attributes && Object.assign(attributes, extractionResult.attributes),
                                internal._INTERNAL_captureLog({
                                    level: logSeverityLevel,
                                    message: extractionResult?.message || consolaMessage || (args && utils.formatConsoleArgs(args, normalizeDepth, normalizeMaxBreadth)) || "",
                                    attributes,
                                }));
                        },
                    };
                };
            }