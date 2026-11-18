6833(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let index = __webpack_require__(3401),
                    carrier = __webpack_require__(5),
                    currentScopes = __webpack_require__(7121),
                    debugBuild = __webpack_require__(3695),
                    semanticAttributes = __webpack_require__(3052),
                    baggage = __webpack_require__(3549),
                    debugLogger = __webpack_require__(2533),
                    handleCallbackErrors = __webpack_require__(8797),
                    hasSpansEnabled = __webpack_require__(3781),
                    shouldIgnoreSpan = __webpack_require__(7332),
                    hasSpanStreamingEnabled = __webpack_require__(9807),
                    parseSampleRate = __webpack_require__(8068),
                    propagationContext = __webpack_require__(8034),
                    randomSafeContext = __webpack_require__(638),
                    spanOnScope = __webpack_require__(8740),
                    spanUtils = __webpack_require__(470),
                    tracing = __webpack_require__(2093),
                    dynamicSamplingContext = __webpack_require__(241),
                    logSpans = __webpack_require__(8101),
                    sampling = __webpack_require__(2543),
                    sentryNonRecordingSpan = __webpack_require__(3832),
                    sentrySpan = __webpack_require__(6637),
                    spanstatus = __webpack_require__(2232),
                    utils = __webpack_require__(3033),
                    SUPPRESS_TRACING_KEY = "__SENTRY_SUPPRESS_TRACING__";
                function withActiveSpan(span, callback) {
                    let acs = getAcs();
                    return acs.withActiveSpan
                        ? acs.withActiveSpan(span, callback)
                        : currentScopes.withScope((scope) => (spanOnScope._setSpanForScope(scope, span || void 0), callback(scope)));
                }
                function startNewTrace(callback) {
                    let acs = getAcs();
                    return acs.startNewTrace
                        ? acs.startNewTrace(callback)
                        : currentScopes.withScope(
                              (scope) => (
                                  scope.setPropagationContext({ traceId: propagationContext.generateTraceId(), sampleRand: randomSafeContext.safeMathRandom() }),
                                  debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Starting a new trace with id ${scope.getPropagationContext().traceId}`),
                                  withActiveSpan(null, callback)
                              ),
                          );
                }
                function createChildOrRootSpan({ parentSpan, spanArguments, forceTransaction, scope }) {
                    var client, spanArguments1;
                    let span, ignoreSpans;
                    if (!hasSpansEnabled.hasSpansEnabled()) {
                        let span = new sentryNonRecordingSpan.SentryNonRecordingSpan();
                        if (forceTransaction || !parentSpan) {
                            let dsc = { sampled: "false", sample_rate: "0", transaction: spanArguments.name, ...dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) };
                            dynamicSamplingContext.freezeDscOnSpan(span, dsc);
                        }
                        return span;
                    }
                    let client1 = currentScopes.getClient();
                    if (
                        ((client = client1),
                        (spanArguments1 = spanArguments),
                        (ignoreSpans = client?.getOptions().ignoreSpans),
                        client &&
                            hasSpanStreamingEnabled.hasSpanStreamingEnabled(client) &&
                            ignoreSpans?.length &&
                            shouldIgnoreSpan.shouldIgnoreSpan(
                                { description: spanArguments1.name || "", op: spanArguments1.attributes?.[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP] || spanArguments1.op },
                                ignoreSpans,
                            ))
                    )
                        return (
                            _isTracingSuppressed(scope) || client1?.recordDroppedEvent("ignored", "span"),
                            new sentryNonRecordingSpan.SentryNonRecordingSpan({
                                dropReason: "ignored",
                                traceId: parentSpan?.spanContext().traceId ?? scope.getPropagationContext().traceId,
                            })
                        );
                    let isolationScope = currentScopes.getIsolationScope();
                    if (parentSpan && !forceTransaction)
                        ((span = (function (parentSpan, scope, spanArguments) {
                            let { spanId, traceId } = parentSpan.spanContext(),
                                isTracingSuppressed = _isTracingSuppressed(scope),
                                sampled = !isTracingSuppressed && spanUtils.spanIsSampled(parentSpan),
                                childSpan = sampled
                                    ? new sentrySpan.SentrySpan({ ...spanArguments, parentSpanId: spanId, traceId, sampled })
                                    : new sentryNonRecordingSpan.SentryNonRecordingSpan({ traceId });
                            spanUtils.addChildSpanToSpan(parentSpan, childSpan);
                            let client = currentScopes.getClient();
                            return (
                                client &&
                                    (hasSpanStreamingEnabled.hasSpanStreamingEnabled(client) &&
                                        childSpan instanceof sentryNonRecordingSpan.SentryNonRecordingSpan &&
                                        (parentSpan instanceof sentryNonRecordingSpan.SentryNonRecordingSpan && parentSpan.dropReason
                                            ? ((childSpan.dropReason = parentSpan.dropReason), client.recordDroppedEvent(parentSpan.dropReason, "span"))
                                            : isTracingSuppressed || ((childSpan.dropReason = "sample_rate"), client.recordDroppedEvent("sample_rate", "span"))),
                                    client.emit("spanStart", childSpan),
                                    spanArguments.endTimestamp && (client.emit("spanEnd", childSpan), client.emit("afterSpanEnd", childSpan))),
                                childSpan
                            );
                        })(parentSpan, scope, spanArguments)),
                            spanUtils.addChildSpanToSpan(parentSpan, span));
                    else if (parentSpan) {
                        let dsc = dynamicSamplingContext.getDynamicSamplingContextFromSpan(parentSpan),
                            { traceId, spanId: parentSpanId } = parentSpan.spanContext(),
                            parentSampled = spanUtils.spanIsSampled(parentSpan);
                        ((span = _startRootSpan({ traceId, parentSpanId, ...spanArguments }, scope, parentSampled)), dynamicSamplingContext.freezeDscOnSpan(span, dsc));
                    } else {
                        let { traceId, dsc, parentSpanId, sampled: parentSampled } = { ...isolationScope.getPropagationContext(), ...scope.getPropagationContext() };
                        ((span = _startRootSpan({ traceId, parentSpanId, ...spanArguments }, scope, parentSampled)), dsc && dynamicSamplingContext.freezeDscOnSpan(span, dsc));
                    }
                    return (logSpans.logSpanStart(span), utils.setCapturedScopesOnSpan(span, scope, isolationScope), span);
                }
                function parseSentrySpanArguments(options) {
                    let initialCtx = { isStandalone: (options.experimental || {}).standalone, ...options };
                    if (options.startTime) {
                        let ctx = { ...initialCtx };
                        return ((ctx.startTimestamp = spanUtils.spanTimeInputToSeconds(options.startTime)), delete ctx.startTime, ctx);
                    }
                    return initialCtx;
                }
                function getAcs() {
                    let carrier$1 = carrier.getMainCarrier();
                    return index.getAsyncContextStrategy(carrier$1);
                }
                function _startRootSpan(spanArguments, scope, parentSampled) {
                    let client = currentScopes.getClient(),
                        options = client?.getOptions() || {},
                        { name = "" } = spanArguments,
                        mutableSpanSamplingData = { spanAttributes: { ...spanArguments.attributes }, spanName: name, parentSampled };
                    client?.emit("beforeSampling", mutableSpanSamplingData, { decision: !1 });
                    let finalParentSampled = mutableSpanSamplingData.parentSampled ?? parentSampled,
                        finalAttributes = mutableSpanSamplingData.spanAttributes,
                        currentPropagationContext = scope.getPropagationContext(),
                        isTracingSuppressed = _isTracingSuppressed(scope),
                        [sampled, sampleRate, localSampleRateWasApplied] = isTracingSuppressed
                            ? [!1]
                            : sampling.sampleSpan(
                                  options,
                                  {
                                      name,
                                      parentSampled: finalParentSampled,
                                      attributes: finalAttributes,
                                      parentSampleRate: parseSampleRate.parseSampleRate(currentPropagationContext.dsc?.sample_rate),
                                  },
                                  currentPropagationContext.sampleRand,
                              ),
                        rootSpan = new sentrySpan.SentrySpan({
                            ...spanArguments,
                            attributes: {
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom",
                                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: void 0 !== sampleRate && localSampleRateWasApplied ? sampleRate : void 0,
                                ...finalAttributes,
                            },
                            sampled,
                        });
                    return (
                        sampled ||
                            !client ||
                            isTracingSuppressed ||
                            (debugBuild.DEBUG_BUILD && debugLogger.debug.log("[Tracing] Discarding root span because its trace was not chosen to be sampled."),
                            client.recordDroppedEvent("sample_rate", hasSpanStreamingEnabled.hasSpanStreamingEnabled(client) ? "span" : "transaction")),
                        client && client.emit("spanStart", rootSpan),
                        rootSpan
                    );
                }
                function getParentSpan(scope, customParentSpan) {
                    if (customParentSpan) return customParentSpan;
                    if (null === customParentSpan) return;
                    let span = spanOnScope._getSpanForScope(scope);
                    if (!span) return;
                    let client = currentScopes.getClient();
                    return (client ? client.getOptions() : {}).parentSpanIsAlwaysRootSpan ? spanUtils.getRootSpan(span) : span;
                }
                function getActiveSpanWrapper(parentSpan) {
                    return void 0 !== parentSpan ? (callback) => withActiveSpan(parentSpan, callback) : (callback) => callback();
                }
                function _isIgnoredSpan(span) {
                    return span instanceof sentryNonRecordingSpan.SentryNonRecordingSpan && "ignored" === span.dropReason;
                }
                function _isTracingSuppressed(scope) {
                    return !0 === scope.getScopeData().sdkProcessingMetadata[SUPPRESS_TRACING_KEY];
                }
                ((exports.continueTrace = (options, callback) => {
                    let carrier$1 = carrier.getMainCarrier(),
                        acs = index.getAsyncContextStrategy(carrier$1);
                    if (acs.continueTrace) return acs.continueTrace(options, callback);
                    let { sentryTrace, baggage: baggage$1 } = options,
                        client = currentScopes.getClient(),
                        incomingDsc = baggage.baggageHeaderToDynamicSamplingContext(baggage$1);
                    return client && !tracing.shouldContinueTrace(client, incomingDsc?.org_id)
                        ? startNewTrace(callback)
                        : currentScopes.withScope((scope) => {
                              let propagationContext = tracing.propagationContextFromHeaders(sentryTrace, baggage$1);
                              return (scope.setPropagationContext(propagationContext), spanOnScope._setSpanForScope(scope, void 0), callback());
                          });
                }),
                    (exports.startInactiveSpan = function (options) {
                        let acs = getAcs();
                        if (acs.startInactiveSpan) return acs.startInactiveSpan(options);
                        let spanArguments = parseSentrySpanArguments(options),
                            { forceTransaction, parentSpan: customParentSpan } = options;
                        return (
                            options.scope
                                ? (callback) => currentScopes.withScope(options.scope, callback)
                                : void 0 !== customParentSpan
                                  ? (callback) => withActiveSpan(customParentSpan, callback)
                                  : (callback) => callback()
                        )(() => {
                            let scope = currentScopes.getCurrentScope(),
                                parentSpan = getParentSpan(scope, customParentSpan),
                                client = currentScopes.getClient();
                            return options.onlyIfParent && !parentSpan
                                ? (client?.recordDroppedEvent("no_parent_span", "span"), new sentryNonRecordingSpan.SentryNonRecordingSpan())
                                : createChildOrRootSpan({ parentSpan, spanArguments, forceTransaction, scope });
                        });
                    }),
                    (exports.startNewTrace = startNewTrace),
                    (exports.startSpan = function (options, callback) {
                        let acs = getAcs();
                        if (acs.startSpan) return acs.startSpan(options, callback);
                        let spanArguments = parseSentrySpanArguments(options),
                            { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options,
                            customForkedScope = customScope?.clone();
                        return currentScopes.withScope(customForkedScope, () =>
                            getActiveSpanWrapper(customParentSpan)(() => {
                                let scope = currentScopes.getCurrentScope(),
                                    parentSpan = getParentSpan(scope, customParentSpan),
                                    client = currentScopes.getClient(),
                                    missingRequiredParent = options.onlyIfParent && !parentSpan,
                                    activeSpan = missingRequiredParent
                                        ? new sentryNonRecordingSpan.SentryNonRecordingSpan()
                                        : createChildOrRootSpan({ parentSpan, spanArguments, forceTransaction, scope });
                                return (
                                    missingRequiredParent && client?.recordDroppedEvent("no_parent_span", "span"),
                                    (_isIgnoredSpan(activeSpan) && parentSpan) || spanOnScope._setSpanForScope(scope, activeSpan),
                                    handleCallbackErrors.handleCallbackErrors(
                                        () => callback(activeSpan),
                                        () => {
                                            let { status } = spanUtils.spanToJSON(activeSpan);
                                            activeSpan.isRecording() &&
                                                (!status || "ok" === status) &&
                                                activeSpan.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
                                        },
                                        () => {
                                            activeSpan.end();
                                        },
                                    )
                                );
                            }),
                        );
                    }),
                    (exports.startSpanManual = function (options, callback) {
                        let acs = getAcs();
                        if (acs.startSpanManual) return acs.startSpanManual(options, callback);
                        let spanArguments = parseSentrySpanArguments(options),
                            { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options,
                            customForkedScope = customScope?.clone();
                        return currentScopes.withScope(customForkedScope, () =>
                            getActiveSpanWrapper(customParentSpan)(() => {
                                let scope = currentScopes.getCurrentScope(),
                                    parentSpan = getParentSpan(scope, customParentSpan),
                                    missingRequiredParent = options.onlyIfParent && !parentSpan,
                                    activeSpan = missingRequiredParent
                                        ? new sentryNonRecordingSpan.SentryNonRecordingSpan()
                                        : createChildOrRootSpan({ parentSpan, spanArguments, forceTransaction, scope });
                                return (
                                    missingRequiredParent && currentScopes.getClient()?.recordDroppedEvent("no_parent_span", "span"),
                                    (_isIgnoredSpan(activeSpan) && parentSpan) || spanOnScope._setSpanForScope(scope, activeSpan),
                                    handleCallbackErrors.handleCallbackErrors(
                                        () => callback(activeSpan, () => activeSpan.end()),
                                        () => {
                                            let { status } = spanUtils.spanToJSON(activeSpan);
                                            activeSpan.isRecording() &&
                                                (!status || "ok" === status) &&
                                                activeSpan.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: "internal_error" });
                                        },
                                    )
                                );
                            }),
                        );
                    }),
                    (exports.suppressTracing = function (callback) {
                        let acs = getAcs();
                        return acs.suppressTracing
                            ? acs.suppressTracing(callback)
                            : currentScopes.withScope((scope) => {
                                  scope.setSDKProcessingMetadata({ [SUPPRESS_TRACING_KEY]: !0 });
                                  let res = callback();
                                  return (scope.setSDKProcessingMetadata({ [SUPPRESS_TRACING_KEY]: void 0 }), res);
                              });
                    }),
                    (exports.withActiveSpan = withActiveSpan));
            }