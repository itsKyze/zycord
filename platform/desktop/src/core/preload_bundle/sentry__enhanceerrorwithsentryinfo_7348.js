7348(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let is = __webpack_require__(7431),
                    misc = __webpack_require__(735),
                    normalize = __webpack_require__(4496),
                    object = __webpack_require__(4204);
                function parseStackFrames(stackParser, error) {
                    return stackParser(error.stack || "", 1);
                }
                function _enhanceErrorWithSentryInfo(error) {
                    return is.isError(error) && "__sentry_fetch_url_host__" in error && "string" == typeof error.__sentry_fetch_url_host__
                        ? `${error.message} (${error.__sentry_fetch_url_host__})`
                        : error.message;
                }
                function exceptionFromError(stackParser, error) {
                    let exception = { type: error.name || error.constructor.name, value: _enhanceErrorWithSentryInfo(error) },
                        frames = parseStackFrames(stackParser, error);
                    return (frames.length && (exception.stacktrace = { frames }), exception);
                }
                ((exports._enhanceErrorWithSentryInfo = _enhanceErrorWithSentryInfo),
                    (exports.eventFromMessage = function (stackParser, message, level = "info", hint, attachStacktrace) {
                        let event = { event_id: hint?.event_id, level };
                        if (attachStacktrace && hint?.syntheticException) {
                            let frames = parseStackFrames(stackParser, hint.syntheticException);
                            frames.length && ((event.exception = { values: [{ value: message, stacktrace: { frames } }] }), misc.addExceptionMechanism(event, { synthetic: !0 }));
                        }
                        if (is.isParameterizedString(message)) {
                            let { __sentry_template_string__, __sentry_template_values__ } = message;
                            return ((event.logentry = { message: __sentry_template_string__, params: __sentry_template_values__ }), event);
                        }
                        return ((event.message = message), event);
                    }),
                    (exports.eventFromUnknownInput = function (client, stackParser, exception, hint) {
                        let mechanism = (hint?.data && hint.data.mechanism) || { handled: !0, type: "generic" },
                            [ex, extras] = (function (client, mechanism, exception, hint) {
                                if (is.isError(exception)) return [exception, void 0];
                                if (((mechanism.synthetic = !0), is.isPlainObject(exception))) {
                                    let normalizeDepth = client?.getOptions().normalizeDepth,
                                        extras = { __serialized__: normalize.normalizeToSize(exception, normalizeDepth) },
                                        errorFromProp = (function (obj) {
                                            for (let prop in obj)
                                                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                                                    let value = obj[prop];
                                                    if (value instanceof Error) return value;
                                                }
                                        })(exception);
                                    if (errorFromProp) return [errorFromProp, extras];
                                    let message = (function (exception) {
                                            if ("name" in exception && "string" == typeof exception.name) {
                                                let message = `'${exception.name}' captured as exception`;
                                                return (
                                                    "message" in exception && "string" == typeof exception.message && (message += ` with message '${exception.message}'`),
                                                    message
                                                );
                                            }
                                            if ("message" in exception && "string" == typeof exception.message) return exception.message;
                                            let keys = object.extractExceptionKeysForMessage(exception);
                                            if (is.isErrorEvent(exception)) return `Event \`ErrorEvent\` captured as exception with message \`${exception.message}\``;
                                            let className = (function (obj) {
                                                try {
                                                    let prototype = Object.getPrototypeOf(obj);
                                                    return prototype ? prototype.constructor.name : void 0;
                                                } catch {}
                                            })(exception);
                                            return `${className && "Object" !== className ? `'${className}'` : "Object"} captured as exception with keys: ${keys}`;
                                        })(exception),
                                        ex = hint?.syntheticException || Error(message);
                                    return ((ex.message = message), [ex, extras]);
                                }
                                let ex = hint?.syntheticException || Error(exception);
                                return ((ex.message = `${exception}`), [ex, void 0]);
                            })(client, mechanism, exception, hint),
                            event = { exception: { values: [exceptionFromError(stackParser, ex)] } };
                        return (
                            extras && (event.extra = extras),
                            misc.addExceptionTypeValue(event, void 0, void 0),
                            misc.addExceptionMechanism(event, mechanism),
                            { ...event, event_id: hint?.event_id }
                        );
                    }),
                    (exports.exceptionFromError = exceptionFromError),
                    (exports.parseStackFrames = parseStackFrames));
            }