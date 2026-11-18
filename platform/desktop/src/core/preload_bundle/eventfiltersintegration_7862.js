7862(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    integration = __webpack_require__(5579),
                    debugLogger = __webpack_require__(2533),
                    eventUtils = __webpack_require__(5766),
                    misc = __webpack_require__(735),
                    string = __webpack_require__(2634),
                    DEFAULT_IGNORE_ERRORS = [
                        /^Script error\.?$/,
                        /^Javascript error: Script error\.? on line 0$/,
                        /^ResizeObserver loop completed with undelivered notifications.$/,
                        /^Cannot redefine property: googletag$/,
                        /^Can't find variable: gmo$/,
                        /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
                        /can't redefine non-configurable property "solana"/,
                        /vv\(\)\.getRestrictions is not a function/,
                        /Can't find variable: _AutofillCallbackHandler/,
                        /Object Not Found Matching Id:\d+, MethodName:simulateEvent/,
                        /^Java exception was raised during method invocation$/,
                    ],
                    eventFiltersIntegration = integration.defineIntegration((options = {}) => {
                        let mergedOptions;
                        return {
                            name: "EventFilters",
                            setup(client) {
                                mergedOptions = _mergeOptions(options, client.getOptions());
                            },
                            processEvent: (event, _hint, client) => (
                                mergedOptions || (mergedOptions = _mergeOptions(options, client.getOptions())),
                                !(function (event, options) {
                                    if (event.type) {
                                        if (
                                            "transaction" === event.type &&
                                            (function (event, ignoreTransactions) {
                                                if (!ignoreTransactions?.length) return !1;
                                                let name = event.transaction;
                                                return !!name && string.stringMatchesSomePattern(name, ignoreTransactions);
                                            })(event, options.ignoreTransactions)
                                        )
                                            return (
                                                debugBuild.DEBUG_BUILD &&
                                                    debugLogger.debug.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${misc.getEventDescription(event)}`),
                                                !0
                                            );
                                    } else {
                                        var event1, ignoreErrors, event2;
                                        if (
                                            ((event1 = event),
                                            (ignoreErrors = options.ignoreErrors),
                                            ignoreErrors?.length &&
                                                eventUtils.getPossibleEventMessages(event1).some((message) => string.stringMatchesSomePattern(message, ignoreErrors)))
                                        )
                                            return (
                                                debugBuild.DEBUG_BUILD &&
                                                    debugLogger.debug.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${misc.getEventDescription(event)}`),
                                                !0
                                            );
                                        if (
                                            ((event2 = event),
                                            event2.exception?.values?.length &&
                                                !event2.message &&
                                                !event2.exception.values.some((value) => value.stacktrace || (value.type && "Error" !== value.type) || value.value))
                                        )
                                            return (
                                                debugBuild.DEBUG_BUILD &&
                                                    debugLogger.debug.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${misc.getEventDescription(event)}`),
                                                !0
                                            );
                                        if (
                                            (function (event, denyUrls) {
                                                if (!denyUrls?.length) return !1;
                                                let url = _getEventFilterUrl(event);
                                                return !!url && string.stringMatchesSomePattern(url, denyUrls);
                                            })(event, options.denyUrls)
                                        )
                                            return (
                                                debugBuild.DEBUG_BUILD &&
                                                    debugLogger.debug.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${misc.getEventDescription(event)}.
Url: ${_getEventFilterUrl(event)}`),
                                                !0
                                            );
                                        if (
                                            !(function (event, allowUrls) {
                                                if (!allowUrls?.length) return !0;
                                                let url = _getEventFilterUrl(event);
                                                return !url || string.stringMatchesSomePattern(url, allowUrls);
                                            })(event, options.allowUrls)
                                        )
                                            return (
                                                debugBuild.DEBUG_BUILD &&
                                                    debugLogger.debug.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${misc.getEventDescription(event)}.
Url: ${_getEventFilterUrl(event)}`),
                                                !0
                                            );
                                    }
                                    return !1;
                                })(event, mergedOptions)
                                    ? event
                                    : null
                            ),
                        };
                    }),
                    inboundFiltersIntegration = integration.defineIntegration((options = {}) => ({ ...eventFiltersIntegration(options), name: "InboundFilters" }));
                function _mergeOptions(internalOptions = {}, clientOptions = {}) {
                    return {
                        allowUrls: [...(internalOptions.allowUrls || []), ...(clientOptions.allowUrls || [])],
                        denyUrls: [...(internalOptions.denyUrls || []), ...(clientOptions.denyUrls || [])],
                        ignoreErrors: [
                            ...(internalOptions.ignoreErrors || []),
                            ...(clientOptions.ignoreErrors || []),
                            ...(internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS),
                        ],
                        ignoreTransactions: [...(internalOptions.ignoreTransactions || []), ...(clientOptions.ignoreTransactions || [])],
                    };
                }
                function _getEventFilterUrl(event) {
                    try {
                        let rootException = [...(event.exception?.values ?? [])]
                                .reverse()
                                .find((value) => value.mechanism?.parent_id === void 0 && value.stacktrace?.frames?.length),
                            frames = rootException?.stacktrace?.frames;
                        return frames
                            ? (function (frames = []) {
                                  for (let i = frames.length - 1; i >= 0; i--) {
                                      let frame = frames[i];
                                      if (frame && "<anonymous>" !== frame.filename && "[native code]" !== frame.filename) return frame.filename || null;
                                  }
                                  return null;
                              })(frames)
                            : null;
                    } catch {
                        return (debugBuild.DEBUG_BUILD && debugLogger.debug.error(`Cannot extract url for event ${misc.getEventDescription(event)}`), null);
                    }
                }
                ((exports.eventFiltersIntegration = eventFiltersIntegration), (exports.inboundFiltersIntegration = inboundFiltersIntegration));
            }