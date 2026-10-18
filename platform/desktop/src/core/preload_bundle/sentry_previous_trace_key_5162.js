5162(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let core = __webpack_require__(5777),
                    debugBuild = __webpack_require__(7734),
                    helpers = __webpack_require__(9445);
                (__webpack_require__(4794),
                    __webpack_require__(3369),
                    __webpack_require__(2928),
                    __webpack_require__(9163),
                    __webpack_require__(884),
                    __webpack_require__(2857),
                    __webpack_require__(2266),
                    __webpack_require__(385),
                    __webpack_require__(5830),
                    __webpack_require__(7226));
                let PREVIOUS_TRACE_KEY = "sentry_previous_trace",
                    PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE = "sentry.previous_trace";
                function addPreviousTraceSpanLink(previousTraceInfo, span, oldPropagationContext) {
                    let spanJson = core.spanToJSON(span),
                        updatedPreviousTraceInfo = {
                            spanContext: span.spanContext(),
                            startTimestamp: spanJson.start_timestamp,
                            sampleRate: (function () {
                                try {
                                    return Number(oldPropagationContext.dsc?.sample_rate) ?? Number(spanJson.data?.[core.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]);
                                } catch {
                                    return 0;
                                }
                            })(),
                            sampleRand: oldPropagationContext.sampleRand,
                        };
                    if (!previousTraceInfo) return updatedPreviousTraceInfo;
                    let previousTraceSpanCtx = previousTraceInfo.spanContext;
                    return previousTraceSpanCtx.traceId === spanJson.trace_id
                        ? previousTraceInfo
                        : (Date.now() / 1e3 - previousTraceInfo.startTimestamp <= 3600 &&
                              (debugBuild.DEBUG_BUILD &&
                                  core.debug.log(
                                      `Adding previous_trace \`${JSON.stringify(previousTraceSpanCtx)}\` link to span \`${JSON.stringify({ op: spanJson.op, ...span.spanContext() })}\``,
                                  ),
                              span.addLink({ context: previousTraceSpanCtx, attributes: { [core.SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE]: "previous_trace" } }),
                              span.setAttribute(
                                  PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE,
                                  `${previousTraceSpanCtx.traceId}-${previousTraceSpanCtx.spanId}-${+!!spanContextSampled(previousTraceSpanCtx)}`,
                              )),
                          updatedPreviousTraceInfo);
                }
                function storePreviousTraceInSessionStorage(previousTraceInfo) {
                    try {
                        helpers.WINDOW.sessionStorage.setItem(PREVIOUS_TRACE_KEY, JSON.stringify(previousTraceInfo));
                    } catch (e) {
                        debugBuild.DEBUG_BUILD && core.debug.warn("Could not store previous trace in sessionStorage", e);
                    }
                }
                function getPreviousTraceFromSessionStorage() {
                    try {
                        let previousTraceInfo = helpers.WINDOW.sessionStorage?.getItem(PREVIOUS_TRACE_KEY);
                        return JSON.parse(previousTraceInfo);
                    } catch {
                        return;
                    }
                }
                function spanContextSampled(ctx) {
                    return 1 === ctx.traceFlags;
                }
                ((exports.PREVIOUS_TRACE_KEY = PREVIOUS_TRACE_KEY),
                    (exports.PREVIOUS_TRACE_MAX_DURATION = 3600),
                    (exports.PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE = PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE),
                    (exports.addPreviousTraceSpanLink = addPreviousTraceSpanLink),
                    (exports.getPreviousTraceFromSessionStorage = getPreviousTraceFromSessionStorage),
                    (exports.linkTraces = function (client, { linkPreviousTrace, consistentTraceSampling }) {
                        let useSessionStorage = "session-storage" === linkPreviousTrace,
                            inMemoryPreviousTraceInfo = useSessionStorage ? getPreviousTraceFromSessionStorage() : void 0;
                        client.on("spanStart", (span) => {
                            if (core.getRootSpan(span) !== span) return;
                            let oldPropagationContext = core.getCurrentScope().getPropagationContext();
                            ((inMemoryPreviousTraceInfo = addPreviousTraceSpanLink(inMemoryPreviousTraceInfo, span, oldPropagationContext)),
                                useSessionStorage && storePreviousTraceInSessionStorage(inMemoryPreviousTraceInfo));
                        });
                        let isFirstTraceOnPageload = !0;
                        consistentTraceSampling &&
                            client.on("beforeSampling", (mutableSamplingContextData) => {
                                if (!inMemoryPreviousTraceInfo) return;
                                let scope = core.getCurrentScope(),
                                    currentPropagationContext = scope.getPropagationContext();
                                if (isFirstTraceOnPageload && currentPropagationContext.parentSpanId) {
                                    isFirstTraceOnPageload = !1;
                                    return;
                                }
                                (scope.setPropagationContext({
                                    ...currentPropagationContext,
                                    dsc: {
                                        ...currentPropagationContext.dsc,
                                        sample_rate: String(inMemoryPreviousTraceInfo.sampleRate),
                                        sampled: String(spanContextSampled(inMemoryPreviousTraceInfo.spanContext)),
                                    },
                                    sampleRand: inMemoryPreviousTraceInfo.sampleRand,
                                }),
                                    (mutableSamplingContextData.parentSampled = spanContextSampled(inMemoryPreviousTraceInfo.spanContext)),
                                    (mutableSamplingContextData.parentSampleRate = inMemoryPreviousTraceInfo.sampleRate),
                                    (mutableSamplingContextData.spanAttributes = {
                                        ...mutableSamplingContextData.spanAttributes,
                                        [core.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE]: inMemoryPreviousTraceInfo.sampleRate,
                                    }));
                            });
                    }),
                    (exports.spanContextSampled = spanContextSampled),
                    (exports.storePreviousTraceInSessionStorage = storePreviousTraceInSessionStorage));
            }