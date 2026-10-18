1357(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    integration = __webpack_require__(5579),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    normalize = __webpack_require__(4496),
                    object = __webpack_require__(4204),
                    string = __webpack_require__(2634);
                exports.extraErrorDataIntegration = integration.defineIntegration((options = {}) => {
                    let { depth = 3, captureErrorCause = !0 } = options;
                    return {
                        name: "ExtraErrorData",
                        processEvent(event, hint, client) {
                            let { maxValueLength } = client.getOptions();
                            return (function (event, hint = {}, depth, captureErrorCause, maxValueLength) {
                                if (!hint.originalException || !is.isError(hint.originalException)) return event;
                                let exceptionName = hint.originalException.name || hint.originalException.constructor.name,
                                    errorData = (function _extractErrorData(error, captureErrorCause, maxValueLength) {
                                        try {
                                            let nativeKeys = ["name", "message", "stack", "line", "column", "fileName", "lineNumber", "columnNumber", "toJSON"],
                                                extraErrorInfo = {};
                                            for (let key of Object.keys(error)) {
                                                if (-1 !== nativeKeys.indexOf(key)) continue;
                                                let value = error[key];
                                                extraErrorInfo[key] =
                                                    is.isError(value) || "string" == typeof value
                                                        ? maxValueLength
                                                            ? string.truncate(`${value}`, maxValueLength)
                                                            : `${value}`
                                                        : value;
                                            }
                                            if (
                                                (captureErrorCause &&
                                                    void 0 !== error.cause &&
                                                    (is.isError(error.cause)
                                                        ? (extraErrorInfo.cause = {
                                                              [error.cause.name || error.cause.constructor.name]: _extractErrorData(error.cause, !1, maxValueLength),
                                                          })
                                                        : (extraErrorInfo.cause = error.cause)),
                                                "function" == typeof error.toJSON)
                                            ) {
                                                let serializedError = error.toJSON();
                                                for (let key of Object.keys(serializedError)) {
                                                    let value = serializedError[key];
                                                    extraErrorInfo[key] = is.isError(value) ? value.toString() : value;
                                                }
                                            }
                                            return extraErrorInfo;
                                        } catch (oO) {
                                            debugBuild.DEBUG_BUILD && debugLogger.debug.error("Unable to extract extra data from the Error object:", oO);
                                        }
                                        return null;
                                    })(hint.originalException, captureErrorCause, maxValueLength);
                                if (errorData) {
                                    let contexts = { ...event.contexts },
                                        normalizedErrorData = normalize.normalize(errorData, depth);
                                    return (
                                        is.isPlainObject(normalizedErrorData) &&
                                            (object.addNonEnumerableProperty(normalizedErrorData, "__sentry_skip_normalization__", !0),
                                            (contexts[exceptionName] = normalizedErrorData)),
                                        { ...event, contexts }
                                    );
                                }
                                return event;
                            })(event, hint, depth, captureErrorCause, maxValueLength);
                        },
                    };
                });
            }