2081(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777);
                function exceptionFromError(stackParser, ex) {
                    let frames = parseStackFrames(stackParser, ex),
                        exception = { type: extractType(ex), value: extractMessage(ex) };
                    return (
                        frames.length && (exception.stacktrace = { frames }),
                        void 0 === exception.type && "" === exception.value && (exception.value = "Unrecoverable error caught"),
                        exception
                    );
                }
                function eventFromError(stackParser, ex) {
                    return { exception: { values: [exceptionFromError(stackParser, ex)] } };
                }
                function parseStackFrames(stackParser, ex) {
                    var ex1, ex2;
                    let stacktrace = ex.stacktrace || ex.stack || "",
                        skipLines = (ex1 = ex) && reactMinifiedRegexp.test(ex1.message) ? 1 : 0,
                        framesToPop = "number" == typeof (ex2 = ex).framesToPop ? ex2.framesToPop : 0;
                    try {
                        return stackParser(stacktrace, skipLines, framesToPop);
                    } catch {}
                    return [];
                }
                let reactMinifiedRegexp = /Minified React error #\d+;/i;
                function isWebAssemblyException(exception) {
                    return "u" > typeof WebAssembly && void 0 !== WebAssembly.Exception && exception instanceof WebAssembly.Exception;
                }
                function extractType(ex) {
                    let name = ex?.name;
                    return !name && isWebAssemblyException(ex)
                        ? ex.message && Array.isArray(ex.message) && 2 == ex.message.length
                            ? ex.message[0]
                            : "WebAssembly.Exception"
                        : name;
                }
                function extractMessage(ex) {
                    let message = ex?.message;
                    return isWebAssemblyException(ex)
                        ? Array.isArray(ex.message) && 2 == ex.message.length
                            ? ex.message[1]
                            : "wasm exception"
                        : message
                          ? message.error && "string" == typeof message.error.message
                              ? core._INTERNAL_enhanceErrorWithSentryInfo(message.error)
                              : core._INTERNAL_enhanceErrorWithSentryInfo(ex)
                          : "No error message";
                }
                function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
                    let event;
                    if (core.isErrorEvent(exception) && exception.error) return eventFromError(stackParser, exception.error);
                    if (core.isDOMError(exception) || core.isDOMException(exception)) {
                        if ("stack" in exception) event = eventFromError(stackParser, exception);
                        else {
                            let name = exception.name || (core.isDOMError(exception) ? "DOMError" : "DOMException"),
                                message = exception.message ? `${name}: ${exception.message}` : name;
                            ((event = eventFromString(stackParser, message, syntheticException, attachStacktrace)), core.addExceptionTypeValue(event, message));
                        }
                        return ("code" in exception && (event.tags = { ...event.tags, "DOMException.code": `${exception.code}` }), event);
                    }
                    return core.isError(exception)
                        ? eventFromError(stackParser, exception)
                        : (core.isPlainObject(exception) || core.isEvent(exception)
                              ? (event = (function (stackParser, exception, syntheticException, isUnhandledRejection) {
                                    let client = core.getClient(),
                                        normalizeDepth = client?.getOptions().normalizeDepth,
                                        errorFromProp = Object.values(exception).find((v) => v instanceof Error),
                                        extra = { __serialized__: core.normalizeToSize(exception, normalizeDepth) };
                                    if (errorFromProp) return { exception: { values: [exceptionFromError(stackParser, errorFromProp)] }, extra };
                                    let event = {
                                        exception: {
                                            values: [
                                                {
                                                    type: core.isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
                                                    value: (function (exception, { isUnhandledRejection }) {
                                                        let keys = core.extractExceptionKeysForMessage(exception),
                                                            captureType = isUnhandledRejection ? "promise rejection" : "exception";
                                                        if (core.isErrorEvent(exception))
                                                            return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
                                                        if (core.isEvent(exception)) {
                                                            let className = (function (obj) {
                                                                try {
                                                                    let prototype = Object.getPrototypeOf(obj);
                                                                    return prototype ? prototype.constructor.name : void 0;
                                                                } catch {}
                                                            })(exception);
                                                            return `Event \`${className}\` (type=${exception.type}) captured as ${captureType}`;
                                                        }
                                                        return `Object captured as ${captureType} with keys: ${keys}`;
                                                    })(exception, { isUnhandledRejection }),
                                                },
                                            ],
                                        },
                                        extra,
                                    };
                                    if (syntheticException) {
                                        let frames = parseStackFrames(stackParser, syntheticException);
                                        frames.length && (event.exception.values[0].stacktrace = { frames });
                                    }
                                    return event;
                                })(stackParser, exception, syntheticException, isUnhandledRejection))
                              : ((event = eventFromString(stackParser, exception, syntheticException, attachStacktrace)),
                                core.addExceptionTypeValue(event, `${exception}`, void 0)),
                          core.addExceptionMechanism(event, { synthetic: !0 }),
                          event);
                }
                function eventFromString(stackParser, message, syntheticException, attachStacktrace) {
                    let event = {};
                    if (attachStacktrace && syntheticException) {
                        let frames = parseStackFrames(stackParser, syntheticException);
                        (frames.length && (event.exception = { values: [{ value: message, stacktrace: { frames } }] }), core.addExceptionMechanism(event, { synthetic: !0 }));
                    }
                    if (core.isParameterizedString(message)) {
                        let { __sentry_template_string__, __sentry_template_values__ } = message;
                        return ((event.logentry = { message: __sentry_template_string__, params: __sentry_template_values__ }), event);
                    }
                    return ((event.message = message), event);
                }
                ((exports.eventFromException = function (stackParser, exception, hint, attachStacktrace) {
                    let event = eventFromUnknownInput(stackParser, exception, hint?.syntheticException || void 0, attachStacktrace);
                    return (core.addExceptionMechanism(event), (event.level = "error"), hint?.event_id && (event.event_id = hint.event_id), core.resolvedSyncPromise(event));
                }),
                    (exports.eventFromMessage = function (stackParser, message, level = "info", hint, attachStacktrace) {
                        let event = eventFromString(stackParser, message, hint?.syntheticException || void 0, attachStacktrace);
                        return ((event.level = level), hint?.event_id && (event.event_id = hint.event_id), core.resolvedSyncPromise(event));
                    }),
                    (exports.eventFromUnknownInput = eventFromUnknownInput),
                    (exports.exceptionFromError = exceptionFromError),
                    (exports.extractMessage = extractMessage),
                    (exports.extractType = extractType));
            }