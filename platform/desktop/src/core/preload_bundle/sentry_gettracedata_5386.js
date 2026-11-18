5386(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let index = __webpack_require__(3401),
                    carrier = __webpack_require__(5),
                    currentScopes = __webpack_require__(7121),
                    _exports = __webpack_require__(6082),
                    debugLogger = __webpack_require__(2533),
                    spanUtils = __webpack_require__(470),
                    dynamicSamplingContext = __webpack_require__(241),
                    baggage = __webpack_require__(3549),
                    tracing = __webpack_require__(2093);
                exports.getTraceData = function (options = {}) {
                    let client = options.client || currentScopes.getClient();
                    if (!_exports.isEnabled() || !client) return {};
                    let carrier$1 = carrier.getMainCarrier(),
                        acs = index.getAsyncContextStrategy(carrier$1);
                    if (acs.getTraceData) return acs.getTraceData(options);
                    let scope = options.scope || currentScopes.getCurrentScope(),
                        span = options.span || spanUtils.getActiveSpan();
                    if (!span && currentScopes.hasExternalPropagationContext()) return {};
                    let sentryTrace = span
                            ? spanUtils.spanToTraceHeader(span)
                            : (function (scope) {
                                  let { traceId, sampled, propagationSpanId } = scope.getPropagationContext();
                                  return tracing.generateSentryTraceHeader(traceId, propagationSpanId, sampled);
                              })(scope),
                        dsc = span ? dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) : dynamicSamplingContext.getDynamicSamplingContextFromScope(client, scope),
                        baggage$1 = baggage.dynamicSamplingContextToSentryBaggageHeader(dsc);
                    if (!tracing.TRACEPARENT_REGEXP.test(sentryTrace)) return (debugLogger.debug.warn("Invalid sentry-trace data. Cannot generate trace data"), {});
                    let traceData = { "sentry-trace": sentryTrace, baggage: baggage$1 };
                    return (
                        options.propagateTraceparent &&
                            (traceData.traceparent = span
                                ? spanUtils.spanToTraceparentHeader(span)
                                : (function (scope) {
                                      let { traceId, sampled, propagationSpanId } = scope.getPropagationContext();
                                      return tracing.generateTraceparentHeader(traceId, propagationSpanId, sampled);
                                  })(scope)),
                        traceData
                    );
                };
            }